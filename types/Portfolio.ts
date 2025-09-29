
export interface PortfolioPosition {
  id: string;
  symbol: string;
  companyName: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  sector: string;
  purchaseDate: Date;
  lastUpdated: Date;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  positions: PortfolioPosition[];
  topGainer?: PortfolioPosition;
  topLoser?: PortfolioPosition;
  sectorAllocation: SectorAllocation[];
}

export interface SectorAllocation {
  sector: string;
  value: number;
  percentage: number;
  color: string;
}

export interface Order {
  id: string;
  symbol: string;
  companyName: string;
  type: 'buy' | 'sell';
  orderType: 'market' | 'limit' | 'stop';
  quantity: number;
  price?: number;
  stopPrice?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  createdAt: Date;
  filledAt?: Date;
  filledPrice?: number;
  filledQuantity?: number;
}

export interface TradingAccount {
  id: string;
  balance: number;
  buyingPower: number;
  dayTradingBuyingPower: number;
  portfolioValue: number;
  dayTradesRemaining: number;
  isPatternDayTrader: boolean;
}
