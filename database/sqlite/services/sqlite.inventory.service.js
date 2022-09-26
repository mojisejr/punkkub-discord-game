const Inventory = require("../models/inventory.model");

async function addNewItem(discordId, itemId, amounts) {
  const found = await Inventory.findOne({ where: { discordId, itemId } });
  if (found == null) {
    const response = await Inventory.create({
      discordId,
      itemId,
      amounts,
    });
  }
}

async function getAllItemByDiscordId(discordId) {
  const response = await Inventory.findAll({ where: { discordId } });
  const items =
    response.length > 0 ? response.map((item) => item.dataValues) : [];

  const formatItemList = items.map((item) => {
    return { itemId: item.itemId, amounts: item.amounts };
  });

  return formatItemList;
}

async function getItemByDiscordId(discordId, itemId) {
  const item = await Inventory.findOne({ where: { discordId, itemId } });
  // console.log(item);
  if (item != null) {
    return item;
  } else {
    return null;
  }
}

// getItemByDiscordId("641295732384464906", "1");
async function updateItemAmount(discordId, itemId, amounts) {
  await Inventory.update(
    { amounts },
    {
      where: {
        discordId,
        itemId,
      },
    }
  );
}

module.exports = {
  addNewItem,
  getAllItemByDiscordId,
  getItemByDiscordId,
  updateItemAmount,
};
