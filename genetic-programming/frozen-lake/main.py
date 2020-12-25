"""
Evolving solution to Frozen Lake Game.
"""

import random
import time
import numpy as np
import gym

# from gym import wrappers


def genRandomPolicy():
    """
    Each policy is represented as a list of length 16 containing integers 0-3.
    There are 16 cells in the frozen lake, and 4 possible actions to take at
    each cell. This might not be the best way to represent a policy, because the
    environment changes, and this essentially "hard-codes" what to do at each
    cell. We need some kind of indirection / giving the agent the ability to see
    beyond its current cell.
    """
    return np.random.choice(4, size=((16)))


def initPopulation(numPolicies):
    """
    Initialize a random set of policies. Returns the list of policies.
    """
    return [genRandomPolicy() for _ in range(numPolicies)]


def runEpisode(env, policy, numSteps=100, showResult=False):
    """
    Runs the policy for numSteps. Each step taken gives a reward. Returns the
    total reward.
    """
    totalReward = 0
    observation = env.reset()

    for step in range(numSteps):
        # env.render() # Toggle to see game

        action = policy[observation]
        observation, reward, done, _ = env.step(action)
        totalReward += reward

        if done:
            if showResult:
                print("Episode finished after {} steps.".format(step))
            break

    return totalReward


def evaluatePolicy(env, policy, numEpisodes=100):
    """
    Runs this policy on numEpisodes. Returns the policy's score (number), i.e.
    the average reward per episode.
    """
    totalRewards = 0.0
    for _ in range(numEpisodes):
        totalRewards += runEpisode(env, policy)
    return totalRewards / numEpisodes


def evaluatePolicies(env, population):
    """
    Evaluate policies in population. Returns list of policy scores in the same
    order as the policies in population.
    """
    return [evaluatePolicy(env, policy) for policy in population]


def crossover(policy1, policy2):
    """
    Randomly choose a gene from policy1 and policy2, i.e. for each gene, flip a
    fair coin and choose from policy1 if head and from policy2 if tail. Return a
    new policy.
    """
    newPolicy = policy1.copy()
    for i in range(16):
        rand = np.random.uniform()
        if rand > 0.5:
            newPolicy[i] = policy2[i]
    return newPolicy


def rankPolicies(policyScores):
    """
    Return a list of indices to policies based on their policyScores, highest
    ranked policies first. E.g. if

        policyScores = [0, 0.1, 0.05],
                        0  1    2

    then

        rankPolicies(policyScores) === [1, 2, 0].
    """
    return list(reversed(np.argsort(policyScores)))


def getElites(population, policyScores, numElites):
    """
    Return the top numElites policies in population.
    """
    policyRanks = rankPolicies(policyScores)
    return [population[x] for x in policyRanks[:numElites]]


def randomParent(population, selectProbs):
    """
    Choose a single policy from population where selectProbs says how likely each
    policy is to be selected.
    """
    POPULATION_SIZE = len(population)
    randomIndex = np.random.choice(range(POPULATION_SIZE), p=selectProbs)
    return population[randomIndex]


def breedChildFromRandomParents(population, selectProbs):
    """
    Choose a random father and mother from the population, and cross them over
    to produce a child.
    """
    father = randomParent(population, selectProbs)
    mother = randomParent(population, selectProbs)
    child = crossover(father, mother)
    return child


def mutate(policy, p=0.05):
    """
    Randomly mutate each gene in policy with probability p, i.e. for each gene,
    flip a coin that has probability p of turning up head, and mutate that gene
    (randomly choosing a new gene) if head, OTW don't mutate the gene.
    """
    newPolicy = policy.copy()
    for i in range(16):
        rand = np.random.uniform()
        if rand < p:
            newPolicy[i] = np.random.choice(4)
    return newPolicy


def mutateChildren(children):
    """
    Mutate each child in children.
    """
    return [mutate(child) for child in children]


def getMutants(population, policyScores, NUM_CHILDREN):
    """
    Return list of mutated policies.
    """
    selectProbs = np.array(policyScores) / np.sum(policyScores)

    children = [
        breedChildFromRandomParents(population, selectProbs)
        for _ in range(NUM_CHILDREN)
    ]

    mutants = mutateChildren(children)
    return mutants


def evolve(env, NUM_ITERATIONS):
    """
    Evolve and return the best policy.
    """
    POPULATION_SIZE = 100
    NUM_ELITES = 5
    NUM_CHILDREN = POPULATION_SIZE - NUM_ELITES

    start = time.time()

    population = initPopulation(POPULATION_SIZE)

    for iteration in range(NUM_ITERATIONS):
        policyScores = evaluatePolicies(env, population)
        elites = getElites(population, policyScores, NUM_ELITES)
        mutants = getMutants(population, policyScores, NUM_CHILDREN)
        population = elites + mutants

        print("Generation %d: max score = %0.2f" % (iteration, max(policyScores)))

    policyScores = evaluatePolicies(env, population)
    bestPolicy = population[np.argmax(policyScores)]
    bestPolicyScore = np.max(policyScores)

    totalTime = time.time() - start
    print("Best policy score: %0.2f. Time taken: %4.4f" % (bestPolicyScore, totalTime))

    return bestPolicy


def main():
    """
    Run the experiment. Evolve the best policy and evaluate it.
    """
    RANDOM_SEED = 1234
    NUM_ITERATIONS = 20
    NUM_TEST_ITERATIONS = 100

    random.seed(RANDOM_SEED)
    np.random.seed(RANDOM_SEED)
    env = gym.make("FrozenLake-v0")
    env.seed(RANDOM_SEED)

    bestPolicy = evolve(env, NUM_ITERATIONS)
    # env = wrappers.Monitor(env, "./tmp/frozenlake1", force=True)
    bestPolicyScore = evaluatePolicy(env, bestPolicy, NUM_TEST_ITERATIONS)
    print("Best policy score on test run: %0.2f" % (bestPolicyScore))

    env.close()


if __name__ == "__main__":
    main()
