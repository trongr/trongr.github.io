function [C, sigma] = dataset3Params(X, y, Xval, yval)
%EX6PARAMS returns your choice of C and sigma for Part 3 of the exercise
%where you select the optimal (C, sigma) learning parameters to use for SVM
%with RBF kernel
%   [C, sigma] = EX6PARAMS(X, y, Xval, yval) returns your choice of C and
%   sigma. You should complete this function to return the optimal C and
%   sigma based on a cross-validation set.
%

% You need to return the following variables correctly.
C = 1;
sigma = 0.3;

% ====================== YOUR CODE HERE ======================
% Instructions: Fill in this function to return the optimal C and sigma
%               learning parameters found using the cross validation set.
%               You can use svmPredict to predict the labels on the cross
%               validation set. For example,
%                   predictions = svmPredict(model, Xval);
%               will return the predictions on the cross validation set.
%
%  Note: You can compute the prediction error using
%        mean(double(predictions ~= yval))
%

best_C = 0;
best_sigma = 0;
best_error = 1; % 100% error rate (very bad)

start = 0.1;
for i = 0:9
    _C = start * 2^i;
    for j = 0:9
        _sigma = start * 2^j;
        model = svmTrain(X, y, _C, @(x1, x2) gaussianKernel(x1, x2, _sigma));
        predictions = svmPredict(model, Xval);
        error = mean(double(predictions ~= yval));
        if (error < best_error)
           best_C = _C;
           best_sigma = _sigma;
           best_error = error;
        endif
    end
end

C = best_C;
sigma = best_sigma;

% =========================================================================

end
