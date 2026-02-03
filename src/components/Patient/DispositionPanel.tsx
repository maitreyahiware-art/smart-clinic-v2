'use client';

import React from 'react';
import Link from 'next/link';
import { Printer, ArrowUpRight } from 'lucide-react';
import { Patient } from '@/data/patients';
import styles from './Patient.module.css';

export default function DispositionPanel({ patient }: { patient: Patient }) {
    return (
        <div className={styles.dispoContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px' }}>
                <h3 className={styles.dispoTitle} style={{ marginBottom: 0, border: 'none', padding: 0 }}>Active Orders</h3>
                <Link href={`/prescriptions?patientId=${patient.id}`} style={{
                    fontSize: '0.85rem',
                    color: 'white',
                    background: 'var(--color-brand-primary)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    textDecoration: 'none',
                    fontWeight: 500,
                    transition: 'all 0.2s'
                }}>
                    Open Rx Writer <ArrowUpRight size={14} />
                </Link>
            </div>

            <div className={styles.orderList}>
                {patient.medications?.new?.map((med, i) => (
                    <div key={i} className={styles.orderItem} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                        <div style={{ fontWeight: 500 }}>{med}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            Prescribed recently
                        </div>
                    </div>
                ))}
                {(!patient.medications?.new || patient.medications.new.length === 0) && (
                    <div className={styles.emptyState}>No active orders for this visit yet.</div>
                )}
            </div>

            {/* Actions */}
            <div className={styles.actionArea}>
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Printer size={18} /> Print Visit Summary
                </button>
            </div>
        </div>
    );
}
