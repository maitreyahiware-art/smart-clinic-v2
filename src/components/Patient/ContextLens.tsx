import React from 'react';
import { useSpecialty } from '@/context/SpecialtyContext';
import { AlertCircle, Activity, Pill, Target, Activity as HistoryIcon } from 'lucide-react';
import { Patient } from '@/data/patients';
import styles from './Patient.module.css';

const sectionIcons: Record<string, any> = {
    safety: AlertCircle,
    gaps: Activity,
    deltas: HistoryIcon,
    trends: Target,
    'cardiac safety': AlertCircle,
    'structural safety': AlertCircle,
    'risk stratification': AlertCircle,
    'respiratory safety': AlertCircle
};

export default function ContextLens({ patient }: { patient: Patient }) {
    const { specialty } = useSpecialty();

    if (!specialty) return null;

    // Evaluate specialty risk triggers
    const dynamicRedFlags = specialty.riskTriggers
        .filter(trigger => trigger.condition(patient))
        .map(trigger => trigger.label);

    // Merge with patient's existing flags if any (or just use dynamic for pure specialty focus)
    const activeFlags = [...new Set([...dynamicRedFlags, ...(patient.redFlags || [])])];

    return (
        <div className={styles.contextLens}>
            {specialty.contextLensSections.map((section) => {
                const Icon = sectionIcons[section.id.toLowerCase()] || Activity;

                // Determine what content to show based on section ID
                let content: string[] = [];
                let color = 'var(--color-brand-primary)';

                if (section.id === 'safety' || section.id.includes('safety') || section.id === 'risk stratification') {
                    content = activeFlags;
                    color = '#EF4444';
                } else if (section.id === 'gaps') {
                    content = patient.careGaps || [];
                    color = 'var(--color-brand-primary)';
                } else if (section.id === 'deltas' || section.id === 'trends') {
                    content = patient.medDeltas || [];
                    color = '#F59E0B';
                }

                return (
                    <div key={section.id} className={styles.lensSection}>
                        <div className={styles.lensHeader}>
                            <Icon size={18} color={color} />
                            <span className={styles.lensTitle} style={{ color }}>{section.label}</span>
                        </div>
                        <ul className={styles.lensList}>
                            {content.length > 0 ? (
                                content.map((item, i) => <li key={i}>{item}</li>)
                            ) : (
                                <li className={styles.emptyState}>No active {section.label.toLowerCase()}</li>
                            )}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}
