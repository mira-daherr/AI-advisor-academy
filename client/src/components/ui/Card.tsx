import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hasGoldBorder?: boolean;
}

export const Card = ({ className, hasGoldBorder, children, ...props }: CardProps) => {
    return (
        <div
            className={cn(
                'bg-slate-900 rounded-[2rem] border border-slate-800 shadow-xl transition-all duration-300',
                hasGoldBorder && 'border-gold shadow-gold/10 shadow-2xl',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('p-6 pb-2', className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('p-6 pt-2', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn('p-6 pt-0 border-t border-slate-800 mt-4', className)} {...props} />
);
