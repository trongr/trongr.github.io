function [error_train, error_val] = ...
    learningCurveRandomizedSamples(X, y, Xval, yval, lambda)

m = size(X, 1);
m_val = size(Xval, 1);

error_train = zeros(m, 1);
error_val   = zeros(m, 1);

for i = 1:m

    random_indices_train = randperm(m);
    X_train = X(random_indices_train(1:i), :);
    y_train = y(random_indices_train(1:i));

    random_indices_val = randperm(min(m_val, i)); # min so we don't get out of bounds indices
    X_val = Xval(random_indices_val(1:i), :);
    y_val = yval(random_indices_val(1:i), :);

    [theta] = trainLinearReg(X_train, y_train, lambda);

    [J_train, grad] = linearRegCostFunction(X_train, y_train, theta, 0);
    [J_val, grad] = linearRegCostFunction(X_val, y_val, theta, 0);

    error_train(i) = J_train;
    error_val(i) = J_val;

end

end
