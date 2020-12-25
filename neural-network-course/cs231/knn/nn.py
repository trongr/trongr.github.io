# Modified from source at cs231n.github.io/classification

import sys
import numpy as np
import cifar

class NearestNeighbor(object):
    def __init__(self):
        pass

    def train(self, X, y):
        """ X is N x D where each row is an example. Y is 1-dimension of size N """
        # the nearest neighbor classifier simply remembers all the training data
        self.Xtr = X
        self.ytr = y

    def predict(self, X):
        """ X is N x D where each row is an example we wish to predict label for """

        num_test = X.shape[0]
        # lets make sure that the output type matches the input type
        Ypred = np.zeros(num_test, dtype = self.ytr.dtype)

        # loop over all test rows
        for i in xrange(num_test):
            print "Predicting test case:", i
            # find the nearest training image to the i'th test image
            # using the L1 distance (sum of absolute value differences)

            distances = np.sum(np.abs(self.Xtr - X[i,:]), axis = 1) # L1 distance
            # distances = np.sum(np.square(self.Xtr - X[i,:]), axis = 1) # L2 distance

            min_index = np.argmin(distances) # get the index with smallest distance
            Ypred[i] = self.ytr[min_index] # predict the label of the nearest example

        return Ypred

def testNN(trainFile, testFile):
    Xtr_rows, Ytr = cifar.load(trainFile)
    Xte_rows, Yte = cifar.load(testFile)

    nn = NearestNeighbor() # create a Nearest Neighbor classifier class
    nn.train(Xtr_rows, Ytr) # train the classifier on the training images and labels
    Yte_predict = nn.predict(Xte_rows) # predict labels on the test images
    # and now print the classification accuracy, which is the average number
    # of examples that are correctly predicted (i.e. label matches)
    print 'accuracy: %f' % ( np.mean(Yte_predict == Yte) )

if __name__ == "__main__":
    # Call this script as: python nn.py path/to/data_batch_1
    # path/to/test_batch
    trainFile = sys.argv[1]
    testFile = sys.argv[2]
    testNN(trainFile, testFile)
