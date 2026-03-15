import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Bot,
    User,
    Sparkles,
    RefreshCcw,
    Lock,
    GraduationCap,
    MessageCircle,
    ArrowRight,
    CheckCircle2,
    Check
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { useLanguage } from '../contexts/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const SuggestedPrompt = ({ text, onClick }: { text: string; onClick: () => void }) => (
    <button
        onClick={onClick}
        className="bg-white border border-soft-gray px-4 py-2 rounded-xl text-sm font-semibold text-navy hover:border-gold hover:text-gold transition-all text-left"
    >
        {text}
    </button>
);

const ChatPage = () => {
    const { user } = useAuth();
    const { t, isRTL, language } = useLanguage();
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    console.log("[ChatPage] Rendered with language:", language, "isRTL:", isRTL);

    const isPremium = user?.plan === 'premium';

    const fetchHistory = async () => {
        if (!isPremium) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/chat/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [isPremium]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async (text: string = input) => {
        if (!text.trim() || loading) return;

        const userMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${API_URL}/chat/message`,
                { content: text, language },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(res.data);
        } catch (err) {
            console.error('Chat failed', err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewChat = async () => {
        const confirmMsg = isRTL
            ? 'هل تريد بدء محادثة جديدة؟ سيتم مسح التاريخ الحالي.'
            : 'Do you want to start a new chat? The current history will be cleared.';
        if (window.confirm(confirmMsg)) {
            try {
                const token = localStorage.getItem('token');
                await axios.post(`${API_URL}/chat/clear`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages([]);
            } catch (err) {
                console.error('Clear failed', err);
            }
        }
    };

    const starterPrompts = isRTL ? [
        "ما هي أفضل جامعة يجب أن أقدم عليها؟",
        "ما هو المعدل المطلوب لتخصص علوم الحاسب؟",
        "ساعدني في كتابة مقدمة خطاب الغرض من الدراسة",
        "ما هي المنح الدراسية المتاحة لي؟"
    ] : [
        "What is the best university I should apply to?",
        "What is the required GPA for Computer Science?",
        "Help me write an introduction for my statement of purpose",
        "What scholarships are available for me?"
    ];

    if (!isPremium) {
        return (
            <div className={`h-full flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto space-y-12 font-cairo ${isRTL ? 'rtl' : 'ltr'}`}>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-32 h-32 bg-indigo-600/10 rounded-[2.5rem] flex items-center justify-center text-indigo-600 shadow-2xl shadow-indigo-600/10 rotate-12"
                >
                    <MessageCircle size={64} />
                </motion.div>

                <div className="space-y-6">
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                        {isRTL ? 'دردشة المستشار الذكي' : 'AI Advisor Chat'} <span className="text-indigo-600">💬</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium max-w-2xl mx-auto">
                        {isRTL
                            ? 'احصل على إجابات فورية، مراجعة للمقالات، وتوجيه مهني مخصص مبني على ملفك الأكاديمي.'
                            : 'Get instant answers, essay reviews, and personalized career guidance based on your profile.'}
                    </p>
                </div>

                <Card className="p-12 bg-white border-2 border-indigo-600 shadow-2xl shadow-indigo-600/10 w-full rounded-[3rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-indigo-600/5 rotate-12 scale-150">
                        <Sparkles size={100} />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className="space-y-4">
                                <p className="text-sm font-black text-indigo-400 uppercase tracking-widest">{isRTL ? 'العرض الذهبي' : 'GOLD OFFER'}</p>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400 font-black line-through text-2xl">{isRTL ? '99 ريال' : '99 SAR'}</span>
                                    <span className="bg-indigo-600 text-white text-xs font-black px-4 py-2 rounded-2xl animate-pulse">
                                        {isRTL ? 'خصم 50%' : '50% OFF'}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-black text-slate-900 text-7xl">49 {isRTL ? 'ريال' : 'SAR'}</p>
                                    <p className="text-slate-400 font-bold text-xl">{isRTL ? 'شهرياً' : 'Per Month'}</p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {[t('premiumFeature1'), t('premiumFeature2'), t('premiumFeature3'), t('premiumFeature4')].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600 font-bold">
                                        <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={12} className="text-emerald-600" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button
                            variant="gold"
                            size="lg"
                            className="w-full md:w-auto px-12 py-10 text-2xl font-black bg-indigo-600 text-white rounded-[2rem] shadow-xl shadow-indigo-600/20 hover:scale-[1.02] transition-transform"
                        >
                            {isRTL ? 'اشترك الآن' : 'Subscribe Now'}
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className={`h-[calc(100vh-140px)] flex flex-col bg-white rounded-[3rem] shadow-2xl shadow-indigo-900/5 overflow-hidden border border-slate-100/50 font-cairo ${isRTL ? 'rtl' : 'ltr'}`}>
            {/* Header */}
            <div className="px-10 py-6 bg-white/80 backdrop-blur-md border-b border-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white rotate-3 shadow-xl shadow-indigo-600/20">
                        <Bot size={28} />
                    </div>
                    <div>
                        <h2 className="font-black text-slate-900 text-lg">{isRTL ? 'المستشار الأكاديمي الذكي' : 'AI Academic Advisor'}</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isRTL ? 'متصل الآن' : 'ONLINE NOW'}</span>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-600 font-bold px-4 py-2 rounded-xl" onClick={handleNewChat}>
                    <RefreshCcw size={16} className={isRTL ? 'ml-2' : 'mr-2'} /> {isRTL ? 'محادثة جديدة' : 'New Chat'}
                </Button>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-10 space-y-8 bg-[#FBFCFF]"
            >
                {messages.length === 0 && !loading && (
                    <div className="h-full flex flex-col items-center justify-center space-y-10 max-w-md mx-auto text-center">
                        <div className="space-y-6">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-24 h-24 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl text-indigo-600"
                            >
                                <Sparkles size={48} />
                            </motion.div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900">{isRTL ? 'كيف يمكنني مساعدتك؟' : 'How can I help you?'}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{isRTL ? 'ملفك الأكاديمي جاهز لدي. اسألني أي شيء عن مسارك الجامعي.' : 'Your profile is ready. Ask me anything about your academic journey.'}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3 w-full">
                            {starterPrompts.map(p => (
                                <button
                                    key={p}
                                    onClick={() => handleSend(p)}
                                    className="bg-white border border-slate-100 px-6 py-4 rounded-2xl text-[13px] font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-lg transition-all text-right shadow-sm"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? (isRTL ? 'flex-row' : 'flex-row-reverse') : (isRTL ? 'flex-row-reverse' : 'flex-row')}`}>
                            <div className={`space-y-1 ${msg.role === 'user' ? (isRTL ? 'text-right' : 'text-left') : (isRTL ? 'text-left' : 'text-right')}`}>
                                <div className={`px-6 py-4 rounded-[1.8rem] text-sm md:text-base leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none font-bold'
                                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none font-medium'
                                    }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-2">
                                    {msg.role === 'user' ? (isRTL ? 'أنت' : 'YOU') : (isRTL ? 'المستشار' : 'ADVISOR')}
                                </span>
                            </div>
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-indigo-700 text-white' : 'bg-white border border-slate-100 text-indigo-600'
                                }`}>
                                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
                                <Bot size={20} />
                            </div>
                            <div className="bg-white border border-slate-100 px-6 py-4 rounded-[1.8rem] rounded-tl-none flex gap-1.5 items-center">
                                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-indigo-600 rounded-full" />
                                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-indigo-200 rounded-full" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-8 bg-white border-t border-slate-50">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-4 relative max-w-5xl mx-auto"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isRTL ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
                        className={`flex-1 px-8 py-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-600/10 focus:bg-white text-slate-900 transition-all outline-none font-bold text-lg shadow-inner ${isRTL ? 'text-right' : 'text-left'}`}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        className="px-10 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
                        disabled={!input.trim() || loading}
                    >
                        <Send size={24} className={isRTL ? 'rotate-180' : ''} />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
