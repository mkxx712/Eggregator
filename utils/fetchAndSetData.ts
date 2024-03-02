// utils/fetchAndSetData.ts
import axios from 'axios';
import { Time } from 'lightweight-charts';

interface KlineData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

export async function fetchAndSetData(assets: string[] | string, setData: (data: KlineData[], asset: string) => void): Promise<void> {
  for (const asset of assets) {
    try {
      const response = await axios.get(`https://api.binance.us/api/v3/klines`, {
        headers: {
          'Accept-Language': 'en',
        },
        params: {
          symbol: `${asset}USDT`,
          interval: '4h',
          limit: 1000,
        },
      });
      const data = response.data.map((d: any) => ({
        time: Math.floor(d[0] / 1000),
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
      }));

      setData(data, asset);
    } catch (error) {
      console.error("Error fetching data for asset: ", asset, error);
    }
  }
}
