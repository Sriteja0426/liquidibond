import React, { useState } from 'react';
import { RiskProfile } from '../types';
import { XIcon } from './IconComponents';

interface SuitabilityQuestionnaireProps {
  onClose: () => void;
  onComplete: (profile: RiskProfile) => void;
}

const questions = [
  {
    question: "What is your primary investment goal?",
    options: ["Capital Preservation", "Income Generation", "Wealth Growth", "Aggressive Growth"],
    weights: { Conservative: 3, Moderate: 2, Aggressive: 1 }
  },
  {
    question: "How would you react to a 20% drop in your portfolio's value in a short period?",
    options: ["Sell all investments", "Sell some investments", "Hold and wait", "Buy more"],
    weights: { Conservative: 4, Moderate: 2, Aggressive: 0 }
  },
  {
    question: "What percentage of your income are you comfortable investing?",
    options: ["Less than 10%", "10% - 25%", "25% - 50%", "More than 50%"],
    weights: { Conservative: 1, Moderate: 2, Aggressive: 3 }
  }
];

const SuitabilityQuestionnaire: React.FC<SuitabilityQuestionnaireProps> = ({ onClose, onComplete }) => {
    const [answers, setAnswers] = useState<{[key: number]: number}>({});
    const [step, setStep] = useState(0);

    const handleSelectOption = (questionIndex: number, optionIndex: number) => {
        setAnswers(prev => ({...prev, [questionIndex]: optionIndex}));
        setTimeout(() => {
             if (step < questions.length - 1) {
                setStep(step + 1);
            } else {
                calculateProfile();
            }
        }, 300);
    };

    const calculateProfile = () => {
        const score = questions.reduce((total, q, i) => {
            const answerIndex = answers[i] ?? 0;
            const option = q.options[answerIndex];
            if (option.includes("Sell")) return total + q.weights.Conservative;
            if (option.includes("Growth")) return total + q.weights.Aggressive;
            return total + q.weights.Moderate;
        }, 0);

        let profile: RiskProfile = 'Conservative';
        if (score > 6) {
            profile = 'Aggressive';
        } else if (score > 3) {
            profile = 'Moderate';
        }
        onComplete(profile);
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-brand-surface rounded-lg shadow-xl p-8 w-full max-w-lg border border-brand-border relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text-primary">
                    <XIcon />
                </button>
                <h2 className="text-2xl font-bold mb-2">Investor Suitability Check</h2>
                <p className="text-brand-text-secondary mb-6">Please answer a few questions to help us determine your risk profile.</p>

                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <div key={index} style={{display: step === index ? 'block' : 'none'}}>
                            <p className="font-semibold text-lg mb-4">{index + 1}. {q.question}</p>
                            <div className="space-y-3">
                                {q.options.map((option, optIndex) => (
                                    <button 
                                        key={optIndex} 
                                        onClick={() => handleSelectOption(index, optIndex)}
                                        className="w-full text-left p-3 bg-brand-background border border-brand-border rounded-md hover:bg-brand-primary/20 hover:border-brand-primary transition-colors"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="w-full bg-brand-background rounded-full h-2.5 mt-8">
                    <div className="bg-brand-primary h-2.5 rounded-full" style={{width: `${((step + 1) / questions.length) * 100}%`}}></div>
                </div>

            </div>
        </div>
    );
};

export default SuitabilityQuestionnaire;
