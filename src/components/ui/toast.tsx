'use client';
import { Toaster, toast } from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'white',
          color: '#1f2937',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          padding: '12px 16px',
        },
      }}
    />
  );
}

export const showToast = {
  success: (message: string) =>
    toast.custom(() => (
      <div className="flex items-center gap-3 bg-white border border-emerald-100 rounded-xl px-4 py-3 shadow-lg">
        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-800">{message}</span>
      </div>
    )),
  error: (message: string) =>
    toast.custom(() => (
      <div className="flex items-center gap-3 bg-white border border-red-100 rounded-xl px-4 py-3 shadow-lg">
        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-800">{message}</span>
      </div>
    )),
  warning: (message: string) =>
    toast.custom(() => (
      <div className="flex items-center gap-3 bg-white border border-amber-100 rounded-xl px-4 py-3 shadow-lg">
        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-800">{message}</span>
      </div>
    )),
  info: (message: string) =>
    toast.custom(() => (
      <div className="flex items-center gap-3 bg-white border border-indigo-100 rounded-xl px-4 py-3 shadow-lg">
        <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-800">{message}</span>
      </div>
    )),
  token: (amount: number, msg: string) =>
    toast.custom(() => (
      <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-xl px-4 py-3 shadow-lg">
        <span className="text-2xl">🪙</span>
        <div>
          <p className="text-sm font-semibold text-indigo-700">+{amount} SVT Earned!</p>
          <p className="text-xs text-indigo-500">{msg}</p>
        </div>
      </div>
    )),
};
