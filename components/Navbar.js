'use client';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Shield, LayoutDashboard, Globe, Image, Calendar, HelpCircle, Award, BarChart3, Users } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const publicLinks = [
        { href: '/', label: 'Home', icon: Globe },
        { href: '/showcase', label: 'Showcase', icon: Globe },
        { href: '/schedule', label: 'Schedule', icon: Calendar },
        { href: '/faq', label: 'FAQ', icon: HelpCircle },
    ];

    const teamLinks = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/showcase', label: 'Showcase', icon: Globe },
        { href: '/gallery', label: 'Gallery', icon: Image },
        { href: '/certificates', label: 'Certificates', icon: Award },
        { href: '/schedule', label: 'Schedule', icon: Calendar },
        { href: '/faq', label: 'FAQ', icon: HelpCircle },
    ];

    const adminLinks = [
        { href: '/admin', label: 'Admin', icon: Shield },
        { href: '/admin/attendance', label: 'Attendance', icon: Users },
        { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
        { href: '/showcase', label: 'Showcase', icon: Globe },
        { href: '/gallery', label: 'Gallery', icon: Image },
        { href: '/schedule', label: 'Schedule', icon: Calendar },
    ];

    const links = !user ? publicLinks : user.role === 'admin' ? adminLinks : teamLinks;

    if (pathname === '/login') return null;

    return (
        <nav className="nav-container">
            <div className="nav-inner">
                <Link href="/" className="nav-logo">
                    ⚡ VibeBuild
                </Link>

                <div className="nav-links" style={mobileOpen ? { display: 'flex', flexDirection: 'column', position: 'absolute', top: 70, left: 0, right: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', padding: '1rem', borderBottom: '1px solid rgba(200,210,255,0.35)', zIndex: 100 } : {}}>
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <link.icon size={16} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                            {link.label}
                        </Link>
                    ))}
                    {user && (
                        <button
                            onClick={handleLogout}
                            className="nav-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    )}
                    {!user && (
                        <Link href="/login" className="glow-btn" style={{ padding: '8px 20px', fontSize: '0.85rem', textDecoration: 'none' }}>
                            Login
                        </Link>
                    )}
                </div>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </nav>
    );
}
