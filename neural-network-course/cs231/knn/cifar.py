import sys
import numpy as np
import cPickle

# see https://www.cs.toronto.edu/~kriz/cifar.html for dataset and
# format
def unpickle(file):
    fo = open(file, 'rb')
    dict = cPickle.load(fo)
    fo.close()
    return dict

def testUnpickle():
    file = sys.argv[1]
    d = unpickle(file)
    for key in d:
        print "%s" % key
    # print d["label_names"]

def loadCifar():
    file = sys.argv[1]
    d = unpickle(file)
    print d["data"].shape[0]

def testReshape():
    # reshaping a 2 x 2 x 2 x 3 = 24 array to a 2 x (2 * 2 * 3) array:
    a = np.array([
        [
            [
                [0, 1, 2],
                [3, 4, 5]
            ],
            [
                [6, 7, 8],
                [9, 10, 11]
            ]
        ],
        [
            [
                [12, 13, 14],
                [15, 16, 17]
            ],
            [
                [18, 19, 20],
                [21, 22, 23]
            ]
        ]
    ])
    print a.reshape(2, 3 * 2 * 2)

    # reshaping a 1 x (3 * 3 * 2 * 2 = 36) array to a 3 x 3 x 2 x 2
    # array:
    # a = np.array([
    #      0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11,
    #     12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
    #     24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35
    # ])
    # print a.reshape(3, 3, 2, 2)

if __name__ == "__main__":
    # loadCifar()
    testReshape()
