import { StockAlert } from '@/types';

export const mockStockAlerts: StockAlert[] = [
  {
    id: '1',
    ticker: 'GME',
    mentionCount: 247,
    volumeRatio: 4.2,
    currentPrice: 23.45,
    priceChange: 12.5,
    detectedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    priority: 'high'
  },
  {
    id: '2',
    ticker: 'AMC',
    mentionCount: 189,
    volumeRatio: 3.8,
    currentPrice: 8.92,
    priceChange: -2.3,
    detectedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    priority: 'high'
  },
  {
    id: '3',
    ticker: 'BB',
    mentionCount: 156,
    volumeRatio: 2.9,
    currentPrice: 4.67,
    priceChange: 8.7,
    detectedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    priority: 'medium'
  },
  {
    id: '4',
    ticker: 'NOK',
    mentionCount: 98,
    volumeRatio: 2.1,
    currentPrice: 3.21,
    priceChange: 5.2,
    detectedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    priority: 'medium'
  },
  {
    id: '5',
    ticker: 'PLTR',
    mentionCount: 87,
    volumeRatio: 1.8,
    currentPrice: 15.34,
    priceChange: -1.4,
    detectedAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    priority: 'low'
  },
  {
    id: '6',
    ticker: 'TSLA',
    mentionCount: 234,
    volumeRatio: 1.5,
    currentPrice: 245.67,
    priceChange: 3.8,
    detectedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    priority: 'low'
  },
  {
    id: '7',
    ticker: 'NVDA',
    mentionCount: 145,
    volumeRatio: 2.3,
    currentPrice: 456.78,
    priceChange: 7.2,
    detectedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    priority: 'medium'
  },
  {
    id: '8',
    ticker: 'AAPL',
    mentionCount: 67,
    volumeRatio: 1.2,
    currentPrice: 189.45,
    priceChange: 1.5,
    detectedAt: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    priority: 'low'
  }
];

export const generateRandomAlert = (): StockAlert => {
  const tickers = ['GME', 'AMC', 'BB', 'NOK', 'PLTR', 'TSLA', 'NVDA', 'AAPL', 'MSFT', 'GOOGL', 'META', 'AMD'];
  const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low'];
  
  const randomTicker = tickers[Math.floor(Math.random() * tickers.length)];
  const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    ticker: randomTicker,
    mentionCount: Math.floor(Math.random() * 300) + 10,
    volumeRatio: Math.random() * 5 + 1,
    currentPrice: Math.random() * 500 + 10,
    priceChange: (Math.random() - 0.5) * 20,
    detectedAt: new Date().toISOString(),
    priority: randomPriority
  };
};
