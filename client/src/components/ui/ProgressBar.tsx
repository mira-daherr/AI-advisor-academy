import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
    current: number;
    total: number;
    title?: string;
    showText?: boolean;
}

export const ProgressBar = ({ current, total, title, showText = true }: ProgressBarProps) => {
    const percentage = Math.min(Math.max((current / total) * 100, 0), 100);

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-end">
                {title && <h4 className="text-sm font-semibold text-navy">{title}</h4>}
                {showText && (
                    <span className="text-xs font-medium text-slate-400">
                        Step {current} of {total}
                    </span>
                )}
            </div>
            <div className="h-2 w-full bg-soft-gray rounded-full overflow-hidden border border-soft-border">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-navy rounded-full shadow-[0_0_10px_rgba(15,32,68,0.2)]"
                />
            </div>
        </div>
    );
};
