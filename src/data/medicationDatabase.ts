export interface Medication {
    id: string;
    brandName: string;
    genericName: string;
    category: 'Pain/Fever' | 'Antibiotics' | 'Diabetes' | 'BP/Heart' | 'GI' | 'Respiratory' | 'CNS' | 'Vitamins' | 'Other';
    formulations: string[];
    commonDosages: string[];
    frequencies: string[];
    costPerUnit: number;
    prescriptionRequired: boolean;
    contraindications?: string[];
}

export const medicationDatabase: Medication[] = [
    // Pain/Fever
    {
        id: 'med_001',
        brandName: 'Crocin',
        genericName: 'Paracetamol',
        category: 'Pain/Fever',
        formulations: ['500mg Tablet', '650mg Tablet', '120mg/5ml Syrup'],
        commonDosages: ['500mg', '650mg', '1000mg'],
        frequencies: ['TDS (Thrice)', 'QID (4 times)', 'SOS (As needed)'],
        costPerUnit: 2.5,
        prescriptionRequired: false
    },
    {
        id: 'med_002',
        brandName: 'Brufen',
        genericName: 'Ibuprofen',
        category: 'Pain/Fever',
        formulations: ['400mg Tablet', '600mg Tablet'],
        commonDosages: ['400mg', '600mg'],
        frequencies: ['BD (Twice)', 'TDS (Thrice)'],
        costPerUnit: 3.5,
        prescriptionRequired: false,
        contraindications: ['Active GI bleeding', 'Severe renal impairment']
    },
    {
        id: 'med_003',
        brandName: 'Voveran',
        genericName: 'Diclofenac',
        category: 'Pain/Fever',
        formulations: ['50mg Tablet', '75mg SR Tablet', '25mg/ml Injection'],
        commonDosages: ['50mg', '75mg'],
        frequencies: ['BD (Twice)', 'TDS (Thrice)'],
        costPerUnit: 4.0,
        prescriptionRequired: true,
        contraindications: ['Peptic ulcer', 'Asthma']
    },

    // Antibiotics
    {
        id: 'med_004',
        brandName: 'Azithral',
        genericName: 'Azithromycin',
        category: 'Antibiotics',
        formulations: ['250mg Tablet', '500mg Tablet', '200mg/5ml Syrup'],
        commonDosages: ['250mg', '500mg'],
        frequencies: ['OD (Once)', 'BD (Twice)'],
        costPerUnit: 15.0,
        prescriptionRequired: true
    },
    {
        id: 'med_005',
        brandName: 'Augmentin',
        genericName: 'Amoxicillin + Clavulanate',
        category: 'Antibiotics',
        formulations: ['625mg Tablet', '1g Tablet', '228mg/5ml Syrup'],
        commonDosages: ['625mg', '1g'],
        frequencies: ['BD (Twice)', 'TDS (Thrice)'],
        costPerUnit: 25.0,
        prescriptionRequired: true,
        contraindications: ['Penicillin allergy']
    },
    {
        id: 'med_006',
        brandName: 'Levaquin',
        genericName: 'Levofloxacin',
        category: 'Antibiotics',
        formulations: ['250mg Tablet', '500mg Tablet', '750mg Tablet'],
        commonDosages: ['250mg', '500mg', '750mg'],
        frequencies: ['OD (Once)', 'BD (Twice)'],
        costPerUnit: 20.0,
        prescriptionRequired: true,
        contraindications: ['Pregnancy', 'Children <18']
    },

    // Diabetes
    {
        id: 'med_007',
        brandName: 'Glycomet',
        genericName: 'Metformin',
        category: 'Diabetes',
        formulations: ['500mg Tablet', '850mg Tablet', '1000mg SR Tablet'],
        commonDosages: ['500mg', '850mg', '1000mg'],
        frequencies: ['OD (Once)', 'BD (Twice)', 'TDS (Thrice)'],
        costPerUnit: 2.0,
        prescriptionRequired: true
    },
    {
        id: 'med_008',
        brandName: 'Amaryl',
        genericName: 'Glimepiride',
        category: 'Diabetes',
        formulations: ['1mg Tablet', '2mg Tablet', '4mg Tablet'],
        commonDosages: ['1mg', '2mg', '4mg'],
        frequencies: ['OD (Once)'],
        costPerUnit: 8.0,
        prescriptionRequired: true,
        contraindications: ['Type 1 DM', 'Severe hepatic impairment']
    },
    {
        id: 'med_009',
        brandName: 'Januvia',
        genericName: 'Sitagliptin',
        category: 'Diabetes',
        formulations: ['50mg Tablet', '100mg Tablet'],
        commonDosages: ['50mg', '100mg'],
        frequencies: ['OD (Once)'],
        costPerUnit: 45.0,
        prescriptionRequired: true
    },

    // BP/Heart
    {
        id: 'med_010',
        brandName: 'Amlokind',
        genericName: 'Amlodipine',
        category: 'BP/Heart',
        formulations: ['2.5mg Tablet', '5mg Tablet', '10mg Tablet'],
        commonDosages: ['2.5mg', '5mg', '10mg'],
        frequencies: ['OD (Once)'],
        costPerUnit: 3.0,
        prescriptionRequired: true
    },
    {
        id: 'med_011',
        brandName: 'Telma',
        genericName: 'Telmisartan',
        category: 'BP/Heart',
        formulations: ['20mg Tablet', '40mg Tablet', '80mg Tablet'],
        commonDosages: ['20mg', '40mg', '80mg'],
        frequencies: ['OD (Once)'],
        costPerUnit: 12.0,
        prescriptionRequired: true
    },
    {
        id: 'med_012',
        brandName: 'Ecosprin',
        genericName: 'Aspirin',
        category: 'BP/Heart',
        formulations: ['75mg Tablet', '150mg Tablet'],
        commonDosages: ['75mg', '150mg'],
        frequencies: ['OD (Once)'],
        costPerUnit: 1.5,
        prescriptionRequired: false
    },
    {
        id: 'med_013',
        brandName: 'Atorva',
        genericName: 'Atorvastatin',
        category: 'BP/Heart',
        formulations: ['10mg Tablet', '20mg Tablet', '40mg Tablet'],
        commonDosages: ['10mg', '20mg', '40mg'],
        frequencies: ['OD (Once) - HS'],
        costPerUnit: 8.0,
        prescriptionRequired: true
    },

    // GI Medications
    {
        id: 'med_014',
        brandName: 'Pan',
        genericName: 'Pantoprazole',
        category: 'GI',
        formulations: ['20mg Tablet', '40mg Tablet', '40mg IV'],
        commonDosages: ['20mg', '40mg'],
        frequencies: ['OD (Once)', 'BD (Twice)'],
        costPerUnit: 5.0,
        prescriptionRequired: true
    },
    {
        id: 'med_015',
        brandName: 'Razo',
        genericName: 'Rabeprazole',
        category: 'GI',
        formulations: ['10mg Tablet', '20mg Tablet'],
        commonDosages: ['10mg', '20mg'],
        frequencies: ['OD (Once)', 'BD (Twice)'],
        costPerUnit: 6.0,
        prescriptionRequired: true
    },
    {
        id: 'med_016',
        brandName: 'Ondansetron',
        genericName: 'Ondansetron',
        category: 'GI',
        formulations: ['4mg Tablet', '8mg Tablet', '4mg/2ml Injection'],
        commonDosages: ['4mg', '8mg'],
        frequencies: ['BD (Twice)', 'TDS (Thrice)', 'SOS (As needed)'],
        costPerUnit: 10.0,
        prescriptionRequired: true
    },
    {
        id: 'med_017',
        brandName: 'Sucralfate',
        genericName: 'Sucralfate',
        category: 'GI',
        formulations: ['1g Tablet', '1g/5ml Suspension'],
        commonDosages: ['1g'],
        frequencies: ['QID (4 times)'],
        costPerUnit: 4.0,
        prescriptionRequired: false
    },

    // Respiratory
    {
        id: 'med_018',
        brandName: 'Montek LC',
        genericName: 'Montelukast + Levocetirizine',
        category: 'Respiratory',
        formulations: ['10mg+5mg Tablet'],
        commonDosages: ['10mg+5mg'],
        frequencies: ['OD (Once) - HS'],
        costPerUnit: 12.0,
        prescriptionRequired: true
    },
    {
        id: 'med_019',
        brandName: 'Budecort',
        genericName: 'Budesonide',
        category: 'Respiratory',
        formulations: ['100mcg Inhaler', '200mcg Inhaler', '0.5mg Respules'],
        commonDosages: ['100mcg', '200mcg'],
        frequencies: ['BD (Twice)'],
        costPerUnit: 250.0,
        prescriptionRequired: true
    },
    {
        id: 'med_020',
        brandName: 'Asthalin',
        genericName: 'Salbutamol',
        category: 'Respiratory',
        formulations: ['100mcg Inhaler', '2mg Tablet', '2mg/5ml Syrup'],
        commonDosages: ['100mcg', '2mg'],
        frequencies: ['QID (4 times)', 'SOS (As needed)'],
        costPerUnit: 120.0,
        prescriptionRequired: false
    },

    // CNS
    {
        id: 'med_021',
        brandName: 'Nexito',
        genericName: 'Escitalopram',
        category: 'CNS',
        formulations: ['5mg Tablet', '10mg Tablet', '20mg Tablet'],
        commonDosages: ['5mg', '10mg', '20mg'],
        frequencies: ['OD (Once)'],
        costPerUnit: 15.0,
        prescriptionRequired: true
    },
    {
        id: 'med_022',
        brandName: 'Zapiz',
        genericName: 'Clonazepam',
        category: 'CNS',
        formulations: ['0.25mg Tablet', '0.5mg Tablet', '1mg Tablet'],
        commonDosages: ['0.25mg', '0.5mg', '1mg'],
        frequencies: ['BD (Twice)', 'HS (Bedtime)'],
        costPerUnit: 8.0,
        prescriptionRequired: true,
        contraindications: ['Respiratory depression', 'Acute narrow-angle glaucoma']
    },
    {
        id: 'med_023',
        brandName: 'Topamax',
        genericName: 'Topiramate',
        category: 'CNS',
        formulations: ['25mg Tablet', '50mg Tablet', '100mg Tablet'],
        commonDosages: ['25mg', '50mg', '100mg'],
        frequencies: ['BD (Twice)'],
        costPerUnit: 20.0,
        prescriptionRequired: true
    },

    // Vitamins & Supplements
    {
        id: 'med_024',
        brandName: 'Shelcal',
        genericName: 'Calcium + Vitamin D3',
        category: 'Vitamins',
        formulations: ['500mg+250IU Tablet'],
        commonDosages: ['500mg+250IU'],
        frequencies: ['OD (Once)', 'BD (Twice)'],
        costPerUnit: 5.0,
        prescriptionRequired: false
    },
    {
        id: 'med_025',
        brandName: 'Becadexamin',
        genericName: 'Multivitamin',
        category: 'Vitamins',
        formulations: ['Capsule', 'Syrup'],
        commonDosages: ['1 Cap'],
        frequencies: ['OD (Once)'],
        costPerUnit: 3.0,
        prescriptionRequired: false
    },
    {
        id: 'med_026',
        brandName: 'Neurobion Forte',
        genericName: 'Vitamin B Complex',
        category: 'Vitamins',
        formulations: ['Tablet', 'Injection'],
        commonDosages: ['1 Tab'],
        frequencies: ['OD (Once)'],
        costPerUnit: 4.0,
        prescriptionRequired: false
    },

    // Additional Common Medications
    {
        id: 'med_027',
        brandName: 'Combiflam',
        genericName: 'Ibuprofen + Paracetamol',
        category: 'Pain/Fever',
        formulations: ['400mg+325mg Tablet'],
        commonDosages: ['400mg+325mg'],
        frequencies: ['TDS (Thrice)', 'SOS (As needed)'],
        costPerUnit: 5.0,
        prescriptionRequired: false
    },
    {
        id: 'med_028',
        brandName: 'Cyclopam',
        genericName: 'Dicyclomine + Paracetamol',
        category: 'GI',
        formulations: ['20mg+500mg Tablet'],
        commonDosages: ['20mg+500mg'],
        frequencies: ['TDS (Thrice)', 'SOS (As needed)'],
        costPerUnit: 6.0,
        prescriptionRequired: true
    },
    {
        id: 'med_029',
        brandName: 'Zincovit',
        genericName: 'Multivitamin + Zinc',
        category: 'Vitamins',
        formulations: ['Tablet', 'Syrup'],
        commonDosages: ['1 Tab'],
        frequencies: ['OD (Once)'],
        costPerUnit: 4.5,
        prescriptionRequired: false
    },
    {
        id: 'med_030',
        brandName: 'Dolo',
        genericName: 'Paracetamol',
        category: 'Pain/Fever',
        formulations: ['650mg Tablet'],
        commonDosages: ['650mg'],
        frequencies: ['TDS (Thrice)', 'QID (4 times)', 'SOS (As needed)'],
        costPerUnit: 2.0,
        prescriptionRequired: false
    }
];

export interface PrescriptionItem {
    medicationId: string;
    brandName: string;
    genericName: string;
    formulation: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    quantity: number;
    cost: number;
}

export interface Prescription {
    id: string;
    patientId: string;
    patientName: string;
    date: string;
    doctorName: string;
    doctorRegistration: string;
    items: PrescriptionItem[];
    totalCost: number;
    diagnosis?: string;
    notes?: string;
    status: 'Draft' | 'Signed' | 'Sent';
}
