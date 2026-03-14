import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, AlertCircle, ArrowRight, ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useLanguage } from '../contexts/LanguageContext';

const SignUpPage = () => {
    const { t, isRTL } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');
    const { register, error: apiError, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (localError) setLocalError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setLocalError(t('passwordsDoNotMatch'));
        }

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            navigate('/signin', {
                state: {
                    successMessage: isRTL ? 'تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك.' : 'Registration successful! Please check your email to verify your account.'
                }
            });
        } catch (err) {
            // Error handled by context
        }
    };

    return (
        <div className={`min-h-screen bg-white flex flex-col items-center justify-center p-6 font-cairo ${isRTL ? 'rtl font-cairo' : 'ltr font-poppins'} relative overflow-hidden`}>

            {/* Animated Decorative Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-50 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[100px] opacity-40" />
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[520px] bg-white border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
                <div className="relative z-10">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-600/20 mb-6 -rotate-3">
                            <GraduationCap size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-3">{t('signUpTitle')}</h2>
                        <p className="text-slate-500">{t('signUpSubtitle')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                                <label className={`text-sm font-bold text-slate-700 ${isRTL ? 'mr-2 text-right block' : 'ml-2 text-left block'}`}>{t('fullNameLabel')}</label>
                                <Input
                                    name="name"
                                    placeholder={t('fullNamePlaceholder')}
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 py-6 rounded-2xl focus:border-purple-600 focus:bg-white transition-all shadow-sm"
                                    icon={<User size={20} className="text-slate-400" />}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className={`text-sm font-bold text-slate-700 ${isRTL ? 'mr-2 text-right block' : 'ml-2 text-left block'}`}>{t('emailLabel')}</label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder={t('emailPlaceholder')}
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 py-6 rounded-2xl focus:border-purple-600 focus:bg-white transition-all shadow-sm"
                                    icon={<Mail size={20} className="text-slate-400" />}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className={`text-sm font-bold text-slate-700 ${isRTL ? 'mr-2 text-right block' : 'ml-2 text-left block'}`}>{t('passwordLabel')}</label>
                                    <div className="relative">
                                        <Input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            required
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 py-6 rounded-2xl focus:border-purple-600 focus:bg-white transition-all shadow-sm"
                                            icon={<Lock size={20} className="text-slate-400" />}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className={`text-sm font-bold text-slate-700 ${isRTL ? 'mr-2 text-right block' : 'ml-2 text-left block'}`}>{t('confirmPasswordLabel')}</label>
                                    <div className="relative">
                                        <Input
                                            name="confirmPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 py-6 rounded-2xl focus:border-purple-600 focus:bg-white transition-all shadow-sm"
                                            icon={<Lock size={20} className="text-slate-400" />}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors`}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {(localError || apiError) && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex items-center gap-3 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold border border-red-100 ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                            >
                                <AlertCircle size={18} className="shrink-0" />
                                <span>{localError || apiError}</span>
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className={`w-full py-8 text-lg font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-purple-600/10 flex items-center justify-center gap-3 mt-4 border-none ${isRTL ? 'flex-row-reverse' : ''}`}
                            isLoading={loading}
                        >
                            <span>{t('signUpBtn')}</span>
                            {isRTL ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-10 text-center">
                        <p className="text-slate-500">
                            {t('alreadyHaveAccount')}{' '}
                            <Link to="/signin" className="text-purple-600 hover:text-purple-700 font-black">
                                {t('signIn')}
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUpPage;
