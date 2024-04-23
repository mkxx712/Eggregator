interface AssetItem {
  asset: string;
  free: string;
  locked: string;
}

interface DexItem {
  symbol: string;
  amount: string;
  tokenPrice?: string;
}


export { type AssetItem, type DexItem }