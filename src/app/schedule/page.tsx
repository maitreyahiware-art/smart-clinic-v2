import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';

export default function SchedulePage() {
    return (
        <DashboardLayout>
            <div style={{ padding: '24px' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '24px', color: 'var(--color-brand-secondary)' }}>Schedule</h1>
                <div style={{ padding: '48px', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px dashed var(--color-border)' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Full calendar synchronization coming in v2.0</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
