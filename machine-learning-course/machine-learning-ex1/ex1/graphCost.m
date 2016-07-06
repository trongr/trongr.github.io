function graphCost(J_history, color)
% Graph the cost function as it grows / descends over time

plot(1:numel(J_history), J_history, color, 'LineWidth', 2);
xlabel('Number of iterations');
ylabel('Cost J');
figure;
hold on;

end
