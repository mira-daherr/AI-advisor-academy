import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Configure axios for credentials
// Configure axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const token = localStorage.getItem('token');
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

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
            const currentToken = localStorage.getItem('token');
            if (!currentToken) {
                setUser(null);
                setLoading(false);
                return;
            }

            const res = await axios.get(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            setUser(res.data);
            setError(null);
        } catch (err: any) {
            setUser(null);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: any) => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.post(`${API_URL}/auth/register`, data);
            const { token, ...userData } = res.data;

            if (token) {
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            setUser(userData);
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
            const { token, ...userData } = res.data;

            if (token) {
                localStorage.setItem('token', token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            setUser(userData);
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
        } catch (err) {
            console.error('Logout failed', err);
        } finally {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
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
