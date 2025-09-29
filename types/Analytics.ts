
export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  description: string;
}

export interface ChartData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketSentiment {
  symbol: string;
  bullishPercent: number;
  bearishPercent: number;
  neutralPercent: number;
  totalVotes: number;
  socialMentions: number;
  sentimentScore: number; // -1 to 1
}

export interface PriceAlert {
  id: string;
  symbol: string;
  type: 'above' | 'below' | 'change_percent';
  targetPrice?: number;
  changePercent?: number;
  isActive: boolean;
  createdAt: Date;
  triggeredAt?: Date;
}

export interface MarketNews {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  author?: string;
  publishedAt: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedSymbols: string[];
  category: 'earnings' | 'merger' | 'regulatory' | 'general' | 'analyst';
  imageUrl?: string;
  url: string;
}

export interface PerformanceMetrics {
  totalReturn: number;
  totalReturnPercent: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  avgWinPercent: number;
  avgLossPercent: number;
  profitFactor: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
}
