import React from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full space-y-2">
                {label && (
                    <label className="block text-sm font-semibold text-navy ml-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        className={cn(
                            'w-full appearance-none px-4 py-3 rounded-2xl bg-soft-gray border-2 border-transparent transition-all outline-none text-navy focus:bg-white focus:border-gold/50 focus:shadow-sm disabled:opacity-50',
                            error && 'border-status-error focus:border-status-error',
                            className
                        )}
                        {...props}
                    >
                        <option value="" disabled hidden>
                            Select an option...
                        </option>
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={18} />
                    </div>
                </div>
                {error && <p className="text-xs font-medium text-status-error ml-1">{error}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';
