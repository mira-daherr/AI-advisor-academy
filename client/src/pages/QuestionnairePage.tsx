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
        <div className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center p-6 md:p-12 font-cairo ${isRTL ? 'rtl' : 'ltr'}`}>
            <div className="w-full max-w-3xl space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center text-slate-900">
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                        <X size={20} />
                        <span className="font-bold">{t('exit')}</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-indigo-600 font-bold">{t('group')} {categoryIndex + 1}:</span>
                        <span className="text-slate-600 font-medium">{t(`category${categoryIndex + 1}`)}</span>
                    </div>
                    <div className="text-slate-500 font-bold">{qIndex + 1} / 60</div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-2">
                    <div className={`flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span>{t('totalProgress')}</span>
                        <span>{Math.round(overallProgress)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-100">
                        <motion.div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${overallProgress}%` }}
                        />
                    </div>

                    <div className={`flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span>{t('groupProgress')}</span>
                        <span>{Math.round(categoryProgress)}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-100">
                        <motion.div
                            className="h-full bg-indigo-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${categoryProgress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={qIndex}
                        initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                    >
                        <Card className="p-8 md:p-12 bg-white border-slate-100 shadow-xl shadow-indigo-900/5">
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 leading-tight">
                                {t(currentQuestionKey)}
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {getOptions().map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(opt)}
                                        className={`w-full p-5 rounded-2xl font-bold border-2 transition-all flex items-center justify-between group ${isRTL ? 'text-right flex-row-reverse' : 'text-left flex-row'} ${answers[qIndex + 1] === opt
                                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                                            : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-400 hover:text-indigo-600'
                                            }`}
                                    >
                                        <span>{opt}</span>
                                        {answers[qIndex + 1] === opt && <CheckCircle2 size={20} className="text-indigo-600" />}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4 mt-10">
                                <Button variant="ghost" onClick={handlePrev} disabled={qIndex === 0} className="px-8 text-slate-400">
                                    {t('back')}
                                </Button>
                                {qIndex === totalQuestions - 1 ? (
                                    <Button
                                        variant="gold"
                                        className="px-10 bg-indigo-600 text-white"
                                        onClick={handleSubmit}
                                        disabled={!answers[qIndex + 1]}
                                    >
                                        {t('calculate')}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        className="px-10 bg-indigo-600"
                                        onClick={() => setQIndex(qIndex + 1)}
                                        disabled={!answers[qIndex + 1]}
                                    >
                                        {t('next')}
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
