import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Sparkles,
    CheckCircle2,
    X
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useLanguage } from '../contexts/LanguageContext';
import { getGeminiRecommendation } from '../utils/gemini';

const QuestionnairePage = () => {
    const navigate = useNavigate();
    const { t, isRTL, language } = useLanguage();
    const [qIndex, setQIndex] = useState(0); // 0 to 59
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);

    const totalQuestions = 60;
    const questionsPerCategory = 10;
    const categoryIndex = Math.floor(qIndex / questionsPerCategory);
    const categoryProgress = ((qIndex % questionsPerCategory) + 1) / questionsPerCategory * 100;
    const overallProgress = ((qIndex + 1) / totalQuestions) * 100;

    const currentQuestionKey = `q${qIndex + 1}`;

    // Determine options for current question
    const getOptions = () => {
        const opts = [];
        for (let i = 1; i <= 5; i++) {
            const opt = t(`${currentQuestionKey}_opt${i}`);
            if (opt && opt !== `${currentQuestionKey}_opt${i}`) {
                opts.push(opt);
            }
        }
        return opts;
    };

    const handleAnswer = (answer: string) => {
        setAnswers(prev => ({ ...prev, [qIndex + 1]: answer }));
        if (qIndex < totalQuestions - 1) {
            setTimeout(() => setQIndex(qIndex + 1), 200);
        }
    };

    const handlePrev = () => {
        if (qIndex > 0) setQIndex(qIndex - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // apiKey is null because it's handled on the server side now
            const result = await getGeminiRecommendation('server-side', answers, language);
            localStorage.setItem('gemini_results', JSON.stringify(result));
            setComplete(true);
            setTimeout(() => navigate('/results'), 2000);
        } catch (error) {
            alert(isRTL ? 'فشل في الحصول على التوصيات. يرجى المحاولة لاحقاً.' : 'Failed to get recommendations. Please try again later.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <div className="flex flex-col items-center justify-center space-y-4 py-20">
                        <Spinner size="lg" />
                        <h2 className="text-3xl font-bold text-slate-900">{t('loadingProfile')}</h2>
                        <p className="text-slate-600">{t('loadingSub')}</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-[#FDFDFF] text-slate-900 flex flex-col items-center p-6 md:p-12 font-cairo ${isRTL ? 'rtl' : 'ltr'} relative overflow-hidden`}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50/50 rounded-full blur-[120px] -z-10" />

            <div className="w-full max-w-4xl space-y-12">
                {/* Header */}
                <div className="flex justify-between items-center text-slate-900 bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white shadow-sm">
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-2 text-slate-400 hover:text-red-500 transition-all font-bold px-4 py-2 rounded-xl hover:bg-red-50 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                        <X size={20} />
                        <span>{t('exit')}</span>
                    </button>

                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                            <span className="text-indigo-600 font-black tracking-widest uppercase text-[10px]">{t('group')} {categoryIndex + 1}</span>
                        </div>
                        <span className="text-slate-900 font-black text-lg">{t(`category${categoryIndex + 1}`)}</span>
                    </div>

                    <div className="bg-indigo-600 text-white px-5 py-2 rounded-2xl font-black shadow-lg shadow-indigo-600/20">
                        {qIndex + 1} / {totalQuestions}
                    </div>
                </div>

                {/* Progress Tracking */}
                <Card className="p-8 bg-white/80 backdrop-blur-md border border-white shadow-xl shadow-indigo-900/5 rounded-[2.5rem]">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className={`flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-indigo-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span>{t('totalProgress')}</span>
                                <span>{Math.round(overallProgress)}%</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_100%] rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${overallProgress}%`,
                                        backgroundPosition: ['0% 0%', '100% 0%']
                                    }}
                                    transition={{
                                        width: { duration: 0.5 },
                                        backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i < (qIndex % 10) + 1 ? 'bg-indigo-600 shadow-sm' : 'bg-slate-100'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Question Section */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={qIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full"
                    >
                        <Card className="p-10 md:p-16 bg-white border-none shadow-2xl shadow-indigo-900/5 rounded-[3rem]">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-3xl md:text-5xl font-black text-slate-900 mb-12 leading-[1.1] tracking-tight text-center md:text-right"
                            >
                                {t(currentQuestionKey)}
                            </motion.h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {getOptions().map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(opt)}
                                        className={`group relative overflow-hidden w-full p-8 rounded-[2rem] font-black text-xl transition-all duration-300 border-[3px] flex items-center gap-4 ${answers[qIndex + 1] === opt
                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-600/30 -translate-y-1'
                                            : 'bg-white border-slate-50 text-slate-500 hover:border-indigo-100 hover:bg-slate-50 hover:text-indigo-600'
                                            } ${isRTL ? 'text-right flex-row-reverse' : 'text-left flex-row'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black text-lg tracking-tighter ${answers[qIndex + 1] === opt ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-indigo-100'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="flex-1">{opt}</span>
                                        {answers[qIndex + 1] === opt && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white/20 p-2 rounded-full">
                                                <CheckCircle2 size={24} />
                                            </motion.div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mt-16 pt-10 border-t border-slate-50">
                                <Button
                                    variant="ghost"
                                    onClick={handlePrev}
                                    disabled={qIndex === 0}
                                    className="flex-1 py-8 text-lg font-black text-slate-400 hover:text-indigo-600 transition-all rounded-2xl"
                                >
                                    <ChevronLeft className={isRTL ? 'rotate-180 ml-2' : 'mr-2'} /> {t('back')}
                                </Button>
                                {qIndex === totalQuestions - 1 ? (
                                    <Button
                                        variant="gold"
                                        className="flex-[2] py-8 text-2xl font-black bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-2xl shadow-indigo-600/20 rounded-2xl group"
                                        onClick={handleSubmit}
                                        disabled={!answers[qIndex + 1]}
                                    >
                                        {t('calculate')}
                                        <Sparkles className={`inline relative -top-1 ${isRTL ? 'mr-3' : 'ml-3'} group-hover:rotate-12 transition-transform`} />
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        className="flex-[2] py-8 text-2xl font-black bg-indigo-600 text-white shadow-2xl shadow-indigo-600/10 rounded-2xl group"
                                        onClick={() => setQIndex(qIndex + 1)}
                                        disabled={!answers[qIndex + 1]}
                                    >
                                        {t('next')}
                                        <ChevronRight className={`inline ${isRTL ? 'rotate-180 mr-3' : 'ml-3'} group-hover:translate-x-1 transition-transform`} />
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default QuestionnairePage;
