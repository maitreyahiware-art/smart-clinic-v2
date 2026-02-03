'use client';

import React, { Suspense } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import EnhancedPrescriptionWriter from '@/components/Prescription/EnhancedPrescriptionWriter';
import { patients } from '@/data/patients';
import { useSearchParams } from 'next/navigation';

function PrescriptionContent() {
    const searchParams = useSearchParams();
    const patientId = searchParams.get('patientId');
    const patient = patients.find(p => p.id === patientId) || patients[0];

    return (
        <div style={{ padding: '24px' }}>
            <EnhancedPrescriptionWriter
                patientId={patient.id}
                patientName={patient.name}
                patientAge={patient.age}
                patientGender={patient.gender}
            />
        </div>
    );
}

export default function PrescriptionsPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
                <PrescriptionContent />
            </Suspense>
        </DashboardLayout>
    );
}
