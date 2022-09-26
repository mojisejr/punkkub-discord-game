const { Collection } = require("../../database/firestore");
const { getCurrentProfile } = require("./userinfo.service");
const { dailyPveLimit, dailyPvpLimit } = require("../constants/gamesetting");

//SQLITE
const {
  updateWinByDiscordId,
  updatePveDaliyDiscordId,
  updateLoseByDiscordId,
  updatePvpDaliyDiscordId,
  updatePvpWinByDiscordId,
  updatePvpLoseByDiscordId,
  updateFightingCounter,
} = require("../../database/sqlite/services/sqlite.profile.service");

// async function updateWinCount(discordId) {
//   const { win, fightCount } = await getCurrentProfile(discordId);
//   await Collection.Profile.doc(discordId).update({
//     win: win + 1,
//     fightCount: fightCount + 1,
//     lastfightTime: new Date().getTime().toString(),
//   });
// }
async function updateWinCount(discordId) {
  const { win, fightCount } = await getCurrentProfile(discordId);
  const newWin = win + 1;
  const newFight = fightCount + 1;
  await updateWinByDiscordId(discordId, newWin);
  await updateFightingCounter(discordId, newFight);
}

// async function updatePVPWinCount(discordId) {
//   const { pvpWin, fightCount } = await getCurrentProfile(discordId);
//   await Collection.Profile.doc(discordId).update({
//     pvpWin: pvpWin + 1,
//     fightCount: fightCount + 1,
//     lastfightTime: new Date().getTime().toString(),
//   });
// }
async function updatePVPWinCount(discordId) {
  const { pvpWin, fightCount } = await getCurrentProfile(discordId);
  const newWin = pvpWin + 1;
  const newFight = fightCount + 1;
  await updatePvpWinByDiscordId(discordId, newWin);
  await updateFightingCounter(discordId, newFight);
}

// async function updatePVPLoseCount(discordId) {
//   const { pvpLost, fightCount } = await getCurrentProfile(discordId);
//   await Collection.Profile.doc(discordId).update({
//     pvpLost: pvpLost + 1,
//     fightCount: fightCount + 1,
//     lastfightTime: new Date().getTime().toString(),
//   });
// }
async function updatePVPLoseCount(discordId) {
  const { pvpLost, fightCount } = await getCurrentProfile(discordId);
  const newLost = pvpLost + 1;
  const newFight = fightCount + 1;
  await updatePvpLoseByDiscordId(discordId, newLost);
  await updateFightingCounter(discordId, newFight);
}

// async function updateLoseCount(discordId) {
//   const { lost, fightCount } = await getCurrentProfile(discordId);
//   await Collection.Profile.doc(discordId).update({
//     lost: lost + 1,
//     fightCount: fightCount + 1,
//     lastfightTime: new Date().getTime().toString(),
//   });
// }

async function updateLoseCount(discordId) {
  const { lost, fightCount } = await getCurrentProfile(discordId);
  const newLost = lost + 1;
  const newFight = fightCount + 1;
  await updateLoseByDiscordId(discordId, newLost);
  await updateFightingCounter(discordId, newFight);
}

// async function updatePveCount(discordId) {
//   const { dailyPveCount } = await getCurrentProfile(discordId);
//   const newCount = dailyPveCount === undefined ? 1 : dailyPveCount + 1;
//   await Collection.Profile.doc(discordId).update({
//     dailyPveCount: newCount,
//   });
// }

async function updatePveCount(discordId) {
  const { dailyPveCount } = await getCurrentProfile(discordId);
  const newCount = dailyPveCount === undefined ? 1 : dailyPveCount + 1;
  await updatePveDaliyDiscordId(discordId, newCount);
}

// async function updatePvpCount(discordId) {
//   const { dailyPvpCount } = await getCurrentProfile(discordId);
//   const newCount = dailyPvpCount === undefined ? 1 : dailyPvpCount + 1;
//   await Collection.Profile.doc(discordId).update({
//     dailyPvpCount: newCount,
//   });
// }

async function updatePvpCount(discordId) {
  const { dailyPvpCount } = await getCurrentProfile(discordId);
  const newCount = dailyPvpCount === undefined ? 1 : dailyPvpCount + 1;
  await updatePvpDaliyDiscordId(discordId, newCount);
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
