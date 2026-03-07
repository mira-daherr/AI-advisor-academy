import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    BookOpen,
    Sparkles,
    Compass,
    GraduationCap,
    BarChart3,
    Search,
    CheckCircle2,
    X,
    Key
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useLanguage } from '../contexts/LanguageContext';

const Hero = () => {
    const { t, isRTL } = useLanguage();
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/questionnaire');
    };

    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-white">
            {/* Animated Background */}
            <div className="absolute inset-0 -z-10">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                        x: [0, 50, 0],
                        y: [0, -30, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-10 right-10 w-96 h-96 bg-indigo-100 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.05, 0.15, 0.05],
                        x: [0, -40, 0],
                        y: [0, 40, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-10 left-10 w-80 h-80 bg-blue-50 rounded-full blur-[100px]"
                />
            </div>

            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block py-2 px-6 rounded-full bg-indigo-600/5 text-indigo-600 text-xs font-black tracking-[0.2em] mb-10 uppercase border border-indigo-600/10 backdrop-blur-sm shadow-sm"
                    >
                        {t('appTitle')} • {t('smartAdvisor')}
                    </motion.span>
                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-[0.95] tracking-tighter">
                        {t('discoverTitle')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-400">
                            {t('idealMajor')}
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
                        {t('welcomeSubtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            variant="gold"
                            size="lg"
                            className="w-full sm:w-auto px-12 py-8 text-xl font-black bg-gradient-to-r from-indigo-600 to-indigo-700 hover:scale-105 transition-transform shadow-xl shadow-indigo-600/20 text-white rounded-2xl group"
                            onClick={handleStart}
                        >
                            {t('startBtn')}
                            <ChevronRight size={24} className={`transform transition-transform ${isRTL ? 'group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`} />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto px-12 py-8 text-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl"
                            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            {t('howItWorks')}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

const HowItWorks = () => {
    const { t } = useLanguage();
    const steps = [
        {
            icon: <BookOpen className="text-indigo-400" size={32} />,
            title: t('step1Title'),
            desc: t('step1Desc')
        },
        {
            icon: <Sparkles className="text-gold" size={32} />,
            title: t('step2Title'),
            desc: t('step2Desc')
        },
        {
            icon: <Compass className="text-purple-400" size={32} />,
            title: t('step3Title'),
            desc: t('step3Desc')
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{t('howItWorksTitle')}</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto px-4">{t('howItWorksSubtitle')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="relative text-center group"
                        >
                            <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl shadow-lg flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Features = () => {
    const { t } = useLanguage();
    const features = [
        { icon: <GraduationCap size={28} />, title: t('feat1Title'), desc: t('feat1Desc'), color: 'bg-indigo-50 text-indigo-600' },
        { icon: <Compass size={28} />, title: t('feat2Title'), desc: t('feat2Desc'), color: 'bg-purple-50 text-purple-600' },
        { icon: <BarChart3 size={28} />, title: t('feat3Title'), desc: t('feat3Desc'), color: 'bg-emerald-50 text-emerald-600' },
        { icon: <Sparkles size={28} />, title: t('feat4Title'), desc: t('feat4Desc'), color: 'bg-amber-50 text-amber-600' },
        { icon: <Search size={28} />, title: t('feat5Title'), desc: t('feat5Desc'), color: 'bg-rose-50 text-rose-600' },
        { icon: <Key size={28} />, title: t('premiumFeature2'), desc: t('premiumFeature2'), color: 'bg-blue-50 text-blue-600' }
    ];

    return (
        <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="mb-20 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{t('featuresTitle')}</h2>
                    <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-10 bg-white border-none shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group rounded-[2rem]">
                                <div className={`w-16 h-16 ${f.color} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4">{f.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Pricing = () => {
    const { t, isRTL } = useLanguage();
    return (
        <section id="pricing" className="py-32 bg-white">
            <div className="container mx-auto px-6">
                <div className="mb-20 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">{t('pricingTitle')}</h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">{t('pricingSubtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <Card className="p-12 bg-slate-50 border-none shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-500 rounded-[2.5rem]">
                        <div className={`mb-10 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">{t('freePlan')}</h3>
                            <div className={`flex items-baseline gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-5xl font-black text-slate-900 tracking-tighter">{t('freePrice')}</span>
                                <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">{t('freePeriod')}</span>
                            </div>
                        </div>
                        <ul className="space-y-5 mb-12">
                            {[t('freeFeature1'), t('freeFeature2'), t('freeFeature3')].map((feature, i) => (
                                <li key={i} className={`flex items-center gap-4 text-slate-600 font-medium ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                    {isRTL ? (
                                        <>
                                            <span>{feature}</span>
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <CheckCircle2 className="text-emerald-600" size={14} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <CheckCircle2 className="text-emerald-600" size={14} />
                                            </div>
                                            <span>{feature}</span>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <Button variant="outline" className="w-full py-8 border-slate-200 text-slate-600 hover:bg-white hover:shadow-lg font-black text-lg rounded-2xl">{t('startFree')}</Button>
                    </Card>

                    {/* Premium Plan */}
                    <Card className="p-12 bg-white border-[3px] border-indigo-600 shadow-2xl shadow-indigo-600/10 relative overflow-hidden group rounded-[2.5rem]">
                        <div className="absolute top-0 right-0">
                            <div className={`bg-indigo-600 text-white text-[10px] font-black px-12 py-1.5 rotate-45 translate-x-5 translate-y-5 shadow-lg tracking-widest uppercase`}>
                                {t('mostPopular')}
                            </div>
                        </div>
                        <div className={`mb-10 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'} mb-10`}>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">{t('premiumPlan')}</h3>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-slate-400 font-bold line-through text-lg">{t('originalPrice')} {isRTL ? 'ريال' : 'SAR'}</span>
                                    <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-full animate-bounce">
                                        {t('discountTag')}
                                    </span>
                                </div>
                                <div className={`flex items-baseline gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                    <span className="text-5xl font-black text-indigo-600 tracking-tighter">{t('premiumPrice')}</span>
                                    <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">{t('premiumPeriod')}</span>
                                </div>
                            </div>
                        </div>
                        <ul className="space-y-5 mb-12">
                            {[t('premiumFeature1'), t('premiumFeature2'), t('premiumFeature3'), t('premiumFeature4')].map((feature, i) => (
                                <li key={i} className={`flex items-center gap-4 text-slate-700 font-bold ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                    {isRTL ? (
                                        <>
                                            <span>{feature}</span>
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm">
                                                <CheckCircle2 className="text-indigo-600" size={14} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm">
                                                <CheckCircle2 className="text-indigo-600" size={14} />
                                            </div>
                                            <span>{feature}</span>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <Button variant="gold" className="w-full py-8 bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] transition-all border-none shadow-xl shadow-indigo-600/30 font-black text-xl rounded-2xl">{t('subscribeNow')}</Button>
                    </Card>
                </div>
            </div>
        </section>
    );
};

export const LandingPage = () => {
    return (
        <>
            <Hero />
            <HowItWorks />
            <Features />
            <Pricing />
        </>
    );
};

export default LandingPage;
