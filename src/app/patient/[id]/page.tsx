'use client';

import React, { useState, use } from 'react';
import { patients } from '@/data/patients';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ContextLens from '@/components/Patient/ContextLens';
import SmartSoapNote from '@/components/Patient/SmartSoapNote';
import DispositionPanel from '@/components/Patient/DispositionPanel';
import ActionRegistry from '@/components/Patient/ActionRegistry';
import { notFound } from 'next/navigation';
import { Activity, Clock, User, Info, Pill, GraduationCap, Brain, TrendingUp, History, ClipboardCheck, Layout, ListChecks, FileText, Upload } from 'lucide-react';

export default function PatientPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const patient = patients.find(p => p.id === params.id);
    const [activeTab, setActiveTab] = useState<'consult' | 'intelligence' | 'meds'>('consult');

    if (!patient) {
        notFound();
    }

    const handleUploadClick = () => {
        window.open('https://bn-medical-reports-analyzer.vercel.app/', '_blank');
    };

    return (
        <DashboardLayout>
            <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>

                {/* 🏷️ Minimalist Patient Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '20px',
                            background: patient.riskLevel === 'Critical' ? '#EF4444' : '#00B6C1',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '2rem', fontWeight: 800
                        }}>
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>{patient.name}</h1>
                                <span style={{
                                    padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 800,
                                    background: patient.riskLevel === 'Critical' ? '#FEE2E2' : '#F0FDFA',
                                    color: patient.riskLevel === 'Critical' ? '#B91C1C' : '#0F766E'
                                }}>
                                    {patient.riskLevel.toUpperCase()} RISK
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '20px', color: '#64748B', fontSize: '0.95rem', marginTop: '4px' }}>
                                <span>{patient.gender}, {patient.age}y</span>
                                <span>•</span>
                                <span>ID: {patient.id.padStart(4, '0')}</span>
                                <span>•</span>
                                <span>Visit: {patient.time}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <button
                            onClick={handleUploadClick}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 20px', borderRadius: '12px',
                                background: 'white', color: '#00B6C1',
                                border: '2px solid #00B6C1', fontWeight: 700,
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                            onMouseOver={e => {
                                (e.currentTarget as any).style.background = '#00B6C1';
                                (e.currentTarget as any).style.color = 'white';
                            }}
                            onMouseOut={e => {
                                (e.currentTarget as any).style.background = 'white';
                                (e.currentTarget as any).style.color = '#00B6C1';
                            }}
                        >
                            <Upload size={18} /> Upload Prescription
                        </button>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Current Primary Reason</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1E293B' }}>{patient.reasonForVisit.split(':')[0]}</div>
                        </div>
                    </div>
                </div>

                {/* 🛡️ Context Lens (Always Visible for Clinical Safety) */}
                <ContextLens patient={patient} />

                {/* 📑 Tab Navigation - The "Un-Crowder" */}
                <div style={{ display: 'flex', gap: '32px', borderBottom: '1px solid #E2E8F0', paddingBottom: '2px' }}>
                    {[
                        { id: 'consult', label: 'Clinical Note', icon: FileText },
                        { id: 'intelligence', label: 'AI & History', icon: Brain },
                        { id: 'meds', label: 'Med Reconciliation', icon: Pill }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '12px 4px', border: 'none', background: 'transparent',
                                borderBottom: activeTab === tab.id ? '2px solid #00B6C1' : '2px solid transparent',
                                color: activeTab === tab.id ? '#00B6C1' : '#64748B',
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
                                <DispositionPanel patient={patient} />
                                <ActionRegistry patientId={patient.id} />
                            </div>
                        </div>
                    )}

                    {/* AI Intelligence Tab */}
                    {activeTab === 'intelligence' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ background: '#0F172A', borderRadius: '24px', padding: '32px', color: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <Brain size={24} color="#00B6C1" />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Medical Copilot</h3>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <p style={{ fontSize: '1.1rem', lineHeight: '1.6', opacity: 0.9, margin: 0 }}>
                                        {patient.riskLevel === 'Critical'
                                            ? "BP trend indicates failure of monotherapy. Evidence-based guidelines suggest adding a calcium channel blocker or GLP-1 transition."
                                            : "Standard recovery path detected. Advise routine annual screening protocols."}
                                    </p>
                                </div>
                                <div style={{ marginTop: '20px', fontSize: '0.85rem', opacity: 0.6, display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Source: ACC/AHA 2024 Guidelines</span>
                                    <span>Confidence: 98.2%</span>
                                </div>
                            </div>

                            <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                    <History size={24} color="#6366F1" />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B' }}>Clinical Journey</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {[
                                        { date: 'Jan 15, 2026', event: 'Cardiology Referral', detail: 'Pending Specialist Clearance' },
                                        { date: 'Dec 10, 2025', event: 'Hyperlipidemia Dx', detail: 'Lipitor therapy initiated' },
                                        { date: 'Oct 05, 2025', event: 'Initial Onboarding', detail: 'Baseline vitals' },
                                    ].map((step, i) => (
                                        <div key={i} style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid #F1F5F9' }}>
                                            <div style={{ position: 'absolute', left: '-6px', top: '4px', width: '10px', height: '10px', borderRadius: '50%', background: '#6366F1', border: '2px solid white' }}></div>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8' }}>{step.date}</div>
                                            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B' }}>{step.event}</div>
                                            <div style={{ fontSize: '0.85rem', color: '#64748B' }}>{step.detail}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Medication Reconciliation Tab */}
                    {activeTab === 'meds' && (
                        <div style={{ background: 'white', borderRadius: '24px', padding: '40px', border: '1px solid #E2E8F0', animation: 'fadeIn 0.3s ease' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                                <Pill size={24} color="#0D9488" />
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B' }}>Prescription Reconciliation</h3>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
                                <div>
                                    <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '16px' }}>Current Regimen</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {patient.medications?.current.map((med, i) => (
                                            <div key={i} style={{ padding: '16px', background: '#F8FAFC', borderRadius: '12px', color: '#475569', border: '1px solid #F1F5F9' }}>{med}</div>
                                        ))}
                                    </div>
                                </div>
                                <div style={{ borderLeft: '2px dashed #E2E8F0', paddingLeft: '48px' }}>
                                    <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0D9488', textTransform: 'uppercase', marginBottom: '16px' }}>Proposed Changes</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {patient.medications?.new?.map((med, i) => (
                                            <div key={i} style={{ padding: '16px', background: '#F0FDFA', borderRadius: '12px', color: '#065F46', border: '1px solid #CCFBF1', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{med}</span>
                                                <span style={{ fontSize: '0.65rem', background: '#0D9488', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>NEW</span>
                                            </div>
                                        ))}
                                    </div>
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
