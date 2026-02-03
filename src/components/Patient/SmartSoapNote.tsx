'use client';

import React, { useState } from 'react';
import { Patient } from '@/data/patients';
import { User, Stethoscope, FileText, ClipboardList } from 'lucide-react';
import styles from './Patient.module.css';

export default function SmartSoapNote({ patient }: { patient: Patient }) {
    // Pre-fill logic (Simulated Smart Templates)
    const initialSubjective = `${patient.reasonForVisit}. ${patient.intakeSummary}`;

    const [subjective, setSubjective] = useState(initialSubjective);
    const [objective, setObjective] = useState("Vitals: BP 120/80, HR 72, Temp 98.6F. Gen: NAD. Resp: CTAB. CV: RRR.");
    const [assessment, setAssessment] = useState(patient.riskLevel === 'Critical' ? "Uncontrolled condition requiring intervention." : "Stable.");
    const [plan, setPlan] = useState("1. Continue current meds.\n2. Follow up in 3 months.");

    return (
        <div className={styles.soapContainer}>
            <div className={styles.soapHeader}>
                <span className={styles.soapTitle}>Smart Note (Draft)</span>
                <span className="badge badge-risk-stable" style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}>Auto-Saved</span>
            </div>

            <div className={styles.soapBody}>
                <div className={styles.soapSection}>
                    <div className={styles.soapLabel}>
                        <User size={16} /> Subjective
                    </div>
                    <textarea
                        className={styles.soapTextarea}
                        value={subjective}
                        onChange={(e) => setSubjective(e.target.value)}
                    />
                </div>

                <div className={styles.soapSection}>
                    <div className={styles.soapLabel}>
                        <Stethoscope size={16} /> Objective
                    </div>
                    <textarea
                        className={styles.soapTextarea}
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                    />
                </div>

                <div className={styles.soapSection}>
                    <div className={styles.soapLabel}>
                        <ClipboardList size={16} /> Assessment
                    </div>
                    <textarea
                        className={styles.soapTextarea}
                        value={assessment}
                        onChange={(e) => setAssessment(e.target.value)}
                    />
                </div>

                <div className={styles.soapSection}>
                    <div className={styles.soapLabel}>
                        <FileText size={16} /> Plan
                    </div>
                    <textarea
                        className={styles.soapTextarea}
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        style={{ minHeight: '120px' }}
                    />
                </div>
            </div>
        </div>
    );
}
