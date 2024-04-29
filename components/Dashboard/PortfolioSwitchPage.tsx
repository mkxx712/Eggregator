"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PortfolioData } from "@utils/fetchPortfolioData";
import EXSwitcher from "../switcher";
import { Portfolio } from "@/components/portfolio";
import ChartSelect from "@/components/chart-selected";
import MarketInfo from "@/components/market-info";

interface PortfolioDataProps {
  data: PortfolioData;
}

const PortfolioSwitchPage: React.FC<PortfolioDataProps> = ({ data }: PortfolioDataProps) => {
  const [selectedExchange, setSelectedExchange] = useState("Total");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  useEffect(() => {
    setSelectedAssets(
      selectedExchange === "Total"
        ? data.selectedTotalAsset
        : selectedExchange === "Binance"
        ? data.selectedAsset
        : data.selectedAssetDex,
    );
  }, [selectedExchange, data]);

  return (
    <TabsContent value="real-time" className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* {selectedExchange === "Total" ? (
          <script id="selectedAsset-data" type="application/json">
            {JSON.stringify(data.selectedTotalAsset)}
          </script>
        ) : selectedExchange === "Binance" ? (
          <script id="selectedAsset-data" type="application/json">
            {JSON.stringify(data.selectedAsset)}
          </script>
        ) : (
          <script id="selectedAsset-data" type="application/json">
            {JSON.stringify(data.selectedAssetDex)}
          </script>
        )} */}
        <ChartSelect selectedAssets={selectedAssets} />
        <Card className="col-span-2">
          <Card className="col-span-2">
            <MarketInfo />
          </Card>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <div className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Current Portfolio</CardTitle>
              <EXSwitcher selectedExchange={selectedExchange} onExchangeChange={setSelectedExchange} />
            </div>
          </CardHeader>
          <CardContent>
            <div>
              {selectedExchange === "Total" ? (
                <Portfolio portfolio={data.portfolio} dexportfolio={data.dexportfolio} prices={data.prices} />
              ) : selectedExchange === "Binance" ? (
                <Portfolio portfolio={data.portfolio} prices={data.prices} />
              ) : (
                <Portfolio dexportfolio={data.dexportfolio} prices={data.prices} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </TabsContent>
  );
};

export default PortfolioSwitchPage;
