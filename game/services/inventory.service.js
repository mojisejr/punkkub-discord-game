const { Collection } = require("../../database/firestore");
const resources = require("../constants/drop.table");

//SQLITE
const {
  getAllItemByDiscordId,
  getItemByDiscordId,
  updateItemAmount,
  addNewItem,
} = require("../../database/sqlite/services/sqlite.inventory.service");

// const InitialInventory = {
//   items: [],
// };

// async function addNewInventory(discordId) {
//   await Collection.Inventory.doc(discordId).set({
//     ...InitialInventory,
//   });
// }

// async function getAllResourceFromInventory(discordId) {
//   const data = (await Collection.Inventory.doc(discordId).get()).data();
//   return data.items;
// }

async function getAllResourceFromInventory(discordId) {
  const items = await getAllItemByDiscordId(discordId);
  return items;
}

async function getAllMappedResourceFromInventory(discordId) {
  const data = await getAllResourceFromInventory(discordId);
  const mapped = mapResourceToItDetail(data);
  return mapped;
}

function mapResourceToItDetail(userResources = []) {
  const mappedResources = userResources.map((uRes) => {
    const match = resources.find((res) => res.itemId == uRes.itemId);
    return {
      ...uRes,
      itemName: match.itemName,
      itemEmoji: match.itemEmoji,
    };
  });
  return mappedResources;
}

// async function findResourceFromInventoryById(discordId, itemId) {
//   let data = [];
//   data = await getAllResourceFromInventory(discordId);
//   if (data.length <= 0) return;
//   const found = data.find((d) => d.itemId == itemId);
//   if (found) {
//     // console.log(found);
//     return found;
//   } else {
//     return null;
//   }
// }

// function updateResourceAmounts(item, newAmounts) {
//   const update = {
//     ...item,
//     amounts: +item.amounts + newAmounts,
//   };
//   // console.log(update);
//   return update;
// }

// async function saveItemToInventory(discordId, itemId, amounts) {
//   //1 get all list of itmes
//   //2 check if already has ?
//   //2.1 has => update amount
//   //2.2 empyu => add new to array
//   //3 update new array to the items:
//   let resources = [];
//   resources = await getAllResourceFromInventory(discordId);
//   const found = await findResourceFromInventoryById(discordId, itemId);
//   if (found != null || found != undefined) {
//     resources.forEach((r, index) => {
//       if (r.itemId == itemId) {
//         // console.log(r);
//         resources[index] = updateResourceAmounts(r, amounts);
//       }
//     });
//     await Collection.Inventory.doc(discordId).set({
//       items: resources,
//     });
//   } else {
//     resources.push({ itemId: itemId, amounts: amounts });
//     await Collection.Inventory.doc(discordId).set({
//       items: resources,
//     });
//   }
// }

async function saveItemToInventory(discordId, itemId, amounts) {
  const item = await getItemByDiscordId(discordId, itemId);
  if (item != null) {
    const newAmount = item.amounts + amounts;
    await updateItemAmount(discordId, itemId, newAmount);
  } else {
    await addNewItem(discordId, itemId, amounts);
  }
}

module.exports = {
  // addNewInventory,
  saveItemToInventory,
  getAllMappedResourceFromInventory,
};
