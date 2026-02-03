import React from 'react';
import Link from 'next/link';
import { Patient } from '@/data/patients';
import styles from './Dashboard.module.css';

interface PatientCardProps {
    patient: Patient;
}

export default function PatientCard({ patient }: PatientCardProps) {
    // Map risk level to global CSS classes
    const riskBadgeClass = patient.riskLevel === 'Critical'
        ? styles.critical // Mapping issue: The globals define .badge-risk-critical but CSS modules hash names. 
        // Better to use global classes or specific module classes.
        // Let's use the global class names but since this is CSS modules, we should probably stick to modules.
        // OR, I can use a utility function.
        // I'll update the module css to include these or simply use valid className strings if I import globals.
        // But I'm using CSS modules. Let's rely on the badged classes I added to globals.css and use standard class strings.
        : patient.riskLevel === 'Monitor'
            ? 'badge-risk-monitor'
            : 'badge-risk-stable';

    // Actually, to use global classes in a CSS module file, I'd need :global. 
    // But here I'm applying classes directly. 
    // Let's just use the string literal since those are defined in globals.css which is imported in layout.

    return (
        <Link href={`/patient/${patient.id}`} style={{ textDecoration: 'none' }}>
            <div className={styles.patientCard}>
                <div className={styles.cardHeader}>
                    <span className={styles.time}>{patient.time}</span>
                    {/* Using global class for badges */}
                    <span className={`badge ${riskBadgeClass === 'badge-risk-critical' ? 'badge-risk-critical' : riskBadgeClass === 'badge-risk-monitor' ? 'badge-risk-monitor' : 'badge-risk-stable'}`}>
                        {patient.riskLevel}
                    </span>
                </div>

                <div>
                    <h3 className={styles.name}>{patient.name}</h3>
                    <p className={styles.details}>{patient.age}y / {patient.gender}</p>
                </div>

                <div className={styles.footer}>
                    <span className={styles.reason}>{patient.reasonForVisit}</span>
                </div>
            </div>
        </Link>
    );
}
