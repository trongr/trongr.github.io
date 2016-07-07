from layer import *
class FCLayer(Layer):
    """ Class that handles fully connected layers.

    Each FCLayer object is in charge of a layer of units that is fully
    connected to the previous layer. It is also in charge of the layer of
    weights connecting the previous layer to this layer, and the biases of
    the units in this layer.
    """

    def __init__(self, config):
        # Construct the superclass object.
        super(FCLayer, self).__init__(config)

        # Hyperparameters for this layer.
        self.init_wt_ = float(config.get('init_wt', 0))  # Initial weight scale.
        self.epsilon_ = float(config.get('epsilon', 0))  # Learning rate.
        self.momentum_ = float(config.get('momentum', 0))  # Momentum.
        self.l2_decay_ = float(config.get('l2_decay', 0))  # L2-decay for the weights.

    def GetParameters(self):
        """ Returns the dictionary of parameters."""
        return { '%s_w' % self.name_ : self.w_,
                 '%s_b' % self.name_ : self.b_,
                }
    
    def SetParameters(self, parameters):
        """ Reads its own parameters from the dictionary."""
        self.w_ = parameters['%s_w' % self.name_]
        self.b_ = parameters['%s_b' % self.name_]

    def Initialize(self, input_image_size_y, input_image_size_x, input_num_channels):
        """ Initialize weights and biases."""
        input_size = input_num_channels * input_image_size_y * input_image_size_x
        self.image_size_y_ = 1
        self.image_size_x_ = 1
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
                  (batch_size x num_input_channels x spatial_size_y x spatial_size_x),
                  if the previous layer was convolutional or maxpool. Otherwise, it will be
                  (batch_size x num_input_channels).
        Output:
          The activation of this layer.
        """
        batch_size = inputs.shape[0]
        inputs = inputs.reshape(batch_size, -1)

        ############## YOUR CODE HERE ######################
        # Compute the output. This requires the inputs, self.w_ and self.b_.


        ####################################################

        # Apply the activation fucntion.
        output = self.ApplyActivation(output)
        return output

    def ComputeDown(self, dC_by_doutputs, outputs, inputs):
        """ Backprops through this layer.

        This method computes two kinds of derivatives -
        (1) The derivarive of the loss w.r.t the inputs to this layer.
        (2) The derivative of the loss w.r.t the parameters of this layer (weights and biases).
        Inputs:
          dC_by_doutputs: The derivative of the loss w.r.t. the outputs of this layer.
                          The shape will be (batch_size x num_channels).
          outputs: The activations of this layer.
                   The shape will be (batch_size x num_channels).
          inputs: The activations of the previous layer. The shape will be
                  (batch_size x num_input_channels x spatial_size_y x spatial_size_x),
                  if the previous layer was convolutional or maxpool. Otherwise, it will be
                  (batch_size x num_input_channels).
        Outputs:
          dC_by_dinputs: The derivative of the loss function w.r.t the inputs
                         to this layer (a.k.a the outputs of the previous layer). The shape will be
                         (batch_size x num_input_channels x spatial_size_y x spatial_size_x),
                         if the previous layer was convolutional or maxpool. Otherwise, it will be
                         (batch_size x num_input_channels).
          dw : The derivative of the loss function w.r.t the weights. The shape will be same as that of the weight.
          db : The derivative of the loss function w.r.t the bias. The shape will be same as that of the bias.
        """
        batch_size = inputs.shape[0]
        inputs = inputs.reshape(batch_size, -1)

        # Backprop through non-linearity.
        deriv = self.ApplyDerivativeofActivation(dC_by_doutputs, outputs)

        if self.is_input_:  # If this layer is the input, there is no need to compute derivatives w.r.t the inputs.
            dC_by_dinputs = None
        else:
            ############## YOUR CODE HERE ######################
            # Compute the dC_by_dinputs. This requires the deriv and self.w_.



            ####################################################

        ############## YOUR CODE HERE ######################
        # Compute the derivative w.r.t weights and biases (dw and db).



        ####################################################

        dw /= batch_size
        db /= batch_size
        return dC_by_dinputs, dw, db

    def Update(self, dw, db):
        """ Update the weights and biases.
        Inputs:
          dw : The derivative of the loss w.r.t the weights.
          db : The derivative of the loss w.r.t the biases.
        """
        dw += self.w_ * self.l2_decay_
        self.dw_history_ = self.momentum_ * self.dw_history_ - self.epsilon_ * dw
        self.db_history_ = self.momentum_ * self.db_history_ - self.epsilon_ * db
        self.w_ += self.dw_history_
        self.b_ += self.db_history_
