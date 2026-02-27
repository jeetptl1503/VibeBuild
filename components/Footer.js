'use client';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Heart, Code, GraduationCap, Users } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{
            position: 'relative', zIndex: 2,
            background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(99,102,241,0.03) 30%, rgba(99,102,241,0.08) 100%)',
            borderTop: '1px solid rgba(99,102,241,0.1)',
            marginTop: '4rem',
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem 1.5rem' }}>
                {/* Main Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2.5rem',
                    marginBottom: '2.5rem',
                }}>

                    {/* About */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <h3 style={{
                            fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        }}>
                            ✨ VibeBuild
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                            AI Driven Solutions & Vibe Coding — A modern workshop platform for building innovative AI-powered projects.
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            Dept. of Electronics & Communication Engineering
                            <br />CSPIT, CHARUSAT University, Changa
                        </p>
                    </motion.div>

                    {/* Faculty Coordinator */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <GraduationCap size={18} color="#6366f1" /> Faculty Coordinator
                        </h4>
                        <div style={{
                            padding: '1rem', borderRadius: 14,
                            background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(99,102,241,0.1)',
                            backdropFilter: 'blur(10px)',
                        }}>
                            <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>Prof. Dhara M Patel</p>
                            <a href="mailto:dharampatel.ec@charusat.ac.in" style={{
                                color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6,
                            }}>
                                <Mail size={13} /> dharampatel.ec@charusat.ac.in
                            </a>
                            <a href="https://www.linkedin.com/in/dhara-patel-839488138/" target="_blank" rel="noopener noreferrer" style={{
                                color: '#0077B5', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500,
                            }}>
                                <Linkedin size={13} /> LinkedIn Profile
                            </a>
                        </div>
                    </motion.div>

                    {/* Student Coordinators */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Users size={18} color="#8b5cf6" /> Student Coordinators & Organizers
                        </h4>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {/* Jeet */}
                            <div style={{
                                padding: '0.85rem', borderRadius: 14,
                                background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(99,102,241,0.1)',
                                backdropFilter: 'blur(10px)',
                            }}>
                                <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 4 }}>Jeet Patel</p>
                                <a href="mailto:jeetpatel.sms@gmail.com" style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                                    <Mail size={12} /> jeetpatel.sms@gmail.com
                                </a>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <a href="https://www.linkedin.com/in/jeet-patel-b393b4238/" target="_blank" rel="noopener noreferrer" style={{ color: '#0077B5', fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500 }}>
                                        <Linkedin size={12} /> LinkedIn
                                    </a>
                                    <a href="https://github.com/jeetptl1503" target="_blank" rel="noopener noreferrer" style={{ color: '#333', fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500 }}>
                                        <Github size={12} /> GitHub
                                    </a>
                                </div>
                            </div>
                            {/* Yuvrajsinh */}
                            <div style={{
                                padding: '0.85rem', borderRadius: 14,
                                background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(99,102,241,0.1)',
                                backdropFilter: 'blur(10px)',
                            }}>
                                <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 4 }}>Yuvrajsinh Rathod</p>
                                <a href="mailto:25ec112@charusat.edu.in" style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                                    <Mail size={12} /> 25ec112@charusat.edu.in
                                </a>
                                <a href="https://www.linkedin.com/in/yuvrajsinh-rathod-116533372/" target="_blank" rel="noopener noreferrer" style={{ color: '#0077B5', fontSize: '0.78rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 500 }}>
                                    <Linkedin size={12} /> LinkedIn
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)', marginBottom: '1.25rem' }} />

                {/* Bottom Bar */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: '0.75rem',
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                        © {new Date().getFullYear()} VibeBuild. All rights reserved.
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Code size={14} color="#6366f1" />
                        Developed with <Heart size={12} color="#ec4899" style={{ fill: '#ec4899' }} /> by{' '}
                        <a href="https://github.com/jeetptl1503" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'none' }}>
                            Jeet Patel
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
