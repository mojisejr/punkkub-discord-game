const { Collection } = require("../../database/firestore");
const { calculateWinsRate } = require("../utils/calculatewinrate");
const { createProfileEmbed } = require("../embeds/profile.embed");
const { getAllMappedResourceFromInventory } = require("./inventory.service");

///SQLITE
const {
  createNewProfile,
  getProfileByDiscordId,
  updateExpByDiscordId,
} = require("../../database/sqlite/services/sqlite.profile.service");

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

//FIREBASE
// async function addNewProfile(discordId) {
//   await Collection.Profile.doc(discordId).set({
//     ...InitialProfile,
//   });
// }

async function addNewProfile(discordId) {
  await createNewProfile(discordId);
  console.log("profile for created: ", discordId);
}

// async function hasProfile(discordId) {
//   const profile = await getCurrentProfile(discordId);
//   return profile === undefined ? false : true;
// }

async function hasProfile(discordId) {
  const profile = await getCurrentProfile(discordId);
  return profile === null ? false : true;
}

// async function getCurrentProfile(discordId) {
//   return (await Collection.Profile.doc(discordId).get()).data();
// }

async function getCurrentProfile(discordId) {
  return await getProfileByDiscordId(discordId);
}

// async function updateExpDiscord(discordId, newExp) {
//   const { exp } = await getCurrentProfile(discordId);

//   await Collection.Profile.doc(discordId).update({
//     exp: +exp + newExp,
//   });
// }

async function updateExpDiscord(discordId, newExp) {
  const { exp } = await getCurrentProfile(discordId);
  console.log("previous exp", exp);
  const calculatedEXP = exp + newExp;
  await updateExpByDiscordId(discordId, calculatedEXP);
}

async function getGameProfile(interaction) {
  //1 get Discord ID
  //2 get Profile From Database
  //3 calculate win rate (wins / fightcount) * 100 = percentage
  //4 give data to embed function
  //5 reply to user as embed
  let profile = await getCurrentProfile(interaction.user.id);
  let resources = await getAllMappedResourceFromInventory(interaction.user.id);
  //transform data;
  profile = {
    ...profile,
    ...interaction.user,
    avatarURL: interaction.user.avatarURL(),
    winrate: calculateWinsRate(profile.win, profile.win + profile.lost),
    pvpWinrate: calculateWinsRate(
      profile.pvpWin,
      profile.pvpWin + profile.pvpLost
    ),
    resources,
  };
  // console.log(profile);
  const embed = createProfileEmbed(profile);
  return embed;
}

module.exports = {
  addNewProfile,
  hasProfile,
  getCurrentProfile,
  getGameProfile,
  updateExpDiscord,
};
