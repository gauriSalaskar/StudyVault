'use client';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'indigo' | 'violet' | 'emerald' | 'amber' | 'rose' | 'cyan';
  gradient?: boolean;
}

const colorMap = {
  indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-100 text-indigo-600', text: 'text-indigo-600', border: 'border-indigo-100' },
  violet: { bg: 'bg-violet-50', icon: 'bg-violet-100 text-violet-600', text: 'text-violet-600', border: 'border-violet-100' },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-600', border: 'border-emerald-100' },
  amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-600', border: 'border-amber-100' },
  rose: { bg: 'bg-rose-50', icon: 'bg-rose-100 text-rose-600', text: 'text-rose-600', border: 'border-rose-100' },
  cyan: { bg: 'bg-cyan-50', icon: 'bg-cyan-100 text-cyan-600', text: 'text-cyan-600', border: 'border-cyan-100' },
};

export function StatsCard({ title, value, subtitle, icon, trend, color = 'indigo', gradient }: StatsCardProps) {
  const colors = colorMap[color];
  return (
    <div className={cn(
      'rounded-2xl border p-5 card-hover',
      gradient
        ? 'bg-gradient-to-br from-indigo-600 to-violet-700 border-indigo-500 text-white'
        : `bg-white ${colors.border}`
    )}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={cn('text-xs font-semibold uppercase tracking-wider', gradient ? 'text-indigo-200' : 'text-gray-500')}>
            {title}
          </p>
        </div>
        <div className={cn('p-2.5 rounded-xl', gradient ? 'bg-white/20' : colors.icon)}>
          {icon}
        </div>
      </div>
      <p className={cn('font-display text-3xl font-bold', gradient ? 'text-white' : 'text-gray-900')}>
        {value}
      </p>
      {subtitle && (
        <p className={cn('text-xs mt-1', gradient ? 'text-indigo-200' : 'text-gray-500')}>{subtitle}</p>
      )}
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          {trend.value >= 0
            ? <TrendingUp className={cn('w-3.5 h-3.5', gradient ? 'text-emerald-300' : 'text-emerald-500')} />
            : <TrendingDown className="w-3.5 h-3.5 text-red-400" />
          }
          <span className={cn('text-xs font-medium', gradient ? 'text-emerald-200' : trend.value >= 0 ? 'text-emerald-600' : 'text-red-500')}>
            {trend.value >= 0 ? '+' : ''}{trend.value}% {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}
