
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PortfolioPosition, PortfolioSummary, Order, TradingAccount, SectorAllocation } from '@/types/Portfolio';
import { realStockDataService } from './realStockDataService';

const PORTFOLIO_KEY = 'portfolio_positions';
const ORDERS_KEY = 'trading_orders';
const ACCOUNT_KEY = 'trading_account';

export class PortfolioService {
  private static instance: PortfolioService;

  static getInstance(): PortfolioService {
    if (!PortfolioService.instance) {
      PortfolioService.instance = new PortfolioService();
    }
    return PortfolioService.instance;
  }

  // Initialize demo portfolio
  async initializeDemoPortfolio(): Promise<void> {
    const existingPositions = await this.getPositions();
    if (existingPositions.length === 0) {
      const demoPositions: PortfolioPosition[] = [
        {
          id: 'pos_1',
          symbol: 'AAPL',
          companyName: 'Apple Inc.',
          quantity: 10,
          averageBuyPrice: 180.50,
          currentPrice: 185.25,
          totalValue: 1852.50,
          unrealizedPnL: 47.50,
          unrealizedPnLPercent: 2.63,
          sector: 'Technology',
          purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
          lastUpdated: new Date()
        },
        {
          id: 'pos_2',
          symbol: 'TSLA',
          companyName: 'Tesla Inc.',
          quantity: 5,
          averageBuyPrice: 245.00,
          currentPrice: 248.75,
          totalValue: 1243.75,
          unrealizedPnL: 18.75,
          unrealizedPnLPercent: 1.53,
          sector: 'Automotive',
          purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          lastUpdated: new Date()
        },
        {
          id: 'pos_3',
          symbol: 'NVDA',
          companyName: 'NVIDIA Corporation',
          quantity: 8,
          averageBuyPrice: 142.00,
          currentPrice: 138.42,
          totalValue: 1107.36,
          unrealizedPnL: -28.64,
          unrealizedPnLPercent: -2.52,
          sector: 'Technology',
          purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
          lastUpdated: new Date()
        }
      ];

      await AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify(demoPositions));
    }

    // Initialize demo account
    const existingAccount = await this.getTradingAccount();
    if (!existingAccount) {
      const demoAccount: TradingAccount = {
        id: 'account_1',
        balance: 25000.00,
        buyingPower: 50000.00,
        dayTradingBuyingPower: 100000.00,
        portfolioValue: 0,
        dayTradesRemaining: 3,
        isPatternDayTrader: false
      };
      await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(demoAccount));
    }
  }

  async getPositions(): Promise<PortfolioPosition[]> {
    try {
      const data = await AsyncStorage.getItem(PORTFOLIO_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading portfolio positions:', error);
      return [];
    }
  }

  async updatePositionPrices(): Promise<PortfolioPosition[]> {
    const positions = await this.getPositions();
    if (positions.length === 0) return positions;

    const symbols = positions.map(p => p.symbol);
    const quotes = await realStockDataService.getMultipleQuotes(symbols);

    const updatedPositions = positions.map(position => {
      const quote = quotes[position.symbol];
      if (quote) {
        const currentPrice = quote.price;
        const totalValue = position.quantity * currentPrice;
        const unrealizedPnL = totalValue - (position.quantity * position.averageBuyPrice);
        const unrealizedPnLPercent = (unrealizedPnL / (position.quantity * position.averageBuyPrice)) * 100;

        return {
          ...position,
          currentPrice,
          totalValue,
          unrealizedPnL,
          unrealizedPnLPercent,
          lastUpdated: new Date()
        };
      }
      return position;
    });

    await AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify(updatedPositions));
    return updatedPositions;
  }

  async getPortfolioSummary(): Promise<PortfolioSummary> {
    const positions = await this.updatePositionPrices();
    
    const totalValue = positions.reduce((sum, pos) => sum + pos.totalValue, 0);
    const totalCost = positions.reduce((sum, pos) => sum + (pos.quantity * pos.averageBuyPrice), 0);
    const totalPnL = totalValue - totalCost;
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    // Calculate day change (simplified - would need historical data)
    const dayChange = positions.reduce((sum, pos) => sum + (pos.unrealizedPnL * 0.1), 0);
    const dayChangePercent = totalValue > 0 ? (dayChange / totalValue) * 100 : 0;

    // Find top gainer and loser
    const topGainer = positions.reduce((max, pos) => 
      pos.unrealizedPnLPercent > (max?.unrealizedPnLPercent || -Infinity) ? pos : max, undefined);
    const topLoser = positions.reduce((min, pos) => 
      pos.unrealizedPnLPercent < (min?.unrealizedPnLPercent || Infinity) ? pos : min, undefined);

    // Calculate sector allocation
    const sectorMap = new Map<string, number>();
    positions.forEach(pos => {
      const current = sectorMap.get(pos.sector) || 0;
      sectorMap.set(pos.sector, current + pos.totalValue);
    });

    const sectorColors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5AC8FA'];
    const sectorAllocation: SectorAllocation[] = Array.from(sectorMap.entries()).map(([sector, value], index) => ({
      sector,
      value,
      percentage: (value / totalValue) * 100,
      color: sectorColors[index % sectorColors.length]
    }));

    return {
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercent,
      dayChange,
      dayChangePercent,
      positions,
      topGainer,
      topLoser,
      sectorAllocation
    };
  }

  async getTradingAccount(): Promise<TradingAccount | null> {
    try {
      const data = await AsyncStorage.getItem(ACCOUNT_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading trading account:', error);
      return null;
    }
  }

  async updateTradingAccount(account: TradingAccount): Promise<void> {
    await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  }

  async getOrders(): Promise<Order[]> {
    try {
      const data = await AsyncStorage.getItem(ORDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  }

  async placeOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: `order_${Date.now()}`,
      status: 'pending',
      createdAt: new Date()
    };

    const orders = await this.getOrders();
    orders.push(newOrder);
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Simulate order execution after a delay
    setTimeout(() => this.executeOrder(newOrder.id), 2000);

    return newOrder;
  }

  private async executeOrder(orderId: string): Promise<void> {
    const orders = await this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex === -1) return;

    const order = orders[orderIndex];
    const quote = await realStockDataService.getStockQuote(order.symbol);
    
    if (quote) {
      // Simulate order execution
      orders[orderIndex] = {
        ...order,
        status: 'filled',
        filledAt: new Date(),
        filledPrice: quote.price,
        filledQuantity: order.quantity
      };

      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

      // Update portfolio if buy order
      if (order.type === 'buy') {
        await this.addPosition(order.symbol, order.companyName, order.quantity, quote.price);
      } else {
        await this.reducePosition(order.symbol, order.quantity);
      }
    }
  }

  private async addPosition(symbol: string, companyName: string, quantity: number, price: number): Promise<void> {
    const positions = await this.getPositions();
    const existingIndex = positions.findIndex(p => p.symbol === symbol);

    if (existingIndex >= 0) {
      // Update existing position
      const existing = positions[existingIndex];
      const totalQuantity = existing.quantity + quantity;
      const totalCost = (existing.quantity * existing.averageBuyPrice) + (quantity * price);
      const newAveragePrice = totalCost / totalQuantity;

      positions[existingIndex] = {
        ...existing,
        quantity: totalQuantity,
        averageBuyPrice: newAveragePrice,
        lastUpdated: new Date()
      };
    } else {
      // Create new position
      const newPosition: PortfolioPosition = {
        id: `pos_${Date.now()}`,
        symbol,
        companyName,
        quantity,
        averageBuyPrice: price,
        currentPrice: price,
        totalValue: quantity * price,
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
        sector: this.getSector(symbol),
        purchaseDate: new Date(),
        lastUpdated: new Date()
      };
      positions.push(newPosition);
    }

    await AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify(positions));
  }

  private async reducePosition(symbol: string, quantity: number): Promise<void> {
    const positions = await this.getPositions();
    const existingIndex = positions.findIndex(p => p.symbol === symbol);

    if (existingIndex >= 0) {
      const existing = positions[existingIndex];
      const newQuantity = existing.quantity - quantity;

      if (newQuantity <= 0) {
        // Remove position entirely
        positions.splice(existingIndex, 1);
      } else {
        // Reduce position
        positions[existingIndex] = {
          ...existing,
          quantity: newQuantity,
          lastUpdated: new Date()
        };
      }

      await AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify(positions));
    }
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

  async cancelOrder(orderId: string): Promise<void> {
    const orders = await this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex >= 0 && orders[orderIndex].status === 'pending') {
      orders[orderIndex].status = 'cancelled';
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    }
  }
}

export const portfolioService = PortfolioService.getInstance();
