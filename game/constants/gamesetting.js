module.exports = {
  status: 1,
  maxHp: 30,
  attributesOffset: 3,
  rarity: {
    Normal: "Normal",
    Rare: "Rare",
    SuperRare: "Super Rare",
    SuperSpecialRare: "Super Spcecial Rare",
    UltraRare: "Ultra Rare",
  },
  dailyPveLimit: 100,
  dailyPvpLimit: 10,
  daliyQuestsId: [1, 2],
  //DEV
  pveChannelId: "1019976184756445305",
  pvpChannelId: "1019976164917383178",
  guestpveChannelId: "1019976215983050803",
  logsChannelId: "965474646499663954",
  //
  //Production
  // pveChannelId: "1019235623292375080",
  // pvpChannelId: "1019236029586214982",
  // guestpveChannelId: "1019236201871442031",
  // logsChannelId: "",
  //
  fightingParams: {
    counter: {
      l1: {
        count: 30,
        rate: 300,
      },
      l2: {
        count: 50,
        rate: 200,
      },
      l3: {
        count: 50,
        rate: 150,
      },
    },
    multiplier: 2,
  },
  itemParams: {
    counter: {
      l1: {
        count: 30,
        rate: 6,
      },
      l2: {
        count: 40,
        rate: 4,
      },
      l3: {
        count: 40,
        rate: 2,
      },
    },
    multiplier: 1,
    dropRate: 20,
  },
  globalParams: {
    multiplier: 2,
  },
};
