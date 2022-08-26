const { Collection } = require("./firestore");

async function logFighting(winId, lostId, counter, timestamp, mode) {
  if ((winId != null && lostId != null, counter > 0)) {
    console.log("saving figthing log");
    await Collection.FightingLog.add({
      win: winId,
      lost: lostId,
      counter,
      timestamp,
      mode,
    });
  } else {
    console.log("error");
    return;
  }
}

module.exports = {
  logFighting,
};
