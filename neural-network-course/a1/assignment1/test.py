import cPickle
import checking
import language_model as lm

def load_data():
    data = cPickle.load(open('data.pk', 'rb'))
    print data

def test_gradient():
    checking.check_gradients()

def train():
    model = lm.train(16, 128)

train()
