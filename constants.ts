import { Bond, OrderType } from './types';

export const MOCK_BONDS: Bond[] = [
  {
    id: 'BOND001',
    issuer: 'Apex Innovations Inc.',
    symbol: 'APXI',
    couponRate: 5.5,
    maturityDate: '2030-12-31',
    totalSupply: 1000,
    initialRating: 'S&P: AA-',
    riskTier: 'Low',
    bids: [
      { id: 'B1', type: OrderType.BID, amount: 10, price: 99.8 },
      { id: 'B2', type: OrderType.BID, amount: 5, price: 99.75 },
      { id: 'B3', type: OrderType.BID, amount: 20, price: 99.7 },
    ],
    asks: [
      { id: 'A1', type: OrderType.ASK, amount: 12, price: 100.1 },
      { id: 'A2', type: OrderType.ASK, amount: 8, price: 100.15 },
      { id: 'A3', type: OrderType.ASK, amount: 15, price: 100.2 },
    ],
  },
  {
    id: 'BOND002',
    issuer: 'Quantum Solutions Ltd.',
    symbol: 'QSL',
    couponRate: 4.8,
    maturityDate: '2028-06-15',
    totalSupply: 5000,
    initialRating: 'Moody\'s: A1',
    riskTier: 'Low',
    bids: [
      { id: 'B4', type: OrderType.BID, amount: 50, price: 101.2 },
      { id: 'B5', type: OrderType.BID, amount: 30, price: 101.1 },
    ],
    asks: [
      { id: 'A4', type: OrderType.ASK, amount: 40, price: 101.5 },
      { id: 'A5', type: OrderType.ASK, amount: 60, price: 101.6 },
    ],
  },
  {
    id: 'BOND003',
    issuer: 'Cybernetic Dynamics',
    symbol: 'CYBD',
    couponRate: 6.2,
    maturityDate: '2035-03-01',
    totalSupply: 2500,
    initialRating: 'Fitch: A+',
    riskTier: 'Medium',
    bids: [],
    asks: [
       { id: 'A6', type: OrderType.ASK, amount: 100, price: 98.0 },
    ],
  },
  {
    id: 'BOND004',
    issuer: 'Venture Capital X',
    symbol: 'VCX',
    couponRate: 9.8,
    maturityDate: '2027-08-20',
    totalSupply: 10000,
    initialRating: 'Unrated',
    riskTier: 'High',
    fraudAlerts: ['This bond is unrated and exhibits high volatility.', 'Unusual trading patterns detected.'],
    bids: [
       { id: 'B7', type: OrderType.BID, amount: 250, price: 85.5 },
    ],
    asks: [
       { id: 'A7', type: OrderType.ASK, amount: 300, price: 88.0 },
    ],
  },
];