module.exports = {
  status: 1,
  maxHp: 20,
  attributesOffset: 3,
  rarity: {
    Normal: "Normal",
    Rare: "Rare",
    SuperRare: "Super Rare",
    SuperSpecialRare: "Super Spcecial Rare",
    UltraRare: "Ultra Rare",
  },
  dailyPveLimit: 5,
  dailyPvpLimit: 5,
  daliyQuestsId: [1, 2],
  pveChannelId: "1003238370358595644",
  pvpChannelId: "1013641883639099412",
  guestpveChannelId: "1013440351974981702",
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
    multiplier: 1,
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
