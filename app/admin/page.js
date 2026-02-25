'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import { Shield, Users, Settings, Clock, Plus, Edit3, Trash2, Save, X, Image, BarChart3, UserCheck, Award, Home, Rocket, KeyRound, Send, Sparkles } from 'lucide-react';

export default function AdminPage() {
    const { user, loading, authFetch } = useAuth();
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('participants'); // 'participants' or 'projects'
    const [reviewingProject, setReviewingProject] = useState(null);
    const [reviewForm, setReviewForm] = useState({ rating: 0, score: 0, adminFeedback: '' });

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    }, [user, loading]);

    useEffect(() => {
        if (user?.role === 'admin') {
            authFetch('/api/admin/teams').then(r => r.json()).then(d => setParticipants(d.participants || []));
            authFetch('/api/projects').then(r => r.json()).then(d => setProjects(d.projects || []));
            fetch('/api/admin/settings').then(r => r.json()).then(d => setSettings(d.settings));
        }
    }, [user]);

    const handleAddUser = async () => {
        if (!newUser.userId || !newUser.password || !newUser.name) return;
        if (newUser.password.length < 8) { alert('Password must be at least 8 characters'); return; }
        const res = await authFetch('/api/admin/create-user', { method: 'POST', body: JSON.stringify(newUser) });
        if (res.ok) {
            const data = await res.json();
            setParticipants(prev => [...prev, data.participant]);
            setNewUser({ userId: '', password: '', name: '', email: '' });
            setShowAddUser(false);
        } else {
            const data = await res.json();
            alert(data.error || 'Failed to add participant');
        }
    };

    const handleUpdateUser = async () => {
        if (!editUser) return;
        const res = await authFetch('/api/admin/teams', { method: 'PUT', body: JSON.stringify(editUser) });
        if (res.ok) {
            setParticipants(prev => prev.map(u => u.userId === editUser.userId ? { ...u, ...editUser } : u));
            setEditUser(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm(`Delete participant ${userId}?`)) return;
        const res = await authFetch(`/api/admin/teams?userId=${userId}`, { method: 'DELETE' });
        if (res.ok) setParticipants(prev => prev.filter(u => u.userId !== userId));
    };

    const handleResetPassword = async (userId) => {
        const newPassword = prompt(`Enter new password for ${userId} (min 6 characters):`);
        if (!newPassword || newPassword.length < 6) {
            if (newPassword !== null) alert('Password must be at least 6 characters');
            return;
        }
        const res = await authFetch('/api/admin/reset-password', { method: 'POST', body: JSON.stringify({ userId, newPassword }) });
        if (res.ok) {
            alert(`Password reset successfully for ${userId}`);
        } else {
            const data = await res.json();
            alert(data.error || 'Failed to reset password');
        }
    };

    const handleUpdateSettings = async (key, value) => {
        const update = { [key]: value };
        const res = await authFetch('/api/admin/settings', { method: 'PUT', body: JSON.stringify(update) });
        if (res.ok) {
            const data = await res.json();
            setSettings(data.settings);
        }
    };

    const handleReviewSubmit = async () => {
        if (!reviewingProject) return;
        const res = await authFetch(`/api/projects/${reviewingProject._id || reviewingProject.userId}/review`, {
            method: 'POST',
            body: JSON.stringify(reviewForm)
        });
        if (res.ok) {
            const data = await res.json();
            setProjects(prev => prev.map(p => (p._id === data.project._id || p.userId === data.project.userId) ? data.project : p));
            setReviewingProject(null);
            setReviewForm({ rating: 0, score: 0, adminFeedback: '' });
            alert('Review submitted successfully!');
        } else {
            alert('Failed to submit review');
        }
    };

    const handleDeleteProject = async (id) => {
        if (!confirm('Permanently delete this project?')) return;
        const res = await authFetch(`/api/projects?id=${id}`, { method: 'DELETE' });
        if (res.ok) setProjects(prev => prev.filter(p => p._id !== id && p.userId !== id));
    };

    if (loading || !user || user.role !== 'admin') return null;

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">🚀 Command Center</h1>
                <p className="section-subtitle">Manage workshops, projects, and neural grids</p>
            </motion.div>

            {/* Quick Links */}
            <ScrollReveal>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    {[
                        { icon: <UserCheck size={24} />, label: 'Attendance', href: '/admin/attendance', color: '#6366f1' },
                        { icon: <BarChart3 size={24} />, label: 'Reports', href: '/admin/reports', color: '#8b5cf6' },
                        { icon: <Image size={24} />, label: 'Gallery', href: '/gallery', color: '#ec4899' },
                        { icon: <Rocket size={24} />, label: 'Showcase', href: '/showcase', color: '#06b6d4' },
                        { icon: <Award size={24} />, label: 'Certificates', href: '/certificates', color: '#f59e0b' },
                    ].map((item, i) => (
                        <GlassCard key={i} style={{ cursor: 'pointer', textAlign: 'center', padding: '1.5rem' }} onClick={() => router.push(item.href)}>
                            <div style={{ color: item.color, marginBottom: 8 }}>{item.icon}</div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</div>
                        </GlassCard>
                    ))}
                </div>
            </ScrollReveal>

            {/* Settings & Tabs Container */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 400px) 1fr', gap: '2rem', alignItems: 'start' }}>
                <div style={{ display: 'grid', gap: '2rem' }}>
                    {/* Settings */}
                    <ScrollReveal delay={0.1}>
                        <GlassCard hover={false}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Settings size={20} color="#6366f1" /> System Config
                            </h2>
                            {settings && (
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <button onClick={() => handleUpdateSettings('submissionsEnabled', !settings.submissionsEnabled)}
                                            style={{
                                                padding: '12px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                                                background: settings.submissionsEnabled ? 'rgba(34,197,94,0.1)' : '#f3f4f6', color: settings.submissionsEnabled ? '#16a34a' : '#64748b'
                                            }}>
                                            {settings.submissionsEnabled ? 'Accepting Projects' : 'Projects Paused'}
                                        </button>
                                        <button onClick={() => handleUpdateSettings('galleryPublic', !settings.galleryPublic)}
                                            style={{
                                                padding: '12px', borderRadius: 14, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem',
                                                background: settings.galleryPublic ? 'rgba(99,102,241,0.1)' : '#f3f4f6', color: settings.galleryPublic ? '#6366f1' : '#64748b'
                                            }}>
                                            {settings.galleryPublic ? 'Gallery Visible' : 'Gallery Hidden'}
                                        </button>
                                    </div>
                                    <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: 16 }}>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Workshop End Time</label>
                                        <input type="datetime-local" className="glow-input" value={settings.workshopEndTime ? new Date(settings.workshopEndTime).toISOString().slice(0, 16) : ''}
                                            onChange={e => handleUpdateSettings('workshopEndTime', e.target.value)} style={{ fontSize: '0.85rem' }} />
                                    </div>
                                </div>
                            )}
                        </GlassCard>
                    </ScrollReveal>
                </div>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: 12, padding: 6, background: 'rgba(0,0,0,0.04)', borderRadius: 16, width: 'fit-content' }}>
                        <button onClick={() => setActiveTab('participants')} style={{
                            padding: '8px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700,
                            background: activeTab === 'participants' ? 'white' : 'transparent', color: activeTab === 'participants' ? 'var(--accent-blue)' : 'var(--text-muted)',
                            boxShadow: activeTab === 'participants' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s'
                        }}>Participants</button>
                        <button onClick={() => setActiveTab('projects')} style={{
                            padding: '8px 24px', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700,
                            background: activeTab === 'projects' ? 'white' : 'transparent', color: activeTab === 'projects' ? 'var(--accent-blue)' : 'var(--text-muted)',
                            boxShadow: activeTab === 'projects' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s'
                        }}>Projects Review</button>
                    </div>

                    <ScrollReveal delay={0.2}>
                        <GlassCard hover={false} style={{ minHeight: 400 }}>
                            {activeTab === 'participants' ? (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Participant Registry</h2>
                                        <button className="glow-btn" onClick={() => setShowAddUser(!showAddUser)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>+ New Nexus ID</button>
                                    </div>

                                    {showAddUser && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.5rem', padding: '1.25rem', borderRadius: 20, border: '1.5px dashed var(--border-glass)', background: 'rgba(99,102,241,0.02)' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                                                <input className="glow-input" placeholder="User ID" value={newUser.userId} onChange={e => setNewUser(f => ({ ...f, userId: e.target.value.toUpperCase() }))} />
                                                <input className="glow-input" placeholder="Neural Path (Password)" type="password" value={newUser.password} onChange={e => setNewUser(f => ({ ...f, password: e.target.value }))} />
                                                <input className="glow-input" placeholder="Full Identity Name" value={newUser.name} onChange={e => setNewUser(f => ({ ...f, name: e.target.value }))} />
                                            </div>
                                            <button className="glow-btn" onClick={handleAddUser} style={{ padding: '10px 24px' }}>Authorize Identity</button>
                                        </motion.div>
                                    )}

                                    <div style={{ display: 'grid', gap: '0.75rem' }}>
                                        {participants.map(p => (
                                            <div key={p.userId} style={{ padding: '1.25rem', borderRadius: 20, background: 'white', border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <span style={{ fontWeight: 800, color: 'var(--accent-blue)', display: 'block', fontSize: '0.8rem' }}>{p.userId}</span>
                                                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{p.name}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button onClick={() => handleResetPassword(p.userId)} style={{ padding: 10, borderRadius: 12, background: 'rgba(234,179,8,0.05)', color: '#ca8a04', border: 'none', cursor: 'pointer' }}><KeyRound size={16} /></button>
                                                    <button onClick={() => handleDeleteUser(p.userId)} style={{ padding: 10, borderRadius: 12, background: 'rgba(239,68,68,0.05)', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Neural Grid Audits</h2>
                                        <div className="badge">{projects.length} ACTIVE MISSIONS</div>
                                    </div>

                                    <div style={{ display: 'grid', gap: '1rem' }}>
                                        {projects.map(p => (
                                            <motion.div key={p.userId} layout style={{ padding: '1.5rem', borderRadius: 24, background: 'rgba(0,0,0,0.01)', border: '1.5px solid var(--border-glass)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>{p.domain} • {p.teamName || 'NO TEAM'}</div>
                                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{p.title}</h3>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>by {p.userName} ({p.userId})</div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <button onClick={() => { setReviewingProject(p); setReviewForm({ rating: p.rating || 0, score: p.score || 0, adminFeedback: p.adminFeedback || '' }); }}
                                                            className="glow-btn" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Audit Mission</button>
                                                        <button onClick={() => handleDeleteProject(p._id || p.userId)} style={{ padding: 10, borderRadius: 12, background: 'rgba(239,68,68,0.05)', color: '#ef4444', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                                    </div>
                                                </div>

                                                {(p.rating > 0 || p.score > 0) && (
                                                    <div style={{ display: 'flex', gap: 16, marginTop: '1rem', pt: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 800, color: '#6366f1' }}>
                                                            <Award size={16} /> RATING: {p.rating}/5
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 800, color: '#a855f7' }}>
                                                            <BarChart3 size={16} /> SCORE: {p.score}%
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                        {projects.length === 0 && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No neural missions deployed on the grid.</div>}
                                    </div>
                                </>
                            )}
                        </GlassCard>
                    </ScrollReveal>
                </div>
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {reviewingProject && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                            style={{ background: 'white', padding: '2.5rem', borderRadius: 32, width: '100%', maxWidth: 500, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Neural Audit: {reviewingProject.title}</h2>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>Assess the technical problem statement and domain integration.</p>

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: 8 }}>Expert Rating (1.0 - 5.0)</label>
                                    <input type="number" step="0.1" min="0" max="5" className="glow-input" value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: parseFloat(e.target.value) }))} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: 8 }}>Integrity Score (0 - 100%)</label>
                                    <input type="number" min="0" max="100" className="glow-input" value={reviewForm.score} onChange={e => setReviewForm(f => ({ ...f, score: parseInt(e.target.value) }))} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, marginBottom: 8 }}>Neural Feedback (Brief)</label>
                                    <textarea className="glow-textarea" style={{ minHeight: 100 }} placeholder="Technical assessment..." value={reviewForm.adminFeedback} onChange={e => setReviewForm(f => ({ ...f, adminFeedback: e.target.value }))} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 12, marginTop: '2.5rem' }}>
                                <button className="glow-btn" onClick={handleReviewSubmit} style={{ flex: 1, padding: '14px' }}>Finalize Audit</button>
                                <button onClick={() => setReviewingProject(null)} style={{ padding: '14px 24px', borderRadius: 16, border: 'none', background: '#f3f4f6', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

