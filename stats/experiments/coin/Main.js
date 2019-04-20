const _ = require("lodash")
const MetaExperiment = require("./MetaExperiment")

/**
 * Run a coin experiment.
 */
function main() {
  if (process.argv.length !== 5) {
    console.trace("USAGE. node Main.js bias sampleSize numExperiments")
    process.exit()
  }
  const showHist = true

  let [, , bias, sampleSize, numExperiments] = process.argv
  bias = parseFloat(bias)
  sampleSize = parseInt(sampleSize)
  numExperiments = parseInt(numExperiments)

  const meta = new MetaExperiment({ bias, sampleSize })
  const hist = meta.run(numExperiments, showHist)

  const maxBiasErrExp = _.maxBy(hist, (exp) => exp.biasErr)
  const maxBiasErr = 100 * maxBiasErrExp.biasErr
  const avgBiasErr = (100 * _.sumBy(hist, (exp) => exp.biasErr)) / hist.length

  console.log("History:", JSON.stringify(hist, null, 4))
  console.log("")

  console.log(
    "Experiment with max abs bias error:",
    JSON.stringify(maxBiasErrExp, null, 4),
  )
  console.log("")

  console.log(`Max abs bias error: ${maxBiasErr}%`)
  console.log(`Avg abs bias error: ${avgBiasErr}%`)
}

if (require.main === module) {
  main()
}
