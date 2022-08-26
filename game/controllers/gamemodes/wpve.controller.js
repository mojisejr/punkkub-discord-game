require("dotenv").config({
  path: "../../config.env",
});
const { reply, replyImage } = require("../message.controller");
const {
  getRandomNFTFromWallet,
  getRandomStatusApeAttribute,
} = require("../smartcontracts/apekub.controller");
const {
  getRandomPunkFromWallet,
} = require("../smartcontracts/punkkub.controller");

const { marketplce } = require("../../constants/contract");
const { maxHp, attributesOffset } = require("../../constants/gamesetting");
const {
  renderFightingImage,
  renderWinnerImage,
} = require("../../renderer/renderer");

async function nftPve(punkkub) {
  //1 Set Up the Message Line for replying
  let headerMsg;
  let imageMsg;
  let gameMsg;

  //2 get discordId from punkkub holder
  const { discordId, wallet } = punkkub;

  //3 start header msg
  headerMsg = await reply(
    `<@${discordId}> | ⚔️ dive into 🐒 APE Dungeon !! 🐒 ⚔️`
  );

  //4 get punk from wallet and dungeon
  let enemy = await getRandomNFTFromWallet(marketplce, maxHp, "apekub");
  let player = await getRandomPunkFromWallet(wallet, maxHp, discordId);

  //5 check if any undefined
  enemy = enemy.result === true ? enemy.data : null;
  player = player.result === true ? player.data : null;

  if (enemy.result && player.result) {
    headerMsg.edit(
      `🧨 Error: Cannot play game please tell <@${process.env.devId}>`
    );
  }

  const image = await renderFightingImage(player, enemy);
  imageMsg = await replyImage(image);
  headerMsg.edit(`⚔ ***${player.tokenId} vs ${enemy.tokenId}*** ⚔`);
  gameMsg = await reply(`🐒🐒🐒🐒🐒🐒🐒🐒🐒🐒🐒`);

  let fighting = true;
  while (fighting) {
    let { selectedAttr1, selectedAttr2 } = getRandomStatusApeAttribute(
      player,
      enemy
    );

    let { uP1, uP2, hittedToken, atk } = updateFighting(
      player,
      enemy,
      selectedAttr1,
      selectedAttr2
    );

    player = uP1;
    enemy = uP2;

    await gameMsg.edit(
      `📍using ***${selectedAttr1.trait_type}*** : [***${selectedAttr1.value}***] ⚔️ [***${selectedAttr2.value}***] \n⚔️${hittedToken.tokenId} got damage for ***${atk}*** ⚔️ \n📊${player.tokenId} ❤️ hp-[***${player.hp}/${maxHp}***] ⚔️ ${enemy.tokenId} ❤️ hp-[***${enemy.hp}/${maxHp}***]`
    );
    if (player.hp <= 0 || enemy.hp <= 0) {
      if (player.hp <= 0) {
        await headerMsg.edit(`💪***Congratulation!***💪️`);
        const winImage = await renderWinnerImage(player, enemy, 1);
        await imageMsg.edit({
          files: [{ attachment: winImage, name: "punkImageSystem.png" }],
        });
        await gameMsg.edit(
          `***🐒🐒🐒🐒 ${enemy.tokenId} Won !! 🐒🐒🐒 ..~ ***  🐒🐒🐒🐒`
        );
      } else {
        await headerMsg.edit(`💪***Congratulation!***💪`);
        const winImage = await renderWinnerImage(player, enemy, 0);
        await imageMsg.edit({
          files: [{ attachment: winImage, name: "punkImageSystem.png" }],
        });
        await gameMsg.edit(
          `❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥 *** ${player.tokenId} Won !!*** <@${player.discordId}> ❤️‍🔥❤️‍🔥❤️‍🔥❤️‍🔥`
        );
      }
      fighting = false;
    }
  }
}

function updateFighting(p1, p2, selectedAttr1, selectedAttr2) {
  let atk = 0;
  let hittedToken = selectedAttr1.value > selectedAttr2.value ? p2 : p1;
  if (selectedAttr1.value == selectedAttr2.value) {
    atk = 0;
  } else {
    //atk =
    //   selectedAttr1.value >= selectedAttr2.value
    //     ? selectedAttr1.value - selectedAttr2.value
    //     : selectedAttr2.value - selectedAttr1.value;
    atk =
      selectedAttr1.value >= selectedAttr2.value
        ? selectedAttr1.value
        : selectedAttr2.value;
    hittedToken.hp = hittedToken.hp - atk;
  }

  return {
    uP1: hittedToken.id == p1.id ? hittedToken : p1,
    uP2: hittedToken.id == p2.id ? hittedToken : p2,
    hittedToken: hittedToken,
    atk,
  };
}

module.exports = {
  nftPve,
};
