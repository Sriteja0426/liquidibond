export enum OrderType {
  BID = 'BID',
  ASK = 'ASK',
}

export interface Order {
  id: string;
  type: OrderType;
  amount: number;
  price: number; // Always in USD, conversion happens at display time
}

export interface BondAnalysis {
    fairValue: number;
    creditScore: string; // e.g., 'AA+'
    riskSummary: string;
    yieldPrediction: number;
}

export interface Bond {
  id: string;
  issuer: string;
  symbol: string;
  couponRate: number;
  maturityDate: string;
  totalSupply: number;
  bids: Order[];
  asks: Order[];
  initialRating: string; // e.g., 'S&P: A+'
  analysis?: BondAnalysis;
  fraudAlerts?: string[]; // For AI-powered risk detection
  riskTier: 'Low' | 'Medium' | 'High'; // For suitability checks
}

export interface UserBalance {
  eth: number;
  usdc: number;
  bondPoints: number;
  lbt: { [bondSymbol: string]: number };
}

export type Currency = 'USD' | 'INR' | 'EUR';

export interface LiquidityPool {
    lbtAmount: number;
    usdcAmount: number;
    share: number;
}

export type RiskProfile = 'Unassessed' | 'Conservative' | 'Moderate' | 'Aggressive';

export interface KYCDetails {
    status: 'Unverified' | 'Pending' | 'Verified';
    method?: 'DigiLocker';
    verifiedOn?: string;
    pan?: string;
}

export interface UserProfile {
    walletAddress: string;
    balance: UserBalance;
    kyc: KYCDetails;
    riskProfile: RiskProfile;
}

export interface TradeLogEntry {
    id: string;
    timestamp: string;
    bondSymbol: string;
    walletAddress: string;
    kycStatus: KYCDetails['status'];
    type: OrderType;
    amount: number;
    price: number;
    value: number;
    flags: string[];
}

export type Page = 'dashboard' | 'analytics' | 'rewards' | 'roadmap' | 'compliance';