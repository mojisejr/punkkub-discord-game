require("dotenv").config({
  path: "../../config.env",
});
const { updateFightingMessage } = require("../message.controller");
const {
  getRandomPunkFromWallet,
  getRandomStatusFromAttribute,
} = require("../smartcontracts/punkkub.controller");
const {
  getRandomNFTFromWallet,
  getRandomStatusApeAttribute,
} = require("../smartcontracts/apekub.controller");
const { dungeon, apekub, marketplce } = require("../../constants/contract");
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
  randomResource,
  randomAmounts,
} = require("./../item.controller");
//item table
const items = require("../../constants/item.table");
//discord Exp update
const { updateExpDiscord } = require("../../services/userInfo.service");
//discord level update
const { levelUpDiscord } = require("../../constants/exp.table");
//disocord win lost update
const {
  updateWinCount,
  updateLoseCount,
  updatePveCount,
  checkDailyPveLimit,
} = require("../../services/fighting.service");

const { logFighting } = require("../../../database/log.service");
const { updateState } = require("../../../database/sqlite/sqlite.service");

const resources = require("../../constants/drop.table");
//sleep timer
const { sleep } = require("../../utils/sleep");
const { saveItemToInventory } = require("../../services/inventory.service");
const { updateQuestProgress } = require("../../services/quest.service");
const { updateGlobalExp } = require("../../services/global.service");
const { COMMANDS } = require("../../constants/commands");

async function autoPve1(punkkub) {
  //1 Set Up the Message Line for replying

  let headerMsg;
  let imageMsg;
  let gameMsg;
  let fighting = true;
  let counter = 0;
  let playerUsedItems = [];
  let enemyUsedItems = [];

  //2 get discordId from punkkub holder
  const { discordId, wallet } = punkkub;

  //check if canplay or reached to the daily limit
  const notLimited = await checkDailyPveLimit(discordId);
  if (!notLimited) {
    await updateState(discordId, false);
    headerMsg = await updateFightingMessage(
      null,
      `<@${discordId}> | ⚔️ ลุย Mode PVE ครบตามกำหนดของวันนี้แล้ว, ระบบจะ reset 7:00am ของทุกวัน แล้วแจกาน ❤️‍🔥`,
      COMMANDS.PVE
    );
    return;
  }

  //3 start header msg
  headerMsg = await updateFightingMessage(
    null,
    `<@${discordId}> | ⚔️ ลุย Mode PVE !! ⚔`,
    COMMANDS.PVE
  );

  //4 get punk from wallet and dungeon
  let enemy = await getRandomNFTFromWallet(marketplce, maxHp, "apekub");
  // let enemy = await getRandomPunkFromWallet(dungeon, maxHp, "apekub");
  let player = await getRandomPunkFromWallet(wallet, maxHp, discordId);

  //5 check if any undefined
  enemy = enemy.result === true ? enemy.data : null;
  player = player.result === true ? player.data : null;

  const fightable = canFight(player, enemy);
  if (!fightable) {
    await updateFightingMessage(
      headerMsg,
      "🙄 ใครบางคนแข็งแกร่งมากเกินไป ..., ลองใหม่อีกที ! 🙃"
    );
    await updateState(player.discordId, false);
    return;
  }

  if (enemy.result && player.result) {
    await updateState(player.discordId, false);
    await updateFightingMessage(
      headerMsg,
      `🧨 Error: Cannot play game please tell <@${process.env.devId}>`
    );
    return;
  }

  const image = await renderFightingImage(player, enemy);
  imageMsg = await updateFightingMessage(
    null,
    {
      files: [{ attachment: image, name: "punkImageSystem.png" }],
    },
    COMMANDS.PVE
  );
  await updateFightingMessage(
    headerMsg,
    `⚔ ***${player.tokenId} สู้กับ ${enemy.tokenId}*** ⚔`,
    COMMANDS.PVE
  );
  gameMsg = await updateFightingMessage(
    null,
    `💪⚔️🧨🤖❤️‍🔥🔫🔪🪓🛡💣`,
    COMMANDS.PVE
  );

  while (fighting) {
    counter++;
    //1 select random attribute for fight
    // let { selectedAttr1, selectedAttr2 } = getRandomStatusFromAttribute(
    //   attributesOffset,
    //   player,
    //   enemy
    // );
    let { selectedAttr1, selectedAttr2 } = getRandomStatusApeAttribute(
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
      COMMANDS.PVE
    );

    // await updateFightingMessage(
    //   gameMsg,
    //   `
    //   ${"```"}
    //   *** รอบที่ ${counter} *** \n
    // 📍 สู้ด้วย ***${selectedAttr1.trait_type}*** : [***${
    //     selectedAttr1.value
    //   }***] ⚔️ [***${selectedAttr2.value}***] \n
    // ${
    //   hittedToken != null
    //     ? `⚔️ ${
    //         hittedToken == 0 ? player.tokenId : enemy.tokenId
    //       } โดนโจมตีด้วยพลัง ***${atk}*** ⚔️`
    //     : ""
    // } \n
    // ${
    //   playerItem
    //     ? `💥 เจอไอเทม ! ${player.tokenId} ใช้ *** ${playerItem.itemName} !`
    //     : ""
    // }\n
    // ${
    //   enemyItem
    //     ? `💥 เจอไอเทม ! ${enemy.tokenId} ใช้ *** ${enemyItem.itemName} !`
    //     : ""
    // }\n${"```"}
    // 👉 ${player.tokenId} ❤️ hp-[***${player.hp}/${maxHp}***]
    // 👉 ${enemy.tokenId} ❤️ hp-[***${enemy.hp}/${maxHp}***]`
    // );

    if (player.hp <= 0 || enemy.hp <= 0) {
      if (player.hp <= 0) {
        const winImage = await renderWinnerImage(player, enemy, 1);
        await updateLoseCount(player.discordId);
        await updatePveCount(player.discordId);
        const quest = await updateQuestProgress(player.discordId, 1);
        await updateFightingMessage(
          headerMsg,
          `💪*** ยินดีด้วยจ้าาาา ! ${enemy.tokenId}***💪️`,
          COMMANDS.PVE
        );
        await updateFightingMessage(
          imageMsg,
          {
            files: [{ attachment: winImage, name: "punkImageSystem.png" }],
          },
          COMMANDS.PVE
        );
        await updateFightingMessage(
          gameMsg,
          `***${enemy.tokenId} ชนะ !! 🤖 beeep beep ..~***
          ${quest.msg}
          `,
          COMMANDS.PVE
        );
      } else {
        const exp = calculateEXP(counter);
        const winImage = await renderWinnerImage(player, enemy, 0);
        const resource = randomResource(resources);
        const amounts = randomAmounts(counter);
        await updateExpDiscord(player.discordId, exp);
        await levelUpDiscord(player.discordId);
        await updateWinCount(player.discordId);
        await updatePveCount(player.discordId);
        await saveItemToInventory(player.discordId, resource.itemId, amounts);
        const quest = await updateQuestProgress(player.discordId, 1);
        const gExp = await updateGlobalExp(exp, player.discordId);
        await updateFightingMessage(
          headerMsg,
          `💪*** ยินดีด้วยจ้าาาา ! ${player.tokenId}***💪`,
          COMMANDS.PVE
        );
        await updateFightingMessage(
          imageMsg,
          {
            files: [{ attachment: winImage, name: "punkImageSystem.png" }],
          },
          COMMANDS.PVE
        );
        await updateFightingMessage(
          gameMsg,
          `***${player.tokenId} ชนะ !! <@${player.discordId}> ..~ ***
            🍆 ได้รับค่าประสบการณ์ [EXP] : [${exp}]
            ⚙️ คอมมูได้รับประสมการณ์ [GEXP] : [${
              gExp <= 0 ? "ต้อง level 5 ขึ้นไป" : gExp
            }]
            ${resource.itemEmoji} ได้รับ ${resource.itemName} x [${amounts}]
            ${quest.msg}`,
          COMMANDS.PVE
        );
      }

      fighting = false;
      const winId = player.hp <= 0 ? enemy.discordId : player.discordId;
      const lostId = player.hp <= 0 ? player.discordId : enemy.discordId;
      const timestamp = new Date().getTime();
      await logFighting(winId, lostId, counter, timestamp, "pve");
      await updateState(player.discordId, false);
    }
    await sleep(700);
  }
}

module.exports = {
  autoPve1,
};
