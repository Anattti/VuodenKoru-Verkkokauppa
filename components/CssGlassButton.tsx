"use client";

import React, { useState } from 'react';

interface CssGlassButtonProps {
    text?: string;
    onClick?: () => void;
    className?: string;
}

export default function CssGlassButton({ text = "Liquid", onClick, className = "" }: CssGlassButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    return (
        <div className={`relative flex flex-col items-center justify-center ${className}`}>
            <button
                className="relative outline-none rounded-xl cursor-pointer px-6 py-3"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseDown={() => setIsActive(true)}
                onMouseUp={() => setIsActive(false)}
                onClick={onClick}
                style={{
                    transform: isActive ? 'scale(0.95)' : isHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
            >
                {/* THE LIQUID CONTAINER */}
                <div
                    className="absolute inset-0 rounded-xl overflow-hidden transition-all duration-300"
                    style={{
                        // Kirkas neste (vähän blurria, ei saturaatiota)
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',

                        // Liquid Volume Effect - 3D varjot (neutralisoitu)
                        boxShadow: `
                0 20px 40px -5px rgba(0,0,0,0.2),            /* Drop shadow (kevyempi) */
                inset 0 0 0 1px rgba(255,255,255,0.1),       /* Sharp edge (himmeämpi) */
                inset 0 10px 20px rgba(255,255,255,0.1),     /* Top Highlight (himmeämpi) */
                inset 0 -10px 20px rgba(0,0,0,0.1),          /* Bottom Shade */
                inset 0 0 30px rgba(255,255,255,0.02)        /* Inner Glow (hyvin himmeä) */
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
                    <span className="text-white font-medium uppercase tracking-[0.2em] text-sm md:text-base drop-shadow-md opacity-90 mix-blend-overlay">
                        {text}
                    </span>
                </div>
            </button>

            {/* Heijastus lattialla */}
            <div
                className="mt-6 w-40 h-4 bg-white/10 blur-xl rounded-[100%] transition-all duration-500 pointer-events-none"
                style={{
                    transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                    opacity: isHovered ? 0.3 : 0.1
                }}
            />
        </div>
    );
}
