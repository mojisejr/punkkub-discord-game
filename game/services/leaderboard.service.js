const { Collection } = require("../../database/firestore");
const { bot } = require("../../discord.bot");
const { numberToEmoji } = require("../../helper/number.emoji");
const { renderLeaderBoard } = require("../renderer/renderer");

async function getAllProfileData(type = "desc") {
  const snapshot = await Collection.Profile.get();
  const users = snapshot.docs.map((user) => {
    return {
      discordId: user.id,
      ...user.data(),
    };
  });

  sortData(users, type);
  if (users.length <= 0) {
    return {
      result: false,
      embed: {
        color: 0xff2245,
        title: `PunkKub Discord Game : [EXP ranking]`,
        description: `อันดับ EXP ใครชื่อยังไม่ขึ้นต้อง จัดหนักกันสักหน่อยป๊ะ`,
        fields: [{ name: "ยังไม่มีการจัดอันดับ", value: "N/A" }],
        timestamp: new Date().toISOString(),
        footer: {
          text: "🔫 Punkkub discord game Version 1.0",
        },
      },
    };
  }

  //only one to tenth rank
  let firstTenth = users.length > 10 ? users.slice(0, 9) : users;
  // const fieldData = await Promise.all(
  //   firstTenth.map(async (user, index) => {
  //     const u = await bot.users.fetch(user.discordId);
  //     return {
  //       no: `${index + 1}`,
  //       image: `${u.avatarURL()}`,
  //       name: `${u.tag}`,
  //       score: `${user.exp}`,
  //       type: "exp",
  //     };
  //   })
  // );
  const fieldData = await Promise.all(
    firstTenth.map(async (user, index) => {
      const u = await bot.users.fetch(user.discordId);
      return {
        name: `${numberToEmoji(index + 1)} : ${u.tag}`,
        value: `${user.exp} exp`,
      };
    })
  );

  // const leaderboard = await renderLeaderBoard(fieldData);

  // return {
  //   result: true,
  //   embed: leaderboard,
  // };
  return {
    embed: {
      color: 0x43e605,
      title: `PunkKub Discord Game : [EXP ranking]`,
      description: `อันดับ EXP ใครชื่อยังไม่ขึ้นต้อง จัดหนักกันสักหน่อยป๊ะ`,
      fields: fieldData,
      timestamp: new Date().toISOString(),
      footer: {
        text: "🔫 Punkkub discord game Version 1.0",
      },
    },
  };
}

function sortData(data = [], type = "desc") {
  if (data.length <= 0) return [];
  switch (type) {
    case "asc": {
      data.sort((a, b) => a.exp - b.exp);
    }
    case "desc": {
      data.sort((a, b) => b.exp - a.exp);
    }
    default: {
      data.sort((a, b) => b.exp - a.exp);
    }
  }
}

module.exports = {
  getAllProfileData,
};
