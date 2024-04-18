const API_KEY = 'CG-KEMvoaUbEXqHF1gQyii3ASZH'

// list of coin ids: 'https://docs.google.com/spreadsheets/d/1wTTuxXt8n9q7C4NDXqQpI3wpKu1_5bGVmP9Xz0XGSyU/edit#gid=0'

const fetchMarketData = async (asset: string) => {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${asset}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true&precision=2`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-api-key': API_KEY,
      }
    };
  
    const response = await fetch(url, options);
  
    if (!response.ok) {
      throw new Error(`Failed to fetch market data for ${asset}`);
    }
  
    const data = await response.json();
    return data;
  };
  
  export default fetchMarketData;