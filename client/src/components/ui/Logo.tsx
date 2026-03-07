import React from 'react';
import { GraduationCap, Sparkles, Brain } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
    const { t, isRTL } = useLanguage();

    const sizeClasses = {
        sm: { icon: 18, text: 'text-lg', box: 'w-8 h-8' },
        md: { icon: 24, text: 'text-xl', box: 'w-10 h-10' },
        lg: { icon: 32, text: 'text-3xl', box: 'w-14 h-14' },
    };

    const currentSize = sizeClasses[size];

    return (
        <div className={`flex items-center gap-3 group transition-all duration-300 ${isRTL ? 'flex-row-reverse' : 'flex-row'} ${className}`}>
            <div className={`relative ${currentSize.box} flex items-center justify-center`}>
                {/* Evolution of Logo: Brain + Hat + AI Sparkles */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-indigo-200 rotate-6 group-hover:rotate-0 transition-transform duration-500" />
                <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-2xl border border-white/20" />

                <div className="relative z-10 text-white">
                    <GraduationCap size={currentSize.icon} className="absolute -top-1 -right-1 opacity-40" />
                    <Brain size={currentSize.icon * 0.85} />
                    <Sparkles
                        size={currentSize.icon * 0.5}
                        className="absolute -bottom-1 -left-1 text-gold animate-pulse"
                    />
                </div>
            </div>

            {showText && (
                <div className={`flex flex-col leading-none ${isRTL ? 'text-right' : 'text-left'}`}>
                    <span className={`${currentSize.text} font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors`}>
                        {isRTL ? 'المستشار' : 'Academic'}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest text-indigo-500 overflow-hidden`}>
                        {isRTL ? 'الأكاديمي الذكي' : 'Advisor AI'}
                    </span>
                </div>
            )}
        </div>
    );
};
