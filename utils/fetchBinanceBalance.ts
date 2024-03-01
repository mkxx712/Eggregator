"use server";
import axios from 'axios';
import * as CryptoJS from 'crypto-js';

const API_KEY = process.env.BINANCE_API;
const SECRET_KEY = process.env.BINANCE_API_SECRET;

export async function fetchWalletBalance() {
    const baseUrl = 'https://api.binance.com';
    const endPoint = '/api/v3/account';
    const dataQueryString = 'recvWindow=20000&timestamp=' + Date.now();
    const signature = CryptoJS.HmacSHA256(dataQueryString, SECRET_KEY!).toString(CryptoJS.enc.Hex);

    const url = baseUrl + endPoint + '?' + dataQueryString + '&signature=' + signature;

    try {
        const response = await axios.get(url, {
            headers: {
                'X-MBX-APIKEY': API_KEY
            }
        });

        // console.log(response.data.balances); // Logs the balances array
        return response.data.balances;
    } catch (error) {
        console.error('Error fetching wallet balance:', error);
    }
}2
