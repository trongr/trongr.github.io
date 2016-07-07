from fc_layer import *
try:
    import convolutions
except:
    try:
        import convolutions_32bit as convolutions
    except:
        import convolutions_py as convolutions

class ConvLayer(FCLayer):
    """ Class that handles convolutional layers.

    Each ConvLayer object is in charge of a layer of units that is convolutionally
    connected to the previous layer. It is also in charge of the convolutional
    weights connecting the previous layer to this layer, and the biases of
    the units in this layer. This class derives from FCLayer, so that we can reuse
    the constructor which loads optimization hyperparameters, the Update method
    and the SetParameters and GetParameters methods.
    """

    def __init__(self, config):
        # Construct the superclass object.
        super(ConvLayer, self).__init__(config)

        # Convolution parameters.
        self.kernel_size_ = config.get('kernel_size', 1)
        self.stride_      = config.get('stride', 1)
        self.padding_     = config.get('padding', 0)
        self.use_method1_ = config.get('convolve_method', 'method1') == 'method1'

    def Initialize(self, input_image_size_y, input_image_size_x, input_num_channels):
        """ Initialize weights and biases. Also compute the spatial size of this layer."""
        self.image_size_y_ = (input_image_size_y + 2 * self.padding_ - self.kernel_size_ ) / self.stride_ + 1
        self.image_size_x_ = (input_image_size_x + 2 * self.padding_ - self.kernel_size_ ) / self.stride_ + 1
        input_size = input_num_channels * self.kernel_size_ ** 2
        self.w_ = self.init_wt_ * np.random.randn(self.num_channels_, input_size)
        self.b_ = np.zeros((1, self.num_channels_))
        self.dw_history_ = np.zeros(self.w_.shape, dtype=self.w_.dtype)
        self.db_history_ = np.zeros(self.b_.shape, dtype=self.b_.dtype)
        print 'Layer %s Weight shape %s Activation shape %dx%dx%d' % (
                self.name_, self.w_.shape, self.image_size_y_, self.image_size_x_, self.num_channels_)
        return self.image_size_y_, self.image_size_x_, self.num_channels_

    def ComputeUp(self, inputs):
        """ This method computes the activation of this layer.
        Inputs:
          inputs: The activations of the previous layer. The shape will be
                  (batch_size x num_input_channels x input_spatial_size_y x input_spatial_size_x).
        Output:
          The activation of this layer. The shape will be
                  (batch_size x num_channels x spatial_size_y x spatial_size_x).
        """
        if self.use_method1_:  # Use Method 1
            batch_size = inputs.shape[0]
            outputs = np.zeros((batch_size, self.num_channels_,
                            self.image_size_y_, self.image_size_x_),
                            dtype=inputs.dtype)

            for i in xrange(self.image_size_y_):
                y = i * self.stride_ - self.padding_
                for j in xrange(self.image_size_x_):
                    x = j * self.stride_ - self.padding_
                    patch = Layer.GetPatch(inputs, y, x, self.kernel_size_)
                    patch = patch.reshape(batch_size, -1)
                    outputs[:, :, i, j] = np.dot(patch, self.w_.T)

        else:  # use Method 2.
            w = self.w_.reshape(self.num_channels_, -1, self.kernel_size_, self.kernel_size_)
            w_flip = w[:, :, ::-1, ::-1]
            
            ############## YOUR CODE HERE ######################
            # Compute outputs using the convolutions.convolve method.
            # This can be done by convolving the inputs and w_flip.
            # Only a single call to this method is required, plus some other operations.
            # Think carefully about how you should reshape inputs and w_flip
            # and make sure to use the padding. Assume that the stride is 1.





            ####################################################

        # Add the bias
        outputs += self.b_[:, :, np.newaxis, np.newaxis]
        # Apply activation.
        outputs = self.ApplyActivation(outputs)
        return outputs

    def ComputeDown(self, dC_by_doutputs, outputs, inputs):
        """ This method backprops the derivatives through this layer.
        Inputs:
          dC_by_doutputs: The derivative of the loss function w.r.t the
                  outputs of this layer. The shape will be
                  (batch_size x num_channels x spatial_size_y x spatial_size_x)
                  if the higher layer was convolutional or maxpool, and
                  (batch_size x (num_channels*spatial_size_y*spatial_size_x))
                  if the higher layer was fully connected.
          outputs: The activations of this layer. The shape will be
                  (batch_size x num_channels x spatial_size_y x spatial_size_x).
          inputs: The activations of the previous layer. The shape will be
                  (batch_size x num_input_channels x input_spatial_size_y x input_spatial_size_x).
        Output:
          dC_by_dinputs: The derivative of the loss function w.r.t the
                  inputs to this layer. The shape will be
                  (batch_size x num_input_channels x input_spatial_size_y x input_spatial_size_x).
          dw : The derivative of the loss function w.r.t the weights. The shape will be same as that of the weight.
          db : The derivative of the loss function w.r.t the bias. The shape will be same as that of the bias.
        """
        compute_dC_by_dinputs = not self.is_input_
        dC_by_dinputs = None

        batch_size     = inputs.shape[0]
        dC_by_doutputs = dC_by_doutputs.reshape(batch_size, self.num_channels_,
                                                self.image_size_y_, self.image_size_x_)

        # Backprop through non-linearity.
        deriv = self.ApplyDerivativeofActivation(dC_by_doutputs, outputs)

        if self.use_method1_:  # Use Method 1
            if compute_dC_by_dinputs:
                dC_by_dinputs = np.zeros(inputs.shape, dtype=inputs.dtype)
            dw = np.zeros(self.w_.shape, dtype=self.w_.dtype)
            for i in xrange(self.image_size_y_):
                y = i * self.stride_ - self.padding_
                for j in xrange(self.image_size_x_):
                    x = j * self.stride_ - self.padding_
                    input_patch = Layer.GetPatch(inputs, y, x, self.kernel_size_)
                    output_deriv = deriv[:, :, i, j]
                    if compute_dC_by_dinputs:
                        input_deriv = np.dot(output_deriv, self.w_)
                        input_deriv = input_deriv.reshape(input_patch.shape)
                        Layer.AddPatch(dC_by_dinputs, input_deriv, y, x)
                    input_patch = input_patch.reshape(batch_size, -1)
                    dw += np.dot(output_deriv.T, input_patch)
        else:
            # Method 2
            if compute_dC_by_dinputs:
                w = self.w_.reshape(self.num_channels_, -1, self.kernel_size_, self.kernel_size_)
                ############## YOUR CODE HERE ######################
                # Compute dC_by_dinputs using the convolutions.convolve method.
                # This can be done by convolving deriv and w.
                # Only a single call to this method is required, besides other operations.
                # Think carefully about how you should reshape deriv and w and what padding should be used.
                # Assume that the stride is 1.





                ####################################################

            deriv_flip = deriv[:, :, ::-1, ::-1]
            ############## YOUR CODE HERE ######################
            # Compute dw using the convolutions.convolve method.
            # This can be done by convolving the inputs and deriv_flip.
            # Only a single call to this method is required, besides other operations.
            # Think carefully about how you should reshape inputs and deriv_flip and what padding should be used.
            # Assume that the stride is 1.








            ####################################################
            dw = dw.reshape(self.num_channels_, -1)

        db = deriv.sum(3).sum(2).mean(0).reshape(1, -1)
        dw /= batch_size
        return dC_by_dinputs, dw, db
