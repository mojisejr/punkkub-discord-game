//Fighting Logic Controller
function updateFighting(p1, p2, selectedAttr1, selectedAttr2) {
  let atk = 0;
  let hittedToken = selectedAttr1.value > selectedAttr2.value ? p2 : p1;

  if (selectedAttr1.value == selectedAttr2.value) {
    atk = 0;
  } else {
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

function updateFighting1(
  player,
  enemy,
  selectedAttr1,
  selectedAttr2,
  p1Item,
  p2Item
) {
  let atk = 0;
  p1Item !== undefined
    ? itemProcessing(player, enemy, p1Item, 0, selectedAttr1, selectedAttr2)
    : null;
  p2Item !== undefined
    ? itemProcessing(player, enemy, p2Item, 1, selectedAttr1, selectedAttr2)
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

function itemProcessing(
  player,
  enemy,
  item,
  flag,
  selectedAttr1,
  selectedAttr2
) {
  if (flag == 0) {
    switch (item.attributes[0].type) {
      case 0: {
        if (selectedAttr1.trait_type != item.attributes[0].trait) return;
        player.hp = player.hp - item.attributes[0].value;
        console.log(
          `@${enemy.tokenId} ${selectedAttr1.trait_type} == ${item.attributes[0].trait} == ทำให้ใช้ Item ${item.itemName} สำเร็จเพิ่มพลังโจมตี ${item.attributes[0].value} @${player.tokenId} hp [${player.hp}]`
        );
        break;
      }
      case 1: {
        player.hp = player.hp + item.attributes[0].value;
        break;
      }
      case 2: {
        enemy.hp = enemy.hp - item.attributes[0].value;
        break;
      }
      case 3: {
        player.hp = player.hp - item.attributes[0].value;
      }
      default:
        break;
    }
  } else {
    switch (item.attributes[0].type) {
      case 0: {
        if (selectedAttr2.trait_type != item.attributes[0].trait) return;
        enemy.hp = enemy.hp - item.attributes[0].value;
        console.log(
          `@${player.tokenId} ${selectedAttr2.trait_type} == ${item.attributes[0].trait} == ทำให้ใช้ Item ${item.itemName} สำเร็จเพิ่มพลังโจมตี ${item.attributes[0].value} @${enemy.tokenId} hp [${enemy.hp}]`
        );
        break;
      }
      case 1: {
        enemy.hp = enemy.hp + item.attributes[0].value;
        break;
      }
      case 2: {
        player.hp = player.hp - item.attributes[0].value;
        break;
      }
      case 3: {
        enemy.hp = enemy.hp - item.attributes[0].value;
      }
      default:
        break;
    }
  }
}

function canFight(player1, player2) {
  const result = Math.abs(player1.rarity - player2.rarity);
  return result <= 1 ? true : false;
}

module.exports = {
  updateFighting,
  updateFighting1,
  canFight,
};
