'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import DataMigration from '@/components/Settings/DataMigration';
import { Settings, User, Database, Shield, Bell, Palette } from 'lucide-react';

type SettingsTab = 'account' | 'data' | 'notifications' | 'appearance';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('data');

    const tabs = [
        { id: 'account' as const, label: 'Account', icon: User },
        { id: 'data' as const, label: 'Data Migration', icon: Database },
        { id: 'notifications' as const, label: 'Notifications', icon: Bell },
        { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    ];

    return (
        <DashboardLayout>
            <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
                {/* Page Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-serif)', fontSize: '2rem',
                        color: 'var(--color-brand-secondary)', marginBottom: '4px',
                    }}>
                        Settings
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
                        Manage your account, data, and system preferences.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div style={{
                    display: 'flex', gap: '4px', marginBottom: '28px',
                    background: 'var(--color-white)',
                    padding: '4px', borderRadius: '14px',
                    border: '1px solid var(--color-border)',
                    boxShadow: 'var(--shadow-sm)',
                    width: 'fit-content',
                }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '10px',
                                background: activeTab === tab.id ? 'var(--color-brand-primary)' : 'transparent',
                                color: activeTab === tab.id ? 'white' : 'var(--color-text-secondary)',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s',
                            }}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'account' && (
                    <div style={{
                        background: 'var(--color-white)', padding: '32px', borderRadius: '16px',
                        border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '14px',
                                background: 'linear-gradient(135deg, #00B6C1 0%, #008B9A 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '1.2rem', fontWeight: 800,
                            }}>
                                SM
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-brand-secondary)', margin: 0 }}>
                                    Dr. S. Mehta
                                </h3>
                                <p style={{ color: 'var(--color-text-secondary)', margin: '2px 0 0 0', fontSize: '0.9rem' }}>
                                    Family Medicine • Cardiology
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            {[
                                { label: 'License', value: 'MCI-2024-XXXX' },
                                { label: 'Clinic', value: 'Smart Clinic, Mumbai' },
                                { label: 'System Version', value: 'SC-OS v1.0.0' },
                                { label: 'Data Engine', value: 'Next.js 16 + JSON Store' },
                            ].map(item => (
                                <div key={item.label} style={{
                                    padding: '14px 18px', borderRadius: '10px',
                                    background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)',
                                }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                                        {item.label}
                                    </div>
                                    <div style={{ fontWeight: 700, color: 'var(--color-brand-secondary)', fontSize: '0.95rem' }}>
                                        {item.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'data' && (
                    <DataMigration />
                )}

                {activeTab === 'notifications' && (
                    <div style={{
                        background: 'var(--color-white)', padding: '48px', borderRadius: '16px',
                        border: '1px solid var(--color-border)', textAlign: 'center',
                        color: 'var(--color-text-secondary)',
                    }}>
                        <Bell size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <p style={{ fontWeight: 600 }}>Notification preferences coming in Phase 3.</p>
                    </div>
                )}

                {activeTab === 'appearance' && (
                    <div style={{
                        background: 'var(--color-white)', padding: '48px', borderRadius: '16px',
                        border: '1px solid var(--color-border)', textAlign: 'center',
                        color: 'var(--color-text-secondary)',
                    }}>
                        <Palette size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                        <p style={{ fontWeight: 600 }}>Theme customization coming in Phase 3.</p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
