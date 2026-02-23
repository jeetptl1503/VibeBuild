'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { GlassCard, ScrollReveal, AnimatedCounter } from '@/components/UIComponents';
import { UserCheck, Plus, Edit3, Trash2, Save, X, Download, Search } from 'lucide-react';

export default function AttendancePage() {
    const { user, loading, authFetch } = useAuth();
    const router = useRouter();
    const [records, setRecords] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [search, setSearch] = useState('');
    const [form, setForm] = useState({
        participantName: '', teamName: '', email: '',
        firstHalf: false, secondHalf: false, remarks: '',
    });

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    }, [user, loading]);

    useEffect(() => {
        if (user?.role === 'admin') loadRecords();
    }, [user]);

    const loadRecords = () => {
        authFetch('/api/attendance').then(r => r.json()).then(d => setRecords(d.records || []));
    };

    const handleSubmit = async () => {
        if (!form.participantName || !form.teamName || !form.email) return;
        if (editRecord) {
            const res = await authFetch(`/api/attendance/${editRecord._id}`, { method: 'PUT', body: JSON.stringify(form) });
            if (res.ok) { loadRecords(); setEditRecord(null); setShowForm(false); resetForm(); }
        } else {
            const res = await authFetch('/api/attendance', { method: 'POST', body: JSON.stringify(form) });
            if (res.ok) { loadRecords(); setShowForm(false); resetForm(); }
        }
    };

    const handleEdit = (record) => {
        setEditRecord(record);
        setForm({
            participantName: record.participantName, teamName: record.teamName,
            email: record.email, firstHalf: record.firstHalf,
            secondHalf: record.secondHalf, remarks: record.remarks || '',
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this record?')) return;
        const res = await authFetch(`/api/attendance/${id}`, { method: 'DELETE' });
        if (res.ok) setRecords(prev => prev.filter(r => r._id !== id));
    };

    const resetForm = () => {
        setForm({ participantName: '', teamName: '', email: '', firstHalf: false, secondHalf: false, remarks: '' });
        setEditRecord(null);
    };

    const exportCSV = () => {
        const headers = ['Name', 'Team', 'Email', 'First Half', 'Second Half', 'Remarks'];
        const rows = records.map(r => [r.participantName, r.teamName, r.email, r.firstHalf ? 'Present' : 'Absent', r.secondHalf ? 'Present' : 'Absent', r.remarks]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'attendance.csv'; a.click();
    };

    const filtered = records.filter(r =>
        r.participantName?.toLowerCase().includes(search.toLowerCase()) ||
        r.teamName?.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        total: records.length,
        firstHalf: records.filter(r => r.firstHalf).length,
        secondHalf: records.filter(r => r.secondHalf).length,
    };

    if (loading || !user || user.role !== 'admin') return null;

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">📋 Attendance Management</h1>
                <p className="section-subtitle">Track participant attendance for both workshop halves</p>
            </motion.div>

            {/* Stats */}
            <ScrollReveal>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    <AnimatedCounter end={stats.total} label="Total Participants" icon="👥" />
                    <AnimatedCounter end={stats.firstHalf} label="First Half Present" icon="☀️" />
                    <AnimatedCounter end={stats.secondHalf} label="Second Half Present" icon="🌙" />
                </div>
            </ScrollReveal>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button className="glow-btn" onClick={() => { setShowForm(!showForm); resetForm(); }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Plus size={16} /> Add Record
                </button>
                <button onClick={exportCSV} style={{
                    padding: '12px 24px', borderRadius: 14, border: '2px solid rgba(99,102,241,0.3)',
                    background: 'rgba(99,102,241,0.05)', color: 'var(--accent-blue)', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.95rem',
                }}>
                    <Download size={16} /> Export CSV
                </button>
                <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input className="glow-input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36, padding: '10px 14px 10px 36px' }} />
                    </div>
                </div>
            </div>

            {/* Form */}
            <AnimatePresence>
                {showForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <GlassCard hover={false} style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>{editRecord ? 'Edit Record' : 'Add New Record'}</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                <input className="glow-input" placeholder="Participant Name *" value={form.participantName} onChange={e => setForm(f => ({ ...f, participantName: e.target.value }))} />
                                <input className="glow-input" placeholder="Team Name *" value={form.teamName} onChange={e => setForm(f => ({ ...f, teamName: e.target.value }))} />
                                <input className="glow-input" placeholder="Email *" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                                <input className="glow-input" placeholder="Remarks" value={form.remarks} onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} />
                            </div>
                            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>First Half (Before Lunch)</span>
                                    <button className={`toggle-switch ${form.firstHalf ? 'active' : ''}`}
                                        onClick={() => setForm(f => ({ ...f, firstHalf: !f.firstHalf }))} />
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Second Half (After Lunch)</span>
                                    <button className={`toggle-switch ${form.secondHalf ? 'active' : ''}`}
                                        onClick={() => setForm(f => ({ ...f, secondHalf: !f.secondHalf }))} />
                                </label>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginTop: '1rem' }}>
                                <button className="glow-btn" onClick={handleSubmit} style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                                    <Save size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                                    {editRecord ? 'Update' : 'Save'}
                                </button>
                                <button onClick={() => { setShowForm(false); resetForm(); }} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border-glass)', background: 'white', cursor: 'pointer', fontSize: '0.9rem' }}>Cancel</button>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Records Table */}
            <GlassCard hover={false}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-glass)' }}>
                                {['Name', 'Team', 'Email', 'First Half', 'Second Half', 'Remarks', 'Actions'].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '12px 10px', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(record => (
                                <motion.tr key={record._id} layout style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                    <td style={{ padding: '10px' }}>{record.participantName}</td>
                                    <td style={{ padding: '10px' }}>{record.teamName}</td>
                                    <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{record.email}</td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ color: record.firstHalf ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                                            {record.firstHalf ? '✅ Present' : '❌ Absent'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px' }}>
                                        <span style={{ color: record.secondHalf ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
                                            {record.secondHalf ? '✅ Present' : '❌ Absent'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{record.remarks}</td>
                                    <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                                        <button onClick={() => handleEdit(record)} style={{ padding: 6, borderRadius: 6, background: 'rgba(99,102,241,0.1)', border: 'none', cursor: 'pointer', marginRight: 4, color: 'var(--accent-blue)' }}><Edit3 size={14} /></button>
                                        <button onClick={() => handleDelete(record._id)} style={{ padding: 6, borderRadius: 6, background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={14} /></button>
                                    </td>
                                </motion.tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No attendance records yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
}
