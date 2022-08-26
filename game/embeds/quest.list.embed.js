const { numberToEmoji } = require("../../helper/number.emoji");
function createQuestList(questData = []) {
  if (questData.length <= 0) {
    return {
      result: "error",
      msg: "ไม่มีข้อมูล quest อะไรเลยตอนนี้ 🤖",
    };
  }
  const fields = questData.map((quest) => {
    const questEmoji = numberToEmoji(quest.id);
    return {
      name: `${questEmoji} | ${quest.name}`,
      value: `${quest.description}
        target :[${quest.target}]
        reward :[${quest.rewards}] ${quest.rewardUnit}`,
    };
  });

  embed = {
    color: 0x43e605,
    title: `PunkKub Discord Game Quest List`,
    description: `All Avaliable Quest to do in this world!`,
    fields,
    timestamp: new Date().toISOString(),
    footer: {
      text: "🔫 Punkkub discord game Version 1.0",
    },
  };
  return embed;
}

module.exports = {
  createQuestList,
};
