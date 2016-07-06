function [X_poly] = polyFeatures(X, p)
%POLYFEATURES Maps X (1D vector) into the p-th power
%   [X_poly] = POLYFEATURES(X, p) takes a data matrix X (size m x 1) and
%   maps each example into its polynomial features where
%   X_poly(i, :) = [X(i) X(i).^2 X(i).^3 ...  X(i).^p];
%


% You need to return the following variables correctly.
% X_poly = zeros(numel(X), p);

% ====================== YOUR CODE HERE ======================
% Instructions: Given a vector X, return a matrix X_poly where the p-th
%               column of X contains the values of X to the p-th power.
%
%

A = repmat(X, 1, p); % duplicate X into matrix of p columns
b = linspace(1, p, p); % b = [1, 2, 3,..., p];

% take each column of A and raise it to the corresponding elements of b. see
% http://stackoverflow.com/questions/2307249/how-to-apply-a-function-to-every-row-in-matlab

X_poly = bsxfun(@(x,y) x.^y, A, b);


% =========================================================================

end
