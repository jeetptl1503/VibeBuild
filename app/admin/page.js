'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import { Shield, Users, Settings, Clock, Plus, Edit3, Trash2, Save, X, Image, BarChart3, UserCheck, Award, Home, Rocket } from 'lucide-react';

export default function AdminPage() {
    const { user, loading, authFetch } = useAuth();
    const router = useRouter();
    const [teams, setTeams] = useState([]);
    const [settings, setSettings] = useState(null);
    const [showAddTeam, setShowAddTeam] = useState(false);
    const [editTeam, setEditTeam] = useState(null);
    const [newTeam, setNewTeam] = useState({ teamId: '', password: '', name: '', domain: 'Healthcare AI' });

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    }, [user, loading]);

    useEffect(() => {
        if (user?.role === 'admin') {
            authFetch('/api/admin/teams').then(r => r.json()).then(d => setTeams(d.teams || []));
            fetch('/api/admin/settings').then(r => r.json()).then(d => setSettings(d.settings));
        }
    }, [user]);

    const handleAddTeam = async () => {
        if (!newTeam.teamId || !newTeam.password || !newTeam.name) return;
        const res = await authFetch('/api/admin/teams', { method: 'POST', body: JSON.stringify(newTeam) });
        if (res.ok) {
            const data = await res.json();
            setTeams(prev => [...prev, data.team]);
            setNewTeam({ teamId: '', password: '', name: '', domain: 'Healthcare AI' });
            setShowAddTeam(false);
        }
    };

    const handleUpdateTeam = async () => {
        if (!editTeam) return;
        const res = await authFetch('/api/admin/teams', { method: 'PUT', body: JSON.stringify(editTeam) });
        if (res.ok) {
            setTeams(prev => prev.map(t => t.teamId === editTeam.teamId ? { ...t, ...editTeam } : t));
            setEditTeam(null);
        }
    };

    const handleDeleteTeam = async (teamId) => {
        if (!confirm(`Delete team ${teamId}?`)) return;
        const res = await authFetch(`/api/admin/teams?teamId=${teamId}`, { method: 'DELETE' });
        if (res.ok) setTeams(prev => prev.filter(t => t.teamId !== teamId));
    };

    const handleUpdateSettings = async (key, value) => {
        const update = { [key]: value };
        const res = await authFetch('/api/admin/settings', { method: 'PUT', body: JSON.stringify(update) });
        if (res.ok) {
            const data = await res.json();
            setSettings(data.settings);
        }
    };

    if (loading || !user || user.role !== 'admin') return null;

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">🚀 Command Center</h1>
                <p className="section-subtitle">Manage workshops, teams, and configurations</p>
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

            {/* Settings */}
            <ScrollReveal delay={0.1}>
                <GlassCard hover={false} style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Settings size={20} color="#6366f1" /> Workshop Settings
                    </h2>
                    {settings && (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 500 }}>Submissions Enabled</span>
                                <button
                                    className={`toggle-switch ${settings.submissionsEnabled ? 'active' : ''}`}
                                    onClick={() => handleUpdateSettings('submissionsEnabled', !settings.submissionsEnabled)}
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 500 }}>Gallery Public</span>
                                <button
                                    className={`toggle-switch ${settings.galleryPublic ? 'active' : ''}`}
                                    onClick={() => handleUpdateSettings('galleryPublic', !settings.galleryPublic)}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Workshop End Time</label>
                                <input
                                    type="datetime-local"
                                    className="glow-input"
                                    value={settings.workshopEndTime ? new Date(settings.workshopEndTime).toISOString().slice(0, 16) : ''}
                                    onChange={e => handleUpdateSettings('workshopEndTime', e.target.value)}
                                    style={{ maxWidth: 300 }}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: 500, display: 'block', marginBottom: 6 }}>Announcement</label>
                                <input
                                    className="glow-input"
                                    placeholder="Workshop announcement..."
                                    value={settings.announcement || ''}
                                    onChange={e => handleUpdateSettings('announcement', e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </GlassCard>
            </ScrollReveal>

            {/* Team Management */}
            <ScrollReveal delay={0.2}>
                <GlassCard hover={false}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                            <Users size={20} color="#6366f1" /> Teams ({teams.length})
                        </h2>
                        <button className="glow-btn" onClick={() => setShowAddTeam(!showAddTeam)} style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Plus size={16} /> Add Team
                        </button>
                    </div>

                    {/* Add Team Form */}
                    <AnimatePresence>
                        {showAddTeam && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                style={{ overflow: 'hidden', marginBottom: '1rem' }}>
                                <div style={{ padding: '1rem', borderRadius: 14, background: 'rgba(99,102,241,0.03)', border: '1px dashed rgba(99,102,241,0.2)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                                        <input className="glow-input" placeholder="Team ID" value={newTeam.teamId} onChange={e => setNewTeam(f => ({ ...f, teamId: e.target.value.toUpperCase() }))} />
                                        <input className="glow-input" placeholder="Password" value={newTeam.password} onChange={e => setNewTeam(f => ({ ...f, password: e.target.value }))} />
                                        <input className="glow-input" placeholder="Team Name" value={newTeam.name} onChange={e => setNewTeam(f => ({ ...f, name: e.target.value }))} />
                                        <select className="glow-input" value={newTeam.domain} onChange={e => setNewTeam(f => ({ ...f, domain: e.target.value }))}>
                                            <option>Healthcare AI</option>
                                            <option>Agriculture AI</option>
                                            <option>Smart Cities</option>
                                            <option>Education Tech</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem' }}>
                                        <button className="glow-btn" onClick={handleAddTeam} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                                            <Save size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} /> Save
                                        </button>
                                        <button onClick={() => setShowAddTeam(false)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-glass)', background: 'white', cursor: 'pointer' }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Teams List */}
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {teams.map(team => (
                            <motion.div key={team.teamId} layout
                                style={{
                                    padding: '1rem 1.25rem', borderRadius: 14,
                                    background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border-glass)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem',
                                }}>
                                {editTeam?.teamId === team.teamId ? (
                                    <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <input className="glow-input" value={editTeam.name} onChange={e => setEditTeam(f => ({ ...f, name: e.target.value }))} style={{ flex: 1, minWidth: 150, padding: '8px 12px' }} />
                                        <select className="glow-input" value={editTeam.domain} onChange={e => setEditTeam(f => ({ ...f, domain: e.target.value }))} style={{ width: 160, padding: '8px 12px' }}>
                                            <option>Healthcare AI</option><option>Agriculture AI</option><option>Smart Cities</option><option>Education Tech</option>
                                        </select>
                                        <button onClick={handleUpdateTeam} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--accent-blue)', color: 'white', border: 'none', cursor: 'pointer' }}><Save size={14} /></button>
                                        <button onClick={() => setEditTeam(null)} style={{ padding: '6px 12px', borderRadius: 8, background: '#eee', border: 'none', cursor: 'pointer' }}><X size={14} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <span style={{ fontWeight: 700, marginRight: 8 }}>{team.teamId}</span>
                                            <span style={{ color: 'var(--text-secondary)' }}>{team.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span className="badge">{team.domain}</span>
                                            <button onClick={() => setEditTeam({ teamId: team.teamId, name: team.name, domain: team.domain })}
                                                style={{ padding: '6px', borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)' }}>
                                                <Edit3 size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteTeam(team.teamId)}
                                                style={{ padding: '6px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </GlassCard>
            </ScrollReveal>
        </div>
    );
}
