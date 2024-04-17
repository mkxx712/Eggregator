import dotenv from "dotenv";
import { SpamDetection } from "./SpamDetection";

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

interface TokenDetails {
  symbol: string;
  usdPrice: number;
}

const address: string = "0x4648451b5f87ff8f0f7d622bd40574bb97e25980";

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

export async function fetchDexTokenBalances() {
  const validTokensDetails: TokenDetails[] = await SpamDetection();
  const priceMap = new Map(validTokensDetails.map(token => [token.symbol, token.usdPrice]));
  const res = await fetch(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API}`, options);
  const response = await res.json();

  const balances: { tokenBalances: TokenBalance[] } = response.result;

  // Remove tokens with zero balance
  const nonZeroBalances: TokenBalance[] = balances.tokenBalances.filter(
    (token: TokenBalance) => token.tokenBalance !== "0",
  );

  let tokenBalances: { symbol: string; amount: string; tokenPrice?: string }[] = [];
  for (let token of nonZeroBalances) {
    let balance: any = token.tokenBalance;

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

    if (priceMap.has(metadata.result.symbol)) {
      const amount = (Number(token.tokenBalance) / 10 ** metadata.result.decimals).toFixed(2);
      const usdPrice = priceMap.get(metadata.result.symbol)?.toString();
      tokenBalances.push({ symbol: metadata.result.symbol, amount: amount, tokenPrice: usdPrice });
    }
  }
  return tokenBalances;
}
