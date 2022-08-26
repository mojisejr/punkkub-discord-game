const { ethers } = require("ethers");
const axios = require("axios");
const { apekub } = require("../../constants/contract");
const { rarity } = require("../../constants/gamesetting");

//APEKUB Smart contract controller

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.bitkubchain.io"
);

const apecontract = new ethers.Contract(
  apekub,
  [
    "function tokenOfOwnerAll(address) external view returns(uint256[] memory)",
    "function ownerOf(uint256) external view returns(address)",
    "function tokenURI(uint256) external view returns(string memory)",
  ],
  provider
);

//getPunkDataFromDiscordWalletRandomly
async function getRandomNFTFromDiscord(discordId, hp = 100) {
  try {
    const { wallet } = await getWalletFromDiscordId(discordId);
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

async function getRandomNFTFromWallet(wallet, hp, discordId) {
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
  } catch (e) {
    console.log(e);
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
    const tokens = await apecontract.tokenOfOwnerAll(wallet);
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
    const uri = await apecontract.tokenURI(tokenId.toString());
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

function getRandomStatusApeAttribute(punk, ape, punkOffset = 3, apeOffset = 1) {
  const punkAttr1 = punk.attributes.slice(punkOffset, punk.length);
  let apeAttr2 = ape.attributes.slice(apeOffset, 5);
  //swap position
  const tempInt = apeAttr2[2];
  apeAttr2[2] = apeAttr2[3];
  apeAttr2[3] = tempInt;

  const position = Math.floor(Math.random() * punkAttr1.length);
  const selectedAttr1 = punkAttr1[position];
  let selectedAttr2 = apeAttr2[position];
  //standardize ape status
  const std = standardizeApeStatus(selectedAttr2);
  selectedAttr2 = { ...selectedAttr2, value: std };
  return { selectedAttr1, selectedAttr2 };
}

function standardizeApeStatus(selectedAttr2) {
  const amin = 1;
  const amax = 100;
  const pmin = 1;
  const pmax = 9;
  const std = Math.round(
    (pmax - pmin) * ((selectedAttr2.value - amin) / (amax - amin)) + pmin
  );
  return std;
}

module.exports = {
  getRandomNFTFromDiscord,
  getRandomNFTFromWallet,
  getRandomStatusApeAttribute,
};
