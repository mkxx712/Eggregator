"use client"

import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
import { fetchAndSetData } from '@/utils/fetchAndSetData';

interface KChartProps {
  selectedAsset: string[] | string;
}

const KChart: React.FC<KChartProps> = ({ selectedAsset }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.offsetWidth,
      height: 300,
      layout: {
        textColor: 'rgba(0, 0, 0, 0.9)', // Dark text for contrast
      },
      grid: {
        vertLines: {
          color: 'rgba(220, 220, 220, 0.5)', // Lighter grid lines
        },
        horzLines: {
          color: 'rgba(220, 220, 220, 0.5)', // Lighter grid lines
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal, // Ensure CrosshairMode is imported or defined
      },
      rightPriceScale: {
        borderColor: 'rgba(220, 220, 220, 0.8)', // Subtle border color
      },
      timeScale: {
        borderColor: 'rgba(220, 220, 220, 0.8)', // Subtle border color
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: 'rgba(0, 150, 136, 1)', // Bright green for up candles
      downColor: 'rgba(255, 82, 82, 1)', // Deep red for down candles
      borderDownColor: 'rgba(255, 82, 82, 1)', // Same deep red for the border of down candles
      borderUpColor: 'rgba(0, 150, 136, 1)', // Same bright green for the border of up candles
      wickDownColor: 'rgba(255, 82, 82, 1)', // Same deep red for the wick of down candles
      wickUpColor: 'rgba(0, 150, 136, 1)', // Same bright green for the wick of up candles
    });    
    
    
    fetchAndSetData(selectedAsset, (data) => {
      candleSeries.setData(data);
    }).catch((error) => console.error("Error setting data: ", error));

    return () => chart.remove();
  }, [selectedAsset]);

  return <div ref={chartContainerRef} />;
};

export default KChart;
