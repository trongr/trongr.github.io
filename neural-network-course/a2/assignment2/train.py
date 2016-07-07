from convnet import *
import yaml

def main():
    net = NeuralNet(yaml.load(open(sys.argv[1])))
    net.LoadData()
    net.Train()

if __name__ == '__main__':
    np.random.seed(42)
    main()
