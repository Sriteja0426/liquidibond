import React from 'react';

interface RoadmapItemProps {
    phase: string;
    title: string;
    description: string[];
    status: 'complete' | 'inprogress' | 'planned';
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ phase, title, description, status }) => {
    const statusClasses = {
        complete: {
            bg: 'bg-brand-success',
            text: 'text-brand-success',
            border: 'border-brand-success',
        },
        inprogress: {
            bg: 'bg-brand-primary',
            text: 'text-brand-primary',
            border: 'border-brand-primary',
        },
        planned: {
            bg: 'bg-brand-text-secondary',
            text: 'text-brand-text-secondary',
            border: 'border-brand-border',
        }
    };
    const currentStatus = statusClasses[status];

    return (
        <div className="flex items-start space-x-6">
            {/* Timeline */}
            <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full ${currentStatus.bg}/20 border-2 ${currentStatus.border} flex items-center justify-center`}>
                    <div className={`w-3 h-3 rounded-full ${currentStatus.bg}`}></div>
                </div>
                <div className="w-px h-full bg-brand-border"></div>
            </div>

            {/* Content */}
            <div className="pb-12">
                <p className={`font-bold text-sm ${currentStatus.text}`}>{phase}</p>
                <h3 className="text-xl font-bold text-brand-text-primary mt-1">{title}</h3>
                <ul className="list-disc list-inside text-brand-text-secondary mt-2 space-y-1">
                    {description.map((point, idx) => (
                        <li key={idx}>{point}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const Roadmap: React.FC = () => {
    const roadmapData: RoadmapItemProps[] = [
        { 
            phase: 'Phase 1', 
            title: 'Prototype Enhancement', 
            description: [
                'Improve marketplace UI and simulated order book',
                'Integrate basic KYC flow',
                'Add sample compliance reports',
                'Build static AI insights (risk summaries)'
            ], 
            status: 'complete' 
        },
        { 
            phase: 'Phase 2', 
            title: 'MVP Development', 
            description: [
                'Deploy tokenized bonds on test blockchain',
                'Enable real trades with test INR wallets',
                'Automate KYC verification + risk profiling',
                'Expand regulator dashboard with live monitoring'
            ], 
            status: 'inprogress' 
        },
        { 
            phase: 'Phase 3', 
            title: 'Pilot with Institutions', 
            description: [
                'Partner with NBFC / fintech sandbox',
                'Onboard select retail investors with fractional bonds',
                'Simulate UPI integration for deposits/withdrawals',
                'Add AI-driven bond scoring and fraud detection'
            ], 
            status: 'planned' 
        },
        { 
            phase: 'Phase 4', 
            title: 'Scale & Compliance Alignment', 
            description: [
                'Work with SEBI sandbox for approvals',
                'Launch full-scale marketplace',
                'Expand to corporate, municipal, and govt bonds',
                'Introduce gamified rewards & governance'
            ], 
            status: 'planned' 
        }
    ];

    return (
        <div>
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-brand-text-primary mb-2">Future Vision & Roadmap</h2>
                <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">
                    Our step-by-step journey to build a compliant, liquid, and transparent bond marketplace.
                </p>
            </div>
            <div className="max-w-3xl mx-auto">
                {roadmapData.map(item => <RoadmapItem key={item.title} {...item} />)}
            </div>
        </div>
    );
};

export default Roadmap;
