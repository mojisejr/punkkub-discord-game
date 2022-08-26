function calculateWinsRate(wins, count) {
  return Number.parseFloat((wins / count) * 100).toFixed(2);
}

module.exports = {
  calculateWinsRate,
};
