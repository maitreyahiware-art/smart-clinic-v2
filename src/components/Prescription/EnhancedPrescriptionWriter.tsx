'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Plus, Save, Printer, Send, AlertCircle, Clock, Utensils, Moon, Sun, Thermometer, Activity, Scale, Heart, Info, CheckCircle, Lightbulb, Calendar, Database, Eye, ChevronDown, FlaskConical, Radio, ChevronUp } from 'lucide-react';
import { medicationDatabase, PrescriptionItem, Medication } from '@/data/medicationDatabase';
import { diagnosticTests, DiagnosticOrder } from '@/data/diagnosticTests';

interface EnhancedPrescriptionWriterProps {
    patientId: string;
    patientName: string;
    patientAge: number;
    patientGender: string;
}

// 50 Condition Tips mapping based on provided advice.txt
const ADVICE_MAP: Record<string, string[]> = {
    'hypertension': ['Limit salt, pick fresh foods', 'Walk 30 minutes daily', 'Manage stress, sleep well'],
    'diabetes': ['Avoid sugary drinks & refined carbs', 'Eat balanced meals at fixed times', 'Daily physical activity'],
    'cholesterol': ['Reduce fried & processed food', 'Add nuts, seeds, fiber', 'Regular exercise'],
    'obesity': ['Control portion sizes', 'Increase daily movement', 'Avoid late-night eating'],
    'thyroid': ['Don’t skip meals', 'Adequate protein intake', 'Consistent sleep routine'],
    'pcos': ['Reduce sugar & refined carbs', 'Regular exercise', 'Manage stress levels'],
    'fatty liver': ['Avoid alcohol', 'Reduce sugar & fried foods', 'Gradual weight loss'],
    'acidity': ['Avoid spicy, oily foods', 'Eat smaller meals', 'Don’t lie down immediately after eating'],
    'ibs': ['Eat slowly', 'Identify trigger foods', 'Manage stress'],
    'constipation': ['Increase fiber intake', 'Drink enough water', 'Regular toilet timing'],
    'diarrhea': ['Stay hydrated', 'Avoid street food', 'Eat light, home-cooked meals'],
    'anemia': ['Include iron-rich foods', 'Pair iron with vitamin C', 'Avoid tea/coffee near meals'],
    'vitamin d': ['Sun exposure', 'Include fortified foods', 'Stay physically active'],
    'vitamin b12': ['Include dairy/animal foods', 'Avoid long gaps between meals'],
    'osteoporosis': ['Weight-bearing exercise', 'Adequate calcium intake', 'Avoid smoking/alcohol'],
    'joint pain': ['Maintain healthy weight', 'Gentle movement daily', 'Avoid prolonged sitting'],
    'gout': ['Reduce red meat & alcohol', 'Stay well hydrated', 'Maintain healthy weight'],
    'migraine': ['Maintain regular sleep', 'Avoid trigger foods', 'Stay hydrated'],
    'headache': ['Manage screen time', 'Regular meals', 'Stress management'],
    'insomnia': ['Fixed sleep routine', 'Avoid screens before bed', 'Reduce caffeine'],
    'anxiety': ['Deep breathing exercises', 'Regular physical activity', 'Limit caffeine'],
    'asthma': ['Avoid triggers (dust, smoke)', 'Regular breathing exercises', 'Maintain healthy weight'],
    'uti': ['Drink plenty of fluids', 'Don’t hold urine', 'Maintain hygiene'],
    'hair fall': ['Adequate protein intake', 'Manage stress', 'Avoid crash diets'],
    'acne': ['Avoid junk food', 'Keep skin clean', 'Adequate hydration'],
    'eczema': ['Moisturize regularly', 'Avoid irritants', 'Manage stress'],
    'fatigue': ['Balanced meals', 'Adequate sleep', 'Regular activity'],
    'stress': ['Breathing exercises', 'Time management', 'Physical activity']
};

export default function EnhancedPrescriptionWriter({
    patientId,
    patientName,
    patientAge,
    patientGender
}: EnhancedPrescriptionWriterProps) {
    const [medications, setMedications] = useState<PrescriptionItem[]>([]);
    const [diagnosticOrders, setDiagnosticOrders] = useState<DiagnosticOrder[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    // Vitals & Clinical
    const [vitals, setVitals] = useState({ bp: '', pulse: '', temp: '', weight: '', spo2: '' });
    const [chiefComplaint, setChiefComplaint] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [advice, setAdvice] = useState('');
    const [autoTips, setAutoTips] = useState<string[]>([]);
    const [followUpDate, setFollowUpDate] = useState('');

    // --- Drodown Management ---
    const [showMedDropdown, setShowMedDropdown] = useState(false);
    const [medSearch, setMedSearch] = useState('');
    const [medCategory, setMedCategory] = useState('All');

    const [showDiagDropdown, setShowDiagDropdown] = useState(false);
    const [diagSearch, setDiagSearch] = useState('');
    const [diagCategoryFilter, setDiagCategoryFilter] = useState('All');

    // --- Selection State ---
    const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
    const [selectedDiag, setSelectedDiag] = useState<any>(null);

    // Medication Config
    const [formulation, setFormulation] = useState('');
    const [dosage, setDosage] = useState('');
    const [freqPattern, setFreqPattern] = useState({ morning: true, afternoon: false, night: true, hs: false });
    const [timing, setTiming] = useState('After Meals');
    const [duration, setDuration] = useState('7');
    const [durationUnit, setDurationUnit] = useState('Days');
    const [medInstructions, setMedInstructions] = useState('');

    // Diagnostic Config
    const [diagUrgency, setDiagUrgency] = useState<'Routine' | 'Urgent' | 'STAT'>('Routine');
    const [diagRegion, setDiagRegion] = useState('');
    const [diagMode, setDiagMode] = useState('Plain');
    const [diagInstructions, setDiagInstructions] = useState('');

    // Refs for outside click handling
    const medRef = useRef<HTMLDivElement>(null);
    const diagRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (medRef.current && !medRef.current.contains(e.target as Node)) setShowMedDropdown(false);
            if (diagRef.current && !diagRef.current.contains(e.target as Node)) setShowDiagDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-advice 
    useEffect(() => {
        const d = diagnosis.toLowerCase();
        const found: string[] = [];
        Object.entries(ADVICE_MAP).forEach(([k, v]) => { if (d.includes(k)) found.push(...v); });
        setAutoTips([...new Set(found)]);
    }, [diagnosis]);

    // Handlers
    const handleAddMed = () => {
        if (!selectedMed) return;
        const p = freqPattern;
        const pat = `${p.morning ? '1' : '0'}-${p.afternoon ? '1' : '0'}-${p.night ? '1' : '0'}${p.hs ? ' [HS]' : ''}`;
        const qty = ((p.morning ? 1 : 0) + (p.afternoon ? 1 : 0) + (p.night ? 1 : 0) + (p.hs ? 1 : 0)) * (parseInt(duration) || 1);
        setMedications([...medications, {
            medicationId: selectedMed.id, brandName: selectedMed.brandName, genericName: selectedMed.genericName,
            formulation, dosage, frequency: `${pat} (${timing})`, duration: `${duration} ${durationUnit}`,
            instructions: medInstructions, quantity: qty, cost: selectedMed.costPerUnit * qty
        }]);
        setSelectedMed(null);
        setFreqPattern({ morning: true, afternoon: false, night: true, hs: false });
    };

    const handleAddDiag = () => {
        if (!selectedDiag) return;
        setDiagnosticOrders([...diagnosticOrders, {
            testId: selectedDiag.id, testName: selectedDiag.name, category: selectedDiag.category,
            price: selectedDiag.price, urgency: diagUrgency,
            clinicalIndication: `${diagInstructions}${diagRegion ? ` (${diagRegion})` : ''} ${diagMode !== 'Plain' ? `[${diagMode}]` : ''}`
        }]);
        setSelectedDiag(null);
    };

    const totalMedCost = medications.reduce((s, m) => s + m.cost, 0);
    const totalDiagCost = diagnosticOrders.reduce((s, d) => s + d.price, 0);

    return (
        <div style={{ maxWidth: '1600px', margin: '0 auto', display: 'grid', gridTemplateColumns: showPreview ? '1fr 500px' : '1fr', gap: '30px' }}>

            {/* LEFT: FORM AREA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                {/* 1. Header & Vitals */}
                <div style={{ background: 'white', borderLeft: '8px solid var(--color-brand-primary)', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <img src="/assets/BN_Logo-BlueBG-Square-HD.png" style={{ width: '56px', borderRadius: '14px' }} alt="Logo" />
                            <div>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#1E293B', margin: 0 }}>Smart Clinic Rx</h2>
                                <p style={{ color: '#64748B', fontWeight: 500 }}>{patientName} • {patientAge}y • {patientGender}</p>
                            </div>
                        </div>
                        <button onClick={() => setShowPreview(!showPreview)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px' }}>
                            {showPreview ? <Eye size={20} /> : <Printer size={20} />}
                            {showPreview ? 'Hide Preview' : 'Live Preview'}
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginTop: '30px', padding: '20px', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                        {[
                            { l: 'BP (mmHg)', i: Activity, k: 'bp', p: '120/80' },
                            { l: 'Pulse (bpm)', i: Heart, k: 'pulse', p: '72' },
                            { l: 'Temp (°F)', i: Thermometer, k: 'temp', p: '98.6' },
                            { l: 'Weight (kg)', i: Scale, k: 'weight', p: '70' },
                            { l: 'SpO2 (%)', i: Activity, k: 'spo2', p: '98' }
                        ].map(v => (
                            <div key={v.k}>
                                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}><v.i size={14} /> {v.l}</label>
                                <input
                                    type="text" value={(vitals as any)[v.k]} onChange={e => setVitals({ ...vitals, [v.k]: e.target.value })} placeholder={v.p}
                                    style={{ width: '100%', padding: '12px', border: '2px solid #E2E8F0', borderRadius: '10px', fontSize: '1rem', transition: 'all 0.2s' }}
                                    onFocus={e => e.currentTarget.style.borderColor = 'var(--color-brand-primary)'}
                                    onBlur={e => e.currentTarget.style.borderColor = '#E2E8F0'}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Complaints & Diagnosis */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div>
                            <label style={{ fontWeight: 800, color: '#334155', display: 'block', marginBottom: '10px' }}>Symptoms / Complaints</label>
                            <textarea value={chiefComplaint} onChange={e => setChiefComplaint(e.target.value)} rows={2} style={{ width: '100%', padding: '16px', border: '2px solid #E2E8F0', borderRadius: '14px', fontSize: '1rem' }} />
                        </div>
                        <div>
                            <label style={{ fontWeight: 800, color: '#334155', display: 'block', marginBottom: '10px' }}>Provisional Diagnosis</label>
                            <textarea value={diagnosis} onChange={e => setDiagnosis(e.target.value)} rows={2} style={{ width: '100%', padding: '16px', border: '2px solid #E2E8F0', borderRadius: '14px', fontSize: '1rem' }} placeholder="Try 'hypertension' or 'diabetes'..." />
                        </div>
                    </div>
                </div>

                {/* 3. DROPDOWN MEDICATION SELECTION */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Database size={24} color="var(--color-brand-primary)" /> Select Medications
                    </h3>

                    {/* Active Meds List */}
                    {medications.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                            {medications.map((m, i) => (
                                <div key={i} style={{ padding: '16px 20px', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, color: '#1E293B' }}>{m.brandName} <span style={{ fontWeight: 400, color: '#64748B' }}>({m.genericName})</span></div>
                                        <div style={{ fontSize: '0.9rem', color: '#475569', marginTop: '4px' }}>{m.dosage} • {m.frequency} • {m.duration}</div>
                                    </div>
                                    <button onClick={() => setMedications(medications.filter((_, idx) => idx !== i))} style={{ color: '#EF4444', background: '#FEE2E2', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><X size={18} /></button>
                                </div>
                            ))}
                        </div>
                    )}

                    {!selectedMed ? (
                        <div ref={medRef} style={{ position: 'relative' }}>
                            <div
                                onClick={() => setShowMedDropdown(!showMedDropdown)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 24px',
                                    background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '16px', cursor: 'pointer',
                                    transition: 'all 0.2s', borderColor: showMedDropdown ? 'var(--color-brand-primary)' : '#E2E8F0'
                                }}
                            >
                                <Search size={22} color="#94A3B8" />
                                <input
                                    placeholder="Click to browse or search medicines..."
                                    value={medSearch} onClick={e => e.stopPropagation()}
                                    onChange={e => { setMedSearch(e.target.value); setShowMedDropdown(true); }}
                                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '1.1rem', outline: 'none', fontWeight: 500 }}
                                />
                                {showMedDropdown ? <ChevronUp size={20} color="#64748B" /> : <ChevronDown size={20} color="#64748B" />}
                            </div>

                            {showMedDropdown && (
                                <div style={{ position: 'absolute', top: 'calc(100% + 12px)', left: 0, right: 0, background: 'white', borderRadius: '18px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', zIndex: 1000, overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                                    <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', padding: '16px', background: '#F9FAFB', borderBottom: '1px solid #F1F5F9' }}>
                                        {['All', 'Pain/Fever', 'Antibiotics', 'Diabetes', 'BP/Heart', 'GI', 'Respiratory', 'CNS', 'Vitamins'].map(c => (
                                            <button
                                                key={c} onClick={() => setMedCategory(c)}
                                                style={{
                                                    whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '20px',
                                                    background: medCategory === c ? 'var(--color-brand-primary)' : 'white',
                                                    color: medCategory === c ? 'white' : '#64748B', border: '1px solid #E2E8F0', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer'
                                                }}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                        {medicationDatabase.filter(m => (m.brandName.toLowerCase().includes(medSearch.toLowerCase()) || m.genericName.toLowerCase().includes(medSearch.toLowerCase())) && (medCategory === 'All' || m.category === medCategory)).map(med => (
                                            <div key={med.id} onClick={() => { setSelectedMed(med); setFormulation(med.formulations[0]); setDosage(med.commonDosages[0]); setShowMedDropdown(false); }} style={{ padding: '16px 24px', cursor: 'pointer', borderBottom: '1px solid #F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="hover:bg-blue-50">
                                                <div>
                                                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1E293B' }}>{med.brandName}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>{med.genericName} • {med.category}</div>
                                                </div>
                                                <Plus size={18} color="var(--color-brand-primary)" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '20px', padding: '30px', animation: 'fadeIn 0.2s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#166534' }}>{selectedMed.brandName}</h4>
                                    <p style={{ color: '#15803D' }}>{selectedMed.genericName}</p>
                                </div>
                                <button onClick={() => setSelectedMed(null)} style={{ background: 'transparent', border: 'none' }}><X size={28} color="#166534" /></button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
                                {/* Freq Pattern Grid */}
                                <div>
                                    <label style={{ fontWeight: 800, color: '#166534', display: 'block', marginBottom: '12px', fontSize: '0.9rem' }}>Dosage Pattern (1-1-1-1)</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                        {[
                                            { k: 'morning', l: 'Morn', ic: Sun }, { k: 'afternoon', l: 'Aft', ic: Utensils }, { k: 'night', l: 'Night', ic: Moon }, { k: 'hs', l: 'Bed', ic: Clock }
                                        ].map(f => (
                                            <button key={f.k} onClick={() => setFreqPattern({ ...freqPattern, [f.k]: !(freqPattern as any)[f.k] })} style={{ height: '70px', borderRadius: '14px', border: '1px solid #86EFAC', background: (freqPattern as any)[f.k] ? '#16A34A' : 'white', color: (freqPattern as any)[f.k] ? 'white' : '#166534', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                                <f.ic size={18} /> <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{f.l}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Config Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <label style={{ fontWeight: 800, color: '#166534', marginBottom: '8px', display: 'block', fontSize: '0.8rem' }}>Form & Timing</label>
                                        <select value={formulation} onChange={e => setFormulation(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #86EFAC', marginBottom: '8px' }}>
                                            {selectedMed.formulations.map(f => <option key={f}>{f}</option>)}
                                        </select>
                                        <select value={timing} onChange={e => setTiming(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #86EFAC' }}>
                                            <option>After Meals</option><option>Before Meals</option><option>Empty Stomach</option><option>SOS</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: 800, color: '#166534', marginBottom: '8px', display: 'block', fontSize: '0.8rem' }}>Dose & Days</label>
                                        <select value={dosage} onChange={e => setDosage(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #86EFAC', marginBottom: '8px' }}>
                                            {selectedMed.commonDosages.map(d => <option key={d}>{d}</option>)}
                                        </select>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '60px', padding: '12px', borderRadius: '12px', border: '1px solid #86EFAC' }} />
                                            <select value={durationUnit} onChange={e => setDurationUnit(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #86EFAC' }}>
                                                <option>Days</option><option>Weeks</option><option>Months</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <input value={medInstructions} onChange={e => setMedInstructions(e.target.value)} placeholder="Special Instructions (e.g. Swallow whole, avoid milk)..." style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #86EFAC', marginTop: '20px' }} />
                            <button onClick={handleAddMed} style={{ width: '100%', marginTop: '24px', padding: '18px', background: '#16A34A', color: 'white', borderRadius: '16px', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer', border: 'none', boxShadow: '0 10px 15px -3px rgba(22, 163, 74, 0.4)' }}>
                                <CheckCircle size={22} style={{ verticalAlign: 'middle', marginRight: '10px' }} /> Add to Rx
                            </button>
                        </div>
                    )}
                </div>

                {/* 4. DROPDOWN INVESTIGATION SELECTION */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FlaskConical size={24} color="#6366F1" /> Laboratory & Radiology
                    </h3>

                    {diagnosticOrders.length > 0 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                            {diagnosticOrders.map((d, i) => (
                                <div key={i} style={{ padding: '16px 20px', background: '#EEF2FF', borderRadius: '14px', border: '1px solid #C7D2FE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, color: '#312E81' }}>{d.testName}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#4338CA', marginTop: '4px' }}>[{d.urgency}] — {d.clinicalIndication}</div>
                                    </div>
                                    <button onClick={() => setDiagnosticOrders(diagnosticOrders.filter((_, idx) => idx !== i))} style={{ color: '#EF4444', background: '#F8FAFC', border: 'none', padding: '8px', borderRadius: '10px' }}><X size={18} /></button>
                                </div>
                            ))}
                        </div>
                    )}

                    {!selectedDiag ? (
                        <div ref={diagRef} style={{ position: 'relative' }}>
                            <div
                                onClick={() => setShowDiagDropdown(!showDiagDropdown)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '18px 24px',
                                    background: '#F9FAFB', border: '2px solid #E2E8F0', borderRadius: '16px', cursor: 'pointer',
                                    borderColor: showDiagDropdown ? '#6366F1' : '#E2E8F0'
                                }}
                            >
                                <Database size={22} color="#94A3B8" />
                                <input
                                    placeholder="Click to browse lab tests or scans..."
                                    value={diagSearch} onClick={e => e.stopPropagation()}
                                    onChange={e => { setDiagSearch(e.target.value); setShowDiagDropdown(true); }}
                                    style={{ flex: 1, border: 'none', background: 'transparent', fontSize: '1.1rem', outline: 'none' }}
                                />
                                {showDiagDropdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>
                            {showDiagDropdown && (
                                <div style={{ position: 'absolute', top: 'calc(100% + 12px)', left: 0, right: 0, background: 'white', borderRadius: '18px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', zIndex: 1000, overflow: 'hidden', border: '1px solid #F1F5F9' }}>
                                    <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', padding: '16px', background: '#F9FAFB' }}>
                                        {['All', 'Blood Test', 'X-Ray', 'CT Scan', 'Ultrasound'].map(c => (
                                            <button
                                                key={c} onClick={() => setDiagCategoryFilter(c)}
                                                style={{ whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: '20px', background: diagCategoryFilter === c ? '#6366F1' : 'white', color: diagCategoryFilter === c ? 'white' : '#64748B', border: '1px solid #E2E8F0', fontWeight: 700, fontSize: '0.85rem' }}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                                        {diagnosticTests.filter(t => t.name.toLowerCase().includes(diagSearch.toLowerCase()) && (diagCategoryFilter === 'All' || t.category === diagCategoryFilter)).map(test => (
                                            <div key={test.id} onClick={() => { setSelectedDiag(test); setShowDiagDropdown(false); }} style={{ padding: '16px 24px', cursor: 'pointer', borderBottom: '1px solid #F8FAFC' }} className="hover:bg-indigo-50">
                                                <div style={{ fontWeight: 800, color: '#1E293B' }}>{test.name}</div>
                                                <div style={{ fontSize: '0.85rem', color: '#6366F1' }}>{test.category} • Estimate: ₹{test.price}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ background: '#EEF2FF', border: '2px solid #C7D2FE', borderRadius: '20px', padding: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#312E81' }}>{selectedDiag.name}</h4>
                                    <p style={{ color: '#4338CA' }}>{selectedDiag.category}</p>
                                </div>
                                <button onClick={() => setSelectedDiag(null)} style={{ background: 'transparent', border: 'none' }}><X size={28} color="#312E81" /></button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                                <div><label style={{ fontWeight: 800, fontSize: '0.85rem', color: '#312E81' }}>Urgency</label>
                                    <select value={diagUrgency} onChange={e => setDiagUrgency(e.target.value as any)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #C7D2FE' }}><option>Routine</option><option>Urgent</option><option>STAT</option></select></div>
                                <div><label style={{ fontWeight: 800, fontSize: '0.85rem', color: '#312E81' }}>Region / Site</label>
                                    <input placeholder="E.g. Chest, L-S Spine..." value={diagRegion} onChange={e => setDiagRegion(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #C7D2FE' }} /></div>
                                <div><label style={{ fontWeight: 800, fontSize: '0.85rem', color: '#312E81' }}>Imaging Mode</label>
                                    <select value={diagMode} onChange={e => setDiagMode(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #C7D2FE' }}><option>Plain</option><option>Contrast</option><option>Stress</option></select></div>
                            </div>
                            <input value={diagInstructions} onChange={e => setDiagInstructions(e.target.value)} placeholder="Lab Instructions (e.g. 10 hours fasting)..." style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid #C7D2FE', marginTop: '20px' }} />
                            <button onClick={handleAddDiag} style={{ width: '100%', marginTop: '24px', padding: '18px', background: '#4F46E5', color: 'white', borderRadius: '16px', fontWeight: 900, fontSize: '1.2rem', cursor: 'pointer', border: 'none' }}>
                                Confirm Order
                            </button>
                        </div>
                    )}
                </div>

                {/* 5. SMART ADVICE SECTION (At the Bottom) */}
                <div style={{ background: 'white', borderRadius: '20px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                        <Lightbulb size={28} color="var(--color-brand-primary)" />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Clinical Management & Advice</h3>
                    </div>
                    <textarea
                        value={advice} onChange={e => setAdvice(e.target.value)}
                        placeholder="Type general counselling points or instructions for the patient here..."
                        rows={4} style={{ width: '100%', padding: '20px', border: '2px solid #E2E8F0', borderRadius: '18px', fontSize: '1.1rem' }}
                    />
                    {autoTips.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#64748B', marginBottom: '12px' }}>AI-DETECTED SMART TIPS:</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {autoTips.map((tip, i) => (
                                    <div key={i} style={{ background: '#F0FDFA', color: '#0F766E', fontSize: '0.9rem', padding: '8px 16px', borderRadius: '30px', border: '1px solid #CCFBF1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle size={16} /> {tip}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 6. CONVENIENT SUBMIT FOOTER */}
                <div style={{
                    background: 'white', borderRadius: '24px', padding: '30px', border: '2px solid #F1F5F9',
                    boxShadow: '0 -20px 40px -15px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '40px'
                }}>
                    <div>
                        <div style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 700 }}>Service Fee Estimate</div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-brand-primary)' }}>₹{(totalMedCost + totalDiagCost).toFixed(2)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'right' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', display: 'block' }}>RE-VISIT DATE</label>
                            <input type="date" value={followUpDate} onChange={e => setFollowUpDate(e.target.value)} style={{ padding: '10px 16px', borderRadius: '10px', border: '2px solid #E2E8F0', marginTop: '6px' }} />
                        </div>
                        <button className="btn-primary" style={{ padding: '18px 48px', borderRadius: '16px', fontSize: '1.2rem', fontWeight: 900, background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, #008B9A 100%)', boxShadow: '0 15px 25px -5px rgba(0, 182, 193, 0.4)' }}>
                            <Send size={22} style={{ marginRight: '10px', verticalAlign: 'middle' }} /> Finalize Rx
                        </button>
                    </div>
                </div>

            </div>

            {/* LIVE PREVIEW SIDEBAR */}
            {showPreview && (
                <div style={{ position: 'sticky', top: '24px', height: 'fit-content' }}>
                    <div style={{ background: 'white', padding: '45px', boxShadow: '0 40px 80px -20px rgba(0,0,0,0.2)', borderRadius: '4px', minHeight: '850px', fontSize: '11px', lineHeight: 1.6, color: '#1E293B' }}>

                        {/* Letterhead Header */}
                        <div style={{ borderBottom: '4px solid var(--color-brand-primary)', paddingBottom: '24px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <img src="/assets/BN_Logo-BlueBG-Square-HD.png" style={{ width: '64px', borderRadius: '12px' }} />
                                <div>
                                    <h1 style={{ fontSize: '26px', color: 'var(--color-brand-primary)', margin: 0, fontWeight: 900 }}>Smart Clinic</h1>
                                    <p style={{ margin: 0, color: '#64748B', fontSize: '10px', fontWeight: 600 }}>Integrated Healthcare Solutions</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>Dr. S. Mehta</h3>
                                <p style={{ margin: 0, fontSize: '10px' }}>MBBS, MD (Family Medicine)</p>
                                <p style={{ margin: 0, fontSize: '9px', color: '#64748B' }}>Reg: #MH-123-ABC • +91 9988776655</p>
                            </div>
                        </div>

                        {/* Patient Meta */}
                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', marginBottom: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', border: '1px solid #F1F5F9' }}>
                            <div>
                                <div style={{ fontWeight: 800 }}>PATIENT: {patientName.toUpperCase()}</div>
                                <div style={{ fontSize: '9px', marginTop: '4px' }}>ID: {patientId.toUpperCase()} • AGE/SEX: {patientAge}Y / {patientGender}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700 }}>DATE: {new Date().toLocaleDateString('en-GB')}</div>
                                {vitals.bp && <div style={{ fontSize: '9px', marginTop: '4px' }}>VITALS: BP {vitals.bp} | HR {vitals.pulse} | SpO2 {vitals.spo2}%</div>}
                            </div>
                        </div>

                        {/* Clinical Summary */}
                        <div style={{ marginBottom: '24px' }}>
                            {chiefComplaint && <div style={{ marginBottom: '6px' }}><strong style={{ color: 'var(--color-brand-primary)' }}>C/O:</strong> {chiefComplaint}</div>}
                            {diagnosis && <div><strong style={{ color: 'var(--color-brand-primary)' }}>DIAGNOSIS:</strong> {diagnosis.toUpperCase()}</div>}
                        </div>

                        {/* Rx Section */}
                        <div style={{ marginBottom: '30px' }}>
                            <div style={{ fontSize: '32px', fontWeight: 900, color: 'var(--color-brand-primary)', fontFamily: 'serif', marginBottom: '16px' }}>℞</div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #CBD5E1' }}>
                                        <th style={{ padding: '8px 0', fontSize: '9px', color: '#94A3B8' }}>DRUG NAME / GENERIC</th>
                                        <th style={{ padding: '8px 0', fontSize: '9px', color: '#94A3B8' }}>MODE & FREQ</th>
                                        <th style={{ padding: '8px 0', fontSize: '9px', color: '#94A3B8' }}>DURATION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medications.map((m, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '12px 0' }}>
                                                <div style={{ fontWeight: 900, fontSize: '13px' }}>{m.brandName}</div>
                                                <div style={{ color: '#64748B', fontSize: '9px' }}>({m.genericName}) • {m.formulation}</div>
                                                {m.instructions && <div style={{ color: 'var(--color-brand-primary)', fontSize: '9px', fontStyle: 'italic', marginTop: '2px' }}>* {m.instructions}</div>}
                                            </td>
                                            <td style={{ padding: '12px 0' }}>
                                                <div style={{ fontWeight: 800 }}>{m.frequency}</div>
                                                <div style={{ fontSize: '9px', color: '#64748B' }}>{m.dosage}</div>
                                            </td>
                                            <td style={{ padding: '12px 0', fontWeight: 700 }}>{m.duration.toUpperCase()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Investigations Section */}
                        {diagnosticOrders.length > 0 && (
                            <div style={{ marginBottom: '30px', padding: '16px', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                                <div style={{ fontWeight: 900, color: 'var(--color-brand-primary)', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px', marginBottom: '10px' }}>PROPOSED INVESTIGATIONS</div>
                                {diagnosticOrders.map((d, i) => (
                                    <div key={i} style={{ marginBottom: '6px', display: 'flex', gap: '8px' }}>
                                        <div style={{ color: 'var(--color-brand-primary)', fontWeight: 900 }}>•</div>
                                        <div>
                                            <span style={{ fontWeight: 800 }}>{d.testName}</span>
                                            <span style={{ color: '#64748B', marginLeft: '6px' }}>({d.clinicalIndication})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Management Advice */}
                        {(autoTips.length > 0 || advice) && (
                            <div style={{ marginBottom: '40px' }}>
                                <div style={{ fontWeight: 900, fontSize: '12px', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px', marginBottom: '10px' }}>LIFESTYLE & RECOVERY ADVICE</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    {autoTips.map((tip, i) => <div key={i} style={{ color: '#475569' }}>- {tip}</div>)}
                                </div>
                                {advice && <div style={{ marginTop: '12px', background: '#F8FAFC', padding: '12px', border: '1px dotted #CBD5E1', borderRadius: '4px' }}>{advice}</div>}
                            </div>
                        )}

                        {/* Sig Footer */}
                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '40px' }}>
                            <div>
                                {followUpDate && <div style={{ fontWeight: 900, color: 'var(--color-brand-primary)', fontSize: '13px' }}>REVIEW VISIT: {new Date(followUpDate).toLocaleDateString('en-GB')}</div>}
                                <div style={{ fontSize: '8px', color: '#94A3B8', marginTop: '10px' }}>Generated via Smart Clinic Portal • Valid Signature Required</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ height: '50px' }}></div>
                                <div style={{ borderTop: '2px solid #1E293B', width: '200px', fontWeight: 900, paddingTop: '4px', fontSize: '12px' }}>DR. S. MEHTA</div>
                                <div style={{ fontSize: '9px', color: '#64748B' }}>Authorized Medical Practitioner</div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
