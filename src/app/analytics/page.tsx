import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Activity, TrendingUp, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';

export default function AnalyticsPage() {
    const metrics = [
        { label: 'Daily Encounters', value: 18, change: '+12%', trend: 'up', icon: Users, color: '#00B6C1' },
        { label: 'Avg. Documentation Time', value: '45s', change: '-20%', trend: 'up', icon: Clock, color: '#10B981' },
        { label: 'Revenue (Projected)', value: '₹45,000', change: '+8%', trend: 'up', icon: TrendingUp, color: '#FFCC00' },
        { label: 'Patient Satisfaction', value: '4.8/5', change: '+0.2', trend: 'up', icon: Activity, color: '#8B5CF6' }
    ];

    const recentActivity = [
        { time: '2 min ago', action: 'SOAP note completed', patient: 'Rajesh Patel', status: 'success' },
        { time: '15 min ago', action: 'Lab order sent', patient: 'Saanvi Sharma', status: 'success' },
        { time: '32 min ago', action: 'Prescription signed', patient: 'Priya Iyer', status: 'success' },
        { time: '1 hr ago', action: 'Referral pending', patient: 'Kavya Reddy', status: 'pending' }
    ];

    return (
        <DashboardLayout>
            <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '8px', color: 'var(--color-brand-secondary)' }}>
                        Practice Analytics
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Real-time insights into your clinical productivity</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                    {metrics.map((metric, i) => {
                        const Icon = metric.icon;
                        return (
                            <div key={i} className="card" style={{ position: 'relative', overflow: 'visible' }}>
                                <div style={{ position: 'absolute', top: '16px', right: '16px', opacity: 0.1 }}>
                                    <Icon size={48} color={metric.color} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        {metric.label}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                                        <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-brand-secondary)' }}>
                                            {metric.value}
                                        </span>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            color: metric.trend === 'up' ? '#10B981' : '#EF4444',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {metric.trend === 'up' ? '↑' : '↓'} {metric.change}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    <div className="card">
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '16px' }}>
                            Recent Activity
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {recentActivity.map((activity, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px',
                                    background: 'var(--color-bg-primary)',
                                    borderRadius: '8px'
                                }}>
                                    {activity.status === 'success' ?
                                        <CheckCircle size={20} color="#10B981" /> :
                                        <AlertCircle size={20} color="#F59E0B" />
                                    }
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 500, color: 'var(--color-brand-secondary)' }}>
                                            {activity.action}
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                                            {activity.patient} • {activity.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '16px' }}>
                            Today's Summary
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                                    Encounters Completed
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ flex: 1, height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: '75%', height: '100%', background: 'var(--color-brand-primary)' }} />
                                    </div>
                                    <span style={{ fontWeight: 600 }}>18/24</span>
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                                    Documentation Rate
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ flex: 1, height: '8px', background: '#E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: '95%', height: '100%', background: '#10B981' }} />
                                    </div>
                                    <span style={{ fontWeight: 600 }}>95%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
