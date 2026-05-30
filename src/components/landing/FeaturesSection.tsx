'use client';
import { motion } from 'framer-motion';
import { Brain, Coins, Shield, Zap, Users, Upload, Crown, Search } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Summaries',
    description: 'Gemini AI automatically generates key summaries, highlights important concepts, and creates study guides from uploaded notes.',
    color: 'bg-violet-50 text-violet-600',
    gradient: 'from-violet-500 to-purple-600',
    tag: 'Gemini AI',
  },
  {
    icon: Coins,
    title: 'Earn SVT Tokens',
    description: 'Get rewarded with StudyVault Tokens every time someone downloads or rates your notes. Real crypto rewards for your knowledge.',
    color: 'bg-amber-50 text-amber-600',
    gradient: 'from-amber-400 to-orange-500',
    tag: 'Web3',
  },
  {
    icon: Crown,
    title: 'NFT Note Ownership',
    description: 'Mint your premium notes as NFTs on the blockchain. Prove ownership, earn royalties, and trade your intellectual property.',
    color: 'bg-pink-50 text-pink-600',
    gradient: 'from-pink-500 to-rose-500',
    tag: 'NFT',
  },
  {
    icon: Shield,
    title: 'IPFS Decentralized Storage',
    description: 'Notes are stored on IPFS — a decentralized network ensuring your content is permanently accessible and censorship-resistant.',
    color: 'bg-emerald-50 text-emerald-600',
    gradient: 'from-emerald-500 to-teal-500',
    tag: 'IPFS',
  },
  {
    icon: Search,
    title: 'Smart Marketplace',
    description: 'Search and filter thousands of notes by subject, university, rating, and price. Find exactly what you need instantly.',
    color: 'bg-blue-50 text-blue-600',
    gradient: 'from-blue-500 to-cyan-500',
    tag: 'Discovery',
  },
  {
    icon: Zap,
    title: 'Instant Downloads',
    description: 'Download notes instantly after purchase. With blockchain verification, ownership transfers are secure and transparent.',
    color: 'bg-yellow-50 text-yellow-600',
    gradient: 'from-yellow-400 to-amber-500',
    tag: 'Fast',
  },
  {
    icon: Upload,
    title: 'Easy Upload System',
    description: 'Drag and drop your PDFs, PPTs, and DOCs. Our system automatically processes, categorizes, and lists your notes.',
    color: 'bg-indigo-50 text-indigo-600',
    gradient: 'from-indigo-500 to-violet-600',
    tag: 'Simple',
  },
  {
    icon: Users,
    title: 'Community Ratings',
    description: 'Peer-reviewed rating system ensures quality. Top-rated contributors get featured placements and bonus token rewards.',
    color: 'bg-cyan-50 text-cyan-600',
    gradient: 'from-cyan-500 to-sky-500',
    tag: 'Community',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full mb-4 border border-indigo-100">
            Platform Features
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to{' '}
            <span className="gradient-text">succeed</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            StudyVault combines the best of AI, blockchain, and community to create
            the ultimate knowledge-sharing economy for students.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group p-5 bg-white rounded-2xl border border-gray-100 hover:border-indigo-100 shadow-sm hover:shadow-lg transition-all duration-200 card-hover"
              >
                <div className={`w-11 h-11 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug">{feature.title}</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{feature.description}</p>
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${feature.gradient} text-white`}>
                  {feature.tag}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
