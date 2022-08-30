const ITEM_TYPE = require("./item.table");
const basePath = process.cwd();
const itemsPath = "/game/images/resources/";
const path = basePath + itemsPath;
module.exports = [
  {
    itemId: 0,
    itemName: "gem",
    itemType: ITEM_TYPE.resource,
    itemImage: `${path}gem.png`,
    itemEmoji: "<:gems:1014129372208300063>",
  },
  {
    itemId: 1,
    itemName: "gold",
    itemType: ITEM_TYPE.resource,
    itemImage: `${path}gold.png`,
    itemEmoji: "<:gold:1014129395604131890>",
  },
  {
    itemId: 2,
    itemName: "mercury",
    itemType: ITEM_TYPE.resource,
    itemImage: `${path}mercury.png`,
    itemEmoji: "<:mercury:1014129413585113189>",
  },
  {
    itemId: 3,
    itemName: "ore",
    itemType: ITEM_TYPE.resource,
    itemImage: `${path}ore.png`,
    itemEmoji: "<:ore:1014129436943208589>",
  },
  {
    itemId: 4,
    itemName: "wood",
    itemType: ITEM_TYPE.resource,
    itemImage: `${path}wood.png`,
    itemEmoji: "<:woods:1014129460448075786>",
  },
];
