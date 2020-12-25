from conv_layer import *
from maxpool_layer import *

def ChooseLayer(config):
    if config['type'] == 'FC':
        return FCLayer(config)
    elif config['type'] == 'CONVOLUTIONAL':
        return ConvLayer(config)
    elif config['type'] == 'MAXPOOL':
        return MaxPoolLayer(config)
    else:
        raise Exception('Unknown layer type')
