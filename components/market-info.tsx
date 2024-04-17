"use client";

import React, { useEffect, useState } from "react";
import fetchMarketData from "../utils/fetchMarketData";
import KChart from "./kchart";

interface MarketData {
  asset_id: string;
  rate: number;
}

const MarketInfo: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [assets, setAssets] = useState(["BTC", "ETH", "XRP", "DOGE"]); // Initial assets
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const promises = assets.map(asset => fetchMarketData(asset));
      try {
        const responses = await Promise.all(promises);
        const data = responses.map((response, index) => ({
          asset_id: assets[index],
          rate: response.rate,
        }));
        setMarketData(data);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
      }
    }; // Fetch data immediately and then every 5 minutes
    fetchData();
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up the interval on unmount
    return () => clearInterval(intervalId);
  }, [assets]); // Re-run effect when assets change

  const handleAddAsset = (asset: string) => {
    if (assets.length >= 7) {
      console.error("Maximum number of assets reached");
      return;
    }

    const upperCaseAsset = asset.toUpperCase();
    const isValid = /^[A-Z0-9]+$/.test(upperCaseAsset);

    if (isValid) {
      setAssets(prevAssets => {
        if (!prevAssets.includes(upperCaseAsset)) {
          return [...prevAssets, upperCaseAsset];
        } else {
          console.error("Asset already exists:", upperCaseAsset);
          return prevAssets;
        }
      });
    } else {
      console.error("Invalid asset name:", asset);
    }
  };

  const handleRemoveAsset = (asset: string) => {
    setAssets(prevAssets => prevAssets.filter(a => a !== asset));
  };

  return (
    <div style={{ display: "grid", gap: "20px", gridTemplateColumns: "repeat(4, 1fr)" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundColor: "#f8f8f8",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Add asset"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              handleAddAsset(inputValue);
              setInputValue("");
            }
          }}
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          style={{
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => handleAddAsset(inputValue)}
        >
          Add
        </button>
      </div>
      {marketData.map(data => (
        <div key={data.asset_id} style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "5px" }}>
          <h4 style={{ marginBottom: "10px" }}>{data.asset_id}</h4>
          <p style={{ color: "green", fontWeight: "bold" }}>Price: {data.rate.toFixed(2)} USD</p>
          <button
            style={{
              backgroundColor: "#f0f0f0",
              border: "none",
              padding: "10px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => handleRemoveAsset(data.asset_id)}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};
export default MarketInfo;
