import React, { useState } from 'react';
import { Bond } from '../types';
import { BeakerIcon } from './IconComponents';

interface LiquidityPoolProps {
  bond: Bond;
  userLbtBalance: number;
  userUsdcBalance: number;
}

// Mock data for the pool state. In a real app, this would come from a smart contract.
const MOCK_POOL_STATE = {
    totalLbt: 500,
    totalUsdc: 49900, // Roughly $99.8 per LBT
    totalShares: 1000,
};

const LiquidityPool: React.FC<LiquidityPoolProps> = ({ bond, userLbtBalance, userUsdcBalance }) => {
    const [lbtAmount, setLbtAmount] = useState('');
    const [usdcAmount, setUsdcAmount] = useState('');
    const [userShare, setUserShare] = useState(5); // Mock user having 5% of the pool

    const poolPrice = MOCK_POOL_STATE.totalUsdc / MOCK_POOL_STATE.totalLbt;
    const userLbtInPool = (MOCK_POOL_STATE.totalLbt * userShare) / 100;
    const userUsdcInPool = (MOCK_POOL_STATE.totalUsdc * userShare) / 100;

    const handleLbtChange = (value: string) => {
        setLbtAmount(value);
        const lbtVal = parseFloat(value);
        if (!isNaN(lbtVal) && lbtVal > 0) {
            setUsdcAmount((lbtVal * poolPrice).toFixed(2));
        } else {
            setUsdcAmount('');
        }
    };
    
    const handleAddLiquidity = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would trigger a smart contract transaction.
        alert(`Adding ${lbtAmount} ${bond.symbol} and ${usdcAmount} USDC to the pool.`);
        setLbtAmount('');
        setUsdcAmount('');
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-brand-surface border border-brand-border rounded-lg p-6">
                <h2 className="text-2xl font-bold flex items-center mb-4"><BeakerIcon/> <span className="ml-2">Automated Liquidity Pool</span></h2>
                <p className="text-brand-text-secondary mb-6">Provide liquidity by depositing an equal value of LBTs and USDC. Earn fees from trades and help maintain market depth.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-brand-background p-4 rounded-lg border border-brand-border">
                        <p className="text-sm text-brand-text-secondary">Total LBT in Pool</p>
                        <p className="text-xl font-bold text-brand-text-primary">{MOCK_POOL_STATE.totalLbt.toLocaleString()}</p>
                    </div>
                    <div className="bg-brand-background p-4 rounded-lg border border-brand-border">
                        <p className="text-sm text-brand-text-secondary">Total USDC in Pool</p>
                        <p className="text-xl font-bold text-brand-text-primary">{MOCK_POOL_STATE.totalUsdc.toLocaleString()}</p>
                    </div>
                     <div className="bg-brand-background p-4 rounded-lg border border-brand-border">
                        <p className="text-sm text-brand-text-secondary">Implied Price</p>
                        <p className="text-xl font-bold text-brand-primary">${poolPrice.toFixed(2)}</p>
                    </div>
                </div>

                 <div className="mt-6 border-t border-brand-border pt-6">
                    <h3 className="text-lg font-semibold">Your Liquidity Position</h3>
                    <div className="flex justify-between mt-2">
                        <p className="text-brand-text-secondary">Your Pool Share:</p>
                        <p className="font-bold">{userShare.toFixed(2)}%</p>
                    </div>
                    <div className="flex justify-between mt-1">
                        <p className="text-brand-text-secondary">{bond.symbol} Deposited:</p>
                        <p>{userLbtInPool.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between mt-1">
                        <p className="text-brand-text-secondary">USDC Deposited:</p>
                        <p>{userUsdcInPool.toLocaleString()}</p>
                    </div>
                     <button className="w-full mt-4 py-2 px-4 rounded-md text-sm font-medium bg-brand-danger/20 text-brand-danger hover:bg-brand-danger/40 transition-colors">
                        Remove Liquidity
                    </button>
                </div>
            </div>
            
            <div className="lg:col-span-2 bg-brand-surface border border-brand-border rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Add Liquidity</h3>
                <form onSubmit={handleAddLiquidity} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary">Amount ({bond.symbol})</label>
                        <input
                            type="number"
                            value={lbtAmount}
                            onChange={(e) => handleLbtChange(e.target.value)}
                            placeholder="0.00"
                            className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        />
                         <p className="text-xs text-brand-text-secondary mt-1">Balance: {userLbtBalance.toLocaleString()}</p>
                    </div>
                    <div className="text-center font-bold text-brand-text-secondary">+</div>
                    <div>
                        <label className="block text-sm font-medium text-brand-text-secondary">Amount (USDC)</label>
                        <input
                            type="number"
                            value={usdcAmount}
                            readOnly
                            placeholder="0.00"
                            className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary cursor-not-allowed"
                        />
                        <p className="text-xs text-brand-text-secondary mt-1">Balance: {userUsdcBalance.toLocaleString()}</p>
                    </div>
                     <button type="submit" className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary transition-colors">
                        Deposit & Stake
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LiquidityPool;
