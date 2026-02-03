export interface DoctorAction {
    id: string;
    category: 'Clinical' | 'Administrative' | 'Documentation' | 'Orders' | 'Referrals';
    action: string;
    description: string;
    icon: string;
}

export const doctorActions: DoctorAction[] = [
    // Clinical Actions
    {
        id: 'vital_review',
        category: 'Clinical',
        action: 'Review Vitals',
        description: 'View and document patient vital signs',
        icon: 'Activity'
    },
    {
        id: 'physical_exam',
        category: 'Clinical',
        action: 'Physical Examination',
        description: 'Document physical exam findings',
        icon: 'Stethoscope'
    },
    {
        id: 'diagnosis',
        category: 'Clinical',
        action: 'Diagnosis & Assessment',
        description: 'Enter ICD-10 codes and clinical assessment',
        icon: 'ClipboardList'
    },
    {
        id: 'treatment_plan',
        category: 'Clinical',
        action: 'Treatment Plan',
        description: 'Create comprehensive care plan',
        icon: 'FileText'
    },

    // Orders
    {
        id: 'lab_order',
        category: 'Orders',
        action: 'Lab Orders',
        description: 'Order blood work, urinalysis, cultures',
        icon: 'TestTube'
    },
    {
        id: 'imaging_order',
        category: 'Orders',
        action: 'Imaging Orders',
        description: 'X-Ray, CT, MRI, Ultrasound',
        icon: 'Scan'
    },
    {
        id: 'prescription',
        category: 'Orders',
        action: 'E-Prescription',
        description: 'Prescribe medications',
        icon: 'Pill'
    },
    {
        id: 'procedure_order',
        category: 'Orders',
        action: 'Procedures',
        description: 'Order minor procedures or interventions',
        icon: 'Scissors'
    },

    // Referrals
    {
        id: 'specialist_referral',
        category: 'Referrals',
        action: 'Specialist Referral',
        description: 'Refer to cardiology, neuro, ortho, etc.',
        icon: 'UserPlus'
    },
    {
        id: 'pt_referral',
        category: 'Referrals',
        action: 'PT/OT Referral',
        description: 'Physical or occupational therapy',
        icon: 'Dumbbell'
    },
    {
        id: 'behavioral_health',
        category: 'Referrals',
        action: 'Behavioral Health',
        description: 'Psychology, psychiatry referral',
        icon: 'Brain'
    },

    // Documentation
    {
        id: 'soap_note',
        category: 'Documentation',
        action: 'SOAP Note',
        description: 'Complete structured clinical note',
        icon: 'FileEdit'
    },
    {
        id: 'patient_education',
        category: 'Documentation',
        action: 'Patient Education',
        description: 'Provide handouts and instructions',
        icon: 'BookOpen'
    },
    {
        id: 'consent_form',
        category: 'Documentation',
        action: 'Consent Forms',
        description: 'Document informed consent',
        icon: 'FileSignature'
    },
    {
        id: 'prior_auth',
        category: 'Documentation',
        action: 'Prior Authorization',
        description: 'Submit insurance pre-approvals',
        icon: 'Shield'
    },

    // Administrative
    {
        id: 'schedule_followup',
        category: 'Administrative',
        action: 'Schedule Follow-Up',
        description: 'Book next appointment',
        icon: 'Calendar'
    },
    {
        id: 'medical_cert',
        category: 'Administrative',
        action: 'Medical Certificate',
        description: 'Issue sick leave or fitness certificate',
        icon: 'Award'
    },
    {
        id: 'billing_codes',
        category: 'Administrative',
        action: 'E/M Coding',
        description: 'Select appropriate billing codes',
        icon: 'Receipt'
    },
    {
        id: 'care_coordinator',
        category: 'Administrative',
        action: 'Care Coordination',
        description: 'Communicate with care team',
        icon: 'Users'
    }
];
