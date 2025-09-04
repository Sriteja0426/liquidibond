import React, { useState } from 'react';
import { XIcon } from './IconComponents';

interface TwoFactorAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ onClose, onSuccess }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // Mock OTP check. In a real app, this would be a server-side check.
        if (otp === '123456') {
            onSuccess();
        } else {
            setError('Invalid OTP. Please try again.');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface rounded-lg shadow-xl p-8 w-full max-w-sm border border-brand-border relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text-primary">
                    <XIcon />
                </button>
                <h2 className="text-2xl font-bold mb-2 text-center">Two-Factor Authentication</h2>
                <p className="text-brand-text-secondary mb-6 text-center">For your security, please enter the code sent to your device.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-brand-text-secondary text-center">Enter 6-digit code</label>
                        <input
                            id="otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            maxLength={6}
                            placeholder="- - - - - -"
                            className="mt-1 block w-full bg-brand-background border border-brand-border rounded-md shadow-sm py-2 px-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-brand-primary focus:border-brand-primary"
                        />
                    </div>
                    {error && <p className="text-sm text-brand-danger text-center">{error}</p>}
                    <button type="submit" className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary transition-colors">
                        Verify & Complete Trade
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TwoFactorAuthModal;
