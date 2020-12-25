""" Generic 2D convolution in pure python."""
import numpy as np

def convolve(inputs, weights, padding=0):
  """Convolves last two dimensions of inputs and weights."""
  assert len(inputs.shape) == len(weights.shape)
  assert len(inputs.shape) >= 2
  y_ind = len(inputs.shape) - 2
  x_ind = len(inputs.shape) - 1
  output_dim = []
  for i, w in zip(inputs.shape[:-2], weights.shape[:-2]):
    assert i == w or i == 1 or w == 1, 'Shape mismatch: Cannot broadcast.'
    output_dim.append(max(i, w))
  i_y = inputs.shape[-2]
  i_x = inputs.shape[-1]
  k_y = weights.shape[-2]
  k_x = weights.shape[-1]
  assert padding >= 0 and padding < k_x and padding < k_y
  padding_y = padding
  padding_x = padding

  output_shape_y = i_y + 2 * padding_y - k_y + 1
  output_shape_x = i_x + 2 * padding_x - k_x + 1
  output_dim.append(output_shape_y)
  output_dim.append(output_shape_x)
  result = np.zeros(output_dim, dtype=inputs.dtype)
  for i in xrange(i_y):
    start_wy = max(0, k_y - 1 - padding_y - i)
    result_start_y = max(0, i + padding_y - k_y + 1)
    result_end_y   = min(output_shape_y, i + padding_y + 1)
    end_wy = start_wy + result_end_y - result_start_y
    for j in xrange(i_x):
      start_wx = max(0, k_x - 1 - padding_x - j)
      result_start_x = max(0, j + padding_x - k_x + 1)
      result_end_x   = min(output_shape_x, j + padding_x + 1)
      end_wx = start_wx + result_end_x - result_start_x
      result[..., result_start_y:result_end_y, result_start_x:result_end_x] += \
          inputs[..., i, j, np.newaxis, np.newaxis] * \
          weights[..., start_wy:end_wy, start_wx:end_wx]
  return result
