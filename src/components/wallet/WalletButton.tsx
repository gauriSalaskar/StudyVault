'use client';
import { Wallet, ChevronDown, Copy, LogOut, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/appStore';
import { truncateAddress, formatTokens } from '@/lib/utils';
import { showToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export function WalletButton() {
  const { wallet, user, connectWallet, disconnectWallet } = useAppStore();
  const [open, setOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    const success = await connectWallet();
    setConnecting(false);
    if (success) {
      showToast.success('Wallet connected successfully!');
    } else {
      showToast.info('MetaMask not found — connected in demo mode');
    }
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      showToast.success('Address copied!');
    }
    setOpen(false);
  };

  if (!wallet.isConnected) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleConnect}
        isLoading={connecting}
        className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm font-medium',
          'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
        )}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{truncateAddress(wallet.address!)}</span>
        <span className="text-indigo-400">|</span>
        <span className="text-xs">🪙 {formatTokens(user?.tokenBalance || 0)}</span>
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl z-20 overflow-hidden">
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-violet-50 border-b border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Connected Wallet</p>
              <p className="text-sm font-mono font-medium text-gray-800">{truncateAddress(wallet.address!, 6)}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1">
                  <span className="text-sm">🪙</span>
                  <span className="text-xs font-semibold text-indigo-700">{formatTokens(user?.tokenBalance || 0)} SVT</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1">
                  <span className="text-xs font-mono text-gray-600">{parseFloat(wallet.balance).toFixed(4)} ETH</span>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={copyAddress}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-400" />
                Copy Address
              </button>
              <a
                href={`https://etherscan.io/address/${wallet.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(false)}
              >
                <ExternalLink className="w-4 h-4 text-gray-400" />
                View on Etherscan
              </a>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={() => { disconnectWallet(); setOpen(false); showToast.info('Wallet disconnected'); }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
