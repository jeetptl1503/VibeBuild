'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import { Image as ImageIcon, Video, Upload, Trash2, Download, Eye, EyeOff, X, CheckCircle2, Camera, FileUp } from 'lucide-react';

export default function GalleryPage() {
    const { user, authFetch } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState('');
    const [lightbox, setLightbox] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [caption, setCaption] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const isAdmin = user?.role === 'admin';

    useEffect(() => { fetchGallery(); }, [user]);

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
        } finally { setLoading(false); }
    }

    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        addFiles(files);
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
        addFiles(files);
    }

    function addFiles(files) {
        const valid = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
        if (valid.length === 0) return;
        setSelectedFiles(prev => [...prev, ...valid]);
    }

    function removeFile(index) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }

    async function handleUpload(e) {
        e.preventDefault();
        if (selectedFiles.length === 0) return;
        setUploading(true);
        try {
            for (const file of selectedFiles) {
                const base64 = await fileToBase64(file);
                const type = file.type.startsWith('video/') ? 'video' : 'image';
                const res = await authFetch('/api/gallery', {
                    method: 'POST',
                    body: JSON.stringify({
                        filename: file.name,
                        url: base64,
                        type,
                        caption: caption || '',
                    }),
                });
                if (res.ok) {
                    const data = await res.json();
                    setItems(prev => [data.item, ...prev]);
                }
            }
            setSelectedFiles([]);
            setCaption('');
            setShowUpload(false);
            setToast(`${selectedFiles.length} item(s) uploaded!`);
            setTimeout(() => setToast(''), 3000);
        } finally { setUploading(false); }
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
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
                                <Upload size={18} color="#6366f1" /> Upload Photos or Videos
                            </h3>
                            <form onSubmit={handleUpload}>
                                {/* Drop Zone */}
                                <div
                                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                                    onDragLeave={() => setDragOver(false)}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: `2px dashed ${dragOver ? '#6366f1' : 'rgba(99,102,241,0.25)'}`,
                                        borderRadius: 16, padding: '2.5rem', textAlign: 'center',
                                        cursor: 'pointer', transition: 'all 0.3s ease',
                                        background: dragOver ? 'rgba(99,102,241,0.05)' : 'rgba(248,248,252,0.5)',
                                    }}>
                                    <FileUp size={40} color={dragOver ? '#6366f1' : '#a5b4fc'} style={{ marginBottom: 12 }} />
                                    <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0, color: 'var(--text-primary)' }}>
                                        {dragOver ? 'Drop files here!' : 'Click to browse or drag & drop'}
                                    </p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0 0' }}>
                                        Images (JPG, PNG, GIF, WebP) and Videos (MP4, WebM)
                                    </p>
                                    <input ref={fileInputRef} type="file" multiple accept="image/*,video/*"
                                        onChange={handleFileSelect} style={{ display: 'none' }} />
                                </div>

                                {/* Selected Files Preview */}
                                {selectedFiles.length > 0 && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>
                                            {selectedFiles.length} file(s) selected
                                        </p>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            {selectedFiles.map((file, i) => (
                                                <div key={i} style={{
                                                    display: 'flex', alignItems: 'center', gap: 8,
                                                    padding: '6px 12px', borderRadius: 10,
                                                    background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
                                                    fontSize: '0.82rem',
                                                }}>
                                                    {file.type.startsWith('video/') ? <Video size={14} color="#6366f1" /> : <ImageIcon size={14} color="#6366f1" />}
                                                    <span style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: '#dc2626' }}>
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Caption */}
                                <div style={{ marginTop: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                                        Caption (optional)
                                    </label>
                                    <input className="glow-input" placeholder="Optional caption for all uploaded files..."
                                        value={caption} onChange={e => setCaption(e.target.value)} />
                                </div>

                                <motion.button type="submit" className="glow-btn" disabled={uploading || selectedFiles.length === 0} whileTap={{ scale: 0.98 }}
                                    style={{ marginTop: '1rem', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8, opacity: selectedFiles.length === 0 ? 0.5 : 1 }}>
                                    <Upload size={16} /> {uploading ? `Uploading (${selectedFiles.length})...` : `Upload ${selectedFiles.length} File(s)`}
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
                                {item.type === 'video' ? (
                                    <video src={item.url} controls style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                                ) : (
                                    <img src={item.url} alt={item.caption || item.filename}
                                        style={{ width: '100%', height: 200, objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => setLightbox(item)} />
                                )}
                                <div style={{ padding: '0.75rem 1rem' }}>
                                    <p style={{ fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>{item.caption || item.filename}</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '2px 0' }}>
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </p>
                                    <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                                        <a href={item.url} download={item.filename} target="_blank" rel="noopener noreferrer"
                                            style={{
                                                padding: '6px 12px', borderRadius: 8, fontSize: '0.78rem', fontWeight: 500,
                                                background: 'rgba(99,102,241,0.1)', color: 'var(--accent-blue)',
                                                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4,
                                            }}>
                                            <Download size={12} /> Download
                                        </a>
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
