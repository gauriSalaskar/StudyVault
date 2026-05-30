'use client';
import { useState, useCallback, useMemo } from 'react';
import { Note, MarketplaceFilter } from '@/types';
import { useAppStore } from '@/store/appStore';
import { showToast } from '@/components/ui/toast';

const DEFAULT_FILTER: MarketplaceFilter = {
  subject: '',
  university: '',
  fileType: '',
  priceRange: [0, 500],
  sortBy: 'popular',
  isNFT: null,
  isFree: null,
  search: '',
};

export function useNotes() {
  const { uploadedNotes, updateTokenBalance, user } = useAppStore();
  const [filter, setFilter] = useState<MarketplaceFilter>(DEFAULT_FILTER);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const allNotes = useMemo(() => [...uploadedNotes], [uploadedNotes]);

  const filtered = useMemo(() => {
    let notes = [...allNotes];

    if (filter.search) {
      const q = filter.search.toLowerCase();
      notes = notes.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.subject.toLowerCase().includes(q) ||
        n.university.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filter.subject) notes = notes.filter(n => n.subject === filter.subject);
    if (filter.university) notes = notes.filter(n => n.university === filter.university);
    if (filter.fileType) notes = notes.filter(n => n.fileType === filter.fileType);
    if (filter.isNFT !== null) notes = notes.filter(n => n.isNFT === filter.isNFT);
    if (filter.isFree !== null) notes = notes.filter(n => n.isFree === filter.isFree);
    notes = notes.filter(n => n.price >= filter.priceRange[0] && n.price <= filter.priceRange[1]);

    switch (filter.sortBy) {
      case 'rating':     notes.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     notes.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()); break;
      case 'price_low':  notes.sort((a, b) => a.price - b.price); break;
      case 'price_high': notes.sort((a, b) => b.price - a.price); break;
      default:           notes.sort((a, b) => b.downloads - a.downloads);
    }

    return notes;
  }, [allNotes, filter]);

  const updateFilter = useCallback((partial: Partial<MarketplaceFilter>) => {
    setFilter(prev => ({ ...prev, ...partial }));
  }, []);

  const resetFilter = useCallback(() => setFilter(DEFAULT_FILTER), []);

  const purchaseNote = useCallback(async (note: Note): Promise<boolean> => {
    if (!user) { showToast.warning('Please login first'); return false; }
    if (!note.isFree && (user.tokenBalance || 0) < note.price) {
      showToast.error(`Need ${note.price} SVT tokens. You have ${user.tokenBalance}.`);
      return false;
    }
    setPurchasing(note.id);
    await new Promise(r => setTimeout(r, 1200));
    if (!note.isFree && note.price > 0) updateTokenBalance(-note.price);
    setPurchasing(null);
    showToast.success(`Downloaded: ${note.title.slice(0, 40)}...`);
    return true;
  }, [user, updateTokenBalance]);

  const getNoteById = useCallback((id: string) => allNotes.find(n => n.id === id), [allNotes]);

  return {
    notes: filtered,
    totalCount: filtered.length,
    filter,
    updateFilter,
    resetFilter,
    purchaseNote,
    purchasing,
    getNoteById,
    myNotes: uploadedNotes,
  };
}
