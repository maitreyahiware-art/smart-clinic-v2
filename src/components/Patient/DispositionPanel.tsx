'use client';

import React from 'react';
import Link from 'next/link';
import { Printer, ArrowUpRight } from 'lucide-react';
import { Patient } from '@/data/patients';
import styles from './Patient.module.css';
import { useSpecialty } from '@/context/SpecialtyContext';

export default function DispositionPanel({ patient, onOpenRxWriter }: { patient: Patient, onOpenRxWriter?: () => void }) {
    const { specialty } = useSpecialty();

    return (
        <div className={styles.dispoContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <h3 className={styles.dispoTitle} style={{ marginBottom: 0, border: 'none', padding: 0, color: 'var(--color-brand-secondary)' }}>Active Orders</h3>
                <button
                    onClick={onOpenRxWriter}
                    style={{
                        fontSize: '0.85rem',
                        color: 'white',
                        background: 'var(--color-brand-primary)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'all 0.2s'
                    }}
                >
                    Open Dawai Writer <ArrowUpRight size={14} />
                </button>
            </div>

            <div className={styles.orderList}>
                {patient.medications?.new?.map((med, i) => (
                    <div key={i} className={styles.orderItem} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '4px',
                        background: '#F0FDFA',
                        borderBottom: '1px solid #CCFBF1',
                        padding: '12px'
                    }}>
                        <div style={{ fontWeight: 700, color: '#0D9488' }}>{med}</div>
                        <div style={{ fontSize: '0.75rem', color: '#0F766E', fontWeight: 600 }}>
                            Prescribed today • One-Click Dawai
                        </div>
                    </div>
                ))}
                {(!patient.medications?.new || patient.medications.new.length === 0) && (
                    <div className={styles.emptyState} style={{ padding: '24px', textAlign: 'center', opacity: 0.6 }}>No new health orders yet.</div>
                )}
            </div>

            {/* Specialty Shortcuts */}
            {specialty && specialty.orderingShortcuts.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>
                        {specialty.label} Shortcuts
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {specialty.orderingShortcuts.map((shortcut) => (
                            <button
                                key={shortcut.id}
                                style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-white)',
                                    color: 'var(--color-brand-secondary)',
                                    fontSize: '0.8rem',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                {shortcut.label}
                                <span style={{ fontSize: '0.65rem', background: 'var(--color-bg-primary)', padding: '2px 4px', borderRadius: '4px' }}>
                                    {shortcut.type.charAt(0)}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className={styles.actionArea}>
                <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Printer size={18} /> Print Visit Summary
                </button>
            </div>
        </div>
    );
}
