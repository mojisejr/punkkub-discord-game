const { Collection } = require("../../database/firestore");
const { getCurrentProfile } = require("./userinfo.service");
const { dailyPveLimit, dailyPvpLimit } = require("../constants/gamesetting");

async function updateWinCount(discordId) {
  const { win, fightCount } = await getCurrentProfile(discordId);
  await Collection.Profile.doc(discordId).update({
    win: win + 1,
    fightCount: fightCount + 1,
    lastfightTime: new Date().getTime().toString(),
  });
}

async function updatePVPWinCount(discordId) {
  const { pvpWin, fightCount } = await getCurrentProfile(discordId);
  await Collection.Profile.doc(discordId).update({
    pvpWin: pvpWin + 1,
    fightCount: fightCount + 1,
    lastfightTime: new Date().getTime().toString(),
  });
}

async function updatePVPLoseCount(discordId) {
  const { pvpLost, fightCount } = await getCurrentProfile(discordId);
  await Collection.Profile.doc(discordId).update({
    pvpLost: pvpLost + 1,
    fightCount: fightCount + 1,
    lastfightTime: new Date().getTime().toString(),
  });
}

async function updateLoseCount(discordId) {
  const { lost, fightCount } = await getCurrentProfile(discordId);
  await Collection.Profile.doc(discordId).update({
    lost: lost + 1,
    fightCount: fightCount + 1,
    lastfightTime: new Date().getTime().toString(),
  });
}

async function updatePveCount(discordId) {
  const { dailyPveCount } = await getCurrentProfile(discordId);
  const newCount = dailyPveCount === undefined ? 1 : dailyPveCount + 1;
  await Collection.Profile.doc(discordId).update({
    dailyPveCount: newCount,
  });
}

async function updatePvpCount(discordId) {
  const { dailyPvpCount } = await getCurrentProfile(discordId);
  const newCount = dailyPvpCount === undefined ? 1 : dailyPvpCount + 1;
  await Collection.Profile.doc(discordId).update({
    dailyPvpCount: newCount,
  });
}

async function checkDailyPveLimit(discordId) {
  const { dailyPveCount } = await getCurrentProfile(discordId);
  if (dailyPveCount === undefined) return true;
  if (dailyPveCount < dailyPveLimit) {
    return true;
  } else {
    return false;
  }
}

async function checkDailyPvpLimit(discordId) {
  const { dailyPvpCount } = await getCurrentProfile(discordId);
  if (dailyPvpCount === undefined) return true;
  if (dailyPvpCount < dailyPvpLimit) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  updateWinCount,
  updateLoseCount,
  updatePveCount,
  updatePvpCount,
  updatePVPWinCount,
  updatePVPLoseCount,
  checkDailyPveLimit,
  checkDailyPvpLimit,
};
