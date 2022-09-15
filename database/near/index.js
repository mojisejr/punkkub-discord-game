const { providers } = require("near-api-js");

const zillaFrens = "sp.zillafren.near";

function getInstance() {
  const nearState = new providers.JsonRpcProvider({
    url: "https://rpc.mainnet.near.org",
  });
  return nearState;
}

async function viewFunction(method_name, args_base64 = "") {
  const nearState = getInstance();
  const state = await nearState.query({
    request_type: "call_function",
    account_id: zillaFrens,
    method_name,
    args_base64,
    finality: "optimistic",
  });

  return state;
}

async function nftTokensForOwner(wallet) {
  const data = {
    account_id: wallet,
  };
  const walletBuff = Buffer.from(JSON.stringify(data), "utf-8");
  const walletBase64 = walletBuff.toString("base64");
  const tokens = await viewFunction("nft_tokens_for_owner", walletBase64);
  const response = JSON.parse(Buffer.from(tokens.result).toString());
  return response;
}

async function nftTokens() {
  const data = {
    from_index: "0",
    limit: 200,
  };
  const buff = Buffer.from(JSON.stringify(data), "utf-8");
  const buffBase64 = buff.toString("base64");
  const tokens = await viewFunction("nft_tokens", buffBase64);
  const response = JSON.parse(Buffer.from(tokens.result).toString());
  return response;
}

module.exports = {
  nftTokensForOwner,
  nftTokens,
};
