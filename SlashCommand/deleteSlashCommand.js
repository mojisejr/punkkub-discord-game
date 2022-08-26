require("dotenv").config({ path: "./config.env" });
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const rest = new REST({ version: 9 }).setToken(process.env.punkkubBotToken);

rest
  .put(
    Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
    { body: [] }
  )
  .then(() => console.log("OK! deleted all"))
  .catch(console.error);
