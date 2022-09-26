const ActiveQuest = require("../models/active-quest.model");
const { getQuest } = require("./sqlite.quest.service");

async function newActiveQuest(discordId, questId) {
  const quest = await getQuestInActiveList(discordId, questId);
  if (quest == null) {
    const questDetail = await getQuest(questId);
    await ActiveQuest.create({
      discordId,
      questId,
      active: true,
      finished: false,
      target: questDetail.target,
      current: 0,
      onlyOnce: false,
    });
  } else {
    if (!quest.onlyOnce) {
      console.log("already found daliy quest update existing quest!");
      await resetQuestProgress(discordId, questId);
    }
  }
}

async function getAllActiveQuest(discordId) {
  const responses = await ActiveQuest.findAll();
  const quests = responses.map((response) => {
    return activeQuestDataTransform(response);
  });
  return quests;
}

async function getQuestInActiveList(discordId, questId) {
  const found = await ActiveQuest.findOne({
    where: { discordId, questId },
  });
  if (found != null) {
    return activeQuestDataTransform(found);
  } else {
    return null;
  }
}

async function getActiveQuest(discordId, questId) {
  const found = await ActiveQuest.findOne({
    where: { discordId, questId, active: true },
  });
  if (found != null) {
    return activeQuestDataTransform(found);
  } else {
    return null;
  }
}

async function getAllFinishedQuests(discordId) {
  const responses = await ActiveQuest.findAll({ where: { discordId } });
  const finished = responses.map((response) => {
    return activeQuestDataTransform(response);
  });
  return finished;
}

async function getFinishedQuest(discordId, questId) {
  const found = await ActiveQuest.findOne({ where: { discordId, questId } });
  if (found !== null) {
    return activeQuestDataTransform(found);
  } else {
    return null;
  }
}

async function updateQuestProgressCount(discordId, questId) {
  const quest = await getActiveQuest(discordId, questId);
  if (quest != null) {
    const toUpdate =
      quest.current < quest.target ? quest.current + 1 : quest.target;
    console.log("toUpdate: ", toUpdate);
    await ActiveQuest.update(
      { current: toUpdate },
      { where: { discordId, questId } }
    );
  }
}

async function updateFinishQuest(discordId, questId) {
  const quest = await getActiveQuest(discordId, questId);
  if (quest != null && quest.active == true && quest.finished == false) {
    await ActiveQuest.update(
      {
        active: false,
        finished: true,
        current: 0,
      },
      { where: { discordId, questId } }
    );
  }
}

async function forceDeleteQuest(discordId, questId) {
  await ActiveQuest.destroy({ where: { discordId, questId } });
}

async function deleteFinishedQuests(questId) {
  await ActiveQuest.destroy({
    where: { questId, active: false, finished: true, onlyOnce: false },
  });
}

async function deleteFinishedQuest(discordId, questId) {
  await ActiveQuest.destroy({
    where: {
      discordId,
      questId,
      active: false,
      finished: true,
      onlyOnce: false,
    },
  });
}

async function resetQuestProgress(discordId, questId) {
  await ActiveQuest.update(
    {
      active: true,
      current: 0,
      finished: false,
    },
    {
      where: { discordId, questId },
    }
  );
}

async function resetAllQuestProgress(questId) {
  const quest = await ActiveQuest.findAll({ where: { questId } });
  if (quest.length > 0) {
    await ActiveQuest.update(
      {
        current: 0,
        finished: false,
        active: false,
      },
      { where: { questId } }
    );
  }
}

function activeQuestDataTransform(input) {
  if (input == null) {
    return null;
  }

  const data = input.dataValues;

  return {
    discordId: data.discordId,
    questId: data.questId,
    active: data.active,
    finished: data.finished,
    target: data.target,
    current: data.current,
    onlyOnce: data.onlyOnce,
  };
}

module.exports = {
  newActiveQuest,
  getAllActiveQuest,
  getAllFinishedQuests,
  getActiveQuest,
  getFinishedQuest,
  updateQuestProgressCount,
  forceDeleteQuest,
  deleteFinishedQuests,
  deleteFinishedQuest,
  updateFinishQuest,
};
