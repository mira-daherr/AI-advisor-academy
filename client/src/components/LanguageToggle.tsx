import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'ar' : 'en');
    };

    return (
        <button
            onClick={toggleLanguage}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-bold hover:bg-white/20 transition-all shadow-lg"
            style={{
                left: language === 'en' ? 'auto' : '1.5rem',
                right: language === 'en' ? '1.5rem' : 'auto'
            }}
        >
            <Globe size={18} />
            <span>{t('langToggle')}</span>
        </button>
    );
};
