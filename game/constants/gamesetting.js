module.exports = {
  status: 0,
  maxHp: 50,
  attributesOffset: 3,
  rarity: {
    Normal: "Normal",
    Rare: "Rare",
    SuperRare: "Super Rare",
    SuperSpecialRare: "Super Spcecial Rare",
    UltraRare: "Ultra Rare",
  },
  dailyPveLimit: 10,
  dailyPvpLimit: 10,
  daliyQuestsId: [1, 2],
  pveChannelId: "1019235623292375080",
  pvpChannelId: "1019236029586214982",
  guestpveChannelId: "1013440351974981702",
  logsChannelId: "",
  fightingParams: {
    counter: {
      l1: {
        count: 50,
        rate: 300,
      },
      l2: {
        count: 40,
        rate: 200,
      },
      l3: {
        count: 30,
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
