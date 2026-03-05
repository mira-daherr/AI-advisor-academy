import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, icon, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-sm font-semibold text-slate-300 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-gold transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'w-full py-4 rounded-3xl bg-slate-950 border border-slate-700 transition-all outline-none text-white placeholder:text-slate-600 focus:border-gold/50 focus:shadow-[0_0_20px_rgba(255,215,0,0.05)] disabled:opacity-50 disabled:cursor-not-allowed',
                            icon ? 'pl-12 pr-4' : 'px-6',
                            error && 'border-status-error focus:border-status-error',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error ? (
                    <p className="text-xs font-medium text-status-error ml-1">{error}</p>
                ) : helperText ? (
                    <p className="text-xs text-slate-400 ml-1">{helperText}</p>
                ) : null}
            </div>
        );
    }
);

Input.displayName = 'Input';
