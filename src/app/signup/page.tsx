'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/components/ui/toast';
import { useAppStore } from '@/store/appStore';
import { UNIVERSITIES, SUBJECTS } from '@/lib/utils';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', email: '', password: '', university: '', subject: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (form.password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSignup = async () => {
    setLoading(true);
    const success = await signup(form.email, form.password, form.name, form.university, form.subject);
    setLoading(false);
    if (success) {
      showToast.success('Account created! 100 SVT tokens added 🎉');
      router.push('/dashboard');
    } else {
      showToast.error('Signup failed. Email may already be in use.');
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-2xl text-gray-900">StudyVault</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Start earning with your first upload 🎉</p>
        </motion.div>

        <div className="flex items-center gap-2 mb-6 px-1">
          {[1, 2].map(s => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-indigo-500' : 'bg-gray-200'}`} />
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8"
        >
          {step === 1 ? (
            <>
              <h2 className="font-display font-semibold text-gray-900 mb-5">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Full Name</label>
                  <Input placeholder="Alex Chen" value={form.name} onChange={e => update('name', e.target.value)}
                    icon={<User className="w-4 h-4" />} error={errors.name} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                  <Input type="email" placeholder="you@university.edu" value={form.email} onChange={e => update('email', e.target.value)}
                    icon={<Mail className="w-4 h-4" />} error={errors.email} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
                  <Input type="password" placeholder="••••••••" value={form.password} onChange={e => update('password', e.target.value)}
                    icon={<Lock className="w-4 h-4" />} error={errors.password} />
                </div>
                <Button onClick={handleNext} className="w-full h-11 text-base font-semibold">
                  Continue →
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="font-display font-semibold text-gray-900 mb-5">Academic Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">University</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={form.university} onChange={e => update('university', e.target.value)}
                    >
                      <option value="">Select University</option>
                      {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Primary Subject</label>
                  <select
                    className="w-full h-10 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={form.subject} onChange={e => update('subject', e.target.value)}
                  >
                    <option value="">Select Subject</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs font-semibold text-indigo-700 mb-1">🎁 Welcome Bonus</p>
                  <p className="text-xs text-indigo-600">You'll receive 100 SVT tokens on sign up!</p>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">← Back</Button>
                  <Button onClick={handleSignup} isLoading={loading} className="flex-1 h-11 font-semibold">
                    Create Account 🚀
                  </Button>
                </div>
              </div>
            </>
          )}

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
