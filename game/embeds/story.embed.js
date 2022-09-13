const { numberToEmoji } = require("../../helper/number.emoji");

function createBeginStory() {
  embed = {
    color: 0x43e605,
    title: `PunkKub Discord Game : [The Origin]`,
    description: `ยินดีต้อนรับเพื่อนๆ เข้า punkkub discord game [Beta test] รอบที่ 1`,
    fields: [
      {
        name: " 🐒 The World of APE ! 🐒",
        value: `***The Punk*** ดินแดนแห่งความเสรี ไม่มีพรหมแดน...
        ความหลากหลายทางชีวภาพในโลกจริงและเสมือน หล่อหลอมให้เรา
        เหล่า PUNK เป็นหนึ่งในนักผจัญภัยนักสำรวจค้นหา สิ่งที่หายาก.. 
        สิ่งมีค่าต่างๆ และเพื่อเป้าหมายสูงสุด **"ความยั่งยืนของครอบครัว PUNK"**
          แล้วในโลก เสมือนแห่งหนึ่งที่พวกเราเดินทางเข้าไปสำรวจ 
        เต็มไปด้วยสิ่งมีชีวิตที่เรียกว่า **"APE"** ครอบครองอยู่ การผจัญภัยในครั้งนี้
        บนโลกที่พวกเราเหล่า PUNK ตั้งชื่อให้มันว่า THE WORLD OF APE !
        จะเป็นอย่างไร นองเลือด หรือ รวมฝูง เกิดเป็นสิ่งมีชีวิตใหม่ ๆ 
        แก่งแย่ง หรือ กลมเกลียว !
        "พวกคุนเท่านั้น เป็นผู้กำหนดชะตากรรมของ PUNK COMMUNITY !"
        ***พร้อมหรือยัง !~*** ⚔️`,
      },
      {
        name: "⏱ ระยะเวลาเปิด",
        value: "15 SEP - 30 SEP 2022",
        inline: true,
      },
      {
        name: "⚙️ version",
        value: "beta1",
        inline: true,
      },
      {
        name: "🛠 คำสั่งต่างๆ",
        value: `${numberToEmoji(
          1
        )} **[/punkpvp<แทคเพื่อน>]** เล่นโหมด pvp กับเพื่อนโดยเราเลือก tag เพื่อนที่เป็น holder ! ผู้ชนะเท่านั้นถึงจะได้ EXP

        ${numberToEmoji(
          2
        )} **[/punkpve]** เล่นโหมด pve ลุยโลกแห่ง APE ในภาคนี้ เก็บ EXP และของต่างๆ มาพัฒนา Community กัน !

        ${numberToEmoji(
          3
        )} **[/guestpve]** เล่นโหมด pve สำหรับ non - holder ลองดิ แล้วอย่าลืมแนะนำเพื่อนให้มาเล่นนะคับ !

        ${numberToEmoji(4)} **[/quest]** เชคดูซิว่ามีเควสอะไรให้ทำบ้างหละ !

        ${numberToEmoji(
          5
        )} **[/getquest<เลขเควส>]** เลือกรับ quest ที่จะทำ โดนที่ใส่ตัวเลข ลำดับของ quest จากคำสั่ง /quest ได้เลย!

        ${numberToEmoji(6)} **[/profile]** ดูพัฒนาการของเราได้ที่นี่เลย !!

        ${numberToEmoji(
          7
        )} **[/leaderboard]** ดูตาราง Ranking ลำดับการเก็บ EXP ได้ที่นี่!!
        `,
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
  createBeginStory,
};
