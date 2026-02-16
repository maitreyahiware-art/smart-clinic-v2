'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
    Upload, Download, FileJson, FileSpreadsheet, FileText,
    CheckCircle, AlertCircle, AlertTriangle, X, Users,
    ArrowRight, Loader2, Eye, Merge, UserPlus, ChevronDown,
    ChevronUp, File, Shield, Trash2
} from 'lucide-react';

// ---- TYPES ----
interface PreviewPatient {
    name: string;
    age?: number;
    gender?: string;
    phone?: string;
    email?: string;
    reasonForVisit?: string;
    riskLevel?: string;
    hasPrescriptions?: boolean;
    hasBills?: boolean;
    hasNotes?: boolean;
    medicationCount?: number;
}

interface MergePreview {
    existingName: string;
    existingId: string;
    incomingName: string;
    mergedFields: string[];
}

interface PreviewResult {
    success: boolean;
    sourceFormat: string;
    totalRecords: number;
    newPatients: PreviewPatient[];
    mergedPatients: MergePreview[];
    errors: string[];
    warnings: string[];
}

interface ConfirmResult {
    success: boolean;
    message: string;
    addedCount: number;
    mergedCount: number;
    totalInDb: number;
}

type ImportStep = 'upload' | 'preview' | 'importing' | 'done';

export default function DataMigration() {
    const [step, setStep] = useState<ImportStep>('upload');
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState<string>('');
    const [preview, setPreview] = useState<PreviewResult | null>(null);
    const [confirmResult, setConfirmResult] = useState<ConfirmResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedNew, setExpandedNew] = useState(true);
    const [expandedMerge, setExpandedMerge] = useState(true);
    const [exportLoading, setExportLoading] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ---- FILE HANDLING ----
    const readFile = useCallback((file: File) => {
        setSelectedFile(file);
        setError(null);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const content = e.target?.result as string;
            setFileContent(content);

            // Auto-preview
            setLoading(true);
            try {
                const res = await fetch('/api/patients/import', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content,
                        fileName: file.name,
                        action: 'preview',
                    }),
                });
                const data = await res.json();

                if (data.success) {
                    setPreview(data);
                    setStep('preview');
                } else {
                    setError(data.errors?.join(', ') || 'Failed to parse file.');
                }
            } catch (err: any) {
                setError(`Failed to analyze file: ${err.message}`);
            }
            setLoading(false);
        };

        reader.onerror = () => setError('Failed to read file.');

        if (file.name.endsWith('.pdf')) {
            // For PDF, we read as text (client-side limitation — real PDF parsing would need a library)
            reader.readAsText(file);
        } else {
            reader.readAsText(file);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) readFile(file);
    }, [readFile]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) readFile(file);
    }, [readFile]);

    // ---- CONFIRM IMPORT ----
    const confirmImport = async () => {
        if (!fileContent || !selectedFile) return;
        setStep('importing');
        setLoading(true);

        try {
            const res = await fetch('/api/patients/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: fileContent,
                    fileName: selectedFile.name,
                    action: 'confirm',
                }),
            });
            const data = await res.json();

            if (data.success) {
                setConfirmResult(data);
                setStep('done');
            } else {
                setError(data.error || 'Import failed.');
                setStep('preview');
            }
        } catch (err: any) {
            setError(`Import failed: ${err.message}`);
            setStep('preview');
        }
        setLoading(false);
    };

    // ---- EXPORT ----
    const handleExport = async (format: 'json' | 'csv') => {
        setExportLoading(format);
        try {
            const res = await fetch(`/api/patients/export?format=${format}`);
            if (!res.ok) throw new Error('Export failed');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `smart_clinic_export_${new Date().toISOString().split('T')[0]}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err: any) {
            setError(`Export failed: ${err.message}`);
        }
        setExportLoading(null);
    };

    // ---- RESET ----
    const resetImport = () => {
        setStep('upload');
        setSelectedFile(null);
        setFileContent('');
        setPreview(null);
        setConfirmResult(null);
        setError(null);
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    // ---- RENDER HELPERS ----
    const getFormatIcon = (format: string) => {
        switch (format) {
            case 'json': return <FileJson size={20} color="#F59E0B" />;
            case 'csv': return <FileSpreadsheet size={20} color="#10B981" />;
            default: return <FileText size={20} color="#6366F1" />;
        }
    };

    const getFormatLabel = (format: string) => {
        switch (format) {
            case 'json': return 'JSON';
            case 'csv': return 'CSV / Spreadsheet';
            case 'text': return 'Text / PDF';
            default: return format.toUpperCase();
        }
    };

    // ---- STYLES ----
    const sectionCard: React.CSSProperties = {
        background: 'var(--color-white)',
        borderRadius: '16px',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
    };

    const sectionHeader: React.CSSProperties = {
        padding: '20px 24px',
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg-primary)',
    };

    const sectionBody: React.CSSProperties = {
        padding: '24px',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* ========== IMPORT SECTION ========== */}
            <div style={sectionCard}>
                <div style={sectionHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #00B6C1 0%, #008B9A 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Upload size={20} color="white" />
                        </div>
                        <div>
                            <h3 style={{
                                fontFamily: 'var(--font-serif)', fontSize: '1.3rem',
                                color: 'var(--color-brand-secondary)', margin: 0,
                            }}>
                                Import Patient Data
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                                Migrate data from other EMR systems. Supports JSON, CSV, and Text/PDF files.
                            </p>
                        </div>
                    </div>
                </div>

                <div style={sectionBody}>
                    {/* Error Bar */}
                    {error && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '12px 16px', background: '#FEF2F2', border: '1px solid #FECACA',
                            borderRadius: '10px', marginBottom: '20px', color: '#991B1B',
                            fontSize: '0.9rem', fontWeight: 500,
                        }}>
                            <AlertCircle size={18} />
                            <span style={{ flex: 1 }}>{error}</span>
                            <button onClick={() => setError(null)} style={{
                                background: 'transparent', border: 'none', cursor: 'pointer',
                                color: '#991B1B', padding: '4px',
                            }}>
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* ---- STEP: UPLOAD ---- */}
                    {step === 'upload' && (
                        <div>
                            {/* Drop Zone */}
                            <div
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    border: `2px dashed ${dragOver ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                                    borderRadius: '16px',
                                    padding: '48px 32px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    background: dragOver ? 'rgba(0, 182, 193, 0.05)' : 'transparent',
                                }}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json,.csv,.txt,.pdf"
                                    onChange={handleFileSelect}
                                    style={{ display: 'none' }}
                                />

                                {loading ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                                        <Loader2 size={40} color="var(--color-brand-primary)" style={{ animation: 'spin 1s linear infinite' }} />
                                        <p style={{ color: 'var(--color-brand-secondary)', fontWeight: 600 }}>
                                            Analyzing file...
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{
                                            width: '64px', height: '64px', borderRadius: '16px',
                                            background: dragOver ? 'var(--color-brand-primary)' : 'var(--color-bg-primary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            margin: '0 auto 16px',
                                            transition: 'all 0.3s',
                                        }}>
                                            <Upload size={28} color={dragOver ? 'white' : 'var(--color-brand-primary)'} />
                                        </div>
                                        <h4 style={{
                                            fontSize: '1.1rem', fontWeight: 700, margin: '0 0 8px 0',
                                            color: 'var(--color-brand-secondary)',
                                        }}>
                                            Drop your file here or click to browse
                                        </h4>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', margin: 0 }}>
                                            Supports <strong>.json</strong>, <strong>.csv</strong>, <strong>.txt</strong>, and <strong>.pdf</strong> files
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Format Guide Cards */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '12px', marginTop: '20px',
                            }}>
                                {[
                                    { icon: <FileJson size={22} color="#F59E0B" />, label: 'JSON', desc: 'SC-OS, FHIR, or generic EMR exports', bg: '#FFFBEB', border: '#FDE68A' },
                                    { icon: <FileSpreadsheet size={22} color="#10B981" />, label: 'CSV / Excel', desc: 'Spreadsheet exports with header row', bg: '#ECFDF5', border: '#A7F3D0' },
                                    { icon: <FileText size={22} color="#6366F1" />, label: 'Text / PDF', desc: 'Free-text records, discharge summaries', bg: '#EEF2FF', border: '#C7D2FE' },
                                ].map((f) => (
                                    <div key={f.label} style={{
                                        padding: '16px', borderRadius: '12px',
                                        background: f.bg, border: `1px solid ${f.border}`,
                                        display: 'flex', flexDirection: 'column', gap: '8px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {f.icon}
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-brand-secondary)' }}>{f.label}</span>
                                        </div>
                                        <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                                            {f.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ---- STEP: PREVIEW ---- */}
                    {step === 'preview' && preview && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* File Info Bar */}
                            <div style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '14px 20px', background: '#F0FDFA',
                                borderRadius: '12px', border: '1px solid #99F6E4',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {getFormatIcon(preview.sourceFormat)}
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-brand-secondary)' }}>
                                            {selectedFile?.name}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                                            {getFormatLabel(preview.sourceFormat)} • {preview.totalRecords} records detected
                                        </div>
                                    </div>
                                </div>
                                <button onClick={resetImport} style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '8px 14px', borderRadius: '8px',
                                    background: 'white', border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-secondary)', cursor: 'pointer',
                                    fontSize: '0.85rem', fontWeight: 500,
                                }}>
                                    <X size={14} /> Change File
                                </button>
                            </div>

                            {/* Summary Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                                <div style={{
                                    padding: '16px 20px', borderRadius: '12px',
                                    background: '#ECFDF5', border: '1px solid #A7F3D0',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <UserPlus size={18} color="#059669" />
                                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
                                            {preview.newPatients.length}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: '#065F46', fontWeight: 600 }}>
                                        New Patients
                                    </span>
                                </div>
                                <div style={{
                                    padding: '16px 20px', borderRadius: '12px',
                                    background: '#EFF6FF', border: '1px solid #BFDBFE',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <Merge size={18} color="#2563EB" />
                                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563EB' }}>
                                            {preview.mergedPatients.length}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: 600 }}>
                                        Duplicate Merges
                                    </span>
                                </div>
                                <div style={{
                                    padding: '16px 20px', borderRadius: '12px',
                                    background: preview.warnings.length > 0 ? '#FFFBEB' : '#F0FDF4',
                                    border: `1px solid ${preview.warnings.length > 0 ? '#FDE68A' : '#BBF7D0'}`,
                                    textAlign: 'center',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                                        {preview.warnings.length > 0
                                            ? <AlertTriangle size={18} color="#D97706" />
                                            : <CheckCircle size={18} color="#16A34A" />
                                        }
                                        <span style={{
                                            fontSize: '1.5rem', fontWeight: 800,
                                            color: preview.warnings.length > 0 ? '#D97706' : '#16A34A',
                                        }}>
                                            {preview.warnings.length}
                                        </span>
                                    </div>
                                    <span style={{
                                        fontSize: '0.8rem', fontWeight: 600,
                                        color: preview.warnings.length > 0 ? '#92400E' : '#166534',
                                    }}>
                                        Warnings
                                    </span>
                                </div>
                            </div>

                            {/* Warnings */}
                            {preview.warnings.length > 0 && (
                                <div style={{
                                    padding: '14px 18px', borderRadius: '10px',
                                    background: '#FFFBEB', border: '1px solid #FDE68A',
                                    fontSize: '0.85rem', color: '#92400E',
                                }}>
                                    <div style={{ fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <AlertTriangle size={14} /> Warnings
                                    </div>
                                    <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {preview.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                    </ul>
                                </div>
                            )}

                            {/* New Patients List */}
                            {preview.newPatients.length > 0 && (
                                <div style={{
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '12px', overflow: 'hidden',
                                }}>
                                    <button
                                        onClick={() => setExpandedNew(!expandedNew)}
                                        style={{
                                            width: '100%', padding: '14px 20px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            background: '#ECFDF5', border: 'none', cursor: 'pointer',
                                            borderBottom: expandedNew ? '1px solid #A7F3D0' : 'none',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <UserPlus size={18} color="#059669" />
                                            <span style={{ fontWeight: 700, color: '#065F46' }}>
                                                New Patients ({preview.newPatients.length})
                                            </span>
                                        </div>
                                        {expandedNew ? <ChevronUp size={18} color="#059669" /> : <ChevronDown size={18} color="#059669" />}
                                    </button>
                                    {expandedNew && (
                                        <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                                            {preview.newPatients.map((p, i) => (
                                                <div key={i} style={{
                                                    display: 'grid', gridTemplateColumns: '1fr auto',
                                                    alignItems: 'center', gap: '12px',
                                                    padding: '12px 20px',
                                                    borderBottom: i < preview.newPatients.length - 1 ? '1px solid var(--color-border)' : 'none',
                                                    background: 'white',
                                                }}>
                                                    <div>
                                                        <div style={{ fontWeight: 700, color: 'var(--color-brand-secondary)', fontSize: '0.95rem' }}>
                                                            {p.name}
                                                        </div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                                                            {[p.age && `${p.age}y`, p.gender, p.phone, p.reasonForVisit].filter(Boolean).join(' • ')}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '6px' }}>
                                                        {p.riskLevel && (
                                                            <span style={{
                                                                padding: '3px 10px', borderRadius: '999px',
                                                                fontSize: '0.7rem', fontWeight: 700,
                                                                background: p.riskLevel === 'Critical' ? '#FEE2E2' :
                                                                    p.riskLevel === 'High' ? '#FFF7ED' :
                                                                        p.riskLevel === 'Monitor' ? '#EFF6FF' : '#F0FDF4',
                                                                color: p.riskLevel === 'Critical' ? '#991B1B' :
                                                                    p.riskLevel === 'High' ? '#9A3412' :
                                                                        p.riskLevel === 'Monitor' ? '#1E40AF' : '#166534',
                                                            }}>
                                                                {p.riskLevel}
                                                            </span>
                                                        )}
                                                        {p.hasPrescriptions && <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, background: '#F3E8FF', color: '#7C3AED' }}>Rx</span>}
                                                        {p.hasBills && <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, background: '#FEF3C7', color: '#92400E' }}>₹</span>}
                                                        {p.hasNotes && <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, background: '#E0E7FF', color: '#3730A3' }}>Notes</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Merge Patients List */}
                            {preview.mergedPatients.length > 0 && (
                                <div style={{
                                    border: '1px solid var(--color-border)',
                                    borderRadius: '12px', overflow: 'hidden',
                                }}>
                                    <button
                                        onClick={() => setExpandedMerge(!expandedMerge)}
                                        style={{
                                            width: '100%', padding: '14px 20px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            background: '#EFF6FF', border: 'none', cursor: 'pointer',
                                            borderBottom: expandedMerge ? '1px solid #BFDBFE' : 'none',
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Merge size={18} color="#2563EB" />
                                            <span style={{ fontWeight: 700, color: '#1E40AF' }}>
                                                Duplicate Merges ({preview.mergedPatients.length})
                                            </span>
                                        </div>
                                        {expandedMerge ? <ChevronUp size={18} color="#2563EB" /> : <ChevronDown size={18} color="#2563EB" />}
                                    </button>
                                    {expandedMerge && (
                                        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                            {preview.mergedPatients.map((m, i) => (
                                                <div key={i} style={{
                                                    display: 'flex', alignItems: 'center', gap: '12px',
                                                    padding: '12px 20px',
                                                    borderBottom: i < preview.mergedPatients.length - 1 ? '1px solid var(--color-border)' : 'none',
                                                    background: 'white',
                                                }}>
                                                    <Merge size={16} color="#60A5FA" />
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 700, color: 'var(--color-brand-secondary)', fontSize: '0.9rem' }}>
                                                            {m.existingName}
                                                        </div>
                                                        <div style={{ fontSize: '0.78rem', color: '#2563EB', marginTop: '2px' }}>
                                                            Merging: {m.mergedFields.join(', ')}
                                                        </div>
                                                    </div>
                                                    <span style={{
                                                        padding: '3px 10px', borderRadius: '999px',
                                                        fontSize: '0.7rem', fontWeight: 700,
                                                        background: '#DBEAFE', color: '#1E40AF',
                                                    }}>
                                                        Existing Patient
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Actions */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
                                <button onClick={resetImport} style={{
                                    padding: '12px 24px', borderRadius: '12px',
                                    background: 'white', border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-secondary)', cursor: 'pointer',
                                    fontWeight: 600, fontSize: '0.9rem',
                                }}>
                                    Cancel
                                </button>
                                <button onClick={confirmImport} style={{
                                    padding: '12px 32px', borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #00B6C1 0%, #008B9A 100%)',
                                    color: 'white', border: 'none', cursor: 'pointer',
                                    fontWeight: 700, fontSize: '0.9rem',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 182, 193, 0.3)',
                                    transition: 'all 0.2s',
                                }}>
                                    <Shield size={16} />
                                    Confirm Import ({preview.newPatients.length + preview.mergedPatients.length} records)
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ---- STEP: IMPORTING ---- */}
                    {step === 'importing' && (
                        <div style={{
                            textAlign: 'center', padding: '60px 20px',
                        }}>
                            <Loader2 size={48} color="var(--color-brand-primary)" style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-brand-secondary)', marginBottom: '8px' }}>
                                Importing Patient Data...
                            </h4>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                Organizing records and creating patient profiles. This may take a moment.
                            </p>
                        </div>
                    )}

                    {/* ---- STEP: DONE ---- */}
                    {step === 'done' && confirmResult && (
                        <div style={{
                            textAlign: 'center', padding: '40px 20px',
                        }}>
                            <div style={{
                                width: '72px', height: '72px', borderRadius: '50%',
                                background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px', border: '3px solid #A7F3D0',
                            }}>
                                <CheckCircle size={36} color="#059669" />
                            </div>
                            <h4 style={{
                                fontSize: '1.3rem', fontWeight: 800,
                                color: 'var(--color-brand-secondary)', marginBottom: '8px',
                            }}>
                                Import Complete!
                            </h4>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', marginBottom: '24px' }}>
                                {confirmResult.message}
                            </p>

                            <div style={{
                                display: 'flex', justifyContent: 'center', gap: '16px',
                                marginBottom: '24px',
                            }}>
                                <div style={{
                                    padding: '16px 24px', borderRadius: '12px',
                                    background: '#ECFDF5', border: '1px solid #A7F3D0',
                                }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>{confirmResult.addedCount}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#065F46', fontWeight: 600 }}>Added</div>
                                </div>
                                <div style={{
                                    padding: '16px 24px', borderRadius: '12px',
                                    background: '#EFF6FF', border: '1px solid #BFDBFE',
                                }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#2563EB' }}>{confirmResult.mergedCount}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: 600 }}>Merged</div>
                                </div>
                                <div style={{
                                    padding: '16px 24px', borderRadius: '12px',
                                    background: '#F0FDFA', border: '1px solid #99F6E4',
                                }}>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>{confirmResult.totalInDb}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-brand-secondary)', fontWeight: 600 }}>Total in DB</div>
                                </div>
                            </div>

                            <button onClick={resetImport} style={{
                                padding: '12px 32px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #00B6C1 0%, #008B9A 100%)',
                                color: 'white', border: 'none', cursor: 'pointer',
                                fontWeight: 700, fontSize: '0.9rem',
                                boxShadow: '0 4px 12px rgba(0, 182, 193, 0.3)',
                            }}>
                                Import Another File
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ========== EXPORT SECTION ========== */}
            <div style={sectionCard}>
                <div style={sectionHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Download size={20} color="white" />
                        </div>
                        <div>
                            <h3 style={{
                                fontFamily: 'var(--font-serif)', fontSize: '1.3rem',
                                color: 'var(--color-brand-secondary)', margin: 0,
                            }}>
                                Export Patient Data
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                                Download all patient records for backup or migration to another system.
                            </p>
                        </div>
                    </div>
                </div>

                <div style={sectionBody}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* JSON Export */}
                        <button
                            onClick={() => handleExport('json')}
                            disabled={!!exportLoading}
                            style={{
                                padding: '24px', borderRadius: '14px',
                                background: 'white', border: '2px solid var(--color-border)',
                                cursor: exportLoading ? 'not-allowed' : 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                                transition: 'all 0.2s',
                                opacity: exportLoading && exportLoading !== 'json' ? 0.5 : 1,
                            }}
                            onMouseOver={(e) => { if (!exportLoading) e.currentTarget.style.borderColor = '#F59E0B'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                        >
                            {exportLoading === 'json'
                                ? <Loader2 size={32} color="#F59E0B" style={{ animation: 'spin 1s linear infinite' }} />
                                : <FileJson size={32} color="#F59E0B" />
                            }
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-brand-secondary)' }}>
                                Export as JSON
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, textAlign: 'center' }}>
                                Full-fidelity export. Best for SC-OS to SC-OS migration.
                            </p>
                        </button>

                        {/* CSV Export */}
                        <button
                            onClick={() => handleExport('csv')}
                            disabled={!!exportLoading}
                            style={{
                                padding: '24px', borderRadius: '14px',
                                background: 'white', border: '2px solid var(--color-border)',
                                cursor: exportLoading ? 'not-allowed' : 'pointer',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                                transition: 'all 0.2s',
                                opacity: exportLoading && exportLoading !== 'csv' ? 0.5 : 1,
                            }}
                            onMouseOver={(e) => { if (!exportLoading) e.currentTarget.style.borderColor = '#10B981'; }}
                            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                        >
                            {exportLoading === 'csv'
                                ? <Loader2 size={32} color="#10B981" style={{ animation: 'spin 1s linear infinite' }} />
                                : <FileSpreadsheet size={32} color="#10B981" />
                            }
                            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-brand-secondary)' }}>
                                Export as CSV
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, textAlign: 'center' }}>
                                Spreadsheet compatible. Open in Excel or Google Sheets.
                            </p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Spinner keyframes (injected inline) */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
