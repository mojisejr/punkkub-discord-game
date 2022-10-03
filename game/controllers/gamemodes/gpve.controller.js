require("dotenv").config({
  path: "../../config.env",
});
const { updateFightingMessage } = require("../message.controller");
const {
  getRandomPunkFromWallet,
  getRandomStatusFromAttribute,
} = require("../smartcontracts/punkkub.controller");
const { dungeon } = require("../../constants/contract");
const { maxHp, attributesOffset } = require("../../constants/gamesetting");
const {
  renderFightingImage,
  renderWinnerImage,
  renderFightingImage1,
  LoadNFTImage,
} = require("../../renderer/renderer");

//common figting
//common figting
const { updateFightingV2 } = require("../fighting.v2.controller");
//items table
const itemsV2 = require("../../constants/item.table.v2");
//common calculate
//common item usage
const {
  itemUseTrigger,
  randomItemFromWallet,
} = require("./../item.controller");
//item table
//discord Exp update
const { COMMANDS } = require("../../constants/commands");

//sleep timer
const { sleep } = require("../../utils/sleep");

async function guestPve(selectedSide, discordId) {
  //1 Set Up the Message Line for replying
  // console.log("selected side", selectedSide);

  let headerMsg;
  let imageMsg;
  let gameMsg;
  let fighting = true;
  let counter = 0;
  let playerUsedItems = [];
  let enemyUsedItems = [];

  //3 start header msg
  headerMsg = await updateFightingMessage(
    null,
    `<@${discordId}> | ⚔️ ลุย GUEST GUEST GUEST !! ⚔`,
    COMMANDS.GPVE
  );

  //4 get punk from wallet and dungeon
  let enemy = await getRandomPunkFromWallet(dungeon, maxHp, "dungeon");
  let player = await getRandomPunkFromWallet(dungeon, maxHp, "dungeon");

  //5 check if any undefined
  enemy = enemy.result === true ? enemy.data : null;
  player = player.result === true ? player.data : null;

  // const fightable = canFight(player, enemy);
  // if (!fightable) {
  //   await updateFightingMessage(
  //     headerMsg,
  //     "🙄 ใครบางคนแข็งแกร่งมากเกินไป ..., ลองใหม่อีกที ! 🙃"
  //   );
  //   await updateState(player.discordId, false);
  //   return;
  // }

  if (enemy.result && player.result) {
    await updateFightingMessage(
      headerMsg,
      `🧨 Error: Cannot play game please tell <@${process.env.devId}>`,
      COMMANDS.GPVE
    );
    return;
  }

  //Load Image
  const playerImage = await LoadNFTImage(player.imageUrl);
  const enemyImage = await LoadNFTImage(enemy.imageUrl);

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
    COMMANDS.GPVE
  );
  await updateFightingMessage(
    headerMsg,
    `⚔ ***${player.tokenId} สู้กับ ${enemy.tokenId}*** ⚔`,
    COMMANDS.GPVE
  );
  gameMsg = await updateFightingMessage(
    null,
    `💪⚔️🧨🤖❤️‍🔥🔫🔪🪓🛡💣`,
    COMMANDS.GPVE
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
      COMMANDS.GPVE
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
      if (player.hp <= 0 && selectedSide == "👈") {
        const winImage = await renderWinnerImage(playerImage, enemyImage, 1);
        await updateFightingMessage(
          headerMsg,
          `💪***  อ้าว ...  ${enemy.tokenId} ชนะ ! ${enemy.tokenId}***💪️`,
          COMMANDS.GPVE
        );
        await updateFightingMessage(
          imageMsg,
          {
            files: [{ attachment: winImage, name: "punkImageSystem.png" }],
          },
          COMMANDS.GPVE
        );
        await updateFightingMessage(
          gameMsg,
          `***${enemy.tokenId} ชนะ !! 🤖 beeep beep .. คุนเลือกผิดฝั่งแล้ว !~***`,
          COMMANDS.GPVE
        );
      } else if (player.hp <= 0 && selectedSide == "👉") {
        const winImage = await renderWinnerImage(playerImage, enemyImage, 1);
        await updateFightingMessage(
          headerMsg,
          `💪*** ยินดีด้วยจ้าาาา ! ${player.tokenId}***💪`,
          COMMANDS.GPVE
        );
        await updateFightingMessage(
          imageMsg,
          {
            files: [{ attachment: winImage, name: "punkImageSystem.png" }],
          },
          COMMANDS.GPVE
        );
        await updateFightingMessage(
          gameMsg,
          `***${player.tokenId} ชนะ !! <@${discordId}> ..~  แจ๋ว ! ลองใหม่ป๊ะหละ ? หรือจะไปหยิบ PUNK มาจัดเต็มเลยดี ? !!***`,
          COMMANDS.GPVE
        );
      } else if (enemy.hp <= 0 && selectedSide == "👈") {
        const winImage = await renderWinnerImage(playerImage, enemyImage, 0);
        await updateFightingMessage(
          headerMsg,
          `💪*** ยินดีด้วยจ้าาาา ! ${player.tokenId}***💪`,
          COMMANDS.GPVE
        );
        await updateFightingMessage(
          imageMsg,
          {
            files: [{ attachment: winImage, name: "punkImageSystem.png" }],
          },
          COMMANDS.GPVE
        );
        await updateFightingMessage(
          gameMsg,
          `***${player.tokenId} ชนะ !! <@${player.discordId}> ..~  แจ๋ว ! ลองใหม่ป๊ะหละ ? หรือจะไปหยิบ PUNK มาจัดเต็มเลยดี ? !!***`,
          COMMANDS.GPVE
        );
      } else if (enemy.hp <= 0 && selectedSide == "👉") {
        const winImage = await renderWinnerImage(playerImage, enemyImage, 0);
        await updateFightingMessage(
          headerMsg,
          `💪*** อ้าว ...  ${enemy.tokenId} ชนะ !***💪️`,
          COMMANDS.GPVE
        );
        await updateFightingMessage(
          imageMsg,
          {
            files: [{ attachment: winImage, name: "punkImageSystem.png" }],
          },
          COMMANDS.GPVE
        );
        await updateFightingMessage(
          gameMsg,
          `***${enemy.tokenId} ชนะ !! 🤖 beeep beep .. คุนเลือกผิดฝั่งแล้ว !~***`,
          COMMANDS.GPVE
        );
      }

      fighting = false;
    }
    await sleep(400);
  }
}

module.exports = {
  guestPve,
};
