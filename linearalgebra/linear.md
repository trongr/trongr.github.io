# Linear Algebra

# Orthogonal matrix

Definition. A matrix \( Q \) is orthogonal iff its columns are orthonormal, IOW,

\[
Q^{T} Q = I.
\]

Corollary. If \( Q \) is an orthogonal matrix, then its inverse is its transpose.

Corollary. If \( Q \) is an orthogonal matrix, then

\[
\det Q = \pm 1.
\]

Proof.

\[
\begin{aligned}
1 &= \det I \\
  &= \det(Q^{T} Q) \\
  &= \det Q^{T} \det Q \\
  &= \det Q \det Q \\
  &= (\det Q)^{2} \\
\end{aligned}
\]

Therefore \( \det Q = \pm 1. \)

NOTE. This is why people like orthogonal matrices, because they're easy to invert.

Theorem. If \( Q \) is orthonormal, then

\[
Q^{T} Q = Q Q^{T} = I.
\]

Proof. Recall that \( Q^{T} = Q^{-1}, \) and inverses commute with each other, i.e.

\[
Q^{T} Q = Q Q^{T}.
\]

Theorem. If the columns of a square matrix are orthonormal, then its rows are also orthonormal, and vice versa.

Exercise. Find an orthogonal matrix whose first row is \( (\frac{1}{3}, \frac{2}{3}, \frac{2}{3}). \)

Solution. Find two other independent vectors by trial and error, then use Gram-Schmidt to orthogonalize the set, then normalize to get orthonormal set.

# Normal Matrix

Theorem. A matrix is normal iff it is unitarily diagonalizable.

Exercise. Let \( A \) be an \( n \times n \) real symmetric or complex normal matrix. Prove that

\[
\det A = \prod_{i=1}^n \lambda_i,
\]

where the \( \lambda_i \)s are the (not necessarily distinct) eigenvalues of \( A. \)

Solution. Recall that a symmetric / normal matrix is diagonalizable, i.e. it is similar to a diagonal matrix. IOW there are matrices \( P \) and \( P^* \) s.t.

\[
P A P^* = D.
\]

Then

\[
\det A = \det (P A P^*) = \det D = \prod \lambda_i.
\]