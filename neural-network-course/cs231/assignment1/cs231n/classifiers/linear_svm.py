import numpy as np
from random import shuffle

def svm_loss_naive(W, X, y, reg):
    """
    Structured SVM loss function, naive implementation (with loops).

    Inputs have dimension D, there are C classes, and we operate on minibatches
    of N examples.

    Inputs:
    - W: A numpy array of shape (D, C) containing weights.
    - X: A numpy array of shape (N, D) containing a minibatch of data.
    - y: A numpy array of shape (N,) containing training labels; y[i] = c means
        that X[i] has label c, where 0 <= c < C.
    - reg: (float) regularization strength

    Returns a tuple of:
    - loss as single float
    - gradient with respect to weights W; an array of same shape as W
    """
    dW = np.zeros(W.shape)
    num_classes = W.shape[1]
    num_train = X.shape[0]
    loss = 0.0

    for i in xrange(num_train):
        scores = X[i].dot(W)
        correct_class_score = scores[y[i]]

        # loss derivatives for columns c != y_i
        margins = scores - correct_class_score + 1
        margins_indicator = np.where(margins > 0, 1, 0)
        dWi = np.dot(X[i][np.newaxis].T, margins_indicator[np.newaxis])
        dWi[:, y[i]] = 0
        dW += dWi

        # replace column c == y_i
        margins_indicator_count = max(0, np.sum(margins_indicator) - 1)
        dW[:, y[i]] += - margins_indicator_count * X[i]

        # Alternatively we could have foregone
        # dWi[:, y[i]] = 0
        # and do this instead:
        # margins_indicator_count = np.sum(margins_indicator)
        # They'll cancel each other out.

        for j in xrange(num_classes):
            if j == y[i]:
                continue
            margin = scores[j] - correct_class_score + 1 # delta = 1
            if margin > 0:
                loss += margin

    loss /= num_train
    dW /= num_train

    loss += 0.5 * reg * np.sum(W * W)
    dW += reg * W

    return loss, dW

def svm_loss_vectorized(W, X, y, reg):
    """
    Structured SVM loss function, vectorized implementation.

    Inputs and outputs are the same as svm_loss_naive.
    """
    num_train = X.shape[0]
    allrows = np.arange(num_train)
    S = np.dot(X, W)
    Z = S - S[allrows, y][None].T + 1

    margins = np.maximum(0, Z)
    margins[allrows, y] = 0

    loss = 1.0 / num_train * np.sum(margins) + 0.5 * reg * np.sum(W * W)

    margin_indicators = np.where(Z > 0, 1, 0)
    margin_indicators[allrows, y] = 0
    margin_indicators[allrows, y] = -np.sum(margin_indicators, axis=1)

    dW = 1.0 / num_train * np.dot(X.T, margin_indicators) + reg * W

    return loss, dW
