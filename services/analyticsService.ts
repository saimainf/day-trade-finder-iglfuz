
import { TechnicalIndicator, ChartData, MarketSentiment, PriceAlert, MarketNews, PerformanceMetrics } from '@/types/Analytics';
import { realStockDataService } from './realStockDataService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ALERTS_KEY = 'price_alerts';
const NEWS_KEY = 'market_news';

export class AnalyticsService {
  private static instance: AnalyticsService;

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Generate technical indicators for a stock
  async getTechnicalIndicators(symbol: string): Promise<TechnicalIndicator[]> {
    try {
      const quote = await realStockDataService.getStockQuote(symbol);
      if (!quote) return [];

      const indicators: TechnicalIndicator[] = [];

      // RSI (simplified calculation)
      const rsi = this.calculateRSI(quote.changePercent);
      indicators.push({
        name: 'RSI (14)',
        value: rsi,
        signal: rsi > 70 ? 'sell' : rsi < 30 ? 'buy' : 'neutral',
        description: rsi > 70 ? 'Overbought condition' : rsi < 30 ? 'Oversold condition' : 'Neutral momentum'
      });

      // Moving Average Signal (simplified)
      const maSignal = quote.changePercent > 0 ? 'buy' : quote.changePercent < -2 ? 'sell' : 'neutral';
      indicators.push({
        name: 'MA Signal',
        value: quote.price,
        signal: maSignal,
        description: maSignal === 'buy' ? 'Price above moving average' : 
                    maSignal === 'sell' ? 'Price below moving average' : 'Price near moving average'
      });

      // Volume Analysis
      const volumeSignal = quote.volume > 50000000 ? 'buy' : 'neutral';
      indicators.push({
        name: 'Volume',
        value: quote.volume,
        signal: volumeSignal,
        description: volumeSignal === 'buy' ? 'High volume confirms trend' : 'Normal volume'
      });

      // Volatility Indicator
      const volatility = Math.abs(quote.changePercent);
      indicators.push({
        name: 'Volatility',
        value: volatility,
        signal: volatility > 3 ? 'sell' : volatility > 1 ? 'neutral' : 'buy',
        description: volatility > 3 ? 'High volatility - risky' : 
                    volatility > 1 ? 'Moderate volatility' : 'Low volatility - stable'
      });

      return indicators;
    } catch (error) {
      console.error('Error calculating technical indicators:', error);
      return [];
    }
  }

  private calculateRSI(changePercent: number): number {
    // Simplified RSI calculation based on recent price change
    // In a real app, you'd use 14 periods of price data
    const change = Math.abs(changePercent);
    if (changePercent > 0) {
      return Math.min(100, 50 + (change * 5));
    } else {
      return Math.max(0, 50 - (change * 5));
    }
  }

  // Generate mock chart data
  async getChartData(symbol: string, period: '1D' | '1W' | '1M' | '3M' | '1Y'): Promise<ChartData[]> {
    const quote = await realStockDataService.getStockQuote(symbol);
    if (!quote) return [];

    const periods = {
      '1D': { points: 24, interval: 60 * 60 * 1000 }, // Hourly for 1 day
      '1W': { points: 7, interval: 24 * 60 * 60 * 1000 }, // Daily for 1 week
      '1M': { points: 30, interval: 24 * 60 * 60 * 1000 }, // Daily for 1 month
      '3M': { points: 90, interval: 24 * 60 * 60 * 1000 }, // Daily for 3 months
      '1Y': { points: 52, interval: 7 * 24 * 60 * 60 * 1000 } // Weekly for 1 year
    };

    const { points, interval } = periods[period];
    const data: ChartData[] = [];
    let currentPrice = quote.price;

    for (let i = points - 1; i >= 0; i--) {
      const timestamp = new Date(Date.now() - (i * interval));
      
      // Generate realistic price movement
      const volatility = 0.02; // 2% volatility
      const change = (Math.random() - 0.5) * volatility;
      const open = currentPrice * (1 + change);
      const high = open * (1 + Math.random() * volatility * 0.5);
      const low = open * (1 - Math.random() * volatility * 0.5);
      const close = low + (Math.random() * (high - low));
      const volume = Math.floor(Math.random() * 50000000) + 10000000;

      data.push({
        timestamp,
        open,
        high,
        low,
        close,
        volume
      });

      currentPrice = close;
    }

    return data;
  }

  // Get market sentiment for a stock
  async getMarketSentiment(symbol: string): Promise<MarketSentiment> {
    // Mock sentiment data - in a real app, this would come from social media APIs
    const bullishPercent = Math.random() * 40 + 30; // 30-70%
    const bearishPercent = Math.random() * 30 + 10; // 10-40%
    const neutralPercent = 100 - bullishPercent - bearishPercent;

    return {
      symbol,
      bullishPercent,
      bearishPercent,
      neutralPercent,
      totalVotes: Math.floor(Math.random() * 10000) + 1000,
      socialMentions: Math.floor(Math.random() * 5000) + 100,
      sentimentScore: (bullishPercent - bearishPercent) / 100
    };
  }

  // Price alerts management
  async getPriceAlerts(): Promise<PriceAlert[]> {
    try {
      const data = await AsyncStorage.getItem(ALERTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading price alerts:', error);
      return [];
    }
  }

  async createPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt' | 'isActive'>): Promise<PriceAlert> {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      isActive: true,
      createdAt: new Date()
    };

    const alerts = await this.getPriceAlerts();
    alerts.push(newAlert);
    await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));

    return newAlert;
  }

  async checkPriceAlerts(): Promise<PriceAlert[]> {
    const alerts = await this.getPriceAlerts();
    const activeAlerts = alerts.filter(alert => alert.isActive);
    const triggeredAlerts: PriceAlert[] = [];

    for (const alert of activeAlerts) {
      const quote = await realStockDataService.getStockQuote(alert.symbol);
      if (!quote) continue;

      let triggered = false;

      switch (alert.type) {
        case 'above':
          triggered = alert.targetPrice !== undefined && quote.price >= alert.targetPrice;
          break;
        case 'below':
          triggered = alert.targetPrice !== undefined && quote.price <= alert.targetPrice;
          break;
        case 'change_percent':
          triggered = alert.changePercent !== undefined && 
                    Math.abs(quote.changePercent) >= Math.abs(alert.changePercent);
          break;
      }

      if (triggered) {
        alert.isActive = false;
        alert.triggeredAt = new Date();
        triggeredAlerts.push(alert);
      }
    }

    if (triggeredAlerts.length > 0) {
      await AsyncStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
    }

    return triggeredAlerts;
  }

  // Market news
  async getMarketNews(symbols?: string[]): Promise<MarketNews[]> {
    // Mock news data - in a real app, this would come from news APIs
    const mockNews: MarketNews[] = [
      {
        id: 'news_1',
        title: 'Tech Stocks Rally on Strong Earnings Reports',
        summary: 'Major technology companies report better-than-expected quarterly earnings, driving sector-wide gains.',
        content: 'Technology stocks surged in after-hours trading following a series of strong earnings reports...',
        source: 'Financial Times',
        author: 'Sarah Johnson',
        publishedAt: new Date(Date.now() - 1000 * 60 * 30),
        sentiment: 'positive',
        relatedSymbols: ['AAPL', 'MSFT', 'GOOGL', 'NVDA'],
        category: 'earnings',
        url: 'https://example.com/news/1'
      },
      {
        id: 'news_2',
        title: 'Federal Reserve Signals Potential Rate Changes',
        summary: 'Fed officials hint at possible monetary policy adjustments in upcoming meetings.',
        content: 'Federal Reserve officials indicated today that interest rate policies may be adjusted...',
        source: 'Reuters',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        sentiment: 'neutral',
        relatedSymbols: [],
        category: 'regulatory',
        url: 'https://example.com/news/2'
      },
      {
        id: 'news_3',
        title: 'Electric Vehicle Sales Surge in Q4',
        summary: 'EV manufacturers report record sales numbers for the fourth quarter.',
        content: 'Electric vehicle sales reached new heights in the final quarter of the year...',
        source: 'Bloomberg',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4),
        sentiment: 'positive',
        relatedSymbols: ['TSLA'],
        category: 'general',
        url: 'https://example.com/news/3'
      }
    ];

    // Filter by symbols if provided
    if (symbols && symbols.length > 0) {
      return mockNews.filter(news => 
        news.relatedSymbols.some(symbol => symbols.includes(symbol))
      );
    }

    return mockNews;
  }

  // Performance metrics calculation
  async calculatePerformanceMetrics(trades: any[]): Promise<PerformanceMetrics> {
    if (trades.length === 0) {
      return {
        totalReturn: 0,
        totalReturnPercent: 0,
        annualizedReturn: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        winRate: 0,
        avgWinPercent: 0,
        avgLossPercent: 0,
        profitFactor: 0,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0
      };
    }

    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    
    const totalReturn = trades.reduce((sum, t) => sum + t.pnl, 0);
    const totalInvested = trades.reduce((sum, t) => sum + Math.abs(t.invested), 0);
    const totalReturnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
    const avgWinPercent = winningTrades.length > 0 ? 
      winningTrades.reduce((sum, t) => sum + t.returnPercent, 0) / winningTrades.length : 0;
    const avgLossPercent = losingTrades.length > 0 ? 
      losingTrades.reduce((sum, t) => sum + Math.abs(t.returnPercent), 0) / losingTrades.length : 0;

    const grossProfit = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.pnl, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

    return {
      totalReturn,
      totalReturnPercent,
      annualizedReturn: totalReturnPercent * 4, // Simplified annualization
      sharpeRatio: 1.2, // Mock Sharpe ratio
      maxDrawdown: -15.5, // Mock max drawdown
      winRate,
      avgWinPercent,
      avgLossPercent,
      profitFactor,
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length
    };
  }
}

export const analyticsService = AnalyticsService.getInstance();
