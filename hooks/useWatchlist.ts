
import { useState, useEffect } from 'react';
import { WatchlistItem } from '@/types/Trade';
import { mockWatchlist } from '@/data/mockWatchlist';

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWatchlist = async () => {
    console.log('Loading watchlist...');
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setWatchlist(mockWatchlist);
    } catch (error) {
      console.error('Error loading watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = (itemId: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== itemId));
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  return {
    watchlist,
    loading,
    removeFromWatchlist
  };
};
