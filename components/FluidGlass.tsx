import React from 'react';
import styles from './FluidGlass.module.css';

const FluidGlass: React.FC = () => {
    return (
        <div className={styles.glassContainer}>
            <button type="button" className={styles.glassBtn}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                </svg>
            </button>

            <svg style={{ display: 'none' }}>
                <filter id="container-glass" x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.008 0.008"
                        numOctaves="2"
                        seed="92"
                        result="noise"
                    />
                    <feGaussianBlur in="noise" stdDeviation="0.02" result="blur" />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="blur"
                        scale="77"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
                <filter id="btn-glass" x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.05"
                        numOctaves="2"
                        seed="92"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="10"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>
        </div>
    );
};

export default FluidGlass;
