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
    const [participants, setParticipants] = useState([]);
    const [settings, setSettings] = useState(null);
    const [showAddUser, setShowAddUser] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [newUser, setNewUser] = useState({ userId: '', password: '', name: '' });

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    }, [user, loading]);

    useEffect(() => {
        if (user?.role === 'admin') {
            authFetch('/api/admin/teams').then(r => r.json()).then(d => setParticipants(d.participants || []));
            fetch('/api/admin/settings').then(r => r.json()).then(d => setSettings(d.settings));
        }
    }, [user]);

    const handleAddUser = async () => {
        if (!newUser.userId || !newUser.password || !newUser.name) return;
        const res = await authFetch('/api/admin/teams', { method: 'POST', body: JSON.stringify(newUser) });
        if (res.ok) {
            const data = await res.json();
            setParticipants(prev => [...prev, data.participant]);
            setNewUser({ userId: '', password: '', name: '' });
            setShowAddUser(false);
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

    if (loading || !user || user.role !== 'admin') return null;

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">🚀 Command Center</h1>
                <p className="section-subtitle">Manage workshops, participants, and configurations</p>
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
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Settings size={18} color="white" />
                        </div>
                        Workshop Settings
                    </h2>
                    {settings && (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {/* Toggle Cards Row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {/* Submissions Toggle */}
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    style={{
                                        padding: '1.25rem', borderRadius: 16,
                                        background: settings.submissionsEnabled
                                            ? 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(34,197,94,0.02))'
                                            : 'rgba(248,248,252,0.6)',
                                        border: `1.5px solid ${settings.submissionsEnabled ? 'rgba(34,197,94,0.2)' : 'rgba(200,200,220,0.3)'}`,
                                        cursor: 'pointer', transition: 'all 0.3s ease',
                                    }}
                                    onClick={() => handleUpdateSettings('submissionsEnabled', !settings.submissionsEnabled)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 8,
                                            background: settings.submissionsEnabled ? 'rgba(34,197,94,0.12)' : 'rgba(150,150,170,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Send size={16} color={settings.submissionsEnabled ? '#16a34a' : '#9ca3af'} />
                                        </div>
                                        <div style={{
                                            width: 44, height: 24, borderRadius: 12,
                                            background: settings.submissionsEnabled ? 'linear-gradient(90deg, #22c55e, #16a34a)' : '#d1d5db',
                                            padding: 2, transition: 'all 0.3s ease',
                                        }}>
                                            <motion.div
                                                animate={{ x: settings.submissionsEnabled ? 20 : 0 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                style={{ width: 20, height: 20, borderRadius: 10, background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>Submissions</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                        {settings.submissionsEnabled ? '✅ Accepting project submissions' : '⏸️ Submissions paused'}
                                    </div>
                                </motion.div>

                                {/* Gallery Toggle */}
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    style={{
                                        padding: '1.25rem', borderRadius: 16,
                                        background: settings.galleryPublic
                                            ? 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.02))'
                                            : 'rgba(248,248,252,0.6)',
                                        border: `1.5px solid ${settings.galleryPublic ? 'rgba(99,102,241,0.2)' : 'rgba(200,200,220,0.3)'}`,
                                        cursor: 'pointer', transition: 'all 0.3s ease',
                                    }}
                                    onClick={() => handleUpdateSettings('galleryPublic', !settings.galleryPublic)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 8,
                                            background: settings.galleryPublic ? 'rgba(99,102,241,0.12)' : 'rgba(150,150,170,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Image size={16} color={settings.galleryPublic ? '#6366f1' : '#9ca3af'} />
                                        </div>
                                        <div style={{
                                            width: 44, height: 24, borderRadius: 12,
                                            background: settings.galleryPublic ? 'linear-gradient(90deg, #6366f1, #8b5cf6)' : '#d1d5db',
                                            padding: 2, transition: 'all 0.3s ease',
                                        }}>
                                            <motion.div
                                                animate={{ x: settings.galleryPublic ? 20 : 0 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                                style={{ width: 20, height: 20, borderRadius: 10, background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>Gallery</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                        {settings.galleryPublic ? '👁️ Visible to everyone' : '🔒 Hidden from public'}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Timer Card */}
                            <div style={{
                                padding: '1.25rem', borderRadius: 16,
                                background: 'linear-gradient(135deg, rgba(236,72,153,0.04), rgba(249,115,22,0.03))',
                                border: '1.5px solid rgba(236,72,153,0.15)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        background: 'rgba(236,72,153,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Clock size={16} color="#ec4899" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Workshop End Time</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Controls the countdown timer on dashboards</div>
                                    </div>
                                </div>
                                <input
                                    type="datetime-local"
                                    className="glow-input"
                                    value={settings.workshopEndTime ? new Date(settings.workshopEndTime).toISOString().slice(0, 16) : ''}
                                    onChange={e => handleUpdateSettings('workshopEndTime', e.target.value)}
                                    style={{ maxWidth: 320, fontSize: '0.9rem' }}
                                />
                            </div>

                            {/* Announcement Card */}
                            <div style={{
                                padding: '1.25rem', borderRadius: 16,
                                background: 'linear-gradient(135deg, rgba(245,158,11,0.04), rgba(234,179,8,0.02))',
                                border: '1.5px solid rgba(245,158,11,0.15)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        background: 'rgba(245,158,11,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Sparkles size={16} color="#f59e0b" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Announcement</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shown on the landing page to all visitors</div>
                                    </div>
                                </div>
                                <input
                                    className="glow-input"
                                    placeholder="Type your workshop announcement here..."
                                    value={settings.announcement || ''}
                                    onChange={e => handleUpdateSettings('announcement', e.target.value)}
                                    style={{ fontSize: '0.9rem' }}
                                />
                            </div>
                        </div>
                    )}
                </GlassCard>
            </ScrollReveal>

            {/* Participant Management */}
            <ScrollReveal delay={0.2}>
                <GlassCard hover={false}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                            <Users size={20} color="#6366f1" /> Participants ({participants.length})
                        </h2>
                        <button className="glow-btn" onClick={() => setShowAddUser(!showAddUser)} style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Plus size={16} /> Add Participant
                        </button>
                    </div>

                    {/* Add Participant Form */}
                    <AnimatePresence>
                        {showAddUser && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                style={{ overflow: 'hidden', marginBottom: '1rem' }}>
                                <div style={{ padding: '1rem', borderRadius: 14, background: 'rgba(99,102,241,0.03)', border: '1px dashed rgba(99,102,241,0.2)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                                        <input className="glow-input" placeholder="User ID" value={newUser.userId} onChange={e => setNewUser(f => ({ ...f, userId: e.target.value.toUpperCase() }))} />
                                        <input className="glow-input" placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser(f => ({ ...f, password: e.target.value }))} />
                                        <input className="glow-input" placeholder="Full Name" value={newUser.name} onChange={e => setNewUser(f => ({ ...f, name: e.target.value }))} />
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: '0.75rem' }}>
                                        <button className="glow-btn" onClick={handleAddUser} style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                                            <Save size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} /> Save
                                        </button>
                                        <button onClick={() => setShowAddUser(false)} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-glass)', background: 'white', cursor: 'pointer' }}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Participants List */}
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        {participants.map(p => (
                            <motion.div key={p.userId} layout
                                style={{
                                    padding: '1rem 1.25rem', borderRadius: 14,
                                    background: 'rgba(255,255,255,0.5)', border: '1px solid var(--border-glass)',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem',
                                }}>
                                {editUser?.userId === p.userId ? (
                                    <div style={{ flex: 1, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                        <input className="glow-input" value={editUser.name} onChange={e => setEditUser(f => ({ ...f, name: e.target.value }))} style={{ flex: 1, minWidth: 150, padding: '8px 12px' }} />
                                        <button onClick={handleUpdateUser} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--accent-blue)', color: 'white', border: 'none', cursor: 'pointer' }}><Save size={14} /></button>
                                        <button onClick={() => setEditUser(null)} style={{ padding: '6px 12px', borderRadius: 8, background: '#eee', border: 'none', cursor: 'pointer' }}><X size={14} /></button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <span style={{ fontWeight: 700, marginRight: 8 }}>{p.userId}</span>
                                            <span style={{ color: 'var(--text-secondary)' }}>{p.name}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span className="badge">Participant</span>
                                            <button onClick={() => setEditUser({ userId: p.userId, name: p.name })}
                                                title="Edit name"
                                                style={{ padding: '6px', borderRadius: 8, background: 'rgba(99,102,241,0.1)', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)' }}>
                                                <Edit3 size={14} />
                                            </button>
                                            <button onClick={() => handleResetPassword(p.userId)}
                                                title="Reset password"
                                                style={{ padding: '6px', borderRadius: 8, background: 'rgba(234,179,8,0.1)', border: 'none', cursor: 'pointer', color: '#ca8a04' }}>
                                                <KeyRound size={14} />
                                            </button>
                                            <button onClick={() => handleDeleteUser(p.userId)}
                                                title="Delete user"
                                                style={{ padding: '6px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                        {participants.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                No participants added yet. Click &quot;Add Participant&quot; to get started.
                            </div>
                        )}
                    </div>
                </GlassCard>
            </ScrollReveal>
        </div>
    );
}
