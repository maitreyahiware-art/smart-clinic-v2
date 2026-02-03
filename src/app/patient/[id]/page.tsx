import React from 'react';
import { patients } from '@/data/patients';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import ContextLens from '@/components/Patient/ContextLens';
import SmartSoapNote from '@/components/Patient/SmartSoapNote';
import DispositionPanel from '@/components/Patient/DispositionPanel';
import ActionRegistry from '@/components/Patient/ActionRegistry';
import { notFound } from 'next/navigation';

// Generate static params for basic patient paths
export function generateStaticParams() {
    return patients.map((p) => ({ id: p.id }));
}

// Next.js 15 compat: params is a Promise
export default async function PatientPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const patient = patients.find(p => p.id === params.id);

    if (!patient) {
        notFound();
    }

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <ContextLens patient={patient} />

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    <SmartSoapNote patient={patient} />
                    <DispositionPanel patient={patient} />
                </div>

                <ActionRegistry patientId={patient.id} />
            </div>
        </DashboardLayout>
    );
}
