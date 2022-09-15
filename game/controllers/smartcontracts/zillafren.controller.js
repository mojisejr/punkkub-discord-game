const { nftTokens } = require("../../../database/near");
const axios = require("axios");

const gateway = "https://zillafrens.mypinata.cloud/ipfs/";

async function getRandomZilla(hp) {
  const zillafrens = await nftTokens();
  const position = Math.floor(Math.random() * zillafrens.length + 1);
  const zilla = zillafrens[position];
  const attributes = await getZillaAttributes(zilla);
  // const media = await getZillaImage(zilla);
  // return { ...zilla, media };
  const zillaData = {
    result: true,
    data: {
      id: zilla.token_id,
      tokenId: zilla.metadata.title,
      imageUrl: zilla.metadata.media,
      attributes,
      rarity: 0,
      hp,
      discordId: "zilla",
    },
  };
  // console.log(zillaData);
  return zillaData === undefined ? { result: false, data: null } : zillaData;
}

async function getZillaAttributes(zilla, offset = 8) {
  const ref = zilla.metadata.reference;
  const data = await parsePinata(ref);
  const attributes = data.attributes;
  return attributes.slice(offset);
}

function getRandomStatusZillaAttribute(
  punk,
  zilla,
  punkOffset = 3,
  zillaOffset = 0
) {
  const punkAttr1 = punk.attributes.slice(punkOffset, punk.length);
  let zillaAttr2 = zilla.attributes.slice(zillaOffset);

  const position = Math.floor(Math.random() * punkAttr1.length);
  const selectedAttr1 = punkAttr1[position];
  let selectedAttr2 = zillaAttr2[position];

  return { selectedAttr1, selectedAttr2 };
}

// async function getZillaImage(zilla) {
//   const ref = zilla.metadata.media;
//   console.log(ref);
//   const data = parsePinata(ref);
//   return data;
// }

async function parsePinata(url) {
  const splitted = url.split("/");
  const newURL = `${gateway}${splitted[4]}/${splitted[5]}`;
  const { data } = await axios.get(newURL);
  return data;
}

module.exports = {
  getRandomZilla,
  getRandomStatusZillaAttribute,
};
