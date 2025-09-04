import React from 'react';
import { XIcon, AlertTriangleIcon } from './IconComponents';

interface PortfolioWarningModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const PortfolioWarningModal: React.FC<PortfolioWarningModalProps> = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface rounded-lg shadow-xl p-8 w-full max-w-md border border-brand-border relative text-center">
                 <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text-primary">
                    <XIcon />
                </button>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-500/10 mb-4">
                   <AlertTriangleIcon className="text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Portfolio Concentration Warning</h2>
                <p className="text-brand-text-secondary mb-6">This trade will result in over 20% of your portfolio being allocated to a single bond. This exceeds the recommended diversification limits.</p>

                <div className="flex space-x-4">
                    <button onClick={onClose} className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium bg-brand-border text-brand-text-primary hover:bg-brand-border/70 transition-colors">
                        Cancel Trade
                    </button>
                    <button onClick={onConfirm} className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-brand-danger hover:bg-red-600 transition-colors">
                        Acknowledge & Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortfolioWarningModal;
