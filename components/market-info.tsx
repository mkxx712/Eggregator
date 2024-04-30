"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { BiRupee } from "react-icons/bi";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
// import { CardHeader } from '@nextui-org/react';

const ITEMS_PER_PAGE = 6;

type TopCoinObj = {
  coinName: string;
  image: string;
  percentChange: number;
  current_price: number;
  id: string;
  symbol: string;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
};

const MarketInfo = () => {
  const [cryptoData, setCryptoData] = useState<TopCoinObj[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(1);
  const [active, setActive] = useState<number>(1);
  const [currency, setCurrency] = useState("usd");
  // Fetching data
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
          params: {
            vs_currency: currency,
            order: "market_cap_desc",
            per_page: 80,
            page: 1,
            sparkline: false,
          },
        });
        setCryptoData(response.data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };

    fetchCoins();
  }, [currency]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value.toUpperCase();
    setSearchTerm(newSearchTerm);

    // Only update the page if the search term has actually changed and we are not already on the first page.
    if (newSearchTerm !== searchTerm && page !== 1) {
      setPage(1);
      setActive(1);
    }
  };

  const handlePageClick = (newPage: number) => {
    // Prevent unnecessary state updates
    if (page !== newPage) {
      setPage(newPage);
      setActive(newPage);
    }
  };

  const filteredCryptoData = cryptoData.filter(
    coin => coin.id.toUpperCase().includes(searchTerm) || coin.symbol.toUpperCase().includes(searchTerm),
  );

  const pageCount = Math.ceil(filteredCryptoData.length / ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);
  const currentItems = filteredCryptoData.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const paginationRange = (current: number, total: number): number[] => {
    const range: number[] = [];
    for (let i = Math.max(1, current - 1); i <= Math.min(current + 1, total); i++) {
      range.push(i);
    }
    return range;
  };

  const displayRange = paginationRange(page, pageCount);

  return (
    <div>
      {/* <Card> */}
      <CardHeader>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
          <CardTitle className="mr-4">Market</CardTitle>
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
            // You might need to adjust the class or styling
          />
          {/* <FaSearch /> */}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Coin</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>24h %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((coin, index) => (
              <TableRow key={coin.id}>
                <TableCell>
                  <img
                    src={coin.image}
                    alt={coin.symbol}
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                    }}
                  />
                </TableCell>
                <TableCell>{coin.symbol.toUpperCase()}</TableCell>
                <TableCell>
                  {currency === "usd" ? "$" : <BiRupee />} {coin.current_price.toLocaleString()}
                </TableCell>
                <TableCell style={{ color: coin.price_change_percentage_24h > 0 ? "green" : "red" }}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <Pagination className="cursor-pointer" style={{ paddingBottom: "8px" }}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageClick(Math.max(page - 1, 1))}
              // disabled={page === 1}
            />
          </PaginationItem>
          {displayRange.map(item => (
            <PaginationItem key={item}>
              <PaginationLink onClick={() => handlePageClick(item)} isActive={item === page}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageClick(Math.min(page + 1, pageCount))}
              // disabled={page === pageCount}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {/* </Card> */}
    </div>
  );
};

export default MarketInfo;
=======
import Link from 'next/link';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
  } from "@/components/ui/pagination";
// import { CardHeader } from '@nextui-org/react';

const ITEMS_PER_PAGE = 6;

type TopCoinObj = {
    coinName: string,
    image: string,
    percentChange: number,
    current_price: number,
    id: string,
    symbol: string,
    price_change_percentage_24h: number,
    market_cap: number,
    total_volume: number
}

const MarketInfo = () => {
    const [cryptoData, setCryptoData] = useState<TopCoinObj[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState<number>(1);
    const [active, setActive] = useState<number>(1);
    const [currency, setCurrency] = useState("usd");
    // Fetching data
    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
                    params: {
                        vs_currency: currency,
                        order: 'market_cap_desc',
                        per_page: 80,
                        page: 1,
                        sparkline: false
                    }
                });
                setCryptoData(response.data);
            } catch (error) {
                console.error('Error fetching coins:', error);
            }
        };
        
        fetchCoins();
    }, [currency]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value.toLowerCase();
        setSearchTerm(newSearchTerm);
    
        // Only update the page if the search term has actually changed and we are not already on the first page.
        if (newSearchTerm !== searchTerm && page !== 1) {
            setPage(1);
            setActive(1);
        }
    };

    const handlePageClick = (newPage:number) => {
        // Prevent unnecessary state updates
        if (page !== newPage) {
            setPage(newPage);
            setActive(newPage);
        }
    };

    const filteredCryptoData = cryptoData.filter(coin =>
        coin.id.toLowerCase().includes(searchTerm) ||
        coin.symbol.toLowerCase().includes(searchTerm)
    );

    const pageCount = Math.ceil(filteredCryptoData.length / ITEMS_PER_PAGE);
    const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);
    const currentItems = filteredCryptoData.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      );

      const paginationRange = (current: number, total: number): number[] => {
        const range: number[] = [];
        for (let i = Math.max(1, current - 1); i <= Math.min(current + 1, total); i++) {
          range.push(i);
        }
        return range;
      };

    const displayRange = paginationRange(page, pageCount);

    return (
        <div>
            {/* <Card> */}
                <CardHeader>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px' }}>
                    <CardTitle className="mr-4">Market</CardTitle>
                        <Input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={handleSearch}
                            // You might need to adjust the class or styling
                        />
                        {/* <FaSearch /> */}
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Coin</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>24h %</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.map((coin, index) => (
                                <TableRow key={coin.id}>
                                    <TableCell>
                                    <img src={coin.image} 
                                        alt={coin.symbol} 
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%'
                                        }} />
                                    </TableCell>
                                    <TableCell>{coin.symbol.toUpperCase()}</TableCell>
                                    <TableCell>{currency === "usd" ? "$" : <BiRupee />} {coin.current_price.toLocaleString()}</TableCell>
                                    <TableCell style={{ color: coin.price_change_percentage_24h > 0 ? 'green' : 'red' }}>
                                        {coin.price_change_percentage_24h.toFixed(2)}%
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <Pagination style={{paddingBottom: '8px' }}>
                    <PaginationContent>
                        <PaginationItem>
                        <PaginationPrevious
                            onClick={() => handlePageClick(Math.max(page - 1, 1))}
                            // disabled={page === 1}
                        />
                        </PaginationItem>
                        {displayRange.map((item) => (
                        <PaginationItem key={item}>
                            <PaginationLink
                            onClick={() => handlePageClick(item)}
                            isActive={item === page}
                            >
                            {item}
                            </PaginationLink>
                        </PaginationItem>
                        ))}
                        <PaginationItem>
                        <PaginationNext
                            onClick={() => handlePageClick(Math.min(page + 1, pageCount))}
                            // disabled={page === pageCount}
                        />
                        </PaginationItem>
                    </PaginationContent>
                    </Pagination>
            {/* </Card> */}
        </div>
    );
};

export default MarketInfo;
