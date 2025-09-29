
import { WatchlistItem } from '@/types/Trade';

export const mockWatchlist: WatchlistItem[] = [
  {
    id: '1',
    symbol: 'TSLA',
    companyName: 'Tesla Inc.',
    currentPrice: 248.75,
    priceChange: 5.25,
    priceChangePercent: 2.16,
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)
  },
  {
    id: '2',
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    currentPrice: 412.30,
    priceChange: -2.15,
    priceChangePercent: -0.52,
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5)
  },
  {
    id: '3',
    symbol: 'GOOGL',
    companyName: 'Alphabet Inc.',
    currentPrice: 138.92,
    priceChange: 1.87,
    priceChangePercent: 1.36,
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1)
  },
  {
    id: '4',
    symbol: 'AMZN',
    companyName: 'Amazon.com Inc.',
    currentPrice: 155.43,
    priceChange: -0.92,
    priceChangePercent: -0.59,
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  }
];
