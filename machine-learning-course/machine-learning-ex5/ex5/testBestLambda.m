function J_test = testBestLambda(X_train, y_train, X_test, y_test, best_lambda)
% trains theta on training set and computes error on test set using best_lambda

[theta] = trainLinearReg(X_train, y_train, best_lambda);
[J_test, grad] = linearRegCostFunction(X_test, y_test, theta, 0);

end
