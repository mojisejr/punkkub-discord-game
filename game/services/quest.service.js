const { Collection, SubCollection } = require("../../database/firestore");
const { updateExpDiscord } = require("./userInfo.service");

async function getAllQuests() {
  const snapshot = await Collection.Quests.get();
  return snapshot.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });
}

async function getQuestById(questId) {
  const snapshot = await Collection.Quests.doc(questId.toString()).get();
  return {
    id: snapshot.id,
    data: snapshot.data() === undefined ? null : snapshot.data(),
  };
}
async function addActiveQuestOf(discordId, questId) {
  await Collection.Profile.doc(discordId)
    .collection(SubCollection.Profile.ActiveQuests)
    .doc(questId.toString())
    .set({ progress: 0 });
}

async function getActiveQuestsOf(discordId) {
  const snapshot = await Collection.Profile.doc(discordId)
    .collection(SubCollection.Profile.ActiveQuests)
    .get();
  return snapshot.docs.map((quest) => {
    return {
      id: quest.id,
      ...quest.data(),
    };
  });
}

async function getActiveQuestOf(discordId, questId) {
  const quest = await Collection.Profile.doc(discordId)
    .collection(SubCollection.Profile.ActiveQuests)
    .doc(questId.toString())
    .get();
  return {
    id: quest.id,
    data: quest.data() === undefined ? null : quest.data(),
  };
}

async function updateActiveQuestOf(discordId, questId, progress) {
  await Collection.Profile.doc(discordId)
    .collection(SubCollection.Profile.ActiveQuests)
    .doc(questId.toString())
    .set({
      progress: progress === undefined ? 1 : +progress + 1,
    });
}

async function deleteActiveQuestOf(discordId, questId) {
  await Collection.Profile.doc(discordId)
    .collection(SubCollection.Profile.ActiveQuests)
    .doc(questId.toString())
    .delete();
}

async function getCompletedQuestsOf(discordId) {
  const snapshot = await Collection.Profile.doc(discordId)
    .collection(SubCollection.Profile.CompletedQuests)
    .get();

  if (data != null || data != undefined) {
    return snapshot.docs.map((quest) => {
      return { id: quest.id, ...quest.data() };
    });
  } else {
    return [];
  }
}

async function getCompletedQuestOf(discordId, questId) {
  const snapshot = await Collection.Profile.doc(discordId)
    .collection(SubCollection.Profile.CompletedQuests)
    .doc(questId.toString())
    .get();
  const completed = snapshot.data();
  return {
    id: questId,
    data: completed === undefined ? null : completed,
  };
}

async function updateCompletedQuestOf(discordId, questId, count) {
  await Collection.Profile.doc(discordId)
    .collection(SubCollection.Profile.CompletedQuests)
    .doc(questId.toString())
    .set({
      count: count === null ? 1 : count + 1,
    });
}

async function getQuestProgress(target, currentProgress) {
  let totalProgress = currentProgress + 1;
  if (totalProgress >= target) {
    return true;
  } else {
    return false;
  }
}

async function updateQuestProgress(discordId, questId, ...params) {
  const currentProgress = await getActiveQuestOf(discordId, questId);
  const quest = await getQuestById(questId);
  if (currentProgress.data === null) {
    return {
      result: false,
      msg: ``,
    };
  }
  const isCompleted = await getQuestProgress(
    quest.data.target,
    currentProgress.data.progress
  );
  if (isCompleted) {
    const completed = await getCompletedQuestOf(discordId, questId);
    const count = completed.data == null ? 0 : completed.data;
    await updateCompletedQuestOf(discordId, questId, count);
    await updateExpDiscord(discordId, quest.data.rewards);
    await deleteActiveQuestOf(discordId, questId);
    return {
      result: true,
      msg: `💪 ${quest.data.name} สำเร็จ ! ${quest.data.rewards} ${quest.data.rewardUnit}`,
    };
  } else {
    await updateActiveQuestOf(
      discordId,
      questId,
      currentProgress.data.progress
    );
    return {
      result: false,
      msg: `😇 ${quest.data.name} : ทำไปแล้ว ${
        currentProgress.data.progress + 1
      } | ${quest.data.target}`,
    };
  }
}

// updateQuestProgress("641295732384464906", 1);

module.exports = {
  getAllQuests,
  addActiveQuestOf,
  getActiveQuestsOf,
  getActiveQuestOf,
  getCompletedQuestOf,
  getCompletedQuestsOf,
  updateActiveQuestOf,
  deleteActiveQuestOf,
  updateCompletedQuestOf,
  getQuestProgress,
  updateQuestProgress,
};
