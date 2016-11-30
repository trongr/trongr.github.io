import numpy as np

from cs231n.layers import *
from cs231n.fast_layers import *
from cs231n.layer_utils import *


class ThreeLayerConvNet(object):
  """
  A three-layer convolutional network with the following architecture:

                               first           second
  conv - relu - 2x2 max pool - affine - relu - affine - softmax

  The network operates on minibatches of data that have shape (N, C, H, W)
  consisting of N images, each with height H and width W and with C input
  channels.
  """

  def __init__(self, input_dim=(3, 32, 32), num_filters=32, filter_size=7,
               hidden_dim=100, num_classes=10, weight_scale=1e-3, reg=0.0,
               dtype=np.float32):
    """
    Initialize a new network.

    Inputs:
    - input_dim: Tuple (C, H, W) giving size of input data
    - num_filters: Number of filters to use in the convolutional layer
    - filter_size: Size of filters to use in the convolutional layer
    - hidden_dim: Number of units to use in the fully-connected hidden layer
    - num_classes: Number of scores to produce from the final affine layer.
    - weight_scale: Scalar giving standard deviation for random initialization
      of weights.
    - reg: Scalar giving L2 regularization strength
    - dtype: numpy datatype to use for computation.
    """
    C, H, W = input_dim
    F, D, K = num_filters, hidden_dim, num_classes

    # CONV LAYER SIZES
    h1 = w1 = filter_size # conv filter sizes
    p1 = (h1 - 1) / 2 # conv padding
    s1 = 1 # conv stride
    H1 = 1 + (H + 2 * p1 - h1) / s1 # width and height of conv
    W1 = 1 + (W + 2 * p1 - w1) / s1 # layer output. not to confuse
    # this with the weights self.params["W1"]. we'll only use it in
    # this method so there's no problem

    # POOL LAYER SIZES
    h2 = w2 = 2 # max pool filter sizes
    s2 = 2 # max pool stride. no padding here.
    H2 = 1 + (H1 - h2) / s2 # width and height of max pool output
    W2 = 1 + (W1 - w2) / s2

    self.params = {
        "W1": weight_scale * np.random.randn(F, C, h1, w1),
        "b1": np.zeros(F), # conv weights
        "W2": weight_scale * np.random.randn(F * H2 * W2, D),
        "b2": np.zeros(D), # first affine weights
        "W3": weight_scale * np.random.randn(D, K),
        "b3": np.zeros(K), # second affine weights
    }
    self.conv_param = {'stride': s1, 'pad': p1}
    self.pool_param = {'pool_height': h2, 'pool_width': w2, 'stride': s2}
    self.reg = reg
    self.dtype = dtype

    for k, v in self.params.iteritems():
      self.params[k] = v.astype(dtype)

  def loss(self, X, y=None):
    """
    Evaluate loss and gradient for the three-layer convolutional network.

    Input / output: Same API as TwoLayerNet in fc_net.py.
    """
    W1, b1 = self.params['W1'], self.params['b1']
    W2, b2 = self.params['W2'], self.params['b2']
    W3, b3 = self.params['W3'], self.params['b3']

    a, a_cache = conv_relu_pool_forward(X, W1, b1, self.conv_param, self.pool_param)
    b, b_cache = affine_relu_forward(a, W2, b2)
    c, c_cache = affine_forward(b, W3, b3) # the class scores

    # If y is None then we are in test mode so just return scores
    if y is None:
      return c

    loss, dc = softmax_loss(c, y)
    db, dW3, db3 = affine_backward(dc, c_cache)
    da, dW2, db2 = affine_relu_backward(db, b_cache)
    dx, dW1, db1 = conv_relu_pool_backward(da, a_cache)

    loss += 0.5 * self.reg * np.sum(W1 * W1) \
          + 0.5 * self.reg * np.sum(W2 * W2) \
          + 0.5 * self.reg * np.sum(W3 * W3) \

    grads = {
        "W1": dW1 + self.reg * W1,
        "b1": db1,
        "W2": dW2 + self.reg * W2,
        "b2": db2,
        "W3": dW3 + self.reg * W3,
        "b3": db3,
    }

    return loss, grads
