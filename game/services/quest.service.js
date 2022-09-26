const { Collection, SubCollection } = require("../../database/firestore");
const { updateExpDiscord } = require("./userInfo.service");
const gamesetting = require("../constants/gamesetting");

//SQLITE
const {
  getAllQuest,
  getQuest,
} = require("../../database/sqlite/services/sqlite.quest.service");

const {
  newActiveQuest,
  getAllActiveQuest,
  getActiveQuest,
  updateQuestProgressCount,
  forceDeleteQuest,
  deleteFinishedQuests,
  deleteFinishedQuest,
  getAllFinishedQuests,
  getFinishedQuest,
  updateFinishQuest,
} = require("../../database/sqlite/services/sqlite.active-quest.service");

// async function getAllQuests() {
//   const snapshot = await Collection.Quests.get();
//   return snapshot.docs.map((doc) => {
//     return {
//       id: doc.id,
//       ...doc.data(),
//     };
//   });
// }

async function getAllQuests() {
  const quests = await getAllQuest();
  return quests;
}

async function getQuestById(questId) {
  const quest = await getQuest(questId);
  return quest;
  // const snapshot = await Collection.Quests.doc(questId.toString()).get();
  // return {
  //   id: snapshot.id,
  //   data: snapshot.data() === undefined ? null : snapshot.data(),
  // };
}
async function addActiveQuestOf(discordId, questId) {
  await newActiveQuest(discordId, questId);
  // await Collection.Profile.doc(discordId)
  //   .collection(SubCollection.Profile.ActiveQuests)
  //   .doc(questId.toString())
  //   .set({ progress: 0 });
}

async function getActiveQuestsOf(discordId) {
  const quests = await getAllActiveQuest(discordId);
  return quests;
  // const snapshot = await Collection.Profile.doc(discordId)
  //   .collection(SubCollection.Profile.ActiveQuests)
  //   .get();
  // return snapshot.docs.map((quest) => {
  //   return {
  //     id: quest.id,
  //     ...quest.data(),
  //   };
  // });
}

async function getActiveQuestOf(discordId, questId) {
  const quest = await getActiveQuest(discordId, questId);
  return quest;
  // const quest = await Collection.Profile.doc(discordId)
  //   .collection(SubCollection.Profile.ActiveQuests)
  //   .doc(questId.toString())
  //   .get();
  // return {
  //   id: quest.id,
  //   data: quest.data() === undefined ? null : quest.data(),
  // };
}

async function updateActiveQuestOf(discordId, questId, progress) {
  await updateQuestProgressCount(discordId, questId);
  // await Collection.Profile.doc(discordId)
  //   .collection(SubCollection.Profile.ActiveQuests)
  //   .doc(questId.toString())
  //   .set({
  //     progress: progress === undefined ? 1 : +progress + 1,
  //   });
}

async function deleteActiveQuestOf(discordId, questId) {
  await deleteFinishedQuest(discordId, questId);
  // await Collection.Profile.doc(discordId)
  //   .collection(SubCollection.Profile.ActiveQuests)
  //   .doc(questId.toString())
  //   .delete();
}

async function getCompletedQuestsOf(discordId) {
  const finished = getAllFinishedQuests(discordId);
  if (finished.length <= 0) {
    return [];
  } else {
    return finished;
  }
  // const snapshot = await Collection.Profile.doc(discordId)
  //   .collection(SubCollection.Profile.CompletedQuests)
  //   .get();

  // if (data != null || data != undefined) {
  //   return snapshot.docs.map((quest) => {
  //     return { id: quest.id, ...quest.data() };
  //   });
  // } else {
  //   return [];
  // }
}

async function getCompletedQuestOf(discordId, questId) {
  const finished = getFinishedQuest(discordId, questId);
  return finished;
  // const snapshot = await Collection.Profile.doc(discordId)
  //   .collection(SubCollection.Profile.CompletedQuests)
  //   .doc(questId.toString())
  //   .get();
  // const completed = snapshot.data();
  // return {
  //   id: questId,
  //   data: completed === undefined ? null : completed,
  // };
}

async function updateCompletedQuestOf(discordId, questId) {
  await updateFinishQuest(discordId, questId);
  // await Collection.Profile.doc(discordId)
  //   .collection(SubCollection.Profile.CompletedQuests)
  //   .doc(questId.toString())
  //   .set({
  //     count: count === null ? 1 : count + 1,
  //   });
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
  if (currentProgress === null) {
    return {
      result: false,
      msg: ``,
    };
  }
  const isCompleted = await getQuestProgress(
    currentProgress.target,
    currentProgress.current
  );
  if (isCompleted) {
    // const completed = await getCompletedQuestOf(discordId, questId);
    // const count = completed.data == null ? 0 : completed.data;
    await updateCompletedQuestOf(discordId, questId);
    await updateExpDiscord(discordId, quest.rewards);
    await updateFinishQuest(discordId, questId);
    // await deleteActiveQuestOf(discordId, questId);
    return {
      result: true,
      msg: `💪 ${quest.name} สำเร็จ ! ${quest.rewards} ${quest.rewardUnit}`,
    };
  } else {
    await updateActiveQuestOf(discordId, questId);
    return {
      result: false,
      msg: `😇 ${quest.name} : ทำไปแล้ว ${currentProgress.current + 1} | ${
        quest.target
      }`,
    };
  }
}

async function checkDaliyQuest(discordId, inputQuestId) {
  const dailyQuests = gamesetting.daliyQuestsId;
  const result = await Promise.all(
    dailyQuests.map(async (questId) => {
      const completed = await getCompletedQuestOf(discordId, questId);
      if (
        // completed !== undefined &&
        // completed.data != null &&
        completed != null &&
        completed.active == false &&
        completed.finished == true &&
        questId == inputQuestId
      ) {
        return {
          //cannot get quest
          id: questId,
          result: true,
        };
      }
    })
  );
  const found = result.find((mapped) => mapped !== undefined);
  return found;
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
  checkDaliyQuest,
};
