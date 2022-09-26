const { Collection, SubCollection } = require("../../database/firestore");
const { getCurrentProfile } = require("./userInfo.service");

const {
  getCommunityData,
  updateCommunityEXP,
} = require("../../database/sqlite/services/sqlite.community.service");

async function getCurrentGlobalProfile() {
  const data = await getCommunityData();
  return data;
  // const snapshot = await Collection.Community.doc(
  //   SubCollection.Community.Profile
  // ).get();
  // return snapshot.data();
}

async function updateGlobalExp(expInput, discordId) {
  const isValid = await levelCheck(discordId);
  if (!isValid) return 0;
  const total = expInput * 1.5;
  const { exp } = await getCurrentGlobalProfile();
  const newExp = exp + total;
  await updateCommunityEXP(newExp);
  // await Collection.Community.doc(SubCollection.Community.Profile).update({
  //   exp: exp + total,
  // });
  return total;
}

async function levelCheck(discordId) {
  const limit = 5;
  const profile = await getCurrentProfile(discordId);
  if (+profile.level >= limit) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  updateGlobalExp,
};
