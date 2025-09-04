import React from 'react';
import { Bond, Currency } from '../types';
import BondListItem from './BondListItem';

interface BondListProps {
  bonds: Bond[];
  onSelectBond: (bond: Bond) => void;
  currency: Currency;
  exchangeRate: number;
}

const BondList: React.FC<BondListProps> = ({ bonds, onSelectBond, currency, exchangeRate }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-brand-text-primary mb-6">Available Tokenized Bonds</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bonds.map(bond => (
          <BondListItem 
            key={bond.id} 
            bond={bond} 
            onSelectBond={onSelectBond}
            currency={currency}
            exchangeRate={exchangeRate}
          />
        ))}
      </div>
    </div>
  );
};

export default BondList;
