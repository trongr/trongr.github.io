def meanrateforget(rates, gamma):
    mu = rates[0]
    for r in rates:
        mu = (1 - gamma) * mu + gamma * r
        print mu, r

def main():
    meanrateforget([1.0/20, 1.0/30, 1.0/10, 1.0/20, 1.0/40, 1.0/20, 1.0/30, 1.0], 0.01)

if __name__ == "__main__":
    main()
