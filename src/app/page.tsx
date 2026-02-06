'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { patients } from '@/data/patients';
import { Calendar, Clock, Activity, ChevronLeft, ChevronRight, IndianRupee, CheckCircle, XCircle, CalendarClock, User, MoreHorizontal, X, AlertCircle, Target, Pill, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { useSpecialty } from '@/context/SpecialtyContext';

// --- Type Definitions ---
type ViewType = 'Yesterday' | 'Today' | 'Tomorrow' | 'DayAfter' | 'Week' | 'Month';
type AppointmentStatus = 'Scheduled' | 'Seen' | 'Cancelled' | 'Rescheduled' | 'No Show';

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
  markers?: string[];
}

export default function DashboardPage() {
  const { specialty } = useSpecialty();
  const [view, setView] = useState<ViewType>('Today');
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
            medications: p.medications,
            markers: ['Smoker', 'Insomnia', 'Sedentary', 'High Sodium', 'Alcohol (Mod)', 'Chronic Stress', 'Post-Op', 'Family History', 'OSA Risk', 'Salt Sensitive', 'Caffeine+', 'Vagal Tone'].sort(() => 0.5 - Math.random()).slice(0, 2)
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
    if (status === 'Cancelled') return { bg: '#F3F4F6', border: '#9CA3AF', text: '#9CA3AF', label: 'Cancelled' };
    if (status === 'Seen') return { bg: '#F0FDF4', border: '#22C55E', text: '#166534', label: 'Visited' };
    if (status === 'No Show') return { bg: '#FFF1F2', border: '#F43F5E', text: '#BE123C', label: 'No Show' };

    if (level === 'Critical') return { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B', label: 'SOS / URGENT' };
    if (level === 'High') return { bg: '#FFF7ED', border: '#FB923C', text: '#9A3412', label: 'PRIORITY CARE' };
    if (level === 'Monitor') return { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF', label: 'WATCH / ACTION' };
    return { bg: '#F0FDF4', border: '#22C55E', text: '#166534', label: 'ROUTINE' };
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
                onClick={() => updateStatus(selectedEvent.id, 'No Show')}
                style={{ color: '#BE123C', background: '#FFF1F2', border: '1px solid #FECDD3' }}
              >
                <X size={18} /> Patient No Show
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
    let targetOffset = 0;
    if (view === 'Tomorrow') targetOffset = 1;
    else if (view === 'DayAfter') targetOffset = 2;
    else if (view === 'Yesterday') targetOffset = -1;

    const targetEvents = events
      .filter(e => e.dayOffset === targetOffset)
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

    if (targetEvents.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '100px 40px', color: 'var(--color-text-secondary)' }}>
          <CalendarClock size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
          <p>No patients scheduled for {view === 'Today' ? 'today' : view.toLowerCase()}.</p>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {targetEvents.map((event, idx) => {
          const colors = getRiskColor(event.riskLevel, event.status);
          const isCancelled = event.status === 'Cancelled';
          const isSeen = event.status === 'Seen';

          return (
            <div key={event.id} style={{
              display: 'grid', gridTemplateColumns: '120px 1fr', gap: '32px',
              alignItems: 'center', padding: '24px 16px',
              background: isSeen ? '#F8FAFC' : 'white',
              borderRadius: '24px',
              border: `1px solid ${isSeen ? '#E2E8F0' : 'var(--color-border)'}`,
              transition: 'all 0.2s',
              boxShadow: isSeen ? 'none' : '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{
                fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-brand-secondary)',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
              }}>
                {event.time}
                <div style={{ width: '2px', height: '24px', background: 'var(--color-border)', margin: '4px 0' }}></div>
              </div>

              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '24px 32px', background: colors.bg,
                borderRadius: '20px', borderLeft: `8px solid ${colors.border}`,
                opacity: isCancelled ? 0.5 : 1
              }}>
                <Link href={`/patient/${event.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: colors.text }}>{event.patientName}</span>
                    <span style={{
                      fontSize: '0.8rem', fontWeight: 800, padding: '4px 12px',
                      borderRadius: '6px', background: 'rgba(255,255,255,0.6)', color: colors.text
                    }}>
                      {colors.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '1rem', color: colors.text, opacity: 0.85, marginTop: '6px', fontWeight: 600 }}>
                    {event.reason}
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    {event.symptoms && event.symptoms.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {event.markers?.map((m, i) => (
                          <span key={i} style={{ fontSize: '0.6rem', padding: '2px 6px', background: '#FFF1F2', borderRadius: '4px', color: '#F43F5E', fontWeight: 800, border: '1px solid #FECDD3' }}>
                            {m.toUpperCase()}
                          </span>
                        ))}
                        {event.symptoms?.slice(0, 2).map((s, i) => (
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
                        <label style={{ fontSize: '0.65rem', fontWeight: 800, color: colors.text, opacity: 0.6, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>BN Analysis</label>
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
                          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: colors.text }}>{score}</span>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: colors.text, opacity: 0.6 }}>/100</span>
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
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: `1px solid ${colors.border}`,
                        background: 'rgba(255,255,255,0.4)',
                        fontSize: '0.9rem',
                        color: colors.text,
                        fontWeight: 700,
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {event.status === 'Scheduled' && (
                      <>
                        <button
                          onClick={() => updateStatus(event.id, 'Seen')}
                          style={{
                            padding: '12px 20px', borderRadius: '14px',
                            background: 'white', color: '#059669',
                            border: '2px solid #D1FAE5', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            fontWeight: 800, fontSize: '0.9rem'
                          }}
                        >
                          <CheckCircle size={16} /> Mark Done
                        </button>
                      </>
                    )}

                    <Link href={`/patient/${event.id}?tab=dawai`} style={{ textDecoration: 'none' }}>
                      <button
                        style={{
                          padding: '12px 20px', borderRadius: '14px',
                          background: 'white', color: 'var(--color-brand-primary)',
                          border: '2px solid var(--color-brand-primary)',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                          fontWeight: 800, fontSize: '0.85rem',
                          transition: 'all 0.2s'
                        }}
                        className="hover:bg-teal-50"
                      >
                        <Pill size={16} /> Direct Dawai
                      </button>
                    </Link>

                    {event.status === 'Seen' && (
                      <button
                        onClick={() => setSelectedEvent(event)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          color: '#059669', fontWeight: 800, fontSize: '0.85rem',
                          background: '#D1FAE5', padding: '10px 16px', borderRadius: '12px',
                          border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <CheckCircle size={18} /> VISITED
                      </button>
                    )}
                    {event.status === 'No Show' && (
                      <button
                        onClick={() => setSelectedEvent(event)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          color: '#BE123C', fontWeight: 800, fontSize: '0.85rem',
                          background: '#FFF1F2', padding: '10px 16px', borderRadius: '12px',
                          border: 'none', cursor: 'pointer'
                        }}
                      >
                        <X size={18} /> NO SHOW
                      </button>
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
        {/* Header - Simplified for Stats and Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          {/* Left Block: Dashboard Title */}
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '4px', color: 'var(--color-brand-secondary)' }}>Dashboard</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 500 }}>Global Cardiac Command Center</p>
          </div>

          {/* Right Block: Actions & Status */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', justifyContent: 'flex-end' }}>
            {/* Multi-Stat Widget with High Risk Alerts Restored */}
            <div style={{
              background: 'var(--color-white)',
              padding: '14px 28px',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              display: 'flex',
              gap: '32px',
              border: '1px solid var(--color-border)',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={22} color="var(--color-brand-primary)" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-brand-secondary)', lineHeight: 1 }}>
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, marginTop: '2px' }}>{timeRemaining()}</span>
                </div>
              </div>

              <div style={{ width: '1px', height: '32px', background: '#E2E8F0' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Activity size={22} color="#10B981" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-brand-secondary)', lineHeight: 1 }}>
                    {patientsSeen}/{totalBooked}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, marginTop: '2px' }}>Patients Seen</span>
                </div>
              </div>

              <div style={{ width: '1px', height: '32px', background: '#E2E8F0' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Target size={22} color="#F59E0B" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-brand-secondary)', lineHeight: 1 }}>
                    {events.filter(e => e.dayOffset === 0 && (e.riskLevel === 'Critical' || e.riskLevel === 'High')).length}{' '}
                    Cardiac Alerts
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, marginTop: '2px' }}>High Risk Alerts</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const confirmPivot = window.confirm("🚨 EMERGENCY PIVOT ACTIVATED!\n\nThis will auto-reschedule all low-risk sessions and prioritize critical cardiac interventions.");
                if (confirmPivot) {
                  setEvents(prev => prev.map(e => {
                    if (e.dayOffset === 0 && e.status === 'Scheduled') {
                      if (e.riskLevel === 'Critical') return { ...e, reason: '🚨 [TELEREHAB] ' + e.reason };
                      return { ...e, status: 'Rescheduled' };
                    }
                    return e;
                  }));
                }
              }}
              style={{
                padding: '16px 32px',
                borderRadius: '16px',
                background: '#EF4444',
                color: 'white',
                fontWeight: 900,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <AlertCircle size={20} /> Emergency Pivot
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* Main View Area */}
          <div style={{ background: 'var(--color-white)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden', minHeight: '600px', boxShadow: 'var(--shadow-md)' }}>
            {/* Calendar Header Nav */}
            <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-bg-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-brand-secondary)' }}>
                  <Calendar size={28} color="var(--color-brand-primary)" />
                  {(() => {
                    let offset = 0;
                    if (view === 'Tomorrow') offset = 1;
                    else if (view === 'DayAfter') offset = 2;
                    else if (view === 'Yesterday') offset = -1;
                    const d = new Date(currentTime);
                    d.setDate(d.getDate() + offset);
                    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
                  })()}
                </h2>

                {/* Integrated View Toggles */}
                <div style={{
                  background: 'white',
                  padding: '4px',
                  borderRadius: '12px',
                  display: 'flex',
                  gap: '2px',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}>
                  {[
                    { id: 'Yesterday', label: 'Yesterday' },
                    { id: 'Today', label: 'Today' },
                    { id: 'Tomorrow', label: 'Tomorrow' },
                    { id: 'DayAfter', label: 'Day After' },
                    { id: 'Week', label: 'Week' },
                    { id: 'Month', label: 'Month' }
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setView(v.id as ViewType)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: view === v.id ? 'var(--color-brand-primary)' : 'transparent',
                        color: view === v.id ? 'white' : 'var(--color-text-secondary)',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        transition: 'all 0.2s',
                        textTransform: 'uppercase',
                        minWidth: v.id.length > 5 ? '100px' : '80px'
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" style={{ padding: '8px', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}><ChevronLeft size={16} /></button>
                <button className="btn-secondary" style={{ padding: '8px', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>Today</button>
                <button className="btn-secondary" style={{ padding: '8px', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}><ChevronRight size={16} /></button>
              </div>
            </div>

            {/* Render Active View */}
            <div style={{ padding: view === 'Month' ? '0' : '20px' }}>
              {(view === 'Today' || view === 'Yesterday' || view === 'Tomorrow' || view === 'DayAfter') && renderDayView()}
              {view === 'Week' && renderWeekView()}
              {view === 'Month' && renderMonthView()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
