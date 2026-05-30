'use client';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Crown, Sparkles, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteDetailModal } from '@/components/notes/NoteDetailModal';
import { NoteCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { Note } from '@/types';
import { SUBJECTS } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [subject, setSubject] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showNFTOnly, setShowNFTOnly] = useState(searchParams.get('filter') === 'nft');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (data && !error) {
        const mapped: Note[] = data.map((n: any) => ({
          id: n.id,
          title: n.title,
          description: n.description,
          subject: n.subject,
          university: n.university,
          fileType: n.file_type,
          fileSize: n.file_size,
          ipfsHash: n.file_url || n.ipfs_hash,
          uploadedBy: n.uploaded_by,
          uploaderName: n.uploader_name,
          uploadedAt: n.uploaded_at,
          downloads: n.downloads || 0,
          rating: n.rating || 0,
          ratingCount: n.rating_count || 0,
          tags: n.tags || [],
          isNFT: n.is_nft || false,
          nftTokenId: n.nft_token_id,
          price: n.price || 0,
          isFree: n.is_free ?? true,
          aiSummary: n.ai_summary,
        }));
        setAllNotes(mapped);
      }
      setLoading(false);
    };
    fetchNotes();
  }, []);

  const filtered = useMemo(() => {
    let notes = [...allNotes];
    if (search) notes = notes.filter(n =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
      n.university.toLowerCase().includes(search.toLowerCase())
    );
    if (subject) notes = notes.filter(n => n.subject === subject);
    if (showNFTOnly) notes = notes.filter(n => n.isNFT);
    if (showFreeOnly) notes = notes.filter(n => n.isFree);
    switch (sortBy) {
      case 'rating': notes.sort((a, b) => b.rating - a.rating); break;
      case 'newest': notes.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()); break;
      case 'price_low': notes.sort((a, b) => a.price - b.price); break;
      case 'price_high': notes.sort((a, b) => b.price - a.price); break;
      default: notes.sort((a, b) => b.downloads - a.downloads);
    }
    return notes;
  }, [allNotes, search, subject, sortBy, showNFTOnly, showFreeOnly]);

  const activeFilters = [
    subject && { label: subject, onRemove: () => setSubject('') },
    showNFTOnly && { label: 'NFT Only', onRemove: () => setShowNFTOnly(false) },
    showFreeOnly && { label: 'Free Only', onRemove: () => setShowFreeOnly(false) },
  ].filter(Boolean) as { label: string; onRemove: () => void }[];

  return (
    <DashboardLayout title="Marketplace" subtitle="Discover, buy, and download premium notes">
      <div className="space-y-5">
        {/* Search + Filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                icon={<Search className="w-4 h-4" />}
                placeholder="Search notes, subjects, universities, topics..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select
                className="h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={sortBy} onChange={e => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2 h-10">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="w-5 h-5 bg-indigo-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                    {activeFilters.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-100 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">Subject</label>
                    <select className="w-full h-9 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={subject} onChange={e => setSubject(e.target.value)}>
                      <option value="">All Subjects</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2 justify-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={showNFTOnly} onChange={e => setShowNFTOnly(e.target.checked)}
                        className="w-4 h-4 rounded accent-indigo-600" />
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-gray-700">NFT Notes Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={showFreeOnly} onChange={e => setShowFreeOnly(e.target.checked)}
                        className="w-4 h-4 rounded accent-indigo-600" />
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-gray-700">Free Notes Only</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500">Active filters:</span>
            {activeFilters.map(f => (
              <span key={f.label} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
                {f.label}
                <button onClick={f.onRemove}><X className="w-3 h-3" /></button>
              </span>
            ))}
            <button onClick={() => { setSubject(''); setShowNFTOnly(false); setShowFreeOnly(false); }}
              className="text-xs text-red-500 hover:text-red-700">Clear all</button>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{filtered.length}</span> notes found
          </p>
        </div>

        {/* Notes grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <NoteCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No notes found"
            description="Try different search terms or remove some filters to see more results."
            actionLabel="Clear filters"
            onAction={() => { setSearch(''); setSubject(''); setShowNFTOnly(false); setShowFreeOnly(false); }}
          />
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filtered.map((note, i) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <NoteCard note={note} onView={n => setSelectedNote(n)} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {selectedNote && <NoteDetailModal note={selectedNote} onClose={() => setSelectedNote(null)} />}
    </DashboardLayout>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-mesh flex items-center justify-center"><div className="text-gray-400">Loading marketplace…</div></div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
