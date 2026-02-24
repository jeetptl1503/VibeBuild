'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import { Upload, FileText, FileImage, Presentation, File, Trash2, Download, FolderUp, X, CheckCircle2, FileUp } from 'lucide-react';

const CATEGORIES = ['Attendance', 'Presentation', 'Report', 'Photos', 'Other'];

function getFileIcon(type) {
    switch (type?.toUpperCase()) {
        case 'PDF': return <FileText size={20} color="#ef4444" />;
        case 'JPG': case 'PNG': case 'JPEG': case 'GIF': case 'WEBP': return <FileImage size={20} color="#f59e0b" />;
        case 'PPTX': case 'PPT': return <Presentation size={20} color="#ec4899" />;
        default: return <File size={20} color="#6366f1" />;
    }
}

function getFileType(filename) {
    const ext = filename.split('.').pop()?.toUpperCase() || 'Other';
    const known = ['PDF', 'JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'PPTX', 'PPT', 'DOCX', 'DOC', 'XLSX', 'XLS', 'MP4', 'WEBM'];
    return known.includes(ext) ? ext : 'Other';
}

export default function ReportsPage() {
    const { user, loading, authFetch } = useAuth();
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [showUpload, setShowUpload] = useState(false);
    const [filterCategory, setFilterCategory] = useState('All');
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [category, setCategory] = useState('Report');
    const [description, setDescription] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    }, [user, loading]);

    useEffect(() => {
        if (user?.role === 'admin') fetchReports();
    }, [user]);

    async function fetchReports() {
        const res = await authFetch('/api/reports');
        if (res.ok) {
            const data = await res.json();
            setReports(data.reports || []);
        }
    }

    function handleFileSelect(e) {
        const file = e.target.files?.[0];
        if (file) setSelectedFile(file);
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setSelectedFile(file);
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function handleUpload(e) {
        e.preventDefault();
        if (!selectedFile) return;
        setUploading(true);
        try {
            const base64 = await fileToBase64(selectedFile);
            const res = await authFetch('/api/reports', {
                method: 'POST',
                body: JSON.stringify({
                    fileName: selectedFile.name,
                    fileUrl: base64,
                    fileType: getFileType(selectedFile.name),
                    category,
                    description,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setReports(prev => [data.report, ...prev]);
                setSelectedFile(null);
                setCategory('Report');
                setDescription('');
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 3000);
                setShowUpload(false);
            }
        } finally { setUploading(false); }
    }

    async function handleDelete(id) {
        if (!confirm('Delete this report?')) return;
        const res = await authFetch(`/api/reports/${id}`, { method: 'DELETE' });
        if (res.ok) setReports(prev => prev.filter(r => r._id !== id));
    }

    const filtered = filterCategory === 'All' ? reports : reports.filter(r => r.category === filterCategory);

    if (loading || !user || user.role !== 'admin') return null;

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">📊 Reports & Materials</h1>
                <p className="section-subtitle">Upload event materials for HOD documentation</p>
            </motion.div>

            {/* Upload Success Toast */}
            <AnimatePresence>
                {uploadSuccess && (
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                        style={{
                            position: 'fixed', top: 90, right: 24, zIndex: 1000,
                            padding: '14px 20px', borderRadius: 14,
                            background: 'rgba(16,185,129,0.9)', backdropFilter: 'blur(12px)',
                            color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
                            boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                        }}>
                        <CheckCircle2 size={18} /> File uploaded successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Controls */}
            <ScrollReveal>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {['All', ...CATEGORIES].map(cat => (
                            <button key={cat} onClick={() => setFilterCategory(cat)}
                                style={{
                                    padding: '8px 16px', borderRadius: 20, border: '1px solid var(--border-glass)',
                                    background: filterCategory === cat ? 'var(--accent-blue)' : 'rgba(255,255,255,0.6)',
                                    color: filterCategory === cat ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem',
                                    transition: 'all 0.2s',
                                }}>
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button className="glow-btn" onClick={() => setShowUpload(!showUpload)} style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        {showUpload ? <X size={18} /> : <FolderUp size={18} />}
                        {showUpload ? 'Cancel' : 'Upload File'}
                    </button>
                </div>
            </ScrollReveal>

            {/* Upload Form */}
            <AnimatePresence>
                {showUpload && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <GlassCard hover={false} style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Upload size={18} color="#6366f1" /> Upload Material
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
                                        {dragOver ? 'Drop file here!' : 'Click to browse or drag & drop'}
                                    </p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0 0' }}>
                                        PDF, Images, PowerPoint, Word, Excel, and more
                                    </p>
                                    <input ref={fileInputRef} type="file" onChange={handleFileSelect} style={{ display: 'none' }} />
                                </div>

                                {/* Selected File */}
                                {selectedFile && (
                                    <div style={{
                                        marginTop: '1rem', display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '10px 14px', borderRadius: 12,
                                        background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
                                    }}>
                                        {getFileIcon(getFileType(selectedFile.name))}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedFile.name}</div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                {getFileType(selectedFile.name)} · {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => setSelectedFile(null)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 4 }}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}

                                {/* Category & Description */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginTop: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Category</label>
                                        <select className="glow-input" value={category} onChange={e => setCategory(e.target.value)}>
                                            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>Description</label>
                                        <input className="glow-input" placeholder="Optional notes..." value={description} onChange={e => setDescription(e.target.value)} />
                                    </div>
                                </div>

                                <motion.button type="submit" className="glow-btn" disabled={uploading || !selectedFile} whileTap={{ scale: 0.98 }}
                                    style={{ marginTop: '1rem', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8, opacity: !selectedFile ? 0.5 : 1 }}>
                                    <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
                                </motion.button>
                            </form>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reports List */}
            <div style={{ display: 'grid', gap: '0.75rem' }}>
                {filtered.length === 0 ? (
                    <GlassCard style={{ textAlign: 'center', padding: '3rem' }}>
                        <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                        <h3 style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No reports uploaded yet</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Upload materials for HOD documentation</p>
                    </GlassCard>
                ) : (
                    filtered.map((report, i) => (
                        <ScrollReveal key={report._id} delay={i * 0.05}>
                            <GlassCard style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '1rem 1.25rem', flexWrap: 'wrap', gap: '0.75rem',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 200 }}>
                                    <div style={{ padding: 10, borderRadius: 12, background: 'rgba(99,102,241,0.06)' }}>
                                        {getFileIcon(report.fileType)}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{report.fileName}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem', display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 2 }}>
                                            <span className="badge" style={{ fontSize: '0.75rem' }}>{report.category}</span>
                                            <span>{report.fileType}</span>
                                            <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {report.description && <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{report.description}</p>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <a href={report.fileUrl} download={report.fileName} target="_blank" rel="noopener noreferrer"
                                        style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.1)', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500, fontSize: '0.85rem' }}>
                                        <Download size={14} /> Open
                                    </a>
                                    <button onClick={() => handleDelete(report._id)}
                                        style={{ padding: '8px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </GlassCard>
                        </ScrollReveal>
                    ))
                )}
            </div>
        </div>
    );
}
