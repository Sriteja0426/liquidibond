import React from 'react';
import { GiftIcon } from './IconComponents';

interface RewardsDashboardProps {
  userPoints: number;
}

const MOCK_LEADERBOARD = [
    { rank: 1, address: '0xAlpha...7b3d', points: 15200 },
    { rank: 2, address: '0xBravo...4a1c', points: 12850 },
    { rank: 3, address: '0xCharlie...9f2e', points: 11900 },
    { rank: 4, address: 'You', points: 0, isUser: true }, // Placeholder for user
    { rank: 5, address: '0xDelta...6c8a', points: 9800 },
    { rank: 6, address: '0xEcho...2b5f', points: 8550 },
].sort((a,b) => b.points - a.points);


const BADGES = [
    { name: 'First Trade', description: 'Placed your first order', achieved: true },
    { name: 'Liquidity Provider', description: 'Added liquidity to a pool', achieved: true },
    { name: 'Bond Tokenizer', description: 'Tokenized a new bond', achieved: false },
    { name: 'Volume Mover', description: 'Traded over 10,000 USDC in volume', achieved: true },
    { name: 'Diamond Hands', description: 'Held a bond for over 30 days', achieved: false },
    { name: 'Early Adopter', description: 'Joined in the first month', achieved: true },
];

const RewardsDashboard: React.FC<RewardsDashboardProps> = ({ userPoints }) => {
    
    // Insert user into leaderboard
    const userRankData = { rank: 0, address: 'You', points: userPoints, isUser: true };
    const leaderboardWithUser = [...MOCK_LEADERBOARD.filter(u => !u.isUser), userRankData]
        .sort((a, b) => b.points - a.points)
        .map((user, index) => ({...user, rank: index + 1}));
    const userRank = leaderboardWithUser.find(u => u.isUser)?.rank;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-brand-text-primary mb-2">Rewards & Incentives</h2>
        <p className="text-brand-text-secondary">Earn BondPoints (BP) for participating in the ecosystem. More points unlock future rewards and governance rights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard */}
        <div className="lg:col-span-2 bg-brand-surface border border-brand-border rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4">Leaderboard</h3>
             <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-brand-border">
                        <th className="py-2 font-medium text-brand-text-secondary">Rank</th>
                        <th className="py-2 font-medium text-brand-text-secondary">User</th>
                        <th className="py-2 font-medium text-brand-text-secondary text-right">Points</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboardWithUser.map(user => (
                        <tr key={user.rank} className={`border-b border-brand-border/50 ${user.isUser ? 'bg-brand-primary/10' : ''}`}>
                            <td className="py-3 font-semibold">{user.rank}</td>
                            <td className="py-3 font-mono text-sm">{user.address}</td>
                            <td className={`py-3 font-bold text-right ${user.isUser ? 'text-brand-primary' : 'text-yellow-400'}`}>{user.points.toLocaleString()} BP</td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </div>
        
        {/* Points Summary */}
        <div className="bg-brand-surface border border-brand-border rounded-lg p-6 text-center flex flex-col justify-center">
            <GiftIcon />
            <p className="text-brand-text-secondary mt-4">Your BondPoints</p>
            <p className="text-5xl font-bold text-yellow-400 my-2">{userPoints.toLocaleString()}</p>
            <p className="text-brand-text-secondary">Your Rank: <span className="font-bold text-brand-text-primary">#{userRank}</span></p>
        </div>
      </div>
      
      {/* Badges */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Badges</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {BADGES.map(badge => (
                 <div key={badge.name} className={`bg-brand-surface border border-brand-border rounded-lg p-4 text-center transition-opacity ${!badge.achieved && 'opacity-40'}`}>
                    <div className={`text-4xl mx-auto mb-2 ${badge.achieved ? 'text-brand-primary' : 'text-brand-text-secondary'}`}>
                        {badge.achieved ? '🏆' : '🔒'}
                    </div>
                    <h4 className="font-bold text-sm">{badge.name}</h4>
                    <p className="text-xs text-brand-text-secondary">{badge.description}</p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default RewardsDashboard;
