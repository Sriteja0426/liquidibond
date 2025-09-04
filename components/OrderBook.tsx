import React from 'react';
import { Order, Currency } from '../types';
import { formatCurrency } from '../utils/currency';

interface OrderBookProps {
  bids: Order[];
  asks: Order[];
  currency: Currency;
  exchangeRate: number;
}

const OrderBookTable: React.FC<{ orders: Order[]; isBid: boolean; currency: Currency; exchangeRate: number; }> = ({ orders, isBid, currency, exchangeRate }) => {
    const headerColor = isBid ? 'text-brand-success' : 'text-brand-danger';
    const textColor = isBid ? 'text-green-400' : 'text-red-400';

    const sortedOrders = isBid ? [...orders].sort((a,b) => b.price - a.price) : [...orders].sort((a,b) => a.price - b.price);
    const cumulativeOrders = sortedOrders.reduce((acc, order, index) => {
        const total = (index > 0 ? acc[index - 1].total : 0) + order.amount;
        acc.push({ ...order, total });
        return acc;
    }, [] as (Order & {total: number})[]);
    
    const maxTotal = cumulativeOrders[cumulativeOrders.length-1]?.total || 0;

    return (
        <div className="w-full">
            <h3 className={`text-xl font-bold mb-2 ${headerColor}`}>{isBid ? 'Bids' : 'Asks'}</h3>
            <div className="overflow-y-auto h-80 pr-2">
                <table className="w-full text-sm text-left">
                    <thead className="sticky top-0 bg-brand-surface">
                        <tr>
                            <th className="font-medium text-brand-text-secondary py-2">Price ({currency})</th>
                            <th className="font-medium text-brand-text-secondary py-2 text-right">Amount (LBT)</th>
                            <th className="font-medium text-brand-text-secondary py-2 text-right">Total (LBT)</th>
                        </tr>
                    </thead>
                    <tbody className="relative">
                        {cumulativeOrders.map(order => (
                             <tr key={order.id} className="border-b border-brand-border/50 relative z-0">
                                <td className={`py-1 font-mono ${textColor}`}>{formatCurrency(order.price * exchangeRate, currency)}</td>
                                <td className="py-1 font-mono text-right">{order.amount.toFixed(2)}</td>
                                <td className="py-1 font-mono text-right">{order.total.toFixed(2)}</td>
                                <td className="absolute top-0 right-0 h-full p-0 -z-10">
                                    <div 
                                        className={`h-full ${isBid ? 'bg-green-500/10' : 'bg-red-500/10'}`}
                                        style={{ width: `${(order.total / maxTotal) * 100}%`}}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const OrderBook: React.FC<OrderBookProps> = ({ bids, asks, currency, exchangeRate }) => {
  return (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Order Book</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <OrderBookTable orders={bids} isBid={true} currency={currency} exchangeRate={exchangeRate} />
         <OrderBookTable orders={asks} isBid={false} currency={currency} exchangeRate={exchangeRate} />
      </div>
    </div>
  );
};

export default OrderBook;
