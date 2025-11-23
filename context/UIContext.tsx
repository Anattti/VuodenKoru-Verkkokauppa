"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
    isContactOpen: boolean;
    openContact: () => void;
    closeContact: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
    const [isContactOpen, setIsContactOpen] = useState(false);

    const openContact = () => setIsContactOpen(true);
    const closeContact = () => setIsContactOpen(false);

    return (
        <UIContext.Provider value={{ isContactOpen, openContact, closeContact }}>
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
