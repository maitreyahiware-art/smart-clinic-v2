'use client';

import React from 'react';
import { useSpecialty } from '@/context/SpecialtyContext';
import { SPECIALTIES } from '@/data/specialties';
import { Stethoscope, Baby, Heart, Bone, Brain, Wind } from 'lucide-react';

const icons: Record<string, any> = {
    general: Stethoscope,
    pediatrics: Baby,
    cardiology: Heart,
    orthopedics: Bone,
    psychiatry: Brain,
    pulmonology: Wind
};

export default function SpecialtyGate({ children }: { children: React.ReactNode }) {
    const { specialty, setSpecialtyId, isInitialized } = useSpecialty();

    if (!isInitialized) return null;

    if (!specialty) {
        return (
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'var(--color-bg-primary)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '32px', zIndex: 9999
            }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <img src="/assets/BN_Logo-BlueBG-Square-HD.png" alt="Logo" style={{ width: '80px', height: '80px', borderRadius: '20px', marginBottom: '24px' }} />
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-brand-secondary)', marginBottom: '12px' }}>
                        Welcome to Smart Clinic
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
                        Please select your specialty to initialize the OS.
                    </p>
                </div>

                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '24px', maxWidth: '1000px', width: '100%'
                }}>
                    {Object.values(SPECIALTIES).map((spec) => {
                        const Icon = icons[spec.id] || Stethoscope;
                        return (
                            <button
                                key={spec.id}
                                onClick={() => setSpecialtyId(spec.id)}
                                style={{
                                    padding: '32px', borderRadius: '24px', background: 'var(--color-white)',
                                    border: `2px solid var(--color-border)`, textAlign: 'left',
                                    transition: 'all 0.3s ease', cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', gap: '16px'
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.borderColor = spec.dashboardAccent.primary;
                                    e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'var(--color-border)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '12px',
                                    background: spec.dashboardAccent.subtle, color: spec.dashboardAccent.primary,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-secondary)', marginBottom: '4px' }}>
                                        {spec.label}
                                    </h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                                        Activate {spec.label.toLowerCase()}-specific risk triggers and smart templates.
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
