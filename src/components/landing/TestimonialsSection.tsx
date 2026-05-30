'use client';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'B.Tech CSE, IIT Bombay',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    text: 'I uploaded my DSA notes and earned over 2,000 SVT tokens in the first week! The AI summary feature made my notes look incredibly professional. Best platform for students.',
    rating: 5,
    earned: '2,400 SVT',
    color: 'from-indigo-50 to-blue-50',
  },
  {
    name: 'Priya Nair',
    role: 'MBBS, AIIMS Delhi',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    text: 'As a medical student, finding quality notes used to take hours. StudyVault changed everything — I found exactly what I needed and the blockchain verification gave me confidence in the quality.',
    rating: 5,
    earned: '1,850 SVT',
    color: 'from-violet-50 to-purple-50',
  },
  {
    name: 'Jake Thompson',
    role: 'MS Physics, Stanford',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jake',
    text: 'I minted my Quantum Mechanics notes as an NFT and sold it for 200 SVT! The whole process was seamless. This is the future of academic knowledge sharing.',
    rating: 5,
    earned: '3,200 SVT',
    color: 'from-emerald-50 to-teal-50',
  },
  {
    name: 'Fatima Al-Rashid',
    role: 'Economics, Oxford',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima',
    text: 'The AI summaries are genuinely impressive. I save hours every week getting the key points from notes before diving into the full content. Absolutely worth it.',
    rating: 5,
    earned: '980 SVT',
    color: 'from-amber-50 to-yellow-50',
  },
  {
    name: 'Carlos Reyes',
    role: 'B.E. Electronics, BITS Pilani',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    text: 'What I love most is that knowledge has real value here. My VLSI notes helped 500+ students and I got fairly rewarded. This is what education 3.0 looks like.',
    rating: 5,
    earned: '4,100 SVT',
    color: 'from-rose-50 to-pink-50',
  },
  {
    name: 'Mei Zhang',
    role: 'Data Science, NUS Singapore',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mei',
    text: 'I connected my MetaMask wallet in seconds and everything just worked. The token system is brilliant — it creates a positive loop where better notes earn more rewards.',
    rating: 5,
    earned: '2,750 SVT',
    color: 'from-cyan-50 to-sky-50',
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-sm font-semibold rounded-full mb-4 border border-indigo-100">
            Student Stories
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Loved by students{' '}
            <span className="gradient-text">worldwide</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Join 28,000+ students already learning, sharing, and earning on StudyVault.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`bg-gradient-to-br ${t.color} rounded-2xl p-6 border border-white shadow-sm hover:shadow-md transition-all card-hover`}
            >
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full border-2 border-white shadow-sm" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Earned</p>
                  <p className="text-sm font-bold text-indigo-600">🪙 {t.earned}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8"
        >
          {[
            { value: '28,392+', label: 'Active Students' },
            { value: '15,847+', label: 'Notes Uploaded' },
            { value: '2.8M+', label: 'SVT Tokens Earned' },
            { value: '4.9★', label: 'Average Rating' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="text-indigo-200 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
