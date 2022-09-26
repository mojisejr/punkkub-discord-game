const gamesetting = require("../constants/gamesetting");
function createProfileEmbed(profile) {
  const {
    fightCount,
    exp,
    lastfightTime,
    pvpLost,
    pvpWin,
    lost,
    level,
    dailyPveCount,
    dailyPvpCount,
    win,
    winrate,
    pvpWinrate,
    id,
    username,
    avatarURL,
    resources,
  } = profile;
  const { dailyPveLimit, dailyPvpLimit } = gamesetting;
  let mappedResources = embedResourceMapper(resources);
  mappedResources = mappedResources == undefined ? [] : mappedResources;
  embed = {
    color: 0x43e605,
    title: `PunkKub Discord Game Profile`,
    author: {
      name: username,
    },
    description: `Punkkub NFT Discord Game Profile of <@${id}>`,
    thumbnail: {
      url: avatarURL != null ? avatarURL : "N/A",
    },
    fields: [
      {
        name: "Level",
        value: level.toString(),
        inline: true,
      },
      {
        name: "EXP",
        value: exp.toString(),
        inline: true,
      },
      {
        name: "LastFight",
        value: `${
          lastfightTime == "" ? "N/A" : new Date(+lastfightTime).toISOString()
        }`,
        inline: true,
      },
      {
        name: "Daily PVE",
        value: `${dailyPveCount}/${dailyPveLimit}`,
        inline: true,
      },
      {
        name: "Daily PVP",
        value: `${dailyPvpCount}/${dailyPvpLimit}`,
        inline: true,
      },
      {
        name: "Win Rate (PVE)",
        value: `${winrate == "NaN" ? "N/A" : winrate} %`,
        inline: true,
      },
      {
        name: "Win Rate (PVP)",
        value: `${pvpWinrate == "NaN" ? "N/A" : pvpWinrate} %`,
        inline: true,
      },
      {
        name: "Win/Lost (PVP)",
        value: `${pvpWin}/${pvpLost}`,
      },
      {
        name: "Win/Lost (PVE)",
        value: `${win}/${lost}`,
        inline: true,
      },
      {
        name: "All fights",
        value: fightCount.toString(),
        inline: true,
      },
      mappedResources,
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: "🔫 Punkkub discord game Version 1.0",
    },
  };
  return embed;
}

function embedResourceMapper(resources = []) {
  if (resources.length <= 0) return;
  const mapped = resources.map((res) => {
    return {
      name: `${res.itemEmoji} ${res.itemName}`,
      value: `${res.amounts}`,
      inline: false,
    };
  });
  return mapped;
}

module.exports = {
  createProfileEmbed,
};
