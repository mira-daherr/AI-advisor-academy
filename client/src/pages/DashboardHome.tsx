import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    ChevronRight,
    GraduationCap,
    MessageSquare,
    FileText,
    RefreshCcw,
    Clock,
    Download,
    Lock,
    ChevronLeft,
    Brain,
    Users,
    Activity,
    Book,
    Check
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

const DashboardHome = () => {
    const { user } = useAuth();
    const { t, isRTL, language } = useLanguage();
    console.log("[DashboardHome] Rendered with language:", language, "isRTL:", isRTL);
    console.log("[DashboardHome] translations.en.academicIdentity:", (translations as any).en?.academicIdentity);
    console.log("[DashboardHome] translations.ar.academicIdentity:", (translations as any).ar?.academicIdentity);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState<any>(null);
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                // Trigger generate with current language to ensure we have the right version
                // The server route handles the logic: if language matches, it returns cached. If not, it generates new.
                const recRes = await axios.post(`${API_URL}/recommendations/generate`,
                    { language },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true
                    }
                ).catch(() => ({ data: null }));

                const fetchedData = {
                    recommendations: recRes.data
                };

                setStudentData(fetchedData);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [language]);

    if (loading || !studentData) return (
        <div className="flex flex-col h-64 items-center justify-center gap-4">
            <Spinner />
            <div className="text-indigo-600 font-bold">{t('loading')}</div>
        </div>
    );

    // Helper to get recommendations array
    const getRecs = () => {
        const recData = studentData?.recommendations;
        if (!recData) return [];
        return recData.recommendations || recData.majors || recData.universities || [];
    };

    const recommendationsList = getRecs();

    return (
        <div className={`space-y-8 pb-12 ${isRTL ? 'rtl font-cairo' : 'ltr font-poppins'}`}>
            {/* 1. Welcome Card & Stats Overview */}
            <div className="flex flex-col gap-6">
                <Card className="p-10 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white overflow-hidden relative border-none shadow-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}
                    >
                        <div className={`space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className="space-y-1">
                                <p className="text-indigo-200 font-medium tracking-wider uppercase text-xs">{t('welcomeBackMsg')}</p>
                                <h1 className="text-4xl font-black">{user?.name}! 👋</h1>
                            </div>
                            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                <Badge variant={user?.plan === 'premium' ? 'premium' : 'free'} className="px-3 py-1 text-xs">
                                    {isRTL ? (user?.plan === 'premium' ? 'العضوية الذهبية' : 'العضوية المجانية') : (user?.plan === 'premium' ? 'Gold Membership' : 'Free Account')}
                                </Badge>
                                <div className={`flex items-center gap-1.5 text-indigo-100/80 text-sm ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <Clock size={14} />
                                    <span>{isRTL ? `آخر نشاط: اليوم` : `Last active: Today`}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="gold"
                                size="lg"
                                onClick={() => {
                                    if (user?.plan === 'premium') {
                                        navigate('/questionnaire');
                                    } else {
                                        setIsPricingModalOpen(true);
                                    }
                                }}
                                className={`bg-white text-indigo-700 hover:bg-indigo-50 border-none shadow-lg px-8 font-bold ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                                <span className="flex items-center gap-2">
                                    <RefreshCcw size={18} />
                                    {t('retry')}
                                    {user?.plan !== 'premium' && <Lock size={16} className="opacity-70" />}
                                </span>
                            </Button>
                        </div>
                    </motion.div>

                    {/* Abstract Decorations */}
                    <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} p-8 text-white/5 rotate-12 scale-[5]`}>
                        <Brain size={100} />
                    </div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute top-0 right-1/4 w-20 h-20 bg-indigo-400/20 rounded-full blur-2xl" />
                </Card>


            </div>

            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                <div className={`lg:col-span-2 space-y-8`}>

                    {/* 2. Academic Identity Card */}
                    <Card className="p-8 space-y-4 bg-white border-slate-100 shadow-sm">
                        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h3 className={`text-lg font-bold text-slate-900 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Sparkles size={20} className="text-indigo-600" /> {t('academicIdentity')}
                            </h3>
                            <button onClick={() => navigate('/questionnaire')} className="text-sm text-indigo-600 hover:underline font-bold">{t('edit')}</button>
                        </div>
                        <p className={`text-slate-600 leading-relaxed italic ${isRTL ? 'border-r-4 text-right pr-4' : 'border-l-4 text-left pl-4'} border-indigo-100 py-2`}>
                            "{studentData?.recommendations?.academicStatement || t('completeQuizMsg')}"
                        </p>
                    </Card>

                    {/* 3. Top Matches Preview */}
                    <div className="space-y-4">
                        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                            <h3 className="text-xl font-bold text-slate-900">{t('topMatches')}</h3>
                            <button onClick={() => navigate('/dashboard/results')} className={`text-sm text-indigo-600 font-bold flex items-center gap-1 hover:gap-2 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {t('viewAll')} {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recommendationsList.length > 0 ? (
                                recommendationsList.slice(0, 2).map((item: any, i: number) => (
                                    <Card key={i} className="p-6 hover:shadow-lg transition-all border-slate-100 bg-white">
                                        <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                                            <h4 className="font-bold text-slate-900">{item.major || item.name}</h4>
                                            <Badge variant="outline">{item.career || item.country || t('major')}</Badge>
                                        </div>
                                        <p className={`text-xs text-slate-500 line-clamp-2 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{item.why || item.reason || t('majorSuitMsg')}</p>
                                        <Button variant="ghost" size="sm" className={`p-0 text-indigo-600 font-bold ${isRTL ? 'ml-auto' : 'mr-auto'}`} onClick={() => navigate('/dashboard/results')}>{t('details')}</Button>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm text-center col-span-2 py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                                    {t('noRecommendations')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* 4. Quick Actions */}
                    <Card className={`p-8 space-y-6 bg-white border-slate-100 shadow-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        <h3 className="text-lg font-bold text-slate-900">{t('quickActions')}</h3>
                        <div className="flex flex-col gap-3">
                            <Button variant="primary" className={`w-full justify-between ${isRTL ? 'flex-row-reverse' : ''}`} onClick={() => navigate('/dashboard/results')}>
                                <span>{t('continueResults')}</span>
                                {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                            </Button>
                            <Button
                                variant="gold"
                                className={`w-full justify-between text-white ${isRTL ? 'flex-row-reverse font-cairo' : 'font-poppins'}`}
                                onClick={() => {
                                    if (user?.plan === 'premium') {
                                        navigate('/dashboard/chat');
                                    } else {
                                        setIsPricingModalOpen(true);
                                    }
                                }}
                                style={{ background: 'linear-gradient(to right, #4F46E5, #8B5CF6)' }}
                            >
                                <span className="flex items-center gap-2">
                                    {t('advisorChat')} {user?.plan !== 'premium' && <Lock size={16} />}
                                </span>
                                {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                            </Button>
                            <Button
                                variant="outline"
                                className={`w-full justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                                onClick={() => {
                                    if (user?.plan === 'premium') {
                                        // Logic for download
                                    } else {
                                        setIsPricingModalOpen(true);
                                    }
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    {t('downloadPDF')} {user?.plan !== 'premium' && <Lock size={16} />}
                                </span>
                                <Download size={18} />
                            </Button>
                            {user?.plan === 'free' && (
                                <Button
                                    variant="gold"
                                    onClick={() => setIsPricingModalOpen(true)}
                                    className={`w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-indigo-100 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                                >
                                    <Lock size={16} />
                                    {t('upgradePremiumBtn')}
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Pricing Modal */}
            <Modal
                isOpen={isPricingModalOpen}
                onClose={() => setIsPricingModalOpen(false)}
                title={t('upgradeGoldTitle')}
            >
                <div className="max-w-md mx-auto">
                    <Card
                        className={`p-8 border-2 border-indigo-600 transition-all relative overflow-hidden flex flex-col h-full bg-white shadow-2xl scale-105`}
                    >
                        {/* Ribbon */}
                        <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'}`}>
                            <div className={`bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-1 font-black text-[10px] uppercase tracking-tighter shadow-lg rotate-45 translate-x-[30%] -translate-y-[10%] ${isRTL ? '-rotate-45 -translate-x-[30%]' : ''}`}>
                                {t('mostPopular')}
                            </div>
                        </div>

                        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <h4 className="text-2xl font-black text-slate-800 mb-2">{t('premiumPlan')}</h4>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-400 line-through font-bold">{t('originalPrice')} {t('currency')}</span>
                                    <Badge variant="premium" className="text-[10px] px-2 py-0.5">{t('discountTag')}</Badge>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-indigo-600">{t('premiumPrice')}</span>
                                    <span className="text-sm text-indigo-400 font-bold">{t('premiumPeriod')}</span>
                                </div>
                            </div>
                        </div>

                        <ul className="space-y-4 mb-10">
                            {[t('premiumFeature1'), t('premiumFeature2'), t('premiumFeature3'), t('premiumFeature4')].map((feature, idx) => (
                                <li key={idx} className={`flex items-start gap-3 text-slate-600 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                                    <div className={`mt-1 shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-600 shadow-sm border border-indigo-200`}>
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                    <span className="font-medium text-sm leading-relaxed">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Button
                            variant="gold"
                            className="w-full font-black h-14 rounded-2xl transition-all shadow-xl shadow-indigo-100 text-lg"
                        >
                            {t('subscribeNow')}
                        </Button>

                        <p className="text-center text-[10px] text-slate-400 mt-6 font-medium">
                            {t('premiumFooterDesc')}
                        </p>
                    </Card>
                </div>
            </Modal>
        </div>
    );
};

export default DashboardHome;
