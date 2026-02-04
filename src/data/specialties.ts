import { SpecialtyConfig } from '../types/specialty';

export const SPECIALTIES: Record<string, SpecialtyConfig> = {
    general: {
        id: 'general',
        label: 'General Medicine',
        dashboardAccent: { primary: '#00B6C1', subtle: '#F0FDFA' },
        riskTriggers: [
            { id: 'fever', label: 'Persistent Fever', severity: 'Monitor', condition: (p) => p.vitals?.temp > 101 },
            { id: 'o2', label: 'Hypoxia', severity: 'Critical', condition: (p) => p.vitals?.spo2 < 94 },
        ],
        contextLensSections: [
            { id: 'safety', label: 'Safety' },
            { id: 'gaps', label: 'Gaps' }
        ],
        soapTemplate: {
            subjective: 'Chief Complaint:\nHistory of Presenting Illness:',
            objective: 'General Appearance:\nVitals:\nSystemic Exam:',
            assessment: 'Provisional Diagnosis:\nDifferential Diagnosis:',
            plan: 'Investigations:\nTreatment Name:\nFollow-up:'
        },
        orderingShortcuts: [
            { id: 'cbc', label: 'CBC', type: 'Lab' },
            { id: 'cxr', label: 'Chest X-Ray', type: 'Imaging' }
        ]
    },
    pediatrics: {
        id: 'pediatrics',
        label: 'Pediatrics',
        dashboardAccent: { primary: '#3B82F6', subtle: '#EFF6FF' },
        riskTriggers: [
            { id: 'peds_fever', label: 'Neonatal Fever', severity: 'Critical', condition: (p) => p.age < 1 && p.vitals?.temp > 100.4 },
            { id: 'feeding', label: 'Poor Feeding', severity: 'Monitor', condition: (p) => p.symptoms?.includes('poor feeding') }
        ],
        contextLensSections: [
            { id: 'safety', label: 'Safety' },
            { id: 'deltas', label: 'Growth Deltas' }
        ],
        soapTemplate: {
            subjective: 'Birth History:\nFeeding Pattern:\nDevelopmental Milestones:',
            objective: 'Growth Percentiles:\nActivity Level:\nHydration Signs:',
            assessment: 'Developmental Status:\nAcute Diagnosis:',
            plan: 'Vaccination Update:\nMedication Dosage (by weight):'
        },
        orderingShortcuts: [
            { id: 'crp', label: 'CRP', type: 'Lab' },
            { id: 'urine', label: 'Urine Routine', type: 'Lab' }
        ]
    },
    cardiology: {
        id: 'cardiology',
        label: 'Cardiology',
        dashboardAccent: { primary: '#EF4444', subtle: '#FEF2F2' },
        riskTriggers: [
            { id: 'bp_crisis', label: 'Hypertensive Crisis', severity: 'Critical', condition: (p) => p.vitals?.bps >= 180 || p.vitals?.bpd >= 110 },
            { id: 'tachy', label: 'Acute Tachycardia', severity: 'Critical', condition: (p) => (p.vitals?.heartRate || 0) > 130 },
            { id: 'brady', label: 'Symptomatic Bradycardia', severity: 'Critical', condition: (p) => (p.vitals?.heartRate || 100) < 45 },
            { id: 'ascvd_high', label: 'ASCVD High Risk', severity: 'Monitor', condition: (p) => p.age > 65 && p.symptoms?.includes('chest pain') }
        ],
        contextLensSections: [
            { id: 'safety', label: 'Cardiac Safety' },
            { id: 'trends', label: 'ECG & Hemodynamics' },
            { id: 'meds', label: 'Cardiac Med Audit' }
        ],
        soapTemplate: {
            subjective: 'Chest Pain (PQRST):\nDyspnea (NYHA Class I-IV):\nSyncope/Presyncope:',
            objective: 'Heart Sounds (S1, S2, Murmurs):\nJVP Level:\nEdema (Pitting/Non-pitting):\nPulses (Radial/Pedal):',
            assessment: 'Cardiac Impression:\nASCVD 10-Yr Risk %:',
            plan: '1. Med Titration:\n2. ECHO/Stress Test:\n3. Cardiology Consult:'
        },
        orderingShortcuts: [
            { id: 'ecg_stat', label: 'STAT ECG', type: 'Imaging' },
            { id: 'echo', label: '2D ECHO', type: 'Imaging' },
            { id: 'trop_i', label: 'Troponin I', type: 'Lab' },
            { id: 'aspirin', label: 'Aspirin 81mg', type: 'Medication' },
            { id: 'clopidogrel', label: 'Clopidogrel 75mg', type: 'Medication' },
            { id: 'atorvastatin', label: 'Atorvastatin 40mg', type: 'Medication' },
            { id: 'metoprolol', label: 'Metoprolol 25mg', type: 'Medication' },
            { id: 'ramipril', label: 'Ramipril 5mg', type: 'Medication' },
            { id: 'furosemide', label: 'Furosemide 40mg', type: 'Medication' }
        ]
    },
    orthopedics: {
        id: 'orthopedics',
        label: 'Orthopedics',
        dashboardAccent: { primary: '#64748B', subtle: '#F1F5F9' },
        riskTriggers: [
            { id: 'fracture', label: 'Suspected Fracture', severity: 'Critical', condition: (p) => p.symptoms?.includes('deformity') || p.symptoms?.includes('unable to bear weight') },
            { id: 'neuro', label: 'Neurovascular Risk', severity: 'Critical', condition: (p) => p.symptoms?.includes('numbness') }
        ],
        contextLensSections: [
            { id: 'safety', label: 'Structural Safety' },
            { id: 'deltas', label: 'Mobility Trends' }
        ],
        soapTemplate: {
            subjective: 'Mechanism of Injury:\nPain Site (VAS Score):',
            objective: 'Neurovascular Status:\nROM (Active/Passive):\nDeformity/Swelling:',
            assessment: 'Structural Injury Dx:\nSurgical Necessity:',
            plan: 'Immobilization Type:\nImaging Referral:'
        },
        orderingShortcuts: [
            { id: 'xr_joint', label: 'X-Ray Site-Specific', type: 'Imaging' },
            { id: 'mri_spine', label: 'MRI Spine/Joint', type: 'Imaging' }
        ]
    },
    psychiatry: {
        id: 'psychiatry',
        label: 'Psychiatry',
        dashboardAccent: { primary: '#6366F1', subtle: '#EEF2FF' },
        riskTriggers: [
            { id: 'suicide', label: 'Self-Harm Risk', severity: 'Critical', condition: (p) => p.symptoms?.includes('ideation') },
            { id: 'agitation', label: 'Acute Agitation', severity: 'Monitor', condition: (p) => p.symptoms?.includes('agitation') }
        ],
        contextLensSections: [
            { id: 'safety', label: 'Risk Stratification' },
            { id: 'deltas', label: 'Mood Trends' }
        ],
        soapTemplate: {
            subjective: 'Sleep Pattern:\nAppetite/Energy:\nThought Content:',
            objective: 'Mental Status Exam (MSE):\nScreening Tool Scores (PHQ9):',
            assessment: 'Functional Impairment:\nPsychiatric Diagnosis:',
            plan: 'Therapy Referral:\nAdherence Protocol:'
        },
        orderingShortcuts: [
            { id: 'phq9', label: 'PHQ-9 Scale', type: 'Lab' },
            { id: 'gad7', label: 'GAD-7 Scale', type: 'Lab' }
        ]
    },
    pulmonology: {
        id: 'pulmonology',
        label: 'Pulmonology',
        dashboardAccent: { primary: '#0EA5E9', subtle: '#F0F9FF' },
        riskTriggers: [
            { id: 'spo2_low', label: 'Low Oxygen', severity: 'Critical', condition: (p) => p.vitals?.spo2 < 92 },
            { id: 'rr_high', label: 'Tachypnea', severity: 'Monitor', condition: (p) => p.vitals?.rr > 24 }
        ],
        contextLensSections: [
            { id: 'safety', label: 'Respiratory Safety' },
            { id: 'deltas', label: 'Oxygen Trends' }
        ],
        soapTemplate: {
            subjective: 'Smoking History:\nCough Pattern:\nNight Symptoms:',
            objective: 'Lung Auscultation:\nPeak Flow Value:\nChest Wall Expansion:',
            assessment: 'COPD/Asthma Stage:\nExacerbation Risk:',
            plan: 'Inhaler Technique Review:\nPFT Scheduling:'
        },
        orderingShortcuts: [
            { id: 'pft', label: 'Pulmonary Function Test', type: 'Lab' },
            { id: 'abg', label: 'Arterial Blood Gas', type: 'Lab' }
        ]
    }
};
