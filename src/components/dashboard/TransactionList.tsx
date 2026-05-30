'use client';
import { ArrowUpRight, ArrowDownLeft, Zap, ArrowLeftRight } from 'lucide-react';
import { Transaction } from '@/types';
import { cn, formatRelativeTime } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

const txConfig = {
  earn: { icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Earned', sign: '+' },
  spend: { icon: ArrowDownLeft, color: 'text-red-500', bg: 'bg-red-50', label: 'Spent', sign: '' },
  mint: { icon: Zap, color: 'text-violet-600', bg: 'bg-violet-50', label: 'Minted', sign: '' },
  transfer: { icon: ArrowLeftRight, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Transfer', sign: '' },
};

export function TransactionList({ transactions, limit }: TransactionListProps) {
  const items = limit ? transactions.slice(0, limit) : transactions;

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-4xl mb-2">🪙</p>
        <p className="text-sm text-gray-500">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map(tx => {
        const config = txConfig[tx.type];
        const Icon = config.icon;
        const isPositive = tx.amount > 0;
        return (
          <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
            <div className={cn('p-2 rounded-xl flex-shrink-0', config.bg)}>
              <Icon className={cn('w-4 h-4', config.color)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{tx.description}</p>
              <p className="text-xs text-gray-400">{formatRelativeTime(tx.timestamp)}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={cn('text-sm font-bold', isPositive ? 'text-emerald-600' : 'text-red-500')}>
                {isPositive ? '+' : ''}{tx.amount} SVT
              </p>
              {tx.txHash && (
                <a
                  href={`https://etherscan.io/tx/${tx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {tx.txHash.slice(0, 8)}...
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
