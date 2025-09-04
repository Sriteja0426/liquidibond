import React, { useState } from 'react';
import { XIcon, UploadIcon, VerifiedIcon } from './IconComponents';

interface KYCModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const KYCModal: React.FC<KYCModalProps> = ({ onClose, onSuccess }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fileName) return;

        setIsUploading(true);
        await new Promise(res => setTimeout(res, 1000)); // Simulate upload
        setIsUploading(false);

        setIsVerifying(true);
        await new Promise(res => setTimeout(res, 2000)); // Simulate verification
        setIsVerifying(false);
        
        setIsVerified(true);
        await new Promise(res => setTimeout(res, 1500));
        onSuccess();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface rounded-lg shadow-xl p-8 w-full max-w-md border border-brand-border relative text-center">
                <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text-primary disabled:opacity-50" disabled={isUploading || isVerifying || isVerified}>
                    <XIcon />
                </button>
                
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand-primary/10 mb-4">
                   {isVerified ? <VerifiedIcon /> : <UploadIcon />}
                </div>

                <h2 className="text-2xl font-bold mb-2">Investor Verification</h2>
                <p className="text-brand-text-secondary mb-6">To comply with regulations, please upload a government-issued ID.</p>
                
                {isVerified ? (
                    <div className="text-center space-y-4">
                        <p className="text-lg text-brand-success font-semibold">Verification Successful!</p>
                        <p className="text-brand-text-secondary">Redirecting you to the dashboard...</p>
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
                    </div>
                ) : isVerifying ? (
                    <div className="text-center space-y-4">
                        <p className="text-lg text-brand-primary font-semibold">Verifying Document...</p>
                        <p className="text-brand-text-secondary">This may take a moment.</p>
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
                    </div>
                ) : isUploading ? (
                     <div className="text-center space-y-4">
                        <p className="text-lg text-brand-primary font-semibold">Uploading...</p>
                        <p className="text-brand-text-secondary">{fileName}</p>
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-brand-background border-2 border-dashed border-brand-border rounded-lg p-6 flex flex-col items-center justify-center hover:border-brand-primary transition-colors">
                                <UploadIcon />
                                <span className="mt-2 block text-sm font-medium text-brand-text-primary">
                                    {fileName ? fileName : 'Upload a file'}
                                </span>
                                <span className="text-xs text-brand-text-secondary">PNG, JPG, PDF up to 10MB</span>
                            </label>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".png,.jpg,.jpeg,.pdf"/>
                        </div>
                        <button type="submit" disabled={!fileName} className="w-full py-2 px-4 rounded-md shadow-sm font-medium text-white bg-brand-primary hover:bg-brand-secondary transition-colors disabled:bg-brand-border disabled:cursor-not-allowed">
                            Submit for Verification
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
};

export default KYCModal;
