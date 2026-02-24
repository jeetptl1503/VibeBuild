'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('vibebuild_token');
        if (storedToken) {
            setToken(storedToken);
            verifyToken(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    async function verifyToken(t) {
        try {
            const res = await fetch('/api/auth/verify', {
                headers: { Authorization: `Bearer ${t}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                logout();
            }
        } catch {
            logout();
        } finally {
            setLoading(false);
        }
    }

    async function login(userId, password) {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        localStorage.setItem('vibebuild_token', data.token);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    }

    async function logout() {
        localStorage.removeItem('vibebuild_token');
        setToken(null);
        setUser(null);
        try { await fetch('/api/auth/logout', { method: 'POST' }); } catch { }
    }

    function authFetch(url, options = {}) {
        const t = token || localStorage.getItem('vibebuild_token');
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(t ? { Authorization: `Bearer ${t}` } : {}),
                ...options.headers,
            },
        });
    }

    return (
        <AuthContext.Provider value={{ user, loading, token, login, logout, authFetch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
