import React from 'react';
import { Bond } from '../types';
import { ChartIcon } from './IconComponents';

interface AnalyticsDashboardProps {
  bonds: Bond[];
}

const StatCard: React.FC<{ title: string; value: string;}> = ({ title, value }) => (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
        <p className="text-brand-text-secondary">{title}</p>
        <p className="text-3xl font-bold text-brand-text-primary">{value}</p>
    </div>
);

const SimpleBarChart: React.FC<{ data: { label: string; value: number }[], unit: string }> = ({ data, unit }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="w-full h-64 bg-brand-background rounded-lg p-4 flex items-end justify-around space-x-4 border border-brand-border">
            {data.map(item => (
                <div key={item.label} className="flex-1 flex flex-col items-center justify-end">
                    <div 
                        className="w-full bg-brand-primary rounded-t-md" 
                        style={{ height: `${(item.value / maxValue) * 100}%`}}
                        title={`${item.label}: ${item.value.toLocaleString()} ${unit}`}
                    ></div>
                    <p className="text-xs text-brand-text-secondary mt-2">{item.label}</p>
                </div>
            ))}
        </div>
    );
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ bonds }) => {
    
    // Mock analytics data derived from bonds
    const totalVolume = bonds.reduce((acc, bond) => {
        const bidVolume = bond.bids.reduce((sum, o) => sum + o.amount * o.price, 0);
        const askVolume = bond.asks.reduce((sum, o) => sum + o.amount * o.price, 0);
        return acc + bidVolume + askVolume;
    }, 0);

    const totalLiquidity = bonds.reduce((acc, bond) => {
        const bidLiquidity = bond.bids.reduce((sum, o) => sum + o.amount * o.price, 0);
        const askLiquidity = bond.asks.reduce((sum, o) => sum + o.amount * o.price, 0);
        return acc + bidLiquidity + askLiquidity;
    }, 50000); // Add base liquidity from AMM

    const topTradedData = bonds.map(bond => ({
        label: bond.symbol,
        value: (bond.bids.length + bond.asks.length) * (bond.couponRate * 100) // Mock volume metric
    })).sort((a,b) => b.value - a.value).slice(0, 5);
    
    const liquidityDepthData = bonds.map(bond => ({
        label: bond.symbol,
        value: bond.bids.reduce((s, o) => s + o.amount, 0) + bond.asks.reduce((s, o) => s + o.amount, 0)
    }));


  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-brand-text-primary mb-2">Platform Analytics</h2>
        <p className="text-brand-text-secondary">Overview of market activity and liquidity across all tokenized bonds.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Trading Volume (24h)" value={`$${(totalVolume / 1000).toFixed(2)}K`} />
        <StatCard title="Total Value Locked" value={`$${(totalLiquidity / 1000).toFixed(2)}K`} />
        <StatCard title="Tokenized Bonds" value={bonds.length.toString()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4">Top Traded Bonds (by activity)</h3>
            <SimpleBarChart data={topTradedData} unit="Activity Score" />
         </div>
         <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4">Liquidity Depth (LBT)</h3>
            <SimpleBarChart data={liquidityDepthData} unit="LBT" />
         </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
