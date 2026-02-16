# Smart Clinic Board - Technical Handover & Product Requirements Document

## 1. Executive Summary
**Project Name:** Smart Clinic Dashboard (SC-OS)
**Vision:** A "Physician-First" Operating System designed to eliminate administrative burden and provide a longitudinal intelligence layer for modern cardiologists.
**Current Status:** Phase 2 Completed (Polished MVP). Production-ready for demo.
**Target Audience:** Cardiologists and High-Volume Specialists in India.

---

## 2. Technical Stack & Architecture

### Core Technologies
-   **Framework:** Next.js 16.1.6 (App Router)
-   **Language:** TypeScript 5.x
-   **UI Library:** React 19.2.3
-   **Styling:** 
    -   **Primary:** Vanilla CSS Modules (`*.module.css`)
    -   **Secondary:** Inline Styles (heavily used for dynamic component logic)
    -   **Note:** No Tailwind CSS or Bootstrap.
-   **Icons:** `lucide-react`
-   **State Management:** React Context API (`SpecialtyContext`) + Local State.

### Folder Structure
```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # Main Dashboard (Calendar/Stats)
│   ├── analytics/          # Analysis & Reporting
│   ├── patients/           # Patient List
│   ├── patient/[id]/       # Patient Detail (The Core "Chart")
│   ├── prescriptions/      # New Advanced Rx Writer
│   ├── schedule/           # Detailed Scheduling
│   ├── settings/           # App Configuration (+ Data Migration)
│   ├── api/
│   │   └── patients/
│   │       ├── route.ts        # GET all patients
│   │       ├── [id]/route.ts   # GET/PATCH single patient
│   │       ├── import/route.ts # ✨ POST — Import parser + merge
│   │       └── export/route.ts # ✨ GET — Export JSON/CSV
│   └── layout.tsx          # Root Layout (Sidebar + Header)
├── components/
│   ├── Dashboard/          # Dashboard-specific widgets (Calendar, Stats)
│   ├── Patient/            # Patient Chart components (SoapNote, Vitals)
│   ├── Prescription/       # Rx Writer components
│   ├── Settings/
│   │   └── DataMigration.tsx   # ✨ Import/Export UI component
│   └── Layout/             # Sidebar, Header, etc.
├── lib/
│   ├── db.ts               # JSON file read/write (db.json)
│   └── importParser.ts     # ✨ Universal parser (JSON/CSV/Text)
├── data/                   # Mock Data & Static Constants
│   ├── patients.ts         # Patient Database (12 demo profiles)
│   ├── medications.ts      # Indian Drug Database (30+ items)
│   ├── prescriptionProtocols.ts
│   └── doctorActions.ts
└── context/                # Global State (SpecialtyContext)
```

---

## 3. Core Features (Implemented)

### A. The Dashboard (Command Center)
-   **Weekly/Monthly Calendar:** Custom-built React calendar with Day, Week, and Month views.
-   **Real-time Clock & Stats:** Live clock, Patients Seen vs Booked, and High Risk Alerts.
-   **Emergency Pivot:** A "Panic Button" that auto-reschedules low-priority cases to free up time for critical cardiac events.
-   **Smart Alerts:** Visual flagging of Critical/High Risk patients (SOS/Urgent labels).

### B. Patient Management
-   **Quick Patient Access:** Sidebar integrated search modal to find patients instantly.
-   **Unified Timeline:** A vertical, continuous view of "History" + "Current Visit" (no tabs for history).
-   **Risk Stratification:** 
    -   **BN Analysis Score:** Proprietary 0-100 health score.
    -   **Dynamic Flags:** "Critical", "Monitor", "Stable" based on vitals (e.g., BP >= 180 triggers Critical).

### C. Advanced Prescription Writer ("Fast Dawai")
-   **Indian Medication Database:** 30+ common drugs (Crocin, Glycomet, Telma, etc.) with brand/generic names.
-   **Smart Form:** Auto-calculates cost based on dosage/duration.
-   **Safety Checks:**
    -   **Contraindication Warnings:** Visual red alerts for conflicts.
    -   **Rx Requirement:** Flags controlled substances.
-   **Templates:** One-click protocol sets (e.g., "Hypertension Starter Pack").

### D. Clinical Intelligence
-   **Doctor Action Registry:** 20+ clinical actions (Labs, Referrals, Certificates) in a quick-access menu.
-   **Specialty Context:** Codebase supports "Context Switching" (currently Cardiology focused).

### E. Data Migration (Import / Export) ✨ NEW
**Location:** Settings → Data Migration tab

#### Import
-   **Multi-Format Support:** Accepts `.json`, `.csv`, `.txt`, and `.pdf` files.
-   **Universal Parser (`src/lib/importParser.ts`):** Auto-detects format and normalizes all data into SC-OS patient schema.
    -   JSON: Handles SC-OS native, FHIR bundles, generic `{ patients: [...] }` arrays.
    -   CSV: Auto-maps common column naming conventions (name, patient_name, phone, etc.).
    -   Text/PDF: Regex-based extraction of name, vitals, meds from free-text records.
-   **Smart Duplicate Detection:** Matches by **Name + Phone + Email**.
    -   If match found → **Merges** new data (prescriptions, bills, notes) into the existing profile.
    -   If no match → **Creates** a new patient record.
-   **Preview Before Commit:** Two-step flow: `preview` → `confirm`. Shows new patients vs. merges before writing to DB.
-   **Data Scope:** Imports patient demographics, vitals, medications, prescriptions, medical bills, and doctor notes.

#### Export
-   **JSON Export:** Full-fidelity export for SC-OS to SC-OS migration.
-   **CSV Export:** Spreadsheet-compatible for Excel / Google Sheets.
-   **Bulk or Single:** Export all patients or one patient by ID (`?id=X`).

#### API Routes
-   `POST /api/patients/import` — Body: `{ content, fileName, action: 'preview' | 'confirm' }`
-   `GET /api/patients/export?format=json|csv&id=optional`

---

## 4. UI/UX Design System
**Design Philosophy:** "Light OS" - Clean, breathable, and premium.
-   **Typography:** 
    -   Headers: *Lora* (Serif) - Adds authority and elegance.
    -   Body: *Inter* (Sans-serif) - High legibility.
-   **Color Palette:**
    -   **Primary:** Teal Blue (`#00B6C1`)
    -   **Background:** Soft Cream (`#FAFCEE`)
    -   **Secondary Text:** Deep Teal (`#0E5858`)
    -   **Accents:** Warm Yellow (`#FFCC00`) & SOS Red (`#EF4444`)
-   **Interactions:** Ripple effects, subtle lifts on hover, glassmorphism modals.

---

## 5. Deployment & Setup

### Prerequisites
-   Node.js v18+
-   npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

---

## 6. Roadmap: Phase 3 (The "To-Build" List)
*These features are partially designed but not fully implemented.*

1.  **AI Differential Diagnosis:** Integrate Google Gemini API to suggest diagnoses based on patient symptoms and vitals.
2.  **Lab Integration:** Connect with major lab providers (Dr. Lal, Apollo) for direct ordering.
3.  **WhatsApp Triage:** Automate patient intake via WhatsApp Business API (Twilio/Meta).
4.  **Backend Migration:** Move from `src/data/*.ts` mock files to a real database (PostgreSQL/Supabase).
5.  **Multi-Specialty Support:** Fully enable the "IVF" and "Orthopedics" modes currently in the code skeleton.

---

## 7. Known Issues & Notes
-   **Data Persistence:** Currently, all data resets on refresh (Mock Data). Needs a DB connection.
-   **Mobile Responsiveness:** Dashboard is optimized for Desktop/Tablet. Mobile view needs refinement.
-   **Styling Consistency:** Tech debt exists between Inline Styles and CSS Modules. Future refactors should standardize on CSS Modules.
