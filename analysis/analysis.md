# Analysis

# Definition. Directional derivative

Let \( A \subset R^m, f: A\longrightarrow R^n. \) Suppose A contains a neighbourhood of \( a. \) Given \( u \in R^m \) with \( u \neq 0, \) define the directional derivative of \( f \) at \( a \) in the direction of \( u \) to be

\[
f'(a; u) = \lim_{t\to 0} \frac{f(a+u) - f(a)}{t}
\]

if it exists.

# Definition. Derivative

Let \( A \subset R^m, f: A\longrightarrow R^n. \) Suppose A contains a neighbourhood of a. We say that \( f \) is differentiable at \( a \) if there is an \( n\times m \) matrix B s.t.

\[
\frac{f(a+h) - f(a) - B\cdot h}{|h|} \longrightarrow 0
\]

as \( h \longrightarrow 0. \) The matrix B is unique and is denoted \( D f(a). \)

# Theorem 5.1. Relating directional derivatives to the derivative of \( f \)

Let \( A \subset R^m, f: A\longrightarrow R^n. \) If f is differentiable at \( a, \) then all the directional derivatives of \( f \) at \( a \) exists, and

\[
f'(a; u) = D f(a) \cdot u.
\]
