const { COMMANDS } = require("../constants/commands");
const { playGame } = require("../controllers/gameplay.controller");
const {
  getGameProfile,
  addNewProfile,
} = require("../services/userInfo.service");
const { addNewInventory } = require("../services/inventory.service");
const { createBeginStory } = require("../embeds/story.embed");
const {
  addActiveQuestOf,
  getActiveQuestOf,
  getCompletedQuestOf,
} = require("../services/quest.service");
const gamesetting = require("../constants/gamesetting");

//Punk Game initialization process for verified holder
async function beginProcessHandler(interaction, profile, punkkub) {
  const story = createBeginStory();
  // console.log(story);
  if (!interaction.deferred) {
    await interaction.deferReply({ ephemeral: true });
  }
  if (!profile && punkkub != null) {
    console.log(`add new profile data for ${interaction.user.id}`);

    await addNewProfile(interaction.user.id);
    await addNewInventory(interaction.user.id);
    await interaction.editReply({ embeds: [story], ephemeral: true });
    // await interaction.reply("🤗 เรียบร้อย !");
    return;
  } else if (profile) {
    await interaction.editReply({ embeds: [story], ephemeral: true });
    return;
  } else {
    await interaction.editReply({
      content:
        "🤔 punkkub ในกระเป๋าไปไหนหรือเปล่า ? ทำไมหาไม่เจอ อาจจะลืมไว้ในตลาดมะ ?",
      ephemeral: true,
    });
    return;
  }
}
//guestpve interaction handler
async function guestPveProcessHandler(interaction, punkkub) {
  //point for guest who play the game!~
  let point = 0;
  if (punkkub == null && !profile) {
    point = 1;
  }
  const message = await interaction.reply({
    content: "เลือกเลยว่าใครจะชนะ ซ้าย หรือ ขวา ?",
    fetchReply: true,
  });
  await message.react("👈");
  await message.react("👉");
  const filter = (reaction, user) =>
    (reaction.emoji.name === "👈" || reaction.emoji.name === "👉") && !user.bot;
  message
    .awaitReactions({ filter, max: 1, time: 6000 })
    .then((collected) => {
      const msg = collected.first();
      const selectedSide = msg.users.reaction.emoji.name;
      playGame(COMMANDS.GPVE, null, interaction.user.id, selectedSide);
    })
    .catch(async (e) => {
      // console.log(e);
      await message.reply("💥 ตัดสินใจช้าเหลือเกิน ! เอาใหม่ๆ");
    });
}

//get profile interaction handler
async function punkProfileHandler(interaction, punkkub) {
  if (punkkub != null) {
    const embed = await getGameProfile(interaction);
    //ephemeral for only seen by executor
    await interaction.reply({ embeds: [embed], ephemeral: true });
  } else {
    await interaction.reply({
      content:
        "🤔 punkkub ในกระเป๋าไปไหนหรือเปล่า ? ทำไมหาไม่เจอ อาจจะลืมไว้ในตลาดมะ ?",
      ephemeral: true,
    });
  }
}

//get quest handler
async function getQuestHandler(hasPunk, interaction) {
  if (!interaction.deferred) {
    await interaction.deferReply({ ephemeral: true });
  }
  const selected = interaction.options.data[0].value;
  if (hasPunk && selected != null) {
    const active = await getActiveQuestOf(interaction.user.id, selected);
    const doneDaliyQuest = await checkDaliyQuest(interaction.user.id, selected);
    if (active.data != null && active.data.progress >= 0) {
      await interaction.editReply({
        content: `🤔 รับเควสนี้ไปแล้วนี่ !!`,
        ephemeral: true,
      });
      return;
    }
    if (doneDaliyQuest !== undefined && doneDaliyQuest.result) {
      await interaction.editReply({
        content: "👿 Daliy Quest เสร็จไปแล้วนี่ มารับใหม่พรุ่งนี้นะ",
      });
      return;
    }
    await addActiveQuestOf(interaction.user.id, selected);
    await interaction.editReply({
      content: `🧨 ไปลุยกันเลยดีกว่า !`,
      ephemeral: true,
    });
    return;
  } else {
    await interaction.editReply({
      content:
        "🤔 punkkub ในกระเป๋าไปไหนหรือเปล่า ? ทำไมหาไม่เจอ อาจจะลืมไว้ในตลาดมะ ?",
      ephemeral: true,
    });
    return;
  }
}

async function checkDaliyQuest(discordId, inputQuestId) {
  const dailyQuests = gamesetting.daliyQuestsId;
  const result = await Promise.all(
    dailyQuests.map(async (questId) => {
      const completed = await getCompletedQuestOf(discordId, questId);
      if (completed !== undefined && questId == inputQuestId) {
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

module.exports = {
  beginProcessHandler,
  guestPveProcessHandler,
  getQuestHandler,
  punkProfileHandler,
};
