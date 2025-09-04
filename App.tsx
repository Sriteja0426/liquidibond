import React, { useState, useCallback, useMemo } from 'react';
import { Bond, Order, OrderType, UserProfile, Currency, Page, RiskProfile, TradeLogEntry } from './types';
import { MOCK_BONDS } from './constants';
import Header from './components/Header';
import BondList from './components/BondList';
import BondDetail from './components/BondDetail';
import TokenizeBondModal from './components/TokenizeBondModal';
import KYCModal from './components/KYCModal';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import RewardsDashboard from './components/RewardsDashboard';
import Roadmap from './components/Roadmap';
import ComplianceDashboard from './components/ComplianceDashboard';
import SuitabilityQuestionnaire from './components/SuitabilityQuestionnaire';
import TwoFactorAuthModal from './components/TwoFactorAuthModal';
import PortfolioWarningModal from './components/PortfolioWarningModal';
import PaymentGatewayModal from './components/PaymentGatewayModal';

const App: React.FC = () => {
  const [bonds, setBonds] = useState<Bond[]>(MOCK_BONDS);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tradeLog, setTradeLog] = useState<TradeLogEntry[]>([]);
  
  const [isTokenizeModalOpen, setIsTokenizeModalOpen] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isSuitabilityModalOpen, setIsSuitabilityModalOpen] = useState(false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isPortfolioWarningModalOpen, setIsPortfolioWarningModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [pendingOrder, setPendingOrder] = useState<{ bondId: string; order: Omit<Order, 'id'> } | null>(null);
  
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [currency, setCurrency] = useState<Currency>('USD');

  const exchangeRates: Record<Currency, number> = { USD: 1, INR: 83.50, EUR: 0.92 };

  const handleConnectWallet = useCallback(() => {
    const newUserProfile: UserProfile = {
      walletAddress: '0x1A2b...c3D4',
      balance: { eth: 10.5, usdc: 25000, bondPoints: 1350, lbt: { APXI: 50, QSL: 100 } },
      kyc: { status: 'Unverified' },
      riskProfile: 'Unassessed',
    };
    setUserProfile(newUserProfile);
    if (newUserProfile.kyc.status === 'Unverified') {
      setTimeout(() => setIsKycModalOpen(true), 500);
    }
  }, []);
  
  // FIX: Changed handleKycSuccess to not expect a 'pan' argument to match the KYCModal's onSuccess prop type.
  // A mock PAN is generated here as the modal is a simulation.
  const handleKycSuccess = useCallback(() => {
    const mockPan = 'ABCDE1234F'; // Mock PAN for prototype
    setUserProfile(prev => prev ? { ...prev, kyc: { status: 'Verified', method: 'DigiLocker', verifiedOn: new Date().toISOString(), pan: mockPan } } : null);
    setIsKycModalOpen(false);
    // After KYC, prompt for risk assessment
    setTimeout(() => setIsSuitabilityModalOpen(true), 500);
  }, []);

  const handleSuitabilityComplete = useCallback((profile: RiskProfile) => {
    setUserProfile(prev => prev ? { ...prev, riskProfile: profile } : null);
    setIsSuitabilityModalOpen(false);
  }, []);

  const handleDisconnectWallet = useCallback(() => {
    setUserProfile(null);
  }, []);

  const handleSelectBond = useCallback((bond: Bond) => {
    setSelectedBond(bond);
    setCurrentPage('dashboard');
  }, []);

  const handleReturnToDashboard = useCallback(() => {
    setSelectedBond(null);
    setCurrentPage('dashboard');
  }, []);
  
  const executeTrade = useCallback((bondId: string, order: Omit<Order, 'id'>) => {
    const bond = bonds.find(b => b.id === bondId);
    if (!bond || !userProfile) return;

    setBonds(prevBonds => prevBonds.map(b => {
      if (b.id === bondId) {
        const newOrder = { ...order, id: `ORD-${Date.now()}` };
        const updatedBond = { ...b };
        if (order.type === OrderType.BID) {
          updatedBond.bids = [...b.bids, newOrder].sort((a, b) => b.price - a.price);
        } else {
          updatedBond.asks = [...b.asks, newOrder].sort((a, b) => a.price - b.price);
        }
        return updatedBond;
      }
      return b;
    }));

    const tradeValue = order.amount * order.price;
    const pointsAwarded = Math.round(tradeValue / 10);
    
    setUserProfile(prev => {
        if (!prev) return null;
        const newBalance = { ...prev.balance, bondPoints: prev.balance.bondPoints + pointsAwarded };
        if (order.type === OrderType.BID) {
            newBalance.usdc -= tradeValue;
        } else {
            newBalance.lbt = {...newBalance.lbt, [bond.symbol]: (newBalance.lbt[bond.symbol] || 0) - order.amount };
        }
        return {...prev, balance: newBalance};
    });

    // Add to trade log
    const flags: string[] = [];
    if (tradeValue > 50000) flags.push('Large Value Trade');
    if (bond.riskTier === 'High') flags.push('High-Risk Asset');

    const logEntry: TradeLogEntry = {
        id: `TRD-${Date.now()}`,
        timestamp: new Date().toISOString(),
        bondSymbol: bond.symbol,
        walletAddress: userProfile.walletAddress,
        kycStatus: userProfile.kyc.status,
        type: order.type,
        amount: order.amount,
        price: order.price,
        value: tradeValue,
        flags: flags,
    };
    setTradeLog(prev => [...prev, logEntry]);

  }, [bonds, userProfile]);

  const handlePlaceOrder = useCallback((bondId: string, order: Omit<Order, 'id'>) => {
    const bond = bonds.find(b => b.id === bondId);
    if (!userProfile || !bond) return;

    // 1. KYC Check
    if (userProfile.kyc.status !== 'Verified') {
        alert("Please complete KYC verification before trading.");
        setIsKycModalOpen(true);
        return;
    }
    // 2. Suitability Check
    if (userProfile.riskProfile === 'Unassessed') {
        setIsSuitabilityModalOpen(true);
        return;
    }
    if (userProfile.riskProfile === 'Conservative' && (bond.riskTier === 'Medium' || bond.riskTier === 'High')) {
        alert(`Your conservative risk profile does not permit trading in this ${bond.riskTier.toLowerCase()}-risk bond.`);
        return;
    }

    const orderDetails = { bondId, order };
    const tradeValue = order.amount * order.price;

    // 3. Portfolio Concentration Check (only for bids)
    if (order.type === OrderType.BID) {
        const currentPortfolioValue = Object.values(userProfile.balance.lbt).reduce((sum, val) => sum + (val * 100), 0) + userProfile.balance.usdc;
        const proposedBondValue = (userProfile.balance.lbt[bond.symbol] || 0) * 100 + tradeValue;
        if ((proposedBondValue / (currentPortfolioValue + tradeValue)) > 0.20) {
            setPendingOrder(orderDetails);
            setIsPortfolioWarningModalOpen(true);
            return;
        }
    }
    
    // 4. 2FA Check for high value
    if (tradeValue > 10000) {
        setPendingOrder(orderDetails);
        setIs2FAModalOpen(true);
        return;
    }
    
    executeTrade(bondId, order);
  }, [userProfile, bonds, executeTrade]);

  const handleTokenizeBond = useCallback((newBondData: Omit<Bond, 'id' | 'bids' | 'asks'>) => {
    const newBond: Bond = { ...newBondData, id: `BOND-${Date.now()}`, bids: [], asks: [] };
    setBonds(prev => [...prev, newBond]);
    setIsTokenizeModalOpen(false);
  }, []);
  
  const userLbtBalance = useMemo(() => {
      if (!userProfile || !selectedBond) return 0;
      return userProfile.balance.lbt[selectedBond.symbol] || 0;
  }, [userProfile, selectedBond]);

  const renderContent = () => {
      if (selectedBond && userProfile) {
          return <BondDetail
            bond={selectedBond}
            onPlaceOrder={handlePlaceOrder}
            onBack={handleReturnToDashboard}
            userLbtBalance={userLbtBalance}
            userUsdcBalance={userProfile.balance.usdc}
            currency={currency}
            exchangeRate={exchangeRates[currency]}
            userRiskProfile={userProfile.riskProfile}
          />
      }
      
      switch (currentPage) {
          case 'dashboard': return <BondList bonds={bonds} onSelectBond={handleSelectBond} currency={currency} exchangeRate={exchangeRates[currency]} />;
          case 'analytics': return <AnalyticsDashboard bonds={bonds} />;
          case 'rewards': return <RewardsDashboard userPoints={userProfile?.balance.bondPoints || 0} />;
          case 'roadmap': return <Roadmap />;
          case 'compliance': return <ComplianceDashboard tradeLog={tradeLog} />;
          default: return <BondList bonds={bonds} onSelectBond={handleSelectBond} currency={currency} exchangeRate={exchangeRates[currency]} />;
      }
  }

  return (
    <div className="min-h-screen bg-brand-background font-sans">
      <Header
        userProfile={userProfile}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
        onTokenizeClick={() => setIsTokenizeModalOpen(true)}
        onAddFundsClick={() => setIsPaymentModalOpen(true)}
        currentPage={currentPage}
        onNavigate={(page) => { setSelectedBond(null); setCurrentPage(page);}}
        selectedCurrency={currency}
        onCurrencyChange={setCurrency}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      {isTokenizeModalOpen && <TokenizeBondModal onClose={() => setIsTokenizeModalOpen(false)} onTokenize={handleTokenizeBond} />}
      {isKycModalOpen && userProfile && <KYCModal onClose={() => setIsKycModalOpen(false)} onSuccess={handleKycSuccess} />}
      {isSuitabilityModalOpen && <SuitabilityQuestionnaire onClose={() => setIsSuitabilityModalOpen(false)} onComplete={handleSuitabilityComplete} />}
      {isPaymentModalOpen && <PaymentGatewayModal onClose={() => setIsPaymentModalOpen(false)} onPaymentSuccess={(amount) => setUserProfile(p => p ? {...p, balance: {...p.balance, usdc: p.balance.usdc + amount}} : null)} />}
      
      {pendingOrder && (
          <>
             {isPortfolioWarningModalOpen && (
                <PortfolioWarningModal 
                    onClose={() => { setIsPortfolioWarningModalOpen(false); setPendingOrder(null); }}
                    onConfirm={() => {
                        setIsPortfolioWarningModalOpen(false);
                        const { bondId, order } = pendingOrder;
                        if ((order.amount * order.price) > 10000) {
                            setIs2FAModalOpen(true); // Chain to 2FA if needed
                        } else {
                            executeTrade(bondId, order);
                            setPendingOrder(null);
                        }
                    }}
                />
             )}
             {is2FAModalOpen && (
                 <TwoFactorAuthModal 
                    onClose={() => { setIs2FAModalOpen(false); setPendingOrder(null); }}
                    onSuccess={() => {
                        setIs2FAModalOpen(false);
                        executeTrade(pendingOrder.bondId, pendingOrder.order);
                        setPendingOrder(null);
                    }}
                 />
             )}
          </>
      )}
    </div>
  );
};

export default App;