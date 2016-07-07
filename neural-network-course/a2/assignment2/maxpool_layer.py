from layer import *

class MaxPoolLayer(Layer):
    """ Class that handles max pool layers.

    Each MaxPoolLayer object is in charge of a layer of units that is convolutionally
    connected to the previous layer. It does not have any learnable parameters.
    """

    def __init__(self, config):
        super(MaxPoolLayer, self).__init__(config)
        self.kernel_size_ = int(config.get('kernel_size', 1))
        self.stride_      = int(config.get('stride', 1))
        self.padding_     = int(config.get('padding', 0))

    def Initialize(self, input_image_size_y, input_image_size_x, input_num_channels):
        self.image_size_y_ = (input_image_size_y + 2 * self.padding_ - self.kernel_size_ ) / self.stride_ + 1
        self.image_size_x_ = (input_image_size_x + 2 * self.padding_ - self.kernel_size_ ) / self.stride_ + 1
        print 'Layer %s Activation shape %dx%dx%d' % (
                self.name_, self.image_size_y_, self.image_size_x_, self.num_channels_)
        assert self.num_channels_ == input_num_channels, 'Max pool layer must have the same number of channels as its input.'
        return self.image_size_y_, self.image_size_x_, self.num_channels_

    def ComputeUp(self, inputs):
        batch_size, num_input_channels, input_image_size, _ = inputs.shape
        assert num_input_channels == self.num_channels_

        outputs = np.zeros((batch_size, self.num_channels_,
                            self.image_size_y_, self.image_size_x_),
                            dtype=inputs.dtype)
        for i in xrange(self.image_size_y_):
            y = i * self.stride_ - self.padding_
            for j in xrange(self.image_size_x_):
                x = j * self.stride_ - self.padding_
                patch = Layer.GetPatch(inputs, y, x, self.kernel_size_)
                patch = patch.reshape(batch_size, num_input_channels, -1)
                outputs[:, :, i, j] = patch.max(axis=2)
        return outputs

    def ComputeDown(self, dC_by_doutputs, outputs, inputs):
        if self.is_input_:
            return None, None, None
        dC_by_dinputs  = np.zeros(inputs.shape, dtype=inputs.dtype)
        batch_size     = inputs.shape[0]
        dC_by_doutputs = dC_by_doutputs.reshape(batch_size, self.num_channels_,
                                                self.image_size_y_, self.image_size_x_)
        for i in xrange(self.image_size_y_):
            y = i * self.stride_ - self.padding_
            for j in xrange(self.image_size_x_):
                x = j * self.stride_ - self.padding_
                patch = Layer.GetPatch(inputs, y, x, self.kernel_size_)
                loc_state = outputs[:, :, i, j, np.newaxis, np.newaxis]
                loc_deriv = dC_by_doutputs[:, :, i, j, np.newaxis, np.newaxis]
                patch_deriv = (patch == loc_state) * loc_deriv
                Layer.AddPatch(dC_by_dinputs, patch_deriv, y, x)
        return dC_by_dinputs, None, None
