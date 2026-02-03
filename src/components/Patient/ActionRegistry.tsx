import React from 'react';
import { doctorActions } from '@/data/doctorActions';
import styles from './Patient.module.css';
import {
    Activity, Stethoscope, ClipboardList, FileText, TestTube2,
    ScanLine, Pill, Scissors, UserPlus, Dumbbell, Brain,
    FileEdit, BookOpen, FileCheck, Shield, Calendar,
    Award, Receipt, Users
} from 'lucide-react';

const iconMap: Record<string, any> = {
    Activity, Stethoscope, ClipboardList, FileText, TestTube: TestTube2,
    Scan: ScanLine, Pill, Scissors, UserPlus, Dumbbell, Brain,
    FileEdit, BookOpen, FileSignature: FileCheck, Shield, Calendar,
    Award, Receipt, Users
};

export default function ActionRegistry({ patientId }: { patientId: string }) {
    const categories = ['Clinical', 'Orders', 'Referrals', 'Documentation', 'Administrative'] as const;

    return (
        <div className={styles.actionRegistry}>
            <h3 className={styles.registryTitle}>Quick Actions</h3>

            <div className={styles.actionTabs}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        className={styles.actionTab}
                        style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className={styles.actionGrid}>
                {doctorActions.slice(0, 12).map(action => {
                    const IconComponent = iconMap[action.icon];
                    return (
                        <button
                            key={action.id}
                            className={styles.actionCard}
                            title={action.description}
                        >
                            {IconComponent && <IconComponent size={18} color="var(--color-brand-primary)" />}
                            <span>{action.action}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
