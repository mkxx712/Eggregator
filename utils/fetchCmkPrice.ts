// Function to fetch the price of a cryptocurrency using CoinMarketCap API
const apiKey = String(process.env.COINMARKETCAP_API);

async function fetchCoinIdByName(coinName: string): Promise<string | null> {
  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map`;
  const headers = {
    'X-CMC_PRO_API_KEY': apiKey,
    'Accept': 'application/json'
  };

  try {
    const response = await fetch(url, { method: 'GET', headers: headers});
    const data = await response.json();
    const coin = data.data.find((c: any) =>
      c.name.toLowerCase() == coinName.toLowerCase() ||
      c.symbol.toLowerCase() == coinName.toLowerCase());
    return coin ? coin.id.toString() : null;
  } catch (error) {
    console.error('Error fetching coin ID by name or symbol:', error);
    return null;
  }
}

// Function to fetch the price of a cryptocurrency using its ID
export async function fetchCoinPriceByName(coinName: string): Promise<any> {
  const coinId = await fetchCoinIdByName(coinName);
  if (!coinId) {
    console.error('Coin not found');
    return;
  }

  const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${coinId}`;
  const headers = {
    'X-CMC_PRO_API_KEY': apiKey,
    'Accept': 'application/json'
  };

  try {
    const response = await fetch(url, { method: 'GET', headers: headers});
    const data = await response.json();
    return data.data?.[coinId]?.quote?.USD?.price;
  } catch (error) {
    console.error('Error fetching coin price:', error);
    throw error; // Rethrow the error for handling by the caller
  }
}
