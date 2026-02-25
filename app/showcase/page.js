'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { GlassCard, ScrollReveal, SkeletonCard } from '@/components/UIComponents';
import {
    Globe, Github, ExternalLink, Search, Rocket,
    Award, BarChart3, Wallet, GraduationCap, Leaf,
    HeartPulse, Orbit, Cpu, HardDrive, Trash2, Filter
} from 'lucide-react';

const DOMAINS = [
    { name: 'All', icon: <Filter size={16} />, color: '#64748b' },
    { name: 'Fintech', icon: <Wallet size={16} />, color: '#10b981' },
    { name: 'Education', icon: <GraduationCap size={16} />, color: '#6366f1' },
    { name: 'Agriculture and Food Technology', icon: <Leaf size={16} />, color: '#16a34a' },
    { name: 'Health', icon: <HeartPulse size={16} />, color: '#ef4444' },
    { name: 'Space Technology', icon: <Orbit size={16} />, color: '#8b5cf6' },
    { name: 'AI/ML', icon: <Cpu size={16} />, color: '#06b6d4' },
];

export default function ShowcasePage() {
    const { user, authFetch } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [domainFilter, setDomainFilter] = useState('All');
    const [hoveredProject, setHoveredProject] = useState(null);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchData();
    }, [user]);

    async function fetchData() {
        setLoading(true);
        try {
            const res = await fetch('/api/projects/public');
            if (res.ok) {
                const data = await res.json();
                setProjects(data.projects || []);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Permanently delete this project from the Nexus grid?')) return;
        const res = await authFetch(`/api/projects?id=${id}`, { method: 'DELETE' });
        if (res.ok) setProjects(prev => prev.filter(p => (p._id !== id && p.userId !== id)));
    }

    const filtered = projects.filter(p => {
        const matchSearch = !search ||
            p.title?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase()) ||
            p.userName?.toLowerCase().includes(search.toLowerCase());
        const matchDomain = domainFilter === 'All' || p.domain === domainFilter;
        return matchSearch && matchDomain;
    });

    const ProjectCard = ({ project, index }) => {
        const domainIcon = DOMAINS.find(d => d.name === project.domain)?.icon || <Rocket size={16} />;
        const domainColor = DOMAINS.find(d => d.name === project.domain)?.color || '#6366f1';

        return (
            <motion.div
                layout
                whileHover={{ scale: 1.02, rotateY: 2, rotateX: 2 }}
                onMouseEnter={() => setHoveredProject(project._id || project.userId)}
                onMouseLeave={() => setHoveredProject(null)}
                style={{
                    perspective: '1000px',
                    height: '100%'
                }}
            >
                <GlassCard style={{
                    display: 'flex', flexDirection: 'column', height: '100%',
                    padding: '2rem', borderRadius: 28, position: 'relative',
                    border: hoveredProject === (project._id || project.userId) ? `1.5px solid ${domainColor}40` : '1.5px solid var(--border-glass)',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                        <div style={{
                            width: 44, height: 44, borderRadius: 14,
                            background: `${domainColor}10`, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', color: domainColor
                        }}>
                            {domainIcon}
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {project.rating > 0 && (
                                <div style={{
                                    padding: '6px 14px', borderRadius: 20, background: 'rgba(234,179,8,0.1)',
                                    color: '#ca8a04', fontSize: '0.75rem', fontWeight: 800,
                                    display: 'flex', alignItems: 'center', gap: 5
                                }}>
                                    <Award size={14} /> {project.rating}
                                </div>
                            )}
                            {isAdmin && (
                                <button onClick={() => handleDelete(project._id || project.userId)}
                                    style={{ padding: '8px', borderRadius: 12, background: 'rgba(239,68,68,0.05)', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontWeight: 900, fontSize: '1.35rem', marginBottom: 6, lineHeight: 1.2 }}>{project.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {project.userName ? `Operator: ${project.userName}` : `Nexus Unit: ${project.userId}`}
                        </p>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            {project.description?.length > 180 ? project.description.slice(0, 180) + '...' : project.description}
                        </p>

                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            {(project.techStack || []).slice(0, 4).map((t, j) => (
                                <span key={j} style={{
                                    padding: '5px 12px', borderRadius: 10, fontSize: '0.75rem', fontWeight: 700,
                                    background: 'rgba(0,0,0,0.03)', color: 'var(--text-secondary)',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}>{t}</span>
                            ))}
                            {project.techStack?.length > 4 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>+{project.techStack.length - 4} more</span>}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 10, marginTop: 'auto', pt: '1.25rem', borderTop: '1px solid var(--border-glass)' }}>
                        {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                style={{
                                    flex: 1, padding: '10px', borderRadius: 14, textDecoration: 'none', fontSize: '0.85rem',
                                    background: 'rgba(0,0,0,0.04)', color: 'var(--text-primary)', fontWeight: 800,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s',
                                }}>
                                <Github size={16} /> Repository
                            </a>
                        )}
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                style={{
                                    flex: 1, padding: '10px', borderRadius: 14, textDecoration: 'none', fontSize: '0.85rem',
                                    background: domainColor, color: 'white', fontWeight: 800,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    boxShadow: `0 8px 16px ${domainColor}30`
                                }}>
                                <Globe size={16} /> Live Demo
                            </a>
                        )}
                    </div>
                </GlassCard>
            </motion.div>
        );
    };

    return (
        <div className="page-container" style={{ minHeight: '100vh', background: 'radial-gradient(circle at 10% 20%, rgba(99,102,241,0.03) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(168,85,247,0.03) 0%, transparent 40%)' }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 20px', borderRadius: 30, background: 'rgba(99,102,241,0.1)', color: '#6366f1', fontSize: '0.85rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <Orbit size={18} className="spin-slow" /> Nexus Neural Grid
                </div>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', background: 'linear-gradient(135deg, #1e293b, #475569)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>
                    Innovation Showcase
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: 650, margin: '0 auto' }}>
                    Witness the convergence of creativity and intelligence on the VibeBuild grid. Explore next-gen solutions across multiple domains.
                </p>
            </motion.div>

            {/* Enhanced Controls */}
            <ScrollReveal>
                <div style={{ marginBottom: '3.5rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'relative', width: '100%', maxWidth: 500 }}>
                            <Search size={20} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input className="glow-input" placeholder="Search mission protocols, operators, or techs..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 48, height: 56, borderRadius: 20, fontSize: '1rem' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {DOMAINS.map(d => (
                            <motion.button
                                key={d.name}
                                onClick={() => setDomainFilter(d.name)}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    padding: '10px 20px', borderRadius: 16, cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
                                    border: '1.5px solid var(--border-glass)',
                                    background: domainFilter === d.name ? d.color : 'white',
                                    color: domainFilter === d.name ? 'white' : 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    boxShadow: domainFilter === d.name ? `0 10px 20px ${d.color}30` : 'none',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}>
                                {d.icon} {d.name}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </ScrollReveal>

            {/* Nexus Grid */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                    <div style={{ width: 80, height: 80, borderRadius: 40, background: 'rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <HardDrive size={32} color="var(--text-muted)" />
                    </div>
                    <h3 style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: 8 }}>Neural Void Detected</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                        {search || domainFilter !== 'All' ? 'No projects match your current filtration mask.' : 'Initialization complete. Waiting for first mission deployment.'}
                    </p>
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {filtered.map((project, i) => (
                        <ScrollReveal key={project._id || project.userId || i} delay={i * 0.05}>
                            <ProjectCard project={project} index={i} />
                        </ScrollReveal>
                    ))}
                </div>
            )}
        </div>
    );
}

// Add these to globals.css for the extra animations
// .spin-slow { animation: spin 8s linear infinite; }
// @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
