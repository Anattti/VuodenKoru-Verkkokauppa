import React from 'react';
import styles from './CssGlassButton.module.css';

interface CssGlassButtonProps {
    text?: string;
    onClick?: () => void;
    className?: string;
}

export default function CssGlassButton({ text = "Liquid", onClick, className = "" }: CssGlassButtonProps) {
    return (
        <div className={`${styles['glass-button-wrapper']} relative flex flex-col items-center justify-center ${className}`}>
            <button
                className={`${styles['glass-button']} relative outline-none rounded-xl cursor-pointer px-6 py-3 md:px-10 md:py-5`}
                onClick={onClick}
            >
                {/* THE LIQUID CONTAINER */}
                <div
                    className="absolute inset-0 rounded-xl overflow-hidden"
                    style={{
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        boxShadow: `
                            0 20px 40px -5px rgba(0,0,0,0.2),
                            inset 0 0 0 1px rgba(255,255,255,0.1),
                            inset 0 10px 20px rgba(255,255,255,0.1),
                            inset 0 -10px 20px rgba(0,0,0,0.1),
                            inset 0 0 30px rgba(255,255,255,0.02)
                        `
                    }}
                >
                    {/* Specular Highlight (Kiilto ylhäällä - vähemmän peittävä) */}
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent opacity-40" />

                    {/* Bottom Highlight (Heijastus alhaalla - himmeämpi) */}
                    <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-white/20 blur-[1px] rounded-full" />

                    {/* Hienovarainen väriheijastus pinnassa (poistettu värit kokonaan) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 opacity-20 mix-blend-overlay" />
                </div>

                {/* Napin teksti */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <span className="text-white font-medium uppercase tracking-[0.2em] text-sm md:text-lg drop-shadow-md opacity-90 mix-blend-overlay">
                        {text}
                    </span>
                </div>
            </button>

            {/* Heijastus lattialla */}
            <div className={`${styles['glass-reflection']} mt-6 w-40 h-4 bg-white/10 blur-xl rounded-[100%] pointer-events-none`} />
        </div>
    );
}
