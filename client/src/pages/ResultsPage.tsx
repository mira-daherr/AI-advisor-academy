import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    Sparkles,
    GraduationCap,
    RefreshCcw,
    Lightbulb,
    Briefcase,
    TrendingUp,
    Heart,
    AlertCircle,
    Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useLanguage } from '../contexts/LanguageContext';
import { Spinner } from '../components/ui/Spinner';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';
import { Check, Lock } from 'lucide-react';

const ResultsPage = () => {
    const navigate = useNavigate();
    const { t, isRTL, language } = useLanguage();
    console.log("[ResultsPage] Rendered with language:", language, "isRTL:", isRTL);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const stored = localStorage.getItem('gemini_results');
                let parsed = stored ? JSON.parse(stored) : null;

                // Check if we have results and if they match the current language
                // If language differs, we need to re-fetch from the server
                if (!parsed || parsed.language !== language) {
                    setResults(null); // Clear old results to show loading
                    console.log(`[ResultsPage] Language mismatch or no data (current: ${language}, stored: ${parsed?.language}). Re-fetching...`);
                    const { getGeminiRecommendation } = await import('../utils/gemini');
                    parsed = await getGeminiRecommendation('server-side', {}, language);
                    console.log("[ResultsPage] New fetched parsed data:", parsed);
                    localStorage.setItem('gemini_results', JSON.stringify(parsed));
                } else {
                    console.log("[ResultsPage] Found valid local cached results for language:", language);
                }

                if (parsed && (parsed.recommendations || parsed.majors || parsed.results)) {
                    setResults(parsed);
                } else {
                    navigate('/questionnaire');
                }
            } catch (err) {
                console.error("Error loading results:", err);
                setError(isRTL ? 'حدث خطأ أثناء تحميل النتائج.' : 'Error loading results.');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [navigate, isRTL, language]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center p-6 text-center space-y-8">
                <Spinner size="lg" />
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide">{t('loadingProfile')}</h2>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">{t('loadingSub')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-8 border border-red-500/20 shadow-2xl shadow-red-500/10">
                    <AlertCircle size={48} />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">{isRTL ? 'عذراً، حدث خطأ' : 'Sorry, something went wrong'}</h2>
                <p className="text-slate-400 mb-10 max-w-md text-lg">{error}</p>
                <Button variant="gold" className="px-10 py-8 text-lg bg-gradient-to-r from-red-600 to-red-500 border-none text-white shadow-xl shadow-red-600/20" onClick={() => navigate('/questionnaire')}>
                    <RefreshCcw size={22} className={isRTL ? 'ml-3' : 'mr-3'} />
                    {t('retry')}
                </Button>
            </div>
        );
    }

    if (!results) return null;

    // Normalize majors (prioritize recommendations as requested)
    const majorsData = results.recommendations || results.majors || results.results || [];

    return (
        <div className={`min-h-screen bg-slate-50 text-slate-900 pb-32 font-cairo ${isRTL ? 'rtl' : 'ltr'} relative overflow-hidden`}>

            {/* Background Decorative Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] -z-10" />

            {/* Header */}
            <section className="pt-32 pb-20 px-6 md:px-12 relative">
                <div className="max-w-6xl mx-auto text-center space-y-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 rotate-12 mx-auto mb-8"
                    >
                        <Trophy size={48} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <h1 className="text-4xl md:text-7xl font-black text-slate-900 leading-tight">
                            {t('resultsTitle')}
                        </h1>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-6xl mx-auto px-6 md:px-12 space-y-16">

                {/* Academic Statement Card (Top Highlight as strictly requested) */}
                {results.academicStatement && (
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Card className="bg-white border-slate-100 p-8 md:p-12 relative overflow-hidden shadow-sm group transition-all">
                            <div className="absolute top-0 right-0 p-8 text-indigo-500/5 rotate-12 group-hover:scale-110 transition-transform duration-500">
                                <GraduationCap size={150} />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
                                    <Sparkles size={40} />
                                </div>
                                <div className="space-y-4 flex-1">
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-3">
                                        {t('academicStatement')}
                                    </h2>
                                    <div className="h-1 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
                                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-light">
                                        {results.academicStatement}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.section>
                )}

                {/* Major Cards Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {majorsData.map((rec: any, i: number) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full bg-white border-slate-100 p-10 hover:border-indigo-500/40 transition-all group overflow-hidden relative shadow-sm hover:shadow-md hover:-translate-y-2 duration-300">
                                {/* Glowing number background */}
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-600/5 rounded-full blur-[40px] group-hover:bg-indigo-600/10 transition-all" />

                                <div className={`flex items-center gap-4 mb-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-indigo-600/10">
                                        {i + 1}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                                        {rec.major || rec.name || rec.title}
                                    </h3>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    <div className="space-y-3">
                                        <p className={`text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <Sparkles size={14} /> {isRTL ? 'لماذا يناسبك' : t('whySuit')}
                                        </p>
                                        <p className={`text-sm md:text-base text-slate-500 leading-relaxed font-light ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {rec.why || rec.reason}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className={`text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <Briefcase size={14} /> {isRTL ? 'المسار الوظيفي' : t('careerPath')}
                                        </p>
                                        <p className={`text-sm md:text-base text-slate-500 leading-relaxed font-light ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {rec.career || rec.path}
                                        </p>
                                    </div>

                                    <div className={`pt-8 border-t border-slate-50 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={isRTL ? 'text-right' : 'text-left'}>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{isRTL ? 'الراتب المتوقع' : t('salaryRange')}</p>
                                            {user?.plan === 'premium' ? (
                                                <p className="text-xl font-black text-emerald-600">{rec.salary || rec.salaryRange}</p>
                                            ) : (
                                                <button
                                                    onClick={() => setIsPricingModalOpen(true)}
                                                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors group/salary"
                                                >
                                                    <Lock size={14} className="group-hover/salary:scale-110 transition-transform" />
                                                    <span className="text-sm font-bold uppercase tracking-tighter">{isRTL ? 'للمشتركين فقط' : 'Premium Only'}</span>
                                                </button>
                                            )}
                                        </div>
                                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
                                            <TrendingUp size={24} />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </section>

                {/* Advice Section */}
                <section>
                    <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 border-none p-12 md:p-20 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-12 text-white/5 rotate-45 scale-150">
                            <Lightbulb size={300} />
                        </div>
                        <div className="relative z-10 flex flex-col items-center text-center space-y-10 max-w-4xl mx-auto">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 shadow-lg"
                            >
                                <Heart size={48} className="fill-white" />
                            </motion.div>
                            <div className="space-y-8">
                                <h2 className="text-3xl md:text-6xl font-black text-white px-2">
                                    {t('personalAdvice')}
                                </h2>
                                <p className="text-xl md:text-3xl text-indigo-50 leading-relaxed italic font-light opacity-90">
                                    "{results.personalAdvice || results.advice}"
                                </p>
                            </div>
                        </div>
                    </Card>
                </section>



            </div>

            {/* Pricing Modal */}
            <Modal
                isOpen={isPricingModalOpen}
                onClose={() => setIsPricingModalOpen(false)}
                title={isRTL ? 'الترقية للحساب الذهبي' : 'Upgrade to Gold Account'}
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
                                    <span className="text-sm text-slate-400 line-through font-bold">{t('originalPrice')} {isRTL ? 'ريال' : 'SAR'}</span>
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
                            {isRTL ? 'اشتراك شهري • وصول غير محدود • تحديثات مستمرة' : 'Monthly subscription • Unlimited access • Regular updates'}
                        </p>
                    </Card>
                </div>
            </Modal>
        </div>
    );
};

export default ResultsPage;
