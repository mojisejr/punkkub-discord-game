function updateFightingV2(
  player,
  enemy,
  selectedAttr1,
  selectedAttr2,
  p1Item,
  p2Item
) {
  let atk = 0;
  p1Item !== undefined
    ? leftSideItemProcessingV2(
        player,
        enemy,
        p1Item,
        selectedAttr1,
        selectedAttr2
      )
    : null;
  p2Item !== undefined
    ? rightSideItemProcessingV2(
        player,
        enemy,
        p2Item,
        selectedAttr1,
        selectedAttr2
      )
    : null;
  if (selectedAttr1.value == selectedAttr2.value) {
    atk = 0;
    return [player, enemy, null, atk];
  } else if (selectedAttr1.value > selectedAttr2.value) {
    atk = selectedAttr1.value;
    enemy.hp = enemy.hp - atk;
    return [player, enemy, 1, atk];
  } else if (selectedAttr1.value < selectedAttr2.value) {
    atk = selectedAttr2.value;
    player.hp = player.hp - atk;
    return [player, enemy, 0, atk];
  }
}

function leftSideItemProcessingV2(
  player,
  enemy,
  item,
  selectedAttr1,
  selectedAttr2
) {
  //player draw hp item:
  player.hp += item.itemEffect.player.hp;
  enemy.hp += item.itemEffect.enemy.hp;

  item.itemEffect.player[selectedAttr1.trait_type] > 0
    ? (enemy.hp -= item.itemEffect.player[selectedAttr1.trait_type])
    : enemy;
  item.itemEffect.enemy[selectedAttr2.trait_type] > 0
    ? (player.hp -= item.itemEffect.enemy[selectedAttr2.trait_type])
    : player;
}

function rightSideItemProcessingV2(
  player,
  enemy,
  item,
  selectedAttr1,
  selectedAttr2
) {
  //player is enemy
  player.hp += item.itemEffect.enemy.hp;
  enemy.hp += item.itemEffect.player.hp;
  item.itemEffect.player[selectedAttr1.trait_type] > 0
    ? (player.hp -= item.itemEffect.player[selectedAttr1.trait_type])
    : player;
  item.itemEffect.enemy[selectedAttr2.trait_type] > 0
    ? (enemy.hp -= item.itemEffect.enemy[selectedAttr2.trait_type])
    : enemy;
}

function itemProcessingV2(
  player,
  enemy,
  item,
  flag,
  selectedAttr1,
  selectedAttr2
) {
  //if HP power up !
  player.hp += item.itemEffect.player.hp;
  enemy.hp += item.itemEffect.enemy.hp;
  //get effect for player for status power up
  if (flag == 0) {
    console.log("player item atk");
    item.itemEffect.player[selectedAttr1.trait_type] > 0
      ? (enemy.hp -= item.itemEffect.player[selectedAttr1.trait_type])
      : enemy;
    item.itemEffect.enemy[selectedAttr2.trait_type] > 0
      ? (player.hp -= item.itemEffect.enemy[selectedAttr2.trait_type])
      : player;
  }

  //enemy become player
  if (flag == 1) {
    console.log("enemy item atk");
    item.itemEffect.enemy[selectedAttr2.trait_type] > 0
      ? (player.hp -= item.itemEffect.player[selectedAttr1.trait_type])
      : player;
    item.itemEffect.player[selectedAttr1.trait_type] > 0
      ? (enemy.hp -= item.itemEffect.enemy[selectedAttr2.trait_type])
      : enemy;
  }
}

function canFight(player1, player2) {
  const result = Math.abs(player1.rarity - player2.rarity);
  return result <= 1 ? true : false;
}

module.exports = {
  updateFightingV2,
  canFight,
};
