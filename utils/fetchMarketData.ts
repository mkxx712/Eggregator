const API_KEY = "48A352FC-DB15-4906-B32F-76F4BF0C2869";

// fetchMarketData.ts
const fetchMarketData = async (asset: string) => {
  const response = await fetch(`https://rest.coinapi.io/v1/exchangerate/${asset}/USD`, {
    headers: { "X-CoinAPI-Key": API_KEY },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch market data for ${asset}`);
  }

  const data = await response.json();
  return data;
};

export default fetchMarketData;
