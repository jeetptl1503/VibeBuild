'use client';
import { motion } from 'framer-motion';
import { AnimatedCounter, ScrollReveal, GlassCard } from '@/components/UIComponents';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Rocket, Code2, Brain, Users, Trophy, ArrowRight, Sparkles, Zap, Globe } from 'lucide-react';

export default function HomePage() {
  const [stats, setStats] = useState({ totalTeams: 0, totalProjects: 0, domainsActive: 0, attendancePercent: 0 });

  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setStats).catch(() => { });
  }, []);

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '4rem 0 3rem', position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{ fontSize: '4rem', marginBottom: '1rem' }}
          >
            ⚡
          </motion.div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #a855f7 70%, #ec4899 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            lineHeight: 1.1, marginBottom: '1rem',
          }}>
            VibeBuild
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto 2rem', lineHeight: 1.6 }}
          >
            AI Driven Solutions & Vibe Coding Workshop — Build. Innovate. Showcase.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/login" className="glow-btn" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Rocket size={18} /> Get Started <ArrowRight size={16} />
            </Link>
            <Link href="/showcase" style={{
              padding: '12px 32px', borderRadius: 14, border: '2px solid rgba(99,102,241,0.3)',
              color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600,
              transition: 'all 0.3s', display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(99,102,241,0.05)',
            }}>
              <Globe size={18} /> View Projects
            </Link>
          </motion.div>
        </motion.div>

        {/* Floating decoration */}
        {[
          { top: '10%', left: '5%', size: 60, delay: 0, color: 'rgba(99,102,241,0.1)' },
          { top: '20%', right: '8%', size: 40, delay: 1, color: 'rgba(139,92,246,0.1)' },
          { bottom: '15%', left: '10%', size: 50, delay: 2, color: 'rgba(236,72,153,0.08)' },
          { bottom: '10%', right: '5%', size: 35, delay: 0.5, color: 'rgba(6,182,212,0.1)' },
        ].map((orb, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
            transition={{ repeat: Infinity, duration: 6 + i, delay: orb.delay, ease: 'easeInOut' }}
            style={{
              position: 'absolute', ...orb, width: orb.size, height: orb.size,
              borderRadius: '50%', background: orb.color, filter: 'blur(1px)',
            }}
          />
        ))}
      </section>

      {/* Features */}
      <ScrollReveal>
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { icon: <Code2 size={28} />, title: 'Build Projects', desc: 'Submit your AI-driven solutions with GitHub integration' },
            { icon: <Brain size={28} />, title: 'AI Assistance', desc: 'Get help from our AI chatbot for coding and debugging' },
            { icon: <Users size={28} />, title: 'Team Collaboration', desc: 'Work with your team on assigned domains' },
            { icon: <Trophy size={28} />, title: 'Showcase & Win', desc: 'Present your projects and earn certificates' },
          ].map((feature, i) => (
            <GlassCard key={i} style={{ textAlign: 'center', padding: '2rem' }}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  width: 56, height: 56, borderRadius: 16, margin: '0 auto 1rem',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent-blue)',
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{feature.desc}</p>
            </GlassCard>
          ))}
        </section>
      </ScrollReveal>

      {/* Live Stats */}
      <ScrollReveal delay={0.2}>
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>📊 Live Workshop Stats</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Real-time metrics from the workshop</p>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <AnimatedCounter end={stats.totalTeams} label="Total Teams" icon="👥" />
            <AnimatedCounter end={stats.totalProjects} label="Projects Submitted" icon="🚀" />
            <AnimatedCounter end={stats.domainsActive} label="Domains Active" icon="🎯" />
            <AnimatedCounter end={stats.attendancePercent} label="Attendance" icon="✅" />
          </div>
        </section>
      </ScrollReveal>

      {/* Domains */}
      <ScrollReveal delay={0.3}>
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>🧠 Workshop Domains</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Explore the AI domains for your projects</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {[
              { name: 'Healthcare AI', icon: '🏥', desc: 'AI solutions for healthcare and medical diagnostics' },
              { name: 'Agriculture AI', icon: '🌾', desc: 'Smart farming and crop management with AI' },
              { name: 'Smart Cities', icon: '🏙️', desc: 'Urban intelligence and infrastructure optimization' },
              { name: 'Education Tech', icon: '📚', desc: 'AI-powered learning and educational tools' },
            ].map((domain, i) => (
              <GlassCard key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem' }}>
                <span style={{ fontSize: '2rem' }}>{domain.icon}</span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>{domain.name}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: 0 }}>{domain.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal delay={0.4}>
        <section style={{ textAlign: 'center', padding: '3rem 0' }}>
          <GlassCard style={{ padding: '3rem', maxWidth: 600, margin: '0 auto', background: 'linear-gradient(135deg, rgba(99,102,241,0.05), rgba(139,92,246,0.05))' }}>
            <Sparkles size={32} color="#6366f1" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Ready to Build?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Login with your team credentials and start building AI-driven solutions!
            </p>
            <Link href="/login" className="glow-btn" style={{ textDecoration: 'none' }}>
              <Zap size={18} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }} />
              Start Building
            </Link>
          </GlassCard>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>⚡ VibeBuild — AI Driven Solutions & Vibe Coding Workshop</p>
        <p style={{ marginTop: 4 }}>Built with Next.js, Tailwind CSS & Framer Motion</p>
      </footer>
    </div>
  );
}
