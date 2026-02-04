'use client';

import React, { useState, useEffect, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { Patient } from '@/data/patients';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ContextLens from '@/components/Patient/ContextLens';
import SmartSoapNote from '@/components/Patient/SmartSoapNote';
import DispositionPanel from '@/components/Patient/DispositionPanel';
import ActionRegistry from '@/components/Patient/ActionRegistry';
import EnhancedPrescriptionWriter from '@/components/Prescription/EnhancedPrescriptionWriter';
import { notFound } from 'next/navigation';
import { Activity, Clock, User, Info, Pill, GraduationCap, Brain, TrendingUp, History, ClipboardCheck, Layout, ListChecks, FileText, Upload } from 'lucide-react';

export default function PatientPage(props: { params: Promise<{ id: string }> | { id: string } }) {
    // Robustly handle both Promise and sync params
    const resolvedParams = props.params instanceof Promise ? React.use(props.params) : props.params;
    const patientId = resolvedParams?.id;
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const initialTab = (searchParams.get('tab') as 'consult' | 'dawai' | 'diagnostics' | 'bnhealthscore') || 'consult';
    const [activeTab, setActiveTab] = useState<'consult' | 'dawai' | 'diagnostics' | 'bnhealthscore'>(initialTab);

    useEffect(() => {
        if (!patientId) return;
        const fetchPatient = async () => {
            try {
                const response = await fetch(`/api/patients/${patientId}`);
                const data = await response.json();
                if (data.error) {
                    notFound();
                } else {
                    setPatient(data);
                }
            } catch (error) {
                console.error("Failed to fetch patient:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [patientId]);

    const handleUploadClick = () => {
        window.open('https://bn-medical-reports-analyzer.vercel.app/', '_blank');
    };

    const handleUploadPrescriptionClick = () => {
        window.open('https://bn-medical-reports-analyzer.vercel.app/upload-prescription', '_blank');
    };

    if (loading) return <DashboardLayout><div style={{ padding: '40px', textAlign: 'center' }}>Synchronizing Cardiology Data...</div></DashboardLayout>;
    if (!patient) return null;

    return (
        <DashboardLayout>
            <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* 🏷️ Professional Patient Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div style={{
                            width: '90px', height: '90px', borderRadius: '24px',
                            background: patient.riskLevel === 'Critical' ? '#EF4444' : patient.riskLevel === 'High' ? '#F97316' : '#00B6C1',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '2.5rem', fontWeight: 800,
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }}>
                            {patient.name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--color-brand-secondary)', margin: 0, letterSpacing: '-0.02em' }}>{patient.name}</h1>
                                <span style={{
                                    padding: '6px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: 800,
                                    background: patient.riskLevel === 'Critical' ? '#FEE2E2' : patient.riskLevel === 'High' ? '#FFEDD5' : '#F0FDFA',
                                    color: patient.riskLevel === 'Critical' ? '#B91C1C' : patient.riskLevel === 'High' ? '#9A3412' : '#0F766E',
                                    border: '1px solid currentColor', opacity: 0.9
                                }}>
                                    {(patient.riskLevel || 'Stable').toUpperCase()} RISK
                                </span>
                            </div>

                            {/* Vitals Bar */}
                            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--color-bg-primary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                    <Activity size={14} color="#EF4444" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{patient.vitals?.bps || '120'}/{patient.vitals?.bpd || '80'}</span>
                                    <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>mmHg</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--color-bg-primary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                    <Clock size={14} color="#00B6C1" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{patient.vitals?.heartRate || '72'}</span>
                                    <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>bpm</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'var(--color-bg-primary)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                    <TrendingUp size={14} color="#0D9488" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{patient.vitals?.spo2 || '98'}%</span>
                                    <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>SpO2</span>
                                </div>
                                <div style={{ borderLeft: '1px solid var(--color-border)', height: '24px', margin: '0 8px' }}></div>
                                <div style={{ display: 'flex', gap: '12px', color: 'var(--color-text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                                    <span>{patient.gender || 'M'}, {patient.age || '40'}y</span>
                                    <span>•</span>
                                    <span>ID: {(patient.id || '0').padStart(4, '0')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button
                            onClick={handleUploadClick}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '12px 24px', borderRadius: '16px',
                                background: 'white', color: '#00B6C1',
                                border: '2px solid #00B6C1', fontWeight: 800,
                                cursor: 'pointer', transition: 'all 0.2s',
                                fontSize: '0.9rem'
                            }}
                        >
                            <Upload size={18} /> Upload Reports
                        </button>
                        <button
                            onClick={handleUploadPrescriptionClick}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '12px 24px', borderRadius: '16px',
                                background: '#00B6C1', color: 'white',
                                border: 'none', fontWeight: 800,
                                cursor: 'pointer', transition: 'all 0.2s',
                                fontSize: '0.9rem',
                                boxShadow: '0 4px 12px rgba(0, 182, 193, 0.2)'
                            }}
                        >
                            <FileText size={18} /> Upload Dawai
                        </button>
                    </div>
                </div>

                {/* 🛡️ Context Lens (Always Visible for Clinical Safety) */}
                <ContextLens patient={patient} />

                {/* 📑 Tab Navigation - The "Un-Crowder" */}
                <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid var(--color-border)', paddingBottom: '2px' }}>
                    {[
                        { id: 'consult', label: 'Clinical Note', icon: FileText },
                        { id: 'dawai', label: 'Dawai', icon: Pill },
                        { id: 'diagnostics', label: 'Diagnostics', icon: ClipboardCheck },
                        { id: 'bnhealthscore', label: 'BN Health Score', icon: TrendingUp }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '12px 4px', border: 'none', background: 'transparent',
                                borderBottom: activeTab === tab.id ? '2px solid #00B6C1' : '2px solid transparent',
                                color: activeTab === tab.id ? '#00B6C1' : 'var(--color-text-secondary)',
                                fontWeight: activeTab === tab.id ? 700 : 500,
                                fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <tab.icon size={18} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* 🖼️ Tab Content */}
                <div style={{ minHeight: '500px' }}>

                    {/* Consultation Tab */}
                    {activeTab === 'consult' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <SmartSoapNote patient={patient} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <DispositionPanel
                                    patient={patient}
                                    onOpenRxWriter={() => setActiveTab('dawai')}
                                />
                                <ActionRegistry patientId={patient.id || '0'} />
                            </div>
                        </div>
                    )}

                    {/* Dawai Tab */}
                    {activeTab === 'dawai' && (
                        <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            <EnhancedPrescriptionWriter
                                patientId={patient.id}
                                patientName={patient.name}
                                patientAge={patient.age}
                                patientGender={patient.gender}
                            />

                            <div style={{ background: 'var(--color-white)', borderRadius: '24px', padding: '40px', border: '1px solid var(--color-border)', marginTop: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                    <History size={24} color="#0D9488" />
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-brand-secondary)' }}>Historic Regimen</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                                    <div>
                                        <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '16px' }}>Verified Meds</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {patient.medications?.current.map((med: string, i: number) => (
                                                <div key={i} style={{ padding: '16px', background: 'var(--color-bg-primary)', borderRadius: '12px', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>{med}</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ borderLeft: '2px dashed var(--color-border)', paddingLeft: '48px' }}>
                                        <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0D9488', textTransform: 'uppercase', marginBottom: '16px' }}>Current Consult Rx</h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {patient.medications?.new?.map((med: string, i: number) => (
                                                <div key={i} style={{ padding: '16px', background: '#F0FDFA', borderRadius: '12px', color: '#0D9488', border: '1px solid #0D9488', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                                                    <span>{med}</span>
                                                    <span style={{ fontSize: '0.65rem', background: '#0D9488', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>NEW</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Diagnostics Tab */}
                    {activeTab === 'diagnostics' && (
                        <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {[
                                    { test: '2D Echo / Color Doppler', date: 'Jan 10, 2026', interpretation: 'Normal LV systolic function. Grade 1 Diastolic Dysfunction.', status: 'Normal' },
                                    { test: 'Troponin-I (High Sensitivity)', date: 'Feb 02, 2026', interpretation: 'Levels within physiological range. No acute coronary syndrome detected.', status: 'Normal' },
                                    { test: 'HbA1c & Lipid Profile', date: 'Jan 15, 2026', interpretation: 'Borderline LDL (112 mg/dL). HbA1c 6.1% (Pre-diabetic range).', status: 'Abnormal' },
                                    { test: 'ECG - 12 Lead', date: 'Feb 04, 2026', interpretation: 'Sinus Tachycardia noted. No ST-T changes.', status: 'Normal' }
                                ].map((report, i) => (
                                    <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid var(--color-border)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <div style={{ fontWeight: 800, color: 'var(--color-brand-secondary)', fontSize: '1.1rem' }}>{report.test}</div>
                                            <span style={{
                                                fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: '6px',
                                                background: report.status === 'Normal' ? '#D1FAE5' : report.status === 'Abnormal' ? '#FFEDD5' : '#FEE2E2',
                                                color: report.status === 'Normal' ? '#065F46' : report.status === 'Abnormal' ? '#9A3412' : '#991B1B'
                                            }}>{report.status.toUpperCase()}</span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '16px', fontWeight: 500 }}>{report.date}</div>
                                        <div style={{ padding: '16px', background: 'var(--color-bg-primary)', borderRadius: '12px', fontSize: '0.9rem', color: '#444', lineHeight: '1.5', borderLeft: '4px solid #00B6C1' }}>
                                            <strong>Interpretation:</strong> {report.interpretation}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* BN Health Score (Metabolic Scale) Tab */}
                    {activeTab === 'bnhealthscore' && (
                        <div style={{ animation: 'fadeIn 0.3s ease', background: 'white', borderRadius: '32px', padding: '40px', border: '1px solid var(--color-border)', boxShadow: '0 10px 25px rgba(0, 182, 193, 0.05)' }}>
                            {/* Inner Metabolic UI */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                {/* Metabolic Scale Header Toggles */}
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1px', background: '#f1f5f9', padding: '4px', borderRadius: '16px', width: 'fit-content', margin: '0 auto', border: '1px solid #e2e8f0' }}>
                                    {['HISTORICAL REGISTRY', 'METABOLIC SCALE', 'FINANCIAL RECORDS'].map((t, idx) => (
                                        <button key={t} style={{
                                            padding: '12px 24px', borderRadius: '14px', border: 'none',
                                            background: t === 'METABOLIC SCALE' ? 'white' : 'transparent',
                                            color: t === 'METABOLIC SCALE' ? '#0D9488' : '#64748b',
                                            fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.05em',
                                            boxShadow: t === 'METABOLIC SCALE' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                            cursor: 'pointer'
                                        }}>
                                            {t === 'METABOLIC SCALE' && <span style={{ marginRight: '8px' }}>⚖️</span>}
                                            {t}
                                        </button>
                                    ))}
                                </div>

                                {/* Main Stats Display */}
                                <div style={{
                                    background: '#f8fafc', borderRadius: '40px', padding: '60px 40px',
                                    display: 'flex', justifyContent: 'space-around', alignItems: 'center',
                                    border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden'
                                }}>
                                    {/* Weight Circle */}
                                    <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <svg width="220" height="220" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                                            <circle cx="50" cy="50" r="45" fill="none" stroke="#0D9488" strokeWidth="6" strokeDasharray="210 282" strokeLinecap="round" transform="rotate(-90 50 50)" />
                                        </svg>
                                        <div style={{ position: 'absolute', textAlign: 'center' }}>
                                            <div style={{ fontSize: '3rem', fontWeight: 900, color: '#1e293b', lineHeight: 1 }}>69.16</div>
                                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', marginTop: '4px', opacity: 0.6 }}>WEIGHT (KG)</div>
                                        </div>
                                    </div>

                                    {/* Middle Pill Details */}
                                    <div style={{ display: 'flex', gap: '16px' }}>
                                        <div style={{ background: 'white', padding: '24px 20px', borderRadius: '50px', width: '110px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '8px' }}>IDEAL<br />STATUS</div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#334155' }}>69.3</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', opacity: 0.8 }}>kg</div>
                                        </div>

                                        <div style={{ background: 'white', padding: '24px 20px', borderRadius: '50px', width: '110px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '8px' }}>BMI<br />SCORE</div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#334155' }}>12.3</div>
                                            <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: '6px', marginTop: '8px', display: 'inline-block' }}>NORMAL</span>
                                        </div>
                                    </div>

                                    {/* Verdict Pill */}
                                    <div style={{ background: 'white', padding: '32px 32px', borderRadius: '60px', textAlign: 'center', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ background: '#f0fdfa', padding: '12px', borderRadius: '20px', color: '#00B6C1' }}>
                                            <Activity size={32} />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#134e4a' }}>Normal</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.2em', marginTop: '4px' }}>SCALE VERDICT</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Grid of Metrics */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
                                    {[
                                        { label: 'BODY FAT', value: '4.8 %', icon: '⚡', color: '#0ea5e9' },
                                        { label: 'BODY WATER', value: '70 L', icon: '💧', color: '#3b82f6' },
                                        { label: 'BONE MASS', value: '2.5 kg', icon: '⚛️', color: '#8b5cf6' },
                                        { label: 'BMR', value: '1271 Kcal', icon: '🔥', color: '#f59e0b' },
                                        { label: 'VISCERAL FAT', value: '1', icon: '💓', color: '#ef4444' },
                                        { label: 'METABOLIC AGE', value: '18', icon: '⏱️', color: '#a855f7' }
                                    ].map((stat, i) => (
                                        <div key={i} style={{
                                            background: 'white', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '20px', textAlign: 'center',
                                            display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center'
                                        }}>
                                            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{stat.icon}</div>
                                            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#1e293b' }}>{stat.value}</div>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em' }}>{stat.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </DashboardLayout>
    );
}
