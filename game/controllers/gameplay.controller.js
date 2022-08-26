const { pvp1 } = require("./gamemodes/pvp.controller");
const { autoPve1 } = require("./gamemodes/pve.controller");
const { COMMANDS } = require("../constants/commands");
const { reply } = require("./message.controller");
const {
  canPlay,
  updateState,
} = require("../../database/sqlite/sqlite.service");
const { getPunkByDiscordId } = require("../../database/verify.service");
const { guestPve } = require("./gamemodes/gpve.controller");

//GAME PLAY MODE CONTROLLER

async function playGame(id, punkkub, message = "", selectedSide = null) {
  // const result = await canPlay(punkkub.discordId);
  // if (!result) {
  //   reply("🧐 ใจเย็นๆ ค่อยๆ เล่นที่ละรอบนะ !");
  //   return;
  // }
  // updateState(punkkub.discordId, true);
  //1 switch selected mode by command id then execute PVE, PVP etc. controller !
  switch (id) {
    case COMMANDS.PVE: {
      console.log(`${punkkub.discordName} start auto PVE`);
      await autoPve1(punkkub);
      break;
    }
    case COMMANDS.PVP: {
      //PVP
      //1 Check selected enemy wallet if had punkkub inside ?
      //2 execute pvp controller function
      const enemyPunk = await getPunkByDiscordId(message);
      if (enemyPunk == null) {
        reply({
          content: `❌ : หา punkkub ใน wallet เพื่อนอีกคนไม่เจอ แฮะ อาจจะไม่มี, ลองคนอื่นมะ`,
          emphemeral: true,
        });
        return;
      }

      if (punkkub.discordId == enemyPunk.discordId) {
        reply({
          content: `🤣 คนอะไรจะมาฆ่า ตัวเองซะแล้ววว  !!, เปลี่ยนคนแล้วลองใหม่ !🤣`,
          emphemeral: true,
        });
        return;
      }

      console.log(
        `${punkkub.discordName} Start PVP with ${enemyPunk.discordName}`
      );

      await pvp1(punkkub, enemyPunk);
      break;
    }
    case COMMANDS.GPVE: {
      if (selectedSide != null) {
        await guestPve(selectedSide, message);
      }
      break;
    }
    default: {
      console.log("Invalid Command or You has no punk!");
      reply({
        content: `🧨 ERROR: กดคำสั่งผิดหวือเปล่า ?. ถ้าไม่ผิดถาม ! =>  non | KPUNK !`,
        emphemeral: true,
      });
      break;
    }
  }
}

module.exports = {
  playGame,
};
