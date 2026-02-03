'use client';

import React, { useState } from 'react';
import { LayoutDashboard, Users, Calendar, BarChart2, Settings, Activity, ChevronLeft, ChevronRight, Clock, Search, FileText } from 'lucide-react';
import styles from './Layout.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { patients } from '@/data/patients';

interface SidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const [showPatientSelector, setShowPatientSelector] = useState(false);
    const [patientSearch, setPatientSearch] = useState('');

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
        p.reasonForVisit.toLowerCase().includes(patientSearch.toLowerCase())
    );

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Patients', path: '/patients', icon: Users },
        { name: 'Prescriptions', path: '/prescriptions', icon: FileText },
        { name: 'Schedule', path: '/schedule', icon: Calendar },
    ];

    const bottomNavItems = [
        { name: 'Analytics', path: '/analytics', icon: BarChart2 },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <>
            <aside className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''}`}>
                <button className={styles.toggleBtn} onClick={onToggle}>
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                <div className={styles.brand}>
                    <img
                        src="/assets/BN_Logo-BlueBG-Square-HD.png"
                        alt="Smart Clinic Logo"
                        style={{ width: '32px', height: '32px', borderRadius: '6px' }}
                    />
                    <span className={styles.brandName}>Smart Clinic</span>
                </div>

                {/* Patient Quick Select - Only show when not collapsed for cleaner UI */}
                {!collapsed && (
                    <div style={{ padding: '0 0 24px 0' }}>
                        <button
                            onClick={() => setShowPatientSelector(true)}
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                background: 'linear-gradient(135deg, #00B6C1 0%, #008B9A 100%)',
                                color: 'white',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'all 0.2s',
                                boxShadow: '0 4px 6px -1px rgba(0, 182, 193, 0.2), 0 2px 4px -1px rgba(0, 182, 193, 0.1)',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 182, 193, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 182, 193, 0.2)';
                            }}
                        >
                            <Clock size={18} strokeWidth={2.5} />
                            <span>Quick Access</span>
                        </button>
                    </div>
                )}

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    ))}

                    <div className={styles.divider} />

                    {bottomNavItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.footer}>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>DR</div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>Dr. S. Mehta</p>
                            <p className={styles.userRole}>Family Medicine</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Patient Selector Modal */}
            {showPatientSelector && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '20px'
                    }}
                    onClick={() => setShowPatientSelector(false)}
                >
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '80vh',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            overflow: 'hidden',
                            animation: 'fadeIn 0.2s ease-out'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{
                            padding: '20px 24px',
                            borderBottom: '1px solid #E5E7EB',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#F9FAFB'
                        }}>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#111827', margin: 0 }}>
                                Find Patient
                            </h3>
                            <button
                                onClick={() => setShowPatientSelector(false)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#6B7280',
                                    cursor: 'pointer',
                                    padding: '4px'
                                }}
                            >
                                <Search size={20} />
                            </button>
                        </div>

                        {/* Search Box */}
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E5E7EB' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                                <input
                                    type="text"
                                    placeholder="Type name, ID, or condition..."
                                    value={patientSearch}
                                    onChange={(e) => setPatientSearch(e.target.value)}
                                    autoFocus
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 40px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        background: '#F9FAFB'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.background = 'white';
                                        e.target.style.borderColor = '#00B6C1';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.background = '#F9FAFB';
                                        e.target.style.borderColor = '#E5E7EB';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Patient List */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '16px 24px'
                        }}>
                            {filteredPatients.map(patient => (
                                <Link
                                    key={patient.id}
                                    href={`/patient/${patient.id}`}
                                    onClick={() => setShowPatientSelector(false)}
                                    style={{
                                        display: 'block',
                                        padding: '12px',
                                        marginBottom: '8px',
                                        borderRadius: '8px',
                                        border: '1px solid #E5E7EB',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s',
                                        background: 'white'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.borderColor = '#00B6C1';
                                        e.currentTarget.style.backgroundColor = '#F0FDFA';
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.borderColor = '#E5E7EB';
                                        e.currentTarget.style.backgroundColor = 'white';
                                        e.currentTarget.style.transform = 'none';
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 600, color: '#1F2937' }}>
                                            {patient.name}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: '#6B7280', fontFamily: 'monospace' }}>
                                            {patient.time}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.85rem', color: '#4B5563' }}>
                                            {patient.reasonForVisit}
                                        </div>
                                        <div style={{
                                            padding: '2px 10px',
                                            borderRadius: '999px',
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            background: patient.riskLevel === 'Critical' ? '#FEE2E2' :
                                                patient.riskLevel === 'Monitor' ? '#FEF3C7' : '#DBEAFE',
                                            color: patient.riskLevel === 'Critical' ? '#991B1B' :
                                                patient.riskLevel === 'Monitor' ? '#92400E' : '#1E40AF'
                                        }}>
                                            {patient.riskLevel}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {filteredPatients.length === 0 && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '40px 20px',
                                    color: '#9CA3AF'
                                }}>
                                    No patients found matching "{patientSearch}"
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
