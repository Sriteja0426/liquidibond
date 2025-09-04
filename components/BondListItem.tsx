import React from 'react';
import { Bond, Currency } from '../types';
import { formatCurrency } from '../utils/currency';

interface BondListItemProps {
  bond: Bond;
  onSelectBond: (bond: Bond) => void;
  currency: Currency;
  exchangeRate: number;
}

const BondListItem: React.FC<BondListItemProps> = ({ bond, onSelectBond, currency, exchangeRate }) => {
  const lastPrice = bond.asks.length > 0 ? bond.asks[0].price : (bond.bids.length > 0 ? bond.bids[0].price : null);
  const displayPrice = lastPrice ? (lastPrice * exchangeRate).toFixed(2) : '--';

  return (
    <div
      onClick={() => onSelectBond(bond)}
      className="bg-brand-surface border border-brand-border rounded-lg p-6 cursor-pointer hover:border-brand-primary transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
    >
      <div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-brand-text-secondary">{bond.issuer}</p>
            <h3 className="text-xl font-bold text-brand-text-primary">{bond.symbol}</h3>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-brand-primary">{formatCurrency(lastPrice ? lastPrice * exchangeRate : 0, currency)}</p>
            <p className="text-xs text-brand-text-secondary">Last Ask</p>
          </div>
        </div>
        <div className="mt-4 text-sm">
           <p className="text-brand-text-secondary">Rating: <span className="font-medium text-brand-text-primary">{bond.initialRating}</span></p>
        </div>
      </div>
      <div className="mt-6 border-t border-brand-border pt-4 flex justify-between text-sm">
        <div>
          <p className="text-brand-text-secondary">Coupon</p>
          <p className="font-medium text-brand-text-primary">{bond.couponRate.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-brand-text-secondary">Maturity</p>
          <p className="font-medium text-brand-text-primary">{bond.maturityDate}</p>
        </div>
        <div>
          <p className="text-brand-text-secondary">Supply</p>
          <p className="font-medium text-brand-text-primary">{bond.totalSupply.toLocaleString()} LBT</p>
        </div>
      </div>
    </div>
  );
};

export default BondListItem;
