const { Collection } = require("./firestore");
async function addVerifiedPunk(punkData) {
  const { wallet, discordName, discordId, timestamp, lastbalance, verified } =
    punkData;

  const response = await Collection.Holder.doc(wallet).set({
    discordName,
    discordId,
    lastbalance,
    timestamp,
    verified,
  });
  return response;
}

async function updatePunkVerificationState(wallet, balance, status) {
  await Collection.Holder.doc(wallet).update({
    lastbalance: balance,
    verified: status,
  });
}

async function getAllVerifiedPunk() {
  const response = await Collection.Holder.get();
  let allPunk = [];
  response.forEach((punk) => {
    allPunk.push({ wallet: punk.id, ...punk.data() });
  });

  if (allPunk.length <= 0) {
    throw new Error("database is empty");
  }

  return allPunk;
}

async function getPunkByDiscordName(discordName) {
  const allPunk = await getAllVerifiedPunk();
  const found = allPunk.find((punk) => punk.discordName == discordName);

  if (found) {
    return found;
  } else {
    return null;
  }
}

async function getPunkByDiscordId(discordId) {
  const allPunk = await getAllVerifiedPunk();
  const found = allPunk.find((punk) => punk.discordId == discordId);

  if (found) {
    return found;
  } else {
    return null;
  }
}
async function getPunkByWallet(wallet) {
  const allPunk = await getAllVerifiedPunk();
  const found = allPunk.find((punk) => punk.wallet == wallet);

  if (found) {
    return found;
  } else {
    return null;
  }
}

async function reverifyCheck(discordId, oldWallet) {
  const snapshot = await Collection.Holder.doc(oldWallet).get();
  const found = snapshot.data();
  if (found === undefined) {
    return {
      msg: "กระเป๋านี้ยังไม่ได้ verify เลยนะ ! ไป /gupunk ก่อนนะ [non-verified] 🥶",
      result: false,
    };
  } else {
    const discordOK = found.discordId == discordId;
    const walletOK = snapshot.id != oldWallet;
    if (discordOK && walletOK) {
      return {
        result: true,
        msg: "กระเป๋านี้ผ่านการ verify มาแล้ว [wallet - ok]",
      };
    } else {
      return {
        result: false,
        msg: "verify ไปแล้วนี่นา กระเป๋าใบนี้ [already verified]",
      };
    }
  }
}

async function deleteHolderData(wallet) {
  await Collection.Holder.doc(wallet).delete();
}

module.exports = {
  addVerifiedPunk,
  updatePunkVerificationState,
  getPunkByDiscordName,
  getPunkByDiscordId,
  getPunkByWallet,
  reverifyCheck,
  deleteHolderData,
};
