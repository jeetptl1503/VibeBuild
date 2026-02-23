'use client';
import { motion } from 'framer-motion';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import { Clock, Coffee, Code2, Presentation, BookOpen, Wrench, Rocket } from 'lucide-react';

const schedule = [
    { time: '09:00 AM', title: 'Registration & Welcome', desc: 'Check-in, team formation, and welcome address', icon: <BookOpen size={20} />, color: '#6366f1' },
    { time: '09:30 AM', title: 'Introduction to AI & ML', desc: 'Overview of AI concepts, tools, and frameworks for the workshop', icon: <BookOpen size={20} />, color: '#8b5cf6' },
    { time: '10:30 AM', title: 'Hands-on: Setting Up Environment', desc: 'Setting up development tools, APIs, and project structure', icon: <Wrench size={20} />, color: '#a855f7' },
    { time: '11:30 AM', title: 'Problem Statement Discussion', desc: 'Domain-wise problem statements and brainstorming session', icon: <Presentation size={20} />, color: '#6366f1' },
    { time: '12:30 PM', title: 'Lunch Break', desc: 'Networking lunch and team planning time', icon: <Coffee size={20} />, color: '#f59e0b', highlight: true },
    { time: '01:30 PM', title: 'Build Phase Begins!', desc: 'Teams start building their AI-driven solutions', icon: <Code2 size={20} />, color: '#16a34a' },
    { time: '03:00 PM', title: 'Mentoring Round', desc: 'One-on-one mentoring sessions with industry experts', icon: <BookOpen size={20} />, color: '#8b5cf6' },
    { time: '04:30 PM', title: 'Final Submissions', desc: 'Teams submit their projects via the VibeBuild platform', icon: <Rocket size={20} />, color: '#ec4899' },
    { time: '05:00 PM', title: 'Presentations & Judging', desc: 'Teams present their solutions to the panel', icon: <Presentation size={20} />, color: '#6366f1' },
    { time: '06:00 PM', title: 'Results & Certificates', desc: 'Winners announced, certificates distributed, closing ceremony', icon: <Rocket size={20} />, color: '#f59e0b' },
];

export default function SchedulePage() {
    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">🗓️ Workshop Schedule</h1>
                <p className="section-subtitle">A complete timeline of the workshop day</p>
            </motion.div>

            <div style={{ position: 'relative', maxWidth: 700, margin: '0 auto' }}>
                {/* Vertical Line */}
                <div style={{
                    position: 'absolute', left: 24, top: 0, bottom: 0, width: 2,
                    background: 'linear-gradient(to bottom, rgba(99,102,241,0.3), rgba(139,92,246,0.3), rgba(236,72,153,0.3))',
                }} />

                {schedule.map((item, i) => (
                    <ScrollReveal key={i} delay={i * 0.08}>
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', position: 'relative' }}>
                            {/* Dot */}
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1, type: 'spring' }}
                                style={{
                                    width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
                                    background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                                    border: `2px solid ${item.color}40`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: item.color, zIndex: 1,
                                }}
                            >
                                {item.icon}
                            </motion.div>

                            {/* Card */}
                            <GlassCard style={{
                                flex: 1, padding: '1.25rem',
                                ...(item.highlight ? { background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(245,158,11,0.02))', borderColor: 'rgba(245,158,11,0.2)' } : {}),
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: item.color }}>{item.title}</h3>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Clock size={12} /> {item.time}
                                    </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                            </GlassCard>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    );
}
