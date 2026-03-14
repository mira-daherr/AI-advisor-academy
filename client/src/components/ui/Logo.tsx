import React from 'react';
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
                <svg className="w-full h-full drop-shadow-md transition-transform duration-500 cursor-pointer group-hover:scale-105" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="logo-grad1" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#7F77DD" />
                            <stop offset="100%" stopColor="#534AB7" />
                        </linearGradient>
                    </defs>
                    <rect width="60" height="60" rx="14" fill="url(#logo-grad1)" />
                    <circle cx="30" cy="26" r="16" fill="#7F77DD" opacity="0.4" />
                    <polygon points="30,10 54,18 30,26 6,18" fill="white" opacity="0.95" />
                    <rect x="23" y="18" width="14" height="12" rx="2" fill="white" opacity="0.8" />
                    <rect x="16" y="30" width="28" height="4" rx="2" fill="white" opacity="0.65" />
                    <line x1="53" y1="18" x2="53" y2="31" stroke="#EEEDFE" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="53" cy="34" r="3" fill="#EEEDFE" opacity="0.85" />
                    <circle cx="18" cy="38" r="1.5" fill="white" opacity="0.4" />
                    <circle cx="23" cy="41" r="1" fill="white" opacity="0.3" />
                    <circle cx="37" cy="41" r="1" fill="white" opacity="0.3" />
                    <circle cx="42" cy="38" r="1.5" fill="white" opacity="0.4" />
                </svg>
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
