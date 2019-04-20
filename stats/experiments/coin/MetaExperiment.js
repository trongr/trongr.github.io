const Coin = require("./Coin")
const Experiment = require("./Experiment")

/**
 * Runs multiple experiments.
 */
class MetaExperiment {
  constructor({ bias, sampleSize }) {
    this.config = {
      bias,
      sampleSize,
    }
  }

  /**
   * Run numExperiments
   * @param {Number} numExperiments
   * @returns history
   */
  run(numExperiments, showHist = false) {
    const { bias, sampleSize } = this.config
    const history = []

    for (let i = 0; i < numExperiments; i++) {
      const coin = new Coin({ bias })
      const exp = new Experiment({ coin, sampleSize })

      const hist = exp.run()

      const headCount = Experiment.countHeads(hist)
      const tailCount = sampleSize - headCount
      const headRatio = headCount / sampleSize
      const tailRatio = tailCount / sampleSize
      const observedBias = headRatio
      const trueBias = bias
      const biasErr = Math.abs(trueBias - observedBias)

      let result = {
        headCount,
        tailCount,
        headRatio,
        tailRatio,
        observedBias,
        trueBias,
        biasErr,
      }

      if (showHist) {
        result = {
          history: hist.join(""),
          ...result,
        }
      }

      history.push(result)
    }

    return history
  }
}

module.exports = MetaExperiment
