'use client';

import React, { useState } from 'react';
import { Search, X, Plus, Save, Printer, Send, AlertCircle } from 'lucide-react';
import { medicationDatabase, PrescriptionItem, Medication } from '@/data/medicationDatabase';

interface AdvancedPrescriptionWriterProps {
    patientId: string;
    patientName: string;
    onSave?: (items: PrescriptionItem[]) => void;
}

export default function AdvancedPrescriptionWriter({ patientId, patientName, onSave }: AdvancedPrescriptionWriterProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]);
    const [showMedSelector, setShowMedSelector] = useState(false);

    // Draft medication state
    const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
    const [formulation, setFormulation] = useState('');
    const [dosage, setDosage] = useState('');
    const [frequency, setFrequency] = useState('');
    const [duration, setDuration] = useState('7 Days');
    const [instructions, setInstructions] = useState('');
    const [quantity, setQuantity] = useState(10);

    const categories = ['All', 'Pain/Fever', 'Antibiotics', 'Diabetes', 'BP/Heart', 'GI', 'Respiratory', 'CNS', 'Vitamins'];

    const filteredMeds = medicationDatabase.filter(med => {
        const matchesSearch = med.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.genericName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleSelectMedication = (med: Medication) => {
        setSelectedMed(med);
        setFormulation(med.formulations[0] || '');
        setDosage(med.commonDosages[0] || '');
        setFrequency(med.frequencies[0] || '');
        setInstructions('Take after meals');
        setShowMedSelector(false);
    };

    const handleAddToRx = () => {
        if (!selectedMed) return;

        const item: PrescriptionItem = {
            medicationId: selectedMed.id,
            brandName: selectedMed.brandName,
            genericName: selectedMed.genericName,
            formulation,
            dosage,
            frequency,
            duration,
            instructions,
            quantity,
            cost: selectedMed.costPerUnit * quantity
        };

        setPrescriptionItems([...prescriptionItems, item]);

        // Reset form
        setSelectedMed(null);
        setFormulation('');
        setDosage('');
        setFrequency('');
        setDuration('7 Days');
        setInstructions('');
        setQuantity(10);
    };

    const handleRemoveItem = (index: number) => {
        setPrescriptionItems(prescriptionItems.filter((_, i) => i !== index));
    };

    const totalCost = prescriptionItems.reduce((sum, item) => sum + item.cost, 0);

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            maxWidth: '1200px',
            margin: '0 auto'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '4px' }}>
                        Prescription Writer
                    </h2>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        Patient: <strong>{patientName}</strong>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" style={{ padding: '8px 16px' }}>
                        <Save size={18} /> Save Draft
                    </button>
                    <button className="btn-primary" style={{ padding: '8px 16px' }}>
                        <Send size={18} /> Sign & Send
                    </button>
                </div>
            </div>

            {/* Current Prescription Items */}
            {prescriptionItems.length > 0 && (
                <div style={{
                    background: 'var(--color-bg-primary)',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '24px'
                }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
                        Current Prescription ({prescriptionItems.length} items)
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {prescriptionItems.map((item, index) => (
                            <div key={index} style={{
                                background: 'white',
                                padding: '12px',
                                borderRadius: '6px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                border: '1px solid #E5E7EB'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, color: 'var(--color-brand-secondary)', marginBottom: '4px' }}>
                                        {item.brandName} <span style={{ fontWeight: 400, fontSize: '0.85rem', color: '#666' }}>({item.genericName})</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#666', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                        <div><strong>Formulation:</strong> {item.formulation}</div>
                                        <div><strong>Dosage:</strong> {item.dosage}</div>
                                        <div><strong>Frequency:</strong> {item.frequency}</div>
                                        <div><strong>Duration:</strong> {item.duration}</div>
                                        <div><strong>Quantity:</strong> {item.quantity} units</div>
                                        <div><strong>Cost:</strong> ₹{item.cost.toFixed(2)}</div>
                                    </div>
                                    {item.instructions && (
                                        <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '4px', fontStyle: 'italic' }}>
                                            {item.instructions}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(index)}
                                    style={{ color: 'var(--color-error)', padding: '4px' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        marginTop: '12px',
                        paddingTop: '12px',
                        borderTop: '1px solid #E5E7EB',
                        textAlign: 'right',
                        fontSize: '1.1rem',
                        fontWeight: 600
                    }}>
                        Total Cost: ₹{totalCost.toFixed(2)}
                    </div>
                </div>
            )}

            {/* Add Medication Section */}
            {!selectedMed && (
                <div>
                    <button
                        onClick={() => setShowMedSelector(!showMedSelector)}
                        style={{
                            width: '100%',
                            padding: '16px',
                            background: 'linear-gradient(135deg, var(--color-brand-primary) 0%, #008B9A 100%)',
                            color: 'white',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '1rem',
                            fontWeight: 500
                        }}
                    >
                        <Plus size={20} />
                        Add Medication to Prescription
                    </button>

                    {showMedSelector && (
                        <div style={{ marginTop: '16px', border: '2px solid var(--color-brand-primary)', borderRadius: '8px', padding: '16px' }}>
                            {/* Search and Filter */}
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                    <input
                                        type="text"
                                        placeholder="Search medications..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px 10px 40px',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '6px',
                                            fontSize: '0.95rem'
                                        }}
                                    />
                                </div>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    style={{
                                        padding: '10px 12px',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '6px',
                                        fontSize: '0.95rem',
                                        minWidth: '150px'
                                    }}
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Medication List */}
                            <div style={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                gap: '8px'
                            }}>
                                {filteredMeds.map(med => (
                                    <button
                                        key={med.id}
                                        onClick={() => handleSelectMedication(med)}
                                        style={{
                                            padding: '12px',
                                            background: 'var(--color-bg-primary)',
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '6px',
                                            textAlign: 'left',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--color-brand-primary)';
                                            e.currentTarget.style.background = 'white';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.borderColor = '#E5E7EB';
                                            e.currentTarget.style.background = 'var(--color-bg-primary)';
                                        }}
                                    >
                                        <div style={{ fontWeight: 600, color: 'var(--color-brand-secondary)', marginBottom: '2px' }}>
                                            {med.brandName}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '4px' }}>
                                            {med.genericName}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#999' }}>
                                            <span style={{
                                                background: '#E5E7EB',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                marginRight: '4px'
                                            }}>
                                                {med.category}
                                            </span>
                                            ₹{med.costPerUnit}/unit
                                            {med.prescriptionRequired && (
                                                <span style={{ color: '#F59E0B', marginLeft: '4px' }}>Rx</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            {filteredMeds.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                    No medications found
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Medication Configuration Form */}
            {selectedMed && (
                <div style={{
                    marginTop: '16px',
                    border: '2px solid var(--color-accent-gamification)',
                    borderRadius: '8px',
                    padding: '20px',
                    background: '#FFFBEB'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--color-brand-secondary)' }}>
                                {selectedMed.brandName}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                {selectedMed.genericName} • {selectedMed.category}
                                {selectedMed.prescriptionRequired && (
                                    <span style={{ marginLeft: '8px', color: '#F59E0B', fontSize: '0.8rem' }}>
                                        ⚠️ Prescription Required
                                    </span>
                                )}
                            </p>
                        </div>
                        <button
                            onClick={() => setSelectedMed(null)}
                            style={{ fontSize: '1.5rem', color: '#999' }}
                        >
                            ×
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px' }}>
                                Formulation
                            </label>
                            <select
                                value={formulation}
                                onChange={(e) => setFormulation(e.target.value)}
                                style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                            >
                                {selectedMed.formulations.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px' }}>
                                Dosage
                            </label>
                            <select
                                value={dosage}
                                onChange={(e) => setDosage(e.target.value)}
                                style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                            >
                                {selectedMed.commonDosages.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px' }}>
                                Frequency
                            </label>
                            <select
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                            >
                                {selectedMed.frequencies.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px' }}>
                                Duration
                            </label>
                            <input
                                type="text"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                placeholder="e.g., 7 Days"
                                style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px' }}>
                                Quantity (units)
                            </label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                min="1"
                                style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px' }}>
                                Estimated Cost
                            </label>
                            <div style={{
                                padding: '8px',
                                background: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '6px',
                                fontWeight: 600,
                                color: 'var(--color-brand-primary)'
                            }}>
                                ₹{(selectedMed.costPerUnit * quantity).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '4px' }}>
                            Instructions for Patient
                        </label>
                        <input
                            type="text"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            placeholder="e.g., Take after meals with water"
                            style={{ width: '100%', padding: '8px', border: '1px solid #E5E7EB', borderRadius: '6px' }}
                        />
                    </div>

                    {selectedMed.contraindications && selectedMed.contraindications.length > 0 && (
                        <div style={{
                            padding: '12px',
                            background: '#FEE2E2',
                            borderRadius: '6px',
                            marginBottom: '16px',
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'flex-start'
                        }}>
                            <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <div style={{ fontWeight: 600, color: '#DC2626', fontSize: '0.85rem', marginBottom: '4px' }}>
                                    Contraindications
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#991B1B' }}>
                                    {selectedMed.contraindications.join(', ')}
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => setSelectedMed(null)}
                            style={{
                                padding: '10px 20px',
                                border: '1px solid #E5E7EB',
                                borderRadius: '6px',
                                background: 'white'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddToRx}
                            className="btn-primary"
                            style={{ padding: '10px 20px' }}
                        >
                            <Plus size={18} />
                            Add to Prescription
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
