const { ethers } = require("ethers");
const axios = require("axios");
const { rarity } = require("../../constants/gamesetting");
const contract = require("../../constants/contract");

//PUNKKUB Smart contract controller

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.bitkubchain.io"
);

const punkkub = new ethers.Contract(
  contract.punkkub,
  [
    "function tokenOfOwnerAll(address) external view returns(uint256[] memory)",
    "function ownerOf(uint256) external view returns(address)",
    "function tokenURI(uint256) external view returns(string memory)",
    "function balanceOf(address) external view returns(uint256)",
  ],
  provider
);

//getPunkDataFromDiscordWalletRandomly
async function getRandomPunkFromDiscord(discordId, hp = 100) {
  console.log(discordId);
  try {
    const { wallet } = await getWalletFromDiscordId(discordId);
    // console.log(wallet);
    const randomedPunk = await getRandomPunkFromWallet(wallet, hp, discordId);
    return randomedPunk;
  } catch {
    return {
      result: false,
      data: {
        discordId,
      },
    };
  }
}

async function getRandomPunkFromWallet(wallet, hp, discordId) {
  const selectedPunk = await getRandomTokenFromWallet(wallet);
  return {
    result: true,
    data: {
      discordId,
      hp,
      ...selectedPunk.token,
    },
  };
}

async function getRandomTokenFromWallet(wallet) {
  try {
    const pTokens = await getAllTokenFromWallet(wallet);
    const selectedToken = getRandomTokenPosition(pTokens.tokens);
    const { data } = await getDataFromTokenURI(selectedToken.data);
    return {
      result: true,
      token: {
        id: selectedToken.data.toString(),
        tokenId: data.name,
        imageUrl: data.image,
        attributes: data.attributes,
        rarity: rarityCheck(data.attributes[0].value),
      },
    };
  } catch {
    return {
      result: false,
      token: null,
    };
  }
}

function rarityCheck(input) {
  console.log("input", input);
  switch (input) {
    case rarity.Normal:
      return 0;
      break;
    case rarity.Rare:
      return 1;
      break;
    case rarity.SuperRare:
      return 2;
      break;
    case rarity.SuperSpecialRare:
      return 3;
      break;
    case rarity.UltraRare:
      return 4;
      break;
  }
}

function getRandomTokenPosition(tokens = []) {
  if (tokens.length <= 0) {
    return { result: false, rand: null };
  } else {
    const rand = Math.floor(Math.random() * tokens.length);

    return {
      result: true,
      data: tokens[rand],
    };
  }
}

async function getAllTokenFromWallet(wallet) {
  try {
    const tokens = await punkkub.tokenOfOwnerAll(wallet);
    return {
      result: true,
      tokens,
    };
  } catch {
    return {
      result: false,
      tokens: null,
    };
  }
  return;
}

async function getDataFromTokenURI(tokenId) {
  try {
    const uri = await punkkub.tokenURI(tokenId.toString());
    const response = await axios.get(uri);
    return {
      result: true,
      data: response.data,
    };
  } catch (e) {
    console.log(e);
    return { result: false, data: null };
  }
}

function getRandomStatusFromAttribute(offset = 3, token1, token2) {
  const attrLen1 = token1.attributes.length;
  const position = Math.floor(Math.random() * (attrLen1 - offset)) + offset;
  const selectedAttr1 = token1.attributes[position];
  const selectedAttr2 = token2.attributes[position];
  return { selectedAttr1, selectedAttr2 };
}

async function hasPunkInWallet(wallet) {
  if (wallet === undefined || wallet == null) return false;
  const result = await punkkub.balanceOf(wallet);
  const balance = parseInt(result.toString());
  if (balance <= 0) return false;
  return true;
}

hasPunkInWallet("0x003e324fc667fcc2d933480d55c5e3c26b75459d");

module.exports = {
  getRandomPunkFromDiscord,
  getRandomPunkFromWallet,
  getRandomStatusFromAttribute,
  hasPunkInWallet,
};
