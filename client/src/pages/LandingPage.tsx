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
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold tracking-wider mb-6 uppercase border border-indigo-500/20">
                        {t('appTitle')}
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-8 leading-[1.1]">
                        {t('discoverTitle')} <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400">{t('idealMajor')}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        {t('welcomeSubtitle')}
                    </p>

                    <div className="max-w-md mx-auto mb-10">
                        <Button variant="gold" size="lg" className="w-full flex items-center justify-center gap-2 group py-8 text-xl" onClick={handleStart}>
                            {t('startBtn')} <ChevronRight size={20} className={`transform transition-transform ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
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
        { icon: <GraduationCap size={24} />, title: t('feat1Title'), desc: t('feat1Desc') },
        { icon: <Compass size={24} />, title: t('feat2Title'), desc: t('feat2Desc') },
        { icon: <BarChart3 size={24} />, title: t('feat3Title'), desc: t('feat3Desc') },
        { icon: <Sparkles size={24} />, title: t('feat4Title'), desc: t('feat4Desc') },
        { icon: <Search size={24} />, title: t('feat5Title'), desc: t('feat5Desc') }
    ];

    return (
        <section id="features" className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{t('featuresTitle')}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <Card key={i} className="p-8 bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 group">
                            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-sm">{f.desc}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Pricing = () => {
    const { t, isRTL } = useLanguage();
    return (
        <section id="pricing" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">{t('pricingTitle')}</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t('pricingSubtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <Card className="p-10 bg-white border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('freePlan')}</h3>
                            <div className={`flex items-baseline gap-1 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-4xl font-black text-slate-900">{t('freePrice')}</span>
                                <span className="text-slate-500 font-medium">{t('freePeriod')}</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-10">
                            {[t('freeFeature1'), t('freeFeature2'), t('freeFeature3')].map((feature, i) => (
                                <li key={i} className={`flex items-center gap-3 text-slate-600 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                    {isRTL ? (
                                        <>
                                            <span>{feature}</span>
                                            <CheckCircle2 className="text-emerald-500" size={18} />
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="text-emerald-500" size={18} />
                                            <span>{feature}</span>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <Button variant="outline" className="w-full py-6 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold">{t('startFree')}</Button>
                    </Card>

                    {/* Premium Plan */}
                    <Card className="p-10 bg-white border-indigo-100 shadow-xl shadow-indigo-500/5 relative overflow-hidden group border-2">
                        <div className="absolute top-0 right-0">
                            <div className={`bg-indigo-600 text-white text-[10px] font-bold px-8 py-1 rotate-45 translate-x-3 translate-y-3`}>
                                {t('mostPopular')}
                            </div>
                        </div>
                        <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{t('premiumPlan')}</h3>
                            <div className={`flex items-baseline gap-1 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                <span className="text-4xl font-black text-indigo-600">{t('premiumPrice')}</span>
                                <span className="text-slate-500 font-medium">{t('premiumPeriod')}</span>
                            </div>
                        </div>
                        <ul className="space-y-4 mb-10">
                            {[t('premiumFeature1'), t('premiumFeature2'), t('premiumFeature3'), t('premiumFeature4')].map((feature, i) => (
                                <li key={i} className={`flex items-center gap-3 text-slate-600 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                    {isRTL ? (
                                        <>
                                            <span className={i === 0 ? 'font-bold' : ''}>{feature}</span>
                                            <CheckCircle2 className="text-indigo-500" size={18} />
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="text-indigo-500" size={18} />
                                            <span className={i === 0 ? 'font-bold' : ''}>{feature}</span>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <Button variant="gold" className="w-full py-6 bg-indigo-600 text-white hover:bg-indigo-700 border-none shadow-lg shadow-indigo-200 font-bold">{t('subscribeNow')}</Button>
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
