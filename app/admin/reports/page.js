'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { GlassCard, ScrollReveal, AnimatedCounter } from '@/components/UIComponents';
import { BarChart3, Download, FileText, PieChart } from 'lucide-react';

export default function ReportsPage() {
    const { user, loading, authFetch } = useAuth();
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        if (!loading && (!user || user.role !== 'admin')) router.push('/login');
    }, [user, loading]);

    useEffect(() => {
        if (user?.role === 'admin') {
            authFetch('/api/reports').then(r => r.json()).then(d => {
                setData(d);
                setLoadingData(false);
            }).catch(() => setLoadingData(false));
        }
    }, [user]);

    const exportSubmissionsCSV = () => {
        if (!data?.projects) return;
        const headers = ['Team', 'Domain', 'Title', 'Status', 'GitHub', 'Live URL', 'Tech Stack', 'Submitted At'];
        const rows = data.projects.map(p => [p.teamName, p.domain, p.title, p.status, p.githubUrl, p.liveUrl || '', (p.techStack || []).join('; '), p.submittedAt || '']);
        const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'submissions_report.csv'; a.click();
    };

    const exportAttendanceCSV = () => {
        if (!data?.attendance) return;
        const headers = ['Name', 'Team', 'Email', 'First Half', 'Second Half', 'Remarks'];
        const rows = data.attendance.map(r => [r.participantName, r.teamName, r.email, r.firstHalf ? 'Present' : 'Absent', r.secondHalf ? 'Present' : 'Absent', r.remarks || '']);
        const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'attendance_report.csv'; a.click();
    };

    const exportFullReport = async () => {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.setTextColor(99, 102, 241);
        doc.text('VibeBuild Workshop Report', 20, 25);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 33);

        doc.setDrawColor(99, 102, 241);
        doc.line(20, 36, 190, 36);

        // Analytics
        doc.setFontSize(14);
        doc.setTextColor(30, 30, 60);
        doc.text('Workshop Analytics', 20, 46);

        doc.setFontSize(10);
        doc.setTextColor(80);
        let y = 54;
        if (data?.analytics) {
            doc.text(`Total Teams: ${data.analytics.totalTeams}`, 20, y); y += 7;
            doc.text(`Total Submissions: ${data.analytics.totalSubmissions}`, 20, y); y += 7;
            doc.text(`Drafts: ${data.analytics.drafts}`, 20, y); y += 7;
            doc.text(`Submission Rate: ${data.analytics.submissionRate}%`, 20, y); y += 12;

            // Domain Distribution
            doc.setFontSize(14);
            doc.setTextColor(30, 30, 60);
            doc.text('Domain Distribution', 20, y); y += 8;
            doc.setFontSize(10);
            doc.setTextColor(80);
            Object.entries(data.analytics.domainDistribution || {}).forEach(([domain, count]) => {
                doc.text(`${domain}: ${count} teams`, 25, y); y += 7;
            });
            y += 5;

            // Attendance Stats
            doc.setFontSize(14);
            doc.setTextColor(30, 30, 60);
            doc.text('Attendance Summary', 20, y); y += 8;
            doc.setFontSize(10);
            doc.setTextColor(80);
            doc.text(`Total Records: ${data.analytics.attendanceStats?.total || 0}`, 25, y); y += 7;
            doc.text(`First Half Present: ${data.analytics.attendanceStats?.firstHalfPresent || 0}`, 25, y); y += 7;
            doc.text(`Second Half Present: ${data.analytics.attendanceStats?.secondHalfPresent || 0}`, 25, y); y += 12;
        }

        // Submissions
        if (y > 240) { doc.addPage(); y = 20; }
        doc.setFontSize(14);
        doc.setTextColor(30, 30, 60);
        doc.text('Project Submissions', 20, y); y += 8;
        doc.setFontSize(9);
        doc.setTextColor(80);
        (data?.projects || []).forEach(p => {
            if (y > 270) { doc.addPage(); y = 20; }
            doc.setTextColor(99, 102, 241);
            doc.text(`${p.teamName} — ${p.title}`, 25, y); y += 5;
            doc.setTextColor(80);
            doc.text(`Domain: ${p.domain} | Status: ${p.status} | GitHub: ${p.githubUrl}`, 25, y); y += 8;
        });

        doc.save('VibeBuild_Workshop_Report.pdf');
    };

    if (loading || !user || user.role !== 'admin') return null;

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">📊 Reports & Analytics</h1>
                <p className="section-subtitle">Workshop performance and submission analytics</p>
            </motion.div>

            {/* Stats */}
            {data?.analytics && (
                <ScrollReveal>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        <AnimatedCounter end={data.analytics.totalTeams} label="Total Teams" icon="👥" />
                        <AnimatedCounter end={data.analytics.totalSubmissions} label="Submitted" icon="🚀" />
                        <AnimatedCounter end={data.analytics.drafts} label="Drafts" icon="📝" />
                        <AnimatedCounter end={data.analytics.submissionRate} label="Submission Rate" icon="📈" />
                    </div>
                </ScrollReveal>
            )}

            {/* Export Buttons */}
            <ScrollReveal delay={0.1}>
                <GlassCard hover={false} style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Download size={20} color="#6366f1" /> Export Reports
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button className="glow-btn" onClick={exportSubmissionsCSV} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FileText size={16} /> Submissions CSV
                        </button>
                        <button className="glow-btn" onClick={exportAttendanceCSV} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }}>
                            <FileText size={16} /> Attendance CSV
                        </button>
                        <button className="glow-btn" onClick={exportFullReport} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
                            <FileText size={16} /> Full Report PDF
                        </button>
                    </div>
                </GlassCard>
            </ScrollReveal>

            {/* Domain Distribution */}
            {data?.analytics?.domainDistribution && (
                <ScrollReveal delay={0.2}>
                    <GlassCard hover={false} style={{ marginBottom: '2rem' }}>
                        <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <PieChart size={20} color="#6366f1" /> Domain Distribution
                        </h3>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {Object.entries(data.analytics.domainDistribution).map(([domain, count]) => (
                                <div key={domain}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{domain}</span>
                                        <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{count} teams</span>
                                    </div>
                                    <div style={{ height: 8, borderRadius: 4, background: 'rgba(99,102,241,0.1)', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(count / (data.analytics.totalTeams || 1)) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.3 }}
                                            style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </ScrollReveal>
            )}

            {/* All Submissions */}
            <ScrollReveal delay={0.3}>
                <GlassCard hover={false}>
                    <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <BarChart3 size={20} color="#6366f1" /> All Submissions ({data?.projects?.length || 0})
                    </h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-glass)' }}>
                                    {['Team', 'Domain', 'Title', 'Status', 'Tech Stack'].map(h => (
                                        <th key={h} style={{ textAlign: 'left', padding: '10px 8px', fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {(data?.projects || []).map(p => (
                                    <tr key={p._id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                                        <td style={{ padding: '10px 8px', fontWeight: 600 }}>{p.teamName}</td>
                                        <td style={{ padding: '10px 8px' }}><span className="badge">{p.domain}</span></td>
                                        <td style={{ padding: '10px 8px' }}>{p.title}</td>
                                        <td style={{ padding: '10px 8px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 600,
                                                background: p.status === 'submitted' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                                                color: p.status === 'submitted' ? '#16a34a' : '#ca8a04',
                                            }}>{p.status}</span>
                                        </td>
                                        <td style={{ padding: '10px 8px' }}>
                                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                                {(p.techStack || []).slice(0, 3).map((t, i) => (
                                                    <span key={i} style={{ padding: '2px 8px', borderRadius: 8, fontSize: '0.7rem', background: 'rgba(99,102,241,0.08)', color: 'var(--accent-purple)' }}>{t}</span>
                                                ))}
                                                {(p.techStack || []).length > 3 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{p.techStack.length - 3}</span>}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </ScrollReveal>
        </div>
    );
}
