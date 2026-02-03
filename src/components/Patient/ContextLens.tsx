import React from 'react';
import { AlertCircle, Activity, Pill } from 'lucide-react';
import { Patient } from '@/data/patients';
import styles from './Patient.module.css';

export default function ContextLens({ patient }: { patient: Patient }) {
    return (
        <div className={styles.contextLens}>
            {/* Red Flags */}
            <div className={styles.lensSection}>
                <div className={styles.lensHeader}>
                    <AlertCircle size={18} color="#D32F2F" />
                    <span className={styles.lensTitle} style={{ color: '#D32F2F' }}>Red Flags</span>
                </div>
                <ul className={styles.lensList}>
                    {patient.redFlags.length > 0 ? (
                        patient.redFlags.map((flag, i) => <li key={i}>{flag}</li>)
                    ) : (
                        <li className={styles.emptyState}>No critical alerts</li>
                    )}
                </ul>
            </div>

            {/* Care Gaps */}
            <div className={styles.lensSection}>
                <div className={styles.lensHeader}>
                    <Activity size={18} color="#00B6C1" />
                    <span className={styles.lensTitle} style={{ color: '#00B6C1' }}>Care Gaps</span>
                </div>
                <ul className={styles.lensList}>
                    {patient.careGaps.length > 0 ? (
                        patient.careGaps.map((gap, i) => <li key={i}>{gap}</li>)
                    ) : (
                        <li className={styles.emptyState}>No gaps detected</li>
                    )}
                </ul>
            </div>

            {/* Med Deltas */}
            <div className={styles.lensSection}>
                <div className={styles.lensHeader}>
                    <Pill size={18} color="#F59E0B" />
                    <span className={styles.lensTitle} style={{ color: '#F59E0B' }}>Med Deltas</span>
                </div>
                <ul className={styles.lensList}>
                    {patient.medDeltas.length > 0 ? (
                        patient.medDeltas.map((delta, i) => <li key={i}>{delta}</li>)
                    ) : (
                        <li className={styles.emptyState}>Meds up to date</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
