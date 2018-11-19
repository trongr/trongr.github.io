# Analysis

# Reference

- Munkres Analysis on Manifolds
- Spivak Analysis

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

as \( h \longrightarrow 0. \) The matrix B is unique and is denoted \( D f(a). \) Sometimes people also call the derivative the gradient, and write \( D f(a) = \nabla f(a). \)

# Theorem 5.1. Relating directional derivatives to the derivative of \( f \)

Let \( A \subset R^m, f: A\longrightarrow R^n. \) If f is differentiable at \( a, \) then all the directional derivatives of \( f \) at \( a \) exists, and

\[
f'(a; u) = D f(a) \cdot u.
\]

# Definition. Partial derivative

Let \( A \subset R^m, f: A \longrightarrow R. \) Define the \( j \)-th partial derivative of \( f \) at \( a \) to be directional derivative of \( f \) at \( a \) with respect to the vector \( e_j, \) provided it exists; and we denote it by \( D_j f(a): \)

\[
D_j f(a) = \lim_{t\to 0} \frac{f(a + t e_j) - f(a)}{t}.
\]

Note that if we define \( \phi(t) = f(a_1,\ldots, a_{j-1}, t, a_{j+1},\ldots,a_m), \) then

\[
D_j f(a) = \phi'(a_j).
\]

# Theorem 5.3.

Let \( A \subset R^m, f: A \longrightarrow R. \) If \( f \) is differentiable at \( a, \) then the derivative of \( f \) is the row matrix

\[
Df(a) = [D_1 f(a) \quad \cdots \quad D_m f(a)].
\]

# Theorem 5.4.

Let \( A \subset R^m, f: A \longrightarrow R^n. \) Suppose \( A \) contains a neighbourhood of \( a. \) Let \( f_i: A \longrightarrow R \) be the \( i \)-th component function of \( f, \) so that

\[
f(x) = \begin{bmatrix}
f_1 (x) \\
\vdots \\
f_n (x)
\end{bmatrix}.
\]

- Then \( f \) is differentiable at \( a \) iff each component \( f_i \) is differentiable at \( a. \)

- If \( f \) is differentiable at \( a, \) then its derivative is the \( n \times m \) matrix whose \( i \)-th row is the derivative of \( f_i,  \) i.e.

\[
D f(a) = \begin{bmatrix}
D f_1 (a) \\
\vdots \\
D f_n (a)
\end{bmatrix} = \begin{bmatrix}
D_1 f_1 (a) & \cdots & D_m f_1 (a) \\
\vdots & & \vdots \\
D_1 f_n (a) & \cdots & D_m f_n (a)
\end{bmatrix}.
\]

This matrix is called the Jacobian matrix of \( f. \)

Roughly: Differentiability of \( f: R^m \longrightarrow R^n \) is equivalent to differentiability of each component, because the components are independent of each other as far as taking limits is concerned.