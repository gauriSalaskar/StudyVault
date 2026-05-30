'use client';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, X, Sparkles, Crown, CheckCircle,
  Brain, Zap, Image as ImageIcon, Loader2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { showToast } from '@/components/ui/toast';
import { useAppStore } from '@/store/appStore';
import { generateAISummary } from '@/lib/aiService';
import { uploadFileToIPFS } from '@/lib/ipfsService';
import { generateMockIpfsHash, SUBJECTS, UNIVERSITIES } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Note } from '@/types';
import { cn } from '@/lib/utils';

const ALLOWED_TYPES = ['application/pdf', 'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'];

const STEPS = ['Upload File', 'Add Details', 'AI Analysis', 'Publish'];

export default function UploadPage() {
  const { addUploadedNote, updateTokenBalance, user } = useAppStore();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', subject: '', university: user?.university || '',
    tags: '', price: '0', isFree: true, mintAsNFT: false,
  });
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setFile(accepted[0]);
      // Pre-fill title from filename
      const name = accepted[0].name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      update('title', name.charAt(0).toUpperCase() + name.slice(1));
      setStep(1);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  const runAIAnalysis = async () => {
    if (!form.title || !form.subject) {
      showToast.warning('Please fill in title and subject first');
      return;
    }
    setStep(2);
    setAnalyzing(true);
    const result = await generateAISummary(file?.name || form.title);
    setAiAnalysis(result);
    setAnalyzing(false);
    showToast.success('AI analysis complete!');
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      // Upload file to Supabase Storage
      let fileUrl = '';
      let ipfsHash = generateMockIpfsHash();
      if (file) {
        const result = await uploadFileToIPFS(file);
        fileUrl = result.url;
        ipfsHash = result.hash;
      }

      const noteId = `note_${Date.now()}`;
      const newNote: Note = {
        id: noteId,
        title: form.title,
        description: form.description || aiAnalysis?.summary || 'User uploaded notes.',
        subject: form.subject,
        university: form.university,
        fileType: (file?.name.split('.').pop() as any) || 'pdf',
        fileSize: file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : '1 MB',
        ipfsHash,
        uploadedBy: user?.id || '0x0',
        uploaderName: user?.name || 'Anonymous',
        uploadedAt: new Date().toISOString().split('T')[0],
        downloads: 0,
        rating: 0,
        ratingCount: 0,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        isNFT: form.mintAsNFT,
        nftTokenId: form.mintAsNFT ? String(Math.floor(Math.random() * 1000)) : undefined,
        price: form.isFree ? 0 : parseInt(form.price) || 25,
        isFree: form.isFree,
        aiSummary: aiAnalysis?.summary,
      };

      // Save to Supabase database
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('notes').insert({
          id: noteId,
          title: newNote.title,
          description: newNote.description,
          subject: newNote.subject,
          university: newNote.university,
          file_type: newNote.fileType,
          file_size: newNote.fileSize,
          ipfs_hash: ipfsHash,
          file_url: fileUrl,
          uploaded_by: session.user.id,
          uploader_name: newNote.uploaderName,
          uploaded_at: newNote.uploadedAt,
          downloads: 0,
          rating: 0,
          rating_count: 0,
          tags: newNote.tags,
          is_nft: newNote.isNFT,
          nft_token_id: newNote.nftTokenId,
          price: newNote.price,
          is_free: newNote.isFree,
          ai_summary: newNote.aiSummary,
        });
      }

      addUploadedNote(newNote);
      const reward = 50 + (form.mintAsNFT ? 25 : 0);
      updateTokenBalance(reward);
      showToast.token(reward, form.mintAsNFT ? 'Upload + NFT Mint reward!' : 'Upload reward earned!');
    } catch (err) {
      showToast.error('Upload failed. Please try again.');
      console.error(err);
    }
    setPublishing(false);
    setPublished(true);
    setStep(3);
  };

  if (published) {
    return (
      <DashboardLayout title="Upload Notes">
        <div className="max-w-lg mx-auto py-16 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </div>
          </motion.div>
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Notes Published! 🎉</h2>
          <p className="text-gray-500 mb-2">Your notes are now live on the marketplace and stored on IPFS.</p>
          <p className="text-indigo-600 font-semibold mb-8">+{50 + (form.mintAsNFT ? 25 : 0)} SVT tokens earned!</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => { setPublished(false); setStep(0); setFile(null); setAiAnalysis(null); setForm({ title: '', description: '', subject: '', university: user?.university || '', tags: '', price: '0', isFree: true, mintAsNFT: false }); }}>
              Upload Another
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/marketplace'}>
              View Marketplace
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Upload Notes" subtitle="Share your knowledge and earn SVT tokens">
      <div className="max-w-2xl mx-auto">
        {/* Step indicators */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
                i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
              )}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={cn('text-xs font-medium hidden sm:block', i === step ? 'text-indigo-600' : 'text-gray-400')}>{s}</span>
              {i < STEPS.length - 1 && <div className={cn('w-8 sm:w-16 h-0.5 ml-1', i < step ? 'bg-emerald-300' : 'bg-gray-200')} />}
            </div>
          ))}
        </div>

        {/* Step 0: File drop */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all',
                  isDragActive ? 'border-indigo-500 bg-indigo-50 scale-[1.01]' : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
                )}
              >
                <input {...getInputProps()} />
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Upload className={cn('w-8 h-8', isDragActive ? 'text-indigo-600 animate-bounce' : 'text-indigo-400')} />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-800 mb-2">
                  {isDragActive ? 'Drop it here!' : 'Upload Your Notes'}
                </h3>
                <p className="text-gray-500 text-sm mb-4">Drag & drop or click to browse your files</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['PDF', 'PPT', 'PPTX', 'DOC', 'DOCX', 'TXT'].map(type => (
                    <Badge key={type} variant="outline" className="text-xs">{type}</Badge>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">Max file size: 50 MB</p>
              </div>

              {/* Earning info */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { icon: '🪙', title: 'Upload Bonus', value: '+50 SVT' },
                  { icon: '⬇️', title: 'Per Download', value: '+5–20 SVT' },
                  { icon: '💎', title: 'NFT Mint Bonus', value: '+25 SVT' },
                ].map(item => (
                  <div key={item.title} className="bg-white rounded-xl border border-gray-100 p-3 text-center shadow-sm">
                    <span className="text-xl block mb-1">{item.icon}</span>
                    <p className="text-xs text-gray-500">{item.title}</p>
                    <p className="text-sm font-bold text-indigo-600">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 1: Details */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-5">
                {/* File preview */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{file?.name}</p>
                    <p className="text-xs text-gray-400">{file ? (file.size / 1024 / 1024).toFixed(2) : '0'} MB</p>
                  </div>
                  <button onClick={() => { setFile(null); setStep(0); }}>
                    <X className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
                  <Input placeholder="e.g. Advanced Calculus Complete Guide" value={form.title} onChange={e => update('title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                  <textarea
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                    rows={3} placeholder="Briefly describe your notes..." value={form.description}
                    onChange={e => update('description', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Subject *</label>
                    <select className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={form.subject} onChange={e => update('subject', e.target.value)}>
                      <option value="">Select subject</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">University</label>
                    <select className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={form.university} onChange={e => update('university', e.target.value)}>
                      <option value="">Select university</option>
                      {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tags (comma separated)</label>
                  <Input placeholder="calculus, derivatives, MIT, exam prep" value={form.tags} onChange={e => update('tags', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">Pricing</label>
                  <div className="flex gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={form.isFree} onChange={() => update('isFree', true)} className="accent-indigo-600" />
                      <span className="text-sm font-medium text-gray-700">Free</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={!form.isFree} onChange={() => update('isFree', false)} className="accent-indigo-600" />
                      <span className="text-sm font-medium text-gray-700">Paid</span>
                    </label>
                  </div>
                  {!form.isFree && (
                    <div className="mt-2">
                      <Input type="number" placeholder="25" value={form.price} onChange={e => update('price', e.target.value)}
                        suffix={<span className="text-xs font-bold text-indigo-500">SVT</span>} className="max-w-xs" />
                    </div>
                  )}
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.mintAsNFT} onChange={e => update('mintAsNFT', e.target.checked)} className="w-4 h-4 accent-amber-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-semibold text-amber-800">Mint as NFT (+25 SVT bonus)</span>
                      </div>
                      <p className="text-xs text-amber-600 mt-0.5">Creates blockchain-verified ownership. Earn royalties on future resales.</p>
                    </div>
                  </label>
                </div>

                <Button className="w-full gap-2" onClick={runAIAnalysis}>
                  <Sparkles className="w-4 h-4" /> Analyze with AI & Continue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: AI Analysis */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                    <Brain className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-gray-900">AI Analysis</h3>
                    <p className="text-xs text-gray-500">Powered by Gemini AI</p>
                  </div>
                </div>

                {analyzing ? (
                  <div className="space-y-4 py-8 text-center">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mx-auto" />
                    <p className="text-sm font-medium text-gray-700">Analyzing your notes...</p>
                    <div className="space-y-2 max-w-xs mx-auto">
                      {['Reading document structure...', 'Extracting key concepts...', 'Generating summary...'].map((msg, i) => (
                        <p key={i} className="text-xs text-gray-400">{msg}</p>
                      ))}
                    </div>
                  </div>
                ) : aiAnalysis ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
                      <p className="text-xs font-semibold text-violet-600 mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Summary
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">{aiAnalysis.summary}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Difficulty</p>
                        <Badge variant={aiAnalysis.difficulty === 'Beginner' ? 'success' : aiAnalysis.difficulty === 'Advanced' ? 'destructive' : 'default'} className="text-xs">
                          {aiAnalysis.difficulty}
                        </Badge>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Read Time</p>
                        <p className="text-sm font-bold text-gray-800">{aiAnalysis.estimatedReadTime} min</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400 mb-1">Topics</p>
                        <p className="text-sm font-bold text-gray-800">{aiAnalysis.topics.length}</p>
                      </div>
                    </div>
                    <Button className="w-full gap-2" onClick={() => setStep(3)}>
                      <Zap className="w-4 h-4" /> Looks great — Publish Now!
                    </Button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          )}

          {/* Step 3: Publish */}
          {step === 3 && !published && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-display font-bold text-gray-900 text-xl mb-4">Ready to Publish</h3>
                <div className="space-y-3 mb-6">
                  {[
                    { label: 'Title', value: form.title },
                    { label: 'Subject', value: form.subject || '—' },
                    { label: 'University', value: form.university || '—' },
                    { label: 'Price', value: form.isFree ? 'Free' : `${form.price} SVT` },
                    { label: 'NFT', value: form.mintAsNFT ? 'Yes — will be minted on Ethereum' : 'No' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm font-semibold text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl mb-5">
                  <p className="text-xs font-semibold text-indigo-700">📦 Upload Process</p>
                  <p className="text-xs text-indigo-500 mt-0.5">File → IPFS Storage → Marketplace Listing → Token Reward{form.mintAsNFT ? ' → NFT Mint' : ''}</p>
                </div>
                <Button className="w-full h-12 text-base font-semibold gap-2" onClick={handlePublish} isLoading={publishing}>
                  <Upload className="w-5 h-5" />
                  {publishing ? 'Publishing to IPFS...' : `Publish & Earn ${50 + (form.mintAsNFT ? 25 : 0)} SVT`}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
