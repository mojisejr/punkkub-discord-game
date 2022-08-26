const { Client, Intents, MessageEmbed } = require("discord.js");

const intents = new Intents();

intents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MEMBERS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_MESSAGE_REACTIONS
);

const client = new Client({
  intents,
});

client.once("ready", async () => {
  console.log("punkkub-discord-game-v1 is ready");
});

client.login(process.env.punkkubBotToken);

module.exports = {
  bot: client,
};
