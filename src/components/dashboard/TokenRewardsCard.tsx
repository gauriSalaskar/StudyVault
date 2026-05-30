'use client';
import { useState } from 'react';
import { Coins, TrendingUp, Gift, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/ui/toast';
import { useAppStore } from '@/store/appStore';
import { formatTokens } from '@/lib/utils';
import { cn } from '@/lib/utils';

const REWARD_TIERS = [
  { threshold: 500, label: 'Bronze Scholar', icon: '🥉', color: 'text-amber-600', bg: 'bg-amber-50' },
  { threshold: 1000, label: 'Silver Scholar', icon: '🥈', color: 'text-gray-500', bg: 'bg-gray-50' },
  { threshold: 2500, label: 'Gold Scholar', icon: '🥇', color: 'text-amber-500', bg: 'bg-amber-50' },
  { threshold: 5000, label: 'Platinum Scholar', icon: '💎', color: 'text-violet-600', bg: 'bg-violet-50' },
  { threshold: 10000, label: 'Diamond Scholar', icon: '🔮', color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

export function TokenRewardsCard() {
  const { user, updateTokenBalance } = useAppStore();
  const [claiming, setClaiming] = useState(false);
  const balance = user?.tokenBalance || 0;

  const currentTier = REWARD_TIERS.reduce((acc, tier) => (balance >= tier.threshold ? tier : acc), REWARD_TIERS[0]);
  const nextTier = REWARD_TIERS.find(t => t.threshold > balance);
  const progress = nextTier
    ? Math.min(100, ((balance - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100)
    : 100;

  const handleClaimDaily = async () => {
    setClaiming(true);
    await new Promise(r => setTimeout(r, 1200));
    updateTokenBalance(10);
    showToast.token(10, 'Daily login bonus claimed!');
    setClaiming(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-indigo-200" />
            <span className="text-sm font-semibold text-indigo-200">SVT Token Wallet</span>
          </div>
          <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold', currentTier.bg, currentTier.color)}>
            <span>{currentTier.icon}</span>
            <span>{currentTier.label}</span>
          </div>
        </div>
        <div className="font-display text-4xl font-black text-white mb-1">
          🪙 {formatTokens(balance)}
        </div>
        <p className="text-indigo-300 text-sm">StudyVault Tokens</p>

        {/* Progress to next tier */}
        {nextTier && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-indigo-300 mb-1.5">
              <span>Progress to {nextTier.icon} {nextTier.label}</span>
              <span>{formatTokens(nextTier.threshold - balance)} SVT to go</span>
            </div>
            <div className="h-1.5 bg-indigo-500/40 rounded-full overflow-hidden">
              <div className="h-full bg-white/60 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        {/* Earning breakdown */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Earning Breakdown</p>
          {[
            { label: 'Upload Rewards', amount: 850, pct: 68, color: '#6366f1' },
            { label: 'Download Royalties', amount: 300, pct: 24, color: '#8b5cf6' },
            { label: 'Rating Bonuses', amount: 100, pct: 8, color: '#06b6d4' },
          ].map(item => (
            <div key={item.label} className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">{item.label}</span>
                <span className="font-semibold text-gray-700">{formatTokens(item.amount)} SVT</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 text-xs"
            onClick={handleClaimDaily}
            isLoading={claiming}
          >
            <Gift className="w-3.5 h-3.5" /> Daily Bonus
          </Button>
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => window.location.href = '/upload'}>
            <TrendingUp className="w-3.5 h-3.5" /> Earn More
          </Button>
        </div>

        {/* How to earn */}
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 mb-2">How to earn SVT</p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { action: 'Upload notes', reward: '+50 SVT' },
              { action: 'Per download', reward: '+5-20 SVT' },
              { action: 'Mint NFT', reward: '+25 SVT' },
              { action: 'Rating bonus', reward: '+5 SVT' },
            ].map(item => (
              <div key={item.action} className="flex items-center justify-between bg-gray-50 rounded-lg px-2 py-1.5">
                <span className="text-xs text-gray-500">{item.action}</span>
                <span className="text-xs font-bold text-indigo-600">{item.reward}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
