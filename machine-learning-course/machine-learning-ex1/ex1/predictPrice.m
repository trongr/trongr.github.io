function p = predictPrice(size, beds, theta, mu, sigma)
% size and beds un-normalized

n_size = (size - mu(1)) / sigma(1)
n_beds = (beds - mu(2)) / sigma(2)

% Add 1 for constant feature
p = [1 n_size n_beds] * theta

end
