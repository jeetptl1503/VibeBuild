'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import ReactConfetti from 'react-confetti';
import { Clock, Github, Globe, Code2, Send, Save, Edit3, CheckCircle2, AlertCircle, Sparkles, ExternalLink, Tag, X } from 'lucide-react';

export default function DashboardPage() {
    const { user, loading, authFetch } = useAuth();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [settings, setSettings] = useState(null);
    const [timeLeft, setTimeLeft] = useState({});
    const [showConfetti, setShowConfetti] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [techInput, setTechInput] = useState('');

    const [form, setForm] = useState({
        title: '', description: '', githubUrl: '', liveUrl: '', techStack: [],
    });

    useEffect(() => {
        if (!loading && !user) router.push('/login');
        if (!loading && user?.role === 'admin') router.push('/admin');
    }, [user, loading]);

    useEffect(() => {
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
                    });
                }
            });
            fetch('/api/admin/settings').then(r => r.json()).then(data => setSettings(data.settings));
        }
    }, [user]);

    useEffect(() => {
        if (!settings?.workshopEndTime) return;
        const timer = setInterval(() => {
            const diff = new Date(settings.workshopEndTime) - new Date();
            if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0 }); return; }
            setTimeLeft({
                h: Math.floor(diff / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [settings]);

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
        if (!form.title || !form.description || !form.githubUrl) {
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
                body: JSON.stringify({ ...form, status }),
            });
            const data = await res.json();
            if (res.ok) {
                setProject(data.project);
                if (status === 'submitted') {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 5000);
                    setMessage({ type: 'success', text: '🎉 Project submitted successfully!' });
                } else {
                    setMessage({ type: 'success', text: 'Draft saved!' });
                }
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch {
            setMessage({ type: 'error', text: 'Something went wrong' });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !user) return null;

    const progress = project?.status === 'submitted' ? 100 : project ? 60 : 0;

    return (
        <div className="page-container">
            {showConfetti && <ReactConfetti recycle={false} numberOfPieces={300} />}

            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 4 }}>
                            Welcome, <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.name}</span>! 👋
                        </h1>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                            <span className="badge">🎯 {user.domain}</span>
                            <span className="badge" style={{ background: project?.status === 'submitted' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)', color: project?.status === 'submitted' ? '#16a34a' : '#ca8a04', borderColor: project?.status === 'submitted' ? 'rgba(34,197,94,0.2)' : 'rgba(234,179,8,0.2)' }}>
                                {project?.status === 'submitted' ? '✅ Submitted' : project ? '📝 Draft' : '⏳ Not Started'}
                            </span>
                        </div>
                    </div>
                    {/* Countdown */}
                    <GlassCard hover={false} style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <Clock size={16} color="#6366f1" /> <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Time Remaining</span>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            {['h', 'm', 's'].map(unit => (
                                <div key={unit} style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)' }}>
                                        {String(timeLeft[unit] || 0).padStart(2, '0')}
                                    </div>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{unit === 'h' ? 'hrs' : unit === 'm' ? 'min' : 'sec'}</div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </motion.div>

            {/* Progress Bar */}
            <ScrollReveal>
                <GlassCard hover={false} style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Progress</span>
                        <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{progress}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: 'rgba(99,102,241,0.1)', overflow: 'hidden' }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a855f7)' }}
                        />
                    </div>
                </GlassCard>
            </ScrollReveal>

            {/* Submission Form */}
            <ScrollReveal delay={0.1}>
                <GlassCard hover={false} style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Code2 size={20} color="#6366f1" /> Project Submission
                    </h2>

                    {message.text && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '12px 16px', borderRadius: 12, marginBottom: '1rem',
                                background: message.type === 'error' ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
                                border: `1px solid ${message.type === 'error' ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
                                color: message.type === 'error' ? '#dc2626' : '#16a34a',
                                fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8,
                            }}>
                            {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />} {message.text}
                        </motion.div>
                    )}

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                Problem Statement Title *
                            </label>
                            <input className="glow-input" placeholder="e.g. AI-Powered Crop Disease Detection" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                Problem Description *
                            </label>
                            <textarea className="glow-textarea" placeholder="Describe your solution..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                    <Github size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> GitHub URL *
                                </label>
                                <input className="glow-input" placeholder="https://github.com/user/repo" value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                    <Globe size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Live Website URL
                                </label>
                                <input className="glow-input" placeholder="https://yourproject.vercel.app" value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                                <Tag size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Tech Stack
                            </label>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                <input className="glow-input" placeholder="e.g. React" value={techInput} onChange={e => setTechInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} style={{ flex: 1 }} />
                                <button onClick={addTech} className="glow-btn" style={{ padding: '10px 20px' }}>Add</button>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {form.techStack.map((tech, i) => (
                                    <span key={i} className="badge" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        {tech} <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTech(tech)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="glow-btn"
                            onClick={() => handleSubmit('submitted')}
                            disabled={submitting}
                            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                        >
                            <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Project'}
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSubmit('draft')}
                            disabled={submitting}
                            style={{
                                padding: '12px 24px', borderRadius: 14, border: '2px solid rgba(99,102,241,0.3)',
                                background: 'rgba(99,102,241,0.05)', color: 'var(--accent-blue)', fontWeight: 600,
                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem',
                            }}
                        >
                            <Save size={16} /> Save Draft
                        </motion.button>
                    </div>
                </GlassCard>
            </ScrollReveal>

            {/* Submitted Project Preview */}
            {project?.status === 'submitted' && (
                <ScrollReveal delay={0.2}>
                    <GlassCard style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.05), rgba(99,102,241,0.05))' }}>
                        <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckCircle2 size={20} color="#16a34a" /> Submitted Project
                        </h3>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{project.title}</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '8px 0' }}>{project.description}</p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
                            <a href={project.githubUrl} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500, fontSize: '0.85rem' }}>
                                <Github size={16} /> GitHub <ExternalLink size={12} />
                            </a>
                            {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 500, fontSize: '0.85rem' }}>
                                    <Globe size={16} /> Live Demo <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    </GlassCard>
                </ScrollReveal>
            )}
        </div>
    );
}
