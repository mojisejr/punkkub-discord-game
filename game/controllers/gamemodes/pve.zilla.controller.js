require("dotenv").config({
  path: "../../config.env",
});
const { updateFightingMessage } = require("../message.controller");
const {
  getRandomPunkFromWallet,
} = require("../smartcontracts/punkkub.controller");

const {
  getRandomZilla,
  getRandomStatusZillaAttribute,
} = require("../smartcontracts/zillafren.controller");

const { maxHp } = require("../../constants/gamesetting");
const {
  renderFightingImage,
  renderWinnerImage,
  renderFightingImage1,
  LoadNFTImage,
} = require("../../renderer/renderer");

//common figting
const { updateFightingV2, canFight } = require("../fighting.v2.controller");
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
const itemsV2 = require("../../constants/item.table.v2");
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
const {
  updateState,
} = require("../../../database/sqlite/services/sqlite.states.service");

const resources = require("../../constants/drop.table");
//sleep timer
const { sleep } = require("../../utils/sleep");
const { saveItemToInventory } = require("../../services/inventory.service");
const { updateQuestProgress } = require("../../services/quest.service");
const { updateGlobalExp } = require("../../services/global.service");
const { COMMANDS } = require("../../constants/commands");

async function autoPve2(punkkub) {
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
      `<@${discordId}> | ?????? ????????? Mode PVE ????????????????????????????????????????????????????????????????????????, ?????????????????? reset 7:00am ??????????????????????????? ??????????????????????????? ?????????????`,
      COMMANDS.PVE
    );
    return;
  }

  //3 start header msg
  headerMsg = await updateFightingMessage(
    null,
    `<@${discordId}> | ?????? ????????? Mode PVE x ZILLAFRENS !! ???`,
    COMMANDS.PVE
  );

  //4 get punk from wallet and dungeon
  //   let enemy = await getRandomNFTFromWallet(marketplce, maxHp, "apekub");
  // let enemy = await getRandomPunkFromWallet(dungeon, maxHp, "apekub");
  let enemy = await getRandomZilla(maxHp);
  let player = await getRandomPunkFromWallet(wallet, maxHp, discordId);

  //5 check if any undefined
  enemy = enemy.result === true ? enemy.data : null;
  player = player.result === true ? player.data : null;

  //   const fightable = canFight(player, enemy);
  //   if (!fightable) {
  //     await updateFightingMessage(
  //       headerMsg,
  //       "???? ?????????????????????????????????????????????????????????????????????????????? ..., ???????????????????????????????????? ! ????"
  //     );
  //     await updateState(player.discordId, false);
  //     return;
  //   }

  //LoadImage Before fight
  const playerImage = await LoadNFTImage(player.imageUrl);
  const enemyImage = await LoadNFTImage(enemy.imageUrl);

  if (enemy.result && player.result) {
    await updateState(player.discordId, false);
    await updateFightingMessage(
      headerMsg,
      `???? Error: Cannot play game please tell <@${process.env.devId}>`
    );
    return;
  }

  const image = await renderFightingImage(
    player,
    enemy,
    playerImage,
    enemyImage
  );
  imageMsg = await updateFightingMessage(
    null,
    {
      files: [{ attachment: image, name: "punkImageSystem.png" }],
    },
    COMMANDS.PVE
  );
  await updateFightingMessage(
    headerMsg,
    `??? ***${player.tokenId} ?????????????????? ${enemy.tokenId}*** ???`,
    COMMANDS.PVE
  );
  gameMsg = await updateFightingMessage(
    null,
    `???????????????????????????????????????????????????`,
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
    let { selectedAttr1, selectedAttr2 } = getRandomStatusZillaAttribute(
      player,
      enemy
    );

    //2 random if item used
    let playerItemFlag = itemUseTrigger();
    let enemyItemFlag = itemUseTrigger();
    let playerItem;
    let enemyItem;

    if (playerItemFlag) {
      playerItem = randomItemFromWallet(itemsV2);
      playerUsedItems.push(playerItem);
    }
    if (enemyItemFlag) {
      enemyItem = randomItemFromWallet(itemsV2);
      enemyUsedItems.push(enemyItem);
    }

    //3 update atk status
    [_, _, hittedToken, atk] = updateFightingV2(
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
      atk,
      playerImage,
      enemyImage
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
    //   *** ?????????????????? ${counter} *** \n
    // ???? ????????????????????? ***${selectedAttr1.trait_type}*** : [***${
    //     selectedAttr1.value
    //   }***] ?????? [***${selectedAttr2.value}***] \n
    // ${
    //   hittedToken != null
    //     ? `?????? ${
    //         hittedToken == 0 ? player.tokenId : enemy.tokenId
    //       } ???????????????????????????????????????????????? ***${atk}*** ??????`
    //     : ""
    // } \n
    // ${
    //   playerItem
    //     ? `???? ???????????????????????? ! ${player.tokenId} ????????? *** ${playerItem.itemName} !`
    //     : ""
    // }\n
    // ${
    //   enemyItem
    //     ? `???? ???????????????????????? ! ${enemy.tokenId} ????????? *** ${enemyItem.itemName} !`
    //     : ""
    // }\n${"```"}
    // ???? ${player.tokenId} ?????? hp-[***${player.hp}/${maxHp}***]
    // ???? ${enemy.tokenId} ?????? hp-[***${enemy.hp}/${maxHp}***]`
    // );

    if (player.hp <= 0 || enemy.hp <= 0) {
      if (player.hp <= 0) {
        const winImage = await renderWinnerImage(playerImage, enemyImage, 1);
        await updateLoseCount(player.discordId);
        await updatePveCount(player.discordId);
        const quest = await updateQuestProgress(player.discordId, 1);
        await updateFightingMessage(
          headerMsg,
          `????*** ????????????????????????????????????????????? ! ${enemy.tokenId}***???????`,
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
          `***${enemy.tokenId} ????????? !! ???? beeep beep ..~***
            ${quest.msg}
            `,
          COMMANDS.PVE
        );
      } else {
        const exp = calculateEXP(counter);
        const winImage = await renderWinnerImage(playerImage, enemyImage, 0);
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
          `????*** ????????????????????????????????????????????? ! ${player.tokenId}***????`,
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
          `***${player.tokenId} ????????? !! <@${player.discordId}> ..~ ***
              ???? ????????????????????????????????????????????????????????? [EXP] : [${exp}]
              ?????? ??????????????????????????????????????????????????????????????? [GEXP] : [${
                gExp <= 0 ? "???????????? level 5 ??????????????????" : gExp
              }]
              ${resource.itemEmoji} ?????????????????? ${resource.itemName} x [${amounts}]
              ${quest.msg}`,
          COMMANDS.PVE
        );
      }

      fighting = false;
      // const winId = player.hp <= 0 ? enemy.discordId : player.discordId;
      // const lostId = player.hp <= 0 ? player.discordId : enemy.discordId;
      // const timestamp = new Date().getTime();
      // await logFighting(winId, lostId, counter, timestamp, "pve");
      await updateState(player.discordId, false);
    }
    await sleep(400);
  }
}

module.exports = {
  autoPve2,
};
