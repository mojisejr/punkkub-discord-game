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
  dailyPveLimit: 100,
  dailyPvpLimit: 10,
  pveChannelId: "1012385513208025169",
  pvpChannelId: "1012385549027377364",
  wpveChannelId: "",
  guestpveChannelId: "1012581577651392532",
  fightingParams: {
    counter: {
      l1: {
        count: 30,
        rate: 50,
      },
      l2: {
        count: 40,
        rate: 20,
      },
      l3: {
        count: 40,
        rate: 15,
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
