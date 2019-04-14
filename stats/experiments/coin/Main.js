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

  const [, , bias, sampleSize, numExperiments] = process.argv
  const meta = new MetaExperiment({ bias, sampleSize })
  const hist = meta.run(numExperiments, showHist)

  const maxRatioDiff = _.maxBy(hist, (exp) => exp.ratioDiff).ratioDiff * 100
  const maxBiasDiff = _.maxBy(hist, (exp) => exp.biasDiff).biasDiff * 100

  console.log("History:", hist)
  console.log("")

  console.log(`Max Abs Ratio Diff: ${maxRatioDiff}%`)
  console.log(`Max Abs Bias Diff: ${maxBiasDiff}%`)
}

if (require.main === module) {
  main()
}
