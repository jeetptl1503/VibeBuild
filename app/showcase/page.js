'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { GlassCard, ScrollReveal, SkeletonCard } from '@/components/UIComponents';
import { Globe, Github, ExternalLink, Search, Layers, Plus, X, Send, Trash2, Edit3, ChevronDown, BookOpen, Code2, AlertCircle, CheckCircle2 } from 'lucide-react';

const DOMAINS = ['All', 'Healthcare AI', 'Agriculture AI', 'Smart Cities', 'Education Tech'];

export default function ShowcasePage() {
    const { user, authFetch } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [domainFilter, setDomainFilter] = useState('All');
    const [showSubmit, setShowSubmit] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState('');
    const [form, setForm] = useState({
        title: '', domain: 'Healthcare AI', problemStatement: '', description: '', githubUrl: '', liveUrl: '',
    });

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchData();
    }, [user]);

    async function fetchData() {
        setLoading(true);
        try {
            let res;
            if (isAdmin) {
                res = await authFetch('/api/projects');
            } else {
                res = await fetch('/api/projects/public');
            }
            if (res.ok) {
                const data = await res.json();
                setProjects(data.projects || []);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.title || !form.description || !form.githubUrl) return;
        setSubmitting(true);
        try {
            const res = await authFetch('/api/projects', {
                method: 'POST',
                body: JSON.stringify({ ...form, status: 'submitted' }),
            });
            if (res.ok) {
                setToast('Project submitted successfully!');
                setTimeout(() => setToast(''), 3000);
                setShowSubmit(false);
                setForm({ title: '', domain: 'Healthcare AI', problemStatement: '', description: '', githubUrl: '', liveUrl: '' });
                fetchData();
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this project?')) return;
        const res = await authFetch(`/api/projects/${id}`, { method: 'DELETE' });
        if (res.ok) setProjects(prev => prev.filter(p => p._id !== id));
    }

    const filtered = projects.filter(p => {
        const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()) || p.teamName?.toLowerCase().includes(search.toLowerCase());
        const matchDomain = domainFilter === 'All' || p.domain === domainFilter;
        return matchSearch && matchDomain;
    });

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">🌍 Project Showcase</h1>
                <p className="section-subtitle">Explore AI innovations built by our participants</p>
            </motion.div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 90, right: 24, zIndex: 1000, padding: '14px 20px', borderRadius: 14,
                            background: 'rgba(16,185,129,0.9)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
                            boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                        }}>
                        <CheckCircle2 size={18} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls */}
            <ScrollReveal>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1 1 250px' }}>
                        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input className="glow-input" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 42 }} />
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {DOMAINS.map(d => (
                            <button key={d} onClick={() => setDomainFilter(d)}
                                style={{
                                    padding: '8px 14px', borderRadius: 20, cursor: 'pointer', fontWeight: 500, fontSize: '0.82rem',
                                    border: '1px solid var(--border-glass)',
                                    background: domainFilter === d ? 'var(--accent-blue)' : 'rgba(255,255,255,0.6)',
                                    color: domainFilter === d ? 'white' : 'var(--text-secondary)',
                                    transition: 'all 0.2s',
                                }}>
                                {d}
                            </button>
                        ))}
                    </div>
                    {user && user.role !== 'admin' && (
                        <button className="glow-btn" onClick={() => setShowSubmit(!showSubmit)} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {showSubmit ? <X size={18} /> : <Plus size={18} />}
                            {showSubmit ? 'Cancel' : 'Submit Project'}
                        </button>
                    )}
                </div>
            </ScrollReveal>

            {/* Submit Project Form (Students only) */}
            <AnimatePresence>
                {showSubmit && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <GlassCard hover={false} style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Send size={18} color="#6366f1" /> Submit Your Project
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Project Title *</label>
                                        <input className="glow-input" placeholder="e.g. AI Health Monitor" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Domain</label>
                                        <select className="glow-input" value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}>
                                            {DOMAINS.filter(d => d !== 'All').map(d => <option key={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Problem Statement</label>
                                        <input className="glow-input" placeholder="What problem does this solve?" value={form.problemStatement} onChange={e => setForm(f => ({ ...f, problemStatement: e.target.value }))} />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Description *</label>
                                        <textarea className="glow-input" placeholder="Tell us about your project..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} required style={{ resize: 'vertical' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>GitHub Repo Link *</label>
                                        <input className="glow-input" placeholder="https://github.com/user/repo" value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} type="url" required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Live Demo Link</label>
                                        <input className="glow-input" placeholder="https://your-project.vercel.app" value={form.liveUrl} onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} type="url" />
                                    </div>
                                </div>
                                <motion.button type="submit" className="glow-btn" disabled={submitting} whileTap={{ scale: 0.98 }}
                                    style={{ marginTop: '1rem', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Send size={16} /> {submitting ? 'Submitting...' : 'Submit Project'}
                                </motion.button>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Projects Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
                    <Globe size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No projects found</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {search || domainFilter !== 'All' ? 'Try adjusting your search or filter' : 'Projects will appear here once submitted'}
                    </p>
                </GlassCard>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.25rem' }}>
                    {filtered.map((project, i) => (
                        <ScrollReveal key={project._id || i} delay={i * 0.05}>
                            <GlassCard style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <div>
                                        <h3 style={{ fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>{project.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: '2px 0' }}>{project.teamName || project.userName || project.userId}</p>
                                    </div>
                                    <span className="badge">{project.domain}</span>
                                </div>

                                {project.problemStatement && (
                                    <div style={{
                                        padding: '8px 12px', borderRadius: 10, marginBottom: '0.75rem',
                                        background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)',
                                        fontSize: '0.82rem', color: 'var(--accent-blue)',
                                    }}>
                                        <BookOpen size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                        {project.problemStatement}
                                    </div>
                                )}

                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', flex: 1, lineHeight: 1.6, margin: '0 0 0.75rem' }}>
                                    {project.description?.length > 160 ? project.description.slice(0, 160) + '...' : project.description}
                                </p>

                                {project.techStack?.length > 0 && (
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                        {project.techStack.map((t, j) => (
                                            <span key={j} style={{
                                                padding: '3px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 500,
                                                background: 'rgba(139,92,246,0.07)', color: '#7c3aed',
                                            }}>{t}</span>
                                        ))}
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                            style={{
                                                padding: '8px 14px', borderRadius: 10, textDecoration: 'none', fontSize: '0.82rem',
                                                background: 'rgba(0,0,0,0.04)', color: 'var(--text-primary)', fontWeight: 500,
                                                display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s',
                                            }}>
                                            <Github size={14} /> GitHub
                                        </a>
                                    )}
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                            style={{
                                                padding: '8px 14px', borderRadius: 10, textDecoration: 'none', fontSize: '0.82rem',
                                                background: 'var(--accent-blue)', color: 'white', fontWeight: 500,
                                                display: 'flex', alignItems: 'center', gap: 6,
                                            }}>
                                            <ExternalLink size={14} /> Live Demo
                                        </a>
                                    )}
                                    {isAdmin && (
                                        <button onClick={() => handleDelete(project._id)}
                                            style={{ marginLeft: 'auto', padding: '8px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </GlassCard>
                        </ScrollReveal>
                    ))}
                </div>
            )}
        </div>
    );
}
