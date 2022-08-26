const gamesetting = require("../constants/gamesetting");
//Level machanic controller
function calculateEXP(fightingCount) {
  const rand = Math.random();
  const { l1, l2, l3 } = gamesetting.fightingParams.counter;
  let calculated = 0;

  //TODO : move all settings to Database
  if (fightingCount <= l1.count) {
    calculated = Math.floor(rand * l1.rate) + 1;
  } else if (fightingCount > l1.count && fightingCount <= l2.count) {
    calculated = Math.floor(rand * l2.rate) + 1;
  } else if (fightingCount > l3.count) {
    calculated = Math.floor(rand * l3.rate) + 1;
  }
  calculated = calculated * gamesetting.fightingParams.multiplier;
  return calculated;
}

function calculateGlobalEXP(exp) {
  return Math.floor((exp = exp / gamesetting.globalParams.multiplier));
}

module.exports = {
  calculateEXP,
  calculateGlobalEXP,
};
