"use client";

import { useEffect, useRef } from 'react';
import '@google/model-viewer';


interface ModelViewerProps {
    src: string;
    poster?: string;
    alt?: string;
}

export default function ModelViewer({ src, poster, alt }: ModelViewerProps) {
    const modelRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Optional: Add event listeners or custom logic here
    }, []);

    const ModelViewerComponent = 'model-viewer' as any;

    return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-50">
            <ModelViewerComponent
                src={src}
                poster={poster}
                alt={alt || "3D Model"}
                camera-controls
                auto-rotate
                shadow-intensity="1"
                loading="eager"
                ar
                ar-modes="webxr scene-viewer quick-look"
                className="w-full h-full w-full h-[500px]"
                style={{ width: '100%', height: '100%', minHeight: '500px' }}
            >
                <div slot="progress-bar"></div>
            </ModelViewerComponent>
        </div>
    );
}
