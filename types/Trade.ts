
export interface Trade {
  id: string;
  symbol: string;
  companyName: string;
  currentPrice: number;
  recommendedBuyPrice: number;
  targetSellPrice: number;
  stopLoss: number;
  confidenceScore: number;
  potentialProfit: number;
  potentialProfitPercent: number;
  timeframe: string;
  volume: number;
  marketCap: string;
  sector: string;
  analysis: {
    technicalIndicators: string[];
    newssentiment: 'positive' | 'negative' | 'neutral';
    marketTrend: 'bullish' | 'bearish' | 'sideways';
    riskLevel: 'low' | 'medium' | 'high';
    keyFactors: string[];
  };
  timestamp: Date;
  isWatchlisted: boolean;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  companyName: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  addedAt: Date;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  source: string;
  publishedAt: Date;
  relatedSymbols: string[];
}
