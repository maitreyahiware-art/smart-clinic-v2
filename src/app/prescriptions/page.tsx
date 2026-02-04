'use client';

import React, { Suspense, useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Search, FileText, Printer, MoreVertical, Plus, CheckCircle, Clock, User, Filter } from 'lucide-react';
import Link from 'next/link';

function PrescriptionDashboard() {
    const [patients, setPatients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('/api/patients');
                const data = await response.json();
                setPatients(data);
            } catch (error) {
                console.error("Failed to fetch patients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Prescription Registry...</div>;

    return (
        <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-secondary)', margin: 0 }}>Prescription Management</h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Global registry of patient health orders and digital prescriptions</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Printer size={18} /> Bulk Print
                    </button>
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-brand-primary)' }}>
                        <Plus size={18} /> New Prescription
                    </button>
                </div>
            </div>

            {/* Stats Area */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {[
                    { label: 'Total Issued', value: '142', icon: FileText, color: '#00B6C1' },
                    { label: 'Pending Signature', value: '3', icon: Clock, color: '#F59E0B' },
                    { label: 'Fulfilled', value: '128', icon: CheckCircle, color: '#10B981' },
                    { label: 'Drafts', value: '11', icon: FileText, color: '#94A3B8' }
                ].map((stat, i) => (
                    <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>{stat.label}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-brand-secondary)' }}>{stat.value}</div>
                        </div>
                        <div style={{ background: `${stat.color}15`, padding: '12px', borderRadius: '12px' }}>
                            <stat.icon size={24} color={stat.color} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters and List */}
            <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-primary)' }}>
                    <div style={{ position: 'relative', width: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                        <input
                            type="text"
                            placeholder="Find prescription by patient or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.95rem' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-secondary" style={{ padding: '10px 16px', fontSize: '0.85rem' }}><Filter size={16} /> Filters</button>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', background: 'white', borderBottom: '1px solid var(--color-border)' }}>
                                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Patient Name</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Last Rx Date</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Medications</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient, idx) => (
                                <tr key={patient.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ fontWeight: 700, color: 'var(--color-brand-secondary)' }}>{patient.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>ID: {patient.id.padStart(4, '0')}</div>
                                    </td>
                                    <td style={{ padding: '16px 24px', fontSize: '0.9rem', color: 'var(--color-brand-secondary)' }}>
                                        Feb 03, 2026
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {(patient.medications?.current || []).slice(0, 2).map((m: string, i: number) => (
                                                <span key={i} style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'var(--color-bg-primary)', borderRadius: '4px', border: '1px solid var(--color-border)' }}>{m}</span>
                                            ))}
                                            {(patient.medications?.current || []).length > 2 && <span style={{ fontSize: '0.7rem', color: '#666' }}>+{patient.medications.current.length - 2} more</span>}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ padding: '4px 10px', borderRadius: '99px', fontSize: '0.7rem', fontWeight: 700, background: '#D1FAE5', color: '#065F46' }}>FULFILLED</span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Link
                                                href={`/patient/${patient.id}?tab=meds`}
                                                style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--color-brand-primary)', color: 'white', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}
                                            >
                                                Open Writer
                                            </Link>
                                            <button style={{ padding: '8px', color: 'var(--color-text-secondary)', background: 'transparent', border: 'none' }}><MoreVertical size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default function PrescriptionsPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <PrescriptionDashboard />
            </Suspense>
        </DashboardLayout>
    );
}
