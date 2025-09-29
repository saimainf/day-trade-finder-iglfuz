
import { Trade } from '@/types/Trade';

export const mockTrades: Trade[] = [
  {
    id: '1',
    symbol: 'AAPL',
    companyName: 'Apple Inc.',
    currentPrice: 185.25,
    recommendedBuyPrice: 184.50,
    targetSellPrice: 192.00,
    stopLoss: 180.00,
    confidenceScore: 8.5,
    potentialProfit: 7.50,
    potentialProfitPercent: 4.07,
    timeframe: '1-3 days',
    volume: 45678900,
    marketCap: '$2.85T',
    sector: 'Technology',
    analysis: {
      technicalIndicators: ['RSI Oversold', 'MACD Bullish Cross', 'Support at $184'],
      newssentiment: 'positive',
      marketTrend: 'bullish',
      riskLevel: 'low',
      keyFactors: [
        'Strong Q4 earnings beat expectations',
        'iPhone 15 sales momentum',
        'Services revenue growth',
        'Technical bounce from support level'
      ]
    },
    timestamp: new Date(),
    isWatchlisted: false
  },
  {
    id: '2',
    symbol: 'TSLA',
    companyName: 'Tesla Inc.',
    currentPrice: 248.75,
    recommendedBuyPrice: 247.00,
    targetSellPrice: 265.00,
    stopLoss: 240.00,
    confidenceScore: 7.2,
    potentialProfit: 18.00,
    potentialProfitPercent: 7.29,
    timeframe: '2-5 days',
    volume: 89234567,
    marketCap: '$791B',
    sector: 'Automotive',
    analysis: {
      technicalIndicators: ['Breaking Resistance', 'Volume Surge', 'Golden Cross'],
      newssentiment: 'positive',
      marketTrend: 'bullish',
      riskLevel: 'medium',
      keyFactors: [
        'Model Y price cuts driving demand',
        'FSD beta expansion',
        'Supercharger network growth',
        'Technical breakout pattern'
      ]
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isWatchlisted: true
  },
  {
    id: '3',
    symbol: 'NVDA',
    companyName: 'NVIDIA Corporation',
    currentPrice: 875.50,
    recommendedBuyPrice: 870.00,
    targetSellPrice: 920.00,
    stopLoss: 850.00,
    confidenceScore: 9.1,
    potentialProfit: 50.00,
    potentialProfitPercent: 5.75,
    timeframe: '1-2 days',
    volume: 34567890,
    marketCap: '$2.16T',
    sector: 'Technology',
    analysis: {
      technicalIndicators: ['Strong Momentum', 'High Volume', 'Above All MAs'],
      newssentiment: 'positive',
      marketTrend: 'bullish',
      riskLevel: 'medium',
      keyFactors: [
        'AI chip demand surge',
        'Data center revenue growth',
        'Partnership announcements',
        'Institutional buying pressure'
      ]
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    isWatchlisted: false
  },
  {
    id: '4',
    symbol: 'MSFT',
    companyName: 'Microsoft Corporation',
    currentPrice: 412.30,
    recommendedBuyPrice: 410.00,
    targetSellPrice: 425.00,
    stopLoss: 405.00,
    confidenceScore: 7.8,
    potentialProfit: 15.00,
    potentialProfitPercent: 3.66,
    timeframe: '2-4 days',
    volume: 23456789,
    marketCap: '$3.06T',
    sector: 'Technology',
    analysis: {
      technicalIndicators: ['Bullish Flag', 'Support Hold', 'Rising Volume'],
      newssentiment: 'positive',
      marketTrend: 'bullish',
      riskLevel: 'low',
      keyFactors: [
        'Azure cloud growth acceleration',
        'AI integration across products',
        'Strong enterprise demand',
        'Dividend increase announcement'
      ]
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    isWatchlisted: true
  },
  {
    id: '5',
    symbol: 'AMD',
    companyName: 'Advanced Micro Devices',
    currentPrice: 142.85,
    recommendedBuyPrice: 141.50,
    targetSellPrice: 155.00,
    stopLoss: 138.00,
    confidenceScore: 6.9,
    potentialProfit: 13.50,
    potentialProfitPercent: 9.54,
    timeframe: '3-7 days',
    volume: 67890123,
    marketCap: '$231B',
    sector: 'Technology',
    analysis: {
      technicalIndicators: ['Oversold Bounce', 'Hammer Pattern', 'Volume Pickup'],
      newssentiment: 'neutral',
      marketTrend: 'sideways',
      riskLevel: 'medium',
      keyFactors: [
        'New CPU architecture launch',
        'Data center market share gains',
        'Competition with Intel heating up',
        'Technical oversold condition'
      ]
    },
    timestamp: new Date(Date.now() - 1000 * 60 * 90),
    isWatchlisted: false
  }
];
