'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shield, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const floatingCards = [
  { title: 'Calculus Complete Guide', subject: 'Mathematics', tokens: '+50 SVT', emoji: '📐', rotate: '-6deg', top: '10%', left: '-5%' },
  { title: 'ML Algorithms', subject: 'Computer Science', tokens: '+100 SVT', emoji: '🤖', rotate: '8deg', top: '5%', right: '-5%' },
  { title: 'Quantum Mechanics', subject: 'Physics', tokens: 'NFT #002', emoji: '⚛️', rotate: '-4deg', bottom: '15%', left: '-8%' },
  { title: 'Organic Chemistry', subject: 'Chemistry', tokens: '+25 SVT', emoji: '🧪', rotate: '5deg', bottom: '10%', right: '-6%' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mesh pt-16">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full text-sm text-indigo-700 font-medium mb-8"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            AI-Powered Web3 EdTech Platform
            <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight"
          >
            Learn. Share.{' '}
            <span className="gradient-text">Earn.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The decentralized marketplace where students upload notes, earn crypto tokens,
            get AI-powered summaries, and trade knowledge as NFTs.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/signup">
              <Button size="xl" className="group gap-2 shadow-xl shadow-indigo-200 text-base w-full sm:w-auto">
                Start Earning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="xl" variant="outline" className="gap-2 text-base w-full sm:w-auto">
                Browse Marketplace
              </Button>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-16 text-sm text-gray-500"
          >
            {[
              { icon: Shield, text: 'Blockchain Verified' },
              { icon: Zap, text: 'AI-Powered Summaries' },
              { icon: Star, text: '4.9★ Rated Platform' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-indigo-400" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>

          {/* Hero dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Floating cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                className="absolute hidden lg:block z-10"
                style={{
                  top: card.top, bottom: card.bottom,
                  left: card.left, right: card.right,
                  transform: `rotate(${card.rotate})`,
                }}
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-xl p-3 w-44 animate-float" style={{ animationDelay: `${i * 0.5}s` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{card.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{card.title}</p>
                      <p className="text-xs text-gray-400">{card.subject}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{card.tokens}</span>
                </div>
              </motion.div>
            ))}

            {/* Main dashboard preview */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 bg-white rounded-lg h-6 mx-4 flex items-center px-3">
                  <span className="text-xs text-gray-400">app.studyvault.xyz/dashboard</span>
                </div>
              </div>

              {/* Dashboard content preview */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'SVT Balance', value: '1,250', color: 'from-indigo-500 to-violet-600', emoji: '🪙' },
                    { label: 'Notes Uploaded', value: '12', color: 'from-emerald-500 to-teal-500', emoji: '📚' },
                    { label: 'Total Earned', value: '3,450', color: 'from-amber-400 to-orange-500', emoji: '💰' },
                    { label: 'NFTs Minted', value: '4', color: 'from-violet-500 to-pink-500', emoji: '💎' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-left">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">{stat.label}</span>
                        <span className="text-sm">{stat.emoji}</span>
                      </div>
                      <p className="font-display text-lg font-bold text-gray-900">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Note cards row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { title: 'Advanced Calculus', subject: 'Mathematics', rating: '4.8', downloads: '2.8K', nft: true },
                    { title: 'Quantum Mechanics', subject: 'Physics', rating: '4.9', downloads: '1.9K', nft: true },
                    { title: 'DSA Cheatsheet', subject: 'CS', rating: '4.7', downloads: '5.4K', nft: false },
                  ].map(note => (
                    <div key={note.title} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-left">
                      <div className="h-16 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-lg mb-2 flex items-center justify-center text-2xl">
                        📄
                      </div>
                      <p className="text-xs font-semibold text-gray-800 truncate">{note.title}</p>
                      <p className="text-xs text-gray-400">{note.subject}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-amber-500">★ {note.rating}</span>
                        {note.nft && <span className="text-xs bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-medium">NFT</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
