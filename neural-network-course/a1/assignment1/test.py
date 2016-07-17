import cPickle
import checking

def load_data():
    data = cPickle.load(open('data.pk', 'rb'))
    print data

def test_gradient():
    checking.check_gradients()

test_gradient()
