from convnet import *
import yaml

def main():
    net = NeuralNet(yaml.load(open(sys.argv[1])))
    net.Load()

    net.LoadData(test=True)
    test_loss, test_acc = net.Validate(dataset='test')

    net.LoadData(test=False)
    val_loss, val_acc     = net.Validate(dataset='val')
    train_loss, train_acc = net.Validate(dataset='train')

    print 'CE      : Train %.5f Val %.5f Test %.5f' % (train_loss, val_loss, test_loss)
    print 'Accuracy: Train %.5f Val %.5f Test %.5f' % (train_acc, val_acc, test_acc)

if __name__ == '__main__':
    main()
