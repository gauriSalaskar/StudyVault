import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, WalletState, Note } from '@/types';
import { supabase } from '@/lib/supabase';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  wallet: WalletState;
  sidebarOpen: boolean;
  uploadedNotes: Note[];
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  setWallet: (wallet: Partial<WalletState>) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addUploadedNote: (note: Note) => void;
  updateTokenBalance: (amount: number) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, university?: string, subject?: string) => Promise<boolean>;
  logout: () => void;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
}

const defaultWallet: WalletState = {
  address: null,
  isConnected: false,
  balance: '0',
  chainId: null,
  isConnecting: false,
  error: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      wallet: defaultWallet,
      sidebarOpen: true,
      uploadedNotes: [],

      setUser: (user) => set({ user }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (value) => set({ isLoading: value }),
      setWallet: (wallet) => set((state) => ({ wallet: { ...state.wallet, ...wallet } })),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      addUploadedNote: (note) => set((state) => ({ uploadedNotes: [note, ...state.uploadedNotes] })),
      updateTokenBalance: (amount) => set((state) => ({
        user: state.user ? { ...state.user, tokenBalance: state.user.tokenBalance + amount } : null
      })),

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error || !data.user) {
            set({ isLoading: false });
            return false;
          }
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const user: User = {
            id: data.user.id,
            email: data.user.email,
            name: profile?.name || email.split('@')[0],
            university: profile?.university || '',
            subject: profile?.subject || '',
            tokenBalance: profile?.token_balance || 100,
            notesUploaded: profile?.notes_uploaded || 0,
            notesDownloaded: profile?.notes_downloaded || 0,
            totalEarned: profile?.total_earned || 0,
            joinedAt: data.user.created_at,
            isPremium: profile?.is_premium || false,
            badges: profile?.badges || [],
          };
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      signup: async (email, password, name, university = '', subject = '') => {
        set({ isLoading: true });
        try {
          const { data, error } = await supabase.auth.signUp({ email, password });
          if (error || !data.user) {
            set({ isLoading: false });
            return false;
          }
          // Create profile row
          await supabase.from('profiles').insert({
            id: data.user.id,
            name,
            university,
            subject,
            token_balance: 100,
            notes_uploaded: 0,
            notes_downloaded: 0,
            total_earned: 0,
            is_premium: false,
            badges: [],
          });

          const user: User = {
            id: data.user.id,
            email,
            name,
            university,
            subject,
            tokenBalance: 100,
            notesUploaded: 0,
            notesDownloaded: 0,
            totalEarned: 0,
            joinedAt: data.user.created_at,
            isPremium: false,
            badges: [],
          };
          set({ user, isAuthenticated: true, isLoading: false });
          return true;
        } catch {
          set({ isLoading: false });
          return false;
        }
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({
          user: null,
          isAuthenticated: false,
          wallet: defaultWallet,
          uploadedNotes: [],
        });
      },

      connectWallet: async () => {
        set((state) => ({ wallet: { ...state.wallet, isConnecting: true, error: null } }));
        try {
          if (typeof window !== 'undefined' && (window as any).ethereum) {
            const { ethers } = await import('ethers');
            const provider = new ethers.BrowserProvider((window as any).ethereum);
            const accounts = await provider.send('eth_requestAccounts', []);
            const network = await provider.getNetwork();
            const balance = await provider.getBalance(accounts[0]);
            set((state) => ({
              wallet: {
                ...state.wallet,
                address: accounts[0],
                isConnected: true,
                balance: ethers.formatEther(balance),
                chainId: Number(network.chainId),
                isConnecting: false,
              },
            }));
            return true;
          } else {
            const demoAddress = '0x742d35Cc6634C0532925a3b8D4C9C2B1234567890';
            set((state) => ({
              wallet: {
                ...state.wallet,
                address: demoAddress,
                isConnected: true,
                balance: '2.4571',
                chainId: 1,
                isConnecting: false,
              },
            }));
            return true;
          }
        } catch (error: any) {
          set((state) => ({
            wallet: {
              ...state.wallet,
              isConnecting: false,
              error: error.message || 'Failed to connect wallet',
            },
          }));
          return false;
        }
      },

      disconnectWallet: () => {
        set({ wallet: defaultWallet });
      },
    }),
    {
      name: 'studyvault-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        wallet: state.wallet,
      }),
    }
  )
);
