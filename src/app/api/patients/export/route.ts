import { NextResponse } from 'next/server';
import { getPatients } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'json';
        const patientId = searchParams.get('id'); // optional — export one patient

        let patients = getPatients();

        // If specific patient requested
        if (patientId) {
            const found = patients.find(p => p.id === patientId);
            if (!found) {
                return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
            }
            patients = [found] as any;
        }

        if (format === 'csv') {
            const csv = patientsToCSV(patients);
            return new NextResponse(csv, {
                status: 200,
                headers: {
                    'Content-Type': 'text/csv',
                    'Content-Disposition': `attachment; filename="smart_clinic_export_${new Date().toISOString().split('T')[0]}.csv"`,
                },
            });
        }

        // Default: JSON
        const exportData = {
            exportedAt: new Date().toISOString(),
            exportedFrom: 'Smart Clinic OS v1.0',
            totalPatients: patients.length,
            patients: patients,
        };

        return NextResponse.json(exportData, {
            headers: {
                'Content-Disposition': `attachment; filename="smart_clinic_export_${new Date().toISOString().split('T')[0]}.json"`,
            },
        });

    } catch (error: any) {
        console.error('Export error:', error);
        return NextResponse.json(
            { error: `Export failed: ${error.message}` },
            { status: 500 }
        );
    }
}

function patientsToCSV(patients: any[]): string {
    const headers = [
        'ID', 'Name', 'Age', 'Gender', 'Phone', 'Email',
        'Reason for Visit', 'Risk Level', 'Status',
        'Current Medications', 'Symptoms',
        'BP Systolic', 'BP Diastolic', 'Heart Rate', 'SpO2', 'Temperature',
        'Red Flags', 'Care Gaps', 'Intake Summary',
        'Clinical Note', 'Doctor Notes',
    ];

    const rows = patients.map(p => [
        p.id,
        escapeCSV(p.name),
        p.age,
        p.gender,
        escapeCSV(p.phone || ''),
        escapeCSV(p.email || ''),
        escapeCSV(p.reasonForVisit || ''),
        p.riskLevel,
        p.status,
        escapeCSV((p.medications?.current || []).join('; ')),
        escapeCSV((p.symptoms || []).join('; ')),
        p.vitals?.bps || '',
        p.vitals?.bpd || '',
        p.vitals?.heartRate || '',
        p.vitals?.spo2 || '',
        p.vitals?.temp || '',
        escapeCSV((p.redFlags || []).join('; ')),
        escapeCSV((p.careGaps || []).join('; ')),
        escapeCSV(p.intakeSummary || ''),
        escapeCSV(p.clinicalNote || ''),
        escapeCSV((p.doctorNotes || []).map((n: any) => `[${n.date || ''}] ${n.note || ''}`).join(' | ')),
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

function escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
