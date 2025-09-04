import React, { useState } from 'react';
import { Bond, Order, OrderType, Currency, RiskProfile } from '../types';
import OrderBook from './OrderBook';
import OrderForm from './OrderForm';
import BondInsights from './BondInsights';
import LiquidityPool from './LiquidityPool';
import { ChevronLeftIcon, ChartIcon, SparklesIcon, BeakerIcon, ShieldIcon } from './IconComponents';

interface BondDetailProps {
  bond: Bond;
  onPlaceOrder: (bondId: string, order: Omit<Order, 'id'>) => void;
  onBack: () => void;
  userLbtBalance: number;
  userUsdcBalance: number;
  currency: Currency;
  exchangeRate: number;
  userRiskProfile: RiskProfile;
}

type Tab = 'trade' | 'insights' | 'liquidity';

const BondDetail: React.FC<BondDetailProps> = (props) => {
  const { bond, onPlaceOrder, onBack, userLbtBalance, userUsdcBalance, currency, exchangeRate, userRiskProfile } = props;
  const [activeTab, setActiveTab] = useState<Tab>('trade');
  
  const isTradeDisabled = userRiskProfile === 'Conservative' && (bond.riskTier === 'Medium' || bond.riskTier === 'High');

  const TabButton: React.FC<{tab: Tab, icon: React.ReactNode, label: string}> = ({tab, icon, label}) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors ${
            activeTab === tab 
            ? 'border-brand-primary text-brand-primary' 
            : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <button onClick={onBack} className="flex items-center space-x-2 text-brand-primary hover:text-brand-secondary mb-4">
          <ChevronLeftIcon />
          <span>Back to Dashboard</span>
        </button>
        <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start">
              <div>
                <p className="text-brand-text-secondary">{bond.issuer}</p>
                <div className="flex items-center space-x-2">
                  <h2 className="text-4xl font-bold text-brand-text-primary">{bond.symbol}</h2>
                  <ShieldIcon />
                </div>
                 <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      bond.riskTier === 'Low' ? 'bg-green-500/20 text-green-400' :
                      bond.riskTier === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                  }`}>{bond.riskTier} Risk</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 mt-4 md:mt-0 text-left">
                  <div><p className="text-sm text-brand-text-secondary">Coupon</p><p className="text-lg font-semibold">{bond.couponRate.toFixed(2)}%</p></div>
                  <div><p className="text-sm text-brand-text-secondary">Maturity</p><p className="text-lg font-semibold">{bond.maturityDate}</p></div>
                  <div><p className="text-sm text-brand-text-secondary">Supply</p><p className="text-lg font-semibold">{bond.totalSupply.toLocaleString()} LBT</p></div>
                  <div><p className="text-sm text-brand-text-secondary">Balance</p><p className="text-lg font-semibold">{userLbtBalance.toLocaleString()} LBT</p></div>
              </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center border-b border-brand-border">
        <div className="flex space-x-2">
            <TabButton tab="trade" icon={<ChartIcon />} label="Trade"/>
            <TabButton tab="insights" icon={<SparklesIcon />} label="AI Insights"/>
            <TabButton tab="liquidity" icon={<BeakerIcon />} label="Liquidity Pool"/>
        </div>
        <button onClick={() => alert('Simulating redirect to SEBI SCORES portal for dispute resolution...')} className="text-xs text-brand-text-secondary hover:text-brand-primary transition-colors pr-4">Dispute Resolution</button>
      </div>
      
      <div>
        {isTradeDisabled && activeTab === 'trade' && (
             <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg p-4 text-center">
                Trading in this bond is restricted based on your 'Conservative' risk profile.
            </div>
        )}
        {activeTab === 'trade' && (
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isTradeDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="lg:col-span-2">
                    <OrderBook bids={bond.bids} asks={bond.asks} currency={currency} exchangeRate={exchangeRate} />
                </div>
                <div className="space-y-6">
                    <OrderForm type={OrderType.BID} onSubmit={(price, amount) => onPlaceOrder(bond.id, { type: OrderType.BID, price, amount })} currency={currency}/>
                    <OrderForm type={OrderType.ASK} onSubmit={(price, amount) => onPlaceOrder(bond.id, { type: OrderType.ASK, price, amount })} currency={currency}/>
                </div>
            </div>
        )}
        {activeTab === 'insights' && <BondInsights bond={bond} />}
        {activeTab === 'liquidity' && <LiquidityPool bond={bond} userLbtBalance={userLbtBalance} userUsdcBalance={userUsdcBalance} />}
      </div>
    </div>
  );
};

export default BondDetail;