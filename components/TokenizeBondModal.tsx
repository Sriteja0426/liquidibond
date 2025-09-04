import React, { useState } from 'react';
import { Bond } from '../types';
import { XIcon } from './IconComponents';

interface TokenizeBondModalProps {
  onClose: () => void;
  onTokenize: (newBond: Omit<Bond, 'id' | 'bids' | 'asks' | 'analysis'>) => void;
}

const TokenizeBondModal: React.FC<TokenizeBondModalProps> = ({ onClose, onTokenize }) => {
    const [issuer, setIssuer] = useState('');
    const [symbol, setSymbol] = useState('');
    const [couponRate, setCouponRate] = useState('');
    const [maturityDate, setMaturityDate] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [initialRating, setInitialRating] = useState('');
    const [riskTier, setRiskTier] = useState<'Low' | 'Medium' | 'High'>('Medium');


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBond = {
            issuer,
            symbol: symbol.toUpperCase(),
            couponRate: parseFloat(couponRate),
            maturityDate,
            totalSupply: parseInt(totalSupply, 10),
            initialRating,
            riskTier,
        };

        if (issuer && symbol && !isNaN(newBond.couponRate) && maturityDate && !isNaN(newBond.totalSupply) && initialRating) {
            onTokenize(newBond);
        } else {
            alert('Please fill all fields correctly.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface rounded-lg shadow-xl p-8 w-full max-w-md border border-brand-border relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text-primary">
                    <XIcon />
                </button>
                <h2 className="text-2xl font-bold mb-6">Tokenize a New Bond</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="issuer" className="block text-sm font-medium text-brand-text-secondary">Issuer</label>
                          <input type="text" id="issuer" value={issuer} onChange={e => setIssuer(e.target.value)} required className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                      </div>
                      <div>
                          <label htmlFor="symbol" className="block text-sm font-medium text-brand-text-secondary">Symbol</label>
                          <input type="text" id="symbol" value={symbol} onChange={e => setSymbol(e.target.value)} required maxLength={5} className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="initialRating" className="block text-sm font-medium text-brand-text-secondary">Initial Rating (e.g., S&P: A+)</label>
                            <input type="text" id="initialRating" value={initialRating} onChange={e => setInitialRating(e.target.value)} required className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                         <div>
                            <label htmlFor="riskTier" className="block text-sm font-medium text-brand-text-secondary">Risk Tier</label>
                            <select id="riskTier" value={riskTier} onChange={e => setRiskTier(e.target.value as any)} required className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="couponRate" className="block text-sm font-medium text-brand-text-secondary">Coupon Rate (%)</label>
                            <input type="number" id="couponRate" value={couponRate} onChange={e => setCouponRate(e.target.value)} required step="0.01" className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                        <div>
                            <label htmlFor="totalSupply" className="block text-sm font-medium text-brand-text-secondary">Total Supply (LBT)</label>
                            <input type="number" id="totalSupply" value={totalSupply} onChange={e => setTotalSupply(e.target.value)} required className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="maturityDate" className="block text-sm font-medium text-brand-text-secondary">Maturity Date</label>
                        <input type="date" id="maturityDate" value={maturityDate} onChange={e => setMaturityDate(e.target.value)} required className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary" />
                    </div>
                    
                    <div className="pt-4">
                        <button type="submit" className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary transition-colors">
                            Create & Tokenize
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TokenizeBondModal;