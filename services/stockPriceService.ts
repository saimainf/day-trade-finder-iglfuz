
import { Trade, WatchlistItem } from '@/types/Trade';

// Simulated real-time price service
export class StockPriceService {
  private static instance: StockPriceService;
  private priceUpdateCallbacks: Map<string, (price: number) => void> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): StockPriceService {
    if (!StockPriceService.instance) {
      StockPriceService.instance = new StockPriceService();
    }
    return StockPriceService.instance;
  }

  // Simulate price fluctuations
  private generatePriceUpdate(basePrice: number): number {
    const volatility = 0.02; // 2% max change
    const change = (Math.random() - 0.5) * 2 * volatility;
    return Math.round((basePrice * (1 + change)) * 100) / 100;
  }

  // Subscribe to price updates for a symbol
  subscribeToPrice(symbol: string, basePrice: number, callback: (price: number) => void): void {
    console.log(`Subscribing to price updates for ${symbol}`);
    
    // Clear existing subscription if any
    this.unsubscribeFromPrice(symbol);
    
    this.priceUpdateCallbacks.set(symbol, callback);
    
    // Update price every 5-10 seconds with random interval
    const updateInterval = setInterval(() => {
      const newPrice = this.generatePriceUpdate(basePrice);
      callback(newPrice);
    }, Math.random() * 5000 + 5000); // 5-10 seconds
    
    this.intervals.set(symbol, updateInterval);
  }

  // Unsubscribe from price updates
  unsubscribeFromPrice(symbol: string): void {
    const interval = this.intervals.get(symbol);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(symbol);
    }
    this.priceUpdateCallbacks.delete(symbol);
  }

  // Get simulated current prices for multiple symbols
  async getCurrentPrices(symbols: string[]): Promise<Record<string, number>> {
    console.log('Fetching current prices for:', symbols);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return simulated current prices (these would come from a real API)
    const prices: Record<string, number> = {
      'AAPL': 185.25,
      'TSLA': 248.75,
      'NVDA': 138.42, // Updated to realistic current price
      'MSFT': 412.30,
      'AMD': 142.85,
      'GOOGL': 138.92,
      'AMZN': 155.43
    };
    
    return prices;
  }

  // Update trade prices with current market data
  async updateTradesPrices(trades: Trade[]): Promise<Trade[]> {
    const symbols = trades.map(trade => trade.symbol);
    const currentPrices = await this.getCurrentPrices(symbols);
    
    return trades.map(trade => {
      const currentPrice = currentPrices[trade.symbol] || trade.currentPrice;
      const priceChange = currentPrice - trade.currentPrice;
      
      return {
        ...trade,
        currentPrice,
        // Recalculate profit based on new price
        potentialProfit: trade.targetSellPrice - currentPrice,
        potentialProfitPercent: ((trade.targetSellPrice - currentPrice) / currentPrice) * 100
      };
    });
  }

  // Update watchlist prices
  async updateWatchlistPrices(watchlist: WatchlistItem[]): Promise<WatchlistItem[]> {
    const symbols = watchlist.map(item => item.symbol);
    const currentPrices = await this.getCurrentPrices(symbols);
    
    return watchlist.map(item => {
      const newPrice = currentPrices[item.symbol] || item.currentPrice;
      const priceChange = newPrice - item.currentPrice;
      const priceChangePercent = (priceChange / item.currentPrice) * 100;
      
      return {
        ...item,
        currentPrice: newPrice,
        priceChange,
        priceChangePercent
      };
    });
  }

  // Clean up all subscriptions
  cleanup(): void {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    this.priceUpdateCallbacks.clear();
  }
}

export const stockPriceService = StockPriceService.getInstance();
