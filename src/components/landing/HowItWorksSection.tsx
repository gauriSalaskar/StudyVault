'use client';
import { motion } from 'framer-motion';
import { Upload, Brain, Coins, Crown, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Upload,
    title: 'Upload Your Notes',
    description: 'Drag & drop your PDFs, PPTs, or DOCs. We securely store them on IPFS and add them to the marketplace.',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    detail: 'Supports PDF, PPT, PPTX, DOC, DOCX, TXT',
  },
  {
    step: '02',
    icon: Brain,
    title: 'AI Analyzes Your Content',
    description: 'Gemini AI reads your notes and generates a smart summary, key points, and a difficulty rating automatically.',
    color: 'bg-violet-500',
    lightColor: 'bg-violet-50',
    textColor: 'text-violet-600',
    detail: 'Powered by Google Gemini AI',
  },
  {
    step: '03',
    icon: Coins,
    title: 'Earn SVT Tokens',
    description: 'Every time a student downloads or rates your notes, you earn StudyVault Tokens (SVT) deposited to your wallet.',
    color: 'bg-amber-500',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-600',
    detail: '10–100 SVT per download',
  },
  {
    step: '04',
    icon: Crown,
    title: 'Mint as NFT (Optional)',
    description: 'Turn your best notes into NFTs. Sell them for higher prices, earn royalties on resales, and prove blockchain ownership.',
    color: 'bg-pink-500',
    lightColor: 'bg-pink-50',
    textColor: 'text-pink-600',
    detail: 'ERC-721 on Ethereum',
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full mb-4 border border-indigo-100">
            How It Works
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Start earning in{' '}
            <span className="gradient-text">4 simple steps</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            From uploading your first note to earning crypto rewards, the journey is seamless and rewarding.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-0.5 bg-gradient-to-r from-blue-200 via-violet-200 via-amber-200 to-pink-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Arrow between steps */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-14 z-10">
                      <ArrowRight className="w-5 h-5 text-gray-300" />
                    </div>
                  )}

                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all card-hover">
                    {/* Step number */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${step.color} rounded-2xl flex items-center justify-center shadow-md`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={`font-display text-4xl font-black ${step.textColor} opacity-20`}>{step.step}</span>
                    </div>

                    <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{step.description}</p>

                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${step.lightColor} ${step.textColor} rounded-full text-xs font-semibold`}>
                      {step.detail}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
