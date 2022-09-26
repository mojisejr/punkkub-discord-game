const Profile = require("../models/profile.model");

const InitialProfile = {
  dailyPveCount: 0,
  dailyPvpCount: 0,
  exp: 0,
  fightCount: 0,
  lastfightTime: "",
  level: 0,
  win: 0,
  lost: 0,
  pvpWin: 0,
  pvpLost: 0,
};

async function createNewProfile(discordId) {
  const profile = await Profile.create({
    discordId,
    ...InitialProfile,
  });
  return profile;
}

async function getAllProfile() {
  const profiles = await Profile.findAll();
  return profiles;
}

async function getProfileByDiscordId(discordId) {
  const response = await Profile.findAll({
    where: {
      discordId,
    },
  });
  const profile = response.length > 0 ? response[0].dataValues : null;
  return profile;
}

async function updateExpByDiscordId(discordId, newExp) {
  const response = await Profile.update(
    { exp: newExp },
    {
      where: {
        discordId,
      },
    }
  );
}

async function updateLevelUp(discordId, newLevel) {
  const response = await Profile.update(
    { level: newLevel },
    {
      where: {
        discordId,
      },
    }
  );
}

async function updateWinByDiscordId(discordId, win) {
  await Profile.update(
    { win, lastfightTime: new Date().getTime().toString() },
    {
      where: { discordId },
    }
  );
}

async function updatePvpWinByDiscordId(discordId, pvpWin) {
  await Profile.update(
    { pvpWin, lastfightTime: new Date().getTime().toString() },
    {
      where: { discordId },
    }
  );
}

async function updateLoseByDiscordId(discordId, lost) {
  await Profile.update(
    { lost, lastfightTime: new Date().getTime().toString() },
    {
      where: { discordId },
    }
  );
}

async function updatePvpLoseByDiscordId(discordId, pvpLost) {
  await Profile.update(
    { pvpLost, lastfightTime: new Date().getTime().toString() },
    {
      where: { discordId },
    }
  );
}

async function updatePveDaliyDiscordId(discordId, dailyPveCount) {
  await Profile.update(
    { dailyPveCount, lastfightTime: new Date().getTime().toString() },
    {
      where: { discordId },
    }
  );
}

async function updatePvpDaliyDiscordId(discordId, dailyPvpCount) {
  await Profile.update(
    { dailyPvpCount, lastfightTime: new Date().getTime().toString() },
    {
      where: { discordId },
    }
  );
}

async function updateFightingCounter(discordId, fightCount) {
  await Profile.update(
    { fightCount, lastfightTime: new Date().getTime().toString() },
    {
      where: { discordId },
    }
  );
}

module.exports = {
  createNewProfile,
  getProfileByDiscordId,
  getAllProfile,
  updateExpByDiscordId,
  updateLevelUp,
  updateWinByDiscordId,
  updatePveDaliyDiscordId,
  updateLoseByDiscordId,
  updatePvpDaliyDiscordId,
  updatePvpWinByDiscordId,
  updatePvpLoseByDiscordId,
  updateFightingCounter,
};
