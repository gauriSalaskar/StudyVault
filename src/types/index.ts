export interface User {
  id: string;
  address?: string;
  email?: string;
  name: string;
  avatar?: string;
  university?: string;
  subject?: string;
  tokenBalance: number;
  notesUploaded: number;
  notesDownloaded: number;
  totalEarned: number;
  joinedAt: string;
  isPremium: boolean;
  badges: Badge[];
}

export interface Note {
  id: string;
  title: string;
  description: string;
  subject: string;
  university: string;
  fileType: 'pdf' | 'ppt' | 'doc' | 'txt';
  fileSize: string;
  ipfsHash: string;
  uploadedBy: string;
  uploaderName: string;
  uploaderAvatar?: string;
  uploadedAt: string;
  downloads: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  isNFT: boolean;
  nftTokenId?: string;
  price: number; // in SVT tokens
  isFree: boolean;
  aiSummary?: string;
  preview?: string;
  thumbnail?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend' | 'mint' | 'transfer';
  amount: number;
  description: string;
  timestamp: string;
  txHash?: string;
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  balance: string;
  chainId: number | null;
  isConnecting: boolean;
  error: string | null;
}

export interface MarketplaceFilter {
  subject: string;
  university: string;
  fileType: string;
  priceRange: [number, number];
  sortBy: string;
  isNFT: boolean | null;
  isFree: boolean | null;
  search: string;
}

export interface AIAnalysis {
  summary: string;
  keyPoints: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedReadTime: number;
  topics: string[];
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}
