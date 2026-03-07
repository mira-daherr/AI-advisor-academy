import React, { createContext, useContext, useState, useEffect } from 'react';

import { translations } from '../translations';

type Language = 'en' | 'ar';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(
        (localStorage.getItem('language') as Language) || 'ar'
    );
    console.log("[LanguageContext] Initial/Current language state in Provider:", language);

    const isRTL = language === 'ar';

    useEffect(() => {
        console.log("[LanguageContext] useEffect triggered, updating DOM and localStorage for language:", language);
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        document.body.style.fontFamily = isRTL ? "'Cairo', sans-serif" : "'Poppins', sans-serif";
        localStorage.setItem('language', language);
    }, [language, isRTL]);

    const t = (key: string) => {
        const trans = (translations as any)[language];
        const result = trans ? trans[key] || key : key;
        // console.log(`[LanguageContext.t] ${key} -> ${result} (lang: ${language})`);
        return result;
    };

    const setLanguage = (lang: Language) => {
        console.log("[LanguageContext] setLanguage called with:", lang, "- current state:", language);
        setLanguageState(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
