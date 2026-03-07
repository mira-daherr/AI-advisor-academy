import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    MapPin,
    Trash2,
    Plus,
    ChevronRight,
    StickyNote,
    Columns
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

const SavedUniversitiesPage = () => {
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [comparing, setComparing] = useState<string[]>([]);
    const [showComparison, setShowComparison] = useState(false);
    const navigate = useNavigate();

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/bookmarks`, { withCredentials: true });
            setBookmarks(res.data);
        } catch (err) {
            console.error('Failed to fetch bookmarks', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('هل أنت متأكد من الحذف من القائمة المحفوظة؟')) return;
        try {
            await axios.delete(`${API_URL}/bookmarks/${id}`, { withCredentials: true });
            setBookmarks(prev => prev.filter(b => b._id !== id));
            setComparing(prev => prev.filter(compId => compId !== id));
        } catch (err) {
            console.error('Delete failed', err);
        }
    };

    const handleUpdateNotes = async (id: string, notes: string) => {
        try {
            await axios.patch(`${API_URL}/bookmarks/${id}`, { notes }, { withCredentials: true });
        } catch (err) {
            console.error('Update notes failed', err);
        }
    };

    const toggleCompare = (id: string) => {
        setComparing(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
        );
    };

    if (loading) return <div className="flex h-64 items-center justify-center"><Spinner /></div>;

    return (
        <div className="space-y-8 pb-12 font-cairo text-right">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {comparing.length > 0 && (
                    <Button variant="gold" className="flex items-center gap-2 px-8 bg-indigo-600 text-white hover:bg-indigo-700 border-none shadow-indigo-100" onClick={() => setShowComparison(true)}>
                        <Columns size={18} /> مقارنة ({comparing.length}/3)
                    </Button>
                )}
                <div className="space-y-2 flex-1 md:text-right">
                    <h1 className="text-3xl font-black text-slate-900 flex items-center justify-end gap-3">
                        الجامعات المحفوظة <Building2 size={32} />
                    </h1>
                    <p className="text-slate-500">تتبع المؤسسات التعليمية التي تهتم بها.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((b) => (
                    <Card key={b._id} className="p-8 space-y-6 flex flex-col h-full hover:shadow-xl transition-all border-slate-100 bg-white shadow-sm">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">مقارنة</span>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                                    checked={comparing.includes(b._id)}
                                    onChange={() => toggleCompare(b._id)}
                                />
                            </div>
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Building2 size={24} />
                            </div>
                        </div>

                        <div className="space-y-2 flex-1 text-right">
                            <h3 className="text-xl font-black text-slate-900">{b.universityName}</h3>
                            <div className="flex items-center justify-end gap-2 text-sm text-slate-400">
                                {b.country} <MapPin size={14} />
                            </div>
                            <div className="flex justify-end pt-1">
                                <Badge variant="outline" className="border-slate-200 text-slate-500">{b.tuition}</Badge>
                            </div>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-slate-50 text-right">
                            <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-400 uppercase">
                                ملاحظات شخصية <StickyNote size={14} />
                            </div>
                            <textarea
                                className="w-full h-24 p-4 text-sm bg-slate-50 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all resize-none italic text-slate-600 text-right"
                                placeholder="مثلاً: توفر زمالة بحثية رائعة..."
                                defaultValue={b.notes}
                                onBlur={(e) => handleUpdateNotes(b._id, e.target.value)}
                            />
                        </div>

                        <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl -mx-4 -mb-4">
                            <Button variant="ghost" size="sm" className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
                                التفاصيل <ChevronRight size={16} />
                            </Button>
                            <button onClick={() => handleDelete(b._id)} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Comparison Modal (Simple Overlay) */}
            {showComparison && (
                <div className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm p-6 md:p-12 flex items-center justify-center font-cairo">
                    <div className="max-w-6xl w-full bg-white rounded-[2rem] p-12 relative max-h-[90vh] overflow-y-auto shadow-2xl">
                        <button
                            onClick={() => setShowComparison(false)}
                            className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 p-2"
                        >
                            <Plus size={32} className="rotate-45" />
                        </button>

                        <h2 className="text-3xl font-black text-slate-900 mb-12 text-right">أداة المقارنة</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-100 pt-12">
                            {bookmarks.filter(b => comparing.includes(b._id)).map(b => (
                                <div key={b._id} className="space-y-8 text-right">
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black text-slate-900">{b.universityName}</h4>
                                        <div className="flex justify-end">
                                            <Badge variant="premium">{b.country}</Badge>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">تقدير الرسوم</p>
                                        <p className="text-xl font-bold text-slate-900">{b.tuition}</p>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ملاحظاتك</p>
                                        <p className="text-sm text-slate-500 leading-relaxed italic">"{b.notes || 'لا يوجد'}"</p>
                                    </div>

                                    <Button variant="primary" className="w-full bg-indigo-600 hover:bg-indigo-700">قدم الآن</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedUniversitiesPage;
