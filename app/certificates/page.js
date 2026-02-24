'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import { Award, Plus, Trash2, Search, Download, User, Hash, FileText, CheckCircle2, X } from 'lucide-react';

export default function CertificatesPage() {
    const { user, loading, authFetch } = useAuth();
    const [certificates, setCertificates] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [toast, setToast] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        studentName: '', studentId: '', certificateUrl: '', certificateType: 'participation',
    });

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (user) fetchCertificates();
    }, [user]);

    async function fetchCertificates() {
        setFetching(true);
        try {
            const res = await authFetch('/api/certificates');
            if (res.ok) {
                const data = await res.json();
                setCertificates(data.certificates || []);
            }
        } finally {
            setFetching(false);
        }
    }

    async function handleAdd(e) {
        e.preventDefault();
        if (!form.studentName || !form.studentId) return;
        setSubmitting(true);
        try {
            const res = await authFetch('/api/certificates', { method: 'POST', body: JSON.stringify(form) });
            if (res.ok) {
                const data = await res.json();
                setCertificates(prev => [data.certificate, ...prev]);
                setForm({ studentName: '', studentId: '', certificateUrl: '', certificateType: 'participation' });
                setShowAdd(false);
                setToast('Certificate added!');
                setTimeout(() => setToast(''), 3000);
            }
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this certificate?')) return;
        const res = await authFetch(`/api/certificates/${id}`, { method: 'DELETE' });
        if (res.ok) setCertificates(prev => prev.filter(c => c._id !== id));
    }

    if (loading) return null;

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">🏅 Certificates</h1>
                <p className="section-subtitle">{isAdmin ? 'Issue and manage certificates' : 'View your earned certificates'}</p>
            </motion.div>

            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 90, right: 24, zIndex: 1000, padding: '14px 20px', borderRadius: 14, background: 'rgba(16,185,129,0.9)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}>
                        <CheckCircle2 size={18} /> {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Admin: Add Certificate */}
            {isAdmin && (
                <ScrollReveal>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="glow-btn" onClick={() => setShowAdd(!showAdd)} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {showAdd ? <X size={18} /> : <Plus size={18} />}
                            {showAdd ? 'Cancel' : 'Issue Certificate'}
                        </button>
                    </div>
                </ScrollReveal>
            )}

            {/* Add Certificate Form */}
            <AnimatePresence>
                {showAdd && isAdmin && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <GlassCard hover={false} style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Award size={18} color="#f59e0b" /> Issue New Certificate
                            </h3>
                            <form onSubmit={handleAdd}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                                            <User size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                            Student Name *
                                        </label>
                                        <input className="glow-input" placeholder="e.g. John Doe" value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                                            <Hash size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                            Student ID *
                                        </label>
                                        <input className="glow-input" placeholder="e.g. 25EC080" value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value.toUpperCase() }))} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Certificate Type</label>
                                        <select className="glow-input" value={form.certificateType} onChange={e => setForm(f => ({ ...f, certificateType: e.target.value }))}>
                                            <option value="participation">Participation</option>
                                            <option value="completion">Completion</option>
                                            <option value="excellence">Excellence</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Certificate URL</label>
                                        <input className="glow-input" placeholder="https://drive.google.com/..." value={form.certificateUrl} onChange={e => setForm(f => ({ ...f, certificateUrl: e.target.value }))} type="url" />
                                    </div>
                                </div>
                                <motion.button type="submit" className="glow-btn" disabled={submitting} whileTap={{ scale: 0.98 }}
                                    style={{ marginTop: '1rem', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Award size={16} /> {submitting ? 'Issuing...' : 'Issue Certificate'}
                                </motion.button>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Certificates List */}
            {fetching ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading certificates...</div>
            ) : certificates.length === 0 ? (
                <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
                    <Award size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {isAdmin ? 'No certificates issued yet' : 'No certificates found for your account'}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {isAdmin ? 'Issue certificates to participants using the button above' : 'Certificates will appear here once issued by admin'}
                    </p>
                </GlassCard>
            ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {certificates.map((cert, i) => (
                        <ScrollReveal key={cert._id || i} delay={i * 0.05}>
                            <GlassCard style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '1rem 1.25rem', flexWrap: 'wrap', gap: '0.75rem',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 200 }}>
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 12,
                                        background: cert.certificateType === 'excellence' ? 'linear-gradient(135deg, #f59e0b, #ef4444)' :
                                            cert.certificateType === 'completion' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' :
                                                'linear-gradient(135deg, #10b981, #06b6d4)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Award size={22} color="white" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{cert.studentName}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 2 }}>
                                            <span>ID: {cert.studentId}</span>
                                            <span className="badge" style={{
                                                fontSize: '0.72rem',
                                                background: cert.certificateType === 'excellence' ? 'rgba(245,158,11,0.1)' :
                                                    cert.certificateType === 'completion' ? 'rgba(99,102,241,0.1)' :
                                                        'rgba(16,185,129,0.1)',
                                                color: cert.certificateType === 'excellence' ? '#d97706' :
                                                    cert.certificateType === 'completion' ? '#6366f1' : '#10b981',
                                            }}>
                                                {cert.certificateType}
                                            </span>
                                            <span>{new Date(cert.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {cert.certificateUrl && (
                                        <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer"
                                            style={{
                                                padding: '8px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.1)',
                                                color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                                                fontWeight: 500, fontSize: '0.85rem',
                                            }}>
                                            <Download size={14} /> View
                                        </a>
                                    )}
                                    {isAdmin && (
                                        <button onClick={() => handleDelete(cert._id)}
                                            style={{ padding: '8px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                                            <Trash2 size={16} />
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
