'use client';
import { useEffect, useCallback } from 'react';
import { useAppStore } from '@/store/appStore';
import { showToast } from '@/components/ui/toast';

export function useWallet() {
  const { wallet, connectWallet, disconnectWallet, setWallet } = useAppStore();

  // Listen for MetaMask account/chain changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const eth = (window as any).ethereum;
    if (!eth) return;

    const onAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
        showToast.info('Wallet disconnected');
      } else {
        setWallet({ address: accounts[0] });
        showToast.info(`Switched to ${accounts[0].slice(0, 6)}...`);
      }
    };

    const onChainChanged = (chainIdHex: string) => {
      const chainId = parseInt(chainIdHex, 16);
      setWallet({ chainId });
      showToast.info(`Switched to chain ${chainId}`);
      // Reload to re-initialize with new chain
      window.location.reload();
    };

    const onDisconnect = () => {
      disconnectWallet();
      showToast.info('Wallet disconnected');
    };

    eth.on('accountsChanged', onAccountsChanged);
    eth.on('chainChanged', onChainChanged);
    eth.on('disconnect', onDisconnect);

    return () => {
      eth.removeListener('accountsChanged', onAccountsChanged);
      eth.removeListener('chainChanged', onChainChanged);
      eth.removeListener('disconnect', onDisconnect);
    };
  }, [disconnectWallet, setWallet]);

  const connect = useCallback(async () => {
    const success = await connectWallet();
    if (success) {
      showToast.success('Wallet connected!');
    } else {
      showToast.info('Connected in demo mode (MetaMask not detected)');
    }
    return success;
  }, [connectWallet]);

  const switchToSepolia = useCallback(async () => {
    const eth = (window as any).ethereum;
    if (!eth) return;
    try {
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia Testnet',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://rpc.sepolia.org'],
            blockExplorerUrls: ['https://sepolia.etherscan.io'],
          }],
        });
      }
    }
  }, []);

  return {
    ...wallet,
    connect,
    disconnect: disconnectWallet,
    switchToSepolia,
    isMetaMaskInstalled: typeof window !== 'undefined' && !!(window as any).ethereum,
  };
}
