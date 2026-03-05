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
    MoreHorizontal
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

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
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

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
                { content: text },
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
        if (window.confirm('هل تريد بدء محادثة جديدة؟ سيتم مسح التاريخ الحالي.')) {
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

    const starterPrompts = [
        "ما هي أفضل جامعة يجب أن أقدم عليها؟",
        "ما هو المعدل المطلوب لتخصص علوم الحاسب؟",
        "ساعدني في كتابة مقدمة خطاب الغرض من الدراسة",
        "ما هي المنح الدراسية المتاحة لي؟"
    ];

    if (!isPremium) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto space-y-8 font-cairo">
                <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center text-gold shadow-2xl shadow-gold/20 animate-bounce">
                    <MessageCircle size={48} />
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-slate-900">دردشة المستشار الذكي 💬</h1>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        الدردشة مع المستشار الذكي هي ميزة <span className="text-indigo-600 font-black">ذهبية</span>.
                        قم بالترقية للحصول على نصائح شخصية غير محدودة، ومساعدة في المقالات، وإرشاد على مدار الساعة.
                    </p>
                </div>
                <Card className="p-8 bg-white text-slate-900 w-full border-slate-100 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-right">
                        <div className="space-y-2">
                            <p className="font-black text-indigo-600 text-2xl">39 ريال / شهرياً</p>
                            <ul className="text-sm text-slate-400 space-y-1">
                                <li className="flex items-center gap-2">✨ محادثات غير محدودة مع الذكاء الاصطناعي</li>
                                <li className="flex items-center gap-2">📄 مراجعة المقالات والسيرة الذاتية</li>
                                <li className="flex items-center gap-2">🎯 تكتيكات مخصصة لكل جامعة</li>
                            </ul>
                        </div>
                        <Button variant="primary" size="lg" className="w-full md:w-auto px-10">
                            فتح الدردشة الآن
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 font-cairo">
            {/* Header */}
            <div className="px-8 py-4 bg-white border-b border-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white rotate-3 shadow-lg shadow-indigo-200">
                        <GraduationCap size={24} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">المستشار الأكاديمي الذكي</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">متصل الآن</span>
                        </div>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-indigo-600" onClick={handleNewChat}>
                    <RefreshCcw size={16} className="ml-2" /> محادثة جديدة
                </Button>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50"
            >
                {messages.length === 0 && !loading && (
                    <div className="h-full flex flex-col items-center justify-center space-y-8 max-w-md mx-auto">
                        <div className="text-center space-y-4">
                            <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center mx-auto shadow-md text-indigo-600">
                                <Bot size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">كيف يمكنني مساعدتك اليوم؟</h3>
                            <p className="text-sm text-slate-500">ملفك الأكاديمي جاهز لدي. اسألني أي شيء عن مسارك الجامعي.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3 w-full">
                            {starterPrompts.map(p => (
                                <button
                                    key={p}
                                    onClick={() => handleSend(p)}
                                    className="bg-white border border-slate-100 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all text-right shadow-sm"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100 text-slate-600'
                                }`}>
                                {msg.role === 'user' ? <User size={16} /> : <GraduationCap size={16} />}
                            </div>
                            <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tl-none'
                                : 'bg-white border border-slate-100 text-slate-700 rounded-tr-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[80%]">
                            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                                <GraduationCap size={16} />
                            </div>
                            <div className="bg-slate-800 px-5 py-3 rounded-2xl rounded-tr-none flex gap-1">
                                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-50">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-4"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="اكتب سؤالك هنا..."
                        className="flex-1 px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-indigo-600/20 text-slate-900 transition-all outline-none font-medium text-right"
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        className="px-8 shadow-lg shadow-indigo-600/20"
                        disabled={!input.trim() || loading}
                    >
                        <Send size={20} className="rotate-180" />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
