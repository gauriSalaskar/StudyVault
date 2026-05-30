'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Wallet, Copy, ExternalLink, Crown, TrendingUp, BookOpen, Download, Star, Shield } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { showToast } from '@/components/ui/toast';
import { useAppStore } from '@/store/appStore';
import { WalletButton } from '@/components/wallet/WalletButton';
import { supabase } from '@/lib/supabase';
import { Transaction } from '@/types';
import { truncateAddress, formatTokens, formatDate, SUBJECTS, UNIVERSITIES } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, wallet, setUser } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
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
  }, []);
  const [form, setForm] = useState({ name: user?.name || '', university: user?.university || '', subject: user?.subject || '' });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'badges'>('overview');

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    if (user) setUser({ ...user, name: form.name, university: form.university, subject: form.subject });
    setSaving(false);
    setEditing(false);
    showToast.success('Profile updated!');
  };

  if (!user) return null;

  const stats = [
    { label: 'SVT Balance', value: formatTokens(user.tokenBalance), icon: '🪙', color: 'text-indigo-600' },
    { label: 'Notes Uploaded', value: user.notesUploaded, icon: '📚', color: 'text-violet-600' },
    { label: 'Total Earned', value: `${formatTokens(user.totalEarned)} SVT`, icon: '💰', color: 'text-amber-600' },
    { label: 'Downloads', value: user.notesDownloaded, icon: '⬇️', color: 'text-emerald-600' },
  ];

  return (
    <DashboardLayout title="Profile" subtitle="Manage your account and view your stats">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile header card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Cover */}
            <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 relative">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            </div>

            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
                <div className="flex items-end gap-4">
                  <div className="relative">
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                      alt={user.name}
                      className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-white"
                    />
                    {user.isPremium && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                        <Crown className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="pb-1">
                    <h2 className="font-display text-xl font-bold text-gray-900">{user.name}</h2>
                    <p className="text-sm text-gray-500">{user.university || 'University not set'} · {user.subject || 'Subject not set'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Member since {formatDate(user.joinedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pb-1">
                  <WalletButton />
                  <Button variant="outline" size="sm" onClick={() => setEditing(!editing)} className="gap-1.5">
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </Button>
                </div>
              </div>

              {/* Wallet address */}
              {wallet.isConnected && wallet.address && (
                <div className="mt-4 flex items-center gap-2 p-3 bg-indigo-50 rounded-xl w-fit">
                  <Wallet className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm font-mono text-indigo-700">{truncateAddress(wallet.address, 6)}</span>
                  <button onClick={() => { navigator.clipboard.writeText(wallet.address!); showToast.success('Copied!'); }}>
                    <Copy className="w-3.5 h-3.5 text-indigo-400 hover:text-indigo-600" />
                  </button>
                  <a href={`https://etherscan.io/address/${wallet.address}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-400 hover:text-indigo-600" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit form */}
        {editing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6 space-y-4">
              <h3 className="font-display font-semibold text-gray-900">Edit Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Display Name</label>
                  <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">University</label>
                  <select className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.university} onChange={e => setForm(f => ({ ...f, university: e.target.value }))}>
                    {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subject</label>
                  <select className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSave} isLoading={saving} size="sm">Save Changes</Button>
                <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                <span className="text-2xl block mb-2">{s.icon}</span>
                <p className={cn('font-display text-xl font-bold', s.color)}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100 px-4 pt-2">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'transactions', label: 'Transactions', icon: Star },
              { id: 'badges', label: 'Badges', icon: Crown },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all',
                    activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  )}
                >
                  <Icon className="w-4 h-4" />{tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-5">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl">
                    <p className="text-xs text-indigo-500 font-semibold mb-1">Best Performing Note</p>
                    <p className="text-sm font-bold text-gray-900">Advanced Calculus Guide</p>
                    <p className="text-xs text-gray-500 mt-0.5">2,847 downloads · ★4.8</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                    <p className="text-xs text-amber-600 font-semibold mb-1">This Month's Earnings</p>
                    <p className="text-sm font-bold text-gray-900">🪙 +450 SVT</p>
                    <p className="text-xs text-gray-500 mt-0.5">+18% vs last month</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs font-semibold text-gray-500 mb-3">Account Details</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Email', value: user.email || 'Not set' },
                      { label: 'Member since', value: formatDate(user.joinedAt) },
                      { label: 'Account type', value: user.isPremium ? 'Premium' : 'Standard' },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-xs text-gray-400">{label}</span>
                        <span className="text-xs font-medium text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'transactions' && (
              <TransactionList transactions={transactions} />
            )}
            {activeTab === 'badges' && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[...user.badges, { id: 'next1', name: 'Upload 25 Notes', icon: '📤', color: 'text-gray-300' }, { id: 'next2', name: 'First NFT Sale', icon: '💰', color: 'text-gray-300' }].map(badge => (
                  <div key={badge.id} className={cn('p-4 bg-gray-50 rounded-2xl text-center border transition-all', badge.color.includes('300') ? 'border-dashed border-gray-200 opacity-50' : 'border-gray-100 hover:bg-indigo-50')}>
                    <span className="text-3xl block mb-2">{badge.icon}</span>
                    <p className="text-xs font-semibold text-gray-700">{badge.name}</p>
                    {badge.color.includes('300') && <p className="text-xs text-gray-400 mt-1">Locked</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
