'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SpecialtyConfig } from '../types/specialty';
import { SPECIALTIES } from '../data/specialties';

interface SpecialtyContextType {
    specialty: SpecialtyConfig | null;
    setSpecialtyId: (id: string) => void;
    isInitialized: boolean;
}

const SpecialtyContext = createContext<SpecialtyContextType | undefined>(undefined);

export function SpecialtyProvider({ children }: { children: React.ReactNode }) {
    const [specialty, setSpecialty] = useState<SpecialtyConfig | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Hardcode Cardiology for the new Cardiology-only focus
        const cardioSpec = SPECIALTIES['cardiology'];
        setSpecialty(cardioSpec);

        document.documentElement.style.setProperty('--color-specialty-primary', cardioSpec.dashboardAccent.primary);
        document.documentElement.style.setProperty('--color-specialty-subtle', cardioSpec.dashboardAccent.subtle);

        setIsInitialized(true);
    }, []);

    const setSpecialtyId = (id: string) => {
        // No-op for now as we are Cardiology focused
    };

    return (
        <SpecialtyContext.Provider value={{ specialty, setSpecialtyId, isInitialized }}>
            {children}
        </SpecialtyContext.Provider>
    );
}

export function useSpecialty() {
    const context = useContext(SpecialtyContext);
    if (context === undefined) {
        throw new Error('useSpecialty must be used within a SpecialtyProvider');
    }
    return context;
}
