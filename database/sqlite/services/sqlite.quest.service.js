const Quest = require("../models/quest.model");

async function getAllQuest() {
  const responses = await Quest.findAll();
  const quests = responses.map((response) => {
    return questDataTransform(response);
  });
  return quests;
}

async function getQuest(id) {
  const found = await Quest.findOne({ where: { id } });
  if (found != null) {
    return questDataTransform(found);
  } else {
    return null;
  }
}

function questDataTransform(input) {
  if (input == null) {
    return null;
  }
  const data = input.dataValues;
  return {
    id: data.id,
    collection: data.collection,
    description: data.description,
    globalReward: data.globalReward,
    name: data.name,
    rewardUnit: data.rewardUnit,
    rewards: data.rewards,
    target: data.target,
    timeout: data.timeout,
    type: data.type,
  };
}

module.exports = {
  getAllQuest,
  getQuest,
};
