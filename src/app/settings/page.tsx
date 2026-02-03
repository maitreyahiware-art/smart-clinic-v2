import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function SettingsPage() {
    return (
        <DashboardLayout>
            <div style={{ padding: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '24px', color: 'var(--color-brand-secondary)' }}>Settings</h1>

                <div style={{ background: 'white', padding: '32px', borderRadius: '12px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Account Information</h3>
                    <p>Dr. S. Mehta</p>
                    <p style={{ color: '#666' }}>Family Medicine</p>
                    <div style={{ marginTop: '32px', padding: '16px', background: 'var(--color-bg-primary)', borderRadius: '8px' }}>
                        <p>System Version: ONS v1.0.0</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
