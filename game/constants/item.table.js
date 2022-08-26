//0 status plus
//1 hp plus
//2 hp -minus
//3 hp -minus self
const basePath = process.cwd();
const itemsPath = "/game/images/items/";
const path = basePath + itemsPath;

const TYPE = {
  status: 0,
  hpUp: 1,
  hpDown: 2,
  hpDownSelf: 3,
};

const ITEM_TYPE = {
  card: 0,
  resource: 1,
};

module.exports = [
  {
    itemId: 1,
    itemName: "ดาบมะเขื่อยาว ATK[+1]",
    itemImage: `${path}1 Sword.png`,
    itemType: ITEM_TYPE.card,
    attributes: [
      {
        type: TYPE.status,
        trait: "STR",
        value: 1,
      },
    ],
  },
  {
    itemId: 2,
    itemName: "กล้วยตานีปลายหวีเหี่ยว HP[+10]",
    itemImage: `${path}9 Banana.png`,
    itemType: ITEM_TYPE.card,
    attributes: [
      {
        type: TYPE.hpUp,
        value: 10,
      },
    ],
  },
  {
    itemId: 3,
    itemName: "กล้วยพิษ หว๋ายยย !",
    itemImage: `${path}12 Poison Cucumber.png`,
    itemType: ITEM_TYPE.card,
    attributes: [
      {
        type: TYPE.hpDownSelf,
        value: 10,
      },
    ],
  },
  {
    itemId: 4,
    itemName: "พลังไฟบรรลัยกาานนน !",
    itemImage: `${path}16 Fire Ball.png`,
    itemType: ITEM_TYPE.card,
    attributes: [
      {
        type: TYPE.hpDown,
        value: 10,
      },
    ],
  },
  {
    itemId: 5,
    itemName: "ไม้เท้า to the star",
    itemImage: `${path}8 Star Wand.png`,
    itemType: ITEM_TYPE.card,
    attributes: [
      {
        type: TYPE.status,
        trait: "INT",
        value: 2,
      },
    ],
  },
  {
    itemId: 5,
    itemName: "แว่น 8 บิต",
    itemImage: `${path}2 Black Glasses.png`,
    itemType: ITEM_TYPE.card,
    attributes: [
      {
        type: TYPE.status,
        trait: "AGI",
        value: 1,
      },
    ],
  },
  {
    itemId: 6,
    itemName: "MAD Shield",
    itemImage: `${path}3 Mad Shield.png`,
    itemType: ITEM_TYPE.card,
    attributes: [
      {
        type: TYPE.status,
        trait: "VIT",
        value: 2,
      },
    ],
  },
  {
    itemId: 7,
    itemName: "Holy Shield",
    itemImage: `${path}4 Holy Shield.png`,
    itemType: ITEM_TYPE.card,
    attributes: [
      {
        type: TYPE.status,
        trait: "VIT",
        value: 3,
      },
    ],
  },
  {
    itemId: 8,
    itemName: "Dark Minions",
    itemImage: `${path}5 Dark Minions.png`,
    itemType: ITEM_TYPE.card,
    attributes: [
      {
        type: TYPE.status,
        trait: "INT",
        value: 4,
      },
    ],
  },
];
