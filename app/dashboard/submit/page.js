'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import ReactConfetti from 'react-confetti';
import {
    Github, Globe, Code2, Send, Save, CheckCircle2, AlertCircle,
    X, Rocket, Wallet, GraduationCap, Leaf, HeartPulse,
    Orbit, Cpu, Edit3, ArrowLeft, Trash2, Plus
} from 'lucide-react';

const PREDEFINED_DOMAINS = [
    { id: 'fintech', name: 'Fintech', icon: <Wallet size={24} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
    { id: 'education', name: 'Education', icon: <GraduationCap size={24} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
    { id: 'agriculture', name: 'Agriculture and Food Technology', icon: <Leaf size={24} />, color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
    { id: 'health', name: 'Health', icon: <HeartPulse size={24} />, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { id: 'space', name: 'Space Technology', icon: <Orbit size={24} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
    { id: 'ai-ml', name: 'AI/ML', icon: <Cpu size={24} />, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
    { id: 'custom', name: 'Custom', icon: <Plus size={24} />, color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
];

export default function ProjectSubmissionPage() {
    const { user, loading, authFetch } = useAuth();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [team, setTeam] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [techInput, setTechInput] = useState('');
    const [customDomain, setCustomDomain] = useState('');

    const [form, setForm] = useState({
        title: '', description: '', githubUrl: '', liveUrl: '',
        techStack: [], domain: 'AI/ML'
    });

    useEffect(() => {
        if (!loading && !user) router.push('/login');
        if (user) {
            authFetch('/api/projects').then(r => r.json()).then(data => {
                if (data.project) {
                    setProject(data.project);
                    setForm({
                        title: data.project.title || '',
                        description: data.project.description || '',
                        githubUrl: data.project.githubUrl || '',
                        liveUrl: data.project.liveUrl || '',
                        techStack: data.project.techStack || [],
                        domain: data.project.domain || 'AI/ML'
                    });
                    if (!PREDEFINED_DOMAINS.find(d => d.name === data.project.domain)) {
                        setCustomDomain(data.project.domain);
                    }
                }
            });
            authFetch('/api/teams').then(r => r.json()).then(data => setTeam(data.team));
        }
    }, [user, loading]);

    const addTech = () => {
        if (techInput.trim() && !form.techStack.includes(techInput.trim())) {
            setForm(f => ({ ...f, techStack: [...f.techStack, techInput.trim()] }));
            setTechInput('');
        }
    };

    const removeTech = (tech) => {
        setForm(f => ({ ...f, techStack: f.techStack.filter(t => t !== tech) }));
    };

    const handleSubmit = async (status = 'submitted') => {
        setMessage({ type: '', text: '' });
        const finalDomain = form.domain === 'Custom' ? customDomain : form.domain;

        if (!form.title || !form.description || !form.githubUrl || !finalDomain) {
            setMessage({ type: 'error', text: 'Please fill in all required fields' });
            return;
        }

        const githubRegex = /^https?:\/\/(www\.)?github\.com\/.+\/.+/;
        if (!githubRegex.test(form.githubUrl)) {
            setMessage({ type: 'error', text: 'Please enter a valid GitHub URL' });
            return;
        }

        setSubmitting(true);
        try {
            const res = await authFetch('/api/projects', {
                method: 'POST',
                body: JSON.stringify({ ...form, domain: finalDomain, status }),
            });
            const data = await res.json();
            if (res.ok) {
                setProject(data.project);
                if (status === 'submitted') {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 5000);
                    setMessage({ type: 'success', text: '🚀 Project deployed to Nexus successfully!' });
                } else {
                    setMessage({ type: 'success', text: 'Core systems updated. Draft saved.' });
                }
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch {
            setMessage({ type: 'error', text: 'System breach detected. Failed to submit.' });
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to terminate this project? All data will be wiped.')) return;
        try {
            const res = await authFetch('/api/projects', { method: 'DELETE' });
            if (res.ok) {
                setProject(null);
                setForm({ title: '', description: '', githubUrl: '', liveUrl: '', techStack: [], domain: 'AI/ML' });
                setMessage({ type: 'success', text: 'Project terminated successfully.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete project.' });
        }
    };

    if (loading || !user) return null;

    return (
        <div className="page-container" style={{ maxWidth: 1000, margin: '0 auto' }}>
            {showConfetti && <ReactConfetti recycle={false} numberOfPieces={300} gravity={0.1} colors={['#6366f1', '#a855f7', '#06b6d4']} />}

            <button onClick={() => router.push('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 600 }}>
                <ArrowLeft size={18} /> Back to Hub
            </button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8, background: 'linear-gradient(135deg, #1e293b, #475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Mission Briefing
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: 600 }}>
                        Initialize your project on the Nexus grid. Define your domain, problem statement, and technical specifications.
                    </p>
                </div>
            </motion.div>

            {message.text && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    style={{
                        padding: '1rem 1.5rem', borderRadius: 20, marginBottom: '2rem',
                        background: message.type === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                        border: `1.2px solid ${message.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
                        color: message.type === 'error' ? '#dc2626' : '#16a34a',
                        fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                    {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />} {message.text}
                </motion.div>
            )}

            <div style={{ display: 'grid', gap: '2.5rem' }}>
                {/* Domain Selection */}
                <ScrollReveal>
                    <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                            Select Project Domain
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                            {PREDEFINED_DOMAINS.map((d) => (
                                <motion.div
                                    key={d.id}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setForm(f => ({ ...f, domain: d.name }))}
                                    style={{
                                        cursor: 'pointer', padding: '1.25rem', borderRadius: 24, textAlign: 'center',
                                        background: form.domain === d.name ? d.bg : 'white',
                                        border: `2px solid ${form.domain === d.name ? d.color : 'var(--border-glass)'}`,
                                        transition: 'all 0.3s ease',
                                        boxShadow: form.domain === d.name ? `0 10px 25px ${d.color}20` : 'none',
                                    }}
                                >
                                    <div style={{ color: d.color, marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
                                        {d.icon}
                                    </div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: form.domain === d.name ? d.color : 'var(--text-secondary)' }}>
                                        {d.name.split(' ')[0]}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <AnimatePresence>
                            {form.domain === 'Custom' && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8 }}>Define Custom Domain</label>
                                    <input className="glow-input" placeholder="e.g. Quantum Computing" value={customDomain} onChange={e => setCustomDomain(e.target.value)} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </ScrollReveal>

                {/* Main Form */}
                <ScrollReveal delay={0.1}>
                    <GlassCard hover={false} style={{ padding: '2.5rem', borderRadius: 32 }}>
                        <div style={{ display: 'grid', gap: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Problem Statement Title *</label>
                                <input className="glow-input" style={{ fontSize: '1.1rem', padding: '16px 20px' }} placeholder="What are you solving?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Architecture & Solution *</label>
                                <textarea className="glow-textarea" style={{ minHeight: 180, padding: '20px' }} placeholder="Provide a deep dive into your solution architecture and problem statement integration..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
                                        <Github size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} /> GitHub Repository *
                                    </label>
                                    <input className="glow-input" placeholder="https://github.com/your-org/repo" value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>
                                        <Globe size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} /> Nexus Live Endpoint
                                    </label>
                                    <input className="glow-input" placeholder="https://your-app.vercel.app" value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>Neural Stack (Technologies)</label>
                                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                                    <input className="glow-input" placeholder="e.g. PyTorch" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} style={{ flex: 1 }} />
                                    <button onClick={addTech} className="glow-btn" style={{ padding: '0 24px' }}>Add Component</button>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {form.techStack.map((tech, i) => (
                                        <motion.span initial={{ scale: 0.8 }} animate={{ scale: 1 }} key={i} className="badge" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, background: 'rgba(99,102,241,0.05)', color: '#6366f1', border: '1px solid rgba(99,102,241,0.1)' }}>
                                            {tech} <X size={14} style={{ cursor: 'pointer', opacity: 0.6 }} onClick={() => removeTech(tech)} />
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem', pt: '2rem', borderTop: '1px solid var(--border-glass)' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <motion.button whileTap={{ scale: 0.96 }} className="glow-btn" onClick={() => handleSubmit('submitted')} disabled={submitting} style={{ padding: '14px 32px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <Send size={18} /> {submitting ? 'Initializing...' : 'Deploy to Nexus'}
                                </motion.button>
                                <button onClick={() => handleSubmit('draft')} disabled={submitting} style={{ padding: '14px 28px', borderRadius: 16, border: '1.5px solid rgba(99,102,241,0.3)', background: 'transparent', color: '#6366f1', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}>
                                    Save System Draft
                                </button>
                            </div>

                            {project && (
                                <button onClick={handleDelete} style={{ color: '#ef4444', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', padding: '10px 18px', borderRadius: 14, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Trash2 size={16} /> Terminate Project
                                </button>
                            )}
                        </div>
                    </GlassCard>
                </ScrollReveal>
            </div>
        </div>
    );
}
