/**
 * Solve the ODE dx/dt = x with x = 1 at t = 0. The analytical solution is
 *
 *  x = e^t.
 *
 * With h = 0.00001, the solution at t = tmax = 1 is
 *
 *  x = 2.7182682371744953 = e === 2.7182...
 *
 * up to 4 decimal places.
 */
function solve() {
  const h = 0.00001
  const tmax = 1
  let t = 0
  let x = 1
  while (Math.abs(t - tmax) > h) {
    x = x + h * x
    t = t + h
    console.log(`t = ${t}, x = ${x}`)
  }
}

/**
 * Solve an ODE using Euler's Method.
 */
function main() {
  solve()
}

if (require.main === module) {
  main()
}
