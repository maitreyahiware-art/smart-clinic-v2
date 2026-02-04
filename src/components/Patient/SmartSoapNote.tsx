'use client';

import React, { useState } from 'react';
import { Patient } from '@/data/patients';
import { User, Stethoscope, FileText, ClipboardList } from 'lucide-react';
import styles from './Patient.module.css';
import { useSpecialty } from '@/context/SpecialtyContext';

export default function SmartSoapNote({ patient }: { patient: Patient }) {
    const { specialty } = useSpecialty();

    // Pre-fill logic (Simulated Smart Templates)
    const initialSubjective = specialty?.soapTemplate.subjective
        ? `${specialty.soapTemplate.subjective}\n\nREASON: ${patient.reasonForVisit}\nINTAKE: ${patient.intakeSummary}`
        : `${patient.reasonForVisit}. ${patient.intakeSummary}`;

    const vitalsStr = patient.vitals
        ? `Vitals: BP ${patient.vitals.bps}/${patient.vitals.bpd}, HR ${patient.vitals.heartRate}, Temp ${patient.vitals.temp}F, SpO2 ${patient.vitals.spo2}%.`
        : "Vitals: BP 120/80, HR 72, Temp 98.6F.";

    const initialObjective = specialty?.soapTemplate.objective
        ? `${specialty.soapTemplate.objective}\n\nACTUAL VITALS: ${vitalsStr}`
        : `${vitalsStr} Gen: NAD. Resp: CTAB. CV: RRR.`;

    const initialAssessment = specialty?.soapTemplate.assessment
        ? specialty.soapTemplate.assessment
        : (patient.riskLevel === 'Critical' ? "Uncontrolled condition requiring intervention." : "Stable.");

    const initialPlan = specialty?.soapTemplate.plan
        ? specialty.soapTemplate.plan
        : "1. Continue current meds.\n2. Follow up in 3 months.";

    const [subjective, setSubjective] = useState(initialSubjective);
    const [objective, setObjective] = useState(initialObjective);
    const [assessment, setAssessment] = useState(initialAssessment);
    const [plan, setPlan] = useState(initialPlan);
    const [isSaving, setIsSaving] = useState(false);
    const [prescriptions, setPrescriptions] = useState<string[]>(patient.medications?.new || []);

    const handleQuickPrescribe = (med: string) => {
        if (!prescriptions.includes(med)) {
            setPrescriptions(prev => [...prev, med]);
            setPlan(prev => prev.trim() ? prev + `\n- Prescribed Dawai: ${med}` : `- Prescribed Dawai: ${med}`);
        }
    };

    const clearPrescriptions = () => {
        setPrescriptions([]);
        setPlan(initialPlan);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch(`/api/patients/${patient.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    intakeSummary: subjective,
                    medications: {
                        ...patient.medications,
                        new: prescriptions
                    }
                })
            });
            setTimeout(() => {
                setIsSaving(false);
                alert("Clinical Record synchronized successfully.");
            }, 800);
        } catch (error) {
            console.error("Save failed:", error);
            setIsSaving(false);
        }
    };

    const quickMeds = specialty?.orderingShortcuts.filter(s => s.type === 'Medication' || s.type === 'Imaging' || s.type === 'Lab' || s.id.includes('med')) || [
        { id: 'aspirin', label: 'Aspirin 81mg' },
        { id: 'atorva', label: 'Atorvastatin 40mg' },
        { id: 'meto', label: 'Metoprolol 25mg' }
    ];

    return (
        <div className={styles.soapContainer} style={{ background: 'var(--color-white)', borderRadius: '24px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
            <div className={styles.soapHeader} style={{ padding: '24px 32px', background: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border)' }}>
                <div>
                    <span className={styles.soapTitle} style={{ fontSize: '1.25rem', color: 'var(--color-brand-secondary)' }}>Cardiology Clinical Note</span>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>AI-Assisted Documentation Engine</div>
                </div>
                <button
                    className="btn-primary"
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{
                        padding: '12px 24px',
                        fontSize: '0.9rem',
                        borderRadius: '12px',
                        background: '#0D9488',
                        border: 'none',
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(13, 148, 136, 0.2)'
                    }}
                >
                    {isSaving ? 'Synchronizing...' : 'Sync & Close'}
                </button>
            </div>

            <div className={styles.soapBody} style={{ padding: '32px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div className={styles.soapSection}>
                        <div className={styles.soapLabel} style={{ color: '#00B6C1', fontWeight: 800 }}>
                            <User size={18} /> SUBJECTIVE
                        </div>
                        <textarea
                            className={styles.soapTextarea}
                            value={subjective}
                            onChange={(e) => setSubjective(e.target.value)}
                            style={{ height: '140px', borderRadius: '16px', background: '#F8FAFC' }}
                        />
                    </div>

                    <div className={styles.soapSection}>
                        <div className={styles.soapLabel} style={{ color: '#00B6C1', fontWeight: 800 }}>
                            <Stethoscope size={18} /> OBJECTIVE
                        </div>
                        <textarea
                            className={styles.soapTextarea}
                            value={objective}
                            onChange={(e) => setObjective(e.target.value)}
                            style={{ height: '140px', borderRadius: '16px', background: '#F8FAFC' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px', marginTop: '24px' }}>
                    <div className={styles.soapSection}>
                        <div className={styles.soapLabel} style={{ color: '#00B6C1', fontWeight: 800 }}>
                            <FileText size={18} /> ASSESSMENT & PLAN
                        </div>
                        <textarea
                            className={styles.soapTextarea}
                            value={`${assessment}\n\nPLAN:\n${plan}`}
                            onChange={(e) => setPlan(e.target.value)}
                            style={{ height: '200px', borderRadius: '16px', background: '#F8FAFC' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ padding: '24px', background: '#F0FDFA', borderRadius: '20px', border: '1px solid #CCFBF1' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <ClipboardList size={20} color="#0D9488" />
                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F766E' }}>One-Click Dawai</h4>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {quickMeds.map((med: any) => (
                                    <button
                                        key={med.id}
                                        onClick={() => handleQuickPrescribe(med.label)}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            background: 'white',
                                            border: '1px solid #99F6E4',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            color: '#0D9488',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => (e.currentTarget.style.background = '#F0FDFA')}
                                        onMouseOut={e => (e.currentTarget.style.background = 'white')}
                                    >
                                        + {med.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ padding: '24px', background: 'var(--color-bg-primary)', borderRadius: '20px', border: '1px solid var(--color-border)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>PENDING DAWAI</div>
                                {prescriptions.length > 0 && (
                                    <button
                                        onClick={clearPrescriptions}
                                        style={{ fontSize: '0.7rem', color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {prescriptions.map((p, i) => (
                                    <div key={i} style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-brand-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0D9488' }}></div>
                                        {p}
                                    </div>
                                ))}
                                {prescriptions.length === 0 && <div style={{ fontSize: '0.85rem', color: '#999', fontStyle: 'italic' }}>No dawai added yet</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
