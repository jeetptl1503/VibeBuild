'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/UIComponents';
import { ChevronDown } from 'lucide-react';

const faqs = [
    { q: 'What is VibeBuild?', a: 'VibeBuild is an AI-driven workshop platform where teams collaborate to solve real-world problems using AI and machine learning. Teams work on assigned domains, build solutions, and showcase their projects.' },
    { q: 'How do I log in?', a: 'Use the Team ID and Password provided by the workshop organizers. Navigate to the Login page and enter your credentials. You\'ll be redirected to your team dashboard.' },
    { q: 'How do I submit my project?', a: 'Go to your Team Dashboard, fill in the project details including title, description, GitHub URL, and tech stack. Click "Submit Project" to finalize your submission. You can save drafts before the final submission.' },
    { q: 'What domains are available?', a: 'The workshop covers four AI domains: Healthcare AI, Agriculture AI, Smart Cities, and Education Tech. Each team is pre-assigned a domain to work on.' },
    { q: 'Can I edit my submission after submitting?', a: 'Yes! You can update your submission at any time before the deadline. Just go to your dashboard and modify the fields, then resubmit.' },
    { q: 'How does the AI Chatbot help?', a: 'The AI Chatbot can help you choose problem statements, suggest tech stacks, debug code, guide AI model usage, help with deployment, and answer workshop-related questions.' },
    { q: 'What tech stack should I use?', a: 'You can use any tech stack! Recommended: Next.js or React for frontend, Python or Node.js for backend, and OpenAI, TensorFlow, or PyTorch for AI. The chatbot can suggest stacks for your domain.' },
    { q: 'How are certificates generated?', a: 'Certificates are auto-generated with your name and team details. You can download them as PDFs from the Certificates section. QR codes link to your project for verification.' },
    { q: 'Can I see other teams\' projects?', a: 'Yes! The Showcase page displays all submitted projects publicly. You can filter by domain and search for specific projects.' },
    { q: 'Who do I contact for help?', a: 'Use the AI Chatbot for technical help, or reach out to workshop organizers. Mentors are available during the mentoring rounds for one-on-one guidance.' },
];

export default function FaqPage() {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="page-container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="section-title">❓ Frequently Asked Questions</h1>
                <p className="section-subtitle">Everything you need to know about VibeBuild</p>
            </motion.div>

            <div style={{ maxWidth: 750, margin: '0 auto' }}>
                {faqs.map((faq, i) => (
                    <ScrollReveal key={i} delay={i * 0.05}>
                        <motion.div
                            className="glass-card"
                            style={{ marginBottom: '0.75rem', overflow: 'hidden', cursor: 'pointer' }}
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        >
                            <div style={{
                                padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0, paddingRight: '1rem' }}>{faq.q}</h3>
                                <motion.div animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                                    <ChevronDown size={20} color="var(--text-muted)" />
                                </motion.div>
                            </div>
                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div style={{
                                            padding: '0 1.5rem 1.25rem',
                                            color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6,
                                            borderTop: '1px solid var(--border-glass)',
                                            paddingTop: '1rem',
                                        }}>
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    );
}
