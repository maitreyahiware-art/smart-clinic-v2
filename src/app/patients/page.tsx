'use client';

import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { patients } from '@/data/patients';
import { Search, Filter, Users, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function PatientsRegistryPage() {
    const getRiskColor = (level: string) => {
        if (level === 'Critical') return { bg: '#FEE2E2', text: '#991B1B', badge: '#DC2626' };
        if (level === 'Monitor') return { bg: '#FEF3C7', text: '#92400E', badge: '#F59E0B' };
        return { bg: '#DBEAFE', text: '#1E40AF', badge: '#3B82F6' };
    };

    const getStatusColor = (status: string) => {
        if (status === 'Waiting') return { bg: '#FEF3C7', text: '#92400E' };
        if (status === 'In Progress') return { bg: '#DBEAFE', text: '#1E40AF' };
        return { bg: '#D1FAE5', text: '#065F46' };
    };

    return (
        <DashboardLayout>
            <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '24px' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '8px' }}>
                        Patient Registry
                    </h1>
                    <p style={{ color: '#666' }}>Complete list of all patients scheduled for today</p>
                </div>

                {/* Search and Filter Bar */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '24px',
                    background: 'white',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB'
                }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#999'
                        }} />
                        <input
                            type="text"
                            placeholder="Search patients by name, condition, or ID..."
                            style={{
                                width: '100%',
                                padding: '10px 12px 10px 40px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '6px',
                                fontSize: '0.95rem'
                            }}
                        />
                    </div>
                    <button style={{
                        padding: '10px 16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '6px',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem'
                    }}>
                        <Filter size={18} />
                        Filter
                    </button>
                </div>

                {/* Quick Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '16px',
                    marginBottom: '24px'
                }}>
                    {[
                        { label: 'Total Patients', value: patients.length, icon: Users, color: '#00B6C1' },
                        { label: 'Critical Cases', value: patients.filter(p => p.riskLevel === 'Critical').length, icon: AlertTriangle, color: '#DC2626' },
                        { label: 'In Progress', value: patients.filter(p => p.status === 'In Progress').length, icon: Activity, color: '#3B82F6' },
                        { label: 'Completed', value: patients.filter(p => p.status === 'Done').length, icon: TrendingUp, color: '#10B981' }
                    ].map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} style={{
                                background: 'white',
                                padding: '20px',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
                                            {stat.label}
                                        </div>
                                        <div style={{ fontSize: '2rem', fontWeight: 700, color: stat.color }}>
                                            {stat.value}
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '8px',
                                        background: `${stat.color}15`,
                                        borderRadius: '8px'
                                    }}>
                                        <Icon size={24} color={stat.color} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Patient Table */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden'
                }}>
                    {/* Table Header */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 200px 1fr 150px 120px 120px',
                        gap: '16px',
                        padding: '16px 20px',
                        background: 'var(--color-bg-primary)',
                        borderBottom: '1px solid #E5E7EB',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        color: '#666',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        <div>Time</div>
                        <div>Patient</div>
                        <div>Reason for Visit</div>
                        <div>Risk Level</div>
                        <div>Status</div>
                        <div>Action</div>
                    </div>

                    {/* Table Body */}
                    <div>
                        {patients.map(patient => {
                            const riskColors = getRiskColor(patient.riskLevel);
                            const statusColors = getStatusColor(patient.status);

                            return (
                                <div
                                    key={patient.id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '80px 200px 1fr 150px 120px 120px',
                                        gap: '16px',
                                        padding: '16px 20px',
                                        borderBottom: '1px solid #E5E7EB',
                                        alignItems: 'center',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#F9FAFB'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    {/* Time */}
                                    <div style={{
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        color: 'var(--color-brand-primary)'
                                    }}>
                                        {patient.time}
                                    </div>

                                    {/* Patient */}
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                                            {patient.name}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                            {patient.age}y, {patient.gender}
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div style={{ fontSize: '0.9rem', color: '#666' }}>
                                        {patient.reasonForVisit}
                                    </div>

                                    {/* Risk Level */}
                                    <div>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            background: riskColors.bg,
                                            color: riskColors.text,
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}>
                                            {patient.riskLevel}
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            background: statusColors.bg,
                                            color: statusColors.text,
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500
                                        }}>
                                            {patient.status}
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div>
                                        <Link
                                            href={`/patient/${patient.id}`}
                                            style={{
                                                padding: '6px 12px',
                                                background: 'var(--color-brand-primary)',
                                                color: 'white',
                                                borderRadius: '6px',
                                                fontSize: '0.8rem',
                                                fontWeight: 500,
                                                textDecoration: 'none',
                                                display: 'inline-block',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.background = '#008B9A';
                                                e.currentTarget.style.transform = 'translateY(-1px)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.background = 'var(--color-brand-primary)';
                                                e.currentTarget.style.transform = 'translateY(0)';
                                            }}
                                        >
                                            Profile
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
