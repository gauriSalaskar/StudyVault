'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, TrendingUp, Download, Crown } from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteDetailModal } from '@/components/notes/NoteDetailModal';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { useAppStore } from '@/store/appStore';
import { supabase } from '@/lib/supabase';
import { Note } from '@/types';

export default function MyNotesPage() {
  const { user, uploadedNotes } = useAppStore();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [activeTab, setActiveTab] = useState<'uploaded' | 'purchased'>('uploaded');
  const [dbNotes, setDbNotes] = useState<Note[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from('notes')
        .select('*')
        .eq('uploaded_by', session.user.id)
        .order('uploaded_at', { ascending: false });

      if (data) {
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
          downloads: n.downloads,
          rating: n.rating,
          ratingCount: n.rating_count,
          tags: n.tags || [],
          isNFT: n.is_nft,
          nftTokenId: n.nft_token_id,
          price: n.price,
          isFree: n.is_free,
          aiSummary: n.ai_summary,
        }));
        setDbNotes(mapped);
      }
    };
    fetchNotes();

    const fetchTransactions = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (data) {
        setTransactions(data.map((t: any) => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          description: t.description,
          timestamp: t.created_at,
          txHash: t.tx_hash,
        })));
      }
    };
    fetchTransactions();
  }, [uploadedNotes]);

  // Merge db notes with local uploaded notes (avoid duplicates)
  const dbIds = new Set(dbNotes.map(n => n.id));
  const localOnly = uploadedNotes.filter(n => !dbIds.has(n.id));
  const myUploadedNotes = [...dbNotes, ...localOnly];
  const purchasedNotes: Note[] = [];

  const displayNotes = activeTab === 'uploaded' ? myUploadedNotes : purchasedNotes;

  const tabs = [
    { id: 'uploaded', label: 'Uploaded', count: myUploadedNotes.length, icon: BookOpen },
    { id: 'purchased', label: 'Purchased', count: purchasedNotes.length, icon: Download },
  ];

  return (
    <DashboardLayout title="My Notes" subtitle="Manage your uploaded and purchased notes">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Uploads" value={myUploadedNotes.length} icon={<BookOpen className="w-5 h-5" />} color="indigo" />
          <StatsCard title="Total Downloads" value={myUploadedNotes.reduce((a, n) => a + n.downloads, 0)} icon={<Download className="w-5 h-5" />} color="emerald" />
          <StatsCard title="Avg Rating" value={myUploadedNotes.length ? (myUploadedNotes.reduce((a, n) => a + n.rating, 0) / myUploadedNotes.length).toFixed(1) + '★' : '0★'} icon={<TrendingUp className="w-5 h-5" />} color="amber" />
          <StatsCard title="NFTs Minted" value={myUploadedNotes.filter(n => n.isNFT).length} icon={<Crown className="w-5 h-5" />} color="violet" />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100 px-4 pt-4">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-t-xl border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
            <div className="ml-auto pb-2 flex items-end">
              <Link href="/upload">
                <Button size="sm" className="gap-1.5 text-xs">
                  <Plus className="w-3.5 h-3.5" /> Upload New
                </Button>
              </Link>
            </div>
          </div>

          <div className="p-5">
            {displayNotes.length === 0 ? (
              <EmptyState
                icon={activeTab === 'uploaded' ? '📚' : '🛍️'}
                title={activeTab === 'uploaded' ? 'No notes uploaded yet' : 'No purchased notes'}
                description={activeTab === 'uploaded' ? 'Upload your first notes and start earning SVT tokens!' : 'Browse the marketplace to find and purchase premium notes.'}
                actionLabel={activeTab === 'uploaded' ? 'Upload Notes' : 'Browse Marketplace'}
                onAction={() => window.location.href = activeTab === 'uploaded' ? '/upload' : '/marketplace'}
              />
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {displayNotes.map((note, i) => (
                  <motion.div key={note.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <NoteCard note={note} onView={n => setSelectedNote(n)} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-display font-bold text-gray-900 mb-4">Recent Token Activity</h2>
          <TransactionList transactions={transactions} />
        </div>
      </div>

      {selectedNote && <NoteDetailModal note={selectedNote} onClose={() => setSelectedNote(null)} />}
    </DashboardLayout>
  );
}
