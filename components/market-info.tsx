"use client"

import React, { useEffect, useState } from 'react';
import fetchMarketData from '../utils/fetchMarketData';
import KChart from './kchart';

interface MarketData {
  name: string;
  price: number;
  volume: number;
  coinPercent: number;
  mktCap: number;
}

const MarketInfo: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [assets, setAssets] = useState(['bitcoin','ethereum']); // Initial assets
  const [inputValue, setInputValue] = useState(''); 

  useEffect(() => {
    const fetchData = async () => {
      const promises = assets.map(asset => fetchMarketData(asset));
      try {
        const responses = await Promise.all(promises);
        console.log(responses);
        const data = responses.map((response, index) => ({
          name: assets[index],
          price: response[assets[index]].usd,
          volume: response[assets[index]].usd_24h_vol,
          coinPercent: response[assets[index]].usd_24h_change,
          mktCap: response[assets[index]].usd_market_cap,
        }));
        setMarketData(data);
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      }
    };// Fetch data immediately and then every 5 minutes
    fetchData();
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [assets]); // Re-run effect when assets change

  const handleAddAsset = (asset: string) => {

    if (assets.length >= 7) {
      console.error('Maximum number of assets reached');
      return;
    }
    
    const upperCaseAsset = asset.toUpperCase();
    const isValid = /^[A-Z0-9]+$/.test(upperCaseAsset);
  
    if (isValid) {
      setAssets(prevAssets => {
        if (!prevAssets.includes(upperCaseAsset)) {
          return [...prevAssets, upperCaseAsset];
        } else {
          console.error('Asset already exists:', upperCaseAsset);
          return prevAssets;
        }
      });
    } else {
      console.error('Invalid asset name:', asset);
    }
  };

  const handleRemoveAsset = (asset: string) => {
    setAssets(prevAssets => prevAssets.filter(a => a !== asset));
  };

  return (
    <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f8f8f8', padding: '20px', borderRadius: '10px' }}>
        <input type="text" placeholder="Add asset" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAddAsset(inputValue);
            setInputValue('');
          }
        }} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <button style={{ backgroundColor: '#007BFF', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => handleAddAsset(inputValue)}>Add</button>
      </div>
      {marketData.map((data) => (
        <div key={data.name} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
          <h4 style={{ marginBottom: '10px' }}>{data.name.toUpperCase()}</h4>
          <p style={{ color: 'green', fontWeight: 'bold' }}>Price: {data.price.toFixed(2)} USD</p>
          <p>Volume: {data.volume.toFixed(2)}</p>
          <p>24h Change: {data.coinPercent.toFixed(2)}%</p>
          <p>Market Cap: {data.mktCap.toFixed(2)}</p>
          <button style={{ backgroundColor: '#f0f0f0', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => handleRemoveAsset(data.name)}>Remove</button>
        </div>
      ))}
    </div>
  );
};
export default MarketInfo;