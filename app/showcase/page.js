'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard, ScrollReveal, SkeletonCard } from '@/components/UIComponents';
import { Github, Globe, Search, Filter, ExternalLink } from 'lucide-react';

const domains = ['All', 'Healthcare AI', 'Agriculture AI', 'Smart Cities', 'Education Tech'];

export default function ShowcasePage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeDomain, setActiveDomain] = useState('All');

    useEffect(() => {
        fetch('/api/projects/public').then(r => r.json()).then(data => {
            setProjects(data.projects || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const filtered = projects.filter(p => {
        const matchDomain = activeDomain === 'All' || p.domain === activeDomain;
        const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.teamName?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase());
        return matchDomain && matchSearch;
    });

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">🌍 Project Showcase</h1>
                <p className="section-subtitle">Explore innovative AI-driven solutions built by our teams</p>
            </motion.div>

            {/* Search & Filters */}
            <ScrollReveal>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
                        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input className="glow-input" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 42 }} />
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {domains.map(d => (
                            <button key={d} onClick={() => setActiveDomain(d)}
                                style={{
                                    padding: '8px 16px', borderRadius: 20, border: '1px solid',
                                    borderColor: activeDomain === d ? 'var(--accent-blue)' : 'var(--border-glass)',
                                    background: activeDomain === d ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.5)',
                                    color: activeDomain === d ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                    fontWeight: 500, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                                }}>
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            </ScrollReveal>

            {/* Projects Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>No projects found</p>
                </GlassCard>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    {filtered.map((project, i) => (
                        <ScrollReveal key={project._id || i} delay={i * 0.05}>
                            <motion.div
                                className="glass-card"
                                whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(99,102,241,0.15)' }}
                                style={{ padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 4, lineHeight: 1.3 }}>{project.title}</h3>
                                        <p style={{ color: 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: 600 }}>{project.teamName}</p>
                                    </div>
                                    <span className="badge" style={{ flexShrink: 0 }}>{project.domain}</span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1, marginBottom: 12 }}>
                                    {project.description?.substring(0, 150)}{project.description?.length > 150 ? '...' : ''}
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                                    {project.techStack?.map((tech, j) => (
                                        <span key={j} style={{
                                            padding: '3px 10px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600,
                                            background: 'rgba(99,102,241,0.08)', color: 'var(--accent-purple)',
                                        }}>{tech}</span>
                                    ))}
                                </div>
                                <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border-glass)', paddingTop: 12 }}>
                                    <a href={project.githubUrl} target="_blank" rel="noopener"
                                        style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500, transition: 'color 0.2s' }}
                                        onMouseOver={e => e.currentTarget.style.color = 'var(--accent-blue)'}
                                        onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                                        <Github size={16} /> GitHub <ExternalLink size={12} />
                                    </a>
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noopener"
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500, transition: 'color 0.2s' }}
                                            onMouseOver={e => e.currentTarget.style.color = 'var(--accent-purple)'}
                                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                                            <Globe size={16} /> Live Demo <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                            </motion.div>
                        </ScrollReveal>
                    ))}
                </div>
            )}
        </div>
    );
}
