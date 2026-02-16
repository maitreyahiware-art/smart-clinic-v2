import { NextResponse } from 'next/server';
import { getDb, saveDb, getPatients } from '@/lib/db';
import { parseImportData, detectDuplicates, toPatientSchema, ImportedPatient } from '@/lib/importParser';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { content, fileName, action } = body;
        // action: 'preview' | 'confirm'

        if (!content || !fileName) {
            return NextResponse.json(
                { error: 'Missing file content or fileName.' },
                { status: 400 }
            );
        }

        // Step 1: Parse the incoming data
        const parseResult = parseImportData(content, fileName);

        if (!parseResult.success) {
            return NextResponse.json({
                success: false,
                errors: parseResult.errors,
                warnings: parseResult.warnings,
            }, { status: 400 });
        }

        // Step 2: Detect duplicates against existing DB
        const existingPatients = getPatients();
        const mergeResult = detectDuplicates(parseResult.newPatients, existingPatients);

        // If preview mode, return the analysis without writing
        if (action === 'preview') {
            return NextResponse.json({
                success: true,
                sourceFormat: parseResult.sourceFormat,
                totalRecords: parseResult.totalRecords,
                newPatients: mergeResult.newPatients.map(p => ({
                    name: p.name,
                    age: p.age,
                    gender: p.gender,
                    phone: p.phone,
                    email: p.email,
                    reasonForVisit: p.reasonForVisit,
                    riskLevel: p.riskLevel,
                    hasPrescriptions: !!(p.prescriptions && p.prescriptions.length > 0),
                    hasBills: !!(p.medicalBills && p.medicalBills.length > 0),
                    hasNotes: !!(p.doctorNotes && p.doctorNotes.length > 0),
                    medicationCount: p.medications?.current?.length || 0,
                })),
                mergedPatients: mergeResult.mergedPatients.map(m => ({
                    existingName: m.existing.name,
                    existingId: m.existing.id,
                    incomingName: m.incoming.name,
                    mergedFields: m.mergedFields,
                })),
                errors: [...parseResult.errors, ...mergeResult.errors],
                warnings: [...parseResult.warnings, ...mergeResult.warnings],
            });
        }

        // Step 3: Confirm — Write to DB
        if (action === 'confirm') {
            const db = getDb();
            let nextId = Math.max(...db.patients.map((p: any) => parseInt(p.id) || 0), 0) + 1;
            let addedCount = 0;
            let mergedCount = 0;

            // Add new patients
            for (const newPatient of mergeResult.newPatients) {
                const patientRecord = toPatientSchema(newPatient, String(nextId));
                db.patients.push(patientRecord);
                nextId++;
                addedCount++;
            }

            // Merge existing patients
            for (const merge of mergeResult.mergedPatients) {
                const idx = db.patients.findIndex((p: any) => p.id === merge.existing.id);
                if (idx !== -1) {
                    const existing = db.patients[idx];

                    // Merge medications (append new ones)
                    if (merge.incoming.medications?.current?.length) {
                        const existingMeds = existing.medications?.current || [];
                        const newMeds = merge.incoming.medications.current.filter(
                            (m: string) => !existingMeds.includes(m)
                        );
                        existing.medications = {
                            ...existing.medications,
                            current: [...existingMeds, ...newMeds],
                        };
                    }

                    // Merge prescriptions (append)
                    if (merge.incoming.prescriptions?.length) {
                        existing.prescriptions = [
                            ...(existing.prescriptions || []),
                            ...merge.incoming.prescriptions,
                        ];
                    }

                    // Merge bills (append)
                    if (merge.incoming.medicalBills?.length) {
                        existing.medicalBills = [
                            ...(existing.medicalBills || []),
                            ...merge.incoming.medicalBills,
                        ];
                    }

                    // Merge doctor notes (append)
                    if (merge.incoming.doctorNotes?.length) {
                        existing.doctorNotes = [
                            ...(existing.doctorNotes || []),
                            ...merge.incoming.doctorNotes,
                        ];
                    }

                    // Update vitals if incoming has newer data
                    if (merge.incoming.vitals) {
                        existing.vitals = { ...existing.vitals, ...merge.incoming.vitals };
                    }

                    // Merge symptoms (append unique)
                    if (merge.incoming.symptoms?.length) {
                        const existingSymptoms = existing.symptoms || [];
                        const newSymptoms = merge.incoming.symptoms.filter(
                            (s: string) => !existingSymptoms.includes(s)
                        );
                        existing.symptoms = [...existingSymptoms, ...newSymptoms];
                    }

                    // Append clinical notes
                    if (merge.incoming.clinicalNote) {
                        existing.clinicalNote = (existing.clinicalNote || '') +
                            '\n\n--- IMPORTED ---\n' + merge.incoming.clinicalNote;
                    }

                    // Mark merge timestamp
                    existing._lastMergedAt = new Date().toISOString();
                    existing._mergeSource = merge.incoming._sourceFormat;

                    db.patients[idx] = existing;
                    mergedCount++;
                }
            }

            saveDb(db);

            return NextResponse.json({
                success: true,
                message: `Import complete. ${addedCount} new patients added, ${mergedCount} existing patients updated.`,
                addedCount,
                mergedCount,
                totalInDb: db.patients.length,
            });
        }

        return NextResponse.json({ error: 'Invalid action. Use "preview" or "confirm".' }, { status: 400 });

    } catch (error: any) {
        console.error('Import error:', error);
        return NextResponse.json(
            { error: `Import failed: ${error.message}` },
            { status: 500 }
        );
    }
}
