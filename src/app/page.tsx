'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { patients } from '@/data/patients';
import { Calendar, Clock, Activity, ChevronLeft, ChevronRight, IndianRupee, CheckCircle, XCircle, CalendarClock, User, MoreHorizontal, X, AlertCircle, Target, Pill, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { useSpecialty } from '@/context/SpecialtyContext';

// --- Type Definitions ---
type ViewType = 'Day' | 'Week' | 'Month';
type AppointmentStatus = 'Scheduled' | 'Seen' | 'Cancelled' | 'Rescheduled';

interface CalendarEvent {
  id: string;
  patientName: string;
  time: string;
  reason: string;
  riskLevel: 'Critical' | 'High' | 'Monitor' | 'Stable';
  dayOffset: number; // 0 = today, -1 = yesterday, etc.
  status: AppointmentStatus;
  followUpDate?: string;
  symptoms?: string[];
  medications?: { current: string[] };
}

export default function DashboardPage() {
  const { specialty } = useSpecialty();
  const [view, setView] = useState<ViewType>('Day');
  const [currentTime, setCurrentTime] = useState(new Date());

  // State for events (so we can update status)
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // State for Action Menu
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // --- Constants & Config ---
  const shiftEnd = new Date();
  shiftEnd.setHours(17, 30, 0); // 5:30 PM

  // --- Data Generation ---
  useEffect(() => {
    if (!specialty) return;

    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients');
        const realPatients = await response.json();

        const initialEvents: CalendarEvent[] = [];

        // 1. Add Today's patients from API
        realPatients.forEach((p: any) => {
          let dynamicRisk = p.riskLevel;
          // Note: Condition function might not be available directly if coming from JSON
          // We can re-apply the logic or just trust the DB for now.
          // For Cardiology specifically, we can re-evaluate.

          if (specialty.id === 'cardiology' && p.vitals?.bps >= 180) {
            dynamicRisk = 'Critical';
          }

          // Map status correctly
          let mappedStatus: AppointmentStatus = 'Scheduled';
          const lowerStatus = p.status?.toLowerCase() || '';
          if (['completed', 'done', 'seen'].includes(lowerStatus)) mappedStatus = 'Seen';
          else if (lowerStatus === 'cancelled') mappedStatus = 'Cancelled';
          else if (lowerStatus === 'rescheduled') mappedStatus = 'Rescheduled';

          initialEvents.push({
            id: p.id,
            patientName: p.name,
            time: p.time,
            reason: p.reasonForVisit,
            riskLevel: dynamicRisk,
            dayOffset: 0,
            status: mappedStatus,
            symptoms: p.symptoms,
            medications: p.medications
          });
        });

        // 2. Add Fake patients for other days
        const fakeNames = ["Rohan Gupta", "Aisha Khan", "John Doe", "Emily Clark", "Michael Ray", "Sarah Lee", "David Kim", "Lisa Wang"];
        const reasons = ["Follow-up", "Annual Physical", "Migraine", "Fever", "Back Pain", "Diabetes Check"];
        const risks = ['Stable', 'Stable', 'Monitor', 'Stable', 'Critical', 'Stable'] as const;

        for (let i = -15; i <= 15; i++) {
          if (i === 0) continue;
          const count = Math.floor(Math.random() * 4) + 2;
          for (let j = 0; j < count; j++) {
            initialEvents.push({
              id: `fake-${i}-${j}`,
              patientName: fakeNames[Math.floor(Math.random() * fakeNames.length)],
              time: `${9 + j}:00 ${j < 3 ? 'AM' : 'PM'}`,
              reason: reasons[Math.floor(Math.random() * reasons.length)],
              riskLevel: risks[Math.floor(Math.random() * risks.length)],
              dayOffset: i,
              status: 'Scheduled'
            });
          }
        }
        setEvents(initialEvents);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };

    fetchPatients();
  }, [specialty]);

  // --- Effects ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // --- Actions ---
  const updateStatus = (id: string, newStatus: AppointmentStatus) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    setSelectedEvent(null); // Close menu
  };

  const updateFollowUpDate = (id: string, date: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, followUpDate: date } : e));
  };

  // --- Helpers ---
  const timeRemaining = () => {
    const diff = shiftEnd.getTime() - currentTime.getTime();
    if (diff <= 0) return "Shift Ended";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  const getRiskColor = (level: string, status: AppointmentStatus) => {
    if (status === 'Cancelled') return { bg: '#F3F4F6', border: '#9CA3AF', text: '#9CA3AF' };
    if (status === 'Seen') return { bg: '#ECFDF5', border: '#10B981', text: '#065F46' };

    if (level === 'Critical') return { bg: '#FEE2E2', border: '#DC2626', text: '#991B1B' };
    if (level === 'High') return { bg: '#FFEDD5', border: '#F97316', text: '#9A3412' }; // Orange
    if (level === 'Monitor') return { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' };
    return { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' };
  };

  // --- Render Sub-Components ---

  // Action Menu Modal
  const renderActionMenu = () => {
    if (!selectedEvent) return null;

    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.6)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)'
      }} onClick={() => setSelectedEvent(null)}>
        <div style={{
          background: 'var(--color-white)', borderRadius: '12px', width: '320px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden', animation: 'fadeIn 0.2s ease-out',
          border: '1px solid var(--color-border)'
        }} onClick={e => e.stopPropagation()}>

          <div style={{ padding: '16px', background: 'var(--color-bg-primary)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-brand-secondary)' }}>Manage Appointment</h3>
            <button onClick={() => setSelectedEvent(null)} style={{ color: 'var(--color-text-secondary)' }}><X size={18} /></button>
          </div>

          <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-brand-secondary)' }}>{selectedEvent.patientName}</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{selectedEvent.time} • {selectedEvent.reason}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href={`/patient/${selectedEvent.id}`} style={{ textDecoration: 'none' }}>
                <button className={styles.actionBtn} style={{ background: 'var(--color-white)', color: 'var(--color-brand-secondary)', border: '1px solid var(--color-border)' }}>
                  <User size={18} /> View Patient Chart
                </button>
              </Link>

              <button
                className={styles.actionBtn}
                onClick={() => updateStatus(selectedEvent.id, 'Seen')}
                style={{ color: '#059669', background: '#ECFDF5', border: '1px solid #D1FAE5' }}
              >
                <CheckCircle size={18} /> Mark as Seen
              </button>

              <button
                className={styles.actionBtn}
                onClick={() => updateStatus(selectedEvent.id, 'Rescheduled')}
                style={{ color: '#D97706', background: '#FFFBEB', border: '1px solid #FEF3C7' }}
              >
                <CalendarClock size={18} /> Reschedule
              </button>

              <button
                className={styles.actionBtn}
                onClick={() => updateStatus(selectedEvent.id, 'Cancelled')}
                style={{ color: '#DC2626', background: '#FEF2F2', border: '1px solid #FEE2E2' }}
              >
                <XCircle size={18} /> Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Map to styles object since we can't use .css file easily here for dynamic modal
  const styles = {
    actionBtn: 'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50 border border-gray-200 bg-white text-gray-700 cursor-pointer'
  };

  // --- View Renders ---

  const renderDayView = () => {
    const todayEvents = events
      .filter(e => e.dayOffset === 0)
      .sort((a, b) => {
        const timeToMinutes = (t: string) => {
          const [time, period] = t.split(' ');
          let [h, m] = time.split(':').map(Number);
          if (period === 'PM' && h !== 12) h += 12;
          if (period === 'AM' && h === 12) h = 0;
          return h * 60 + (m || 0);
        };
        return timeToMinutes(a.time) - timeToMinutes(b.time);
      });

    if (todayEvents.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '100px 40px', color: 'var(--color-text-secondary)' }}>
          <CalendarClock size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
          <p>No patients scheduled for today.</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {todayEvents.map((event, idx) => {
          const colors = getRiskColor(event.riskLevel, event.status);
          const isCancelled = event.status === 'Cancelled';
          const isSeen = event.status === 'Seen';

          return (
            <div key={event.id} style={{
              display: 'grid', gridTemplateColumns: '100px 1fr', gap: '24px',
              alignItems: 'center', padding: '16px',
              background: isSeen ? '#F8FAFC' : 'white',
              borderRadius: '16px',
              border: `1px solid ${isSeen ? '#E2E8F0' : 'var(--color-border)'}`,
              transition: 'all 0.2s',
              boxShadow: isSeen ? 'none' : '0 2px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                fontSize: '1rem', fontWeight: 700, color: 'var(--color-brand-secondary)',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                {event.time}
                <div style={{ width: '2px', height: '24px', background: 'var(--color-border)', margin: '4px 0' }}></div>
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 20px', background: colors.bg,
                borderRadius: '12px', borderLeft: `6px solid ${colors.border}`,
                opacity: isCancelled ? 0.5 : 1
              }}>
                <Link href={`/patient/${event.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: colors.text }}>{event.patientName}</span>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px',
                      borderRadius: '4px', background: 'rgba(255,255,255,0.5)', color: colors.text
                    }}>
                      {event.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: colors.text, opacity: 0.8, marginTop: '4px', fontWeight: 500 }}>
                    {event.reason}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    {event.symptoms && event.symptoms.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {event.symptoms.slice(0, 2).map((s, i) => (
                          <span key={i} style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.3)', borderRadius: '4px', color: colors.text, fontWeight: 700 }}>
                            {s.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                    {event.medications?.current && event.medications.current.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: colors.text, opacity: 0.7, fontWeight: 700 }}>
                        <Pill size={12} /> {event.medications.current[0]} {event.medications.current.length > 1 ? `+${event.medications.current.length - 1}` : ''}
                      </div>
                    )}
                  </div>
                </Link>

                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  {/* BN Smart Life Health Score */}
                  {(() => {
                    const getHealthScore = (level: string, id: string) => {
                      const seed = (id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) || 42;
                      if (level === 'Critical') return 20 + (seed % 15);
                      if (level === 'High') return 45 + (seed % 15);
                      if (level === 'Monitor') return 65 + (seed % 15);
                      return 85 + (seed % 10);
                    };
                    const score = getHealthScore(event.riskLevel, event.id);
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.65rem', fontWeight: 800, color: colors.text, opacity: 0.6, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>BN Health Score</label>
                        <div style={{
                          background: 'rgba(255,255,255,0.5)',
                          padding: '4px 12px',
                          borderRadius: '8px',
                          border: `1px solid ${colors.border}`,
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '2px',
                          minWidth: '60px',
                          justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: colors.text }}>{score}</span>
                          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: colors.text, opacity: 0.5 }}>/100</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Next Followup Date Selector */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.65rem', fontWeight: 800, color: colors.text, opacity: 0.6, textTransform: 'uppercase' }}>Next Follow-up</label>
                    <input
                      type="date"
                      value={event.followUpDate || ''}
                      onChange={(e) => updateFollowUpDate(event.id, e.target.value)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: `1px solid ${colors.border}`,
                        background: 'rgba(255,255,255,0.4)',
                        fontSize: '0.8rem',
                        color: colors.text,
                        fontWeight: 600,
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {event.status === 'Scheduled' && (
                      <>
                        <button
                          onClick={() => updateStatus(event.id, 'Seen')}
                          style={{ padding: '10px', borderRadius: '12px', background: 'white', color: '#059669', border: '1px solid #D1FAE5', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.8rem' }}
                        >
                          <CheckCircle size={16} /> Mark Done
                        </button>
                      </>
                    )}

                    <Link href={`/patient/${event.id}?tab=dawai`} style={{ textDecoration: 'none' }}>
                      <button
                        style={{
                          padding: '10px 16px', borderRadius: '12px',
                          background: 'white', color: 'var(--color-brand-primary)',
                          border: '1px solid var(--color-brand-primary)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                          fontWeight: 700, fontSize: '0.8rem',
                          transition: 'all 0.2s'
                        }}
                        className="hover:bg-teal-50"
                      >
                        <Pill size={16} /> Direct Dawai
                      </button>
                    </Link>

                    {event.status === 'Seen' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: 800, fontSize: '0.85rem', background: '#D1FAE5', padding: '10px 16px', borderRadius: '12px' }}>
                        <CheckCircle size={18} /> VISITED
                      </div>
                    )}
                    {event.status === 'Cancelled' && (
                      <div style={{ color: '#94A3B8', fontWeight: 700, fontSize: '0.85rem' }}>CANCELLED</div>
                    )}
                    <button onClick={() => setSelectedEvent(event)} style={{ padding: '8px', color: 'var(--color-text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1px', background: '#E5E7EB', border: '1px solid #E5E7EB' }}>
        {days.map((day, idx) => {
          const offset = idx - 2;
          const dayEvents = events.filter(e => e.dayOffset === offset);
          const isToday = offset === 0;

          return (
            <div key={day} style={{ background: isToday ? '#F0F9FF' : 'white', minHeight: '600px' }}>
              <div style={{ padding: '12px', borderBottom: '1px solid #E5E7EB', textAlign: 'center', fontWeight: 600, color: isToday ? 'var(--color-brand-primary)' : '#374151' }}>
                {day}
              </div>
              <div style={{ padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {dayEvents.map((ev, i) => {
                  const colors = getRiskColor(ev.riskLevel, ev.status);
                  const isCancelled = ev.status === 'Cancelled';
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedEvent(ev)}
                      style={{
                        padding: '8px', borderRadius: '4px',
                        background: colors.bg, borderLeft: `3px solid ${colors.border}`,
                        fontSize: '0.8rem', cursor: 'pointer',
                        opacity: isCancelled ? 0.6 : 1
                      }}
                    >
                      <div style={{ fontWeight: 600, color: colors.text, textDecoration: isCancelled ? 'line-through' : 'none' }}>{ev.time}</div>
                      <div style={{ fontWeight: 500, marginBottom: '2px' }}>{ev.patientName}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderMonthView = () => {
    const weeks = [0, 1, 2, 3, 4];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let dayCount = 1;

    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #E5E7EB' }}>
          {days.map(d => (
            <div key={d} style={{ padding: '12px', textAlign: 'center', fontWeight: 600, color: '#6B7280', fontSize: '0.9rem' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateRows: 'repeat(5, 1fr)', borderLeft: '1px solid #E5E7EB' }}>
          {weeks.map((week) => (
            <div key={week} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {days.map((d, dIdx) => {
                const cellId = week * 7 + dIdx;
                const isPadding = cellId < 3 || dayCount > 31;

                let cellContent = null;
                if (!isPadding) {
                  const offset = dayCount - 15;
                  const dailyEvents = events.filter(e => e.dayOffset === offset);
                  const isToday = offset === 0;

                  cellContent = (
                    <div style={{ height: '120px', background: isToday ? '#F0F9FF' : 'white', padding: '8px', borderRight: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: isToday ? 700 : 500, color: isToday ? 'var(--color-brand-primary)' : '#374151', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isToday ? '#BAE6FD' : 'transparent' }}>{dayCount}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {dailyEvents.slice(0, 3).map((ev, i) => (
                          <div key={i} onClick={() => setSelectedEvent(ev)} style={{ fontSize: '0.7rem', padding: '2px 4px', borderRadius: '2px', background: getRiskColor(ev.riskLevel, ev.status).bg, color: getRiskColor(ev.riskLevel, ev.status).text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', textDecoration: ev.status === 'Cancelled' ? 'line-through' : 'none' }}>
                            {ev.patientName}
                          </div>
                        ))}
                        {dailyEvents.length > 3 && <div style={{ fontSize: '0.7rem', color: '#999', paddingLeft: '4px' }}>+ {dailyEvents.length - 3} more</div>}
                      </div>
                    </div>
                  );
                  dayCount++;
                } else {
                  cellContent = <div style={{ height: '120px', background: '#F9FAFB', borderRight: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }}></div>;
                }
                return <React.Fragment key={dIdx}>{cellContent}</React.Fragment>;
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Stats
  const patientsSeen = events.filter(e => e.status === 'Seen').length;
  // Simple revenue calc based on seen patients
  const estimatedRevenue = patientsSeen * 500;
  const totalBooked = events.filter(e => e.dayOffset === 0 && e.status !== 'Cancelled').length;

  return (
    <DashboardLayout>
      {/* Modal Injection */}
      {renderActionMenu()}

      <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '4px', color: 'var(--color-brand-secondary)' }}>Dashboard</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>Welcome back, Chief Medical Officer</p>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {/* Live Clock Widget */}
            <div style={{ background: 'var(--color-white)', padding: '12px 20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '24px', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={24} color="var(--color-brand-primary)" />
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1, color: 'var(--color-brand-secondary)' }}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{timeRemaining()}</div>
                </div>
              </div>
              <div style={{ width: '1px', background: 'var(--color-border)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Activity size={24} color="#10B981" />
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1, color: 'var(--color-brand-secondary)' }}>{patientsSeen} / {totalBooked}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Patients Seen</div>
                </div>
              </div>
              <div style={{ width: '1px', background: 'var(--color-border)' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Target size={24} color="var(--color-accent-gamification)" />
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1, color: 'var(--color-brand-secondary)' }}>
                    {events.filter(e => e.dayOffset === 0 && (e.riskLevel === 'Critical' || e.riskLevel === 'High')).length}{' '}
                    {specialty?.id === 'cardiology' ? 'Cardiac Alerts' : 'Alerts'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{specialty?.label} High Risk</div>
                </div>
              </div>
            </div>

            {/* Actions & View Toggles */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  const confirmPivot = window.confirm("🚨 EMERGENCY PIVOT ACTIVATED!\n\nThis will:\n1. Auto-reschedule all LOW/MID risk patients.\n2. Move all CRITICAL patients to immediate TELEREHAB sessions.\n\nProceed with notification broadcast?");
                  if (confirmPivot) {
                    setEvents(prev => prev.map(e => {
                      if (e.dayOffset === 0 && e.status === 'Scheduled') {
                        if (e.riskLevel === 'Critical') return { ...e, reason: '🚨 [TELEREHAB] ' + e.reason, status: 'Scheduled' };
                        return { ...e, status: 'Rescheduled' };
                      }
                      return e;
                    }));
                    alert("Broadcast complete. 24 patients notified via WhatsApp/SMS.");
                  }
                }}
                className="hover-glow"
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  background: '#EF4444',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
                  transition: 'transform 0.2s',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}
              >
                <AlertCircle size={18} /> Emergency Pivot
              </button>

              <div style={{ background: 'var(--color-bg-primary)', padding: '4px', borderRadius: '8px', display: 'flex', gap: '2px', border: '1px solid var(--color-border)' }}>
                {['Day', 'Week', 'Month'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v as ViewType)}
                    style={{
                      padding: '8px 16px', borderRadius: '6px',
                      background: view === v ? 'var(--color-white)' : 'transparent',
                      color: view === v ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                      fontWeight: view === v ? 600 : 400,
                      boxShadow: view === v ? 'var(--shadow-sm)' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* Main View Area */}
          <div style={{ background: 'var(--color-white)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden', minHeight: '600px', boxShadow: 'var(--shadow-md)' }}>
            {/* Calendar Header Nav */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-primary)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-brand-secondary)' }}>
                <Calendar size={20} color="var(--color-specialty-primary)" />
                {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" style={{ padding: '8px', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}><ChevronLeft size={16} /></button>
                <button className="btn-secondary" style={{ padding: '8px', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>Today</button>
                <button className="btn-secondary" style={{ padding: '8px', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}><ChevronRight size={16} /></button>
              </div>
            </div>

            {/* Render Active View */}
            <div style={{ padding: view === 'Month' ? '0' : '20px' }}>
              {view === 'Day' && renderDayView()}
              {view === 'Week' && renderWeekView()}
              {view === 'Month' && renderMonthView()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
