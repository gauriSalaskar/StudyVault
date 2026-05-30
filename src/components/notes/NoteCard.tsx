'use client';
import { useState } from 'react';
import { Download, Heart, Eye, FileText, Crown, Sparkles, Lock } from 'lucide-react';
import { Note } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { cn, getSubjectColor, getFileIcon, formatRelativeTime, formatTokens } from '@/lib/utils';
import { showToast } from '@/components/ui/toast';
import { useAppStore } from '@/store/appStore';

interface NoteCardProps {
  note: Note;
  onView?: (note: Note) => void;
  onDownload?: (note: Note) => void;
  compact?: boolean;
}

export function NoteCard({ note, onView, onDownload, compact }: NoteCardProps) {
  const [liked, setLiked] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { user, updateTokenBalance, isAuthenticated } = useAppStore();

  const handleDownload = async () => {
    if (!isAuthenticated) {
      showToast.warning('Please login to download notes');
      return;
    }
    if (!note.isFree && note.price > 0 && (user?.tokenBalance || 0) < note.price) {
      showToast.error(`Insufficient SVT tokens. Need ${note.price} SVT.`);
      return;
    }
    setDownloading(true);
    await new Promise(r => setTimeout(r, 1200));
    if (!note.isFree && note.price > 0) {
      updateTokenBalance(-note.price);
    }
    setDownloading(false);
    showToast.success(`Downloaded: ${note.title}`);
    onDownload?.(note);
  };

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) showToast.success('Added to favourites!');
  };

  return (
    <div className={cn(
      'group bg-white rounded-2xl border border-gray-100 shadow-sm card-hover overflow-hidden flex flex-col',
      note.isNFT && 'nft-glow border-amber-200'
    )}>
      {/* Thumbnail */}
      {!compact && (
        <div className="relative overflow-hidden h-40 bg-gradient-to-br from-indigo-50 to-violet-50 flex-shrink-0">
          {note.thumbnail ? (
            <img src={note.thumbnail} alt={note.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-40">{getFileIcon(note.fileType)}</span>
            </div>
          )}
          {/* Overlay badges */}
          <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
            {note.isNFT && (
              <Badge variant="premium" className="gap-1 text-xs shadow-sm">
                <Crown className="w-3 h-3" /> NFT
              </Badge>
            )}
            {note.isFree && (
              <Badge variant="free" className="text-xs shadow-sm">Free</Badge>
            )}
            {note.aiSummary && (
              <Badge className="gap-1 text-xs bg-purple-100 text-purple-700 shadow-sm">
                <Sparkles className="w-3 h-3" /> AI
              </Badge>
            )}
          </div>
          <button
            onClick={handleLike}
            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Heart className={cn('w-4 h-4', liked ? 'fill-red-500 text-red-500' : 'text-gray-400')} />
          </button>
          {!note.isFree && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
              <Lock className="w-4 h-4 text-white mr-1" />
              <span className="text-xs text-white font-medium">Premium Content</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Subject + university */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getSubjectColor(note.subject))}>
            {note.subject}
          </span>
          <span className="text-xs text-gray-400">{note.university}</span>
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-gray-900 text-sm line-clamp-2 leading-snug">{note.title}</h3>

        {!compact && (
          <p className="text-xs text-gray-500 line-clamp-2">{note.description}</p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
          <span className="flex items-center gap-1">
            <span>{getFileIcon(note.fileType)}</span>
            {note.fileType.toUpperCase()} • {note.fileSize}
          </span>
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {note.downloads.toLocaleString()}
          </span>
        </div>

        <StarRating rating={note.rating} count={note.ratingCount} />

        {/* Tags */}
        {!compact && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {note.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">#{tag}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div>
            {note.isFree ? (
              <span className="text-sm font-bold text-emerald-600">Free</span>
            ) : (
              <span className="text-sm font-bold text-indigo-700">🪙 {formatTokens(note.price)} SVT</span>
            )}
            <p className="text-xs text-gray-400">{formatRelativeTime(note.uploadedAt)}</p>
          </div>
          <div className="flex gap-1.5">
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-2 border-gray-200 text-gray-600"
              onClick={() => onView?.(note)}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={handleDownload}
              isLoading={downloading}
              className="h-8 px-3 text-xs"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              {note.isFree ? 'Download' : 'Buy'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
