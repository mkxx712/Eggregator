"use client";

import React, { useEffect, useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectGroup } from "./ui/select";
import KChart from "./kchart";

const ChartSelect = () => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>(["BTC"]);
  const [selectedCoin, setSelectedCoin] = useState<string>("BTC");

  useEffect(() => {
    // Try to find the <script> tag that contains the selectedAsset data.
    const dataElement = document.getElementById("selectedAsset-data");
    if (dataElement && dataElement.textContent) {
      // Parsing JSON data and setting state
      const data = JSON.parse(dataElement.textContent);
      setSelectedAssets(data);
    }
  }, []);

  return (
    <Card className="col-span-5">
      <CardHeader>
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Portfolio Table</CardTitle>
          <Select onValueChange={setSelectedCoin}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Default - BTC" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {selectedAssets.map(asset => (
                  <SelectItem key={asset} value={asset}>
                    {asset}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p2-10">
        <div id="container" className="chart-container" style={{ width: "100%", height: "0px" }}>
          <style>{`
                        body {
                        padding: 0;
                        margin: 0;
                        background-color: #fff;
                        }
                        .lw-attribution {
                        position: relative;
                        left: 0px;
                        top: 0px;
                        z-index: 3;
                        padding: 10px 0px 0px 12px;
                        font-family: "Roboto", sans-serif;
                        font-size: 0.8em;
                        }
                        .lw-attribution a {
                        cursor: pointer;
                        color: rgb(54, 116, 217);
                        opacity: 0.8;
                        }
                        .lw-attribution a:hover {
                        color: rgb(54, 116, 217);
                        opacity: 1;
                        }
                    `}</style>
          <div className="lw-attribution">
            <a href={`https://www.tradingview.com/chart/?symbol=BINANCE%3A${selectedCoin}USDT`} target="_blank">
              Analyze in TradingView Charts™
            </a>
          </div>
        </div>
        <KChart selectedAsset={selectedCoin} />
      </CardContent>
    </Card>
  );
};

export default ChartSelect;
