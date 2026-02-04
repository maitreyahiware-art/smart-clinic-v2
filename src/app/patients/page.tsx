'use client';

import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { patients } from '@/data/patients';
import { Search, Filter, Users, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function PatientsRegistryPage() {
    const getRiskColor = (level: string) => {
        if (level === 'Critical') return { bg: '#FEE2E2', text: '#991B1B', badge: '#DC2626' };
        if (level === 'Monitor') return { bg: '#FEF3C7', text: '#92400E', badge: '#F59E0B' };
        return { bg: '#DBEAFE', text: '#1E40AF', badge: '#3B82F6' };
    };

    const getStatusColor = (status: string) => {
        if (status === 'Waiting') return { bg: '#FEF3C7', text: '#92400E' };
        if (status === 'In Progress') return { bg: '#DBEAFE', text: '#1E40AF' };
        return { bg: '#D1FAE5', text: '#065F46' };
    };

    return (
        <DashboardLayout>
            <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '8px' }}>
                        Patient Registry
                    </h1>
                    <p style={{ color: '#666' }}>Complete list of all patients scheduled for today</p>
                </div>

                {/* Search and Filter Bar */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '24px',
                    background: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB'
                }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#999'
                        }} />
                        <input
                            type="text"
                            placeholder="Search patients by name, condition, or ID..."
                            style={{
                                width: '100%',
                                padding: '10px 12px 10px 40px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '6px',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>
                    <button style={{
                        padding: '10px 16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem'
                    }}>
                        <Filter size={18} />
                        Filter
                    </button>
                </div>

                {/* Quick Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    {[
                        { label: 'Total Patients', value: patients.length, icon: Users, color: '#00B6C1' },
                        { label: 'Critical Cases', value: patients.filter(p => p.riskLevel === 'Critical').length, icon: AlertTriangle, color: '#DC2626' },
                        { label: 'In Progress', value: patients.filter(p => p.status === 'In Progress').length, icon: Activity, color: '#3B82F6' },
                        { label: 'Completed', value: patients.filter(p => p.status === 'Done').length, icon: TrendingUp, color: '#10B981' }
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} style={{
                                background: 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
                                            {stat.label}
                                        </div>
                                        <div style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>
                                            {stat.value}
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '8px',
                                        background: `${stat.color}15`,
                                        borderRadius: '8px'
                                    }}>
                                        <Icon size={24} color={stat.color} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Patient Table */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden'
                }}>
                    {/* Table Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '280px 1fr 200px 180px 150px 100px',
                        gap: '16px',
                        padding: '16px 20px',
                        background: 'var(--color-bg-primary)',
                        borderBottom: '1px solid #E5E7EB',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        <div>Patient</div>
                        <div>Dawai (Medicines)</div>
                        <div>Diagnostics</div>
                        <div>Detection</div>
                        <div>Visits & Follow-up</div>
                        <div>Action</div>
                    </div>

                    {/* Table Body */}
                    <div>
                        {patients.map((patient, index) => {
                            const riskColors = getRiskColor(patient.riskLevel);

                            // Deterministic mock data for demonstration
                            const getHealthScore = (level: string, id: string) => {
                                const seed = parseInt(id) || 42;
                                if (level === 'Critical') return 20 + (seed % 15);
                                if (level === 'High') return 45 + (seed % 15);
                                if (level === 'Monitor') return 65 + (seed % 15);
                                return 85 + (seed % 10);
                            };

                            const hasFilledScore = index % 3 !== 0; // Every 3rd patient hasn't "filled" it
                            const score = getHealthScore(patient.riskLevel, patient.id);

                            // Mock Weight/Height
                            const weight = 65 + (parseInt(patient.id) * 3 % 20);
                            const height = 160 + (parseInt(patient.id) * 2 % 25);

                            // Mock Last Visited
                            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            const lastVisit = `${1 + (parseInt(patient.id) * 5 % 28)} ${months[(parseInt(patient.id) * 2) % 12]}, 2024`;

                            return (
                                <div
                                    key={patient.id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '280px 1fr 200px 180px 150px 100px',
                                        gap: '16px',
                                        padding: '24px 20px', // Increased padding for larger rows
                                        borderBottom: '1px solid #E5E7EB',
                                        alignItems: 'center',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#F9FAFB'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    {/* Patient */}
                                    <div>
                                        <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '1.1rem', color: 'var(--color-brand-secondary)' }}>
                                            {patient.name}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#666', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: 600 }}>{patient.age}y, {patient.gender}</span>
                                            <span style={{ color: '#E5E7EB' }}>|</span>
                                            <span>{weight}kg / {height}cm</span>
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--color-brand-primary)',
                                            fontWeight: 500,
                                            lineHeight: '1.3'
                                        }}>
                                            {patient.reasonForVisit}
                                        </div>
                                    </div>

                                    {/* Dawai (Medicines) */}
                                    <div style={{ fontSize: '0.9rem', color: '#444' }}>
                                        {patient.medications?.current && patient.medications.current.length > 0 ? (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                {patient.medications.current.map((med, i) => (
                                                    <span key={i} style={{
                                                        background: '#F3F4F6',
                                                        padding: '4px 10px',
                                                        borderRadius: '6px',
                                                        fontSize: '0.8rem',
                                                        border: '1px solid #E5E7EB',
                                                        fontWeight: 500
                                                    }}>
                                                        {med}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span style={{ color: '#999', fontStyle: 'italic' }}>None prescribed</span>
                                        )}
                                    </div>

                                    {/* Diagnostics */}
                                    <div style={{ fontSize: '0.9rem', color: '#444' }}>
                                        {patient.symptoms && patient.symptoms.length > 0 ? (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {patient.symptoms.map((symptom, i) => (
                                                    <span key={i} style={{
                                                        background: 'rgba(0, 182, 193, 0.1)',
                                                        color: '#008B9A',
                                                        padding: '4px 12px',
                                                        borderRadius: '8px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        textTransform: 'capitalize',
                                                        border: '1px solid rgba(0, 182, 193, 0.2)'
                                                    }}>
                                                        {symptom}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span style={{ color: '#999', fontStyle: 'italic' }}>Pending Evaluation</span>
                                        )}
                                    </div>

                                    {/* Detection (Score or ASK button) */}
                                    <div>
                                        {hasFilledScore ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{
                                                        fontSize: '1.2rem',
                                                        fontWeight: 800,
                                                        color: riskColors.text
                                                    }}>
                                                        {score}
                                                    </span>
                                                    <span style={{ fontSize: '0.8rem', color: '#999', fontWeight: 500 }}>/ 100</span>
                                                </div>
                                                <span style={{
                                                    display: 'inline-block',
                                                    padding: '2px 8px',
                                                    background: riskColors.bg,
                                                    color: riskColors.text,
                                                    borderRadius: '4px',
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    width: 'fit-content',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {patient.riskLevel}
                                                </span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    const message = `Hi ${patient.name}, this is from Smart Clinic. We noticed your health assessment is pending. Please fill it here to help us track your health score: https://smartclinic.com/assess/${patient.id}`;
                                                    window.open(`https://wa.me/910000000000?text=${encodeURIComponent(message)}`, '_blank');
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    padding: '8px 16px',
                                                    background: '#25D366',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 700,
                                                    cursor: 'pointer',
                                                    boxShadow: '0 4px 10px rgba(37, 211, 102, 0.2)',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.3-.149-1.774-.875-2.048-.976-.275-.1-.475-.149-.675.149-.2.299-.775.976-.949 1.176-.175.199-.35.225-.65.075-.3-.149-1.266-.466-2.411-1.487-.891-.795-1.492-1.777-1.667-2.076-.175-.299-.019-.461.13-.609.135-.133.3-.349.45-.525.15-.175.2-.299.3-.499.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.594-.509-.512-.697-.521-.18-.009-.387-.011-.593-.011-.206 0-.542.077-.825.385-.283.308-1.079 1.054-1.079 2.571 0 1.517 1.104 2.981 1.254 3.181.15.2 2.173 3.318 5.263 4.654.736.317 1.311.507 1.758.649.74.234 1.413.201 1.945.122.593-.088 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" /></svg>
                                                ASK
                                            </button>
                                        )}
                                    </div>

                                    {/* Visits & Follow-up */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Last Visit</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>{lastVisit}</div>

                                        <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>Next Follow-up</div>
                                        <div style={{
                                            fontSize: '0.9rem',
                                            fontWeight: 800,
                                            color: 'var(--color-brand-primary)',
                                            background: 'rgba(0, 182, 193, 0.08)',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            width: 'fit-content'
                                        }}>
                                            {`${parseInt(patient.id) * 3 % 28 + 1} ${months[(parseInt(patient.id) * 3) % 12]}, 2025`}
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div>
                                        <Link
                                            href={`/patient/${patient.id}`}
                                            style={{
                                                padding: '10px 20px',
                                                background: 'var(--color-brand-primary)',
                                                color: 'white',
                                                borderRadius: '10px',
                                                fontSize: '0.9rem',
                                                fontWeight: 700,
                                                textDecoration: 'none',
                                                display: 'inline-block',
                                                transition: 'all 0.2s',
                                                textAlign: 'center',
                                                width: '100%',
                                                boxShadow: '0 4px 12px rgba(0, 182, 193, 0.15)'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = '#008B9A';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = 'var(--color-brand-primary)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            Profile
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
