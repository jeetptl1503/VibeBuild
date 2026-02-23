'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff, Sparkles, Zap, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [teamId, setTeamId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!teamId.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const user = await login(teamId, password);
            if (user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem', position: 'relative',
        }}>
            {/* Floating shapes */}
            {[
                { top: '15%', left: '10%', size: 120, color: 'rgba(99,102,241,0.06)', delay: 0 },
                { top: '60%', right: '8%', size: 80, color: 'rgba(139,92,246,0.06)', delay: 1 },
                { bottom: '20%', left: '5%', size: 100, color: 'rgba(236,72,153,0.05)', delay: 2 },
                { top: '10%', right: '15%', size: 60, color: 'rgba(6,182,212,0.06)', delay: 0.5 },
            ].map((shape, i) => (
                <motion.div
                    key={i}
                    animate={{ y: [0, -30, 0], rotate: [0, 180, 360], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 8 + i * 2, delay: shape.delay, ease: 'easeInOut' }}
                    style={{
                        position: 'absolute', ...shape, width: shape.size, height: shape.size,
                        borderRadius: i % 2 === 0 ? '50%' : '30%',
                        background: shape.color, filter: 'blur(1px)',
                    }}
                />
            ))}

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                style={{
                    width: '100%', maxWidth: 420, padding: '2.5rem',
                    background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(200,210,255,0.35)', borderRadius: 24,
                    boxShadow: '0 8px 40px rgba(99,102,241,0.1)',
                    position: 'relative', zIndex: 2,
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                        style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}
                    >
                        ⚡
                    </motion.div>
                    <h1 style={{
                        fontSize: '1.75rem', fontWeight: 800,
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>
                        Sign in to your VibeBuild workspace
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                padding: '12px 16px', borderRadius: 12, marginBottom: '1rem',
                                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                color: '#dc2626', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8,
                            }}
                        >
                            <AlertCircle size={16} /> {error}
                        </motion.div>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                            Team ID
                        </label>
                        <input
                            className="glow-input"
                            type="text"
                            placeholder="e.g. TEAM001"
                            value={teamId}
                            onChange={(e) => setTeamId(e.target.value.toUpperCase())}
                            autoComplete="username"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="glow-input"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                style={{ paddingRight: 44 }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        className="glow-btn"
                        disabled={loading}
                        whileTap={{ scale: 0.98 }}
                        style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                        {loading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                <Zap size={20} />
                            </motion.div>
                        ) : (
                            <><LogIn size={20} /> Sign In</>
                        )}
                    </motion.button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <Sparkles size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                        Credentials provided by workshop organizers
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
