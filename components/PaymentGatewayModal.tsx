import React, { useState } from 'react';
import { XIcon, BanknotesIcon } from './IconComponents';

interface PaymentGatewayModalProps {
  onClose: () => void;
  onPaymentSuccess: (amount: number) => void;
}

const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({ onClose, onPaymentSuccess }) => {
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) return;
        
        setStatus('processing');
        // Simulate API call to payment gateway
        await new Promise(res => setTimeout(res, 2000));

        // Simulate a successful transaction
        if (numAmount > 0) {
            setStatus('success');
            onPaymentSuccess(numAmount);
            await new Promise(res => setTimeout(res, 1500));
            onClose();
        } else {
            setStatus('failed');
        }
    };
    
    const renderContent = () => {
        switch (status) {
            case 'processing':
                return (
                    <div className="text-center space-y-4">
                        <p className="text-lg text-brand-primary font-semibold">Processing Payment...</p>
                        <p className="text-brand-text-secondary">Please approve the transaction on your UPI app.</p>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
                    </div>
                );
            case 'success':
                 return (
                    <div className="text-center space-y-4">
                        <p className="text-lg text-brand-success font-semibold">Payment Successful!</p>
                        <p className="text-brand-text-secondary">${amount} has been added to your USDC balance.</p>
                    </div>
                );
            case 'failed':
                 return (
                    <div className="text-center space-y-4">
                        <p className="text-lg text-brand-danger font-semibold">Payment Failed</p>
                        <p className="text-brand-text-secondary">Please try again.</p>
                        <button onClick={() => setStatus('idle')} className="mt-4 px-4 py-2 text-sm font-medium rounded-md bg-brand-primary text-white">Retry</button>
                    </div>
                );
            case 'idle':
            default:
                return (
                     <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-brand-text-secondary">Amount (USD)</label>
                            <input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount to add"
                                className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                            />
                        </div>
                        <button type="submit" disabled={!amount || parseFloat(amount) <= 0} className="w-full py-2 px-4 rounded-md shadow-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary transition-colors disabled:bg-brand-border disabled:cursor-not-allowed">
                            Proceed to UPI Payment
                        </button>
                    </form>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface rounded-lg shadow-xl p-8 w-full max-w-md border border-brand-border relative text-center">
                 <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text-primary disabled:opacity-50" disabled={status === 'processing'}>
                    <XIcon />
                </button>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary/10 mb-4">
                   <BanknotesIcon />
                </div>
                <h2 className="text-2xl font-bold mb-2">Add Funds</h2>
                <p className="text-brand-text-secondary mb-6">Add USDC to your account using UPI.</p>
                {renderContent()}
            </div>
        </div>
    );
};

export default PaymentGatewayModal;
