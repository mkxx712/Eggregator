import dotenv from 'dotenv';

dotenv.config();

interface TokenBalance {
  contractAddress: string;
  tokenBalance: string;
}

interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
}

const address: string = "0xb9BC82DE634D0D0cC439e2f27ADB90B97c4Cb0d5";

const options = {
  method: "POST" as const,
  headers: { accept: "application/json", "content-type": "application/json" },
  body: JSON.stringify({
    id: 1,
    jsonrpc: "2.0",
    method: "alchemy_getTokenBalances",
    params: [address],
  }),
};

export async function fetchDeXTokenBalances(){
  const res = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API}`, options);
  const response = await res.json();

  const balances: { tokenBalances: TokenBalance[] } = response.result;

  // Remove tokens with zero balance
  const nonZeroBalances: TokenBalance[] = balances.tokenBalances.filter((token: TokenBalance) => token.tokenBalance !== "0");

  let tokenBalances: { symbol: string; balance: string }[] = [];
  for (let token of nonZeroBalances) {
    let balance: string = token.tokenBalance;

    const options = {
      method: "POST" as const,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "alchemy_getTokenMetadata",
        params: [token.contractAddress],
      }),
    };

    let res2 = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API}`, options);
    let metadata: { result: TokenMetadata } = await res2.json();

    balance = (parseInt(balance, 10) / Math.pow(10, metadata.result.decimals)).toFixed(2);
    tokenBalances.push({ symbol: metadata.result.symbol, balance }); 
  }
  return tokenBalances;
}
