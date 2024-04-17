// import React, { useEffect, useState, useRef } from 'react';

import { Metadata } from "next";
import Image from "next/image";

import { CalendarIcon, CookieIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { News } from "@/components/news";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/overview";
import { RecentSales } from "@/components/recent-transactions";
import EXSwitcher from "@/components/switcher";
import { UserNav } from "@/components/user-nav";
import { Gas } from "@/components/gas";
import Kchart from "@/components/kchart";
import { Portfolio } from "@/components/portfolio";
import Fng from "@/components/fng";

import { fetchWalletBalance } from "@/utils/fetchBinanceBalance";
import { fetchDexTokenBalances } from "@/utils/fetchDexBalance";
import { fetchCoinPriceByName } from "@/utils/fetchCmkPrice";
import { Asset } from "next/font/google";
import { fetchAndSetData } from "@/utils/fetchAndSetData";
import { createChart } from "lightweight-charts";
import ChartSelect from "@/components/chart-selected";
import { ToastContainer } from "react-toastify";
import MarketInfo from "@/components/market-info";
import { SpamDetection } from "@/utils/SpamDetection";
import { AssetItem, DexItem } from "@/Models/AssetItems";

export const metadata: Metadata = {
  title: "Eggregator",
  description: "See your crypto in one place.",
};

export default async function DashboardPage() {
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

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="https://i.imgur.com/vtjp3tz.png" alt="Logo" className="h-8 w-8" />
              <h2 className="text-3xl font-bold tracking-normal">Eggregator</h2>
            </div>
            <div className="flex items-center space-x-2">
              <EXSwitcher />
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="real-time">Real-Time</TabsTrigger>
              <TabsTrigger value="market-info">Market-Place</TabsTrigger>
              <TabsTrigger value="readme">README</TabsTrigger>
            </TabsList>
            <ToastContainer />
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a2 2 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,231.89</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue(24h)</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+2350</div>
                    <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ethereum Gas</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5z" />
                      <path d="M1 2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1 2 2v.5a.5.5 0 0 0 1 0V8h-.5a.5.5 0 0 1-.5-.5V4.375a.5.5 0 0 1 .5-.5h1.495c-.011-.476-.053-.894-.201-1.222a.97.97 0 0 0-.394-.458c-.184-.11-.464-.195-.9-.195a.5.5 0 0 1 0-1q.846-.002 1.412.336c.383.228.634.551.794.907.295.655.294 1.465.294 2.081v3.175a.5.5 0 0 1-.5.501H15v4.5a1.5 1.5 0 0 1-3 0V12a1 1 0 0 0-1-1v4h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1zm9 0a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v13h8z" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <Gas />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fear & Greed Index</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708m-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708M10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <Fng />
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RecentSales />
                  </CardContent>
                </Card>
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Latest News</CardTitle>
                    {/* <CardDescription>
                      Supported by CryptoPanic.
                    </CardDescription> */}
                  </CardHeader>
                  <CardContent>
                    <News />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="real-time" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <script id="selectedAsset-data" type="application/json">
                  {/* {JSON.stringify(selectedAsset)} */}
                  {JSON.stringify(selectedAssetDex)}
                </script>
                <ChartSelect />
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Related News</CardTitle>
                    {/* <CardDescription>
                      Supported by CryptoPanic.
                    </CardDescription> */}
                  </CardHeader>
                  <CardContent>
                    <News />
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-7">
                  <CardHeader>
                    <CardTitle>Current Portfolio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Portfolio
                      portfolio={portfolio}
                      dexportfolio={dexportfolio}
                      prices={prices} // Assuming `prices` is an array of prices for `portfolio`
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="market-info" className="space-y-4">
              <CardHeader>
                <CardTitle>Market Info</CardTitle>
                <p style={{ fontSize: "0.8em", color: "#888" }}>Updates every 5 minutes</p>
              </CardHeader>
              <CardContent>{/* <MarketInfo /> */}</CardContent>
            </TabsContent>

            <TabsContent value="readme" className="space-y-4">
              <div className="md:grid-cols-2 lg:grid-cols-7">
                <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">README</h3>

                <p className="ml-4 leading-7 [&:not(:first-child)]:mt-6">
                  Update your .env file(.env.example provided), and then see your crypto all in one place!
                </p>

                <h4 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">Contributors:</h4>

                <p className="leading-7 [&:not(:first-child)]:mt-6">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link">@mkxx712</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <Avatar>
                          <AvatarImage src="https://avatars.githubusercontent.com/u/122747873?s=64&v=4" />
                          <AvatarFallback>CM</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">@mkxx712</h4>
                          <p className="text-sm">FinTech@Duke. Busy coding because knowing nothing.</p>
                          <div className="flex items-center pt-2">
                            <CookieIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">mkxx712@gmail.com</span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link">@ZengZi</Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <Avatar>
                          <AvatarImage src="https://avatars.githubusercontent.com/u/75213287?s=64&v=4" />
                          <AvatarFallback>ZZ</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold">@ZengZi</h4>
                          <p className="text-sm">FinTech@Duke. </p>
                          <div className="flex items-center pt-2">
                            <CookieIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                            <span className="text-xs text-muted-foreground">smilewilson1999@gmail.com</span>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </p>

                <h4 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">Special Thanks:</h4>

                <p className="ml-4 text-sm leading-7 [&:not(:first-child)]:mt-6">@Yulonghe97, @Mike, @ETHDenver</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
