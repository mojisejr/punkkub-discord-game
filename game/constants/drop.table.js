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
    itemEmoji: "<:gems:1007836081238052934>",
  },
  {
    itemId: 1,
    itemName: "gold",
    itemType: ITEM_TYPE.resource,
    itemImage: `${path}gold.png`,
    itemEmoji: "<:gold:1007836128101007470>",
  },
  {
    itemId: 2,
    itemName: "mercury",
    itemType: ITEM_TYPE.resource,
    itemImage: `${path}mercury.png`,
    itemEmoji: "<:mercury:1007836168081117265>",
  },
  {
    itemId: 3,
    itemName: "ore",
    itemType: ITEM_TYPE.resource,
    itemImage: `${path}ore.png`,
    itemEmoji: "<:ore:1007836196879208488>",
  },
  {
    itemId: 4,
    itemName: "wood",
    itemType: ITEM_TYPE.resource,
    itemImage: `${path}wood.png`,
    itemEmoji: "<:wood:1007836251468079125>",
  },
];
