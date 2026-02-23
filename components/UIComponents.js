'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

export function AnimatedCounter({ end, duration = 2, label, icon }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [inView, end, duration]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="glass-card"
            style={{ padding: '2rem', textAlign: 'center', flex: 1, minWidth: 200 }}
        >
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{icon}</div>
            <div style={{
                fontSize: '2.5rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
                {label === 'Attendance' ? `${count}%` : count}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4, fontWeight: 500 }}>{label}</div>
        </motion.div>
    );
}

export function ScrollReveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-50px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
        >
            {children}
        </motion.div>
    );
}

export function GlassCard({ children, style, hover = true, ...props }) {
    return (
        <motion.div
            className="glass-card"
            whileHover={hover ? { y: -4, boxShadow: '0 12px 40px rgba(99,102,241,0.15)' } : {}}
            style={{ padding: '1.5rem', ...style }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function SkeletonCard() {
    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 60, width: '100%', marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
                <div className="skeleton" style={{ height: 24, width: 60 }} />
                <div className="skeleton" style={{ height: 24, width: 60 }} />
                <div className="skeleton" style={{ height: 24, width: 60 }} />
            </div>
        </div>
    );
}
