function [J grad] = nnCostFunction(nn_params, ...
                                   input_layer_size, ...
                                   hidden_layer_size, ...
                                   num_labels, ...
                                   X, y, lambda)
%NNCOSTFUNCTION Implements the neural network cost function for a two layer
%neural network which performs classification
%   [J grad] = NNCOSTFUNCTON(nn_params, hidden_layer_size, num_labels, ...
%   X, y, lambda) computes the cost and gradient of the neural network. The
%   parameters for the neural network are "unrolled" into the vector
%   nn_params and need to be converted back into the weight matrices.
%
%   The returned parameter grad should be a "unrolled" vector of the
%   partial derivatives of the neural network.
%

% ====================== YOUR CODE HERE ======================
% Instructions: You should complete the code by working through the
%               following parts.
%
% Part 1: Feedforward the neural network and return the cost in the
%         variable J. After implementing Part 1, you can verify that your
%         cost function computation is correct by verifying the cost
%         computed in ex4.m
%
% Part 2: Implement the backpropagation algorithm to compute the gradients
%         Theta1_grad and Theta2_grad. You should return the partial derivatives of
%         the cost function with respect to Theta1 and Theta2 in Theta1_grad and
%         Theta2_grad, respectively. After implementing Part 2, you can check
%         that your implementation is correct by running checkNNGradients
%
%         Note: The vector y passed into the function is a vector of labels
%               containing values from 1..K. You need to map this vector into a
%               binary vector of 1's and 0's to be used with the neural network
%               cost function.
%
%         Hint: We recommend implementing backpropagation using a for-loop
%               over the training examples if you are implementing it for the
%               first time.
%
% Part 3: Implement regularization with the cost function and gradients.
%
%         Hint: You can implement this around the code for
%               backpropagation. That is, you can compute the gradients for
%               the regularization separately and then add them to Theta1_grad
%               and Theta2_grad from Part 2.
%

% Reshape nn_params back into the parameters Theta1 and Theta2, the weight matrices
% for our 2 layer neural network
Theta1 = reshape(nn_params(1:hidden_layer_size * (input_layer_size + 1)), ...
                 hidden_layer_size, (input_layer_size + 1));

Theta2 = reshape(nn_params((1 + (hidden_layer_size * (input_layer_size + 1))):end), ...
                 num_labels, (hidden_layer_size + 1));

% Setup some useful variables
m = size(X, 1);

% You need to return the following variables correctly
J = 0;
Theta1_grad = zeros(size(Theta1));
Theta2_grad = zeros(size(Theta2));

X = [ones(m, 1) X];
Z2 = X * Theta1';
A2 = [ones(m, 1) sigmoid(Z2)];
Z3 = A2 * Theta2';
A3 = sigmoid(Z3);

% convert y to binary array y1:
y1 = zeros(size(y, 1), num_labels);
y1(sub2ind(size(y1), (1:size(y1, 1))', y)) = 1;

unbiased_Theta1 = Theta1(:, 2:end)(:);
unbiased_Theta2 = Theta2(:, 2:end)(:);

J = -1/m * (y1(:)' * log(A3)(:) + (1 .- y1)(:)' * log(1 .- A3)(:)) ...
    + lambda/2/m * [unbiased_Theta1' * unbiased_Theta1 + ...
                    unbiased_Theta2' * unbiased_Theta2];

Delta1 = zeros(size(Theta1));
Delta2 = zeros(size(Theta2));

for i = 1:m
    % Reuse results from A3:
    a1 = X(i, :)';
    a2 = A2(i, :)';
    a3 = A3(i, :)';

    % mach try this and make sure it's the same
    % Alternatively do feed forward one by one:
    % in the vectorized version above
    % a1 = X(i, :)';
    % a2 = [1; sigmoid(Theta1 * a1)];
    % a3 = sigmoid(Theta2 * a2);

    delta3 = a3 - y1(i, :)';
    delta2 = (Theta2' * delta3)(2:end) .* sigmoidGradient(Z2(i, :)');

    Delta1 = Delta1 + delta2 * a1';
    Delta2 = Delta2 + delta3 * a2';
end

% regularize all partials, then un-regularize first column
% corresponding bias units:
Theta1_grad = 1/m * Delta1 + lambda/m * Theta1;
Theta1_grad(:, 1) = 1/m * Delta1(:, 1);

Theta2_grad = 1/m * Delta2 + lambda/m * Theta2;
Theta2_grad(:, 1) = 1/m * Delta2(:, 1);












% -------------------------------------------------------------

% =========================================================================

% Unroll gradients
grad = [Theta1_grad(:) ; Theta2_grad(:)];


end
