import React from 'react';
import { RoadmapIcon, VerifiedIcon } from './IconComponents';

interface RoadmapItemProps {
    quarter: string;
    title: string;
    description: string;
    status: 'complete' | 'inprogress' | 'planned';
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ quarter, title, description, status }) => {
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
                <p className={`font-bold text-sm ${currentStatus.text}`}>{quarter}</p>
                <h3 className="text-xl font-bold text-brand-text-primary mt-1">{title}</h3>
                <p className="text-brand-text-secondary mt-2">{description}</p>
            </div>
        </div>
    );
};

const Roadmap: React.FC = () => {
    const roadmapData: RoadmapItemProps[] = [
        { quarter: 'Q3 2024', title: 'Platform Launch & Core Features', description: 'Initial prototype with tokenization, order book trading, and AI insights.', status: 'complete' },
        { quarter: 'Q4 2024', title: 'Smart Contract Deployment & Audit', description: 'Deploy audited ERC-20 and Exchange contracts to Ethereum testnet for public testing.', status: 'inprogress' },
        { quarter: 'Q1 2025', title: 'DAO Governance & BOND Token', description: 'Introduce the BOND governance token, allowing the community to vote on platform upgrades and parameters.', status: 'planned' },
        { quarter: 'Q2 2025', title: 'Yield Farming & Advanced DeFi', description: 'Launch advanced yield strategies, including staking BOND tokens and leveraging liquidity pool positions.', status: 'planned' },
        { quarter: 'Q3 2025', title: 'Expansion to New Asset Classes', description: 'Begin research and development for tokenizing other illiquid assets, such as real estate and private equity.', status: 'planned' },
    ];
    return (
        <div>
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-brand-text-primary mb-2">Future Vision & Roadmap</h2>
                <p className="text-lg text-brand-text-secondary max-w-2xl mx-auto">Our journey to build a transparent, liquid, and accessible global market for all debt instruments.</p>
            </div>
            <div className="max-w-3xl mx-auto">
                 {roadmapData.map(item => <RoadmapItem key={item.title} {...item} />)}
            </div>
        </div>
    );
};

export default Roadmap;
