# Product Requirements Document (PRD): Smart Clinic Dashboard (Cardiology OS)

## 1. Executive Summary
The **Smart Clinic Dashboard (Cardiology OS)** is a premium, data-driven operating system designed specifically for modern cardiology practices. It transitions traditional clinic management into an intelligent, proactive ecosystem by integrating high-fidelity health scoring, diagnostic interpretations, and automated patient communication.

---

## 2. Core Vision
To empower cardiologists with a "Context-First" interface that surface critical clinical data (vitals, health scores, and medication adherence) before the patient even enters the consultation room.

---

## 3. Key Feature Modules

### 3.1. Intelligent Patient Registry (The Command Center)
The registry is no longer a static list but an operational hub.
- **Enhanced Columnar Data**: Focuses on clinical metrics over administrative ones. Removed "Time" and "Status" to prioritize:
    - **Patient Profile**: Integrated view of Name, Age, Sex, Weight (kg), and Height (cm).
    - **Dawai (Medicines)**: Real-time listing of active medications.
    - **Clinical Diagnostics**: Symptom-based tagging (e.g., Fever, Palpitations) for immediate triage.
    - **Last Visited & Next Follow-up**: A dual-date timeline for every patient.
- **Larger Row Geometry**: Optimized for high-density information without visual fatigue.

### 3.2. BN Smart Life "Detection" System
A proprietary health scoring algorithm that provides a granular 0-100 score.
- **Dynamic Scoring**: Calculated based on risk levels (Critical, High, Monitor, Stable) and baseline vitals.
- **Triage Visualization**: Color-coded badges (Red, Amber, Blue) provide instant visual cues for high-risk patients.
- **The "ASK" Automation**:
    - **Functionality**: A green WhatsApp "ASK" button appears for patients who haven't completed their digital health assessment.
    - **Interaction**: One-click redirect to WhatsApp with a personalized template and unique tracking link.

### 3.3. Premium Patient Profile & Metabolic Scale
A deeper dive into patient health through structured tabs.
- **Clinical Note**: AI-prefilled SOAP notes (Subjective, Objective, Assessment, Plan).
- **Dawai (Formerly Prescriptions)**: Rebranded to local terminology. Features an "Enhanced Dawai Writer" with "One-Click" capabilities.
- **Diagnostics Interpretation**: Instead of just listing tests, it displays **Interpretations** (e.g., "Normal LV function", "Borderline LDL").
- **Metabolic Scale**: A high-fidelity visual dashboard containing:
    - **Weight Analysis**: Current vs. Ideal weight.
    - **BMI Tracking**: Numerical score + Scale Verdict (Normal, Obese, etc.).
    - **Advanced Metrics**: Body Fat %, Bone Mass, BMR, Visceral Fat, and Metabolic Age.

### 3.4. User Experience (UX) Enhancements
- **Sidebar Navigation**: Collapsed by default to maximize clinical screen real estate.
- **Responsive Dashboard Cards**: On the main landing page, cards are enriched with symptom tags and medication previews.
- **Direct Dawai (Rx) Paths**: Quick-action buttons to jump directly into medicine writing from any view.

---

## 4. Technical Specifications
- **Framework**: Next.js 14 (App Router).
- **Styling**: Vanilla CSS for premium performance and micro-animations.
- **Icons**: Lucide-React for clean, clinical iconography.
- **State Management**: React Hooks (useState/useEffect) with Context API for Specialty configurations.
- **Data Architecture**: Structured JSON patient models supporting vitals, symptoms, and medication deltas.

---

## 5. Team Operational Guidelines
1. **Terminology**: Use "Dawai" for all patient-facing and UI-internal medicine references.
2. **Clinical Accuracy**: Always display "Interpretation" next to diagnostic tests.
3. **Safety First**: Red flags and high-risk health scores (Detection) must always be visible in the "Context Lens".

---

## 6. Future Roadmap
- **V2 Integration**: Live synchronization with wearable health data (SpO2/Heart Rate).
- **AI Copilot**: Automated clinical advice based on guideline-driven (AHA/ACC) protocols.
- **Paperless Workflow**: Direct-to-Pharmacy digital "Dawai" orders.
