export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    time: string;
    reasonForVisit: string;
    riskLevel: 'Critical' | 'Monitor' | 'Stable';
    status: 'Waiting' | 'In Progress' | 'Done';

    // Context Lens Data
    redFlags: string[];
    careGaps: string[];
    medDeltas: string[];

    // Intake Data (for SOAP pre-population)
    intakeSummary: string;

    // Medications
    medications?: {
        current: string[];
        new?: string[];
    };
}

export const patients: Patient[] = [
    {
        id: '1',
        name: 'Saanvi Sharma',
        age: 45,
        gender: 'F',
        time: '09:00 AM',
        reasonForVisit: 'Follow-up: Diabetes Type 2',
        riskLevel: 'Critical',
        status: 'Waiting',
        redFlags: ['Last A1c 8.2% (↑1.5%)', 'BP 160/95 verified', 'Microalbuminuria detected'],
        careGaps: ['Missed Ophth Exam (6mo overdue)', 'Flu Shot overdue', 'Diabetic foot exam pending'],
        medDeltas: ['Metformin refill due', 'Started self-monitoring'],
        intakeSummary: 'Patient reports increased thirst, polyuria, and fatigue. Monitors BG sporadically. High work stress. Diet compliance poor.',
        medications: {
            current: ['Metformin 500mg BD', 'Telmisartan 40mg OD'],
            new: ['Metformin 850mg BD', 'Atorvastatin 10mg HS']
        }
    },
    {
        id: '2',
        name: 'Rajesh Patel',
        age: 62,
        gender: 'M',
        time: '09:15 AM',
        reasonForVisit: 'Chest Pain (Resolved) - F/U',
        riskLevel: 'Monitor',
        status: 'In Progress',
        redFlags: ['ER Visit 2wks ago (Chest Pain)', 'Allergy: Penicillin, Sulfa'],
        careGaps: ['Cardiology Consult Pending', 'Lipid panel overdue'],
        medDeltas: ['Lipitor non-adherent (missed 40%)', 'Aspirin 75mg added in ER'],
        intakeSummary: 'ER workup: Non-cardiac chest pain, likely GERD. EKG normal. Troponin negative. Requests clearance for morning walks.',
        medications: {
            current: ['Aspirin 75mg OD', 'Pantoprazole 40mg OD'],
            new: ['Atorvastatin 40mg HS']
        }
    },
    {
        id: '3',
        name: 'Priya Iyer',
        age: 28,
        gender: 'F',
        time: '09:30 AM',
        reasonForVisit: 'Annual Physical + Contraception',
        riskLevel: 'Stable',
        status: 'Waiting',
        redFlags: [],
        careGaps: ['Pap Smear due (3yr interval)', 'Tdap booster due'],
        medDeltas: [],
        intakeSummary: 'No acute complaints. Active lifestyle, Yoga 4x/week. Vegetarian diet. Considering IUD placement.',
        medications: {
            current: [],
            new: []
        }
    },
    {
        id: '4',
        name: 'Amit Verma',
        age: 55,
        gender: 'M',
        time: '09:45 AM',
        reasonForVisit: 'Hypertension Check',
        riskLevel: 'Stable',
        status: 'Waiting',
        redFlags: [],
        careGaps: [],
        medDeltas: ['Lisinopril refill', 'HCTZ added last visit'],
        intakeSummary: 'Home BP log: avg 125/80. No orthostatic symptoms. Mild dry cough (ACE-I side effect?).',
        medications: {
            current: ['Lisinopril 10mg OD'],
            new: ['Hydrochlorothiazide 12.5mg OD']
        }
    },
    {
        id: '5',
        name: 'Kavya Reddy',
        age: 34,
        gender: 'F',
        time: '10:00 AM',
        reasonForVisit: 'Migraine - Uncontrolled',
        riskLevel: 'Monitor',
        status: 'Waiting',
        redFlags: ['Migraine frequency ↑ to 3x/week', 'Photophobia worsening'],
        careGaps: ['MRI Brain (ordered, pending)'],
        medDeltas: ['Sumatriptan 50mg PRN not effective', 'Propranolol trial requested'],
        intakeSummary: 'Aura present. Triggers: stress, lack of sleep. Menstrual pattern noted. No vision changes outside aura.',
        medications: {
            current: ['Sumatriptan 50mg SOS'],
            new: ['Propranolol 40mg BD', 'Naproxen 500mg SOS']
        }
    },
    {
        id: '6',
        name: 'Arjun Desai',
        age: 42,
        gender: 'M',
        time: '10:15 AM',
        reasonForVisit: 'Lower Back Pain (Chronic)',
        riskLevel: 'Stable',
        status: 'Waiting',
        redFlags: [],
        careGaps: ['PT compliance poor (2/8 sessions attended)'],
        medDeltas: ['Naproxen 500mg BD as needed'],
        intakeSummary: 'Pain worsens with prolonged sitting (IT job). No radiculopathy. Denies trauma. Core strength exercises recommended.',
        medications: {
            current: [],
            new: ['Diclofenac Gel SOS', 'Vitamin D3 60k weekly']
        }
    },
    {
        id: '7',
        name: 'Meera Krishnan',
        age: 68,
        gender: 'F',
        time: '10:30 AM',
        reasonForVisit: 'Post-Op F/U: Cataract Surgery',
        riskLevel: 'Stable',
        status: 'Waiting',
        redFlags: [],
        careGaps: [],
        medDeltas: ['Moxifloxacin eye drops (to be discontinued)', 'Prednisolone taper ongoing'],
        intakeSummary: 'Vision improving as expected. No pain, discharge, or floaters. Ophth discharge summary reviewed.',
        medications: {
            current: ['Prednisolone Eye Drops taper'],
            new: []
        }
    },
    {
        id: '8',
        name: 'Vikram Singh',
        age: 51,
        gender: 'M',
        time: '10:45 AM',
        reasonForVisit: 'Dyslipidemia + Pre-Diabetes',
        riskLevel: 'Monitor',
        status: 'Waiting',
        redFlags: ['Fasting BG 118 mg/dL', 'LDL 165 mg/dL', 'Waist circumference 102cm'],
        careGaps: ['Lifestyle counseling scheduled', 'Dietician referral pending'],
        medDeltas: [],
        intakeSummary: 'Family hx: Father T2DM at age 50. Sedentary job. Alcohol: 2-3 drinks/week. Motivated for change.',
        medications: {
            current: [],
            new: ['Rosuvastatin 10mg HS']
        }
    },
    {
        id: '9',
        name: 'Ananya Gupta',
        age: 23,
        gender: 'F',
        time: '11:00 AM',
        reasonForVisit: 'Upper Respiratory Infection',
        riskLevel: 'Stable',
        status: 'Waiting',
        redFlags: [],
        careGaps: [],
        medDeltas: [],
        intakeSummary: 'Sore throat (3 days), rhinorrhea, mild cough. No fever. Exposure: colleague with similar sx. No strep indicators.',
        medications: {
            current: [],
            new: ['Azithromycin 500mg OD x 3days', 'Levocetirizine 5mg HS']
        }
    },
    {
        id: '10',
        name: 'Harish Menon',
        age: 39,
        gender: 'M',
        time: '11:15 AM',
        reasonForVisit: 'Anxiety + Insomnia',
        riskLevel: 'Monitor',
        status: 'Waiting',
        redFlags: ['PHQ-9 score: 12 (moderate)', 'GAD-7 score: 14 (moderate)'],
        careGaps: ['Psychiatry consult offered (patient declined)', 'CBT-I resources provided'],
        medDeltas: ['Escitalopram 10mg trial proposed'],
        intakeSummary: 'Work-related stress. Sleep latency >1hr. Denies SI/HI. Interested in therapy + possible medication.',
        medications: {
            current: [],
            new: ['Escitalopram 10mg OD', 'Zolpidem 5mg SOS']
        }
    },
    {
        id: '11',
        name: 'Divya Nair',
        age: 31,
        gender: 'F',
        time: '11:30 AM',
        reasonForVisit: 'Hypothyroidism - Medication Adjustment',
        riskLevel: 'Stable',
        status: 'Waiting',
        redFlags: [],
        careGaps: [],
        medDeltas: ['Levothyroxine 75mcg → 88mcg (per TSH 6.7)'],
        intakeSummary: 'Fatigue persisting despite previous dose. TSH rechecked. No cardiac symptoms. Compliance good.',
        medications: {
            current: ['Levothyroxine 75mcg OD'],
            new: ['Levothyroxine 88mcg OD']
        }
    },
    {
        id: '12',
        name: 'Karthik Bose',
        age: 29,
        gender: 'M',
        time: '11:45 AM',
        reasonForVisit: 'Sports Physical (Cricket)',
        riskLevel: 'Stable',
        status: 'Waiting',
        redFlags: [],
        careGaps: [],
        medDeltas: [],
        intakeSummary: 'Preparing for district tournament. No injuries. Hydration and heat management counseling needed.',
        medications: {
            current: [],
            new: []
        }
    }
];
