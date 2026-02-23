'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import { useAuth } from '@/lib/AuthContext';
import { Image as ImageIcon, Video, Upload, X, Eye, EyeOff, Trash2 } from 'lucide-react';

export default function GalleryPage() {
    const { user, authFetch } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightbox, setLightbox] = useState(null);
    const [showUpload, setShowUpload] = useState(false);
    const [uploadForm, setUploadForm] = useState({ url: '', caption: '', type: 'image', filename: '' });

    useEffect(() => {
        fetch('/api/gallery').then(r => r.json()).then(data => {
            setItems(data.items || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    const handleUpload = async () => {
        if (!uploadForm.url) return;
        try {
            const res = await authFetch('/api/gallery', {
                method: 'POST',
                body: JSON.stringify({ ...uploadForm, filename: uploadForm.filename || 'media' }),
            });
            if (res.ok) {
                const data = await res.json();
                setItems(prev => [data.item, ...prev]);
                setShowUpload(false);
                setUploadForm({ url: '', caption: '', type: 'image', filename: '' });
            }
        } catch { }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        const res = await authFetch(`/api/gallery/${id}`, { method: 'DELETE' });
        if (res.ok) setItems(prev => prev.filter(i => i._id !== id));
    };

    const sampleItems = [
        { _id: 's1', url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600', type: 'image', caption: 'AI Workshop Session 1', publicVisible: true },
        { _id: 's2', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600', type: 'image', caption: 'Team Collaboration', publicVisible: true },
        { _id: 's3', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600', type: 'image', caption: 'Coding Sprint', publicVisible: true },
        { _id: 's4', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600', type: 'image', caption: 'Team Discussion', publicVisible: true },
        { _id: 's5', url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600', type: 'image', caption: 'Presentation Time', publicVisible: true },
        { _id: 's6', url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600', type: 'image', caption: 'Workshop Finals', publicVisible: true },
    ];

    const displayItems = items.length > 0 ? items : sampleItems;

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h1 className="section-title">🖼️ Gallery</h1>
                        <p className="section-subtitle" style={{ marginBottom: 0 }}>Workshop moments captured</p>
                    </div>
                    {user?.role === 'admin' && (
                        <button className="glow-btn" onClick={() => setShowUpload(!showUpload)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Upload size={16} /> Upload
                        </button>
                    )}
                </div>
            </motion.div>

            {/* Upload Form */}
            <AnimatePresence>
                {showUpload && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                        <GlassCard hover={false} style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Upload Media</h3>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                <input className="glow-input" placeholder="Media URL" value={uploadForm.url} onChange={e => setUploadForm(f => ({ ...f, url: e.target.value }))} />
                                <input className="glow-input" placeholder="Caption" value={uploadForm.caption} onChange={e => setUploadForm(f => ({ ...f, caption: e.target.value }))} />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <select className="glow-input" value={uploadForm.type} onChange={e => setUploadForm(f => ({ ...f, type: e.target.value }))} style={{ flex: 1 }}>
                                        <option value="image">Image</option>
                                        <option value="video">Video</option>
                                    </select>
                                    <button className="glow-btn" onClick={handleUpload}>Upload</button>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Masonry Grid */}
            <div style={{
                columns: '3 300px', columnGap: '1rem',
            }}>
                {displayItems.map((item, i) => (
                    <ScrollReveal key={item._id} delay={i * 0.05}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            style={{
                                breakInside: 'avoid', marginBottom: '1rem', borderRadius: 16,
                                overflow: 'hidden', cursor: 'pointer', position: 'relative',
                                boxShadow: 'var(--shadow-soft)',
                            }}
                            onClick={() => setLightbox(item)}
                        >
                            {item.type === 'video' ? (
                                <div style={{ position: 'relative', paddingTop: '56.25%', background: '#f0f0f5' }}>
                                    <Video size={32} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: 'var(--text-muted)' }} />
                                </div>
                            ) : (
                                <img src={item.url} alt={item.caption || 'Gallery'} style={{ width: '100%', display: 'block' }} loading="lazy" />
                            )}
                            {item.caption && (
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    padding: '8px 12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                                    color: 'white', fontSize: '0.8rem', fontWeight: 500,
                                }}>
                                    {item.caption}
                                </div>
                            )}
                            {user?.role === 'admin' && item._id && !item._id.startsWith('s') && (
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                                    style={{
                                        position: 'absolute', top: 8, right: 8, width: 32, height: 32,
                                        borderRadius: '50%', background: 'rgba(239,68,68,0.9)', border: 'none',
                                        color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </motion.div>
                    </ScrollReveal>
                ))}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightbox && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setLightbox(null)}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 2000, padding: '2rem',
                        }}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
                            {lightbox.type === 'video' ? (
                                <video src={lightbox.url} controls style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12 }} />
                            ) : (
                                <img src={lightbox.url} alt={lightbox.caption} style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 12 }} />
                            )}
                            {lightbox.caption && <p style={{ color: 'white', textAlign: 'center', marginTop: '1rem' }}>{lightbox.caption}</p>}
                        </motion.div>
                        <button onClick={() => setLightbox(null)} style={{
                            position: 'absolute', top: 24, right: 24, width: 40, height: 40,
                            borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none',
                            color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <X size={20} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
