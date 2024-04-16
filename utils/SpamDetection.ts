import Moralis from "moralis";
import { EvmChain, EvmTokenPriceItemInput } from "@moralisweb3/common-evm-utils";


interface TokenMetadata {
    token_address: string;
    symbol: string;
    name: string;
    decimals: number;
    balance: string;
    possible_spam: boolean;
    verified_contract?: boolean;
    total_supply?: string;
    total_supply_formatted?: string;
    percentage_relative_to_total_supply?: number | null;
}

interface TokenDetails {
    symbol: string;
    usdPrice: number;
}

export const SpamDetection = async () => {

    if (!Moralis.Core.isStarted) {
        await Moralis.start({
            apiKey: process.env.MORALIS_API,
        });
    }

    const address = "0x4648451b5f87ff8f0f7d622bd40574bb97e25980";

    const chain = EvmChain.ETHEREUM;

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain,
    });

    const tokens: TokenMetadata[] = response.toJSON();
    const filteredTokens = tokens.filter(token => !token.possible_spam && token.verified_contract);
    const filteredTokenAddresses: EvmTokenPriceItemInput[] = filteredTokens.map(token => ({ tokenAddress: token.token_address }));

    const tokenPricesResponse = await Moralis.EvmApi.token.getMultipleTokenPrices({
        "chain": "0x1",
        "include": "percent_change"
      },{
        "tokens": filteredTokenAddresses
      });
    const tokensWithPrices: TokenDetails[] = tokenPricesResponse.toJSON().map(token => ({
        symbol: token.tokenSymbol as string,
        usdPrice: token.usdPrice,
    }));

  return tokensWithPrices;
};