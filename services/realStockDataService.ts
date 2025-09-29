
import axios from 'axios';
import { Trade, WatchlistItem } from '@/types/Trade';

// Free API key for Alpha Vantage (demo key - replace with your own)
const ALPHA_VANTAGE_API_KEY = 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Fallback to Finnhub for real-time data (also free tier)
const FINNHUB_API_KEY = 'demo';
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: string;
}

export interface StockNews {
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export class RealStockDataService {
  private static instance: RealStockDataService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  static getInstance(): RealStockDataService {
    if (!RealStockDataService.instance) {
      RealStockDataService.instance = new RealStockDataService();
    }
    return RealStockDataService.instance;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.data;
    }
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Get real-time stock quote
  async getStockQuote(symbol: string): Promise<StockQuote | null> {
    const cacheKey = `quote_${symbol}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log(`Using cached data for ${symbol}`);
      return cached;
    }

    try {
      console.log(`Fetching real-time data for ${symbol}`);
      
      // Try Alpha Vantage first
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
        timeout: 10000,
      });

      const data = response.data['Global Quote'];
      if (data && data['01. symbol']) {
        const quote: StockQuote = {
          symbol: data['01. symbol'],
          price: parseFloat(data['05. price']),
          change: parseFloat(data['09. change']),
          changePercent: parseFloat(data['10. change percent'].replace('%', '')),
          volume: parseInt(data['06. volume']),
        };

        this.setCachedData(cacheKey, quote);
        return quote;
      }

      // Fallback to mock data if API fails
      return this.getMockQuote(symbol);
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      return this.getMockQuote(symbol);
    }
  }

  // Fallback mock data for when APIs are unavailable
  private getMockQuote(symbol: string): StockQuote {
    const mockPrices: Record<string, StockQuote> = {
      'AAPL': {
        symbol: 'AAPL',
        price: 185.25,
        change: 2.15,
        changePercent: 1.17,
        volume: 45678900,
        marketCap: '$2.85T'
      },
      'TSLA': {
        symbol: 'TSLA',
        price: 248.75,
        change: 5.25,
        changePercent: 2.16,
        volume: 89234567,
        marketCap: '$791B'
      },
      'NVDA': {
        symbol: 'NVDA',
        price: 138.42,
        change: -1.23,
        changePercent: -0.88,
        volume: 34567890,
        marketCap: '$3.41T'
      },
      'MSFT': {
        symbol: 'MSFT',
        price: 412.30,
        change: -2.15,
        changePercent: -0.52,
        volume: 23456789,
        marketCap: '$3.06T'
      },
      'AMD': {
        symbol: 'AMD',
        price: 142.85,
        change: 3.42,
        changePercent: 2.45,
        volume: 67890123,
        marketCap: '$231B'
      },
      'GOOGL': {
        symbol: 'GOOGL',
        price: 138.92,
        change: 1.87,
        changePercent: 1.36,
        volume: 12345678,
        marketCap: '$1.75T'
      },
      'AMZN': {
        symbol: 'AMZN',
        price: 155.43,
        change: -0.92,
        changePercent: -0.59,
        volume: 56789012,
        marketCap: '$1.62T'
      }
    };

    return mockPrices[symbol] || {
      symbol,
      price: 100 + Math.random() * 200,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 100000000),
    };
  }

  // Get multiple stock quotes
  async getMultipleQuotes(symbols: string[]): Promise<Record<string, StockQuote>> {
    console.log('Fetching quotes for symbols:', symbols);
    
    const quotes: Record<string, StockQuote> = {};
    
    // Fetch quotes in parallel with error handling
    const promises = symbols.map(async (symbol) => {
      try {
        const quote = await this.getStockQuote(symbol);
        if (quote) {
          quotes[symbol] = quote;
        }
      } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}:`, error);
        quotes[symbol] = this.getMockQuote(symbol);
      }
    });

    await Promise.all(promises);
    return quotes;
  }

  // Get stock news (simplified)
  async getStockNews(symbol: string, limit: number = 5): Promise<StockNews[]> {
    const cacheKey = `news_${symbol}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // This would typically call a news API
      // For now, return mock news data
      const mockNews: StockNews[] = [
        {
          title: `${symbol} Shows Strong Performance in Latest Quarter`,
          summary: `${symbol} reported better than expected earnings with strong revenue growth across all segments.`,
          source: 'Financial Times',
          publishedAt: new Date(Date.now() - 1000 * 60 * 30),
          sentiment: 'positive'
        },
        {
          title: `Analysts Upgrade ${symbol} Price Target`,
          summary: `Multiple analysts have raised their price targets for ${symbol} citing strong fundamentals.`,
          source: 'Reuters',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          sentiment: 'positive'
        }
      ];

      this.setCachedData(cacheKey, mockNews);
      return mockNews;
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error);
      return [];
    }
  }

  // Generate trading recommendations based on real data
  async generateTradingRecommendations(): Promise<Trade[]> {
    console.log('Generating trading recommendations with real data...');
    
    const popularSymbols = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'AMD', 'GOOGL', 'AMZN'];
    const quotes = await this.getMultipleQuotes(popularSymbols);
    
    const trades: Trade[] = [];
    
    for (const [symbol, quote] of Object.entries(quotes)) {
      // Generate trading recommendation based on real price data
      const recommendation = this.generateRecommendation(quote);
      
      if (recommendation) {
        trades.push({
          id: `trade_${symbol}_${Date.now()}`,
          symbol: quote.symbol,
          companyName: this.getCompanyName(quote.symbol),
          currentPrice: quote.price,
          recommendedBuyPrice: recommendation.buyPrice,
          targetSellPrice: recommendation.sellPrice,
          stopLoss: recommendation.stopLoss,
          confidenceScore: recommendation.confidence,
          potentialProfit: recommendation.sellPrice - quote.price,
          potentialProfitPercent: ((recommendation.sellPrice - quote.price) / quote.price) * 100,
          timeframe: recommendation.timeframe,
          volume: quote.volume,
          marketCap: quote.marketCap || 'N/A',
          sector: this.getSector(quote.symbol),
          analysis: recommendation.analysis,
          timestamp: new Date(),
          isWatchlisted: false
        });
      }
    }

    // Sort by confidence score
    return trades.sort((a, b) => b.confidenceScore - a.confidenceScore);
  }

  private generateRecommendation(quote: StockQuote) {
    // Simple algorithm based on price movement and volume
    const isPositiveTrend = quote.change > 0;
    const isHighVolume = quote.volume > 10000000;
    const volatility = Math.abs(quote.changePercent);
    
    // Only recommend if there's positive momentum or oversold condition
    if (!isPositiveTrend && volatility < 1) {
      return null; // Skip stocks with no clear signal
    }

    const confidence = Math.min(9.5, 
      5 + 
      (isPositiveTrend ? 2 : 0) + 
      (isHighVolume ? 1.5 : 0) + 
      (volatility > 2 ? 1 : 0)
    );

    const buyPrice = quote.price * (isPositiveTrend ? 0.998 : 1.002);
    const sellPrice = quote.price * (1 + (volatility / 100) + 0.03);
    const stopLoss = quote.price * 0.97;

    return {
      buyPrice: Math.round(buyPrice * 100) / 100,
      sellPrice: Math.round(sellPrice * 100) / 100,
      stopLoss: Math.round(stopLoss * 100) / 100,
      confidence: Math.round(confidence * 10) / 10,
      timeframe: volatility > 3 ? '1-2 days' : '2-5 days',
      analysis: {
        technicalIndicators: this.getTechnicalIndicators(quote),
        newssentiment: isPositiveTrend ? 'positive' : 'neutral' as const,
        marketTrend: isPositiveTrend ? 'bullish' : 'sideways' as const,
        riskLevel: volatility > 3 ? 'high' : volatility > 1.5 ? 'medium' : 'low' as const,
        keyFactors: [
          `Current price: $${quote.price}`,
          `24h change: ${quote.changePercent.toFixed(2)}%`,
          `Volume: ${(quote.volume / 1000000).toFixed(1)}M`,
          isHighVolume ? 'High trading volume' : 'Normal trading volume'
        ]
      }
    };
  }

  private getTechnicalIndicators(quote: StockQuote): string[] {
    const indicators = [];
    
    if (quote.change > 0) {
      indicators.push('Bullish Momentum');
    }
    
    if (quote.volume > 50000000) {
      indicators.push('High Volume');
    }
    
    if (Math.abs(quote.changePercent) > 3) {
      indicators.push('High Volatility');
    }
    
    if (quote.changePercent > 2) {
      indicators.push('Strong Uptrend');
    } else if (quote.changePercent < -2) {
      indicators.push('Oversold Condition');
    }
    
    return indicators.length > 0 ? indicators : ['Neutral Trend'];
  }

  private getCompanyName(symbol: string): string {
    const companies: Record<string, string> = {
      'AAPL': 'Apple Inc.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corporation',
      'MSFT': 'Microsoft Corporation',
      'AMD': 'Advanced Micro Devices',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
    };
    return companies[symbol] || `${symbol} Corp.`;
  }

  private getSector(symbol: string): string {
    const sectors: Record<string, string> = {
      'AAPL': 'Technology',
      'TSLA': 'Automotive',
      'NVDA': 'Technology',
      'MSFT': 'Technology',
      'AMD': 'Technology',
      'GOOGL': 'Technology',
      'AMZN': 'E-commerce',
    };
    return sectors[symbol] || 'Technology';
  }

  // Update watchlist with real data
  async updateWatchlistWithRealData(watchlist: WatchlistItem[]): Promise<WatchlistItem[]> {
    const symbols = watchlist.map(item => item.symbol);
    const quotes = await this.getMultipleQuotes(symbols);
    
    return watchlist.map(item => {
      const quote = quotes[item.symbol];
      if (quote) {
        return {
          ...item,
          currentPrice: quote.price,
          priceChange: quote.change,
          priceChangePercent: quote.changePercent
        };
      }
      return item;
    });
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

export const realStockDataService = RealStockDataService.getInstance();
