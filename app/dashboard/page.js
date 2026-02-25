'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { GlassCard, ScrollReveal } from '@/components/UIComponents';
import ReactConfetti from 'react-confetti';
import { Clock, Github, Globe, Code2, Send, Save, Edit3, CheckCircle2, AlertCircle, Sparkles, ExternalLink, Tag, X, Users, Plus, UserPlus, Trash2, Rocket } from 'lucide-react';

const DOMAINS = ['Healthcare AI', 'Agriculture AI', 'Smart Cities', 'Education Tech'];

export default function DashboardPage() {
    const { user, loading, authFetch } = useAuth();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [settings, setSettings] = useState(null);
    const [team, setTeam] = useState(null);
    const [timeLeft, setTimeLeft] = useState({});
    const [showConfetti, setShowConfetti] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [techInput, setTechInput] = useState('');

    // Team creation state
    const [showTeamForm, setShowTeamForm] = useState(false);
    const [teamCreating, setTeamCreating] = useState(false);
    const [teamForm, setTeamForm] = useState({
        teamName: '', domain: 'Healthcare AI', members: [{ name: '', userId: '' }],
    });

    const [form, setForm] = useState({
        title: '', description: '', githubUrl: '', liveUrl: '', techStack: [],
    });

    useEffect(() => {
        if (!loading && !user) router.push('/login');
        if (!loading && user?.role === 'admin') router.push('/admin');
    }, [user, loading]);

    useEffect(() => {
        if (user) {
            authFetch('/api/projects').then(r => r.json()).then(data => {
                if (data.project) {
                    setProject(data.project);
                    setForm({
                        title: data.project.title || '',
                        description: data.project.description || '',
                        githubUrl: data.project.githubUrl || '',
                        liveUrl: data.project.liveUrl || '',
                        techStack: data.project.techStack || [],
                    });
                }
            });
            authFetch('/api/teams').then(r => r.json()).then(data => setTeam(data.team));
            fetch('/api/admin/settings').then(r => r.json()).then(data => setSettings(data.settings));
        }
    }, [user]);

    useEffect(() => {
        if (!settings?.workshopEndTime) return;
        const timer = setInterval(() => {
            const diff = new Date(settings.workshopEndTime) - new Date();
            if (diff <= 0) { setTimeLeft({ h: 0, m: 0, s: 0 }); return; }
            setTimeLeft({
                h: Math.floor(diff / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [settings]);

    const addTech = () => {
        if (techInput.trim() && !form.techStack.includes(techInput.trim())) {
            setForm(f => ({ ...f, techStack: [...f.techStack, techInput.trim()] }));
            setTechInput('');
        }
    };

    const removeTech = (tech) => {
        setForm(f => ({ ...f, techStack: f.techStack.filter(t => t !== tech) }));
    };

    const handleSubmit = async (status = 'submitted') => {
        setMessage({ type: '', text: '' });
        if (!form.title || !form.description || !form.githubUrl) {
            setMessage({ type: 'error', text: 'Please fill in all required fields' });
            return;
        }
        const githubRegex = /^https?:\/\/(www\.)?github\.com\/.+\/.+/;
        if (!githubRegex.test(form.githubUrl)) {
            setMessage({ type: 'error', text: 'Please enter a valid GitHub URL' });
            return;
        }
        setSubmitting(true);
        try {
            const res = await authFetch('/api/projects', {
                method: 'POST',
                body: JSON.stringify({ ...form, status }),
            });
            const data = await res.json();
            if (res.ok) {
                setProject(data.project);
                if (status === 'submitted') {
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 5000);
                    setMessage({ type: 'success', text: '🎉 Project submitted successfully!' });
                } else {
                    setMessage({ type: 'success', text: 'Draft saved!' });
                }
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch {
            setMessage({ type: 'error', text: 'Something went wrong' });
        } finally {
            setSubmitting(false);
        }
    };

    // Team creation handlers
    const addMemberRow = () => {
        setTeamForm(f => ({ ...f, members: [...f.members, { name: '', userId: '' }] }));
    };

    const removeMemberRow = (i) => {
        setTeamForm(f => ({ ...f, members: f.members.filter((_, idx) => idx !== i) }));
    };

    const updateMember = (i, field, value) => {
        setTeamForm(f => {
            const members = [...f.members];
            members[i] = { ...members[i], [field]: value };
            return { ...f, members };
        });
    };

    const handleCreateTeam = async () => {
        setMessage({ type: '', text: '' });
        if (!teamForm.teamName.trim()) {
            setMessage({ type: 'error', text: 'Team name is required' });
            return;
        }
        // Filter out empty member rows
        const members = teamForm.members.filter(m => m.name.trim() && m.userId.trim());

        setTeamCreating(true);
        try {
            const res = await authFetch('/api/teams', {
                method: 'POST',
                body: JSON.stringify({ teamName: teamForm.teamName, domain: teamForm.domain, members }),
            });
            const data = await res.json();
            if (res.ok) {
                setTeam(data.team);
                setShowTeamForm(false);
                setMessage({ type: 'success', text: '🎉 Team created successfully!' });
            } else {
                setMessage({ type: 'error', text: data.error });
            }
        } catch {
            setMessage({ type: 'error', text: 'Failed to create team' });
        } finally {
            setTeamCreating(false);
        }
    };

    if (loading || !user) return null;

    const progress = project?.status === 'submitted' ? 100 : project ? 60 : team ? 30 : 0;

    return (
        <div className="page-container">
            {showConfetti && <ReactConfetti recycle={false} numberOfPieces={300} />}

            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
                            Welcome, <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user.name}</span>!
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>
                            Nexus ID: <span style={{ color: 'var(--accent-blue)' }}>{user.userId}</span>
                        </p>
                    </div>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {/* Team Section */}
                <ScrollReveal delay={0.05}>
                    <GlassCard hover={false} style={{ height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12, margin: 0 }}>
                                <Users size={24} color="#6366f1" /> My Team
                            </h2>
                            {!team && (
                                <button className="glow-btn" onClick={() => setShowTeamForm(!showTeamForm)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                    {showTeamForm ? 'Cancel' : 'Create Team'}
                                </button>
                            )}
                        </div>

                        {team ? (
                            <div>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    <div style={{ padding: '1.25rem', borderRadius: 20, background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)' }}>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'block', marginBottom: 4 }}>Team Name</span>
                                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{team.teamName}</span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div style={{ padding: '1rem', borderRadius: 16, background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.1)' }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 2 }}>Domain</span>
                                            <span style={{ fontWeight: 700, color: '#a855f7' }}>{team.domain}</span>
                                        </div>
                                        <div style={{ padding: '1rem', borderRadius: 16, background: 'rgba(6,182,212,0.04)', border: '1px solid rgba(6,182,212,0.1)' }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 2 }}>Leader</span>
                                            <span style={{ fontWeight: 700, color: '#0891b2' }}>{team.leaderName}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 12, display: 'block' }}>Roster</span>
                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                            {team.members.map((m, i) => (
                                                <div key={i} style={{ padding: '6px 14px', borderRadius: 12, background: 'white', border: '1px solid var(--border-glass)', fontSize: '0.85rem', fontWeight: 500 }}>
                                                    {m.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : showTeamForm ? (
                            /* Simplified Team creation form for Dashboard preview */
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Create your team to begin collaboration.</p>
                                <button className="glow-btn" onClick={() => router.push('/dashboard/submit')} style={{ width: '100%' }}>
                                    Setup Team & Project
                                </button>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                <Users size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
                                <p style={{ margin: 0, fontWeight: 500 }}>No team found for Nexus user {user.userId}</p>
                                <button className="glow-btn" onClick={() => setShowTeamForm(true)} style={{ marginTop: 20 }}>
                                    Initialize Team
                                </button>
                            </div>
                        )}
                    </GlassCard>
                </ScrollReveal>

                {/* Projects Submitted Section */}
                <ScrollReveal delay={0.1}>
                    <GlassCard hover={false} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12, margin: 0 }}>
                                <Rocket size={24} color="#a855f7" /> Projects
                            </h2>
                            <button className="glow-btn" onClick={() => router.push('/dashboard/submit')} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                {project ? 'Update Project' : 'New Project'}
                            </button>
                        </div>

                        {project ? (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{
                                    padding: '1.5rem', borderRadius: 24,
                                    background: project.status === 'submitted' ? 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(99,102,241,0.03))' : 'rgba(248,248,252,0.6)',
                                    border: `1.5px solid ${project.status === 'submitted' ? 'rgba(34,197,94,0.2)' : 'rgba(200,200,220,0.3)'}`,
                                    marginBottom: '1.5rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{project.title}</h3>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase',
                                            background: project.status === 'submitted' ? '#22c55e' : '#94a3b8', color: 'white'
                                        }}>
                                            {project.status}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {project.description}
                                    </p>
                                    <div style={{ display: 'flex', gap: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                                            <Github size={16} /> {project.githubUrl ? 'Linked' : 'Missing'}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                                            <Globe size={16} /> {project.liveUrl ? 'Live' : 'No Demo'}
                                        </div>
                                    </div>
                                </div>

                                {/* Rating & Score Display */}
                                {project.status === 'submitted' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: 'auto' }}>
                                        <div style={{ padding: '1.25rem', borderRadius: 20, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, marginBottom: 4 }}>Nexus Rating</div>
                                            <div style={{ fontSize: '2rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                                {project.rating || '0.0'}<span style={{ fontSize: '1rem', opacity: 0.6 }}>/5</span>
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.25rem', borderRadius: 20, background: 'linear-gradient(135deg, #a855f7, #9333ea)', color: 'white', textAlign: 'center' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: 0.8, marginBottom: 4 }}>Audit Score</div>
                                            <div style={{ fontSize: '2rem', fontWeight: 900 }}>
                                                {project.score || '0'}<span style={{ fontSize: '1rem', opacity: 0.6 }}>%</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                                <Rocket size={48} style={{ marginBottom: 16, opacity: 0.2 }} />
                                <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontWeight: 500 }}>No active missions found. Initialize your project submission.</p>
                                <button className="glow-btn" onClick={() => router.push('/dashboard/submit')} style={{ width: '100%', padding: '14px' }}>
                                    Deploy Project
                                </button>
                            </div>
                        )}
                    </GlassCard>
                </ScrollReveal>
            </div>
        </div>
    );
}

