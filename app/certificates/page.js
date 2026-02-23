'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import { Award, Download, QrCode, User, Users } from 'lucide-react';

export default function CertificatesPage() {
    const { user } = useAuth();
    const [certType, setCertType] = useState('participation');
    const canvasRef = useRef(null);

    const generateCertificate = async (type) => {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

        // Background
        doc.setFillColor(248, 249, 255);
        doc.rect(0, 0, 297, 210, 'F');

        // Border
        doc.setDrawColor(99, 102, 241);
        doc.setLineWidth(2);
        doc.roundedRect(10, 10, 277, 190, 5, 5, 'S');
        doc.setDrawColor(139, 92, 246);
        doc.setLineWidth(0.5);
        doc.roundedRect(15, 15, 267, 180, 3, 3, 'S');

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(99, 102, 241);
        doc.text('⚡ VIBEBUILD', 148.5, 35, { align: 'center' });

        doc.setFontSize(28);
        doc.setTextColor(30, 30, 60);
        doc.text(type === 'participation' ? 'Certificate of Participation' : 'Certificate of Completion', 148.5, 52, { align: 'center' });

        // Decorative line
        doc.setDrawColor(99, 102, 241);
        doc.setLineWidth(1);
        doc.line(80, 58, 217, 58);

        // Body
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 100);
        doc.text('This is to certify that', 148.5, 75, { align: 'center' });

        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(99, 102, 241);
        doc.text(user?.name || 'Team Name', 148.5, 90, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 100);
        doc.text(`has successfully ${type === 'participation' ? 'participated in' : 'completed'} the`, 148.5, 105, { align: 'center' });

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 30, 60);
        doc.text('AI Driven Solutions & Vibe Coding Workshop', 148.5, 118, { align: 'center' });

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 100);
        doc.text(`Domain: ${user?.domain || 'AI/ML'}`, 148.5, 132, { align: 'center' });
        doc.text(`Team ID: ${user?.teamId || 'N/A'}`, 148.5, 140, { align: 'center' });

        // Date
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}`, 148.5, 155, { align: 'center' });

        // Signatures
        doc.setDrawColor(150, 150, 170);
        doc.setLineWidth(0.5);
        doc.line(40, 175, 110, 175);
        doc.line(187, 175, 257, 175);
        doc.setFontSize(9);
        doc.text('Workshop Director', 75, 182, { align: 'center' });
        doc.text('Technical Lead', 222, 182, { align: 'center' });

        // QR Code placeholder area
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 170);
        doc.text('VibeBuild Workshop Certificate', 148.5, 195, { align: 'center' });

        doc.save(`VibeBuild_${type}_certificate_${user?.teamId || 'team'}.pdf`);
    };

    if (!user) return null;

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">🎓 Certificates</h1>
                <p className="section-subtitle">Download your workshop certificates</p>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: 700, margin: '0 auto' }}>
                <ScrollReveal>
                    <GlassCard style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
                        <motion.div
                            whileHover={{ rotate: [0, -5, 5, 0] }}
                            style={{
                                width: 64, height: 64, borderRadius: 16, margin: '0 auto 1rem',
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Award size={32} color="#6366f1" />
                        </motion.div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Participation Certificate</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            Certificate acknowledging your participation in the VibeBuild workshop
                        </p>
                        <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: 12, background: 'rgba(99,102,241,0.05)' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                                <User size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                {user.name} · {user.teamId}
                            </p>
                        </div>
                        <button className="glow-btn" onClick={() => generateCertificate('participation')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }}>
                            <Download size={16} /> Download PDF
                        </button>
                    </GlassCard>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <GlassCard style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
                        <motion.div
                            whileHover={{ rotate: [0, -5, 5, 0] }}
                            style={{
                                width: 64, height: 64, borderRadius: 16, margin: '0 auto 1rem',
                                background: 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(139,92,246,0.1))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                        >
                            <Award size={32} color="#ec4899" />
                        </motion.div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>Completion Certificate</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            Certificate for successfully completing and submitting your project
                        </p>
                        <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: 12, background: 'rgba(236,72,153,0.05)' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                                <Users size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                {user.domain}
                            </p>
                        </div>
                        <button className="glow-btn" onClick={() => generateCertificate('completion')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                            <Download size={16} /> Download PDF
                        </button>
                    </GlassCard>
                </ScrollReveal>
            </div>
        </div>
    );
}
