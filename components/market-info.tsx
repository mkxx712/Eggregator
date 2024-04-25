"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { BiRupee } from "react-icons/bi";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import { HiOutlineArrowsUpDown } from "react-icons/hi2";
import Link from 'next/link';
import styles from '../styles/MarketInfo.module.css';

const ITEMS_PER_PAGE = 9;

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
        for (let i = Math.max(1, current - 2); i <= Math.min(current + 2, total); i++) {
          range.push(i);
        }
        return range;
      };

    const displayRange = paginationRange(page, pageCount);

    return (
        <div className={styles.container}>
            {/* Search Bar */}
            <div className={styles.header}>
            <h1 className={styles.title}>Market Place</h1>
            <div className={styles.card}>
                <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                    className={styles.searchInput}
                />
                <FaSearch className={styles.searchIcon}/>
                </div>
            </div>
            </div>

            {/* Crypto Table */}
            {filteredCryptoData.length === 0 ? (
                <div className={styles.noResults}>No Results Found</div>
            ) : (
                <div className={styles.card}>
                <table className={styles.table}>
                    {/* Table Head */}
                    <thead>
                        <tr>
                            <th>Coin</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>24h %</th>
                            {/* <th>Market Cap</th>
                            <th>Volume</th> */}
                            {/* ... other headers */}
                        </tr>
                    </thead>
                    {/* Table Body */}
                    <tbody>
                    {currentItems.map((coin, index) => (
                        <tr key={coin.id} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                        <td className={styles.coinCell}>
                            {/* Make sure to only render the coin symbol here if that's what you want */}
                            <img src={coin.image} alt={coin.symbol} className={styles.coinImage} />
                        </td>
                        <td>
                            {/* Render the full name of the coin here */}
                            {coin.symbol}
                        </td>
                        <td>
                            {/* Render the current price here */}
                            {currency === "usd" ? "$" : <BiRupee />} {coin.current_price.toLocaleString()}
                        </td>
                        <td style={{ color: coin.price_change_percentage_24h > 0 ? 'green' : 'red' }}>
                            {/* Render the 24-hour price change here */}
                            {coin.price_change_percentage_24h.toFixed(2)}%
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
              )}

            {/* Pagination */}
            {/* <div className={styles.card}> */}
            <div className={styles.pagination}>
                {displayRange.map((item) => (
                <button
                    key={item}
                    onClick={() => handlePageClick(item)}
                    className={`${styles.pageButton} ${active === item ? styles.active : ''}`}
                >
                    {item}
                </button>
                ))}
            </div>
            {/* </div> */}
        </div>
    );
};

export default MarketInfo;