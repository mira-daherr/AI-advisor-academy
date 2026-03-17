import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from '../components/ui/Spinner';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { checkAuth } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // 1. Save to localStorage
            localStorage.setItem('token', token);

            // 2. Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // 3. Call checkAuth() to load user data
            checkAuth().then(() => {
                // 4. Redirect to home
                navigate('/');
            }).catch((err) => {
                console.error('Auth verification failed:', err);
                navigate('/signin?error=auth_failed');
            });
        } else {
            console.error('No token found in URL');
            navigate('/signin?error=no_token');
        }
    }, [location, navigate, checkAuth]);

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-soft-warm">
            <Spinner size="lg" />
            <p className="mt-4 text-deep-purple font-medium">جاري تسجيل الدخول...</p>
        </div>
    );
};

export default AuthCallback;
