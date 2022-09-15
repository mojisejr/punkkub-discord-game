const { createCanvas, loadImage } = require("canvas");
const { CommandInteractionOptionResolver } = require("discord.js");
const basePath = process.cwd();

const width = 720;
const height = 720;
const framePath = `${basePath}/game/renderer/frame/fightBG1.png`;
const playerWinnerPath = `${basePath}/game/renderer/frame/playerWin.png`;
const enemyWinnerPath = `${basePath}/game/renderer/frame/enemyWin.png`;
const vsPath = `${basePath}/game/renderer/frame/VS.png`;
const framePath1 = `${basePath}/game/renderer/frame/fightingUI.jpg`;
const leaderboard = `${basePath}/game/renderer/frame/leaderboard.jpg`;

function renderText(text, ctx, x, y, size = 30, color = "#FFFFF1") {
  ctx.font = `${size}px serif bold`;
  ctx.fillStyle = `${color}`;
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
}

async function renderFightingImage1(
  player,
  enemy,
  hittedToken,
  playerItem,
  enemyItem,
  item1Image,
  item2Image,
  selectedAttr1,
  selectedAttr2,
  counter,
  atk,
  player1Image,
  player2Image
) {
  // console.log(`
  // รอบที่ : [${counter}]
  // @${
  //   hittedToken == 0 ? player.tokenId : enemy.tokenId
  // } โดนโจมตีปกติ [${atk}] hp เหลือ [${
  //   hittedToken == 0 ? player.hp : enemy.hp
  // }/50]
  // `);
  const frame = { w: 1920, h: 1080 };
  const hp1 = { x: 255, y: 375, w: 130, h: 89 };
  const hp2 = { x: 1664, y: 375, w: 130, h: 89 };
  const atk1 = { x: 814, y: 820, w: 130, h: 89 };
  const atk2 = { x: 1117, y: 820, w: 130, h: 89 };
  const item1Pos = { x: 143, y: 530, w: 250, h: 365 };
  const item2Pos = { x: 1527, y: 540, w: 250, h: 365 };
  const pic1 = { x: 460, y: 234, w: 375, h: 375 };
  const pic2 = { x: 1088, y: 234, w: 375, h: 375 };
  // const textPos = { x: 960, y: 180 };
  const roundPos = { x: 956, y: 540 };
  const status1Pos = { x: 502, y: 740 };
  const status2Pos = { x: 1415, y: 740 };

  const canvas = createCanvas(frame.w, frame.h);

  const ctx = canvas.getContext("2d");

  const frameImage = await loadImage(framePath1);
  // const player1Image = await loadImage(player.imageUrl);
  // const player2Image = await loadImage(enemy.imageUrl);

  ctx.drawImage(frameImage, 0, 0, frame.w, frame.h);
  ctx.drawImage(player1Image, pic1.x, pic1.y, pic1.w, pic1.h);
  ctx.drawImage(player2Image, pic2.x, pic2.y, pic2.w, pic2.h);
  renderText(player.hp, ctx, hp1.x, hp1.y, 100, "#ffffff");
  renderText(enemy.hp, ctx, hp2.x, hp2.y, 100, "#ffffff");
  // renderText(player.tokenId, ctx, 320, 390);
  // renderText(enemy.tokenId, ctx, 630, 390);

  if (counter > 0) {
    renderText(`${counter}`, ctx, roundPos.x, roundPos.y, 60, "#44e504");
    renderText(
      `${selectedAttr1.trait_type}[${selectedAttr1.value}]`,
      ctx,
      status1Pos.x,
      status1Pos.y,
      50,
      "#44e504"
    );
    renderText(
      `${selectedAttr2.trait_type}[${selectedAttr2.value}]`,
      ctx,
      status2Pos.x,
      status2Pos.y,
      50,
      "#44e504"
    );
  }

  //hit point deduction display
  if (hittedToken == 0) {
    renderText(`-${atk}`, ctx, atk1.x, atk1.y, 120, "#FFFF00");
  } else if (hittedToken == 1) {
    renderText(`-${atk}`, ctx, atk2.x, atk2.y, 120, "#FFFF00");
  }

  //item checking
  if (item1Image != null && item2Image == null) {
    item1 = await loadImage(item1Image);
    ctx.drawImage(item1, item1Pos.x, item1Pos.y, item1Pos.w, item1Pos.h);
  } else if (item2Image != null && item1Image == null) {
    item2 = await loadImage(item2Image);
    ctx.drawImage(item2, item2Pos.x, item2Pos.y, item2Pos.w, item2Pos.h);
  } else if (item1Image != null && item2Image != null) {
    item1 = await loadImage(item1Image);
    item2 = await loadImage(item2Image);
    ctx.drawImage(item1, item1Pos.x, item1Pos.y, item1Pos.w, item1Pos.h);
    ctx.drawImage(item2, item2Pos.x, item2Pos.y, item2Pos.w, item2Pos.h);
  }

  return canvas.toBuffer();
}

async function LoadNFTImage(url) {
  const image = await loadImage(url);
  return image;
}

async function renderFightingImage(
  player1,
  player2,
  player1Image,
  player2Image
) {
  console.log(player1Image);
  console.log(player2Image);
  const canvas = createCanvas(width, height);

  const frame = await loadImage(framePath);
  const vs = await loadImage(vsPath);
  // const player1Image = await loadImage(player1.imageUrl);
  // const player2Image = await loadImage(player2.imageUrl);

  const ctx = canvas.getContext("2d");

  ctx.drawImage(frame, 0, 0, width, height);
  ctx.drawImage(player1Image, 53, 132, 274, 274);
  ctx.drawImage(player2Image, 393, 132, 274, 274);
  ctx.drawImage(vs, 0, 0, width, height);
  renderText(`${player1.tokenId}`, ctx, 194, 453);
  renderText(`${player2.tokenId}`, ctx, 516, 453);

  return canvas.toBuffer();
}

async function renderWinnerImage(player1Image, player2Image, winnerIndex) {
  const frameDim = { w: 1920, h: 1080 };
  const canvas = createCanvas(frameDim.w, frameDim.h);
  const pic1 = { x: 460, y: 234, w: 375, h: 375 };
  const pic2 = { x: 1088, y: 234, w: 375, h: 375 };

  const frame = await loadImage(framePath1);
  const playerWin = await loadImage(playerWinnerPath);
  const enemyWin = await loadImage(enemyWinnerPath);
  // const player1Image = await loadImage(player1.imageUrl);
  // const player2Image = await loadImage(player2.imageUrl);

  const ctx = canvas.getContext("2d");

  ctx.drawImage(frame, 0, 0, frameDim.w, frameDim.h);
  ctx.drawImage(player1Image, pic1.x, pic1.y, pic1.w, pic1.h);
  ctx.drawImage(player2Image, pic2.x, pic2.y, pic2.w, pic2.h);

  switch (winnerIndex) {
    case 0:
      ctx.drawImage(playerWin, 0, 0, frameDim.w, frameDim.h);
      break;
    case 1:
      ctx.drawImage(enemyWin, 0, 0, frameDim.w, frameDim.h);
  }

  // renderText(`${player1.tokenId}`, ctx, 194, 453);
  // renderText(`${player2.tokenId}`, ctx, 516, 453);

  return canvas.toBuffer();
}

const leaderboardPosition = [
  {
    image: {
      x: 0,
      y: 0,
    },
    name: {
      x: 289,
      y: 512,
    },
    exp: {
      x: 550,
      y: 512,
    },
  },
];

async function renderLeaderBoard(input = []) {
  const frameDim = { w: 1500, h: 1500 };
  const offsetY = [445, 595, 761, 927, 1093];
  const offsetYText = [522, 672, 838, 1004, 1170];
  const nameRow1X = 270;
  const nameRow2X = 940;
  const scoreRow1X = 550;
  const scoreRow2X = 1200;
  const imageRow1X = 44;
  const imageRow2X = 761;
  const imageDimension = 134;

  const data1 = input.length > 5 ? input.slice(0, input.length) : input;
  const data2 = input.length > 5 ? input.slice(5, input.length) : [];

  const canvas = createCanvas(frameDim.w, frameDim.h);
  const frame = await loadImage(leaderboard);

  const ctx = canvas.getContext("2d");
  ctx.drawImage(frame, 0, 0, frameDim.w, frameDim.h);
  data1.forEach(async (data, index) => {
    //name
    renderText(
      `${data.name}`,
      ctx,
      nameRow1X,
      offsetYText[index],
      30,
      "#ffffff"
    );
    //score
    renderText(
      `${data.score}`,
      ctx,
      scoreRow1X,
      offsetYText[index],
      50,
      "#44e504"
    );
  });
  data2.forEach(async (data, index) => {
    //name
    renderText(
      `${data.name}`,
      ctx,
      nameRow2X,
      offsetYText[index],
      30,
      "#ffffff"
    );
    //score
    renderText(
      `${data.score}`,
      ctx,
      scoreRow2X,
      offsetYText[index],
      50,
      "#44e504"
    );
  });
  return canvas.toBuffer();
}

module.exports = {
  renderFightingImage,
  renderWinnerImage,
  renderFightingImage1,
  renderLeaderBoard,
  LoadNFTImage,
};
