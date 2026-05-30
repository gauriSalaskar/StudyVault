'use client';
import { Bell, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { WalletButton } from '@/components/wallet/WalletButton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface TopNavProps {
  title?: string;
  subtitle?: string;
}

export function TopNav({ title, subtitle }: TopNavProps) {
  const { toggleSidebar, sidebarOpen, user } = useAppStore();
  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const router = useRouter();

  const notifications = [
    { id: 1, text: 'Your notes earned 50 SVT tokens!', time: '2m ago', icon: '🪙', unread: true },
    { id: 2, text: 'New rating on "Calculus Guide"', time: '1h ago', icon: '⭐', unread: true },
    { id: 3, text: 'Your NFT was purchased', time: '3h ago', icon: '💎', unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/marketplace?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-20 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center px-4 gap-4"
      style={{ left: sidebarOpen ? '256px' : '64px', transition: 'left 0.3s' }}>

      <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 lg:hidden">
        <Menu className="w-5 h-5" />
      </button>

      {title && (
        <div className="hidden md:block">
          <h1 className="font-display text-lg font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      )}

      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <Input
          icon={<Search className="w-4 h-4" />}
          placeholder="Search notes, subjects, universities..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="h-9 bg-gray-50 border-gray-200 text-sm"
        />
      </form>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-gray-100 shadow-xl z-20 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-display font-semibold text-gray-900">Notifications</h3>
                  <button className="text-xs text-indigo-600 hover:text-indigo-700">Mark all read</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {notifications.map(n => (
                    <div key={n.id} className={cn('flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer', n.unread && 'bg-indigo-50/40')}>
                      <span className="text-xl flex-shrink-0 mt-0.5">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 font-medium">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                      {n.unread && <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 mt-1" />}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <WalletButton />
      </div>
    </header>
  );
}
