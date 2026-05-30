import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatTokens(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
  return amount.toString();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return formatDate(dateString);
}

export function getFileIcon(type: string): string {
  const icons: Record<string, string> = {
    pdf: '📄', ppt: '📊', pptx: '📊', doc: '📝', docx: '📝', txt: '📃',
  };
  return icons[type.toLowerCase()] || '📄';
}

export function getSubjectColor(subject: string): string {
  const colors: Record<string, string> = {
    'Mathematics': 'bg-blue-100 text-blue-700',
    'Physics': 'bg-purple-100 text-purple-700',
    'Chemistry': 'bg-green-100 text-green-700',
    'Biology': 'bg-emerald-100 text-emerald-700',
    'Computer Science': 'bg-indigo-100 text-indigo-700',
    'History': 'bg-amber-100 text-amber-700',
    'Economics': 'bg-orange-100 text-orange-700',
    'Literature': 'bg-rose-100 text-rose-700',
    'Engineering': 'bg-cyan-100 text-cyan-700',
    'Medicine': 'bg-red-100 text-red-700',
  };
  return colors[subject] || 'bg-gray-100 text-gray-700';
}

export function generateMockIpfsHash(): string {
  const chars = 'QmabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let hash = 'Qm';
  for (let i = 0; i < 44; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'History', 'Economics', 'Literature',
  'Engineering', 'Medicine', 'Psychology', 'Philosophy',
  'Business', 'Law', 'Architecture', 'Arts',
];

export const UNIVERSITIES = [
  'MIT', 'Stanford University', 'Harvard University', 'IIT Bombay',
  'Delhi University', 'Oxford University', 'Cambridge University',
  'NIT Trichy', 'BITS Pilani', 'Anna University', 'VIT University',
  'Pune University', 'Mumbai University', 'Other',
];
