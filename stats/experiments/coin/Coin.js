class Coin {
  /**
   *
   * @param {Number} bias number between 0 and 1 giving the probability of
   * turning up H for this coin. E.g. bias = 0.6 means this coin will turn up H
   * 60% of the time on average. Default bias = 0.5, for a fair coin.
   */
  constructor({ bias = 0.5 }) {
    this.bias = bias
  }

  /**
   * Flip this coin.
   * @returns {String} H or T.
   */
  flip() {
    if (Math.random() < this.bias) return "H"
    return "T"
  }
}

module.exports = Coin
