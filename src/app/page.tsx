'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { patients } from '@/data/patients';
import { Calendar, Clock, Activity, ChevronLeft, ChevronRight, IndianRupee, CheckCircle, XCircle, CalendarClock, User, MoreHorizontal, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';

// --- Type Definitions ---
type ViewType = 'Day' | 'Week' | 'Month';
type AppointmentStatus = 'Scheduled' | 'Seen' | 'Cancelled' | 'Rescheduled';

interface CalendarEvent {
  id: string;
  patientName: string;
  time: string;
  reason: string;
  riskLevel: 'Critical' | 'Monitor' | 'Stable';
  dayOffset: number; // 0 = today, -1 = yesterday, etc.
  status: AppointmentStatus;
}

export default function DashboardPage() {
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
    // Only generate once on mount
    const initialEvents: CalendarEvent[] = [];

    // 1. Add Today's patients
    patients.forEach(p => {
      initialEvents.push({
        id: p.id,
        patientName: p.name,
        time: p.time,
        reason: p.reasonForVisit,
        riskLevel: p.riskLevel,
        dayOffset: 0,
        status: p.status === 'Done' ? 'Seen' : 'Scheduled'
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
  }, []);

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
        background: 'rgba(0,0,0,0.4)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }} onClick={() => setSelectedEvent(null)}>
        <div style={{
          background: 'white', borderRadius: '12px', width: '320px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden', animation: 'fadeIn 0.2s ease-out'
        }} onClick={e => e.stopPropagation()}>

          <div style={{ padding: '16px', background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 600, fontSize: '1rem' }}>Manage Appointment</h3>
            <button onClick={() => setSelectedEvent(null)}><X size={18} color="#666" /></button>
          </div>

          <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111' }}>{selectedEvent.patientName}</div>
              <div style={{ color: '#666', fontSize: '0.9rem' }}>{selectedEvent.time} • {selectedEvent.reason}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link href={`/patient/${selectedEvent.id}`} style={{ textDecoration: 'none' }}>
                <button className={styles.actionBtn}>
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
    const timeSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30'
    ];

    const todayEvents = events.filter(e => e.dayOffset === 0);

    return (
      <div style={{ display: 'grid', gap: '8px' }}>
        {timeSlots.map(time => {
          // Find event for this time slot
          const event = todayEvents.find(e => e.time.startsWith(time) || e.time === `${time} AM` || e.time === `${time} PM`);
          const colors = event ? getRiskColor(event.riskLevel, event.status) : null;
          const isCancelled = event?.status === 'Cancelled';

          return (
            <div key={time} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', alignItems: 'center', minHeight: '70px', borderBottom: '1px solid #F3F4F6', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', fontSize: '0.9rem', fontWeight: 500 }}>
                <Clock size={16} />{time}
              </div>
              <div>
                {event ? (
                  <div
                    style={{
                      display: 'block', padding: '12px 16px',
                      background: colors?.bg, borderLeft: `4px solid ${colors?.border}`,
                      borderRadius: '4px', transition: 'all 0.2s',
                      opacity: isCancelled ? 0.6 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Link href={`/patient/${event.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: colors?.text, marginBottom: '4px', textDecoration: isCancelled ? 'line-through' : 'none' }}>
                          {event.patientName}
                          {!isCancelled && <span style={{ marginLeft: '8px', fontSize: '0.75rem', fontWeight: 500, opacity: 0.8 }}>{event.reason}</span>}
                        </div>
                        {event.status !== 'Scheduled' && (
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: colors?.text }}>
                            {event.status}
                          </div>
                        )}
                      </Link>

                      {/* Direct Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {event.status === 'Scheduled' && (
                          <>
                            <button
                              title="Mark as Seen"
                              onClick={(e) => { e.stopPropagation(); updateStatus(event.id, 'Seen'); }}
                              style={{
                                padding: '6px', borderRadius: '50%',
                                background: '#ECFDF5', color: '#059669',
                                border: '1px solid #A7F3D0', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'transform 0.1s'
                              }}
                              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              title="Cancel"
                              onClick={(e) => { e.stopPropagation(); updateStatus(event.id, 'Cancelled'); }}
                              style={{
                                padding: '6px', borderRadius: '50%',
                                background: '#FEF2F2', color: '#DC2626',
                                border: '1px solid #FECACA', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'transform 0.1s'
                              }}
                              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                        {event.status === 'Seen' && (
                          <div style={{ padding: '4px 8px', background: '#ECFDF5', color: '#059669', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid #A7F3D0' }}>
                            Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.85rem', color: '#BBB', fontStyle: 'italic', padding: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hover:text-blue-500 cursor-pointer">
                      No appointments <span style={{ fontSize: '0.7rem', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px' }}>+ Add</span>
                    </span>
                  </div>
                )}
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
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '4px' }}>Dashboard</h1>
            <p style={{ color: '#666', fontSize: '0.95rem' }}>Welcome back, Dr. Mehta</p>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            {/* Live Clock Widget */}
            <div style={{ background: 'white', padding: '12px 20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)', display: 'flex', gap: '24px', border: '1px solid #E5E7EB' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={24} color="var(--color-brand-primary)" />
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1 }}>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>{timeRemaining()}</div>
                </div>
              </div>
              <div style={{ width: '1px', background: '#E5E7EB' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Activity size={24} color="#10B981" />
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1 }}>{patientsSeen} / {totalBooked}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>Patients Seen</div>
                </div>
              </div>
              <div style={{ width: '1px', background: '#E5E7EB' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IndianRupee size={24} color="#F59E0B" />
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1 }}>₹{estimatedRevenue}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>Daily Revenue</div>
                </div>
              </div>
            </div>

            {/* View Toggles & Emergency Pivot */}
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
                style={{
                  padding: '12px 24px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                  color: 'white', fontWeight: 900, fontSize: '0.9rem',
                  border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                  boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.4)',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}
              >
                <AlertCircle size={20} /> Emergency Pivot
              </button>

              <div style={{ background: '#E5E7EB', padding: '4px', borderRadius: '8px', display: 'flex', gap: '2px' }}>
                {['Day', 'Week', 'Month'].map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v as ViewType)}
                    style={{
                      padding: '8px 16px', borderRadius: '6px',
                      background: view === v ? 'white' : 'transparent',
                      color: view === v ? 'var(--color-brand-primary)' : '#666',
                      fontWeight: view === v ? 600 : 400,
                      boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
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

        {/* View Content */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', minHeight: '600px' }}>
          {/* Calendar Header Nav */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={20} color="var(--color-brand-primary)" />
              {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-secondary" style={{ padding: '8px' }}><ChevronLeft size={16} /></button>
              <button className="btn-secondary" style={{ padding: '8px' }}>Today</button>
              <button className="btn-secondary" style={{ padding: '8px' }}><ChevronRight size={16} /></button>
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
    </DashboardLayout>
  );
}
