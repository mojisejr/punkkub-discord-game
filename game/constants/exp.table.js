const csvtojson = require("csvtojson/v2");
const basePath = process.cwd();
const expPath = `${basePath}/game/constants/static/exp.csv`;

// const { Collection } = require("../../database/firestore");
const { getCurrentProfile } = require("../services/userInfo.service");
const {
  updateLevelUp,
} = require("../../database/sqlite/services/sqlite.profile.service");

async function getExpTableFromCSV() {
  const expTable = await csvtojson().fromFile(expPath);
  return expTable;
}

async function checkLevelForEXP(expInput) {
  const table = await getExpTableFromCSV();
  const result = table.filter((data) => data.exp >= expInput);

  if (expInput < result[0].exp) {
    return table[table.length - result.length - 1];
  } else if (expInput >= result[0].exp) {
    return result[0];
  }
}

async function levelUp(discordId, level) {
  if (level == undefined && level == null) return;
  await updateLevelUp(discordId, level);
  // await Collection.Profile.doc(discordId).update({
  //   level: +level,
  // });
}

async function levelUpDiscord(discordId) {
  const { exp, level } = await getCurrentProfile(discordId);
  const levelData = await checkLevelForEXP(exp);
  if (level < levelData.level) {
    await levelUp(discordId, levelData.level);
  } else {
    return;
  }
}

module.exports = {
  levelUpDiscord,
};
