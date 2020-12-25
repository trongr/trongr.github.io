import numpy as np
from random import shuffle

def softmax_loss_naive(W, X, y, reg):
    # Let's skip the naive way and just do vectorized straight away
    return softmax_loss_vectorized(W, X, y, reg)

def softmax_loss_vectorized(W, X, y, reg):
    """
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
    num_classes = W.shape[1]
    num_train = X.shape[0]

    S = np.dot(X, W)
    Y = np.exp(S)
    Y = Y / np.sum(Y, axis=1)[None].T # NOTE. Y, and therefore S, X, and W must be made of floats, otw division will round to int
    T = np.eye(num_classes)[y] # one-hot encodings of the class labels

    loss = - 1.0 / num_train * np.sum(T * np.log(Y)) + 0.5 * reg * np.sum(W * W)
    dW = 1.0 / num_train * np.dot(X.T, Y - T) + reg * W

    return loss, dW
