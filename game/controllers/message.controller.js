const { bot } = require("../../discord.bot");
const { COMMANDS } = require("../constants/commands");
const gamesetting = require("../constants/gamesetting");

//BOT message reply helper

function reply(message, command) {
  const { pveChannelId, pvpChannelId, guestpveChannelId } = gamesetting;
  switch (command) {
    case COMMANDS.PVE: {
      return bot.channels.cache.get(pveChannelId).send(message);
    }
    case COMMANDS.PVP: {
      return bot.channels.cache.get(pvpChannelId).send(message);
    }
    case COMMANDS.GPVE: {
      return bot.channels.cache.get(guestpveChannelId).send(message);
    }
    default: {
      return bot.channels.cache.get(pveChannelId).send(message);
    }
  }
}

function replyImage(message) {
  return bot.channels.cache
    .get(process.env.gameChannelId)
    .send({ files: [{ attachment: message, name: "punkImageSystem.png" }] });
}

async function updateFightingMessage(fn = null, message, command) {
  if (fn == null) {
    const object = await reply(message, command);
    return object;
  } else {
    await fn.edit(message);
  }
}

module.exports = {
  reply,
  replyImage,
  updateFightingMessage,
};
