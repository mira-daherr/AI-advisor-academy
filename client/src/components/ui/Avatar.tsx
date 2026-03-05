import React from 'react';

interface AvatarProps {
    name?: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Avatar = ({ name, src, size = 'md', className = '' }: AvatarProps) => {
    const sizes = {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-14 w-14 text-lg',
    };

    const initials = name
        ? name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'U';

    return (
        <div
            className={`relative inline-flex items-center justify-center overflow-hidden rounded-full bg-navy text-white font-bold tracking-tight ${sizes[size]} ${className}`}
        >
            {src ? (
                <img src={src} alt={name || 'User'} className="h-full w-full object-cover" />
            ) : (
                <span>{initials}</span>
            )}
        </div>
    );
};
