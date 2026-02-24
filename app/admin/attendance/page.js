'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import { UserCheck, Plus, Trash2, Save, X, Search, Download, CheckCircle2, Hash, User, MessageSquare } from 'lucide-react';

export default function AttendancePage() {
    const { user, loading, authFetch } = useAuth();
    const router = useRouter();
    const [records, setRecords] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [search, setSearch] = useState('');
    const [toast, setToast] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        participantName: '', studentId: '', firstHalf: false, secondHalf: false, remarks: '',
    });

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    }, [user, loading]);

    useEffect(() => {
        if (user?.role === 'admin') fetchRecords();
    }, [user]);

    async function fetchRecords() {
        setFetching(true);
        try {
            const res = await authFetch('/api/attendance');
            if (res.ok) {
                const data = await res.json();
                setRecords(data.records || []);
            }
        } finally {
            setFetching(false);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (!form.participantName || !form.studentId) return;
        setSubmitting(true);
        try {
            const res = await authFetch('/api/attendance', { method: 'POST', body: JSON.stringify(form) });
            if (res.ok) {
                const data = await res.json();
                setRecords(prev => [data.record, ...prev]);
                setForm({ participantName: '', studentId: '', firstHalf: false, secondHalf: false, remarks: '' });
                setShowAdd(false);
                setToast('Attendance recorded!');
                setTimeout(() => setToast(''), 3000);
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this record?')) return;
        const res = await authFetch(`/api/attendance/${id}`, { method: 'DELETE' });
        if (res.ok) setRecords(prev => prev.filter(r => r._id !== id));
    }

    function exportCSV() {
        const csv = [
            'Student Name,Student ID,First Half,Second Half,Remarks,Date',
            ...records.map(r => `"${r.participantName}","${r.studentId}",${r.firstHalf},${r.secondHalf},"${r.remarks || ''}","${new Date(r.createdAt).toLocaleDateString()}"`),
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'attendance.csv'; a.click();
        window.URL.revokeObjectURL(url);
    }

    const filtered = records.filter(r => {
        if (!search) return true;
        const q = search.toLowerCase();
        return r.participantName?.toLowerCase().includes(q) || r.studentId?.toLowerCase().includes(q);
    });

    if (loading || !user || user.role !== 'admin') return null;

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">📋 Attendance</h1>
                <p className="section-subtitle">Track participant attendance</p>
            </motion.div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 90, right: 24, zIndex: 1000, padding: '14px 20px', borderRadius: 14, background: 'rgba(16,185,129,0.9)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={18} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls */}
            <ScrollReveal>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: '1 1 250px' }}>
                        <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input className="glow-input" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 42 }} />
                    </div>
                    <button onClick={exportCSV} style={{ padding: '10px 16px', borderRadius: 12, border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, fontSize: '0.85rem' }}>
                        <Download size={16} /> Export CSV
                    </button>
                    <button className="glow-btn" onClick={() => setShowAdd(!showAdd)} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {showAdd ? <X size={18} /> : <Plus size={18} />}
                        {showAdd ? 'Cancel' : 'Add Entry'}
                    </button>
                </div>
            </ScrollReveal>

            {/* Add Form */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <GlassCard hover={false} style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <UserCheck size={18} color="#6366f1" /> Add Attendance Entry
                            </h3>
                            <form onSubmit={handleAdd}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                                            <User size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Student Name *
                                        </label>
                                        <input className="glow-input" placeholder="e.g. John Doe" value={form.participantName} onChange={e => setForm(f => ({ ...f, participantName: e.target.value }))} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                                            <Hash size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Student ID *
                                        </label>
                                        <input className="glow-input" placeholder="e.g. 25EC080" value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value.toUpperCase() }))} required />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                            <input type="checkbox" checked={form.firstHalf} onChange={e => setForm(f => ({ ...f, firstHalf: e.target.checked }))}
                                                style={{ width: 18, height: 18, accentColor: 'var(--accent-blue)', cursor: 'pointer' }} />
                                            <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>First Half</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                            <input type="checkbox" checked={form.secondHalf} onChange={e => setForm(f => ({ ...f, secondHalf: e.target.checked }))}
                                                style={{ width: 18, height: 18, accentColor: 'var(--accent-blue)', cursor: 'pointer' }} />
                                            <span style={{ fontWeight: 500, fontSize: '0.85rem' }}>Second Half</span>
                                        </label>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                                            <MessageSquare size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} /> Remarks
                                        </label>
                                        <input className="glow-input" placeholder="Optional notes..." value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} />
                                    </div>
                                </div>
                                <motion.button type="submit" className="glow-btn" disabled={submitting} whileTap={{ scale: 0.98 }}
                                    style={{ marginTop: '1rem', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Save size={16} /> {submitting ? 'Saving...' : 'Save Entry'}
                                </motion.button>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Records List */}
            <ScrollReveal>
                <div style={{
                    background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(14px)', borderRadius: 18,
                    border: '1px solid var(--border-glass)', overflow: 'hidden',
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'grid', gridTemplateColumns: '2fr 1.5fr 80px 80px 1.5fr 50px',
                        padding: '0.75rem 1.25rem', background: 'rgba(99,102,241,0.03)',
                        borderBottom: '1px solid var(--border-glass)', fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-secondary)',
                        gap: '0.5rem',
                    }}>
                        <span>Student Name</span><span>Student ID</span><span>1st Half</span><span>2nd Half</span><span>Remarks</span><span></span>
                    </div>

                    {/* Rows */}
                    {fetching ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
                    ) : filtered.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No attendance records yet</div>
                    ) : (
                        filtered.map((rec, i) => (
                            <motion.div key={rec._id || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                                style={{
                                    display: 'grid', gridTemplateColumns: '2fr 1.5fr 80px 80px 1.5fr 50px',
                                    padding: '0.75rem 1.25rem', gap: '0.5rem', alignItems: 'center',
                                    borderBottom: '1px solid rgba(200,210,255,0.15)', fontSize: '0.88rem',
                                }}>
                                <span style={{ fontWeight: 600 }}>{rec.participantName}</span>
                                <span style={{ fontFamily: 'monospace', color: 'var(--accent-blue)' }}>{rec.studentId}</span>
                                <span>{rec.firstHalf ? '✅' : '❌'}</span>
                                <span>{rec.secondHalf ? '✅' : '❌'}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{rec.remarks || '—'}</span>
                                <button onClick={() => handleDelete(rec._id)} title="Delete"
                                    style={{ padding: '4px', borderRadius: 6, background: 'rgba(239,68,68,0.08)', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                                    <Trash2 size={14} />
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal delay={0.1}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                    <GlassCard style={{ textAlign: 'center', padding: '1.25rem' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-blue)' }}>{records.length}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Entries</div>
                    </GlassCard>
                    <GlassCard style={{ textAlign: 'center', padding: '1.25rem' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>{records.filter(r => r.firstHalf && r.secondHalf).length}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Full Day</div>
                    </GlassCard>
                    <GlassCard style={{ textAlign: 'center', padding: '1.25rem' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{records.filter(r => r.firstHalf !== r.secondHalf).length}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 500 }}>Half Day</div>
                    </GlassCard>
                </div>
            </ScrollReveal>
        </div>
    );
}
