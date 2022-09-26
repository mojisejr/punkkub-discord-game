const Community = require("../models/community.model");

async function getCommunityData() {
  const found = await Community.findOne({ where: { name: "progress" } });
  if (found != null) {
    return communityDataTranform(found);
  } else {
    const result = await Community.create({
      name: "profile",
      exp: 0,
      level: 0,
    });
    return communityDataTranform(result);
  }
}

async function updateCommunityEXP(exp) {
  await Community.update(
    {
      exp,
    },
    { where: { name: "profile" } }
  );
}

//Helper
function communityDataTranform(input) {
  if (input == null) {
    return null;
  }

  const data = input.dataValues;

  return {
    exp: data.exp,
    level: data.level,
  };
}

module.exports = {
  getCommunityData,
  updateCommunityEXP,
};
