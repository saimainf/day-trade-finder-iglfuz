
import { useState, useEffect } from 'react';
import { Trade } from '@/types/Trade';
import { realStockDataService } from '@/services/realStockDataService';

export const useTrades = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTrades = async () => {
    console.log('Loading trades with real data...');
    try {
      setError(null);
      
      // Generate trading recommendations based on real market data
      const realTrades = await realStockDataService.generateTradingRecommendations();
      
      console.log(`Loaded ${realTrades.length} trading recommendations`);
      setTrades(realTrades);
    } catch (error) {
      console.error('Error loading trades:', error);
      setError('Failed to load trading data. Please check your internet connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshTrades = async () => {
    console.log('Refreshing trades with latest market data...');
    setRefreshing(true);
    
    // Clear cache to force fresh data
    realStockDataService.clearCache();
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

  const updatePricesInBackground = async () => {
    if (trades.length === 0) return;
    
    try {
      console.log('Updating prices in background...');
      const symbols = trades.map(trade => trade.symbol);
      const quotes = await realStockDataService.getMultipleQuotes(symbols);
      
      setTrades(prevTrades =>
        prevTrades.map(trade => {
          const quote = quotes[trade.symbol];
          if (quote) {
            const newPotentialProfit = trade.targetSellPrice - quote.price;
            const newPotentialProfitPercent = (newPotentialProfit / quote.price) * 100;
            
            return {
              ...trade,
              currentPrice: quote.price,
              potentialProfit: newPotentialProfit,
              potentialProfitPercent: newPotentialProfitPercent
            };
          }
          return trade;
        })
      );
    } catch (error) {
      console.error('Error updating prices:', error);
    }
  };

  useEffect(() => {
    loadTrades();
    
    // Set up periodic price updates every 2 minutes (to respect API limits)
    const interval = setInterval(() => {
      if (!refreshing && !loading) {
        updatePricesInBackground();
      }
    }, 120000); // 2 minutes
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    trades,
    loading,
    refreshing,
    error,
    refreshTrades,
    toggleWatchlist
  };
};
