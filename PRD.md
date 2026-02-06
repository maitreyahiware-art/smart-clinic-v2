# Product Requirements Document: Smart Cardiology OS (SC-OS)
**Pitch Deck & Functional Specification for the Modern Cardiologist**

---

## 1. Executive Vision: The "Physician-First" Philosophy
Current EMRs are administrative burdens. **Smart Cardiology OS (SC-OS)** is a clinical weapon. Our mission is to eliminate "Data Hunting" and "Chart Bloat," replacing them with a **Longitudinal Intelligence Layer** that puts the patient’s cardiac narrative exactly where the doctor’s eyes are.

### The "Doctor's Pitch"
*"SC-OS doesn't just store data; it interprets the patient's cardiac journey. We've removed the silos between charting and history, creating a single unified timeline that tells you exactly who is at risk, why they are there, and how they've progressed—all with zero unnecessary clicks."*

---

## 2. Core Feature Pillars: "The Big Four"

### 🛡️ Module 1: The Longitudinal Clinical Timeline
*The end of the segmented SOAP note.*
- **Unified Entry Node**: The traditional split between "Active Note" and "History" is gone. The doctor documents today's consultation as the top-most node in a continuous vertical timeline.
- **Smart Pre-Population**: Upon opening a chart, SC-OS assembles the **Presenting Complaint**, **Automated Cardiac Assessment** (BP, HR, SpO2), and **Intake Summary** into a polished narrative draft.
- **Contextual Recall**: Previous visits are displayed in high-fidelity cards directly below the active entry. Doctors can scroll through years of cardiac progress while writing today’s plan.

### 🧬 Module 2: Metabolic Intelligence & BN Analysis
*Instant clinical context without manual math.*
- **WHO-Standard Metabolic Scale**: Real-time calculation of **BMI and Category** (Underweight to Obese) with localized **Ideal Weight Goals**. Integrated into the primary registry for instant stratification.
- **BN Analysis (Biological Profiling)**: A proprietary 0-100 score synthesized with **Biological Health Markers** (e.g., Smoking status, Insomnia patterns, Sedentary lifestyle, Chronic Stress).
- **Diagnostic Interpretation Hub**: Replaces raw lab numbers with **Clinical Insights** (e.g., "Sinus Rhythm," "EF 60% - Normal," "Elevated LDL"). 

### ⚡ Module 3: High-Speed Clinical Operations
*Optimized for a 50-patient-per-day workflow.*
- **Fast Dawai Prescription**: A one-click pharmacotherapy interface. Selecting a cardiac shortcut (e.g., Atorvastatin, Metoprolol) instantly adds it to the prescription and the clinical narrative simultaneously.
- **Emergency Pivot & Agenda Control**: A real-time status tracker (Visited, No Show, Reschedule) allowing doctors or staff to re-prioritize the queue instantly based on patient acuity.
- **Ghost Actions**: A minimalist UI approach where secondary actions disappear when not needed, reducing visual fatigue during long shifts.

### 📱 Module 4: Integrated Triage Automation
*Reaching patients before they reach the clinic.*
- **Digital Health Triage (The "ASK" System)**: Identifies patients with missing pre-visit health data and allows staff to trigger a personalized WhatsApp health assessment with a single click.
- **WhatsApp Synchronization**: Templated outreach for follow-ups and critical score alerts, ensuring high patient compliance.

---

## 3. High-Fidelity UI/UX: The "Light OS" Aesthetic
Doctors spend 6+ hours a day on screens. SC-OS is designed as a **"Light OS"**:
- **Professional Palettes**: Uses Slate Grey (#1E293B) and Brand Teal (#00B6C1) to provide a premium, modern feel that looks impressive when shown to a patient.
- **Breathable Layouts**: Maximum whitespace to ensure that in emergency scenarios, the doctor can find critical vitals in <1 second.
- **Micro-Animations**: Subtle transitions that provide haptic-like visual feedback, making the software feel alive and responsive.

---

## 4. Clinical Impact & ROI for the Practice

| Metric | Outcome with SC-OS |
| :--- | :--- |
| **Documentation Time** | Reduced by ~40% via Smart Pre-population & Unified Timeline. |
| **Patient Throughput** | Increased via Emergency Pivot & Fast Dawai workflows. |
| **Clinical Intelligence** | Instant stratification via **SOS / Urgent** and **Priority Care** clinic flags. |
| **Patient Impression** | High; patients see a modern, tech-forward practice. |

---

## 5. Technical Architecture (The Engine)
- **High-Performance Stack**: Built on **Next.js 14** for sub-second page transitions.
- **Data Integrity**: Structured JSON models ensure complex cardiology data (ECG deltas, Holter results) is portable and searchable.
- **Specialty-Aware Logic**: A "Specialty Context" layer that changes the UI based on the doctor's field (e.g., showing ejection fraction for cardiologists vs. growth charts for pediatricians).

---

## 6. Pitch Closing Statement
*"SC-OS isn't just a digital version of a paper file. It's a clinical companion that anticipates the next question, automates the routine, and ensures that every cardiac decision is backed by longitudinal intelligence. It’s time for clinical software to feel as advanced as the medicine we practice."*
