""" Generic 2D convolution in cython."""
import numpy as np
cimport numpy as np
cimport cython
DTYPE = np.float64

cdef inline int int_max(int a, int b): return a if a >= b else b
cdef inline int int_min(int a, int b): return a if a <= b else b

def convolve(inputs, weights, padding=0):
  """Convolves the last two dimensions of inputs and weights.
  
  Computes the 2D convolution of inputs[..., :, :] with weights [..., :, :].
  The output of the convolution consists only of those elements that rely on the
  image along with the specified amount of 'padding' along all four sides of the
  input. Therefore the size of the output will input_size + 2 * padding -
  kernel_size + 1.  The output will be such that output[i1, i2, ..., i_n, :, :]
  is the convolution of inputs[i1, i2, ..., i_n, :, :] with weights[i1, i2, ...,
  i_n, :, :] for all i_1, i_2, ... i_n. For this to make sense -
  (1) inputs and weights must have the same number of dimensions (ndims).
  (2) ndims must be >=3.
  (3) The sizes along each dimension other than the last two must either match
  or at least one of them should be 1, that is, inputs.shape[k] ==
  weights.shape[k] or inputs.shape[k] == 1 or weights.shape[k] == 1. If any
  dimension is 1 in either inputs or weights, that array is broadcasted along
  that dimension to match the dimensions of the other array.
  
  For example, if inputs.shape is (2, 4, 20, 20) and weights.shape is (2, 1, 3,
  3), then the weights matrix would be broadcasted along axis = 1, so that it
  implicitly becomes a (2, 4, 3, 3) matrix where weights[:, k, :, :] =
  weights[:, 0, :, :] for k = 0, 1, 2, 3. The output will be of shape (2, 4,
  out_size, out_size), where out_size = (20 + 2 * padding) - 3 + 1.

  Multiple dimensions can be 1. For example, inputs.shape can be
  (100, 1, 8, 20, 20) and weights.shape can be (1, 16, 8, 5, 5). In this case
  inputs is broadcasted along axis = 1 and weights is broadcasted along axis =
  0. The output will be of shape (100, 16, 8, out_size, out_size), where
  out_size = (20 + 2 * padding) - 5 + 1.

  This method is like scipy.signal.convolve2d
  (http://docs.scipy.org/doc/scipy/reference/generated/scipy.signal.convolve2d.html)
  but with arbitrary number of dimensions. The 'mode' argument there
  corresponds to these values of padding-
    'valid' : Means a padding of 0.
    'same'  : Means a padding of kernel_size / 2
    'full'  : Means a padding of kernel_size - 1
    where kernel_size is the spatial size of the weight filter
    (weights.shape[-1])
  Inputs:
    inputs: Numpy array representing the input signal.
    weights: Numpy array representing the filters.
  Output:
    Convolution of inputs[..., :, :] with weights[..., :, :].
  """
  assert inputs.dtype == DTYPE and weights.dtype == DTYPE
  assert len(inputs.shape) == len(weights.shape)
  dim_length = len(inputs.shape)
  assert dim_length >= 3
  output_shape = []
  for i_s, w_s in zip(inputs.shape[:-2], weights.shape[:-2]):
    assert i_s == w_s or i_s == 1 or w_s == 1, 'Shape mismatch: Cannot broadcast.'
    output_shape.append(max(i_s, w_s))
  cdef int [:] input_dims  = np.array(inputs.shape[:-2]).astype(np.int32)
  cdef int [:] weight_dims = np.array(weights.shape[:-2]).astype(np.int32)
  cdef int [:] output_dims = np.array(output_shape).astype(np.int32)
  k_x = weights.shape[-1]
  k_y = weights.shape[-2]
  i_x = inputs.shape[-1]
  i_y = inputs.shape[-2]
  cdef double [:, :, :] inputs_view = inputs.reshape(-1, i_y, i_x)
  cdef double [:, :, :] weights_view = weights.reshape(-1, k_y, k_x)
  
  output_size = 1
  for i in range(dim_length - 2):
    output_size *= output_shape[i]
  assert padding >= 0 and padding < k_x and padding < k_y
  padding_y = padding
  padding_x = padding
  output_y = i_y + 2 * padding_y - k_y + 1
  output_x = i_x + 2 * padding_x - k_x + 1
  output_shape.append(output_y)
  output_shape.append(output_x)
  outputs = np.zeros(output_shape, dtype=DTYPE)
  cdef double [:, :, :] outputs_view = outputs.reshape(-1, output_y, output_x)
  _convolve(inputs_view, weights_view, outputs_view, padding_y, padding_x,
            input_dims, weight_dims, output_dims, dim_length - 2)
  return outputs

@cython.boundscheck(False)
@cython.wraparound(False)
@cython.cdivision(True)
cdef _convolve(double[:, :, :] inputs, double[:, :, :] weights, double[:, :, :] result,
        int padding_y, int padding_x, int [:] input_dims, int [:] weight_dims,
        int [:] output_dims, int dim_length):
  cdef int output_size = result.shape[0]  
  cdef int i_y = inputs.shape[1]
  cdef int i_x = inputs.shape[2]
  cdef int k_y = weights.shape[1]
  cdef int k_x = weights.shape[2]
  cdef int out_y = result.shape[1]
  cdef int out_x = result.shape[2]
  cdef int start_wy, start_wx, result_start_x, result_end_x, result_start_y, \
           result_end_y, i, j, k, size_x, size_y, x, y, kk, input_ind, \
           weight_ind, mult_i, mult_w, dim, dim_i, dim_w, s
  for k in range(output_size):
    # Compute broadcasted index
    input_ind = 0
    weight_ind = 0
    mult_i = 1
    mult_w = 1
    kk = k
    for d in range(dim_length-1, -1, -1):
      dim = output_dims[d]
      dim_i = input_dims[d]
      dim_w = weight_dims[d]
      s = kk % dim
      kk /= dim
      input_ind  += s * (mult_i if dim == dim_i else 0)
      weight_ind += s * (mult_w if dim == dim_w else 0)
      mult_i *= dim_i
      mult_w *= dim_w

    # Convolve.
    for i in range(i_y):
      start_wy       = int_max(0, k_y - 1 - padding_y - i)
      result_start_y = int_max(0, i + padding_y - k_y + 1)
      result_end_y   = int_min(out_y, i + padding_y + 1)
      size_y         = result_end_y - result_start_y
      for j in range(i_x):
        start_wx       = int_max(0, k_x - 1 - padding_x - j)
        result_start_x = int_max(0, j + padding_x - k_x + 1)
        result_end_x   = int_min(out_x, j + padding_x + 1)
        size_x         = result_end_x - result_start_x
        for y in range(size_y):
          for x in range(size_x):
            result[k, result_start_y + y, result_start_x + x] += \
                    inputs[input_ind, i, j] * \
                    weights[weight_ind, y + start_wy, x + start_wx]
