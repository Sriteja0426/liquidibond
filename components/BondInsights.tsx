import React, { useState, useEffect } from 'react';
import { Bond, BondAnalysis } from '../types';
import { SparklesIcon } from './IconComponents';

interface BondInsightsProps {
    bond: Bond;
}

const useBondAnalysis = (bond: Bond | null) => {
    const [analysis, setAnalysis] = useState<BondAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!bond) return;

        const fetchAnalysis = async () => {
            setIsLoading(true);
            setError(null);
            setAnalysis(null);
            try {
                // Simulate an API call to a generative AI model like Gemini
                await new Promise(resolve => setTimeout(resolve, 1500));

                // This is where you would format the request for the Gemini API
                // const prompt = `Analyze the following corporate bond and provide a fair value estimation, a credit risk score, a brief risk summary, and a yield prediction. Bond data: ${JSON.stringify(bond)}`;
                // const result = await ai.models.generateContent(prompt);
                
                // For the prototype, we generate a mock response based on bond data
                const mockResponse: BondAnalysis = {
                    fairValue: bond.couponRate > 5 ? 101.50 + (bond.symbol.charCodeAt(0) % 5) : 98.50 - (bond.symbol.charCodeAt(0) % 3),
                    creditScore: bond.initialRating.includes('AA') ? 'AA' : (bond.initialRating.includes('A') ? 'A+' : 'BBB'),
                    riskSummary: `Based on ${bond.issuer}'s stable market position and a coupon rate of ${bond.couponRate}%, this bond demonstrates low historical volatility. The primary risk factor is sensitivity to macroeconomic interest rate changes. Our model suggests a stable outlook given current market conditions.`,
                    yieldPrediction: bond.couponRate + 0.35 + (bond.totalSupply % 1000) / 2000,
                };

                setAnalysis(mockResponse);

            } catch (err) {
                setError("Failed to fetch AI analysis. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();
    }, [bond]);

    return { analysis, isLoading, error };
};


const InsightCard: React.FC<{ title: string, value: string | number, unit?: string, isHighlighted?: boolean }> = ({ title, value, unit, isHighlighted }) => (
    <div className={`bg-brand-background p-4 rounded-lg border ${isHighlighted ? 'border-brand-primary/50' : 'border-brand-border'}`}>
        <p className="text-sm text-brand-text-secondary">{title}</p>
        <p className={`text-2xl font-bold ${isHighlighted ? 'text-brand-primary' : 'text-brand-text-primary'}`}>
            {typeof value === 'number' ? value.toFixed(2) : value}
            {unit && <span className="text-lg ml-1">{unit}</span>}
        </p>
    </div>
);


const BondInsights: React.FC<BondInsightsProps> = ({ bond }) => {
    const { analysis, isLoading, error } = useBondAnalysis(bond);

    if (isLoading) {
        return (
            <div className="bg-brand-surface border border-brand-border rounded-lg p-8 flex flex-col items-center justify-center min-h-[300px]">
                <SparklesIcon />
                <p className="text-xl font-semibold mt-4 text-brand-primary">Generating AI Insights...</p>
                <p className="text-brand-text-secondary mt-1">Analyzing market data for {bond.symbol}.</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-brand-surface border border-brand-border rounded-lg p-8 text-center">
                 <p className="text-red-400">{error}</p>
            </div>
        );
    }

    if (!analysis) return null;

    return (
        <div className="bg-brand-surface border border-brand-border rounded-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold flex items-center"><SparklesIcon/> <span className="ml-2">AI-Powered Bond Insights</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <InsightCard title="AI Fair Value Est." value={analysis.fairValue} unit="USD" isHighlighted />
                <InsightCard title="AI Credit Score" value={analysis.creditScore} />
                <InsightCard title="Predicted Yield" value={analysis.yieldPrediction} unit="%" />
                <InsightCard title="Maturity" value={bond.maturityDate} />
            </div>
            <div>
                 <h3 className="text-lg font-semibold mb-2 text-brand-text-primary">AI Risk Summary</h3>
                 <p className="text-brand-text-secondary bg-brand-background p-4 rounded-lg border border-brand-border">{analysis.riskSummary}</p>
            </div>
            <p className="text-xs text-brand-text-secondary/70 text-center pt-4">Disclaimer: This analysis is AI-generated for illustrative purposes only and does not constitute financial advice.</p>
        </div>
    );
};

export default BondInsights;
