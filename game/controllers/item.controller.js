//Item Mechanic controller
const gamesetting = require("../constants/gamesetting");
function itemUseTrigger() {
  let rand = Math.floor(Math.random() * 100) + 1;
  //TODO : move to DB
  if (rand < gamesetting.itemParams.dropRate) return true;
}

function randomItemFromWallet(items = []) {
  if (items.length <= 0) return;
  const position = Math.floor(Math.random() * items.length);
  return items[position];
}

function randomResource(resource = []) {
  console.log("input resource length", resource.length);
  if (resource.length <= 0) return;
  const position = Math.floor(Math.random() * resource.length);
  return resource[position];
}

function randomAmounts(fightingCount) {
  const rand = Math.random();
  const { l1, l2, l3 } = gamesetting.itemParams.counter;
  let calculated = 0;
  if (fightingCount <= l1.count) {
    calculated = Math.floor(rand * l1.rate) + 1;
  } else if (fightingCount > l1.count && fightingCount <= l2.count) {
    calculated = Math.floor(rand * l2.rate) + 1;
  } else if (fightingCount > l3.count) {
    calculated = Math.floor(rand * l3.rate) + 1;
  }
  calculated = calculated * gamesetting.itemParams.multiplier;
  return calculated;
}

module.exports = {
  itemUseTrigger,
  randomItemFromWallet,
  randomResource,
  randomAmounts,
};
