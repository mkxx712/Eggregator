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
                        per_page: 9,
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
        setSearchTerm(e.target.value.toLowerCase());
    };

    const filteredCryptoData = cryptoData.filter(coin =>
        coin.id.toLowerCase().includes(searchTerm) ||
        coin.symbol.toLowerCase().includes(searchTerm)
    );

    return (
        <div className={styles.container}>
            {/* Search Bar */}
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

            {/* Currency Selector */}
            {/* <div className={styles.currencySelector}>
                <button onClick={() => setCurrency("usd")} className={styles.button}>USD</button>   
                <button onClick={() => setCurrency("inr")}>INR</button>
            </div> */}

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
                        {filteredCryptoData.slice((page - 1) * 20, page * 20).map((coin,index) => (
                            <tr key={coin.id} className={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                            <td className={styles.coinNameCell}>
                                <Link href={`/${coin.id}`}>
                                    {/* <img src={coin.image} alt={coin.id} className={styles.coinImage} /> */}
                                    <span style={{ cursor: 'pointer' }}>
                                        <img src={coin.image} alt={coin.id} className={styles.coinImage} />
                                    </span>
                                </Link>
                            </td>
                            <td>{coin.id}</td>
                            <td>{currency === "usd" ? "$" : <BiRupee />} {coin.current_price.toLocaleString()}</td>
                            <td style={{color: coin.price_change_percentage_24h > 0 ? 'green' : 'red'}}>
                            {coin.price_change_percentage_24h.toFixed(2)}%
                            </td>
                            {/* <td>{currency === "usd" ? "$" : <BiRupee />} {coin.market_cap.toLocaleString()}</td>
                            <td>{currency === "usd" ? "$" : <BiRupee />} {coin.total_volume.toLocaleString()}</td> */}
                        </tr>
                        ))}
                  </tbody>
                </table>
            </div>
              )}

            {/* Pagination */}
            {/* <div className={styles.card}> */}
            <div className={styles.pagination}>
                {[1, 2, 3, 4].map((item) => (
                    <button
                        key={item}
                        onClick={() => {
                            setPage(item);
                            setActive(item);
                        }}
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