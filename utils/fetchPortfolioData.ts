import { fetchWalletBalance } from "@/utils/fetchBinanceBalance";
import { fetchDexTokenBalances } from "@/utils/fetchDexBalance";
import { fetchCoinPriceByName } from "@/utils/fetchCmkPrice";
import { DexItem, AssetItem } from "@/Models/AssetItems";

export interface PortfolioData {
  dexportfolio: DexItem[];
  portfolio: AssetItem[];
  prices: number[];
  selectedAsset: string[];
  selectedAssetDex: string[];
  selectedTotalAsset: string[];
}

export async function fetchPortfolioData(): Promise<PortfolioData> {
  // Fetch prices for all filtered assets in parallel (DEX)
  const dexportfolio = await fetchDexTokenBalances();

  const selectedAssetDex = dexportfolio
    .filter((item: DexItem) => Number(item.amount) > 0)
    .map((item: DexItem) => item.symbol);

  // Fetch prices for all filtered assets in parallel (BinanceUS)
  const portfolio = await fetchWalletBalance();
  const pricePromises = portfolio
    .filter((item: AssetItem) => Number(item.free) + Number(item.locked) > 0)
    .map((item: AssetItem) => fetchCoinPriceByName(item.asset));
  const prices = await Promise.all(pricePromises);

  const selectedAsset = portfolio
    .filter((item: AssetItem) => Number(item.free) + Number(item.locked) > 0)
    .map((item: AssetItem) => item.asset);

  const selectedTotalAsset = selectedAsset.concat(selectedAssetDex);

  return {
    dexportfolio,
    portfolio,
    prices,
    selectedAsset,
    selectedAssetDex,
    selectedTotalAsset,
  };
}
