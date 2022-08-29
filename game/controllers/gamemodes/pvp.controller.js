require("dotenv").config({
  path: "../../config.env",
});
const { updateFightingMessage } = require("../message.controller");
const {
  getRandomPunkFromWallet,
  getRandomStatusFromAttribute,
} = require("../smartcontracts/punkkub.controller");
const { maxHp, attributesOffset } = require("../../constants/gamesetting");
const {
  renderFightingImage,
  renderWinnerImage,
  renderFightingImage1,
} = require("../../renderer/renderer");

//common figting
const { updateFighting1, canFight } = require("./../fighting.conntroller");
//common calculate
const { calculateEXP } = require("./../level.controller");
//common item usage
const {
  itemUseTrigger,
  randomItemFromWallet,
} = require("./../item.controller");
//item table
const items = require("../../constants/item.table");
//discord Exp update
const { updateExpDiscord } = require("../../services/userInfo.service");
//discord level update
const { levelUpDiscord } = require("../../constants/exp.table");
//disocord win lost update
const {
  updatePVPWinCount,
  updatePVPLoseCount,
  updatePvpCount,
  checkDailyPvpLimit,
} = require("../../services/fighting.service");

const { logFighting } = require("../../../database/log.service");

const { updateState } = require("../../../database/sqlite/sqlite.service");

const { updateQuestProgress } = require("../../services/quest.service");
const { updateGlobalExp } = require("../../services/global.service");
const { COMMANDS } = require("../../constants/commands");
//sleep timer
const { sleep } = require("../../utils/sleep");

async function pvp1(playerPunk, enemyPunk) {
  //1 Set Up the Message Line for replying
  let headerMsg;
  let imageMsg;
  let gameMsg;
  let fighting = true;
  let counter = 0;
  let playerUsedItems = [];
  let enemyUsedItems = [];

  //2 get discordId from punkkub holder
  // const { discordId, wallet } = punkkub;

  //check if canplay or reached to the daily limit
  const notLimited = await checkDailyPvpLimit(playerPunk.discordId);
  if (!notLimited) {
    headerMsg = await updateFightingMessage(
      null,
      `<@${playerPunk.discordId}> | ⚔️ ลุย Mode PVE ครบตามกำหนดของวันนี้แล้ว, ระบบจะ reset 7:00am ของทุกวัน แล้วแจกาน ❤️‍🔥`,
      COMMANDS.PVP
    );
    return;
  }

  //3 start header msg
  headerMsg = await updateFightingMessage(
    null,
    `⚒ <@${playerPunk.discordId}> | Start PVP With 🛡 <@${enemyPunk.discordId}>`,
    COMMANDS.PVP
  );

  //4 get punk from wallet and dungeon
  //4 get punk from wallet and dungeon
  let enemy = await getRandomPunkFromWallet(
    enemyPunk.wallet,
    maxHp,
    enemyPunk.discordId
  );
  let player = await getRandomPunkFromWallet(
    playerPunk.wallet,
    maxHp,
    playerPunk.discordId
  );

  //5 check if any undefined
  enemy = enemy.result === true ? enemy.data : null;
  player = player.result === true ? player.data : null;

  // const fightable = canFight(player, enemy);
  // if (!fightable) {
  //   await updateFightingMessage(
  //     headerMsg,
  //     "🙄 ใครบางคนแข็งแกร่งมากเกินไป ..., ลองใหม่อีกที ! 🙃"
  //   );
  //   return;
  // }

  if (enemy.result && player.result) {
    await updateFightingMessage(
      headerMsg,
      `🧨 Error: Cannot play game please tell <@${process.env.devId}>`,
      COMMANDS.PVP
    );
    return;
  }

  const image = await renderFightingImage(player, enemy);
  imageMsg = await updateFightingMessage(
    null,
    {
      files: [{ attachment: image, name: "punkImageSystem.png" }],
    },
    COMMANDS.PVP
  );
  await updateFightingMessage(
    headerMsg,
    `⚔ ***${player.tokenId} สู้กับ ${enemy.tokenId}*** ⚔`,
    COMMANDS.PVP
  );
  gameMsg = await updateFightingMessage(
    null,
    `💪⚔️🧨🤖❤️‍🔥🔫🔪🪓🛡💣`,
    COMMANDS.PVP
  );

  while (fighting) {
    counter++;
    //1 select random attribute for fight
    let { selectedAttr1, selectedAttr2 } = getRandomStatusFromAttribute(
      attributesOffset,
      player,
      enemy
    );

    //2 random if item used
    let playerItemFlag = itemUseTrigger();
    let enemyItemFlag = itemUseTrigger();
    let playerItem;
    let enemyItem;

    if (playerItemFlag) {
      playerItem = randomItemFromWallet(items);
      playerUsedItems.push(playerItem);
    }
    if (enemyItemFlag) {
      enemyItem = randomItemFromWallet(items);
      enemyUsedItems.push(enemyItem);
    }

    //3 update atk status
    [_, _, hittedToken, atk] = updateFighting1(
      player,
      enemy,
      selectedAttr1,
      selectedAttr2,
      playerItem,
      enemyItem
    );

    //if item used get item image
    let item1Image = playerItem === undefined ? null : playerItem.itemImage;
    let item2Image = enemyItem === undefined ? null : enemyItem.itemImage;
    //create update object
    const gameImage = await renderFightingImage1(
      player,
      enemy,
      hittedToken,
      playerItem,
      enemyItem,
      item1Image,
      item2Image,
      selectedAttr1,
      selectedAttr2,
      counter,
      atk
    );

    await updateFightingMessage(
      imageMsg,
      {
        files: [{ attachment: gameImage, name: "fighting.png" }],
      },
      COMMANDS.PVP
    );

    if (player.hp <= 0 || enemy.hp <= 0) {
      if (player.hp <= 0) {
        const winImage = await renderWinnerImage(player, enemy, 1);
        await updateFightingMessage(
          headerMsg,
          `💪*** ยินดีด้วยจ้าาาา ! ${enemy.tokenId}***💪️`,
          COMMANDS.PVP
        );
        await updateFightingMessage(
          imageMsg,
          {
            files: [{ attachment: winImage, name: "punkImageSystem.png" }],
          },
          COMMANDS.PVP
        );
        await updateFightingMessage(
          gameMsg,
          `***${enemy.tokenId} ชนะ !! 🤖 beeep beep ..~***`,
          COMMANDS.PVP
        );
        await updatePVPLoseCount(player.discordId);
        await updatePvpCount(player.discordId);
        await updateQuestProgress(player.discordId, 2);
      } else {
        const exp = calculateEXP(counter);
        const winImage = await renderWinnerImage(player, enemy, 0);
        await updateExpDiscord(player.discordId, exp);
        await levelUpDiscord(player.discordId);
        await updatePVPWinCount(player.discordId);
        await updatePvpCount(player.discordId);
        const quest = await updateQuestProgress(player.discordId, 2);
        const gExp = await updateGlobalExp(exp, player.discordId);
        await updateFightingMessage(
          headerMsg,
          `💪*** ยินดีด้วยจ้าาาา ! ${player.tokenId}***💪`,
          COMMANDS.PVP
        );
        await updateFightingMessage(
          imageMsg,
          {
            files: [{ attachment: winImage, name: "punkImageSystem.png" }],
          },
          COMMANDS.PVP
        );
        await updateFightingMessage(
          gameMsg,
          `***${player.tokenId} ชนะ !! <@${player.discordId}> ..~ ***
          🍆 ได้รับค่าประสบการณ์ [EXP] : [${exp}]
          ⚙️ คอมมูได้รับประสมการณ์ [GEXP] : [${
            gExp <= 0 ? "ต้อง level 5 ขึ้นไป" : gExp
          }]
          ${quest.msg}`,
          COMMANDS.PVP
        );
      }

      fighting = false;
      const winId = player.hp <= 0 ? enemy.discordId : player.discordId;
      const lostId = player.hp <= 0 ? player.discordId : enemy.discordId;
      const timestamp = new Date().getTime();
      await logFighting(winId, lostId, counter, timestamp, "pvp");
      await updateState(player.discordId, false);
    }
    await sleep(700);
  }
}

module.exports = {
  pvp1,
};
