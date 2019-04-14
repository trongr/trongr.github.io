/**
 * Class to manage coin tossing experiment.
 */
class Experiment {
  /**
   *
   * @param {*} coin the (un)biased coin.
   * @param {*} sampleSize how many experiments to run.
   */
  constructor({ coin, sampleSize }) {
    this.coin = coin
    this.sampleSize = sampleSize
  }

  /**
   *
   * @param {*} history
   * @returns {Number} the number of H's in history.
   */
  static countHeads(history) {
    return history.reduce((sum, item) => (item === "H" ? sum + 1 : sum), 0)
  }

  /**
   * Flip the coin sampleSize times.
   * @returns {[String]} list containing the experiment results. Elements are
   * strings, either H or T.
   */
  run() {
    const history = []
    for (let i = 0; i < this.sampleSize; i++) {
      const headOrTail = this.coin.flip()
      history.push(headOrTail)
    }
    return history
  }
}

module.exports = Experiment
