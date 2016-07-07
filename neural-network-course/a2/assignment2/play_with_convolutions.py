import numpy as np
import matplotlib.pyplot as plt
import scipy.misc
try:
    import convolutions
except:
    try:
        import convolutions_32bit as convolutions
    except:
        import convolutions_py as convolutions

def main():
  image = scipy.misc.imread('image.jpg')
  width, height, num_colors = image.shape

  im = np.zeros([num_colors, width, height])
  for i in xrange(num_colors):
    im[i, : ,:] = image[:, :, i]

  w1 = np.array([
    [0, -1, 0],
    [-1, 4, -1],
    [0, -1, 0],
    ])
  w2 = np.array([
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1],
    ])
  w3 = np.array([
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1],
    ])

  w = np.zeros([3, 3, 3])
  w[0, :, :] = w1
  w[1, :, :] = w2
  w[2, :, :] = w3
  kernel_size = w.shape[1]
  padding = kernel_size / 2
  
  w_flip = w[:, ::-1, ::-1]
  result = convolutions.convolve(im[np.newaxis, :, :, :], w_flip[:, np.newaxis, :, :], padding=padding)

  plt.subplot(2, 2, 1)
  plt.imshow(image)
  for k in xrange(3):
    res = result[k, :, :, :]
    res -= res.min()
    res /= res.max()
    res *= 255
    r = np.zeros([width, height, num_colors], dtype=np.uint8)
    for i in xrange(num_colors):
      r[:, :, i] = res[i, :, :]
    plt.subplot(2, 2, 2+k)
    plt.imshow(r)
  plt.show()

if __name__ == '__main__':
  main()
