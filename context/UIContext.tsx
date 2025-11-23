"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface UIContextType {
    isContactOpen: boolean;
    openContact: () => void;
    closeContact: () => void;
    isTransitioning: boolean;
    startTransition: (href: string) => Promise<void>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const router = useRouter();

    const openContact = () => setIsContactOpen(true);
    const closeContact = () => setIsContactOpen(false);

    const startTransition = async (href: string) => {
        setIsTransitioning(true);
        // Wait for the entry animation to finish (adjust timing to match animation)
        await new Promise((resolve) => setTimeout(resolve, 800));
        router.push(href);
        // Wait for the route change to propagate and exit animation to start
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsTransitioning(false);
    };

    return (
        <UIContext.Provider value={{ isContactOpen, openContact, closeContact, isTransitioning, startTransition }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}
