import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import styles from './Dashboard.module.css';

interface Appointment {
    time: string;
    patient: string;
    type: string;
}

const weeklyAppointments: Record<string, Appointment[]> = {
    'Mon': [
        { time: '09:00', patient: 'Saanvi S.', type: 'F/U' },
        { time: '10:00', patient: 'Rajesh P.', type: 'New' },
        { time: '11:30', patient: 'Priya I.', type: 'Physical' },
        { time: '14:00', patient: 'Amit V.', type: 'F/U' },
        { time: '15:30', patient: 'Kavya R.', type: 'Consult' }
    ],
    'Tue': [
        { time: '09:00', patient: 'Arjun D.', type: 'F/U' },
        { time: '10:30', patient: 'Meera K.', type: 'Post-Op' },
        { time: '11:00', patient: 'Vikram S.', type: 'New' },
        { time: '14:00', patient: 'Ananya G.', type: 'Sick' },
        { time: '15:00', patient: 'Harish M.', type: 'Consult' },
        { time: '16:00', patient: 'Divya N.', type: 'F/U' }
    ],
    'Wed': [
        { time: '09:00', patient: 'Karthik B.', type: 'Physical' },
        { time: '10:00', patient: 'Ravi K.', type: 'New' },
        { time: '11:00', patient: 'Sneha M.', type: 'F/U' },
        { time: '14:30', patient: 'Aditya S.', type: 'Consult' }
    ],
    'Thu': [
        { time: '09:00', patient: 'Anjali P.', type: 'F/U' },
        { time: '10:00', patient: 'Rohan G.', type: 'New' },
        { time: '11:30', patient: 'Lakshmi V.', type: 'F/U' },
        { time: '14:00', patient: 'Suresh B.', type: 'Sick' },
        { time: '15:30', patient: 'Nisha R.', type: 'Consult' },
        { time: '16:30', patient: 'Akash T.', type: 'F/U' }
    ],
    'Fri': [
        { time: '09:00', patient: 'Pooja D.', type: 'Physical' },
        { time: '10:30', patient: 'Manoj K.', type: 'F/U' },
        { time: '11:30', patient: 'Sruthi N.', type: 'New' },
        { time: '14:00', patient: 'Rahul M.', type: 'Consult' }
    ]
};

export default function WeeklyCalendar() {
    const today = 'Mon'; // Simulating Monday as today

    return (
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <CalendarIcon size={20} color="var(--color-brand-primary)" />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--color-brand-secondary)' }}>
                    This Week's Schedule
                </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {Object.entries(weeklyAppointments).map(([day, appointments]) => (
                    <div
                        key={day}
                        style={{
                            background: day === today ? 'var(--color-bg-primary)' : 'transparent',
                            border: day === today ? '2px solid var(--color-brand-primary)' : '1px solid var(--color-border)',
                            borderRadius: '8px',
                            padding: '12px'
                        }}
                    >
                        <div style={{
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            marginBottom: '8px',
                            color: day === today ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)'
                        }}>
                            {day}
                            {day === today && <span style={{ marginLeft: '4px', fontSize: '0.7rem' }}>• Today</span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '8px' }}>
                            {appointments.length} appointments
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {appointments.slice(0, 3).map((apt, i) => (
                                <div
                                    key={i}
                                    style={{
                                        fontSize: '0.7rem',
                                        padding: '4px 6px',
                                        background: '#f5f5f5',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <div style={{ fontWeight: 500, color: 'var(--color-brand-secondary)' }}>{apt.time}</div>
                                    <div style={{ color: '#666' }}>{apt.patient}</div>
                                </div>
                            ))}
                            {appointments.length > 3 && (
                                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '4px' }}>
                                    +{appointments.length - 3} more
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
