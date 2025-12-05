import { Loader2 } from 'lucide-react';

const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
};

const SpinnerIcon = ({size}) => (
    <Loader2
        className={`animate-spin text-blue-600 ${sizeClasses[size]}`}
    />
);

const Loader = ({
    variant = 'section', // 'fullscreen' | 'section' | 'inline'
    size = 'medium',     // 'small' | 'medium' | 'large'
    text = null,         // Optional loading text
    className = ''
}) => {

    // 1. Full Screen Overlay (Glassmorphism effect)
    if (variant === 'fullscreen') {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-all">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center gap-4">
                    <SpinnerIcon size={size} />
                    {text && (
                        <p className="text-gray-500 text-sm font-medium animate-pulse">
                            {text}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // 2. Section/Container Loader (Centered in div)
    if (variant === 'section') {
        return (
            <div className={`w-full h-full min-h-[200px] flex flex-col items-center justify-center gap-3 ${className}`}>
                <SpinnerIcon />
                {text && <span className="text-gray-400 text-sm">{text}</span>}
            </div>
        );
    }

    return <SpinnerIcon />;
};

export default Loader;