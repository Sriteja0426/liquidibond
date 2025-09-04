import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Currency, Page } from '../types';
import { WalletIcon, PlusCircleIcon, LogOutIcon, VerifiedIcon, ChartIcon, GiftIcon, RoadmapIcon, ChevronDownIcon, CurrencyDollarIcon, CurrencyRupeeIcon, CurrencyEuroIcon, ShieldIcon, BanknotesIcon } from './IconComponents';

interface HeaderProps {
  userProfile: UserProfile | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onTokenizeClick: () => void;
  onAddFundsClick: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  selectedCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const NavLink: React.FC<{ page: Page; currentPage: Page; onNavigate: (page: Page) => void; children: React.ReactNode; icon: React.ReactNode }> = 
({ page, currentPage, onNavigate, children, icon }) => {
    const isActive = currentPage === page;
    return (
        <button 
            onClick={() => onNavigate(page)}
            className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive ? 'bg-brand-primary/20 text-brand-primary' : 'text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-primary'
            }`}
        >
            {icon}
            <span>{children}</span>
        </button>
    );
}

const CurrencyDropdown: React.FC<{ selectedCurrency: Currency; onCurrencyChange: (currency: Currency) => void; }> = ({ selectedCurrency, onCurrencyChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currencies: { id: Currency, icon: React.ReactNode }[] = [
        { id: 'USD', icon: <CurrencyDollarIcon /> },
        { id: 'INR', icon: <CurrencyRupeeIcon /> },
        { id: 'EUR', icon: <CurrencyEuroIcon /> },
    ];
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedCurrencyIcon = currencies.find(c => c.id === selectedCurrency)?.icon;

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md bg-brand-surface hover:bg-brand-border transition-colors border border-brand-border">
                {selectedCurrencyIcon}
                <span>{selectedCurrency}</span>
                <ChevronDownIcon />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-brand-surface border border-brand-border rounded-md shadow-lg z-20">
                    {currencies.map(({ id, icon }) => (
                        <button key={id} onClick={() => { onCurrencyChange(id); setIsOpen(false); }} className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-brand-text-secondary hover:bg-brand-border hover:text-brand-text-primary">
                            {icon}
                            <span>{id}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const Header: React.FC<HeaderProps> = (props) => {
  const { userProfile, onConnect, onDisconnect, onTokenizeClick, onAddFundsClick, currentPage, onNavigate, selectedCurrency, onCurrencyChange } = props;
  const walletAddress = userProfile?.walletAddress;
  const userBalance = userProfile?.balance;
  const isVerified = userProfile?.kyc.status === 'Verified';

  return (
    <header className="bg-brand-surface border-b border-brand-border sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>
            <h1 className="text-2xl font-bold text-brand-text-primary hidden sm:block">LiquidiBond</h1>
             <nav className="hidden md:flex items-center space-x-2 ml-4 border-l border-brand-border pl-4">
                <NavLink page="dashboard" currentPage={currentPage} onNavigate={onNavigate} icon={<WalletIcon />}>Dashboard</NavLink>
                <NavLink page="analytics" currentPage={currentPage} onNavigate={onNavigate} icon={<ChartIcon />}>Analytics</NavLink>
                <NavLink page="rewards" currentPage={currentPage} onNavigate={onNavigate} icon={<GiftIcon />}>Rewards</NavLink>
                <NavLink page="compliance" currentPage={currentPage} onNavigate={onNavigate} icon={<ShieldIcon />}>Compliance</NavLink>
             </nav>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            {userProfile && walletAddress && userBalance ? (
              <div className="flex items-center space-x-2 md:space-x-4">
                 <button onClick={onAddFundsClick} className="hidden lg:flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md bg-brand-surface hover:bg-brand-border transition-colors border border-brand-border">
                    <BanknotesIcon/>
                    <span>Add Funds</span>
                 </button>
                {isVerified && (
                     <div className="flex items-center space-x-2 text-brand-success bg-green-500/10 px-3 py-1.5 rounded-md border border-green-500/30">
                        <VerifiedIcon />
                        <span className="text-sm font-medium hidden sm:block">SEBI Verified</span>
                     </div>
                )}
                <div className="hidden sm:block">
                 <CurrencyDropdown selectedCurrency={selectedCurrency} onCurrencyChange={onCurrencyChange} />
                </div>
                <div className="flex items-center space-x-2 bg-brand-background px-3 py-1.5 rounded-md border border-brand-border">
                  <span className="font-mono text-sm text-brand-text-secondary">{walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
                </div>
                 <button onClick={onDisconnect} className="p-2 rounded-md hover:bg-brand-border transition-colors text-brand-text-secondary hover:text-brand-danger">
                    <LogOutIcon />
                </button>
              </div>
            ) : (
             <>
             <button
              onClick={() => onNavigate('roadmap')}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md bg-brand-surface text-brand-text-primary hover:bg-brand-border transition-colors border border-brand-border"
            >
              <RoadmapIcon />
              <span className="hidden sm:inline">Roadmap</span>
            </button>
              <button
                onClick={onConnect}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md bg-brand-primary text-white hover:bg-brand-secondary transition-colors"
              >
                <WalletIcon />
                <span>Connect Wallet</span>
              </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;