'use client';

import React, { useState } from 'react';
import { Patient } from '@/data/patients';
import { History, ClipboardList, Activity, Target, Save, Clock, Pill } from 'lucide-react';
import styles from './Patient.module.css';
import { useSpecialty } from '@/context/SpecialtyContext';

export default function SmartSoapNote({ patient }: { patient: Patient }) {
    const { specialty } = useSpecialty();

    const defaultNote = `PRESENTING COMPLAINT: ${patient.reasonForVisit}\n\nCLINICAL OBSERVATIONS:\n${patient.intakeSummary}\n\nCARDIAC ASSESSMENT:\nBP: ${patient.vitals?.bps}/${patient.vitals?.bpd} mmHg | HR: ${patient.vitals?.heartRate} bpm | SpO2: ${patient.vitals?.spo2}%\n\nDIRECTIVES & IMPRESSION:\n${patient.riskLevel === 'Critical' ? "High-risk cardiac profile. Immediate intervention suggested." : "Stable cardiac hemodynamic profile."}`;

    const [clinicalNote, setClinicalNote] = useState(defaultNote);
    const [isSaving, setIsSaving] = useState(false);
    const [prescriptions, setPrescriptions] = useState<string[]>(patient.medications?.new || []);

    const historicalNotes = [
        { date: '12 Jan 2025', entry: 'Patient followed up for HTN control. BP 138/88. Adherence to Telmisartan confirmed. Mild fatigue reported. ECG was NSR.', title: 'Follow Up Detail', status: 'Follow-up Done', timestamp: '2025-01-12 10:43:48' },
        { date: '04 Nov 2024', entry: 'Initial consultation post-palpitations. ECG shows occasional PACs. Advised stress management and holter monitoring. Started low-dose Metoprolol.', title: 'Initial Assessment', status: 'Consultation Complete', timestamp: '2024-11-04 15:15:27' }
    ];

    const handleQuickPrescribe = (med: string) => {
        if (!prescriptions.includes(med)) {
            setPrescriptions(prev => [...prev, med]);
            setClinicalNote(prev => prev.trim() ? prev + `\n\nADDED DAWAI: ${med}` : `ADDED DAWAI: ${med}`);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch(`/api/patients/${patient.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clinicalNote: clinicalNote,
                    medications: { ...patient.medications, new: prescriptions }
                })
            });
            setTimeout(() => {
                setIsSaving(false);
                alert("Clinical history updated successfully.");
            }, 800);
        } catch (error) {
            console.error("Sync failed:", error);
            setIsSaving(false);
        }
    };

    const quickMeds = specialty?.orderingShortcuts.filter(s => s.type === 'Medication') || [];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' }}>
            <div style={{ position: 'relative', paddingLeft: '50px' }}>
                {/* Unified Timeline Line */}
                <div style={{
                    position: 'absolute', left: '12px', top: '15px', bottom: '40px',
                    width: '4px', background: '#22C55E', borderRadius: '4px'
                }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                    {/* ACTIVE ENTRY NODE (Today's Card) */}
                    <div style={{ position: 'relative' }}>
                        {/* Timeline Node - Active Pulsing Node */}
                        <div style={{
                            position: 'absolute', left: '-50px', top: '2px',
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: '#22C55E', border: '5px solid #DCFCE7',
                            zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />
                        </div>

                        {/* Active Consultation Card */}
                        <div style={{
                            background: 'white', borderRadius: '24px', border: '1px solid #22C55E',
                            boxShadow: '0 12px 30px -5px rgba(34, 197, 94, 0.15)', overflow: 'hidden',
                            maxWidth: '1000px'
                        }}>
                            <div style={{ padding: '24px 32px', background: '#F0FDFA', borderBottom: '1px solid #DCFCE7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Activity size={18} color="#059669" />
                                        <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#064E3B', fontWeight: 800 }}>Active Consultation</h2>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>Today • Session in progress</span>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    style={{
                                        padding: '12px 28px', borderRadius: '12px', background: '#22C55E', color: 'white',
                                        border: 'none', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center',
                                        gap: '8px', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                                    }}
                                >
                                    <Save size={18} /> {isSaving ? 'Syncing...' : 'Sync Entry'}
                                </button>
                            </div>

                            <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: '32px' }}>
                                <textarea
                                    value={clinicalNote}
                                    onChange={(e) => setClinicalNote(e.target.value)}
                                    placeholder="Enter clinical observations, heart sounds, and therapeutic plan..."
                                    style={{
                                        width: '100%', height: '340px', padding: '24px', borderRadius: '16px',
                                        border: '1px solid #E2E8F0', background: '#FAFBFB', fontSize: '1rem',
                                        color: '#1E293B', lineHeight: '1.6', fontFamily: 'inherit', resize: 'none', outline: 'none'
                                    }}
                                />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ padding: '20px', background: '#F0FDFA', borderRadius: '16px', border: '1px solid #CCFBF1' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                            <ClipboardList size={18} color="#0D9488" />
                                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0F766E', textTransform: 'uppercase' }}>One-Click Rx</span>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {quickMeds.map((med: any) => (
                                                <button
                                                    key={med.id}
                                                    onClick={() => handleQuickPrescribe(med.label)}
                                                    style={{
                                                        padding: '7px 11px', borderRadius: '8px', background: 'white',
                                                        border: '1px solid #99F6E4', fontSize: '0.72rem', fontWeight: 700,
                                                        color: '#0D9488', cursor: 'pointer'
                                                    }}
                                                >+ {med.label.split(' ')[0]}</button>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '10px' }}>Session Meds</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {prescriptions.map((p, i) => (
                                                <div key={i} style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Pill size={12} color="#0D9488" />
                                                    {p}
                                                </div>
                                            ))}
                                            {prescriptions.length === 0 && <span style={{ fontSize: '0.75rem', color: '#CBD5E1', fontStyle: 'italic' }}>None listed</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HISTORICAL TIMELINE NODES */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        {historicalNotes.map((note, idx) => (
                            <div key={idx} style={{ position: 'relative' }}>
                                {/* Historical Node */}
                                <div style={{
                                    position: 'absolute', left: '-50px', top: '15px',
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    background: 'white', border: '4px solid #BBF7D0',
                                    zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }} />
                                </div>

                                <div style={{
                                    padding: '24px 32px', background: 'white', borderRadius: '24px',
                                    border: '1px solid #E2E8F0', boxShadow: '0 4px 15px -3px rgba(0,0,0,0.04)',
                                    maxWidth: '900px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div>
                                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>{note.title}</div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22C55E', marginTop: '2px' }}>{note.status}</div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.85rem', fontWeight: 700 }}>
                                            <Clock size={14} /> {note.date}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.95rem', color: '#475569', lineHeight: '1.7', fontWeight: 500 }}>
                                        {note.entry}
                                    </div>
                                    <div style={{ marginTop: '16px', fontSize: '0.8rem', fontWeight: 700, color: '#CBD5E1' }}>
                                        {note.timestamp}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
