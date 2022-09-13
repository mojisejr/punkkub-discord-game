const { numberToEmoji } = require("../../helper/number.emoji");

function createAnnouncement() {
  embed = {
    color: 0x43e605,
    title: `PunkKub Discord Game : [The Origin]`,
    description: `ยินดีต้อนรับเพื่อนๆ เข้า punkkub discord game [Beta test] รอบที่ 1`,
    fields: [
      {
        name: "🦧 The World of APE ! 🐒",
        value: `Comming very soon: beta test กำลังจะเริ่มขึ้นในไม่ช้า
        *** อดใจรอกันสักนิด ***`,
      },
      {
        name: "⏱ เวลาเปิด",
        value: "TBA",
        inline: true,
      },
      {
        name: "⚙️ version",
        value: "beta1",
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: "🔫 Punkkub discord game Version 1.0",
    },
  };
  return embed;
}

module.exports = {
  createAnnouncement,
};
