/**
 * Smart Clinic OS - Universal Patient Data Import Parser
 * 
 * Handles JSON, CSV, and extracted PDF text.
 * Normalizes all formats into the SC-OS Patient schema.
 * Detects duplicates by name + phone + email matching.
 */

import { Patient } from '../data/patients';

// ---- TYPES ----

export interface ImportedPatient {
    // Core identifiers
    name: string;
    age?: number;
    gender?: string;
    phone?: string;
    email?: string;

    // Clinical
    reasonForVisit?: string;
    riskLevel?: 'Critical' | 'High' | 'Monitor' | 'Stable';
    status?: string;
    redFlags?: string[];
    careGaps?: string[];
    medDeltas?: string[];
    intakeSummary?: string;

    // Medical Records
    medications?: {
        current: string[];
        new?: string[];
    };
    prescriptions?: Array<{
        date?: string;
        medication: string;
        dosage?: string;
        frequency?: string;
        duration?: string;
        doctor?: string;
    }>;
    medicalBills?: Array<{
        date?: string;
        description: string;
        amount?: number;
        status?: string;
    }>;
    doctorNotes?: Array<{
        date?: string;
        note: string;
        doctor?: string;
    }>;

    // Vitals
    vitals?: {
        temp?: number;
        spo2?: number;
        bps?: number;
        bpd?: number;
        heartRate?: number;
        rr?: number;
    };
    symptoms?: string[];
    clinicalNote?: string;

    // Metadata
    _sourceFormat?: string;
    _importedAt?: string;
    _rawData?: Record<string, any>;
}

export interface ImportResult {
    success: boolean;
    totalRecords: number;
    newPatients: ImportedPatient[];
    mergedPatients: Array<{
        existing: Patient;
        incoming: ImportedPatient;
        mergedFields: string[];
    }>;
    errors: string[];
    warnings: string[];
    sourceFormat: string;
}

// ---- PARSERS ----

/**
 * Detect file format and route to the correct parser
 */
export function parseImportData(content: string, fileName: string): ImportResult {
    const ext = fileName.toLowerCase().split('.').pop() || '';

    try {
        if (ext === 'json') {
            return parseJSON(content);
        } else if (ext === 'csv') {
            return parseCSV(content);
        } else if (ext === 'txt' || ext === 'pdf') {
            // PDF text is extracted client-side before reaching here
            return parseFreeText(content);
        } else {
            // Attempt auto-detect
            const trimmed = content.trim();
            if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                return parseJSON(content);
            } else if (trimmed.includes(',') && trimmed.includes('\n')) {
                return parseCSV(content);
            } else {
                return parseFreeText(content);
            }
        }
    } catch (error: any) {
        return {
            success: false,
            totalRecords: 0,
            newPatients: [],
            mergedPatients: [],
            errors: [`Failed to parse file: ${error.message}`],
            warnings: [],
            sourceFormat: ext || 'unknown',
        };
    }
}

/**
 * Parse JSON import — handles SC-OS format, generic EMR exports, and FHIR-like structures
 */
function parseJSON(content: string): ImportResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const patients: ImportedPatient[] = [];

    let data: any;
    try {
        data = JSON.parse(content);
    } catch {
        return {
            success: false, totalRecords: 0, newPatients: [], mergedPatients: [],
            errors: ['Invalid JSON format. Please check the file structure.'],
            warnings: [], sourceFormat: 'json'
        };
    }

    // Handle different JSON structures
    let rawPatients: any[] = [];

    if (Array.isArray(data)) {
        rawPatients = data;
    } else if (data.patients && Array.isArray(data.patients)) {
        // SC-OS native format or { patients: [...] }
        rawPatients = data.patients;
    } else if (data.records && Array.isArray(data.records)) {
        rawPatients = data.records;
    } else if (data.data && Array.isArray(data.data)) {
        rawPatients = data.data;
    } else if (data.entry && Array.isArray(data.entry)) {
        // FHIR-like Bundle
        rawPatients = data.entry.map((e: any) => e.resource || e);
        warnings.push('Detected FHIR-like format. Some fields may not map perfectly.');
    } else if (data.name) {
        // Single patient object
        rawPatients = [data];
    } else {
        return {
            success: false, totalRecords: 0, newPatients: [], mergedPatients: [],
            errors: ['Could not find patient records in JSON. Expected an array or { patients: [...] } structure.'],
            warnings: [], sourceFormat: 'json'
        };
    }

    for (let i = 0; i < rawPatients.length; i++) {
        const raw = rawPatients[i];
        try {
            const patient = normalizeJSONPatient(raw);
            if (patient.name) {
                patients.push(patient);
            } else {
                warnings.push(`Record #${i + 1}: Missing patient name, skipped.`);
            }
        } catch (e: any) {
            errors.push(`Record #${i + 1}: ${e.message}`);
        }
    }

    return {
        success: patients.length > 0,
        totalRecords: rawPatients.length,
        newPatients: patients,
        mergedPatients: [],
        errors,
        warnings,
        sourceFormat: 'json'
    };
}

function normalizeJSONPatient(raw: any): ImportedPatient {
    // Flexibly map common field names
    const name = raw.name || raw.patientName || raw.patient_name || raw.fullName || raw.full_name || '';
    const age = raw.age || raw.patientAge || raw.patient_age;
    const gender = raw.gender || raw.sex || raw.patientGender || '';
    const phone = raw.phone || raw.phoneNumber || raw.phone_number || raw.mobile || raw.contact || '';
    const email = raw.email || raw.emailAddress || raw.email_address || '';

    // Build prescriptions array from various formats
    const prescriptions: ImportedPatient['prescriptions'] = [];
    if (raw.prescriptions && Array.isArray(raw.prescriptions)) {
        raw.prescriptions.forEach((p: any) => {
            prescriptions.push({
                date: p.date || p.prescribedDate || '',
                medication: p.medication || p.drug || p.medicine || p.name || '',
                dosage: p.dosage || p.dose || '',
                frequency: p.frequency || '',
                duration: p.duration || '',
                doctor: p.doctor || p.prescribedBy || '',
            });
        });
    }

    // Build bills array
    const medicalBills: ImportedPatient['medicalBills'] = [];
    if (raw.medicalBills || raw.bills || raw.billing) {
        const billSource = raw.medicalBills || raw.bills || raw.billing || [];
        if (Array.isArray(billSource)) {
            billSource.forEach((b: any) => {
                medicalBills.push({
                    date: b.date || '',
                    description: b.description || b.item || b.service || '',
                    amount: b.amount || b.total || b.cost || 0,
                    status: b.status || 'Pending',
                });
            });
        }
    }

    // Build doctor notes
    const doctorNotes: ImportedPatient['doctorNotes'] = [];
    if (raw.doctorNotes || raw.notes || raw.clinicalNotes) {
        const noteSource = raw.doctorNotes || raw.notes || raw.clinicalNotes || [];
        if (Array.isArray(noteSource)) {
            noteSource.forEach((n: any) => {
                if (typeof n === 'string') {
                    doctorNotes.push({ note: n });
                } else {
                    doctorNotes.push({
                        date: n.date || '',
                        note: n.note || n.text || n.content || '',
                        doctor: n.doctor || n.author || '',
                    });
                }
            });
        } else if (typeof noteSource === 'string') {
            doctorNotes.push({ note: noteSource });
        }
    }

    // Build medications object
    const medications: ImportedPatient['medications'] = {
        current: [],
        new: [],
    };
    if (raw.medications) {
        if (typeof raw.medications === 'object' && !Array.isArray(raw.medications)) {
            medications.current = raw.medications.current || [];
            medications.new = raw.medications.new || [];
        } else if (Array.isArray(raw.medications)) {
            medications.current = raw.medications.map((m: any) => typeof m === 'string' ? m : m.name || m.medication || '');
        }
    }

    // Vitals
    let vitals: ImportedPatient['vitals'];
    if (raw.vitals) {
        vitals = {
            temp: raw.vitals.temp || raw.vitals.temperature,
            bps: raw.vitals.bps || raw.vitals.systolic || raw.vitals.bp_systolic,
            bpd: raw.vitals.bpd || raw.vitals.diastolic || raw.vitals.bp_diastolic,
            spo2: raw.vitals.spo2 || raw.vitals.oxygenSaturation,
            heartRate: raw.vitals.heartRate || raw.vitals.heart_rate || raw.vitals.pulse || raw.vitals.hr,
            rr: raw.vitals.rr || raw.vitals.respiratoryRate || raw.vitals.respiratory_rate,
        };
    }

    return {
        name,
        age: typeof age === 'number' ? age : (age ? parseInt(age) : undefined),
        gender: gender.charAt(0).toUpperCase(),
        phone: String(phone),
        email: String(email),
        reasonForVisit: raw.reasonForVisit || raw.reason || raw.visitReason || raw.chiefComplaint || '',
        riskLevel: normalizeRiskLevel(raw.riskLevel || raw.risk || raw.acuity),
        status: raw.status || 'Waiting',
        redFlags: raw.redFlags || raw.alerts || [],
        careGaps: raw.careGaps || [],
        medDeltas: raw.medDeltas || [],
        intakeSummary: raw.intakeSummary || raw.summary || raw.intake || '',
        medications,
        prescriptions: prescriptions.length > 0 ? prescriptions : undefined,
        medicalBills: medicalBills.length > 0 ? medicalBills : undefined,
        doctorNotes: doctorNotes.length > 0 ? doctorNotes : undefined,
        vitals,
        symptoms: raw.symptoms || [],
        clinicalNote: raw.clinicalNote || raw.clinicalNotes || '',
        _sourceFormat: 'json',
        _importedAt: new Date().toISOString(),
        _rawData: raw,
    };
}

/**
 * Parse CSV import — first row is headers
 */
function parseCSV(content: string): ImportResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const patients: ImportedPatient[] = [];

    const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) {
        return {
            success: false, totalRecords: 0, newPatients: [], mergedPatients: [],
            errors: ['CSV file must have at least a header row and one data row.'],
            warnings: [], sourceFormat: 'csv'
        };
    }

    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());

    // Map common CSV column names to our fields
    const fieldMap: Record<string, string> = {};
    const mappings: Record<string, string[]> = {
        name: ['name', 'patient name', 'patient_name', 'patientname', 'full name', 'fullname', 'full_name'],
        age: ['age', 'patient age', 'patient_age'],
        gender: ['gender', 'sex', 'patient gender'],
        phone: ['phone', 'phone number', 'phone_number', 'mobile', 'contact', 'tel'],
        email: ['email', 'email address', 'email_address', 'mail'],
        reason: ['reason', 'reason for visit', 'reasonforvisit', 'chief complaint', 'chiefcomplaint', 'visit reason', 'diagnosis'],
        risk: ['risk', 'risk level', 'risklevel', 'risk_level', 'acuity', 'priority'],
        status: ['status', 'visit status', 'appointment status'],
        medications: ['medications', 'meds', 'current medications', 'current_medications', 'drugs', 'medicine'],
        symptoms: ['symptoms', 'presenting symptoms', 'complaints'],
        bp: ['bp', 'blood pressure', 'blood_pressure'],
        bps: ['bps', 'systolic', 'bp_systolic', 'sys'],
        bpd: ['bpd', 'diastolic', 'bp_diastolic', 'dia'],
        heartRate: ['heart rate', 'heartrate', 'heart_rate', 'hr', 'pulse'],
        spo2: ['spo2', 'oxygen', 'o2 sat', 'oxygen saturation'],
        temp: ['temp', 'temperature', 'body temp'],
        notes: ['notes', 'doctor notes', 'clinical notes', 'doctor_notes', 'remarks', 'comments'],
        bills: ['bills', 'billing', 'amount', 'bill amount', 'total bill'],
        prescriptionHistory: ['prescription history', 'rx history', 'past prescriptions', 'prescription_history'],
    };

    for (const [field, aliases] of Object.entries(mappings)) {
        for (const alias of aliases) {
            const idx = headers.indexOf(alias);
            if (idx !== -1) {
                fieldMap[field] = headers[idx];
                break;
            }
        }
    }

    if (!fieldMap.name) {
        // Try to find a name-like column
        const nameIdx = headers.findIndex(h => h.includes('name'));
        if (nameIdx !== -1) {
            fieldMap.name = headers[nameIdx];
        } else {
            warnings.push('Could not find a "name" column. Using first column as patient name.');
            fieldMap.name = headers[0];
        }
    }

    for (let i = 1; i < lines.length; i++) {
        try {
            const values = parseCSVLine(lines[i]);
            const row: Record<string, string> = {};
            headers.forEach((h, idx) => {
                row[h] = values[idx] || '';
            });

            const getValue = (field: string): string => {
                const key = fieldMap[field];
                return key ? (row[key] || '') : '';
            };

            const name = getValue('name');
            if (!name) {
                warnings.push(`Row ${i + 1}: Empty name, skipped.`);
                continue;
            }

            // Parse BP if combined (e.g., "120/80")
            let bps: number | undefined;
            let bpd: number | undefined;
            const bpVal = getValue('bp');
            if (bpVal && bpVal.includes('/')) {
                const [s, d] = bpVal.split('/');
                bps = parseInt(s);
                bpd = parseInt(d);
            } else {
                bps = getValue('bps') ? parseInt(getValue('bps')) : undefined;
                bpd = getValue('bpd') ? parseInt(getValue('bpd')) : undefined;
            }

            // Parse medications (semicolon or comma separated)
            const medsStr = getValue('medications');
            const medsList = medsStr ? medsStr.split(/[;|]/).map(m => m.trim()).filter(Boolean) : [];

            // Parse symptoms
            const sympStr = getValue('symptoms');
            const symptomsList = sympStr ? sympStr.split(/[;,|]/).map(s => s.trim()).filter(Boolean) : [];

            // Parse notes
            const notesStr = getValue('notes');
            const doctorNotes: ImportedPatient['doctorNotes'] = notesStr
                ? [{ note: notesStr, date: new Date().toISOString().split('T')[0] }]
                : undefined;

            // Parse bills
            const billStr = getValue('bills');
            const medicalBills: ImportedPatient['medicalBills'] = billStr
                ? [{ description: 'Imported Bill', amount: parseFloat(billStr) || 0, status: 'Recorded' }]
                : undefined;

            // Parse prescription history
            const rxHistStr = getValue('prescriptionHistory');
            const prescriptions: ImportedPatient['prescriptions'] = rxHistStr
                ? rxHistStr.split(/[;|]/).map(rx => ({ medication: rx.trim() })).filter(p => p.medication)
                : undefined;

            patients.push({
                name,
                age: getValue('age') ? parseInt(getValue('age')) : undefined,
                gender: getValue('gender') || undefined,
                phone: getValue('phone') || undefined,
                email: getValue('email') || undefined,
                reasonForVisit: getValue('reason') || 'Imported Record',
                riskLevel: normalizeRiskLevel(getValue('risk')),
                status: getValue('status') || 'Waiting',
                medications: { current: medsList, new: [] },
                symptoms: symptomsList,
                vitals: {
                    bps, bpd,
                    heartRate: getValue('heartRate') ? parseInt(getValue('heartRate')) : undefined,
                    spo2: getValue('spo2') ? parseInt(getValue('spo2')) : undefined,
                    temp: getValue('temp') ? parseFloat(getValue('temp')) : undefined,
                },
                doctorNotes,
                medicalBills,
                prescriptions,
                _sourceFormat: 'csv',
                _importedAt: new Date().toISOString(),
            });
        } catch (e: any) {
            errors.push(`Row ${i + 1}: ${e.message}`);
        }
    }

    return {
        success: patients.length > 0,
        totalRecords: lines.length - 1,
        newPatients: patients,
        mergedPatients: [],
        errors,
        warnings,
        sourceFormat: 'csv'
    };
}

/**
 * Parse CSV line respecting quoted fields
 */
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

/**
 * Parse free text (from PDFs or plain text) — best-effort extraction
 */
function parseFreeText(content: string): ImportResult {
    const warnings: string[] = [];
    const patients: ImportedPatient[] = [];

    // Try to detect patient blocks separated by common delimiters
    const blocks = content.split(/(?:---+|===+|Patient\s*(?:Record|Profile|#)\s*\d*)/i).filter(b => b.trim().length > 20);

    if (blocks.length <= 1) {
        // Treat entire content as one patient
        const patient = extractPatientFromText(content);
        if (patient.name) {
            patients.push(patient);
        } else {
            warnings.push('Could not extract a patient name from the text. The entire content was saved as a doctor note.');
            patients.push({
                name: 'Unknown Patient (Imported)',
                doctorNotes: [{ note: content.trim(), date: new Date().toISOString().split('T')[0] }],
                _sourceFormat: 'text',
                _importedAt: new Date().toISOString(),
            });
        }
    } else {
        blocks.forEach((block, idx) => {
            const patient = extractPatientFromText(block);
            if (patient.name) {
                patients.push(patient);
            } else {
                warnings.push(`Block ${idx + 1}: Could not extract patient name. Saved as note for "Unknown Patient".`);
            }
        });
    }

    return {
        success: patients.length > 0,
        totalRecords: patients.length,
        newPatients: patients,
        mergedPatients: [],
        errors: [],
        warnings: [
            'Text/PDF import uses best-effort extraction. Please review imported data carefully.',
            ...warnings,
        ],
        sourceFormat: 'text'
    };
}

function extractPatientFromText(text: string): ImportedPatient {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // Pattern matchers
    const namePattern = /(?:name|patient)\s*[:\-]\s*(.+)/i;
    const agePattern = /(?:age)\s*[:\-]\s*(\d+)/i;
    const genderPattern = /(?:gender|sex)\s*[:\-]\s*(male|female|m|f|other)/i;
    const phonePattern = /(?:phone|mobile|contact|tel)\s*[:\-]\s*([\d\s\+\-\(\)]+)/i;
    const emailPattern = /(?:email|mail)\s*[:\-]\s*([\w.+\-]+@[\w\-]+\.[\w.]+)/i;
    const bpPattern = /(?:bp|blood pressure)\s*[:\-]\s*(\d+)\s*\/\s*(\d+)/i;
    const hrPattern = /(?:heart rate|hr|pulse)\s*[:\-]\s*(\d+)/i;
    const spo2Pattern = /(?:spo2|oxygen|o2)\s*[:\-]\s*(\d+)/i;
    const tempPattern = /(?:temp|temperature)\s*[:\-]\s*([\d.]+)/i;
    const diagnosisPattern = /(?:diagnosis|dx|assessment|impression)\s*[:\-]\s*(.+)/i;
    const medicationPattern = /(?:medications?|meds|drugs|rx|prescription)\s*[:\-]\s*(.+)/i;

    let name = '';
    let age: number | undefined;
    let gender: string | undefined;
    let phone: string | undefined;
    let email: string | undefined;
    let vitals: ImportedPatient['vitals'] = {};
    let reason = '';
    let medicationsList: string[] = [];
    const noteLines: string[] = [];

    for (const line of lines) {
        let matched = false;

        const nameMatch = line.match(namePattern);
        if (nameMatch) { name = nameMatch[1].trim(); matched = true; }

        const ageMatch = line.match(agePattern);
        if (ageMatch) { age = parseInt(ageMatch[1]); matched = true; }

        const genderMatch = line.match(genderPattern);
        if (genderMatch) { gender = genderMatch[1].charAt(0).toUpperCase(); matched = true; }

        const phoneMatch = line.match(phonePattern);
        if (phoneMatch) { phone = phoneMatch[1].trim(); matched = true; }

        const emailMatch = line.match(emailPattern);
        if (emailMatch) { email = emailMatch[1].trim(); matched = true; }

        const bpMatch = line.match(bpPattern);
        if (bpMatch) { vitals.bps = parseInt(bpMatch[1]); vitals.bpd = parseInt(bpMatch[2]); matched = true; }

        const hrMatch = line.match(hrPattern);
        if (hrMatch) { vitals.heartRate = parseInt(hrMatch[1]); matched = true; }

        const spo2Match = line.match(spo2Pattern);
        if (spo2Match) { vitals.spo2 = parseInt(spo2Match[1]); matched = true; }

        const tempMatch = line.match(tempPattern);
        if (tempMatch) { vitals.temp = parseFloat(tempMatch[1]); matched = true; }

        const dxMatch = line.match(diagnosisPattern);
        if (dxMatch) { reason = dxMatch[1].trim(); matched = true; }

        const medMatch = line.match(medicationPattern);
        if (medMatch) {
            medicationsList = medMatch[1].split(/[;,|]/).map(m => m.trim()).filter(Boolean);
            matched = true;
        }

        if (!matched) {
            noteLines.push(line);
        }
    }

    return {
        name,
        age,
        gender,
        phone,
        email,
        reasonForVisit: reason || 'Imported Record',
        medications: { current: medicationsList, new: [] },
        vitals: Object.keys(vitals).length > 0 ? vitals : undefined,
        doctorNotes: noteLines.length > 0 ? [{ note: noteLines.join('\n'), date: new Date().toISOString().split('T')[0] }] : undefined,
        _sourceFormat: 'text',
        _importedAt: new Date().toISOString(),
    };
}

// ---- MERGE LOGIC ----

/**
 * Detect duplicates based on name + phone + email
 */
export function detectDuplicates(
    incoming: ImportedPatient[],
    existing: Patient[]
): ImportResult {
    const newPatients: ImportedPatient[] = [];
    const mergedPatients: ImportResult['mergedPatients'] = [];

    for (const imported of incoming) {
        const match = existing.find(ex => {
            const nameMatch = normalizeName(ex.name) === normalizeName(imported.name);
            // If phone or email exists on both sides and matches, it's a merge
            const phoneMatch = imported.phone && (ex as any).phone && normalizePhone(imported.phone) === normalizePhone((ex as any).phone);
            const emailMatch = imported.email && (ex as any).email && imported.email.toLowerCase() === (ex as any).email?.toLowerCase();

            // Name must match AND (phone or email must match if available)
            if (!nameMatch) return false;
            if (imported.phone && (ex as any).phone) return phoneMatch;
            if (imported.email && (ex as any).email) return emailMatch;
            // If only name matches and no phone/email to compare, treat as name match (merge)
            return nameMatch;
        });

        if (match) {
            // Calculate which fields are being merged
            const mergedFields: string[] = [];
            if (imported.medications?.current?.length) mergedFields.push('medications');
            if (imported.prescriptions?.length) mergedFields.push('prescriptions');
            if (imported.medicalBills?.length) mergedFields.push('medicalBills');
            if (imported.doctorNotes?.length) mergedFields.push('doctorNotes');
            if (imported.vitals) mergedFields.push('vitals');
            if (imported.symptoms?.length) mergedFields.push('symptoms');
            if (imported.reasonForVisit) mergedFields.push('reasonForVisit');

            mergedPatients.push({
                existing: match,
                incoming: imported,
                mergedFields,
            });
        } else {
            newPatients.push(imported);
        }
    }

    return {
        success: true,
        totalRecords: incoming.length,
        newPatients,
        mergedPatients,
        errors: [],
        warnings: [],
        sourceFormat: incoming[0]?._sourceFormat || 'unknown',
    };
}

function normalizeName(name: string): string {
    return name.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
}

function normalizePhone(phone: string): string {
    return phone.replace(/[^0-9]/g, '').slice(-10);
}

function normalizeRiskLevel(level: string | undefined): 'Critical' | 'High' | 'Monitor' | 'Stable' {
    if (!level) return 'Stable';
    const l = level.toLowerCase();
    if (l.includes('critical') || l.includes('urgent') || l.includes('emergency')) return 'Critical';
    if (l.includes('high') || l.includes('priority') || l.includes('severe')) return 'High';
    if (l.includes('monitor') || l.includes('moderate') || l.includes('watch')) return 'Monitor';
    return 'Stable';
}

/**
 * Convert an ImportedPatient into the SC-OS Patient schema for db.json insertion
 */
export function toPatientSchema(imported: ImportedPatient, newId: string): Patient & Record<string, any> {
    return {
        id: newId,
        name: imported.name,
        age: imported.age || 0,
        gender: imported.gender || 'U',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        reasonForVisit: imported.reasonForVisit || 'Imported Record',
        riskLevel: imported.riskLevel || 'Stable',
        status: 'Waiting' as const,
        redFlags: imported.redFlags || [],
        careGaps: imported.careGaps || [],
        medDeltas: imported.medDeltas || [],
        intakeSummary: imported.intakeSummary || `Imported on ${new Date().toLocaleDateString('en-IN')}`,
        medications: imported.medications || { current: [], new: [] },
        vitals: imported.vitals || { temp: 98.6, bps: 120, bpd: 80, spo2: 98, heartRate: 72, rr: 16 },
        symptoms: imported.symptoms || [],
        // Extended fields
        phone: imported.phone || '',
        email: imported.email || '',
        prescriptions: imported.prescriptions || [],
        medicalBills: imported.medicalBills || [],
        doctorNotes: imported.doctorNotes || [],
        clinicalNote: imported.clinicalNote || '',
        _importedAt: imported._importedAt || new Date().toISOString(),
        _sourceFormat: imported._sourceFormat || 'unknown',
    };
}
