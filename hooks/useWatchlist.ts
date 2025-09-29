
import { useState, useEffect } from 'react';
import { WatchlistItem } from '@/types/Trade';
import { realStockDataService } from '@/services/realStockDataService';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize with some popular stocks
  const initializeWatchlist = (): WatchlistItem[] => {
    return [
      {
        id: '1',
        symbol: 'TSLA',
        companyName: 'Tesla Inc.',
        currentPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
      },
      {
        id: '2',
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        currentPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
      },
      {
        id: '3',
        symbol: 'NVDA',
        companyName: 'NVIDIA Corporation',
        currentPrice: 0,
        priceChange: 0,
        priceChangePercent: 0,
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
      }
    ];
  };

  const loadWatchlist = async () => {
    console.log('Loading watchlist with real data...');
    try {
      setError(null);
      
      // Start with initial watchlist
      let currentWatchlist = watchlist.length > 0 ? watchlist : initializeWatchlist();
      
      // Update with real market data
      const updatedWatchlist = await realStockDataService.updateWatchlistWithRealData(currentWatchlist);
      
      console.log(`Updated ${updatedWatchlist.length} watchlist items with real data`);
      setWatchlist(updatedWatchlist);
    } catch (error) {
      console.error('Error loading watchlist:', error);
      setError('Failed to load watchlist data. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (symbol: string, companyName: string) => {
    try {
      console.log(`Adding ${symbol} to watchlist...`);
      
      // Check if already in watchlist
      if (watchlist.some(item => item.symbol === symbol)) {
        console.log(`${symbol} is already in watchlist`);
        return;
      }

      // Get current price data
      const quote = await realStockDataService.getStockQuote(symbol);
      
      if (quote) {
        const newItem: WatchlistItem = {
          id: `watchlist_${symbol}_${Date.now()}`,
          symbol: quote.symbol,
          companyName: companyName,
          currentPrice: quote.price,
          priceChange: quote.change,
          priceChangePercent: quote.changePercent,
          addedAt: new Date()
        };

        setWatchlist(prev => [...prev, newItem]);
        console.log(`Successfully added ${symbol} to watchlist`);
      }
    } catch (error) {
      console.error(`Error adding ${symbol} to watchlist:`, error);
    }
  };

  const removeFromWatchlist = (itemId: string) => {
    const item = watchlist.find(w => w.id === itemId);
    if (item) {
      console.log(`Removing ${item.symbol} from watchlist`);
    }
    setWatchlist(prev => prev.filter(item => item.id !== itemId));
  };

  const refreshWatchlist = async () => {
    console.log('Refreshing watchlist with latest prices...');
    
    // Clear cache to get fresh data
    realStockDataService.clearCache();
    await loadWatchlist();
  };

  useEffect(() => {
    loadWatchlist();
    
    // Set up periodic price updates every 90 seconds for watchlist
    const interval = setInterval(() => {
      if (!loading) {
        refreshWatchlist();
      }
    }, 90000); // 90 seconds
    
    return () => clearInterval(interval);
  }, []);

  return {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    refreshWatchlist
  };
};
