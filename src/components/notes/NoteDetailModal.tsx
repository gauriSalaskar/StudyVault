'use client';
import { useState } from 'react';
import { X, Download, Crown, Sparkles, FileText, User, Calendar, Star, Tag, Brain, ChevronRight, Lock } from 'lucide-react';
import { Note } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { cn, getSubjectColor, getFileIcon, formatRelativeTime, formatTokens } from '@/lib/utils';
import { showToast } from '@/components/ui/toast';
import { useAppStore } from '@/store/appStore';

interface NoteDetailModalProps {
  note: Note | null;
  onClose: () => void;
}

export function NoteDetailModal({ note, onClose }: NoteDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'summary' | 'preview'>('overview');
  const [purchasing, setPurchasing] = useState(false);
  const { user, updateTokenBalance, isAuthenticated } = useAppStore();

  if (!note) return null;

  const canAfford = (user?.tokenBalance || 0) >= note.price;

  const handlePurchase = async () => {
    if (!isAuthenticated) { showToast.warning('Please login first'); return; }
    if (!canAfford && !note.isFree) { showToast.error('Need ' + note.price + ' SVT tokens'); return; }
    setPurchasing(true);
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('purchases').insert({
          id: 'purchase_' + Date.now(),
          user_id: session.user.id,
          note_id: note.id,
        });
        await supabase.from('notes').update({ downloads: note.downloads + 1 }).eq('id', note.id);
      }
      if (!note.isFree) updateTokenBalance(-note.price);
      const fileUrl = note.ipfsHash?.startsWith('http') ? note.ipfsHash : null;
      if (fileUrl) {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = note.title;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      showToast.success('Downloaded: ' + note.title);
      onClose();
    } catch (err) {
      showToast.error('Download failed. Please try again.');
    }
    setPurchasing(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'summary', label: '✨ AI Summary' },
    { id: 'preview', label: 'Preview' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn('relative p-6 pb-4', note.isNFT ? 'bg-gradient-to-br from-amber-50 to-orange-50' : 'bg-gradient-to-br from-indigo-50 to-violet-50')}>
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl bg-white/80 hover:bg-white text-gray-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="flex gap-2 mb-3 flex-wrap">
            <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', getSubjectColor(note.subject))}>{note.subject}</span>
            {note.isNFT && <Badge variant="premium"><Crown className="w-3 h-3 mr-1" />NFT</Badge>}
            {note.isFree && <Badge variant="free">Free</Badge>}
            {note.aiSummary && <Badge className="bg-purple-100 text-purple-700"><Sparkles className="w-3 h-3 mr-1" />AI Enhanced</Badge>}
          </div>
          <h2 className="font-display text-xl font-bold text-gray-900 pr-8">{note.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{note.description}</p>
          <div className="flex items-center gap-4 mt-3">
            <StarRating rating={note.rating} count={note.ratingCount} size="md" />
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <Download className="w-3.5 h-3.5" />{note.downloads.toLocaleString()} downloads
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: FileText, label: 'File Type', value: `${note.fileType.toUpperCase()} • ${note.fileSize}` },
                  { icon: User, label: 'Uploaded by', value: note.uploaderName },
                  { icon: Calendar, label: 'Uploaded', value: formatRelativeTime(note.uploadedAt) },
                  { icon: Star, label: 'Rating', value: `${note.rating}/5 (${note.ratingCount} reviews)` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Icon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm font-medium text-gray-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
              {note.isNFT && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1"><Crown className="w-3 h-3" />NFT Details</p>
                  <p className="text-xs text-amber-600">Token ID: #{note.nftTokenId} • Blockchain verified ownership</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'summary' && (
            <div className="space-y-4">
              {note.aiSummary ? (
                <>
                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-xl">
                    <Brain className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-xs font-semibold text-purple-700">AI-Generated Summary</p>
                      <p className="text-xs text-purple-500">Powered by Gemini AI</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">{note.aiSummary}</p>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Topics</p>
                    <div className="space-y-1.5">
                      {['Core concepts explained with clarity', 'Worked examples and practice problems', 'Visual diagrams for complex topics', 'Exam-focused summaries'].map((point, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <ChevronRight className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <Sparkles className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No AI summary available for this note yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-64 flex items-center justify-center">
                {note.isFree ? (
                  <div className="text-center">
                    <span className="text-6xl">{getFileIcon(note.fileType)}</span>
                    <p className="text-sm text-gray-500 mt-3">Preview available after download</p>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <Lock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-medium text-gray-700">Premium Content</p>
                    <p className="text-xs text-gray-400 mt-1">Purchase to unlock full preview</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 text-center">IPFS Hash: <span className="font-mono text-indigo-600 text-xs">{note.ipfsHash.slice(0, 20)}...</span></p>
            </div>
          )}
        </div>

        {/* Purchase footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
          <div>
            {note.isFree ? (
              <span className="text-lg font-bold text-emerald-600">Free Download</span>
            ) : (
              <>
                <span className="text-xl font-bold text-indigo-700">🪙 {formatTokens(note.price)} SVT</span>
                {user && <p className="text-xs text-gray-400">Your balance: {formatTokens(user.tokenBalance)} SVT</p>}
              </>
            )}
          </div>
          <Button
            onClick={handlePurchase}
            isLoading={purchasing}
            variant={note.isNFT ? 'nft' : 'default'}
            className="gap-2"
            disabled={!isAuthenticated || (!note.isFree && !canAfford)}
          >
            <Download className="w-4 h-4" />
            {note.isFree ? 'Download Free' : `Buy for ${note.price} SVT`}
          </Button>
        </div>
      </div>
    </div>
  );
}