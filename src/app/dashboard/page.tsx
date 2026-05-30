'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Download, Coins, TrendingUp, Upload,
  Sparkles, Crown, Star, ChevronRight, Zap
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteDetailModal } from '@/components/notes/NoteDetailModal';
import { StatCardSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { Note, Transaction } from '@/types';
import { formatTokens, formatDate } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [topNotes, setTopNotes] = useState<Note[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch top 3 notes by downloads
      const { data: notesData } = await supabase
        .from('notes')
        .select('*')
        .order('downloads', { ascending: false })
        .limit(3);

      if (notesData) {
        setTopNotes(notesData.map((n: any) => ({
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
        })));
      }

      // Fetch recent transactions for the current user
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: txData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (txData) {
          setTransactions(txData.map((t: any) => ({
            id: t.id,
            type: t.type,
            amount: t.amount,
            description: t.description,
            timestamp: t.created_at,
            txHash: t.tx_hash,
          })));
        }
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout title="Dashboard" subtitle={`Welcome back, ${user?.name?.split(' ')[0] || 'Student'}! 👋`}>
      <div className="space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
                <StatsCard
                  title="SVT Balance" value={`🪙 ${formatTokens(user?.tokenBalance || 0)}`}
                  subtitle="StudyVault Tokens" icon={<Coins className="w-5 h-5" />}
                  trend={{ value: 12, label: 'this week' }} gradient
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <StatsCard
                  title="Notes Uploaded" value={user?.notesUploaded || 0}
                  subtitle={`${user?.notesUploaded || 0} notes shared`} icon={<Upload className="w-5 h-5" />}
                  trend={{ value: 8, label: 'vs last month' }} color="violet"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <StatsCard
                  title="Total Downloads" value={user?.notesDownloaded || 0}
                  subtitle="Students helped" icon={<Download className="w-5 h-5" />}
                  trend={{ value: 23, label: 'this month' }} color="emerald"
                />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <StatsCard
                  title="Total Earned" value={`${formatTokens(user?.totalEarned || 0)} SVT`}
                  subtitle="Lifetime earnings" icon={<TrendingUp className="w-5 h-5" />}
                  trend={{ value: 18, label: 'vs last month' }} color="amber"
                />
              </motion.div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/upload">
              <div className="group p-5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl text-white cursor-pointer hover:shadow-xl hover:shadow-indigo-200 transition-all hover:-translate-y-0.5">
                <Upload className="w-7 h-7 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-lg">Upload Notes</h3>
                <p className="text-indigo-200 text-xs mt-1">Earn up to 100 SVT</p>
                <ChevronRight className="w-4 h-4 mt-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link href="/marketplace">
              <div className="group p-5 bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-lg hover:border-indigo-100 transition-all hover:-translate-y-0.5">
                <BookOpen className="w-7 h-7 mb-3 text-indigo-500 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-lg text-gray-900">Browse Marketplace</h3>
                <p className="text-gray-400 text-xs mt-1">Discover community notes</p>
                <ChevronRight className="w-4 h-4 mt-3 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
            <Link href="/marketplace?filter=nft">
              <div className="group p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5">
                <Crown className="w-7 h-7 mb-3 text-amber-500 group-hover:scale-110 transition-transform" />
                <h3 className="font-display font-bold text-lg text-gray-900">NFT Marketplace</h3>
                <p className="text-amber-500 text-xs mt-1">Premium collections</p>
                <ChevronRight className="w-4 h-4 mt-3 text-amber-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trending notes */}
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400" />
                  <h2 className="font-display font-bold text-gray-900">Trending Notes</h2>
                </div>
                <Link href="/marketplace">
                  <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50 gap-1 text-xs">
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
              {topNotes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {topNotes.map(note => (
                    <NoteCard key={note.id} note={note} onView={n => setSelectedNote(n)} compact />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">No notes yet. Be the first to upload!</p>
              )}
            </div>
          </motion.div>

          {/* Transactions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-full">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-400" />
                  <h2 className="font-display font-bold text-gray-900">Token Activity</h2>
                </div>
                <span className="text-xs text-gray-400">Last 7 days</span>
              </div>
              {transactions.length > 0 ? (
                <TransactionList transactions={transactions} limit={5} />
              ) : (
                <p className="text-sm text-gray-400 text-center py-8">No transactions yet.</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Badges & Profile row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Achievements */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-violet-500" />
                <h2 className="font-display font-bold text-gray-900">Your Achievements</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {user?.badges?.map(badge => (
                  <div key={badge.id} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                    <span className="text-2xl mb-1">{badge.icon}</span>
                    <span className="text-xs font-medium text-gray-700 text-center leading-tight">{badge.name}</span>
                  </div>
                ))}
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <span className="text-2xl mb-1 opacity-30">🏅</span>
                  <span className="text-xs text-gray-400 text-center">Keep uploading</span>
                </div>
              </div>
            </div>

            {/* Token breakdown */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-5 text-white">
              <h2 className="font-display font-bold text-lg mb-4">Token Overview</h2>
              <div className="space-y-3">
                {[
                  { label: 'Upload Rewards', amount: 850, pct: 68 },
                  { label: 'Download Royalties', amount: 300, pct: 24 },
                  { label: 'Rating Bonuses', amount: 100, pct: 8 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-indigo-200">{item.label}</span>
                      <span className="text-white font-semibold">{item.amount} SVT</span>
                    </div>
                    <div className="h-1.5 bg-indigo-500/40 rounded-full">
                      <div className="h-full bg-white/70 rounded-full" style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-indigo-500/40 flex justify-between">
                <span className="text-indigo-200 text-sm">Total Balance</span>
                <span className="text-white font-bold text-lg">🪙 {formatTokens(user?.tokenBalance || 0)} SVT</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {selectedNote && <NoteDetailModal note={selectedNote} onClose={() => setSelectedNote(null)} />}
    </DashboardLayout>
  );
}
