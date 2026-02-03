'use client';

import React, { Suspense, useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import EnhancedPrescriptionWriter from '@/components/Prescription/EnhancedPrescriptionWriter';
import { patients } from '@/data/patients';
import { useSearchParams } from 'next/navigation';
import { Search, Bell, AlertCircle, Activity, Info, FileText, Printer, MoreVertical, TrendingUp, Clock, User } from 'lucide-react';

function PrescriptionContent() {
    const searchParams = useSearchParams();
    const patientId = searchParams.get('patientId');
    const patient = patients.find(p => p.id === patientId) || patients[0];

    const [showRxWriter, setShowRxWriter] = useState(false);
    const [subjective, setSubjective] = useState(`Follow-up: Diabetes Type 2. Patient reports increased thirst, polyuria, and fatigue. Monitors BG sporadically. High work stress. Diet compliance poor.`);
    const [objective, setObjective] = useState(`Vitals: BP 120/80, HR 72, Temp 98.6F. Gen: NAD. Resp: CTAB. CV: RRR.`);

    if (showRxWriter) {
        return (
            <div style={{ padding: '24px' }}>
                <button
                    onClick={() => setShowRxWriter(false)}
                    style={{ marginBottom: '20px', padding: '10px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <FileText size={18} /> Back to Patient Summary
                </button>
                <EnhancedPrescriptionWriter
                    patientId={patient.id}
                    patientName={patient.name}
                    patientAge={patient.age}
                    patientGender={patient.gender}
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '32px', minHeight: '100vh', background: '#F8FAF7' }}>
            {/* Header / Search Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ position: 'relative', width: '400px' }}>
                    <Search style={{ position: 'absolute', left: '16px', top: '12px', color: '#94A3B8' }} size={20} />
                    <input
                        type="text"
                        placeholder="Search patients, meds, protocols..."
                        style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '99px', border: '1px solid #E2E8F0', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>EPPD</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B' }}>18 <span style={{ color: '#10B981', fontSize: '14px' }}>↑</span></div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVG TIME</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B' }}>12m</div>
                    </div>
                    <button style={{ background: 'transparent', border: 'none', color: '#00B6C1', cursor: 'pointer', position: 'relative' }}>
                        <Bell size={24} />
                        <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', border: '2px solid white' }}></span>
                    </button>
                </div>
            </div>

            {/* Patient Hero Header */}
            <div style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #F1F5F9', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, #00B6C1 0%, #008B9A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '2rem', fontWeight: 800 }}>
                        {patient.name.charAt(0)}
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#134E4A', margin: 0 }}>{patient.name}</h1>
                            <span style={{ padding: '4px 12px', background: '#FEF2F2', color: '#EF4444', borderRadius: '99px', fontSize: '12px', fontWeight: 800, border: '1px solid #FEE2E2' }}>HIGH RISK</span>
                        </div>
                        <div style={{ display: 'flex', gap: '24px', color: '#64748B', fontSize: '1.1rem', fontWeight: 500 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> {patient.gender}, {patient.age}y</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={18} /> ID: {patient.id.toUpperCase()}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} /> Last Visit: Jan 15, 2026</div>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ textAlign: 'right', padding: '0 24px', borderRight: '1px solid #F1F5F9' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Blood Group</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#134E4A' }}>O+ Positive</div>
                    </div>
                    <div style={{ textAlign: 'right', paddingLeft: '24px' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Primary Condition</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#134E4A' }}>Diabetes Type 2</div>
                    </div>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Analysis Cards Area */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {/* Red Flags */}
                        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444', marginBottom: '16px' }}>
                                <AlertCircle size={20} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Red Flags</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#334155', fontSize: '0.9rem' }}>
                                <div>Last A1c 8.2% (↑1.5%)</div>
                                <div>BP 160/95 verified</div>
                                <div>Microalbuminuria detected</div>
                            </div>
                        </div>

                        {/* Care Gaps */}
                        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00B6C1', marginBottom: '16px' }}>
                                <Activity size={20} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Care Gaps</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#334155', fontSize: '0.9rem' }}>
                                <div>Missed Ophth Exam (6mo overdue)</div>
                                <div>Flu Shot overdue</div>
                                <div>Diabetic foot exam pending</div>
                            </div>
                        </div>

                        {/* Med Deltas */}
                        <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F59E0B', marginBottom: '16px' }}>
                                <TrendingUp size={20} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Med Deltas</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#334155', fontSize: '0.9rem' }}>
                                <div>Metformin refill due</div>
                                <div>Started self-monitoring</div>
                            </div>
                        </div>
                    </div>

                    {/* Smart Note Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#134E4A' }}>Smart Note (Draft)</h2>
                            <span style={{ padding: '4px 12px', background: '#E0F2FE', color: '#0369A1', borderRadius: '99px', fontSize: '11px', fontWeight: 800 }}>AUTO-SAVED</span>
                        </div>

                        <div style={{ background: 'white', borderRadius: '20px', padding: '32px', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00B6C1', marginBottom: '12px' }}>
                                    <User size={18} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Subjective</span>
                                </div>
                                <textarea
                                    value={subjective}
                                    onChange={(e) => setSubjective(e.target.value)}
                                    style={{ width: '100%', padding: '0', border: 'none', background: 'transparent', resize: 'none', minHeight: '100px', fontSize: '1.1rem', color: '#334155', lineHeight: '1.6', outline: 'none' }}
                                />
                            </div>

                            <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '32px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00B6C1', marginBottom: '12px' }}>
                                    <Activity size={18} />
                                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Objective</span>
                                </div>
                                <textarea
                                    value={objective}
                                    onChange={(e) => setObjective(e.target.value)}
                                    style={{ width: '100%', padding: '0', border: 'none', background: 'transparent', resize: 'none', minHeight: '100px', fontSize: '1.1rem', color: '#334155', lineHeight: '1.6', outline: 'none' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Active Orders Card */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#134E4A' }}>Active Orders</h3>
                            <button
                                onClick={() => setShowRxWriter(true)}
                                style={{ background: '#00B6C1', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                Open Rx Writer ↗
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ background: '#F8FAF7', padding: '16px', borderRadius: '12px', border: '1px solid #ECF2ED' }}>
                                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#134E4A' }}>Metformin 850mg BD</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Prescribed recently</div>
                            </div>
                            <div style={{ background: '#F8FAF7', padding: '16px', borderRadius: '12px', border: '1px solid #ECF2ED' }}>
                                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#134E4A' }}>Atorvastatin 10mg HS</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Prescribed recently</div>
                            </div>
                        </div>

                        <button style={{ width: '100%', marginTop: '32px', padding: '14px', borderRadius: '12px', border: '2px solid #00B6C1', background: 'white', color: '#00B6C1', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <Printer size={18} /> Print Visit Summary
                        </button>
                    </div>

                    {/* Recent Lab Trends Card */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #F1F5F9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#134E4A' }}>Lab Trends</h3>
                            <span style={{ fontSize: '10px', color: '#64748B' }}>Last 3 months</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>HbA1c</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#EF4444' }}>8.2 %</span>
                                </div>
                                <div style={{ height: '4px', background: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ width: '82%', height: '100%', background: '#EF4444' }}></div>
                                </div>
                            </div>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>LDL Chol</span>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10B981' }}>95 mg/dL</span>
                                </div>
                                <div style={{ height: '4px', background: '#F1F5F9', borderRadius: '2px', overflow: 'hidden' }}>
                                    <div style={{ width: '45%', height: '100%', background: '#10B981' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Patient Context Card */}
                    <div style={{ background: '#134E4A', color: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 15px -3px rgba(19, 78, 74, 0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 800 }}>Quick Stats</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Active since 2024</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', opacity: 0.9 }}>
                            <div>Adherence: 88%</div>
                            <div>Risk Score: 7.4</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PrescriptionsPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <PrescriptionContent />
            </Suspense>
        </DashboardLayout>
    );
}
