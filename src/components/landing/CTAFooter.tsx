'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Twitter, Github, Globe, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section id="cta" className="py-24 bg-mesh">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-3xl p-12 shadow-2xl shadow-indigo-200 relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              Join 28,000+ students already earning
            </div>

            <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-white mb-5">
              Your knowledge is worth money.
              <br />Start earning today.
            </h2>
            <p className="text-indigo-200 text-lg mb-8 max-w-xl mx-auto">
              Upload your first notes in under 2 minutes. Get AI summaries, earn SVT tokens,
              and join the future of decentralized education.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="xl" className="bg-white text-indigo-700 hover:bg-indigo-50 shadow-xl gap-2 font-bold w-full sm:w-auto">
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button size="xl" variant="outline" className="border-white/40 text-white hover:bg-white/10 w-full sm:w-auto">
                  Browse Notes
                </Button>
              </Link>
            </div>

            <p className="text-indigo-300 text-xs mt-6">
              No credit card required · Free to join · Earn immediately
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const footerLinks = {
  Product: ['Marketplace', 'Upload Notes', 'NFT Notes', 'AI Summaries', 'Token Rewards'],
  Community: ['Discord', 'Twitter', 'Blog', 'Contributors', 'Leaderboard'],
  Resources: ['Documentation', 'Smart Contracts', 'API Reference', 'Whitepaper', 'Roadmap'],
  Company: ['About Us', 'Careers', 'Privacy Policy', 'Terms of Service', 'Contact'],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">StudyVault</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              The decentralized AI-powered notes sharing platform for students. Learn. Share. Earn.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, href: '#' },
                { icon: Github, href: '#' },
                { icon: Globe, href: '#' },
                { icon: Mail, href: '#' },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-white text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">© 2025 StudyVault. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-gray-600">All systems operational · Ethereum Mainnet</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
