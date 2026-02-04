export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: string;
    time: string;
    reasonForVisit: string;
    riskLevel: 'Critical' | 'High' | 'Monitor' | 'Stable';
    status: 'Waiting' | 'In Progress' | 'Completed' | 'Done' | 'Seen' | 'Scheduled' | 'Rescheduled' | 'Cancelled';

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

    // Structured Data for Specialty Triggers
    vitals?: {
        temp?: number;
        spo2?: number;
        bps?: number;
        bpd?: number;
        heartRate?: number;
        rr?: number;
    };
    symptoms?: string[];
}

export const patients: Patient[] = [
    {
        id: '1',
        name: 'Aarav Malhotra',
        age: 42,
        gender: 'M',
        time: '09:00 AM',
        reasonForVisit: 'High Fever & Body Ache',
        riskLevel: 'Monitor',
        status: 'Waiting',
        redFlags: ['Fever since 4 days', 'Chills during night'],
        careGaps: ['Annual labs pending', 'Malaria/Dengue screen suggested'],
        medDeltas: ['Started Paracetamol 650mg SOS'],
        intakeSummary: 'Patient reports high grade fever (up to 102F). Severe myalgia and retro-orbital pain. No rash or bleeding noted.',
        medications: {
            current: ['Paracetamol 650mg SOS'],
            new: ['Dolo 650 BD', 'ORS Sachet']
        },
        vitals: { temp: 102.1, bps: 120, bpd: 80, spo2: 98, heartRate: 92, rr: 18 },
        symptoms: ['fever', 'body ache', 'myalgia']
    },
    {
        id: '2',
        name: 'Baby Kyra Singh',
        age: 0.8,
        gender: 'F',
        time: '09:15 AM',
        reasonForVisit: 'Neonatal Fever & Lethargy',
        riskLevel: 'Critical',
        status: 'In Progress',
        redFlags: ['Age < 1yr + Temp > 101F', 'Decreased urine output'],
        careGaps: ['Vaccination schedule review needed', 'Weight-for-age trajectory drop'],
        medDeltas: ['Formula intake reduced by 50%'],
        intakeSummary: 'Mother reports infant is unusually sleepy. Fever started last night. Refusing to feed. Fontanelle appears normal.',
        medications: {
            current: [],
            new: ['Pediatric Paracetamol drops (Weight-based)']
        },
        vitals: { temp: 101.5, bps: 85, bpd: 55, spo2: 96, heartRate: 145, rr: 40 },
        symptoms: ['poor feeding', 'lethargy', 'fever']
    },
    {
        id: '3',
        name: 'Zoya Sheikh',
        age: 68,
        gender: 'F',
        time: '09:30 AM',
        reasonForVisit: 'Severe Dizziness & Blurry Vision',
        riskLevel: 'Critical',
        status: 'Waiting',
        redFlags: ['BP 190/110 Measured', 'History of Grade 3 HTN'],
        careGaps: ['Cardiology Consult Overdue', 'Metabolic panel pending'],
        medDeltas: ['Missed Telmisartan doses last week'],
        intakeSummary: 'Patient complaining of heavy-headedness and visual blurring. History of uncontrolled hypertension. Non-adherent to sodium restriction.',
        medications: {
            current: ['Telmisartan 40mg OD', 'Amlodipine 5mg OD'],
            new: ['Chlorthalidone 12.5mg OD']
        },
        vitals: { temp: 98.4, bps: 195, bpd: 112, spo2: 97, heartRate: 72, rr: 16 },
        symptoms: ['dizziness', 'vision blurring', 'headache']
    },
    {
        id: '4',
        name: 'Vihaan Kapoor',
        age: 24,
        gender: 'M',
        time: '09:45 AM',
        reasonForVisit: 'Suspected Fracture - Right Leg',
        riskLevel: 'Critical',
        status: 'Waiting',
        redFlags: ['Visible deformity', 'Unable to bear weight', 'Severe edema'],
        careGaps: ['X-ray referral urgent', 'Pain management stabilization'],
        medDeltas: ['Ice packs applied by patient'],
        intakeSummary: 'Fell while playing football. Immediate pain and snapping sound. No open wound. Distal pulses present but weak due to swelling.',
        medications: {
            current: [],
            new: ['Tramadol 50mg SOS', 'Diclofenac Gel']
        },
        vitals: { temp: 98.6, bps: 130, bpd: 85, spo2: 99, heartRate: 105, rr: 20 },
        symptoms: ['deformity', 'unable to bear weight', 'acute pain']
    },
    {
        id: '5',
        name: 'Meera Iyer',
        age: 34,
        gender: 'F',
        time: '10:00 AM',
        reasonForVisit: 'Acute Anxiety & Panic Attack',
        riskLevel: 'Monitor',
        status: 'Waiting',
        redFlags: ['Moderate PHQ-9 Score', 'Self-harm ideation reported'],
        careGaps: ['Therapy referral pending', 'Sleep hygiene counseling needed'],
        medDeltas: ['Stopped taking Lexapro 3 weeks ago'],
        intakeSummary: 'Patient reports racing heart, shortness of breath, and impending sense of doom. Work-related stressors cited. History of GAD.',
        medications: {
            current: ['Lexapro 10mg OD (Self-stopped)'],
            new: ['Alprazolam 0.25mg PRN', 'Escitalopram 10mg OD']
        },
        vitals: { temp: 98.2, bps: 145, bpd: 90, spo2: 98, heartRate: 110, rr: 24 },
        symptoms: ['ideation', 'agitation', 'palpitations']
    },
    {
        id: '6',
        name: 'Kabir Das',
        age: 62,
        gender: 'M',
        time: '10:15 AM',
        reasonForVisit: 'Shortness of Breath - COPD Exacerbation',
        riskLevel: 'Critical',
        status: 'Waiting',
        redFlags: ['SpO2 89% on Room Air', 'Use of accessory muscles'],
        careGaps: ['PFT Overdue', 'Home Oxygen evaluation needed'],
        medDeltas: ['Increased Inhaler use to 6x/day'],
        intakeSummary: 'Known case of COPD. Progressive breathlessness since 2 days. Productive cough with yellowish sputum. Smoker (40 pack-years).',
        medications: {
            current: ['Tiotropium Inhaler', 'Salbutamol SOS'],
            new: ['Prednisolone 20mg OD x 5days', 'Augmentin 625mg BD']
        },
        vitals: { temp: 99.1, bps: 135, bpd: 88, spo2: 89, heartRate: 98, rr: 28 },
        symptoms: ['shortness of breath', 'productive cough']
    },
    {
        id: '7',
        name: 'Sanya Verma',
        age: 28,
        gender: 'F',
        time: '10:30 AM',
        reasonForVisit: 'Severe Migraine - Post Aura',
        riskLevel: 'Monitor',
        status: 'Waiting',
        redFlags: ['Worsening frequency (3/wk)', 'Nausea/Vomiting present'],
        careGaps: ['MRI Brain scheduled (Pending)', 'Trigger diary review'],
        medDeltas: ['Sumatriptan not effective'],
        intakeSummary: 'Patient in darkened room. Reports photophobia and phonophobia. Pain score 9/10 (unilateral). No focal neuro deficits.',
        medications: {
            current: ['Naproxen 500mg SOS'],
            new: ['Rizatriptan 10mg SOD', 'Propranolol 20mg BD']
        },
        vitals: { temp: 98.4, bps: 115, bpd: 75, spo2: 99, heartRate: 80, rr: 16 },
        symptoms: ['headache', 'nausea', 'photophobia']
    },
    {
        id: '8',
        name: 'Advait Joshi',
        age: 8,
        gender: 'M',
        time: '10:45 AM',
        reasonForVisit: 'Routine Growth & Wellness Visit',
        riskLevel: 'Stable',
        status: 'Waiting',
        redFlags: [],
        careGaps: ['Flu shot due', 'Vision screening pending'],
        medDeltas: ['Transitioned to whole milk diet'],
        intakeSummary: 'Doing well in school. Active in sports. No chronic issues. Parents concerned about picky eating habits.',
        medications: {
            current: ['Multivitamin syrup'],
            new: []
        },
        vitals: { temp: 98.6, bps: 105, bpd: 65, spo2: 98, heartRate: 88, rr: 20 },
        symptoms: []
    },
    {
        id: '9',
        name: 'Riya Mittal',
        age: 54,
        gender: 'F',
        time: '11:00 AM',
        reasonForVisit: 'Palpitations & Fatigue',
        riskLevel: 'Monitor',
        status: 'Waiting',
        redFlags: ['Pulse irregularity detected', 'Mild pedal edema'],
        careGaps: ['Thyroid panel labs pending', 'Holter monitoring needed'],
        medDeltas: ['Started Yoga to manage stress'],
        intakeSummary: 'Intermittent thumping in chest. Not associated with exertion. Mild swelling in ankles by evening. No nocturnal dyspnea.',
        medications: {
            current: [],
            new: ['Metoprolol 25mg OD', 'TSH/Free T4 Labs']
        },
        vitals: { temp: 98.3, bps: 138, bpd: 88, spo2: 97, heartRate: 115, rr: 18 },
        symptoms: ['palpitations', 'fatigue']
    },
    {
        id: '10',
        name: 'Aryan Goel',
        age: 40,
        gender: 'M',
        time: '11:15 AM',
        reasonForVisit: 'Chronic Lower Back Pain - Radiculopathy',
        riskLevel: 'Monitor',
        status: 'Waiting',
        redFlags: ['Numbness in left calf', 'Reduced ankle reflex'],
        careGaps: ['Workplace ergonomics review', 'PT compliance check'],
        medDeltas: ['Gabapentin trial started'],
        intakeSummary: 'Pain radiating from L4-L5 to calf. Worse with long driving hours. No bowel/bladder incontinence. SLR test positive at 45 degrees.',
        medications: {
            current: ['Gabapentin 300mg HS'],
            new: ['Pregabalin 75mg HS', 'Core Strengthening PT']
        },
        vitals: { temp: 98.5, bps: 125, bpd: 82, spo2: 99, heartRate: 74, rr: 14 },
        symptoms: ['numbness', 'back pain']
    },
    {
        id: '11',
        name: 'Sanya Sharma',
        age: 26,
        gender: 'F',
        time: '11:30 AM',
        reasonForVisit: 'PCOS Follow-up & Weight Management',
        riskLevel: 'Stable',
        status: 'Waiting',
        redFlags: ['Weight gain +5kg in 3mo', 'Amenorrhea x 4mo'],
        careGaps: ['Pelvic Ultrasound Overdue', 'Metformin titration check'],
        medDeltas: ['Low carb diet adherence poor'],
        intakeSummary: 'Hirsutism and acne persistent. Tapering off birth control pills. Concerned about future fertility.',
        medications: {
            current: ['Metformin 500mg BD'],
            new: ['Inositol Supplement', 'Spironolactone 50mg OD']
        },
        vitals: { temp: 98.4, bps: 118, bpd: 78, spo2: 98, heartRate: 76, rr: 16 },
        symptoms: ['weight gain', 'amenorrhea']
    },
    {
        id: '12',
        name: 'Ishwar Chand',
        age: 74,
        gender: 'M',
        time: '11:45 AM',
        reasonForVisit: 'Post-Op Follow-up: Hip Replacement',
        riskLevel: 'Stable',
        status: 'Waiting',
        redFlags: ['Mild surgical site redness'],
        careGaps: ['Incision site dressing change', 'Suture removal scheduled'],
        medDeltas: ['Transitioning from Walker to Cane'],
        intakeSummary: '3 weeks post-THR. Doing well with physiotherapy. Pain controlled. No calf pain or fever reported.',
        medications: {
            current: ['Aspirin 75mg OD (DVT Prophylaxis)'],
            new: ['Continue Physiotherapy']
        },
        vitals: { temp: 98.2, bps: 122, bpd: 76, spo2: 97, heartRate: 68, rr: 16 },
        symptoms: ['mild redness']
    }
];
