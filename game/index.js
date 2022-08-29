/**
 * @dev: game index.js (main entrance of all modules)
 * @notice: playGame is game mode selector and game execution
 */

const { bot } = require("../discord.bot");
const { COMMANDS } = require("./constants/commands");
const { playGame } = require("./controllers/gameplay.controller");
const { getPunkByDiscordId } = require("../database/verify.service");
const { hasProfile } = require("./services/userInfo.service");
const { getAllQuests } = require("./services/quest.service");
const { createQuestList } = require("./embeds/quest.list.embed");
const { createAnnouncement } = require("./embeds/announcement.embed");
const {
  hasPunkInWallet,
} = require("./controllers/smartcontracts/punkkub.controller");
const {
  beginProcessHandler,
  guestPveProcessHandler,
  punkProfileHandler,
  getQuestHandler,
} = require("./controllers/command.controller");
const sequelize = require("../database/sqlite/sqlite.database");
const { getAllProfileData } = require("./services/leaderboard.service");
const { log } = require("../database/csv.log.service");
const gamesetting = require("./constants/gamesetting");

sequelize.sync().then(() => console.log("state is now ready"));

bot.on("interactionCreate", async (interaction) => {
  //checking game state
  const status = gamesetting.status;
  const announcement = createAnnouncement();
  const interactionName = interaction.commandName;
  if (
    status == 0 &&
    interactionName != "gupunk" &&
    interactionName != "reverify"
  ) {
    await interaction.reply({
      embeds: [announcement],
      ephemeral: true,
    });
    return;
  }
  try {
    //INFORMATION PREPARING
    const id = interaction.user.id;
    const punkkub = await getPunkByDiscordId(id);
    const profile = await hasProfile(id);
    const hasPunk =
      punkkub == null ? false : await hasPunkInWallet(punkkub.wallet);

    await log(
      `${id} interaction command name ${interaction.commandName} input [${
        interaction.options.data.length <= 0
          ? "N/A"
          : interaction.options.data[0].value
      }]`,
      "interaction",
      "interaction level",
      false
    );

    //check punk in the wallet
    if (!hasPunk) {
      await interaction.reply({
        content:
          "🥶 ลองตรวจดูในกระเป๋าก่อนมั๊ย ว่ามี punkkub อยู่ในนั้นหรือเปล่า ?",
        ephemeral: true,
      });
      await log(
        `${id}  Invalid Punk Number command: ${
          interaction.commandName
        } input: [${
          interaction.options.data.length <= 0
            ? "N/A"
            : interaction.options.data[0].value
        }]`,
        "Invalid Punk Number",
        "interaction level"
      );
      return;
    }

    //begin command
    if (interaction.commandName == COMMANDS.PUNKBEGIN) {
      await beginProcessHandler(interaction, profile, punkkub);
      return;
    }

    //if no profile cannot run every game only guest game can run
    if (!profile && interaction.commandName != COMMANDS.GPVE) {
      await interaction.reply({
        content:
          "🤔 เหมือนว่าจะยังไม่ได้ verify นะ !, กลับไป verify 👉 /punkbegin แล้วค่อยกลับมานะ !",
        ephemeral: true,
      });
      return;
    }

    if (punkkub == null) {
      await interaction.reply({
        content: `🤔 เราหาข้อมูล holder ไม่เจอแหละ ไป /gupunk ก่อนนะ !`,
        ephemeral: true,
      });
      console.log(`🧨 Error: holder not found`);
    }

    // if (!interaction.user.bot) {
    if (interaction.isCommand() && !interaction.user.bot) {
      switch (interaction.commandName) {
        case COMMANDS.PROFILE: {
          await punkProfileHandler(interaction, punkkub);
          break;
        }
        case COMMANDS.LEADERBOARD: {
          // await interaction.deferReply();
          const { result, embed } = await getAllProfileData();
          if (result) {
            await interaction.reply({
              embeds: [embed],
              // files: [{ attachment: embed, name: "punkImageSystem.png" }],
              ephemeral: true,
            });
          } else {
            await interaction.reply({ embeds: [embed], ephemeral: true });
          }
          break;
        }
        case COMMANDS.PVE: {
          if (hasPunk) {
            //game play controller
            await interaction.deferReply();
            if (interaction.deferred) {
              await playGame(COMMANDS.PVE, punkkub);
            }
            await interaction.deleteReply();
          } else {
            await interaction.reply({
              content:
                "🤔 punkkub ในกระเป๋าไปไหนหรือเปล่า ? ทำไมหาไม่เจอ อาจจะลืมไว้ในตลาดมะ ?",
              ephemeral: true,
            });
          }
          break;
        }
        case COMMANDS.PVP: {
          if (hasPunk) {
            //game play controller
            await interaction.deferReply();
            if (interaction.deferred) {
              await playGame(
                COMMANDS.PVP,
                punkkub,
                interaction.options.data[0].value
              );
            }
            await interaction.deleteReply();
          } else {
            await interaction.reply({
              content:
                "🤔 punkkub ในกระเป๋าไปไหนหรือเปล่า ? ทำไมหาไม่เจอ อาจจะลืมไว้ในตลาดมะ ?",
              ephemeral: true,
            });
          }
          break;
        }
        case COMMANDS.GPVE: {
          await guestPveProcessHandler(interaction, punkkub);
          break;
        }
        case COMMANDS.QUESTS: {
          const allQuests = await getAllQuests();
          const list = await createQuestList(allQuests);
          await interaction.reply({ embeds: [list], ephemeral: true });
          break;
        }
        case COMMANDS.GETQUEST: {
          await getQuestHandler(hasPunk, interaction);
          break;
        }
        default:
          break;
      }
    }
  } catch (e) {
    // if (interaction.deferReply) return;
    console.log(e);
    await log(
      `${interaction.user.id} ${e.message} command: ${
        interaction.commandName
      } input: [${
        interaction.options.data.length <= 0
          ? "N/A"
          : interaction.options.data[0].value
      }]`,
      "ERROR",
      "interaction level"
    );
    if (!interaction.deferred) {
      await interaction.reply({
        content: `Gameplay Selector : ${e.message}: contact : NON | PUNK`,
        ephemeral: true,
      });
    }
  }
});