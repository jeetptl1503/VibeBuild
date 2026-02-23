'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const quickActions = [
    { label: '🎯 Help me choose problem', message: 'help me choose problem' },
    { label: '🔧 Fix my error', message: 'fix my error' },
    { label: '🤖 Explain AI model usage', message: 'explain ai model usage' },
    { label: '🚀 How to deploy?', message: 'how to deploy' },
    { label: '💻 Suggest tech stack', message: 'suggest tech stack' },
];

export default function ChatBot() {
    const { user, authFetch } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I\'m VibeBuild AI 🤖\nHow can I help you today?' },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!user) return null;

    async function sendMessage(text) {
        const msg = text || input;
        if (!msg.trim() || loading) return;
        setInput('');

        const newMessages = [...messages, { role: 'user', content: msg }];
        setMessages(newMessages);
        setLoading(true);

        try {
            const res = await authFetch('/api/chat', {
                method: 'POST',
                body: JSON.stringify({
                    message: msg,
                    history: newMessages.slice(-6).map(m => ({ role: m.role, content: m.content })),
                }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong!' }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none', cursor: 'pointer', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: isOpen ? '0 4px 20px rgba(99,102,241,0.4)' : ['0 0 20px rgba(99,102,241,0.3)', '0 0 40px rgba(99,102,241,0.5)', '0 0 20px rgba(99,102,241,0.3)'] }}
                transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'fixed', bottom: 96, right: 24, zIndex: 999,
                            width: 380, maxHeight: 520, borderRadius: 20,
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(200,210,255,0.35)',
                            boxShadow: '0 8px 40px rgba(99,102,241,0.15)',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '16px 20px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            color: 'white', display: 'flex', alignItems: 'center', gap: 10,
                        }}>
                            <Sparkles size={20} />
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>VibeBuild AI</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Your workshop assistant</div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300 }}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    style={{
                                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                        maxWidth: '85%',
                                        padding: '10px 14px',
                                        borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                        background: msg.role === 'user'
                                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(240,240,255,0.8)',
                                        color: msg.role === 'user' ? 'white' : '#1a1a2e',
                                        fontSize: '0.85rem', lineHeight: 1.5, whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {msg.content}
                                </motion.div>
                            ))}
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{
                                        alignSelf: 'flex-start', padding: '10px 14px',
                                        borderRadius: '14px 14px 14px 4px',
                                        background: 'rgba(240,240,255,0.8)',
                                        fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8,
                                    }}
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                    >
                                        <Zap size={14} color="#6366f1" />
                                    </motion.div>
                                    AI Thinking...
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        {messages.length <= 1 && (
                            <div style={{ padding: '0 16px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(action.message)}
                                        style={{
                                            padding: '6px 12px', borderRadius: 20,
                                            border: '1px solid rgba(99,102,241,0.2)',
                                            background: 'rgba(99,102,241,0.05)',
                                            color: '#6366f1', fontSize: '0.72rem', cursor: 'pointer',
                                            fontWeight: 500, transition: 'all 0.2s',
                                        }}
                                        onMouseOver={e => e.target.style.background = 'rgba(99,102,241,0.1)'}
                                        onMouseOut={e => e.target.style.background = 'rgba(99,102,241,0.05)'}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(200,210,255,0.3)', display: 'flex', gap: 8 }}>
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                placeholder="Ask me anything..."
                                style={{
                                    flex: 1, padding: '10px 14px', borderRadius: 12,
                                    border: '1px solid rgba(200,210,255,0.3)',
                                    background: 'rgba(255,255,255,0.8)', fontSize: '0.85rem',
                                    outline: 'none',
                                }}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={loading || !input.trim()}
                                style={{
                                    width: 40, height: 40, borderRadius: 12,
                                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    border: 'none', cursor: 'pointer', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: loading || !input.trim() ? 0.5 : 1,
                                }}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
