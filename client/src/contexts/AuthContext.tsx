import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Configure axios for credentials
axios.defaults.withCredentials = true;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface User {
    _id: string;
    name: string;
    email: string;
    plan: 'free' | 'premium';
    profileCompleted: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    register: (data: any) => Promise<void>;
    login: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkAuth = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/auth/me`);
            setUser(res.data);
            setError(null);
        } catch (err: any) {
            setUser(null);
            // Don't set global error for checkAuth
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: any) => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.post(`${API_URL}/auth/register`, data);
            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const login = async (data: any) => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.post(`${API_URL}/auth/login`, data);
            setUser(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/auth/logout`);
            setUser(null);
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
