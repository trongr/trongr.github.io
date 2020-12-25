Genetic algo: https://medium.com/@gabogarza/simple-genetic-algorithm-6d6aafcc310a


Book: Cartesian Genetic Programming by Julian F. Miller

https://www.reddit.com/r/reinforcementlearning/

https://lilianweng.github.io/lil-log/
https://lilianweng.github.io/lil-log/2018/04/08/policy-gradient-algorithms.html

https://github.com/udacity/deep-learning/blob/master/reinforcement/Q-learning-cart.ipynb

https://www.youtube.com/watch?v=q2ZOEFAaaI0

https://towardsdatascience.com/cartpole-introduction-to-reinforcement-learning-ed0eb5b58288

Simple RL practical:

https://www.youtube.com/watch?v=gWNeMs1Fb8I&index=3&list=PLXO45tsB95cIplu-fLMpUEEZTwrDNh6Ba

https://github.com/MorvanZhou/Reinforcement-learning-with-tensorflow

https://medium.com/@jonathan_hui/rl-policy-gradients-explained-9b13b688b146

https://jaromiru.com/2016/09/27/lets-make-a-dqn-theory/

Machine learning tuts
https://www.youtube.com/watch?v=frbX2JH-_Aw&list=PLD0F06AA0D2E8FFBA&index=19

https://github.com/MorvanZhou/Reinforcement-learning-with-tensorflow/blob/master/contents/1_command_line_reinforcement_learning/treasure_on_right.py

Another RL course: https://www.youtube.com/watch?v=hzcaVWkyOzk&index=2&list=PLkFD6_40KJIxJMR-j5A1mkxK26gh_qg37&t=0s

    Home page: http://rail.eecs.berkeley.edu/deeprlcourse/

https://www.sanyamkapoor.com/machine-learning/policy-gradients-nutshell/

Udacity course: https://classroom.udacity.com/courses/ud600/lessons/4100878601/concepts/6382590580923

Udacity deep learning foundations nanodegree code: https://github.com/udacity/deep-learning

ELU layer

https://github.com/yanpanlau/Keras-FlappyBird

Use replay buffer idea in LSTM for music: keep a collection of music samples and
randomly sample from it to feed the network. Variation in bundling the samples
together should also allow the network to have a more consistent style in each
bundle, i.e. instead of randomly sampling the buffer, we randomly sample a set
of snippets in the same style, and feed the network a few songs from it, then
randomly sample another set of snippets in the same style, and so on.

PyTorch tutorial

prioritized experience replay

https://medium.com/@jonathan_hui/rl-dqn-deep-q-network-e207751f7ae4

RL lecture from stanford: https://www.youtube.com/watch?v=lvoHnicueoE&t=167s

More advanced:

    https://medium.com/@awjuliani/simple-reinforcement-learning-with-tensorflow-part-4-deep-q-networks-and-beyond-8438a3e2b8df

    RL algorithms: https://github.com/awjuliani/DeepRL-Agents

DQN

Unity AI tutorials
https://unity3d.com/machine-learning

https://www.oreilly.com/learning/introduction-to-reinforcement-learning-and-openai-gym

    http://testerstories.com/2017/12/the-tester-role-in-machine-learning-part-2/

    https://keon.io/deep-q-learning/

    https://lilianweng.github.io/lil-log/2018/05/05/implementing-deep-reinforcement-learning-models.html

    p 19 Reinforcement learning book. Sutton and Barto: file:///Users/trong/readings/ai/reinforcement%20learning%20sutton.pdf

    https://medium.com/@ashish_fagna/understanding-openai-gym-25c79c06eccb
    https://medium.com/emergent-future/simple-reinforcement-learning-with-tensorflow-part-0-q-learning-with-tables-and-neural-networks-d195264329d0

David Silver's course:

    https://www.youtube.com/watch?v=Nd1-UUMVfz4&index=3&list=PLweqsIcZJac7PfiyYMvYiHfOFPg9Um82B

    Slides: http://www0.cs.ucl.ac.uk/staff/d.silver/web/Teaching.html

John Schulman 1: Deep Reinforcement Learning: https://www.youtube.com/watch?v=aUrX-rP_ss4&list=PLjKEIQlKCTZYN3CYBlj8r58SbNorobqcp

TODO. Try code. More info: https://imaddabbura.github.io/blog/data%20science/2018/03/31/epsilon-Greedy-Algorithm.html


More reading: MDP extensions

# OPENAI GYM

openai gym tutorial

    Run this example and study it: https://github.com/openai/gym/blob/master/gym/envs/toy_text/frozen_lake.py


# LOGS

2018-11-02 Friday

ContextualBandit.py: notebook:

https://gist.github.com/awjuliani/b5d83fcf3bf2898656be5730f098e08b#file-contextualpolicy-ipynb

https://medium.com/emergent-future/simple-reinforcement-learning-with-tensorflow-part-1-5-contextual-bandits-bff01d1aad9c

2018-11-13 Tuesday

    https://github.com/simoninithomas/Deep_reinforcement_learning_Course/blob/master/Q%20learning/Taxi-v2/Q%20Learning%20with%20OpenAI%20Taxi-v2%20video%20version.ipynb

2018-11-24 Saturday

    HelloDoom.py

    https://github.com/simoninithomas/Deep_reinforcement_learning_Course/blob/master/Deep%20Q%20Learning/Doom/Deep%20Q%20learning%20with%20Doom.ipynb

    https://github.com/simoninithomas/Deep_reinforcement_learning_Course/blob/master/Deep%20Q%20Learning/Space%20Invaders/DQN%20Atari%20Space%20Invaders.ipynb

    https://github.com/simoninithomas/Deep_reinforcement_learning_Course/blob/master/Dueling%20Double%20DQN%20with%20PER%20and%20fixed-q%20targets/Dueling%20Deep%20Q%20Learning%20with%20Doom%20%28%2B%20double%20DQNs%20and%20Prioritized%20Experience%20Replay%29.ipynb

2019-01-24 Thursday

https://simoninithomas.github.io/Deep_reinforcement_learning_Course/

    Get sonic the hedgehog from steam.

    Try mxnet first with cartpole, then with pong: https://github.com/merrymercy/mxnet-the-straight-dope/blob/115cb4b98577375b5b697a3e6ccb04a1a0ca5928/chapter17_deep-reinforcement-learning/policy-gradient.ipynb

        Then go back to this tutorial to add General advantage estimation to pong: https://minpy.readthedocs.io/en/latest/tutorial/rl_policy_gradient_tutorial/rl_policy_gradient.html
    https://towardsdatascience.com/lite-intro-into-reinforcement-learning-857ca5c924d9
    https://gist.github.com/tomtx/ae247680c0ba0ae3180996b198199300#file-q-learning-ann-ipynb
    https://medium.com/apache-mxnet/what-is-reinforcement-learning-anyways-a59719d34660

    Course website: https://simoninithomas.github.io/Deep_reinforcement_learning_Course/


    Revisit this once you have more background on GAE (generalized advantage estimation): https://github.com/simoninithomas/Deep_reinforcement_learning_Course/tree/master/A2C%20with%20Sonic%20the%20Hedgehog

    Do this later.  Doom Deathmatch with policy gradient: https://github.com/simoninithomas/Deep_reinforcement_learning_Course/tree/master/Policy%20Gradients/Doom%20Deathmatch

    Once you finish this course, go back and reimplement some of the simpler agents with deep networks

    RL pong from pixels: http://karpathy.github.io/2016/05/31/rl/


2019-02-26 Tuesday

https://medium.com/emergent-future/simple-reinforcement-learning-with-tensorflow-part-0-q-learning-with-tables-and-neural-networks-d195264329d0

    https://medium.com/emergent-future/simple-reinforcement-learning-with-tensorflow-part-8-asynchronous-actor-critic-agents-a3c-c88f72a5e9f2

    Implementation: https://github.com/awjuliani/DeepRL-Agents/blob/master/A3C-Doom.ipynb


A3C


    More examples: https://github.com/Anjum48/rl-examples/tree/56aca982fcf4426c02aa7e5fb58a4f8affab8020/a3c

https://medium.com/@gabogarza/deep-reinforcement-learning-policy-gradients-8f6df70404e6
