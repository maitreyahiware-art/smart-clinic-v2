export interface RiskTrigger {
    id: string;
    label: string;
    condition: (data: any) => boolean;
    severity: 'Critical' | 'Monitor' | 'Stable';
}

export interface ContextSection {
    id: string;
    label: string;
    icon?: string;
}

export interface SoapTemplate {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
}

export interface OrderingPreset {
    id: string;
    label: string;
    type: 'Medication' | 'Imaging' | 'Lab' | 'Referral';
}

export interface SpecialtyConfig {
    id: string;
    label: string;
    riskTriggers: RiskTrigger[];
    contextLensSections: ContextSection[];
    soapTemplate: SoapTemplate;
    dashboardAccent: {
        primary: string;
        subtle: string;
    };
    orderingShortcuts: OrderingPreset[];
}
