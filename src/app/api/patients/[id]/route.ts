import { NextResponse } from 'next/server';
import { getPatients, updatePatient } from '@/lib/db';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const patients = getPatients();
    const patient = patients.find(p => p.id === id);
    if (!patient) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json(patient);
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const updated = updatePatient(id, body);
    if (!updated) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
}
