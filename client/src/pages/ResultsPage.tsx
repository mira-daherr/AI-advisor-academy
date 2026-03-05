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
    AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useLanguage } from '../contexts/LanguageContext';
import { Spinner } from '../components/ui/Spinner';

const ResultsPage = () => {
    const navigate = useNavigate();
    const { t, isRTL } = useLanguage();
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('gemini_results');
            if (stored) {
                const parsed = JSON.parse(stored);
                console.log('--- RESULTS PAGE DATA DEBUG ---');
                console.log('Stored Data:', parsed);
                console.log('-------------------------------');

                // Validation - ensure the structure is what we expect
                if (parsed && (parsed.recommendations || parsed.majors || parsed.results)) {
                    setResults(parsed);
                } else {
                    console.error("Invalid results format:", parsed);
                    setError(isRTL ? 'بيانات التوصية غير صالحة. يرجى إعادة المحاولة.' : 'Invalid recommendation data. Please try again.');
                }
            } else {
                // No results, go back
                navigate('/questionnaire');
            }
        } catch (err) {
            console.error("Error loading results:", err);
            setError(isRTL ? 'حدث خطأ أثناء تحميل النتائج.' : 'Error loading results.');
        } finally {
            setLoading(false);
        }
    }, [navigate, isRTL]);

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
        <div className={`min-h-screen bg-[#050510] text-slate-100 pb-32 font-cairo ${isRTL ? 'rtl' : 'ltr'} relative overflow-hidden`}>

            {/* Background Decorative Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />

            {/* Header */}
            <section className="pt-32 pb-20 px-6 md:px-12 relative">
                <div className="max-w-6xl mx-auto text-center space-y-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 rotate-12 mx-auto mb-8"
                    >
                        <Trophy size={48} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <h1 className="text-4xl md:text-7xl font-black text-white leading-tight">
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
                        <Card className="bg-gradient-to-br from-[#0c0c1e] to-[#161632] border-indigo-500/30 p-8 md:p-12 relative overflow-hidden shadow-2xl group transition-all">
                            <div className="absolute top-0 right-0 p-8 text-indigo-500/5 rotate-12 group-hover:scale-110 transition-transform duration-500">
                                <GraduationCap size={150} />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="w-20 h-20 bg-indigo-600/20 text-indigo-400 rounded-3xl flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-xl shadow-indigo-500/10">
                                    <Sparkles size={40} />
                                </div>
                                <div className="space-y-4 flex-1">
                                    <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                                        {t('academicStatement')}
                                    </h2>
                                    <div className="h-1 w-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
                                    <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light">
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
                            <Card className="h-full bg-[#0c0c1e] border-white/5 p-10 hover:border-indigo-500/40 transition-all group overflow-hidden relative shadow-xl hover:-translate-y-2 duration-300">
                                {/* Glowing number background */}
                                <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-600/5 rounded-full blur-[40px] group-hover:bg-indigo-600/15 transition-all" />

                                <div className={`flex items-center gap-4 mb-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl shadow-indigo-600/20">
                                        {i + 1}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">
                                        {rec.major || rec.name || rec.title}
                                    </h3>
                                </div>

                                <div className="space-y-8 relative z-10">
                                    <div className="space-y-3">
                                        <p className={`text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <Sparkles size={14} /> {isRTL ? 'لماذا يناسبك' : t('whySuit')}
                                        </p>
                                        <p className={`text-sm md:text-base text-slate-400 leading-relaxed font-light ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {rec.why || rec.reason}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <p className={`text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <Briefcase size={14} /> {isRTL ? 'المسار الوظيفي' : t('careerPath')}
                                        </p>
                                        <p className={`text-sm md:text-base text-slate-400 leading-relaxed font-light ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {rec.career || rec.path}
                                        </p>
                                    </div>

                                    <div className={`pt-8 border-t border-white/5 flex justify-between items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={isRTL ? 'text-right' : 'text-left'}>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{isRTL ? 'الراتب المتوقع' : t('salaryRange')}</p>
                                            <p className="text-xl font-black text-emerald-400">{rec.salary || rec.salaryRange}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/20">
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
                    <Card className="bg-gradient-to-br from-indigo-700 to-purple-800 border-white/10 p-12 md:p-20 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
                        <div className="absolute top-0 right-0 p-12 text-white/5 rotate-45 scale-150">
                            <Lightbulb size={300} />
                        </div>
                        <div className="relative z-10 flex flex-col items-center text-center space-y-10 max-w-4xl mx-auto">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 shadow-2xl shadow-white/5"
                            >
                                <Heart size={48} className="fill-white" />
                            </motion.div>
                            <div className="space-y-8">
                                <h2 className="text-3xl md:text-6xl font-black text-white px-2">
                                    {t('personalAdvice')}
                                </h2>
                                <p className="text-xl md:text-3xl text-indigo-100 leading-relaxed italic font-light opacity-90">
                                    "{results.personalAdvice || results.advice}"
                                </p>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Motivational Message & Footer Info (At the bottom now) */}
                <section className="text-center p-16 md:p-24 relative space-y-12">
                    {results.motivationalMessage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="bg-indigo-600/5 p-10 rounded-[3rem] border border-indigo-600/10"
                        >
                            <p className="text-2xl md:text-3xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light italic">
                                "{results.motivationalMessage}"
                            </p>
                        </motion.div>
                    )}

                    <div className="max-w-2xl mx-auto space-y-8">
                        <GraduationCap className="mx-auto text-indigo-400 opacity-40 mb-4" size={64} />
                        <p className="text-slate-500 text-lg leading-relaxed font-light">
                            {t('resultsFooter')}
                        </p>
                        <div className="pt-6">
                            <Button
                                variant="outline"
                                className="border-slate-800 text-slate-400 hover:text-white"
                                onClick={() => navigate('/questionnaire')}
                            >
                                <RefreshCcw size={18} className={isRTL ? 'ml-2' : 'mr-2'} />
                                {t('retry')}
                            </Button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default ResultsPage;
