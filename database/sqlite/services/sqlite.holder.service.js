const Holder = require("../models/holder.model");

async function newVerifiedHolder(holderData) {
  const { wallet, discordName, discordId, timestamp, lastbalance, verified } =
    holderData;
  const found = await Holder.findOne({ where: discordId });
  if (found == null) {
    await Holder.create({
      id: wallet,
      discordId,
      discordName,
      lastbalance,
      timestamp,
      verified,
    });
  }
}

async function updateVerificationState(id, lastbalance, verified) {
  await Holder.update(
    { lastbalance, verified },
    {
      where: { id },
    }
  );
}

async function getAllVerifiedHolders() {
  const responses = await Holder.findAll();
  const data = responses.map((response) => {
    return holderDataTransform(response);
  });
  return data;
}

async function getHolderByDiscordName(discordName) {
  const found = await Holder.findOne({ where: { discordName } });
  if (found != null) {
    return holderDataTransform(found);
  } else {
    return null;
  }
}

async function getHolderByDiscordId(discordId) {
  const found = await Holder.findOne({ where: { discordId } });
  if (found !== null) {
    return holderDataTransform(found);
  } else {
    return null;
  }
}

async function getHolderByWallet(wallet) {
  const found = await Holder.findOne({ where: { id: wallet } });
  if (found !== null) {
    return holderDataTransform(found);
  } else {
    return null;
  }
}

async function deleteHolderData(wallet) {
  await Holder.destroy({ where: { id: wallet } });
}

//Helper
function holderDataTransform(input) {
  if (input == null) {
    return null;
  }
  const data = input.dataValues;
  return {
    wallet: data.id,
    discordId: data.discordId,
    discordName: data.discordName,
    lastbalance: data.lastbalance,
    timestamp: data.timestamp,
    verified: data.verified,
  };
}

module.exports = {
  newVerifiedHolder,
  updateVerificationState,
  getAllVerifiedHolders,
  getHolderByDiscordId,
  getHolderByDiscordName,
  getHolderByWallet,
  deleteHolderData,
};
