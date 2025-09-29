
import { useState, useEffect } from 'react';
import { Trade } from '@/types/Trade';
import { mockTrades } from '@/data/mockTrades';

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTrades = async () => {
    console.log('Loading trades...');
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sort by confidence score and timestamp
      const sortedTrades = [...mockTrades].sort((a, b) => {
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
  }, []);

  return {
    trades,
    loading,
    refreshing,
    refreshTrades,
    toggleWatchlist
  };
};
