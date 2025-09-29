
import { useState, useEffect } from 'react';
import { WatchlistItem } from '@/types/Trade';
import { mockWatchlist } from '@/data/mockWatchlist';
import { stockPriceService } from '@/services/stockPriceService';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWatchlist = async () => {
    console.log('Loading watchlist...');
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get updated prices for watchlist
      const updatedWatchlist = await stockPriceService.updateWatchlistPrices(mockWatchlist);
      setWatchlist(updatedWatchlist);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = (itemId: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== itemId));
  };

  const refreshWatchlist = async () => {
    console.log('Refreshing watchlist prices...');
    await loadWatchlist();
  };

  useEffect(() => {
    loadWatchlist();
    
    // Set up periodic price updates every 15 seconds for watchlist
    const interval = setInterval(() => {
      refreshWatchlist();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    watchlist,
    loading,
    removeFromWatchlist,
    refreshWatchlist
  };
};
