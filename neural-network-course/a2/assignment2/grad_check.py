""" This script grad checks any model."""
from convnet import *
import yaml

def relative_error(a, b):
    return np.abs(a - b) / (np.abs(a) + np.abs(b))

def GradCheck(model, EPS=1e-5):
    image_size_y = model.input_image_size_y_
    image_size_x = model.input_image_size_x_
    num_colors   = model.input_num_channels_
    images = np.random.randn(1, num_colors, image_size_y, image_size_x)
    targets = np.zeros((1, 10))
    targets[0, np.random.randint(0, 10)] = 1

    states = model.Fprop(images)
    loss, correct = model.ComputeLoss(states[-1], targets)
    deriv = model.ComputeDeriv(states[-1], targets)
    analytical_gradients = model.Bprop(deriv, states)

    for ag, layer in zip(analytical_gradients, model.layers_):
        params = layer.GetParameters()
        if len(params) == 0:
          continue
        lname = layer.GetName()
        w_name = '%s_w' % lname
        b_name = '%s_b' % lname
        w = params[w_name]
        b = params[b_name]
        dw, db = ag
        for param_name, w, dw in [(w_name, w, dw), (b_name, b, db)]:
            all_zeros = True
            for ii in xrange(1000):
                i, j = np.random.randint(0, w.shape[0]), np.random.randint(0, w.shape[1])
                val = w[i, j]
                w[i, j] = val + EPS
                states = model.Fprop(images)
                loss1, _ = model.ComputeLoss(states[-1], targets)
                
                w[i, j] = val - EPS
                states = model.Fprop(images)
                loss2, _ = model.ComputeLoss(states[-1], targets)

                numerical_grad = (loss1 - loss2) / (2 * EPS)
                if dw[i, j] == 0.0 and numerical_grad == 0.0:
                    rel = 0
                else:
                    rel = relative_error(numerical_grad, dw[i, j])
                    all_zeros = False
                if rel > 1e-4:
                    print 'The loss derivative has a relative error of {}, which is too large.'.format(rel)
                    return False
                w[i, j] = val
            if all_zeros:
                print 'All gradients were zero. This usually indicates something is wrong'
                return False
            print 'The gradient for %s looks OK.' % param_name
    return True

def main():
    net = NeuralNet(yaml.load(open(sys.argv[1])))
    passed = GradCheck(net)
    if passed:
        print 'PASSED'
    else:
        print 'FAILED' 

if __name__ == '__main__':
    np.random.seed(42)
    main()
