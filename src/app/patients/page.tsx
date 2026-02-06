'use client';

import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { patients } from '@/data/patients';
import { Search, Filter, Users, AlertTriangle, Activity, TrendingUp, Pill, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PatientsRegistryPage() {
    const router = useRouter();
    const getRiskColor = (level: string) => {
        if (level === 'Critical') return { bg: '#FEF2F2', text: '#991B1B', badge: '#EF4444', label: 'SOS / URGENT' };
        if (level === 'High') return { bg: '#FFF7ED', text: '#9A3412', badge: '#FB923C', label: 'PRIORITY CARE' };
        if (level === 'Monitor') return { bg: '#EFF6FF', text: '#1E40AF', badge: '#3B82F6', label: 'WATCH / ACTION' };
        return { bg: '#F0FDF4', text: '#166534', badge: '#22C55E', label: 'ROUTINE' };
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
                        gridTemplateColumns: '250px 1fr 180px 150px 120px 150px',
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
                        <div>BN Analysis</div>
                        <div>Diet Plan</div>
                        <div>Visits & Follow-up</div>
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

                            // BMI & Ideal Weight Logic
                            const heightInMeters = height / 100;
                            const bmiValue = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
                            let bmiCategory = 'Normal';
                            let bmiColor = '#10B981';
                            if (bmiValue < 18.5) { bmiCategory = 'Underweight'; bmiColor = '#3B82F6'; }
                            else if (bmiValue >= 25 && bmiValue < 30) { bmiCategory = 'Overweight'; bmiColor = '#F59E0B'; }
                            else if (bmiValue >= 30) { bmiCategory = 'Obese'; bmiColor = '#EF4444'; }
                            const idealWeight = (22 * Math.pow(heightInMeters, 2)).toFixed(0);

                            // Mock Diagnostic Insights
                            const diagOptions = [
                                { test: 'ECG', insight: 'Sinus Rhythm' },
                                { test: '2D Echo', insight: 'EF 60%, Normal' },
                                { test: 'Labs', insight: 'Elevated LDL' },
                                { test: 'Vitals', insight: 'BP Controlled' }
                            ];
                            const diagInsight = diagOptions[parseInt(patient.id) % 4];

                            // BN Biological Markers
                            const markerPool = ['Smoker', 'Insomnia', 'Sedentary', 'High Sodium', 'Alcohol (Mod)', 'Chronic Stress', 'Post-Op', 'Family History', 'OSA Risk', 'Salt Sensitive', 'Caffeine+', 'Vagal Tone'];
                            const seed = parseInt(patient.id);
                            const markers = [markerPool[seed % 12], markerPool[(seed * 2) % 12], markerPool[(seed * 3) % 12]].slice(0, seed % 3 + 1);

                            // Visit Types
                            const vTypes = ['1st Consultation', 'Follow-up', 'Routine Checkup'];
                            const visitType = vTypes[parseInt(patient.id) % 3];

                            return (
                                <div
                                    key={patient.id}
                                    onClick={() => router.push(`/patient/${patient.id}`)}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '250px 1fr 180px 150px 120px 150px',
                                        gap: '16px',
                                        padding: '24px 20px',
                                        borderBottom: '1px solid #E5E7EB',
                                        alignItems: 'center',
                                        transition: 'background 0.2s',
                                        cursor: 'pointer'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#F9FAFB'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    {/* Patient Profile */}
                                    <div>
                                        <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '1.1rem', color: 'var(--color-brand-secondary)' }}>
                                            {patient.name}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#666', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                                            <span style={{ fontWeight: 600 }}>{patient.age}y, {patient.gender}</span>
                                            <span style={{ color: '#E5E7EB' }}>|</span>
                                            <span>{weight}kg / {height}cm</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                            <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontWeight: 700, color: '#444' }}>BMI: {bmiValue}</span>
                                                <span style={{
                                                    fontSize: '0.65rem', padding: '1px 6px', borderRadius: '4px',
                                                    background: `${bmiColor}15`, color: bmiColor, fontWeight: 800, textTransform: 'uppercase'
                                                }}>{bmiCategory}</span>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                                Ideal Weight: <span style={{ fontWeight: 700, color: 'var(--color-brand-primary)' }}>{idealWeight} kg</span>
                                            </div>
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
                                    <div style={{ fontSize: '0.9rem' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-brand-primary)', textTransform: 'uppercase', marginBottom: '4px' }}>
                                            {diagInsight.test}
                                        </div>
                                        <div style={{
                                            padding: '8px 12px', background: '#F9FAFB',
                                            borderRadius: '8px', borderLeft: '3px solid var(--color-brand-primary)',
                                            fontSize: '0.85rem', color: '#444', fontWeight: 600
                                        }}>
                                            {diagInsight.insight}
                                        </div>
                                    </div>

                                    {/* BN Analysis */}
                                    <div>
                                        {hasFilledScore ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '1.2rem', fontWeight: 800, color: riskColors.text }}>{score}</span>
                                                    <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: riskColors.bg, color: riskColors.text, borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
                                                        {riskColors.label}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                                    {markers.map((m, i) => (
                                                        <span key={i} style={{ fontSize: '0.6rem', fontWeight: 800, color: '#F43F5E', background: '#FFF1F2', padding: '2px 6px', borderRadius: '4px', border: '1px solid #FECDD3' }}>
                                                            {m.toUpperCase()}
                                                        </span>
                                                    ))}
                                                    {patient.symptoms?.map((s, i) => (
                                                        <span key={i} style={{ fontSize: '0.65rem', fontWeight: 700, color: '#666', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px' }}>
                                                            {s.toUpperCase()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const message = `Hi ${patient.name}, health assessment pending.`;
                                                    window.open(`https://wa.me/910000000000?text=${encodeURIComponent(message)}`, '_blank');
                                                }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
                                                    background: '#25D366', color: 'white', border: 'none', borderRadius: '8px',
                                                    fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 10px rgba(37, 211, 102, 0.2)'
                                                }}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.3-.149-1.774-.875-2.048-.976-.275-.1-.475-.149-.675.149-.2.299-.775.976-.949 1.176-.175.199-.35.225-.65.075-.3-.149-1.266-.466-2.411-1.487-.891-.795-1.492-1.777-1.667-2.076-.175-.299-.019-.461.13-.609.135-.133.3-.349.45-.525.15-.175.2-.299.3-.499.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.594-.509-.512-.697-.521-.18-.009-.387-.011-.593-.011-.206 0-.542.077-.825.385-.283.308-1.079 1.054-1.079 2.571 0 1.517 1.104 2.981 1.254 3.181.15.2 2.173 3.318 5.263 4.654.736.317 1.311.507 1.758.649.74.234 1.413.201 1.945.122.593-.088 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" /></svg>
                                                ASK
                                            </button>
                                        )}
                                    </div>

                                    {/* Diet Plan */}
                                    <div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const message = `Hi ${patient.name}, here is your personalized diet plan for your recovery: https://smartclinic.com/diet/${patient.id}. Please follow it strictly!`;
                                                window.open(`https://wa.me/910000000000?text=${encodeURIComponent(message)}`, '_blank');
                                            }}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                                                background: '#E8F5E9', color: '#2E7D32', border: '1px solid #C8E6C9', borderRadius: '8px',
                                                fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
                                                textTransform: 'uppercase'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = '#2E7D32';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = '#E8F5E9';
                                                e.currentTarget.style.color = '#2E7D32';
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.3-.149-1.774-.875-2.048-.976-.275-.1-.475-.149-.675.149-.2.299-.775.976-.949 1.176-.175.199-.35.225-.65.075-.3-.149-1.266-.466-2.411-1.487-.891-.795-1.492-1.777-1.667-2.076-.175-.299-.019-.461.13-.609.135-.133.3-.349.45-.525.15-.175.2-.299.3-.499.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.594-.509-.512-.697-.521-.18-.009-.387-.011-.593-.011-.206 0-.542.077-.825.385-.283.308-1.079 1.054-1.079 2.571 0 1.517 1.104 2.981 1.254 3.181.15.2 2.173 3.318 5.263 4.654.736.317 1.311.507 1.758.649.74.234 1.413.201 1.945.122.593-.088 1.774-.725 2.024-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z" /></svg>
                                            Refer Diet
                                        </button>
                                    </div>

                                    {/* Visits & Follow-up */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 800, textTransform: 'uppercase' }}>{visitType}</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>{lastVisit}</div>
                                        <button
                                            onClick={(e) => e.stopPropagation()}
                                            style={{
                                                marginTop: '4px', background: 'white', border: '1px solid #E5E7EB',
                                                borderRadius: '6px', padding: '6px 12px', fontSize: '0.75rem',
                                                fontWeight: 800, color: '#666', cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', gap: '6px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.borderColor = '#999'}
                                            onMouseOut={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                                        >
                                            <Calendar size={12} /> Reschedule
                                        </button>
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
