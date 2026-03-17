import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, AlertCircle, ArrowRight, ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useLanguage } from '../contexts/LanguageContext';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const SignInPage = () => {
    const { t, isRTL } = useLanguage();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const { login, error: apiError, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/');
        } catch (err) {
            // Error handled by context
        }
    };

    const handleGoogleSignIn = () => {
        // Full page redirect to the server's Google OAuth entry point
        window.location.href = `${API_BASE}/auth/google`;
    };

    return (
        <div className={`min-h-screen bg-white flex flex-col items-center justify-center p-6 font-cairo ${isRTL ? 'rtl font-cairo' : 'ltr font-poppins'} relative overflow-hidden`}>

            {/* Animated Decorative Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-[100px] opacity-40" />
            </div>

            {/* Navigation / Back Button */}
            <div className={`absolute top-8 left-8 right-8 flex justify-between items-center z-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Button
                    variant="ghost"
                    className={`text-slate-400 hover:text-indigo-600 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                    onClick={() => navigate(-1)}
                >
                    {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                    <span>{t('back')}</span>
                </Button>
                <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-bold">
                    {t('home')}
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] bg-white border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
                <div className="relative z-10">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 mb-6 rotate-3">
                            <GraduationCap size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-3">{t('welcomeBack')}</h2>
                        <p className="text-slate-500">{t('loginSubtitle')}</p>
                    </div>


                    {/* Google Sign-In Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        id="google-signin-btn"
                        onClick={handleGoogleSignIn}
                        className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border-2 border-slate-100 bg-white text-slate-700 font-bold text-sm hover:border-indigo-200 hover:bg-indigo-50/50 transition-all shadow-sm mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                        {/* Official Google "G" colours */}
                        <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        <span>{isRTL ? 'تسجيل الدخول بـ Google' : 'Sign in with Google'}</span>
                    </motion.button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex-1 h-px bg-slate-100" />
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                            {isRTL ? 'أو' : 'or'}
                        </span>
                        <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className={`text-sm font-bold text-slate-700 ${isRTL ? 'mr-2 text-right block' : 'ml-2 text-left block'}`}>{t('emailLabel')}</label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder={t('emailPlaceholder')}
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 py-6 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                                    icon={<Mail size={20} className="text-slate-400" />}
                                />
                            </div>

                            <div className="space-y-2">
                                <div className={`flex justify-between items-center mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <label className={`text-sm font-bold text-slate-700 ${isRTL ? 'mr-2' : 'ml-2'}`}>{t('passwordLabel')}</label>
                                    <Link to="/forgot-password" title={isRTL ? 'نسيت كلمة المرور؟' : 'Forgot Password?'} className="text-xs text-indigo-600 hover:text-indigo-700 font-bold">
                                        {t('forgotPassword')}
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={t('passwordPlaceholder')}
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 py-6 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all pr-12 shadow-sm"
                                        icon={<Lock size={20} className="text-slate-400" />}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors`}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {apiError && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex items-center gap-3 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                            >
                                <AlertCircle size={18} className="shrink-0" />
                                <span>{apiError}</span>
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className={`w-full py-8 text-lg font-black bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-indigo-600/10 flex items-center justify-center gap-3 border-none ${isRTL ? 'flex-row-reverse' : ''}`}
                            isLoading={loading}
                        >
                            <span>{t('signInBtn')}</span>
                            {isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                        </Button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-slate-500">
                            {t('noAccount')}{' '}
                            <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-black">
                                {t('createNewAccount')}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignInPage;
