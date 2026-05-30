'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Upload, ShoppingBag,
  User, Coins, Settings, ChevronLeft, ChevronRight,
  Sparkles, GraduationCap, TrendingUp, Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/appStore';
import { formatTokens } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { href: '/upload', label: 'Upload Notes', icon: Upload },
  { href: '/notes', label: 'My Notes', icon: BookOpen },
  { href: '/profile', label: 'Profile', icon: User },
];

const bottomItems = [
  { href: '/dashboard#rewards', label: 'Rewards', icon: Coins },
  { href: '/dashboard#settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, user } = useAppStore();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-30 shadow-sm',
        sidebarOpen ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-gray-900 text-lg truncate">StudyVault</span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Token Balance */}
      {user && (
        <div className={cn(
          'mx-3 my-3 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 transition-all',
          sidebarOpen ? 'p-3' : 'p-2'
        )}>
          {sidebarOpen ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-medium text-indigo-600">SVT Balance</span>
              </div>
              <p className="font-display text-2xl font-bold text-indigo-700">{formatTokens(user.tokenBalance)}</p>
              <p className="text-xs text-indigo-400 mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +120 this week
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <Coins className="w-5 h-5 text-indigo-500" />
              <span className="text-xs font-bold text-indigo-700 mt-1">{formatTokens(user.tokenBalance)}</span>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {sidebarOpen && (
          <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
        )}
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative',
                isActive
                  ? 'sidebar-active font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600')} />
              {sidebarOpen && <span>{label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {label}
                </div>
              )}
            </Link>
          );
        })}

        {sidebarOpen && (
          <p className="px-3 py-1 pt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Explore</p>
        )}
        <Link
          href="/marketplace?filter=nft"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-all group relative"
          title={!sidebarOpen ? 'NFT Notes' : undefined}
        >
          <Star className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-amber-500" />
          {sidebarOpen && <span>NFT Notes</span>}
          {sidebarOpen && (
            <span className="ml-auto text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-semibold">Hot</span>
          )}
        </Link>
        <Link
          href="/marketplace?filter=ai"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-all group relative"
          title={!sidebarOpen ? 'AI Summaries' : undefined}
        >
          <Sparkles className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-purple-500" />
          {sidebarOpen && <span>AI Summaries</span>}
        </Link>
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t border-gray-100 pt-3 space-y-0.5">
        {user && (
          <div className={cn('flex items-center gap-2 px-3 py-2 rounded-xl', sidebarOpen ? '' : 'justify-center')}>
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-7 h-7 rounded-full flex-shrink-0 border border-indigo-100"
            />
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.university || 'Student'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
