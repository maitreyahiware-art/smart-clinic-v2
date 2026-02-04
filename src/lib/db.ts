import fs from 'fs';
import path from 'path';
import { Patient } from '../data/patients';

const DB_PATH = path.join(process.cwd(), 'db.json');

export function getDb() {
    if (!fs.existsSync(DB_PATH)) {
        return { patients: [] };
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
}

export function saveDb(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export function getPatients(): Patient[] {
    const db = getDb();
    return db.patients || [];
}

export function updatePatient(id: string, updates: Partial<Patient>) {
    const db = getDb();
    const index = db.patients.findIndex((p: any) => p.id === id);
    if (index !== -1) {
        db.patients[index] = { ...db.patients[index], ...updates };
        saveDb(db);
        return db.patients[index];
    }
    return null;
}
