"use client";

import React, { useState, useEffect, useRef } from "react";
import { createChart, CrosshairMode, LineStyle } from "lightweight-charts";
import { fetchAndSetData } from "@/utils/fetchAndSetData";
import styles from "@/styles/loader.module.css";
import Lottie from "lottie-react";
import carAnimation from "@/lotties/car-animation.json";

interface KChartProps {
  selectedAsset: string[] | string;
}

const KChart: React.FC<KChartProps> = ({ selectedAsset }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDefault, setDefault] = useState(true);
  const [isUnsupported, setIsUnsupported] = useState(false);

  useEffect(() => {
    if (!selectedAsset) {
      setDefault(false);
      setIsUnsupported(false);
      return;
    }

    if (!chartContainerRef.current) return;

    setIsLoading(true);
    setIsUnsupported(false);

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.offsetWidth,
      height: 300,
      layout: {
        textColor: "rgba(0, 0, 0, 0.9)", // Dark text for contrast
      },
      grid: {
        vertLines: {
          color: "rgba(220, 220, 220, 0.5)", // Lighter grid lines
        },
        horzLines: {
          color: "rgba(220, 220, 220, 0.5)", // Lighter grid lines
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal, // Ensure CrosshairMode is imported or defined
      },
      rightPriceScale: {
        borderColor: "rgba(220, 220, 220, 0.8)", // Subtle border color
      },
      timeScale: {
        borderColor: "rgba(220, 220, 220, 0.8)", // Subtle border color
      },
    });

    chart.applyOptions({
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 4,
          color: "#C3BCDB44",
          style: LineStyle.Solid,
          labelBackgroundColor: "#9B7DFF",
        },
        horzLine: {
          color: "#9B7DFF",
          labelBackgroundColor: "#9B7DFF",
        },
      },
    });

    // const candleSeries = chart.addCandlestickSeries({
    //   upColor: 'rgba(0, 150, 136, 1)', // Bright green for up candles
    //   downColor: 'rgba(255, 82, 82, 1)', // Deep red for down candles
    //   borderDownColor: 'rgba(255, 82, 82, 1)', // Same deep red for the border of down candles
    //   borderUpColor: 'rgba(0, 150, 136, 1)', // Same bright green for the border of up candles
    //   wickDownColor: 'rgba(255, 82, 82, 1)', // Same deep red for the wick of down candles
    //   wickUpColor: 'rgba(0, 150, 136, 1)', // Same bright green for the wick of up candles
    // });

    fetchAndSetData(selectedAsset, candleStickData => {
      // Convert data for line series

      if (!selectedAsset) return;
      const lineData = candleStickData.map(datapoint => ({
        time: datapoint.time,
        value: (datapoint.close + datapoint.open) / 2,
      }));

      // Add area map series
      const areaSeries = chart.addAreaSeries({
        lastValueVisible: false,
        crosshairMarkerVisible: false,
        lineColor: "transparent",
        topColor: "rgba(56, 33, 110, 0.6)",
        bottomColor: "rgba(56, 33, 110, 0.1)",
      });

      areaSeries.setData(lineData);

      // Add Candlestick Chart Series
      const candleSeries = chart.addCandlestickSeries();
      candleSeries.setData(candleStickData);
      setIsLoading(false);
    }).catch(error => {
      console.error("Error setting data: ", error);
      setIsLoading(false);
      setIsUnsupported(true);
    });

    return () => {
      chart.remove();
    };
  }, [selectedAsset]);

  return (
    <div className="relative" ref={chartContainerRef} style={{ height: "300px" }}>
      {isLoading && (
        <div className={styles.loader} style={{ position: "absolute", top: "30%", left: "50%", zIndex: 10 }}></div>
      )}
      {isUnsupported && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
          This coin is not supported currently.
        </div>
      )}
      {!isLoading && !selectedAsset && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 10 }}>
          <Lottie animationData={carAnimation} loop={true} />
          Please select a coin to view the chart.
        </div>
      )}
    </div>
  );
};

export default KChart;
