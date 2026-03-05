import React, { useState } from 'react';
import {
    User,
    Mail,
    Lock,
    Bell,
    Trash2,
    CreditCard,
    CheckCircle,
    HelpCircle,
    ShieldCheck,
    Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';

const SettingsPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccess('تم تحديث الملف الشخصي بنجاح!');
            setTimeout(() => setSuccess(''), 3000);
        }, 1000);
    };

    return (
        <div className="max-w-4xl space-y-8 pb-12 font-cairo text-right">
            <div className="space-y-2">
                <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 justify-end">
                    الإعدادات <Settings size={32} />
                </h1>
                <p className="text-slate-500">إدارة حسابك وتفضيلاتك الشخصية.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Navigation / Info */}
                <div className="space-y-4">
                    <Card className="p-2 border-slate-100 bg-white overflow-hidden shadow-sm">
                        <button className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl shadow-lg">
                            <span className="font-bold">معلومات الملف</span>
                            <User size={18} />
                        </button>
                        <button className="w-full flex items-center justify-between gap-3 px-4 py-3 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
                            <span>الفواتير والخطة</span>
                            <CreditCard size={18} />
                        </button>
                        <button className="w-full flex items-center justify-between gap-3 px-4 py-3 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
                            <span>التنبيهات</span>
                            <Bell size={18} />
                        </button>
                        <button className="w-full flex items-center justify-between gap-3 px-4 py-3 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
                            <span>الخصوصية والأمان</span>
                            <ShieldCheck size={18} />
                        </button>
                    </Card>

                    <Card className="p-6 bg-indigo-50 border-indigo-100 space-y-4">
                        <div className="flex items-center gap-2 text-indigo-700 font-black justify-end">
                            تحتاج مساعدة؟ <HelpCircle size={18} />
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed text-right">
                            هل تواجه مشكلة في حسابك أو في العثور على ما تبحث عنه؟ تواصل مع فريق دعم الطلاب لدينا.
                        </p>
                        <button className="text-xs font-black text-indigo-600 hover:underline w-full text-right">تواصل مع الدعم</button>
                    </Card>
                </div>

                {/* Form Area */}
                <div className="md:col-span-2 space-y-8">
                    {/* Profile Card */}
                    <Card className="p-10 space-y-8 bg-white border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start">
                            <Badge variant={user?.plan === 'premium' ? 'premium' : 'outline'}>
                                عضو {user?.plan === 'premium' ? 'ذهبي' : 'عادي'}
                            </Badge>
                            <div className="space-y-1 text-right">
                                <h3 className="text-xl font-bold text-slate-900">التفاصيل الشخصية</h3>
                                <p className="text-sm text-slate-500">قم بتحديث معلوماتك هنا.</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="الاسم الكامل" defaultValue={user?.name} icon={<User size={18} />} className="text-right" />
                            <Input label="البريد الإلكتروني" defaultValue={user?.email} icon={<Mail size={18} />} className="text-right" />
                            <Input label="كلمة المرور الجديدة" placeholder="••••••••" type="password" icon={<Lock size={18} />} className="text-right" />
                            <Input label="تأكيد كلمة المرور" placeholder="••••••••" type="password" icon={<Lock size={18} />} className="text-right" />

                            <div className="md:col-span-2 pt-6">
                                <Button variant="primary" size="lg" className="w-full md:w-auto px-12" isLoading={loading}>
                                    حفظ التغييرات
                                </Button>
                                {success && (
                                    <p className="mt-4 text-sm text-emerald-600 font-bold flex items-center gap-2 justify-end animate-bounce">
                                        {success} <CheckCircle size={16} />
                                    </p>
                                )}
                            </div>
                        </form>
                    </Card>

                    {/* Account Management */}
                    <Card className="p-10 space-y-8 bg-white border-slate-100 shadow-sm">
                        <div className="space-y-1 text-right">
                            <h3 className="text-xl font-bold text-slate-900">إجراءات الحساب</h3>
                            <p className="text-sm text-slate-500">خيارات إدارة غير قابلة للتراجع.</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-slate-50 rounded-[2rem] gap-4">
                                <Button variant="outline">لوحة الفواتير</Button>
                                <div className="space-y-1 text-right">
                                    <p className="font-bold text-slate-900">إدارة الاشتراك</p>
                                    <p className="text-xs text-slate-500">إلغاء أو تغيير عضوية البريميوم الخاصة بك.</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-red-50 rounded-[2rem] gap-4">
                                <button className="text-sm font-black text-red-600 hover:text-red-700 flex items-center gap-2 px-6 py-3 border-2 border-red-100 rounded-full transition-all hover:bg-red-100">
                                    <Trash2 size={18} /> حذف بياناتي
                                </button>
                                <div className="space-y-1 text-right">
                                    <p className="font-bold text-red-600">حذف الحساب</p>
                                    <p className="text-xs text-red-400">حذف ملفك الأكاديمي وبياناتك بالكامل بشكل دائم.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
