'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import { Image as ImageIcon, Video, Upload, Trash2, Download, Eye, EyeOff, X, CheckCircle2, Link2, Camera } from 'lucide-react';

export default function GalleryPage() {
    const { user, authFetch } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState('');
    const [lightbox, setLightbox] = useState(null);
    const [form, setForm] = useState({ filename: '', url: '', type: 'image', caption: '' });

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchGallery();
    }, [user]);

    async function fetchGallery() {
        setLoading(true);
        try {
            const headers = {};
            const token = typeof window !== 'undefined' ? localStorage.getItem('vibebuild_token') : null;
            if (token) headers['Authorization'] = `Bearer ${token}`;
            const res = await fetch('/api/gallery', { headers });
            if (res.ok) {
                const data = await res.json();
                setItems(data.items || []);
            }
        } finally {
            setLoading(false);
        }
    }

    async function handleUpload(e) {
        e.preventDefault();
        if (!form.filename || !form.url) return;
        setUploading(true);
        try {
            const res = await authFetch('/api/gallery', { method: 'POST', body: JSON.stringify(form) });
            if (res.ok) {
                const data = await res.json();
                setItems(prev => [data.item, ...prev]);
                setForm({ filename: '', url: '', type: 'image', caption: '' });
                setShowUpload(false);
                setToast('Item uploaded!');
                setTimeout(() => setToast(''), 3000);
            }
        } finally {
            setUploading(false);
        }
    }

    async function handleToggleVisibility(id) {
        const res = await authFetch('/api/gallery', { method: 'PATCH', body: JSON.stringify({ id }) });
        if (res.ok) {
            const data = await res.json();
            setItems(prev => prev.map(i => i._id === id ? data.item : i));
        }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this item?')) return;
        const res = await authFetch(`/api/gallery/${id}`, { method: 'DELETE' });
        if (res.ok) setItems(prev => prev.filter(i => i._id !== id));
    }

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">🖼️ Gallery</h1>
                <p className="section-subtitle">{isAdmin ? 'Manage workshop photos & videos' : 'View workshop moments'}</p>
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

            {/* Admin Upload Button */}
            {isAdmin && (
                <ScrollReveal>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button className="glow-btn" onClick={() => setShowUpload(!showUpload)} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {showUpload ? <X size={18} /> : <Camera size={18} />}
                            {showUpload ? 'Cancel' : 'Upload Media'}
                        </button>
                    </div>
                </ScrollReveal>
            )}

            {/* Upload Form (Admin) */}
            <AnimatePresence>
                {showUpload && isAdmin && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <GlassCard hover={false} style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Upload size={18} color="#6366f1" /> Upload Photo or Video
                            </h3>
                            <form onSubmit={handleUpload}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>File Name *</label>
                                        <input className="glow-input" placeholder="e.g. workshop-day-1.jpg" value={form.filename} onChange={e => setForm(f => ({ ...f, filename: e.target.value }))} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Image/Video URL *</label>
                                        <input className="glow-input" placeholder="https://..." value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} required type="url" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Type</label>
                                        <select className="glow-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Caption</label>
                                        <input className="glow-input" placeholder="Optional caption..." value={form.caption} onChange={e => setForm(f => ({ ...f, caption: e.target.value }))} />
                                    </div>
                                </div>
                                <motion.button type="submit" className="glow-btn" disabled={uploading} whileTap={{ scale: 0.98 }}
                                    style={{ marginTop: '1rem', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
                                </motion.button>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Gallery Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading gallery...</div>
            ) : items.length === 0 ? (
                <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
                    <Camera size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {isAdmin ? 'Gallery is empty — upload some photos!' : 'No photos available yet'}
                    </h3>
                </GlassCard>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {items.map((item, i) => (
                        <ScrollReveal key={item._id || i} delay={i * 0.04}>
                            <GlassCard style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                                {/* Visibility badge (admin) */}
                                {isAdmin && (
                                    <div style={{
                                        position: 'absolute', top: 10, left: 10, zIndex: 2,
                                        padding: '4px 10px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 600,
                                        background: item.publicVisible ? 'rgba(16,185,129,0.85)' : 'rgba(239,68,68,0.85)',
                                        color: 'white', backdropFilter: 'blur(8px)',
                                    }}>
                                        {item.publicVisible ? 'Visible' : 'Hidden'}
                                    </div>
                                )}

                                {/* Media */}
                                {item.type === 'video' ? (
                                    <video src={item.url} controls style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                                ) : (
                                    <img
                                        src={item.url} alt={item.caption || item.filename}
                                        style={{ width: '100%', height: 200, objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => setLightbox(item)}
                                    />
                                )}

                                <div style={{ padding: '0.75rem 1rem' }}>
                                    <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>{item.caption || item.filename}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '2px 0' }}>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>

                                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                                        {/* Download for participants */}
                                        <a href={item.url} download={item.filename} target="_blank" rel="noopener noreferrer"
                                            style={{
                                                padding: '6px 12px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 500,
                                                background: 'rgba(99,102,241,0.1)', color: 'var(--accent-blue)',
                                                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                                            }}>
                                            <Download size={12} /> Download
                                        </a>
                                        {/* Admin controls */}
                                        {isAdmin && (
                                            <>
                                                <button onClick={() => handleToggleVisibility(item._id)}
                                                    style={{
                                                        padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                                        background: item.publicVisible ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                                                        color: item.publicVisible ? '#dc2626' : '#10b981', fontSize: '0.78rem',
                                                        display: 'flex', alignItems: 'center', gap: 4,
                                                    }}>
                                                    {item.publicVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                                                    {item.publicVisible ? 'Hide' : 'Show'}
                                                </button>
                                                <button onClick={() => handleDelete(item._id)}
                                                    style={{ padding: '6px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        </ScrollReveal>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 9999,
                            background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', padding: '2rem',
                        }}>
                        <button onClick={() => setLightbox(null)}
                            style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', padding: 10, cursor: 'pointer', color: 'white' }}>
                            <X size={24} />
                        </button>
                        <img src={lightbox.url} alt={lightbox.caption || lightbox.filename}
                            style={{ maxWidth: '90vw', maxHeight: '85vh', borderRadius: 16, objectFit: 'contain' }}
                            onClick={e => e.stopPropagation()} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
