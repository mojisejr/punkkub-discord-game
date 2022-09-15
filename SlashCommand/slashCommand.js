require("dotenv").config({ path: "./config.env" });
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const commands = [
  new SlashCommandBuilder()
    .setName("profile")
    .setDescription("ดูโปรไฟล์ และพัฒนาการของเพื่อนๆ !"),
  new SlashCommandBuilder()
    .setName("guestpve")
    .setDescription(
      "สำหรับเพื่อนๆ ทั่วไปที่ไม่ใช่ punkholder นะทดสอบลองเล่นกันได้ !"
    ),
  new SlashCommandBuilder()
    .setName("punkpve")
    .setDescription(
      "PVE ทำสงครามกับเหล่า NFT ใน bitkub chain ! ไปประลองฝีมือกัน ! (รับ EXP และ Item ต่างๆ)"
    )
    .addStringOption((option) =>
      option
        .setName("dungeon")
        .setDescription("เลือกเลยจะสู้กับคราย!")
        .setRequired(true)
        .addChoices(
          {
            name: "Ape",
            value: "Ape",
          },
          { name: "Zilla", value: "Zilla" }
        )
    ),
  new SlashCommandBuilder()
    .setName("quest")
    .setDescription("เปิดรายการเควสให้ดูหน่อย !"),
  new SlashCommandBuilder()
    .setName("getquest")
    .setDescription(
      "เลือกรับเควสที่ต้องการ ด้วยการพิมพ์ตัวเลขตามหัวข้อของเควสในรายการเควส ! /quest ดูก่อนดีมะ ?"
    )
    .addIntegerOption((option) =>
      option
        .setName("questnumber")
        .setDescription("ใส่ตัวเลขหัวข้อเควสที่ต้องการจะทำ !~")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("punkbegin")
    .setDescription(
      "ไง ! พังค์พวก ! ต้อนรับเข้าสู่โลกของ punkkub discord game ! ทุกอย่างเริ่มจากคำสั่งนี้ !"
    ),
  new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("ตารางจัดอันดับ !"),
  new SlashCommandBuilder()
    .setName("punkpvp")
    .setDescription("PVP กับเพื่อนๆ ที่เป็น holder !")
    .addMentionableOption((option) =>
      option
        .setName("opponent")
        .setDescription("เลือกคู่ต่อสู้ของเพื่อนๆ เลย!")
        .setRequired(true)
    ),
].map((command) => command.toJSON());

const rest = new REST({ version: 9 }).setToken(process.env.punkkubBotToken);

rest
  .put(
    Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
    { body: commands }
  )
  .then(() => console.log("OK! lets get punk it!"))
  .catch(console.error);
