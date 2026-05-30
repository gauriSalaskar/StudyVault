'use client';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const benefits = {
  students: {
    label: 'For Students',
    color: 'indigo',
    gradient: 'from-indigo-500 to-violet-600',
    lightGradient: 'from-indigo-50 to-violet-50',
    border: 'border-indigo-100',
    icon: '🎓',
    points: [
      'Access 15,000+ quality notes from top universities',
      'AI summaries save hours of reading time',
      'Earn SVT tokens just for uploading your notes',
      'Get rewarded every time someone downloads your work',
      'Find notes by subject, university, or keyword',
      'Verify note quality with blockchain-backed ratings',
    ],
  },
  creators: {
    label: 'For Note Creators',
    color: 'amber',
    gradient: 'from-amber-400 to-orange-500',
    lightGradient: 'from-amber-50 to-orange-50',
    border: 'border-amber-100',
    icon: '💎',
    points: [
      'Earn 50 SVT tokens for every note you upload',
      'Earn 5–20 SVT every time your note is downloaded',
      'Mint your best notes as NFTs for premium pricing',
      'Earn royalties every time your NFT is resold',
      'Build a reputation with ratings and badges',
      'Turn your study effort into real cryptocurrency',
    ],
  },
};

export function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full mb-4 border border-indigo-100">
            Benefits
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Built for everyone in the{' '}
            <span className="gradient-text">knowledge economy</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Whether you're here to learn or share, StudyVault rewards you every step of the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(benefits).map(([key, benefit], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`rounded-3xl bg-gradient-to-br ${benefit.lightGradient} border ${benefit.border} p-8`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center text-2xl shadow-md`}>
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-gray-900">{benefit.label}</h3>
                  <p className="text-sm text-gray-500">What you get</p>
                </div>
              </div>

              <ul className="space-y-3">
                {benefit.points.map((point, j) => (
                  <motion.li
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 + j * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${key === 'students' ? 'text-indigo-500' : 'text-amber-500'}`} />
                    <span className="text-sm text-gray-700 leading-relaxed">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
