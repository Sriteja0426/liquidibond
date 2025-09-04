import React, { useState } from 'react';
import { OrderType, Currency } from '../types';

interface OrderFormProps {
  type: OrderType;
  onSubmit: (price: number, amount: number) => void;
  currency: Currency;
}

const OrderForm: React.FC<OrderFormProps> = ({ type, onSubmit, currency }) => {
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState('');

  const isBid = type === OrderType.BID;
  const title = isBid ? 'Buy LBT' : 'Sell LBT';
  const buttonClass = isBid
    ? 'bg-brand-success hover:bg-green-600'
    : 'bg-brand-danger hover:bg-red-600';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    const amountNum = parseFloat(amount);
    if (!isNaN(priceNum) && !isNaN(amountNum) && priceNum > 0 && amountNum > 0) {
      // NOTE: We submit the price in USD, the parent component handles conversion if needed.
      // For simplicity, this form assumes the user enters the price in the displayed currency,
      // but for a real app, you'd convert it back to a base currency like USD here.
      // For this prototype, we'll assume the input maps 1:1 to the base rate.
      onSubmit(priceNum, amountNum);
      setPrice('');
      setAmount('');
    }
  };

  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={`price-${type}`} className="block text-sm font-medium text-brand-text-secondary">Price ({currency})</label>
          <input
            id={`price-${type}`}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            step="0.01"
            className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor={`amount-${type}`} className="block text-sm font-medium text-brand-text-secondary">Amount (LBT)</label>
          <input
            id={`amount-${type}`}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${buttonClass} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface`}
        >
          {title}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
