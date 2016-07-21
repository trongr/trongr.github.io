import cPickle
import checking
import language_model as lm

def load_data():
    data = cPickle.load(open('data.pk', 'rb'))
    print data

def test_gradient():
    checking.check_gradients()

def train(embedding_dim, hidden_layer_size):
    return lm.train(embedding_dim, hidden_layer_size)

def tsne_plot():
    model = train(16, 128)
    model.tsne_plot()

tsne_plot()
