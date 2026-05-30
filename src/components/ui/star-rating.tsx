'use client';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({ rating, count, size = 'sm', interactive, onRate }: StarRatingProps) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizes[size],
              'transition-colors',
              star <= Math.round(rating) ? 'star-filled fill-amber-400 text-amber-400' : 'star-empty text-gray-200',
              interactive && 'cursor-pointer hover:text-amber-400 hover:fill-amber-400'
            )}
            onClick={() => interactive && onRate?.(star)}
          />
        ))}
      </div>
      <span className={cn(textSizes[size], 'font-semibold text-gray-700')}>{rating.toFixed(1)}</span>
      {count !== undefined && (
        <span className={cn(textSizes[size], 'text-gray-400')}>({count.toLocaleString()})</span>
      )}
    </div>
  );
}
