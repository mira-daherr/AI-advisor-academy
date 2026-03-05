import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'free' | 'premium' | 'success' | 'outline';
}

export const Badge = ({ className, variant = 'outline', ...props }: BadgeProps) => {
    const variants = {
        free: 'bg-slate-100 text-slate-700 font-bold',
        premium: 'bg-gold/10 text-gold-dark border border-gold/20 font-bold',
        success: 'bg-emerald-50 text-emerald-700 font-bold',
        outline: 'border border-soft-border text-slate-500',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider',
                variants[variant],
                className
            )}
            {...props}
        />
    );
};
