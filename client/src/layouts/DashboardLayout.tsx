import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    GraduationCap,
    LayoutDashboard,
    MessageSquare,
    FileText,
    Compass,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    ArrowRight,
    ArrowLeft,
    Brain
} from 'lucide-react';
import { Logo } from '../components/ui/Logo';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export const DashboardLayout = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const { t, isRTL, language, setLanguage } = useLanguage();
    console.log("[DashboardLayout] rendering with language:", language);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const sidebarLinks = [
        { name: t('home'), icon: <LayoutDashboard size={20} />, href: '/dashboard' },
        { name: t('yourResults'), icon: <Compass size={20} />, href: '/dashboard/results' },
        { name: t('advisorChat'), icon: <MessageSquare size={20} />, href: '/dashboard/chat', premium: true },
        { name: t('settings'), icon: <Settings size={20} />, href: '/dashboard/settings' },
    ];
    console.log("[DashboardLayout] Sidebar links translated. Example - Home:", sidebarLinks[0].name);

    return (
        <div className={`flex h-screen bg-slate-50 overflow-hidden ${isRTL ? 'font-cairo rtl' : 'font-poppins ltr'}`}>
            {/* Sidebar */}
            <aside
                className={`bg-white ${isRTL ? 'border-l' : 'border-r'} border-slate-100 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-72'
                    }`}
            >
                <div className="p-6">
                    <Logo showText={!isSidebarCollapsed} size={isSidebarCollapsed ? 'sm' : 'md'} className={isSidebarCollapsed ? 'justify-center' : ''} />
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {sidebarLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.href}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 font-bold shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                                } ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`
                            }
                        >
                            <span className="shrink-0">{link.icon}</span>
                            {!isSidebarCollapsed && (
                                <div className={`flex items-center justify-between flex-1 overflow-hidden ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <span className="truncate">{link.name}</span>
                                    {link.premium && <Badge variant="premium" className={`scale-75 ${isRTL ? 'origin-right md:mr-2' : 'origin-left md:ml-2'}`}>{t('premium')}</Badge>}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-50">
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-indigo-600 transition-colors ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
                    >
                        {isSidebarCollapsed ? (isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />) : (isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />)}
                        {!isSidebarCollapsed && <span>{t('collapseMenu')}</span>}
                    </button>

                    <div className={`mt-4 p-4 rounded-2xl bg-slate-50 flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center' : ''} ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                        <Avatar name={user?.name} size="sm" />
                        {!isSidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                                <p className="text-xs text-slate-500 truncate capitalize">
                                    {user?.plan === 'premium' ? t('memberGold') : t('memberFree')}
                                </p>
                            </div>
                        )}
                        {!isSidebarCollapsed && (
                            <button
                                onClick={handleLogout}
                                className="text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-50 flex items-center justify-between px-8 shrink-0">
                    <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                            title={t('back')}
                        >
                            {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
                        </button>
                        <h2 className="text-lg font-bold text-slate-900">{t('dashboard')}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                const nextLang = language === 'en' ? 'ar' : 'en';
                                console.log("[DashboardLayout] Header Language Switcher clicked. Next language:", nextLang);
                                setLanguage(nextLang);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 text-xs font-black text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-white border border-slate-100 rounded-lg transition-all transition-all uppercase tracking-tighter"
                        >
                            <span className="shrink-0">🌐</span>
                            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
                        </button>
                        <Badge variant={user?.plan === 'premium' ? 'premium' : 'free'}>
                            {user?.plan === 'premium' ? t('premiumAccount') : t('standardAccount')}
                        </Badge>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <div className="container mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};
