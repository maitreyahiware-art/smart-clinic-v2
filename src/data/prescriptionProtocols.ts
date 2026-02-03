export interface PrescriptionProtocol {
    name: string;
    category: string;
    medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
    }>;
}

export const prescriptionProtocols: PrescriptionProtocol[] = [
    {
        name: 'Standard URI (Upper Respiratory Infection)',
        category: 'Infectious',
        medications: [
            { name: 'Azithromycin 500mg', dosage: '500mg', frequency: 'OD (Once)', duration: '3 Days' },
            { name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'TDS (Thrice)', duration: '5 Days' },
            { name: 'Cetirizine 10mg', dosage: '10mg', frequency: 'OD (Once)', duration: '5 Days' }
        ]
    },
    {
        name: 'Acute Gastritis Protocol',
        category: 'GI',
        medications: [
            { name: 'Pantoprazole 40mg', dosage: '40mg', frequency: 'OD (Once)', duration: '14 Days' },
            { name: 'Ondansetron 4mg', dosage: '4mg', frequency: 'SOS (Needed)', duration: '3 Days' },
            { name: 'Sucralfate 1g', dosage: '1g', frequency: 'QID (4 times)', duration: '14 Days' }
        ]
    },
    {
        name: 'Hypertension Starter Pack',
        category: 'Cardiovascular',
        medications: [
            { name: 'Amlodipine 5mg', dosage: '5mg', frequency: 'OD (Once)', duration: '30 Days' },
            { name: 'Aspirin 75mg', dosage: '75mg', frequency: 'OD (Once)', duration: '30 Days' }
        ]
    },
    {
        name: 'Type 2 Diabetes - Initial',
        category: 'Endocrine',
        medications: [
            { name: 'Metformin 500mg', dosage: '500mg', frequency: 'BD (Twice)', duration: '30 Days' },
            { name: 'Glimepiride 1mg', dosage: '1mg', frequency: 'OD (Once)', duration: '30 Days' }
        ]
    },
    {
        name: 'Migraine Acute Treatment',
        category: 'Neuro',
        medications: [
            { name: 'Sumatriptan 50mg', dosage: '50mg', frequency: 'SOS (Needed)', duration: '5 Doses' },
            { name: 'Naproxen 500mg', dosage: '500mg', frequency: 'SOS (Needed)', duration: '5 Days' }
        ]
    },
    {
        name: 'Acute Lower Back Pain',
        category: 'Musculoskeletal',
        medications: [
            { name: 'Diclofenac 50mg', dosage: '50mg', frequency: 'BD (Twice)', duration: '5 Days' },
            { name: 'Cyclobenzaprine 10mg', dosage: '10mg', frequency: 'BD (Twice)', duration: '5 Days' },
            { name: 'Omeprazole 20mg', dosage: '20mg', frequency: 'OD (Once)', duration: '7 Days' }
        ]
    },
    {
        name: 'Insomnia Management',
        category: 'Psychiatric',
        medications: [
            { name: 'Zolpidem 5mg', dosage: '5mg', frequency: 'HS (Bedtime)', duration: '7 Days' },
            { name: 'Melatonin 3mg', dosage: '3mg', frequency: 'HS (Bedtime)', duration: '30 Days' }
        ]
    }
];
