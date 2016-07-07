from all_layers import *
import sys
import time
import matplotlib.pyplot as plt
plt.ion()
class NeuralNet(object):
    """ A class that encapsulates a neural network."""
    def __init__(self, config):
        """ Constructor for a neural net.
        Inputs:
          config: A dictionary specifying the configuration of the network.
        """
        # Construct layers.
        self.layers_ = [ChooseLayer(l) for l in config['network']]
        
        # Read the input config.
        self.input_image_size_y_ = config.get('input_image_size_y', 1)
        self.input_image_size_x_ = config.get('input_image_size_x', 1)
        self.input_num_channels_ = config.get('input_num_channels', 1)

        # Each layer needs to know the the spatial size of the layer below
        # in order to compute its own size. It also needs to know the
        # number of channels (a.k.a feature maps) in the previous layer
        # so that it can allocate weights accordingly.
        # Here, we propagate this information. In each interation of the for
        # loop, a layer takes in the sptial_size and num_channels from the layer below
        # and returns its own spatial_size and num_channels.
        spatial_size_y = self.input_image_size_y_
        spatial_size_x = self.input_image_size_x_
        num_channels   = self.input_num_channels_
        for l in self.layers_:
            spatial_size_y, spatial_size_x, num_channels = \
                l.Initialize(spatial_size_y, spatial_size_x, num_channels)

        # Set the first layer to be the input.
        self.layers_[0].SetIsInput()

        # Set the last layer to be the output.
        self.layers_[-1].SetIsOutput()
        
        # Read other things from the config.
        self.max_epochs_ = config.get('max_epochs', 1)
        self.batch_size_ = config.get('batch_size', 1)
        self.data_path_  = config.get('data_path', '')
        self.checkpoint_file_ = config.get('checkpoint_file', '')
        self.performance_stats_ = config.get('performance_stats', '')
        self.display_ = config.get('display', False)
        self.display_after_ = config.get('display_after', 10)
        self.tiny_ = 1e-10
    
    def Fprop(self, inputs):
        """ Forward propagate the inputs through the net.
        Input:
          inputs : batch_size x num_channels x image_size x image_size Numpy array.
        Output:
          states : List of activations.
        """
        states = [inputs]
        for l in self.layers_:
            outputs = l.ComputeUp(inputs)
            states.append(outputs)
            inputs = outputs
        return states
    
    def Bprop(self, deriv, states):
        """ Backward propagate the derivative through the net.
        This method computes the gradients for the model's parameters.
        Input:
          deriv: derivative of the loss function w.r.t the inputs to the softmax layer.
          states: The state of each layer (the output of Fprop).
        Output:
          gradients : A list of parameter gradients. Each list element
                      corresponds to a different layer. Each element is a tuple
                      of two gradients - one for the weights, other for the bias.
        """
        gradients = []
        for l, outputs, inputs in reversed(zip(self.layers_, states[1:], states[:-1])):
            deriv, dw, db = l.ComputeDown(deriv, outputs, inputs)
            gradients.append((dw, db))
        gradients.reverse()
        return gradients
    
    def Update(self, gradients):
        """ Update the model's parameters.
        Input:
          gradients: A list of gradients (output of Bprop).
        """
        for l, gradient in zip(self.layers_, gradients):
            dw, db = gradient
            l.Update(dw, db)

    def ComputeDeriv(self, predictions, targets):
        """ Computes the derivative of the loss function w.r.t inputs to the softmax.
        Input:
          predictions: batch_size x num_classes Numpy array of probabilities.
          targets    : batch_size x num_classes Numpy array of indicator vectors.
        Output:
          The derivative of the loss w.r.t the logits (inputs to the softmax).
        """
        batch_size = predictions.shape[0]
        predictions = predictions.reshape(batch_size, -1)
        deriv = predictions - targets
        return deriv

    def ComputeLoss(self, predictions, targets):
        """ Computes the loss function (cross entropy) and the number of correct predictions.
        Input:
          predictions: batch_size x num_classes Numpy array of probabilities.
          targets    : batch_size x num_classes Numpy array of indicator vectors.
        Output:
          loss : Cross Entropy of the predictions w.r.t the targets, summed over the minibatch.
          correct : Number of correctly classified examples.
        """

        batch_size = predictions.shape[0]
        predictions = predictions.reshape(batch_size, -1)
        guesses = predictions.argmax(axis=1)
        ground_truth = targets.argmax(axis=1)
        correct = (guesses == ground_truth).sum()
        loss = -(targets * np.log(self.tiny_ + predictions)).sum()
        return loss, correct

    def Load(self):
        """ Load a model from a checkpoint file."""
        parameters = np.load(self.checkpoint_file_)
        for l in self.layers_:
            l.SetParameters(parameters)

    def Save(self):
        """ Save a model to a checkpoint file."""
        parameters = {}
        for l in self.layers_:
            for name, w in l.GetParameters().items():
                parameters[name] = w
        np.savez(self.checkpoint_file_, **parameters)

    def Display(self, states):
      plt.figure(1, figsize=(15,3))
      plt.clf()
      num_states = len(states)
      for i, state in enumerate(states):
        if len(state.shape) == 2:
          num_hid = state.shape[1]
          if num_hid <= 10:
            im = state[0, np.newaxis, :]
          else:
            r = int(np.sqrt(num_hid))
            c = (num_hid + r - 1) / r
            im = np.zeros((r, c))
            for k in xrange(num_hid):
              rr = k / c
              cc = k % c
              im[rr, cc] = state[0, k]
        elif len(state.shape) == 4:
          if state.shape[1] == 1:
            im = state[0, 0, :, :]
          else:
            num_filters = state.shape[1]
            r = int(np.sqrt(num_filters))
            c = (num_filters + r - 1) / r
            s_y = state.shape[2]
            s_x = state.shape[3]
            im = np.zeros((r * s_y , c * s_x))
            for k in xrange(num_filters):
              rr = k / c
              cc = k % c
              im[rr * s_y : (rr+1) * s_y, cc * s_x : (cc+1) * s_x] = state[0, k, :, :]
        plt.subplot(1, num_states, i+1)
        if i == 0:
          plt.title('input')
        else:
          plt.title(self.layers_[i-1].GetName())
        plt.imshow(im, cmap=plt.cm.gray, interpolation="nearest")
      plt.draw()


    def TrainOneMiniBatch(self, images, targets, display=False):
        """ Make one update to the model using the given minibatch.
        Inputs:
          images  : batch_size x num_channels x image_size x image_size Numpy array.
          targets : batch_size x num_classes Numpy array of indicator vectors.
          display : Display the states.
        Outputs:
          loss : Cross Entropy of the predictions w.r.t the targets, summed over the minibatch.
          correct : Number of correctly classified examples.
          These are computed using the current values of the model parameters (before being updated).
        """
        states = self.Fprop(images)
        if display:
          self.Display(states)
        predictions = states[-1]
        loss, correct = self.ComputeLoss(predictions, targets)
        deriv = self.ComputeDeriv(predictions, targets)
        gradients = self.Bprop(deriv, states)
        self.Update(gradients)
        return loss, correct
    
    def Validate(self, dataset='val'):
        """ Run the model and return the avg loss and accuracy.
        Input:
          dataset : One of 'val', 'test' or 'train'.
                    Indicates which dataset to run the model on.
        Outputs:
          Average cross entropy and classification accuracy.
        """
        if dataset == 'val':
            data   = self.val_images_
            labels = self.val_labels_
        elif dataset == 'test':
            data   = self.test_images_
            labels = self.test_labels_
        else:
            data   = self.train_images_
            labels = self.train_labels_

        batch_size = self.batch_size_
        data_set_size = data.shape[0]
        num_batches = data_set_size / batch_size
        if data_set_size % batch_size > 0:
            num_batches += 1
        sum_loss = 0
        sum_correct = 0
        for j in xrange(num_batches):
            start = j * batch_size
            end   = min(start + batch_size, data_set_size)
            images  = data[start:end]
            targets = labels[start:end]
            states = self.Fprop(images)
            predictions = states[-1]
            loss, correct = self.ComputeLoss(predictions, targets)
            sum_loss    += loss
            sum_correct += correct
        sum_loss    /= float(data_set_size)
        sum_correct /= float(data_set_size)
        return sum_loss, sum_correct

    def LoadData(self, test=False):
        """ Load data from the disk into memory.
        Inputs:
          test : if True, the test set will be loaded, otherwise the training set will be loaded.
        """
        data = np.load(self.data_path_)
        image_size_y = self.input_image_size_y_
        image_size_x = self.input_image_size_x_
        num_colors = self.input_num_channels_
        if test:
            self.test_images_  = data['test'].reshape(-1, num_colors, image_size_y, image_size_x).astype(np.float64)
            self.test_labels_  = data['test_labels']
        else:
            self.train_images_ = data['train'].reshape(-1, num_colors, image_size_y, image_size_x).astype(np.float64)
            self.train_labels_ = data['train_labels']
            self.val_images_   = data['validation'].reshape(-1, num_colors, image_size_y, image_size_x).astype(np.float64)
            self.val_labels_   = data['validation_labels']

    def Train(self):
        """ Train the network.
        This method trains the network and writes out the model that gets the best
        validation performance. Also writes out the performance statistics
        during the training.
        """
        batch_size = self.batch_size_
        train_set_size = self.train_images_.shape[0]
        num_batches = train_set_size / batch_size
        step = 1
        indices = np.arange(train_set_size)
        best_val_accuracy = 0
        performance = []
        for i in xrange(self.max_epochs_):
            t0 = time.time()  # Record the start time.
            train_loss = 0
            train_correct = 0

            # Before each epoch, shuffle the data.
            np.random.shuffle(indices)
            self.train_images_ = self.train_images_[indices]
            self.train_labels_ = self.train_labels_[indices]

            for j in xrange(num_batches):
                sys.stdout.write('\rEpoch %d Step %d' % (i+1, step))
                sys.stdout.flush()

                # Slice out a mini-batch.
                images  = self.train_images_[j * batch_size : (j + 1) * batch_size]
                targets = self.train_labels_[j * batch_size : (j + 1) * batch_size]
                
                display = self.display_ and step % self.display_after_ == 0
                # Update the model.
                loss, correct = self.TrainOneMiniBatch(images, targets, display)

                train_loss    += loss
                train_correct += correct

                step += 1
            train_loss    /= float(num_batches * batch_size)
            train_correct /= float(num_batches * batch_size)
            valid_loss, valid_correct = self.Validate()
            t1 = time.time()  # Record end time.
            sys.stdout.write(' Time %.2fs Train CE %.5f Accuracy %.5f Valid CE %.5f Accuracy %.5f\n' % (
                             t1 - t0, train_loss, train_correct, valid_loss, valid_correct))
            performance.append([train_loss, train_correct, valid_loss, valid_correct])
            np.save(self.performance_stats_, np.array(performance))
            if valid_correct > best_val_accuracy:
                best_val_accuracy = valid_correct
                self.Save()
        print 'Best Validation score %.5f' % best_val_accuracy
