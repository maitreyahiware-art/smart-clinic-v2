import React from 'react';
import { patients } from '@/data/patients';
import PatientCard from './PatientCard';
import styles from './Dashboard.module.css';
import { AlertTriangle } from 'lucide-react';

export default function AgendaList() {
    return (
        <div className={styles.agendaSection}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Today's Agenda</h2>
                <button className="btn-secondary" style={{ borderColor: '#d32f2f', color: '#d32f2f', fontSize: '0.85rem', padding: '8px 16px', borderRadius: '24px' }}>
                    <AlertTriangle size={16} /> Emergency Pivot
                </button>
            </div>
            <div className={styles.grid}>
                {patients.map(patient => (
                    <PatientCard key={patient.id} patient={patient} />
                ))}
            </div>
        </div>
    );
}
