import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap, Twitter, Instagram, Linkedin, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export const MainLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { t, isRTL, language, setLanguage } = useLanguage();
    const navigate = useNavigate();

    const navLinks = [
        { name: t('home'), href: '/' },
        { name: t('howItWorks'), href: '#how-it-works' },
        { name: t('pricing'), href: '#pricing' },
    ];

    return (
        <div className={`flex flex-col min-h-screen bg-white text-slate-900 ${isRTL ? 'rtl' : 'ltr'}`}>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {location.pathname !== '/' && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 hover:text-indigo-600 p-2"
                                onClick={() => navigate(-1)}
                                title={isRTL ? 'خطوة للخلف' : 'Go back'}
                            >
                                {isRTL ? <ArrowRight size={22} /> : <ArrowLeft size={22} />}
                            </Button>
                        )}
                        <Link to="/" className={`flex items-center gap-2 group ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center text-white rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                <GraduationCap size={24} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">
                                {t('appTitle')}
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600"
                            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                        >
                            <span className="font-bold">{language === 'ar' ? 'English' : 'العربية'}</span>
                        </Button>
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors">
                                    {t('dashboard')}
                                </Link>
                                <Button variant="outline" className="text-sm px-6 py-2 border-slate-200 text-slate-600 hover:bg-slate-50" onClick={logout}>
                                    {t('logout')}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/signin">
                                    <Button variant="ghost" className="text-sm px-6 py-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-50">
                                        {t('signIn')}
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="gold" className="text-sm px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 border-none shadow-indigo-100">
                                        {t('getStarted')}
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-slate-900"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Nav Overlay */}
                {isMenuOpen && (
                    <div className={`md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-100 shadow-xl p-6 flex flex-col gap-6 animate-in slide-in-from-top duration-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-lg font-bold text-slate-900"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
                            {user ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-slate-200 text-slate-600">
                                            {t('dashboard')}
                                        </Button>
                                    </Link>
                                    <Button variant="gold" className="w-full bg-indigo-600 text-white" onClick={() => { logout(); setIsMenuOpen(false); }}>
                                        {t('logout')}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full border-slate-200 text-slate-600">
                                            {t('signIn')}
                                        </Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="gold" className="w-full bg-indigo-600 text-white">
                                            {t('getStarted')}
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-10 text-slate-600">
                <div className="container mx-auto px-6">
                    <div className={`grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className="col-span-1 md:col-span-1">
                            <Link to="/" className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center text-white">
                                    <GraduationCap size={18} />
                                </div>
                                <span className="text-lg font-bold tracking-tight text-slate-900">
                                    {t('appTitle')}
                                </span>
                            </Link>
                            <p className={`text-slate-500 text-sm leading-relaxed max-w-xs ${isRTL ? 'text-right' : 'text-left'}`}>
                                {t('footerDesc')}
                            </p>
                        </div>

                        <div className="col-span-1">
                            <h4 className="font-bold text-slate-900 mb-6 font-cairo">{t('company')}</h4>
                            <ul className="space-y-4 text-sm text-slate-500 font-cairo">
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('about')}</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('careers')}</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('contact')}</a></li>
                            </ul>
                        </div>

                        <div className="col-span-1">
                            <h4 className="font-bold text-slate-900 mb-6 font-cairo">{t('resources')}</h4>
                            <ul className="space-y-4 text-sm text-slate-500 font-cairo">
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('blog')}</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('support')}</a></li>
                                <li><a href="#" className="hover:text-indigo-600 transition-colors">{t('privacy')}</a></li>
                            </ul>
                        </div>

                        <div className="col-span-1">
                            <h4 className="font-bold text-slate-900 mb-6 font-cairo">{t('connect')}</h4>
                            <div className="flex gap-4 mb-6">
                                <a href="#" className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:text-indigo-600 transition-all text-slate-400">
                                    <Twitter size={18} />
                                </a>
                                <a href="#" className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:text-indigo-600 transition-all text-slate-400">
                                    <Instagram size={18} />
                                </a>
                                <a href="#" className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:text-indigo-600 transition-all text-slate-400">
                                    <Linkedin size={18} />
                                </a>
                            </div>
                            <p className="text-xs text-slate-400">© 2026 {t('appTitle')}</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
