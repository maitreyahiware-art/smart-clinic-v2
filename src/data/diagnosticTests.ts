export interface DiagnosticTest {
    id: string;
    name: string;
    category: 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound' | 'Blood Test' | 'ECG' | 'Other';
    description: string;
    price: number;
    duration: string; // Time to get results
    preparation?: string;
    commonReasons: string[];
}

export const diagnosticTests: DiagnosticTest[] = [
    // X-Ray
    {
        id: 'xray_001',
        name: 'Chest X-Ray (PA & Lateral)',
        category: 'X-Ray',
        description: 'Standard chest imaging for respiratory conditions',
        price: 450,
        duration: '2 hours',
        commonReasons: ['Cough', 'Chest pain', 'Shortness of breath', 'Pneumonia screening']
    },
    {
        id: 'xray_002',
        name: 'Abdomen X-Ray',
        category: 'X-Ray',
        description: 'Abdominal imaging for GI issues',
        price: 400,
        duration: '2 hours',
        commonReasons: ['Abdominal pain', 'Suspected obstruction', 'Kidney stones']
    },
    {
        id: 'xray_003',
        name: 'Spine X-Ray (Lumbar)',
        category: 'X-Ray',
        description: 'Lower back imaging',
        price: 550,
        duration: '2-3 hours',
        commonReasons: ['Lower back pain', 'Sciatica', 'Trauma']
    },
    {
        id: 'xray_004',
        name: 'Knee X-Ray (Both Views)',
        category: 'X-Ray',
        description: 'Knee joint imaging',
        price: 500,
        duration: '2 hours',
        commonReasons: ['Knee pain', 'Arthritis', 'Sports injury']
    },

    // CT Scans
    {
        id: 'ct_001',
        name: 'CT Scan - Brain (Non-Contrast)',
        category: 'CT Scan',
        description: 'Detailed brain imaging',
        price: 3500,
        duration: '24 hours',
        commonReasons: ['Headache', 'Stroke screening', 'Head trauma', 'Seizures']
    },
    {
        id: 'ct_002',
        name: 'CT Scan - Chest',
        category: 'CT Scan',
        description: 'High-resolution chest imaging',
        price: 4200,
        duration: '24 hours',
        preparation: 'Fasting 4 hours if contrast required',
        commonReasons: ['Lung nodule', 'Chronic cough', 'Cancer screening']
    },
    {
        id: 'ct_003',
        name: 'CT Scan - Abdomen & Pelvis',
        category: 'CT Scan',
        description: 'Complete abdominal imaging',
        price: 5000,
        duration: '24-48 hours',
        preparation: 'Fasting 6 hours, oral contrast may be needed',
        commonReasons: ['Abdominal pain', 'Appendicitis', 'Kidney stones', 'Cancer staging']
    },

    // MRI
    {
        id: 'mri_001',
        name: 'MRI - Brain',
        category: 'MRI',
        description: 'Advanced brain imaging',
        price: 6500,
        duration: '48 hours',
        preparation: 'Remove all metal objects',
        commonReasons: ['Multiple sclerosis', 'Brain tumor', 'Stroke evaluation']
    },
    {
        id: 'mri_002',
        name: 'MRI - Spine (Lumbar)',
        category: 'MRI',
        description: 'Detailed spine imaging',
        price: 7000,
        duration: '48 hours',
        preparation: 'Remove all metal objects',
        commonReasons: ['Disc herniation', 'Spinal stenosis', 'Chronic back pain']
    },

    // Ultrasound
    {
        id: 'us_001',
        name: 'Ultrasound - Abdomen',
        category: 'Ultrasound',
        description: 'Abdominal organs screening',
        price: 1200,
        duration: '4-6 hours',
        preparation: 'Fasting 6 hours',
        commonReasons: ['Liver function', 'Gallstones', 'Kidney evaluation']
    },
    {
        id: 'us_002',
        name: 'Ultrasound - Pelvis',
        category: 'Ultrasound',
        description: 'Pelvic organs imaging',
        price: 1500,
        duration: '4-6 hours',
        preparation: 'Full bladder required',
        commonReasons: ['Pregnancy', 'Ovarian cysts', 'Uterine fibroids']
    },

    // Blood Tests
    {
        id: 'blood_001',
        name: 'Complete Blood Count (CBC)',
        category: 'Blood Test',
        description: 'Basic blood cell analysis',
        price: 300,
        duration: '6 hours',
        commonReasons: ['Anemia', 'Infection', 'Routine checkup']
    },
    {
        id: 'blood_002',
        name: 'Comprehensive Metabolic Panel (CMP)',
        category: 'Blood Test',
        description: 'Kidney, liver, electrolyte function',
        price: 600,
        duration: '12 hours',
        preparation: 'Fasting 8-12 hours',
        commonReasons: ['Diabetes', 'Kidney function', 'Liver function']
    },
    {
        id: 'blood_003',
        name: 'Lipid Profile',
        category: 'Blood Test',
        description: 'Cholesterol and triglycerides',
        price: 400,
        duration: '12 hours',
        preparation: 'Fasting 12 hours',
        commonReasons: ['Heart disease risk', 'High cholesterol', 'Diabetes']
    },
    {
        id: 'blood_004',
        name: 'HbA1c (Glycated Hemoglobin)',
        category: 'Blood Test',
        description: '3-month average blood sugar',
        price: 450,
        duration: '24 hours',
        commonReasons: ['Diabetes monitoring', 'Diabetes screening']
    },
    {
        id: 'blood_005',
        name: 'Thyroid Function Test (TSH, T3, T4)',
        category: 'Blood Test',
        description: 'Complete thyroid panel',
        price: 550,
        duration: '24 hours',
        commonReasons: ['Hypothyroidism', 'Hyperthyroidism', 'Fatigue']
    },

    // ECG
    {
        id: 'ecg_001',
        name: 'ECG 12-Lead',
        category: 'ECG',
        description: 'Heart rhythm and electrical activity',
        price: 250,
        duration: 'Immediate',
        commonReasons: ['Chest pain', 'Palpitations', 'Pre-surgery clearance']
    },
    {
        id: 'ecg_002',
        name: 'Echocardiogram (2D Echo)',
        category: 'ECG',
        description: 'Heart structure and function',
        price: 2000,
        duration: '24 hours',
        commonReasons: ['Heart murmur', 'Heart failure', 'Valve disease']
    }
];

export interface DiagnosticOrder {
    testId: string;
    testName: string;
    category: string;
    price: number;
    urgency: 'Routine' | 'Urgent' | 'STAT';
    clinicalIndication: string;
}
