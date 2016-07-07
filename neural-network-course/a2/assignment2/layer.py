import numpy as np

class Layer(object):
    """ The base class for representing a layer of the network.

    Each layer object is a module that represents one layer of units,
    along with whatever is needed to compute the state of that layer
    from the previous layer's state. Layers can be of different types -
    fully connected, convolutions or max pool layers. Each of these is
    a handled by a derived class from this base class.
    """

    def __init__(self, config):
        # The layer's name is a unique identifier for that layer.
        self.name_ = config.get('name', '')

        # The number of channels in the layer.
        # For fully connected layers, this is the number of hidden units.
        # For convolutional and maxpool layers, this is the number of channels.
        self.num_channels_ = config.get('num_channels', 1)

        self.is_input_  = False
        self.is_output_ = False

    def GetParameters(self):
        return {}
    
    def SetParameters(self, parameters):
        pass

    def Initialize(self):
        pass

    def SetIsOutput(self):
        self.is_output_ = True

    def SetIsInput(self):
        self.is_input_ = True

    def GetName(self):
        return self.name_

    def Initialize(self, input_image_size_y, input_image_size_x, input_num_channels):
        pass

    def ApplyActivation(self, inputs):
        """ Apply the activation function.
        
        We are using the rectified linear non-linearity at all hidden layers
        and softmax at the output.
        Inputs:
          inputs: A mini-batch of incoming inputs as numpy array whose first dimension is the batch_size.
        Outputs:
          The result after applying the activation.
        """
        if self.is_output_:
            return Layer.ApplySoftmax(inputs)
        else:
            return np.maximum(inputs, 0)

    def ApplyDerivativeofActivation(self, dC_by_doutputs, activations):
        """ Apply the derivative of the activation function.

        This method backprops derivatives through the activation function.
        Note that this method only cares about the activation function.
        It has nothing to do with the weights of the layer, which is why
        we implement this once in the base class only.
        Inputs:
          dC_by_doutputs : The derivative of the loss w.r.t the outputs of the units in this layer.
        Output:
          The derivative of the loss w.r.t the inputs to the units in this layer.
        """
        if self.is_output_:
            return dC_by_doutputs  # In this case we computed the derivative already.
        else:
            return dC_by_doutputs * (activations > 0)

    def ComputeUp(self, inputs):
        """ The implementation depends on the type of layer.
        So this is implemented in the derived classes.
        """
        pass

    def ComputeDown(self, derivs, outputs, inputs):
        """ The implementation depends on the type of layer.
        So this is implemented in the derived classes.
        """
        pass
    
    def Update(self, dw, db):
        """ The implementation depends on the type of layer.
        So this is implemented in the derived classes.
        """
        pass

    @staticmethod
    def ApplySoftmax(logits):
        """ Applies the softmax function.
        Inputs:
          logits: The inputs to the softmax unit of shape (batch_size x num_classes).
        Output:
          The state of the softmax unit after applying the softmax function,
          also of shape (batch_size x num_classes).
        """
        batch_size = logits.shape[0]
        state = logits - logits.max(axis=1).reshape(batch_size, -1)
        state = np.exp(state)
        state /= state.sum(axis=1).reshape(batch_size, -1)
        return state

    @staticmethod
    def GetPatch(mat, start_y, start_x, kernel_size):
        """ Extract a patch of size kernel_size x kernel_size from mat.

            The top left corner of the patch is at (start_y, start_x).
            Zero-pads any part of the patch that lies outside mat.
        Inputs:
            mat : The state of a layer of shape (batch_size x num_channels x spatial_size_y x spatial_size_x).
            start_y, start_x : The coordinate of the top-left corner of the patch.
            kernel_size: Size of the patch.
        Outputs:
            patch : The patch of shape (batch_size x num_channels x kernel_size x kernel_size).
        """
        batch_size, num_channels, spatial_size_y, spatial_size_x = mat.shape
        patch = np.zeros((batch_size, num_channels, kernel_size, kernel_size), dtype=mat.dtype)
        end_y = start_y + kernel_size
        end_x = start_x + kernel_size
        patch_start_y = -min(0, start_y)
        patch_start_x = -min(0, start_x)
        patch_end_y   = kernel_size - max(0, end_y - spatial_size_y)
        patch_end_x   = kernel_size - max(0, end_x - spatial_size_x)
        start_y = max(0, start_y)
        start_x = max(0, start_x)
        end_y   = min(end_y, spatial_size_y)
        end_x   = min(end_x, spatial_size_x)
        patch[..., patch_start_y:patch_end_y, patch_start_x:patch_end_x] =\
            mat[..., start_y:end_y, start_x:end_x]
        return patch

    @staticmethod
    def AddPatch(mat, patch, start_y, start_x):
        """ Add a patch of size kernel_size x kernel_size to mat at the location (start_y, start_x)

            Ignore any part of the patch that lies outside mat. 
            The top left corner of the patch is at (start_y, start_x).
            Modifies mat in-place.
        Inputs:
            mat : The state of a layer of shape (batch_size x num_channels x spatial_size_y x spatial_size_x).
            patch : A patch of shape (batch_size x num_channels x kernel_size x kernel_size).
            start_y, start_x : The coordinate of the top-left corner of the patch.
            kernel_size: Size of the patch.
        """
        batch_size, num_channels, spatial_size_y, spatial_size_x = mat.shape
        _, _ , kernel_size, _ = patch.shape
        end_y = start_y + kernel_size
        end_x = start_x + kernel_size
        patch_start_y = -min(0, start_y)
        patch_start_x = -min(0, start_x)
        patch_end_y   = kernel_size - max(0, end_y - spatial_size_y)
        patch_end_x   = kernel_size - max(0, end_x - spatial_size_x)
        start_y = max(0, start_y)
        start_x = max(0, start_x)
        end_y   = min(end_y, spatial_size_y)
        end_x   = min(end_x, spatial_size_x)
        mat[..., start_y:end_y, start_x:end_x] += \
          patch[..., patch_start_y:patch_end_y, patch_start_x:patch_end_x]
