import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'indigo' | 'gold' | 'white';
}

export const Spinner = ({ size = 'md', color = 'indigo' }: SpinnerProps) => {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
    };

    const colors = {
        indigo: 'border-indigo-500',
        gold: 'border-gold',
        white: 'border-slate-400',
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={`animate-spin rounded-full border-t-transparent ${sizes[size]} ${colors[color]}`}
                role="status"
                aria-label="Loading"
            />
        </div>
    );
};
