import numpy as np
import im2col as ic

def affine_forward(x, w, b):
  """
  Computes the forward pass for an affine (fully-connected) layer.

  The input x has shape (N, d_1, ..., d_k) and contains a minibatch of N
  examples, where each example x[i] has shape (d_1, ..., d_k). We will
  reshape each input into a vector of dimension D = d_1 * ... * d_k, and
  then transform it to an output vector of dimension M.

  Inputs:
  - x: A numpy array containing input data, of shape (N, d_1, ..., d_k)
  - w: A numpy array of weights, of shape (D, M)
  - b: A numpy array of biases, of shape (M,)

  Returns a tuple of:
  - out: output, of shape (N, M)
  - cache: (x, w, b)
  """
  out = np.dot(x.reshape(x.shape[0], -1), w) + b
  cache = (x, w, b)
  return out, cache

def affine_backward(dout, cache):
  """
  Computes the backward pass for an affine layer.

  Inputs:
  - dout: Upstream derivative, of shape (N, M)
  - cache: Tuple of:
    - x: Input data, of shape (N, d_1, ... d_k)
    - w: Weights, of shape (D, M)
    - b: bias weights, of shape (M,)

  Returns a tuple of:
  - dx: Gradient with respect to x, of shape (N, d1, ..., d_k)
  - dw: Gradient with respect to w, of shape (D, M)
  - db: Gradient with respect to b, of shape (M,)
  """
  x, w, b = cache
  dw = np.dot(x.reshape(x.shape[0], -1).T, dout)
  db = np.sum(dout, axis=0)
  dx = np.dot(dout, w.T).reshape(x.shape)
  return dx, dw, db


def relu_forward(x):
  """
  Computes the forward pass for a layer of rectified linear units (ReLUs).

  Input:
  - x: Inputs, of any shape

  Returns a tuple of:
  - out: Output, of the same shape as x
  - cache: x
  """
  out = np.maximum(0, x)
  cache = x
  return out, cache


def relu_backward(dout, cache):
  """
  Computes the backward pass for a layer of rectified linear units (ReLUs).

  Input:
  - dout: Upstream derivatives, of any shape
  - cache: Input x, of same shape as dout

  Returns:
  - dx: Gradient with respect to x
  """
  x = cache
  dx = dout * np.where(x >= 0, 1, 0)
  return dx


def batchnorm_forward(x, gamma, beta, bn_param):
  """
  Forward pass for batch normalization.

  During training the sample mean and (uncorrected) sample variance are
  computed from minibatch statistics and used to normalize the incoming data.
  During training we also keep an exponentially decaying running mean of the mean
  and variance of each feature, and these averages are used to normalize data
  at test-time.

  At each timestep we update the running averages for mean and variance using
  an exponential decay based on the momentum parameter:

  running_mean = momentum * running_mean + (1 - momentum) * sample_mean
  running_var = momentum * running_var + (1 - momentum) * sample_var

  Note that the batch normalization paper suggests a different test-time
  behavior: they compute sample mean and variance for each feature using a
  large number of training images rather than using a running average. For
  this implementation we have chosen to use running averages instead since
  they do not require an additional estimation step; the torch7 implementation
  of batch normalization also uses running averages.

  Input:
  - x: Data of shape (N, D)
  - gamma: Scale parameter of shape (D,)
  - beta: Shift paremeter of shape (D,)
  - bn_param: Dictionary with the following keys:
    - mode: 'train' or 'test'; required
    - eps: Constant for numeric stability
    - momentum: Constant for running mean / variance.
    - running_mean: Array of shape (D,) giving running mean of features
    - running_std Array of shape (D,) giving running std of features

  Returns a tuple of:
  - out: of shape (N, D)
  - cache: A tuple of values needed in the backward pass
  """
  mode = bn_param['mode']
  eps = bn_param.get('eps', 1e-7)
  momentum = bn_param.get('momentum', 0.9)

  N, D = x.shape
  running_mean = bn_param.get('running_mean', np.zeros(D, dtype=x.dtype))
  running_std = bn_param.get('running_std', np.zeros(D, dtype=x.dtype))

  if mode == 'train':
    m = np.mean(x, axis=0)
    s = np.std(x, axis=0)
    out = gamma * (x - m) / s + beta
    running_mean = momentum * running_mean + (1 - momentum) * m
    running_std = momentum * running_std + (1 - momentum) * s
  elif mode == 'test':
    m = running_mean
    s = running_std
    out = gamma * (x - m) / s + beta
  else:
    raise ValueError('Invalid forward batchnorm mode "%s"' % mode)

  bn_param['running_mean'] = running_mean
  bn_param['running_std'] = running_std

  cache = (x, gamma, beta, m, s)
  return out, cache

def batchnorm_backward(dout, cache):
  """Backward pass for batch normalization.

  For this implementation, you should write out a computation graph
  for batch normalization on paper and propagate gradients backward
  through intermediate nodes.

  Let's skip computation graph and go straight to full derivative.

  Inputs:
  - dout: Upstream derivatives, of shape (N, D)
  - cache: Variable of intermediates from batchnorm_forward.

  Returns a tuple of:
  - dx: Gradient with respect to inputs x, of shape (N, D)
  - dgamma: Gradient with respect to scale parameter gamma, of shape (D,)
  - dbeta: Gradient with respect to shift parameter beta, of shape (D,)
  """
  N, D = dout.shape
  x, gamma, beta, m, s = cache

  xm = x - m
  dx = gamma / s * dout \
     - gamma / (N * s) * np.sum(dout, axis=0) \
     - gamma / (N * s**3) * xm * np.sum(dout * xm, axis=0)

  dgamma = np.sum(dout * xm / s, axis=0)
  dbeta = np.sum(dout, axis=0)

  return dx, dgamma, dbeta

def batchnorm_backward_alt(dout, cache):
  return batchnorm_backward(dout, cache)

def dropout_forward(x, dropout_param):
  """
  Performs the forward pass for (inverted) dropout.

  Inputs:
  - x: Input data, of any shape
  - dropout_param: A dictionary with the following keys:
    - p: Dropout parameter. We drop each neuron output with probability p.
      NOTE. This is the opposite of the lecture slides! Slides said p is the
      probability of keeping a neuron alive.
    - mode: 'test' or 'train'. If the mode is train, then perform dropout;
      if the mode is test, then just return the input.
    - seed: Seed for the random number generator. Passing seed makes this
      function deterministic, which is needed for gradient checking but not in
      real networks.

  Outputs:
  - out: Array of the same shape as x.
  - cache: A tuple (dropout_param, mask). In training mode, mask is the dropout
    mask that was used to multiply the input; in test mode, mask is None.
  """
  p, mode = dropout_param['p'], dropout_param['mode']
  if 'seed' in dropout_param:
    np.random.seed(dropout_param['seed'])

  if mode == 'train':
    mask = np.random.random(x.shape) > p
    out = x * mask / (1 - p)
  elif mode == 'test':
    out = x
    mask = None

  cache = (dropout_param, mask)
  out = out.astype(x.dtype, copy=False)
  return out, cache

def dropout_backward(dout, cache):
  """
  Perform the backward pass for (inverted) dropout.
  Inputs:
  - dout: Upstream derivatives, of any shape
  - cache: (dropout_param, mask) from dropout_forward.
  """
  dropout_param, mask = cache
  p, mode = dropout_param['p'], dropout_param['mode']
  if mode == 'train':
    dx = dout * mask / (1 - p)
  elif mode == 'test':
    dx = dout
  return dx

def conv_forward_naive(x, w, b, conv_param):
  """
  A naive implementation of the forward pass for a convolutional layer.

  The input consists of N data points, each with C channels, height H and width
  W. We convolve each input with F different filters, where each filter spans
  all C channels and has height h and width h.

  Input:
  - x: Input data of shape (N, C, H, W)
  - w: Filter weights of shape (F, C, hf, wf)
  - b: Biases, of shape (F,)
  - conv_param: A dictionary with the following keys:
    - 'stride': The number of pixels between adjacent receptive fields in the
      horizontal and vertical directions.
    - 'pad': The number of pixels that will be used to zero-pad the input.

  Returns a tuple of:
  - out: Output data, of shape (N, F, H', W') where H' and W' are given by
    H' = 1 + (H + 2 * pad - hf) / stride
    W' = 1 + (W + 2 * pad - wf) / stride
  - cache: (x, w, b, conv_param)
  """
  s = conv_param["stride"]
  p = conv_param["pad"]
  N, C, H, W = x.shape
  F, C, hf, wf = w.shape
  Hp = 1 + (H + 2 * p - hf) / s
  Wp = 1 + (W + 2 * p - wf) / s

  f = w.reshape(F, -1)
  c = ic.im2col_indices(x, hf, wf, p, s)
  out = np.dot(f, c) + b[None].T
  out = out.reshape(-1, N).T.reshape(N, F, Hp, Wp)

  cache = (x, w, b, conv_param, c)
  return out, cache

def conv_backward_naive(dout, cache):
  """
  A naive implementation of the backward pass for a convolutional layer.

  Inputs:
  - dout: Upstream derivatives.
  - cache: A tuple of (x, w, b, conv_param) as in conv_forward_naive

  Returns a tuple of:
  - dx: Gradient with respect to x
  - dw: Gradient with respect to w
  - db: Gradient with respect to b
  """
  (x, w, b, conv_param, c) = cache
  s = conv_param["stride"]
  p = conv_param["pad"]
  N, C, H, W = x.shape
  F, C, hf, wf = w.shape
  Hp = 1 + (H + 2 * p - hf) / s
  Wp = 1 + (W + 2 * p - wf) / s

  dy = dout.reshape(N, -1).T.reshape(F, -1)
  f = w.reshape(F, -1)
  dx = np.dot(f.T, dy)
  dx = ic.col2im_indices(dx, x.shape, hf, wf, p, s)
  dw = np.dot(dy, c.T).reshape(w.shape)
  db = np.sum(dy, axis=1)

  return dx, dw, db

def max_pool_forward_naive(x, pool_param):
  """
  A naive implementation of the forward pass for a max pooling layer.

  Inputs:
  - x: Input data, of shape (N, C, H, W)
  - pool_param: dictionary with the following keys:
    - 'pool_height': The height of each pooling region
    - 'pool_width': The width of each pooling region
    - 'stride': The distance between adjacent pooling regions

  Returns a tuple of:
  - out: Output data
  - cache: (x, pool_param)
  """
  N, C, H, W = x.shape
  h = pool_param["pool_height"]
  w = pool_param["pool_width"]
  s = pool_param["stride"]
  Hp = 1 + (H - h) / s
  Wp = 1 + (W - w) / s

  out = ic.im2col_indices(x, h, w, padding=0, stride=s)
  z = out.T.reshape(-1, w * h) # need to cache this
  out = np.max(z, axis=1).reshape(-1, C)
  out = out.T.reshape(-1, N).T.reshape(N, C, Hp, Wp)

  cache = (x, pool_param, z)
  return out, cache

def max_pool_backward_naive(dout, cache):
  """
  A naive implementation of the backward pass for a max pooling layer.

  Inputs:
  - dout: Upstream derivatives
  - cache: A tuple of (x, pool_param) as in the forward pass.

  Returns:
  - dx: Gradient with respect to x
  """
  x, pool_param, z = cache
  N, C, H, W = x.shape
  h = pool_param["pool_height"]
  w = pool_param["pool_width"]
  s = pool_param["stride"]
  Hp = 1 + (H - h) / s
  Wp = 1 + (W - w) / s

  dx = dout.reshape(N, -1).T.reshape(C, -1).T     # db
  dx = dx.reshape(1, -1)                          # da
  iz = np.argmax(z, axis=1)                       # iz
  iz = np.eye(w * h)[iz]                          # hz
  dx = iz * dx.T                                  # dz
  dx = dx.reshape(-1, w * h * C).T                # dy
  dx = ic.col2im_indices(dx, x.shape, h, w, 0, s) # dx

  return dx

def spatial_batchnorm_forward(x, gamma, beta, bn_param):
  """
  Computes the forward pass for spatial batch normalization.

  Inputs:
  - x: Input data of shape (N, C, H, W)
  - gamma: Scale parameter, of shape (C,)
  - beta: Shift parameter, of shape (C,)
  - bn_param: Dictionary with the following keys:
    - mode: 'train' or 'test'; required
    - eps: Constant for numeric stability
    - momentum: Constant for running mean / variance. momentum=0 means that
      old information is discarded completely at every time step, while
      momentum=1 means that new information is never incorporated. The
      default of momentum=0.9 should work well in most situations.
    - running_mean: Array of shape (D,) giving running mean of features
    - running_var Array of shape (D,) giving running variance of features

  Returns a tuple of:
  - out: Output data, of shape (N, C, H, W)
  - cache: Values needed for the backward pass
  """
  N, C, H, W = x.shape
  y = x.transpose(1, 0, 2, 3).reshape(C, -1).T
  z, cache = batchnorm_forward(y, gamma, beta, bn_param)
  out = z.T.reshape(C, N, H, W).transpose(1, 0, 2, 3)
  return out, cache

def spatial_batchnorm_backward(dout, cache):
  """
  Computes the backward pass for spatial batch normalization.

  Inputs:
  - dout: Upstream derivatives, of shape (N, C, H, W)
  - cache: Values from the forward pass

  Returns a tuple of:
  - dx: Gradient with respect to inputs, of shape (N, C, H, W)
  - dgamma: Gradient with respect to scale parameter, of shape (C,)
  - dbeta: Gradient with respect to shift parameter, of shape (C,)
  """
  N, C, H, W = dout.shape
  dz = dout.transpose(1, 0, 2, 3).reshape(C, -1).T
  dy, dgamma, dbeta = batchnorm_backward(dz, cache)
  dx = dy.T.reshape(C, N, H, W).transpose(1, 0, 2, 3)
  return dx, dgamma, dbeta

def svm_loss(x, y):
  """
  Computes the loss and gradient using for multiclass SVM classification.

  Inputs:
  - x: Input data, of shape (N, C) where x[i, j] is the score for the jth class
    for the ith input.
  - y: Vector of labels, of shape (N,) where y[i] is the label for x[i] and
    0 <= y[i] < C

  Returns a tuple of:
  - loss: Scalar giving the loss
  - dx: Gradient of the loss with respect to x
  """
  N = x.shape[0]
  correct_class_scores = x[np.arange(N), y]
  margins = np.maximum(0, x - correct_class_scores[:, np.newaxis] + 1.0)
  margins[np.arange(N), y] = 0
  loss = np.sum(margins) / N
  num_pos = np.sum(margins > 0, axis=1)
  dx = np.zeros_like(x)
  dx[margins > 0] = 1
  dx[np.arange(N), y] -= num_pos
  dx /= N
  return loss, dx


def softmax_loss(x, y):
  """
  Computes the loss and gradient for softmax classification.

  Inputs:
  - x: Input data, of shape (N, C) where x[i, j] is the score for the jth class
    for the ith input.
  - y: Vector of labels, of shape (N,) where y[i] is the label for x[i] and
    0 <= y[i] < C

  Returns a tuple of:
  - loss: Scalar giving the loss
  - dx: Gradient of the loss with respect to x
  """
  probs = np.exp(x - np.max(x, axis=1, keepdims=True))
  probs /= np.sum(probs, axis=1, keepdims=True)
  N = x.shape[0]
  loss = -np.sum(np.log(probs[np.arange(N), y])) / N
  dx = probs.copy()
  dx[np.arange(N), y] -= 1
  dx /= N
  return loss, dx
