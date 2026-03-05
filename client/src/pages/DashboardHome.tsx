import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    ChevronRight,
    GraduationCap,
    MessageSquare,
    FileText,
    RefreshCcw,
    Calendar,
    Clock,
    TrendingUp,
    Download,
    Lock,
    ChevronLeft
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

const DashboardHome = () => {
    const { user } = useAuth();
    const { t, isRTL } = useLanguage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState<any>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [recRes, questRes] = await Promise.all([
                    axios.get(`${API_URL}/recommendations/latest`, { withCredentials: true }).catch(() => ({ data: null })),
                    axios.get(`${API_URL}/questionnaire/my`, { withCredentials: true }).catch(() => ({ data: null }))
                ]);

                const fetchedData = {
                    recommendations: recRes.data,
                    questionnaire: questRes.data
                };

                console.log('--- DASHBOARD DATA DEBUG ---');
                console.log('Recommendations:', fetchedData.recommendations);
                console.log('Questionnaire:', fetchedData.questionnaire);
                console.log('-----------------------------');

                setStudentData(fetchedData);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading || !studentData) return (
        <div className="flex flex-col h-64 items-center justify-center gap-4">
            <Spinner />
            <div className="text-indigo-600 font-bold">{isRTL ? 'جاري التحميل...' : 'Loading...'}</div>
        </div>
    );

    const chartData = studentData?.questionnaire?.grades ? [
        { name: isRTL ? 'الرياضيات' : 'Math', score: studentData.questionnaire.grades.math ?? 0, color: '#4F46E5' },
        { name: isRTL ? 'العلوم' : 'Science', score: studentData.questionnaire.grades.science ?? 0, color: '#8B5CF6' },
        { name: isRTL ? 'اللغات' : 'Languages', score: studentData.questionnaire.grades.language ?? 0, color: '#4F46E5' },
        { name: isRTL ? 'الاجتماعيات' : 'Social Studies', score: studentData.questionnaire.grades.socialStudies ?? 0, color: '#8B5CF6' },
    ] : [];

    // Helper to get recommendations array
    const getRecs = () => {
        const recData = studentData?.recommendations;
        if (!recData) return [];
        return recData.recommendations || recData.majors || recData.universities || [];
    };

    const recommendationsList = getRecs();

    const scholarshipDeadlines = [
        { name: isRTL ? 'جائزة التميز العالمي' : 'Global Excellence Award', days: 12 },
        { name: isRTL ? 'منحة ابتكار STEM' : 'STEM Innovation Grant', days: 24 },
        { name: isRTL ? 'صندوق قادة المستقبل' : 'Future Leaders Fund', days: 45 }
    ];

    return (
        <div className={`space-y-8 pb-12 ${isRTL ? 'rtl font-cairo' : 'ltr font-poppins'}`}>
            {/* 1. Welcome Card */}
            <Card className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white overflow-hidden relative border-none shadow-xl">
                <div className={`relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <h1 className="text-3xl font-black">{isRTL ? 'صباح الخير' : 'Good morning'}, {user?.name}! 👋</h1>
                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                            <Badge variant={user?.plan === 'premium' ? 'premium' : 'free'}>
                                {isRTL ? (user?.plan === 'premium' ? 'حساب ذهبي' : 'حساب مجاني') : (user?.plan === 'premium' ? 'Gold Plan' : 'Free Plan')}
                            </Badge>
                            <span className={`text-sm text-indigo-100 flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                                <Clock size={14} /> {isRTL ? `تم إنشاء الملف ${studentData?.recommendations ? 'منذ يومين' : 'اليوم'}` : `Profile created ${studentData?.recommendations ? '2 days ago' : 'Today'}`}
                            </span>
                        </div>
                    </div>
                    <Button variant="gold" size="sm" onClick={() => navigate('/questionnaire')} className={`bg-white text-indigo-600 hover:bg-indigo-50 border-none shadow-md ${isRTL ? 'flex-row-reverse text-indigo-600' : ''}`}>
                        <RefreshCcw size={16} className={isRTL ? 'ml-2' : 'mr-2'} /> {t('retry')}
                    </Button>
                </div>
                <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} p-8 text-white/10 rotate-12 scale-[4]`}>
                    <GraduationCap size={100} />
                </div>
            </Card>

            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>
                <div className={`lg:col-span-2 space-y-8`}>

                    {/* 2. Academic Identity Card */}
                    <Card className="p-8 space-y-4 bg-white border-slate-100 shadow-sm">
                        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h3 className={`text-lg font-bold text-slate-900 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Sparkles size={20} className="text-indigo-600" /> {isRTL ? 'الهوية الأكاديمية' : 'Academic Identity'}
                            </h3>
                            <button onClick={() => navigate('/questionnaire')} className="text-sm text-indigo-600 hover:underline font-bold">{isRTL ? 'تعديل' : 'Edit'}</button>
                        </div>
                        <p className={`text-slate-600 leading-relaxed italic ${isRTL ? 'border-r-4 text-right pr-4' : 'border-l-4 text-left pl-4'} border-indigo-100 py-2`}>
                            "{studentData?.recommendations?.academicStatement || (isRTL ? 'يرجى إكمال الاستبيان لرؤية ملفك الشخصي.' : 'Please complete the questionnaire to see your profile.')}"
                        </p>
                    </Card>

                    {/* 5. Grade Tracker */}
                    <Card className="p-8 space-y-6 bg-white border-slate-100 shadow-sm">
                        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                            <h3 className={`text-lg font-bold text-slate-900 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <TrendingUp size={20} className="text-emerald-500" /> {isRTL ? 'تتبع الدرجات' : 'Grade Tracker'}
                            </h3>
                            <Button variant="ghost" size="sm" className="text-indigo-600">{isRTL ? 'تحديث الدرجات' : 'Update Grades'}</Button>
                        </div>
                        <div className="h-64 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} reversed={isRTL} />
                                    <YAxis axisLine={false} orientation={isRTL ? 'right' : 'left'} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                                    <RechartsTooltip
                                        cursor={{ fill: '#F8FAFC' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="score" radius={[4, 4, 0, 0]} barSize={40}>
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* 3. Top Matches Preview */}
                    <div className="space-y-4">
                        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                            <h3 className="text-xl font-bold text-slate-900">{isRTL ? 'أهم التوصيات' : 'Top Recommendations'}</h3>
                            <button onClick={() => navigate('/dashboard/results')} className={`text-sm text-indigo-600 font-bold flex items-center gap-1 hover:gap-2 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {isRTL ? 'عرض الكل' : 'View All'} {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recommendationsList.length > 0 ? (
                                recommendationsList.slice(0, 2).map((item: any, i: number) => (
                                    <Card key={i} className="p-6 hover:shadow-lg transition-all border-slate-100 bg-white">
                                        <div className={`flex justify-between items-start mb-2 ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                                            <h4 className="font-bold text-slate-900">{item.major || item.name}</h4>
                                            <Badge variant="outline">{item.career || item.country || (isRTL ? 'تخصص' : 'Major')}</Badge>
                                        </div>
                                        <p className={`text-xs text-slate-500 line-clamp-2 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>{item.why || item.reason || (isRTL ? 'هذا التخصص يناسب ميولك الأكاديمية.' : 'This major suits your academic profile.')}</p>
                                        <Button variant="ghost" size="sm" className={`p-0 text-indigo-600 font-bold ${isRTL ? 'ml-auto' : 'mr-auto'}`} onClick={() => navigate('/dashboard/results')}>{isRTL ? 'التفاصيل' : 'Details'}</Button>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm text-center col-span-2 py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                                    {isRTL ? 'لا توجد توصيات حتى الآن.' : 'No recommendations yet.'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* 4. Quick Actions */}
                    <Card className={`p-8 space-y-6 bg-white border-slate-100 shadow-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        <h3 className="text-lg font-bold text-slate-900">{isRTL ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
                        <div className="flex flex-col gap-3">
                            <Button variant="primary" className={`w-full justify-between ${isRTL ? 'flex-row-reverse' : ''}`} onClick={() => navigate('/dashboard/results')}>
                                <span>{isRTL ? 'الاستمرار في النتائج' : 'Continue to Results'}</span>
                                {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                            </Button>
                            <Button
                                variant="gold"
                                className={`w-full justify-between text-white ${isRTL ? 'flex-row-reverse font-cairo' : 'font-poppins'}`}
                                disabled={user?.plan !== 'premium'}
                                onClick={() => navigate('/dashboard/chat')}
                                style={{ background: 'linear-gradient(to right, #4F46E5, #8B5CF6)' }}
                            >
                                <span className="flex items-center gap-2">
                                    {isRTL ? 'دردشة المستشار' : 'Advisor Chat'} {user?.plan !== 'premium' && <Lock size={16} />}
                                </span>
                                {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                            </Button>
                            <Button
                                variant="outline"
                                className={`w-full justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                                disabled={user?.plan !== 'premium'}
                            >
                                <span className="flex items-center gap-2">
                                    {isRTL ? 'تحميل تقرير PDF' : 'Download PDF Report'} {user?.plan !== 'premium' && <Lock size={16} />}
                                </span>
                                <Download size={18} />
                            </Button>
                            {user?.plan === 'free' && (
                                <Button variant="gold" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-indigo-100">
                                    {isRTL ? 'الترقية إلى بريميوم' : 'Upgrade to Premium'}
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* 6. Scholarship Deadlines (Premium) */}
                    <Card className={`p-8 space-y-6 relative overflow-hidden bg-white border-slate-100 shadow-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`flex items-center gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                            <h3 className="text-lg font-bold text-slate-900">{isRTL ? 'المواعيد القادمة' : 'Upcoming Deadlines'}</h3>
                            <Calendar size={20} className="text-indigo-600" />
                        </div>

                        {user?.plan === 'premium' ? (
                            <div className="space-y-4">
                                {scholarshipDeadlines.map((s, i) => (
                                    <div key={i} className={`flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <div className={`${isRTL ? 'text-right' : 'text-left'} shrink-0`}>
                                            <p className="text-lg font-black text-emerald-600">{s.days}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{isRTL ? 'يوم متبقي' : 'Days left'}</p>
                                        </div>
                                        <div className={`space-y-1 ${isRTL ? 'text-left' : 'text-right'}`}>
                                            <p className="text-sm font-bold text-slate-900">{s.name}</p>
                                            <p className="text-xs text-slate-400">20 June, 2026</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center space-y-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 blur-[1px]">
                                    <Lock size={20} />
                                </div>
                                <p className="text-xs text-slate-500 blur-[1px]">{isRTL ? 'افتح ميزة تتبع المنح الدراسية' : 'Unlock Scholarship Tracking'}</p>
                                <button className="text-xs text-indigo-600 font-bold hover:underline">{isRTL ? 'ترقية للمشاهدة' : 'Upgrade to View'}</button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
