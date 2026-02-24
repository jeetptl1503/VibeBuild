'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { MessageCircle, X, Send, Bot, User, Sparkles, Github, Rocket, ArrowLeft, ChevronRight } from 'lucide-react';

// Built-in detailed guides
const GUIDES = {
    github: {
        title: '📦 Create a GitHub Repository',
        steps: [
            {
                title: 'Step 1: Install Git Bash',
                content: `1. Go to **https://git-scm.com/downloads**
2. Download Git for your OS (Windows/Mac/Linux)
3. Run the installer → click **Next** through all steps
4. Open **Git Bash** from Start Menu after installation

💡 Verify installation by typing:
\`\`\`
git --version
\`\`\``
            },
            {
                title: 'Step 2: Configure Git',
                content: `Open Git Bash and set your name and email:

\`\`\`
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
\`\`\`

These will appear on your commits.`
            },
            {
                title: 'Step 3: Create a Repository on GitHub',
                content: `1. Go to **https://github.com** → Sign up or Log in
2. Click the **+** icon (top-right) → **New repository**
3. Enter a **repository name** (e.g. \`my-project\`)
4. Choose **Public** or **Private**
5. ✅ Check "Add a README file" (optional)
6. Click **Create repository**
7. Copy the repo URL (e.g. \`https://github.com/user/my-project.git\`)`
            },
            {
                title: 'Step 4: Push Your Project',
                content: `Navigate to your project folder in Git Bash:

\`\`\`
cd /c/Users/YourName/Desktop/my-project
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/user/my-project.git
git push -u origin main
\`\`\`

Enter your GitHub username and **Personal Access Token** when prompted.

🔑 To create a token: GitHub → Settings → Developer settings → Personal access tokens → Generate new token`
            },
            {
                title: 'Step 5: Make Updates',
                content: `After making changes to your code:

\`\`\`
git add .
git commit -m "Describe your changes"
git push
\`\`\`

That's it! Your code is now on GitHub! 🎉`
            },
        ],
    },
    vercel: {
        title: '🚀 Deploy on Vercel',
        steps: [
            {
                title: 'Step 1: Sign Up on Vercel',
                content: `1. Go to **https://vercel.com**
2. Click **Sign Up**
3. Choose **Continue with GitHub** (recommended)
4. Authorize Vercel to access your GitHub account

This links your GitHub repos to Vercel automatically!`
            },
            {
                title: 'Step 2: Import Your Project',
                content: `1. On the Vercel dashboard, click **Add New → Project**
2. You'll see your GitHub repos listed
3. Find your project and click **Import**
4. Vercel auto-detects the framework (Next.js, React, etc.)

If your repo is private, click **"Adjust GitHub App Permissions"** to grant access.`
            },
            {
                title: 'Step 3: Configure Settings',
                content: `Before deploying, you can set:

- **Framework Preset**: Usually auto-detected
- **Root Directory**: Leave as \`./\` unless your app is in a subfolder
- **Build Command**: Usually \`npm run build\` (auto-detected)
- **Environment Variables**: Click "Environment Variables" and add:
  - \`DATABASE_URL\` = your MongoDB URL (if applicable)
  - \`JWT_SECRET\` = your secret key
  - Any other \`.env\` variables your app needs`
            },
            {
                title: 'Step 4: Deploy!',
                content: `1. Click **Deploy**
2. Vercel will:
   - Clone your repo
   - Install dependencies
   - Build your project
   - Deploy to a global CDN

3. After ~1-2 minutes, you'll get a live URL like:
   **https://your-project.vercel.app** 🎉

You can also add a **custom domain** in Project Settings → Domains.`
            },
            {
                title: 'Step 5: Auto-Deploy',
                content: `Every time you push to GitHub:

\`\`\`
git add .
git commit -m "New feature"
git push
\`\`\`

Vercel **automatically redeploys** your project! No manual steps needed.

🔄 Each push creates a new **preview deployment**.
The **main** branch deploys to your production URL.`
            },
        ],
    },
};

export default function ChatBot() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeGuide, setActiveGuide] = useState(null);
    const [guideStep, setGuideStep] = useState(0);
    const chatRef = useRef(null);

    useEffect(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [messages, activeGuide, guideStep]);

    if (!user) return null;

    async function handleSend() {
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Check for guide-related queries
        const q = input.toLowerCase();
        if (q.includes('github') && (q.includes('repo') || q.includes('create') || q.includes('push') || q.includes('upload'))) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'I have a detailed guide for creating a GitHub repository! Let me show you step by step. 📦' }]);
            setActiveGuide('github');
            setGuideStep(0);
            setLoading(false);
            return;
        }
        if ((q.includes('vercel') || q.includes('deploy') || q.includes('host')) && (q.includes('website') || q.includes('project') || q.includes('app') || q.includes('deploy') || q.includes('vercel'))) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'I have a complete deployment guide for Vercel! Let me walk you through it. 🚀' }]);
            setActiveGuide('vercel');
            setGuideStep(0);
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('vibebuild_token');
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.message || 'Sorry, I couldn\'t process that.' }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Oops! Something went wrong. Please try again.' }]);
        } finally {
            setLoading(false);
        }
    }

    function handleQuickAction(type) {
        setActiveGuide(type);
        setGuideStep(0);
        setMessages(prev => [...prev,
        { role: 'user', content: type === 'github' ? 'How do I create a GitHub repo?' : 'How do I deploy on Vercel?' },
        { role: 'assistant', content: `Here's the complete guide! Follow along step by step ${type === 'github' ? '📦' : '🚀'}` },
        ]);
    }

    function renderGuide() {
        const guide = GUIDES[activeGuide];
        if (!guide) return null;
        const step = guide.steps[guideStep];

        return (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{
                    padding: '1rem', margin: '0.5rem 0', borderRadius: 16,
                    background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.12)',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-blue)' }}>{guide.title}</span>
                    <button onClick={() => { setActiveGuide(null); setGuideStep(0); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                        <X size={16} />
                    </button>
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', gap: 4, marginBottom: '0.75rem' }}>
                    {guide.steps.map((_, i) => (
                        <div key={i} style={{
                            flex: 1, height: 4, borderRadius: 4,
                            background: i <= guideStep ? 'var(--accent-blue)' : 'rgba(99,102,241,0.12)',
                            transition: 'all 0.3s',
                        }} />
                    ))}
                </div>

                {/* Step Content */}
                <div style={{ marginBottom: '0.75rem' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '0.88rem', margin: '0 0 8px' }}>{step.title}</h4>
                    <div style={{ fontSize: '0.82rem', lineHeight: 1.7, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                        {step.content.split(/(`{3}[\s\S]*?`{3}|`[^`]+`|\*\*[^*]+\*\*)/g).map((part, i) => {
                            if (part.startsWith('```')) {
                                const code = part.replace(/```\w*\n?/g, '').trim();
                                return (
                                    <pre key={i} style={{
                                        background: 'rgba(0,0,0,0.04)', padding: '10px 14px', borderRadius: 10,
                                        fontSize: '0.78rem', fontFamily: 'monospace', overflowX: 'auto',
                                        margin: '8px 0', lineHeight: 1.5,
                                    }}>{code}</pre>
                                );
                            }
                            if (part.startsWith('`') && part.endsWith('`')) {
                                return <code key={i} style={{ background: 'rgba(0,0,0,0.04)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.78rem' }}>{part.slice(1, -1)}</code>;
                            }
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={i}>{part.slice(2, -2)}</strong>;
                            }
                            return <span key={i}>{part}</span>;
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Step {guideStep + 1} of {guide.steps.length}</span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        {guideStep > 0 && (
                            <button onClick={() => setGuideStep(s => s - 1)}
                                style={{ padding: '6px 14px', borderRadius: 10, border: '1px solid var(--border-glass)', background: 'white', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <ArrowLeft size={14} /> Back
                            </button>
                        )}
                        {guideStep < guide.steps.length - 1 ? (
                            <button onClick={() => setGuideStep(s => s + 1)}
                                style={{ padding: '6px 14px', borderRadius: 10, border: 'none', background: 'var(--accent-blue)', color: 'white', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                                Next <ChevronRight size={14} />
                            </button>
                        ) : (
                            <button onClick={() => { setActiveGuide(null); setGuideStep(0); }}
                                style={{ padding: '6px 14px', borderRadius: 10, border: 'none', background: '#10b981', color: 'white', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
                                ✅ Done
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                onClick={() => setOpen(!open)}
                style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 9998,
                    width: 56, height: 56, borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.4)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                {open ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            position: 'fixed', bottom: 90, right: 24, zIndex: 9999,
                            width: 380, maxWidth: 'calc(100vw - 48px)', height: 520, maxHeight: 'calc(100vh - 120px)',
                            borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(200,210,255,0.35)',
                            boxShadow: '0 8px 40px rgba(99,102,241,0.15)',
                        }}>

                        {/* Header */}
                        <div style={{
                            padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10,
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))',
                            borderBottom: '1px solid rgba(200,210,255,0.25)',
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            }}>
                                <Sparkles size={18} color="white" />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>VibeBuild AI</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Your workshop assistant</div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={chatRef} style={{ flex: 1, overflow: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                            {/* Welcome message */}
                            {messages.length === 0 && !activeGuide && (
                                <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
                                    <Sparkles size={32} color="var(--accent-blue)" style={{ marginBottom: 10 }} />
                                    <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 6 }}>Hi! How can I help? 👋</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1rem' }}>
                                        Ask me anything about the workshop, or use the quick actions below.
                                    </p>

                                    {/* Quick Actions */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch' }}>
                                        <button onClick={() => handleQuickAction('github')}
                                            style={{
                                                padding: '12px 16px', borderRadius: 14, border: '1px solid rgba(99,102,241,0.15)',
                                                background: 'rgba(99,102,241,0.04)', cursor: 'pointer', textAlign: 'left',
                                                display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
                                            }}>
                                            <Github size={20} color="#6366f1" />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Create GitHub Repo</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Step-by-step using Git Bash</div>
                                            </div>
                                            <ChevronRight size={16} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
                                        </button>
                                        <button onClick={() => handleQuickAction('vercel')}
                                            style={{
                                                padding: '12px 16px', borderRadius: 14, border: '1px solid rgba(99,102,241,0.15)',
                                                background: 'rgba(99,102,241,0.04)', cursor: 'pointer', textAlign: 'left',
                                                display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s',
                                            }}>
                                            <Rocket size={20} color="#8b5cf6" />
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Deploy on Vercel</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>From scratch to live URL</div>
                                            </div>
                                            <ChevronRight size={16} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Chat messages */}
                            {messages.map((msg, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    }}>
                                    <div style={{
                                        maxWidth: '85%', padding: '10px 14px', borderRadius: 16,
                                        background: msg.role === 'user' ?
                                            'linear-gradient(135deg, #6366f1, #8b5cf6)' :
                                            'rgba(0,0,0,0.03)',
                                        color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                                        fontSize: '0.85rem', lineHeight: 1.5,
                                        borderBottomRightRadius: msg.role === 'user' ? 4 : 16,
                                        borderBottomLeftRadius: msg.role === 'user' ? 16 : 4,
                                    }}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}

                            {/* Guide Steps */}
                            {activeGuide && renderGuide()}

                            {/* Typing indicator */}
                            {loading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    style={{ display: 'flex', gap: 4, padding: '8px 14px' }}>
                                    {[0, 1, 2].map(i => (
                                        <motion.div key={i}
                                            animate={{ y: [0, -6, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
                                            style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-blue)', opacity: 0.5 }}
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Quick actions below chat */}
                        {messages.length > 0 && !activeGuide && (
                            <div style={{ padding: '0 1rem 0.5rem', display: 'flex', gap: 6 }}>
                                <button onClick={() => handleQuickAction('github')}
                                    style={{ padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(99,102,241,0.15)', background: 'rgba(99,102,241,0.04)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Github size={12} /> GitHub
                                </button>
                                <button onClick={() => handleQuickAction('vercel')}
                                    style={{ padding: '6px 12px', borderRadius: 20, border: '1px solid rgba(99,102,241,0.15)', background: 'rgba(99,102,241,0.04)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Rocket size={12} /> Vercel
                                </button>
                            </div>
                        )}

                        {/* Input */}
                        <div style={{
                            padding: '12px 14px', borderTop: '1px solid rgba(200,210,255,0.25)',
                            display: 'flex', gap: 8,
                        }}>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="Ask anything..."
                                style={{
                                    flex: 1, padding: '10px 14px', borderRadius: 14, border: '1px solid rgba(200,210,255,0.3)',
                                    background: 'rgba(255,255,255,0.6)', outline: 'none', fontSize: '0.85rem',
                                }}
                            />
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                style={{
                                    padding: '10px', borderRadius: 14, border: 'none', cursor: 'pointer',
                                    background: input.trim() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(0,0,0,0.05)',
                                    color: input.trim() ? 'white' : 'var(--text-muted)', transition: 'all 0.2s',
                                }}>
                                <Send size={18} />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
