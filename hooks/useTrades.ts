
import { useState, useEffect } from 'react';
import { Trade } from '@/types/Trade';
import { mockTrades } from '@/data/mockTrades';
import { stockPriceService } from '@/services/stockPriceService';

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTrades = async () => {
    console.log('Loading trades...');
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get updated prices
      const updatedTrades = await stockPriceService.updateTradesPrices(mockTrades);
      
      // Sort by confidence score and timestamp
      const sortedTrades = [...updatedTrades].sort((a, b) => {
        if (b.confidenceScore !== a.confidenceScore) {
          return b.confidenceScore - a.confidenceScore;
        }
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      
      setTrades(sortedTrades);
    } catch (error) {
      console.error('Error loading trades:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshTrades = async () => {
    console.log('Refreshing trades with latest prices...');
    setRefreshing(true);
    await loadTrades();
  };

  const toggleWatchlist = (tradeId: string) => {
    setTrades(prevTrades =>
      prevTrades.map(trade =>
        trade.id === tradeId
          ? { ...trade, isWatchlisted: !trade.isWatchlisted }
          : trade
      )
    );
  };

  useEffect(() => {
    loadTrades();
    
    // Set up periodic price updates every 30 seconds
    const interval = setInterval(() => {
      if (!refreshing) {
        refreshTrades();
      }
    }, 30000);
    
    return () => {
      clearInterval(interval);
      stockPriceService.cleanup();
    };
  }, []);

  return {
    trades,
    loading,
    refreshing,
    refreshTrades,
    toggleWatchlist
  };
};
