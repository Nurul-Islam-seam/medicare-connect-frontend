'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import api from '@/lib/api';
import { IUser } from '@/types';

interface AuthContextType {
    user: IUser | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    googleLogin: () => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<IUser>) => void;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    photo?: string;
    phone?: string;
    gender?: string;
    role?: string;
    specialization?: string;
    qualifications?: string[];
    experience?: number;
    consultationFee?: number;
    hospitalName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(() => {
        if (typeof window === 'undefined') return null;
        const savedUser = localStorage.getItem('medicare_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState<string | null>(() => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('medicare_token');
    });
    const [loading, setLoading] = useState(() => {
        if (typeof window === 'undefined') return true;
        return Boolean(localStorage.getItem('medicare_token') && localStorage.getItem('medicare_user'));
    });

    // Restore session from localStorage on mount
    useEffect(() => {
        const savedToken = localStorage.getItem('medicare_token');
        const savedUser = localStorage.getItem('medicare_user');

        if (savedToken && savedUser) {
            // Verify token is still valid
            api.get('/auth/me')
                .then((res) => {
                    setUser(res.data.user);
                    localStorage.setItem('medicare_user', JSON.stringify(res.data.user));
                })
                .catch(() => {
                    // Token invalid — clean up
                    localStorage.removeItem('medicare_token');
                    localStorage.removeItem('medicare_user');
                    setToken(null);
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            void Promise.resolve().then(() => setLoading(false));
        }
    }, []);

    const login = async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password });
        const { token: newToken, user: newUser } = res.data;

        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('medicare_token', newToken);
        localStorage.setItem('medicare_user', JSON.stringify(newUser));
    };

    const register = async (data: RegisterData) => {
        const res = await api.post('/auth/register', data);
        const { token: newToken, user: newUser } = res.data;

        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('medicare_token', newToken);
        localStorage.setItem('medicare_user', JSON.stringify(newUser));
    };

    const googleLogin = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        const res = await api.post('/auth/google', {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            photo: firebaseUser.photoURL,
            googleId: firebaseUser.uid,
        });

        const { token: newToken, user: newUser } = res.data;

        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('medicare_token', newToken);
        localStorage.setItem('medicare_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('medicare_token');
        localStorage.removeItem('medicare_user');
    };

    const updateUser = (userData: Partial<IUser>) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('medicare_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, googleLogin, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
