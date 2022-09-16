const basePath = process.cwd();
const itemsPath = "/game/images/items/";
const path = basePath + itemsPath;

module.exports = [
  {
    itemId: 0,
    itemName: "Dark Minions",
    itemImage: `${path}5 Dark Minions.png`,
    itemDescription: "มินเนี่ยนสามตัว ที่น่ากลัวสุดๆ ป๊ะ ?",
    itemEffect: {
      player: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 0,
        VIT: 0,
        INT: 4,
      },
      enemy: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 0,
        VIT: 0,
        INT: 0,
      },
    },
    attributes: [
      {
        trait_type: "Rarity",
        value: "Normal",
      },
      {
        trait_type: "Collection",
        value: "The Origin",
      },
      {
        trait_type: "Volume",
        value: "1",
      },
      {
        trait_type: "No",
        value: "1",
      },
    ],
  },
  {
    itemId: 1,
    itemName: "กล้วยตานีปลายหวีเหี่ยว",
    itemImage: `${path}9 Banana.png`,
    itemDescription:
      "กล้วยวิเศษที่ปลายหวีเหี่ยว ดังนึ้นจึงหิวหวีไปมาบ่อยๆ ไม่ได้",
    itemEffect: {
      player: {
        hp: 10,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 0,
        VIT: 0,
        INT: 0,
      },
      enemy: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 1,
        AGI: 0,
        VIT: 0,
        INT: 0,
      },
    },
    attributes: [
      {
        trait_type: "Rarity",
        value: "Rare",
      },
      {
        trait_type: "Collection",
        value: "The Origin",
      },
      {
        trait_type: "Volume",
        value: "1",
      },
      {
        trait_type: "No",
        value: "2",
      },
    ],
  },
  {
    itemId: 2,
    itemName: "ดาบมะเขื่อยาว",
    itemImage: `${path}1 Sword.png`,
    itemDescription:
      "ดาบมะเขือยาวแห่ง kpunk smith ถูกผลิตในเหมืองทองคำ แต่ดันออกมาเป็นเงิน? ไรว๊า แต่มันบวก STR 5 เลยน๊ะ",
    itemEffect: {
      player: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 5,
        AGI: 0,
        VIT: 0,
        INT: 0,
      },
      enemy: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 0,
        VIT: 0,
        INT: 0,
      },
    },
    attributes: [
      {
        trait_type: "Rarity",
        value: "Normal",
      },
      {
        trait_type: "Collection",
        value: "The Origin",
      },
      {
        trait_type: "Volume",
        value: "1",
      },
      {
        trait_type: "No",
        value: "3",
      },
    ],
  },
  {
    itemId: 3,
    itemName: "กล้วยพิษ หว่๋ายยยยย !",
    itemImage: `${path}12 Poison Cucumber.png`,
    itemDescription:
      "กล้วยพิษชนิดนี้นะ มันลดพลังเรา แต่เวลาเราเมาเราจะ วิ่งอย่างไว +AGI 5, +STR 5 ดิงั้น",
    itemEffect: {
      player: {
        hp: -10,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 5,
        AGI: 5,
        VIT: 0,
        INT: 0,
      },
      enemy: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 0,
        VIT: 0,
        INT: 0,
      },
    },
    attributes: [
      {
        trait_type: "Rarity",
        value: "Normal",
      },
      {
        trait_type: "Collection",
        value: "The Origin",
      },
      {
        trait_type: "Volume",
        value: "1",
      },
      {
        trait_type: "No",
        value: "4",
      },
    ],
  },
  {
    itemId: 4,
    itemName: "ไม้เท้า to the star",
    itemImage: `${path}8 Star Wand.png`,
    itemDescription:
      "เค้า to the saturn, to the moon กัน แต่เราจะไปถึง the star อี๊ ๆ ๆ +INT 2",
    itemEffect: {
      player: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 0,
        VIT: 0,
        INT: 2,
      },
      enemy: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 0,
        VIT: 0,
        INT: 0,
      },
    },
    attributes: [
      {
        trait_type: "Rarity",
        value: "Super Rare",
      },
      {
        trait_type: "Collection",
        value: "The Origin",
      },
      {
        trait_type: "Volume",
        value: "1",
      },
      {
        trait_type: "No",
        value: "5",
      },
    ],
  },
  {
    itemId: 5,
    itemName: "แว่น 8 บิต",
    itemImage: `${path}2 Black Glasses.png`,
    itemDescription:
      "แว่นของ The Flash ถรุ๊ย ! ไม่ใช่ดิ แว่น 8 บิต ดิค๊าบบบ +AGI 1 ไปดิ",
    itemEffect: {
      player: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 1,
        VIT: 0,
        INT: 0,
      },
      enemy: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 0,
        VIT: 0,
        INT: 0,
      },
    },
    attributes: [
      {
        trait_type: "Rarity",
        value: "Normal",
      },
      {
        trait_type: "Collection",
        value: "The Origin",
      },
      {
        trait_type: "Volume",
        value: "1",
      },
      {
        trait_type: "No",
        value: "6",
      },
    ],
  },
  {
    itemId: 6,
    itemName: "MAD Shield",
    itemImage: `${path}3 Mad Shield.png`,
    itemDescription: "โล่ขนาดใหญ่ ! +VIT 2 จะถึกไปไหนเนี่ย!",
    itemEffect: {
      player: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 0,
        VIT: 2,
        INT: 0,
      },
      enemy: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 0,
        VIT: 0,
        INT: 0,
      },
    },
    attributes: [
      {
        trait_type: "Rarity",
        value: "Normal",
      },
      {
        trait_type: "Collection",
        value: "The Origin",
      },
      {
        trait_type: "Volume",
        value: "1",
      },
      {
        trait_type: "No",
        value: "7",
      },
    ],
  },
  {
    itemId: 7,
    itemName: "Holy Shield",
    itemImage: `${path}4 Holy Shield.png`,
    itemDescription: "โล่ศักดิ์สิทธิ์ ! +VIT 3 โฮฮฮฮฮ​ล่า!",
    itemEffect: {
      player: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 0,
        VIT: 3,
        INT: 0,
      },
      enemy: {
        hp: 0,
        burn: false,
        freeze: false,
        poison: [0, 0],
        STR: 0,
        AGI: 0,
        VIT: 0,
        INT: 0,
      },
    },
    attributes: [
      {
        trait_type: "Rarity",
        value: "Normal",
      },
      {
        trait_type: "Collection",
        value: "The Origin",
      },
      {
        trait_type: "Volume",
        value: "1",
      },
      {
        trait_type: "No",
        value: "8",
      },
    ],
  },
];
