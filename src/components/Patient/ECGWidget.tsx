'use client';

import React, { useEffect, useRef } from 'react';

export default function ECGWidget({ heartRate = 72 }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let x = 0;
        const width = canvas.width;
        const height = canvas.height;
        const midY = height / 2;

        const draw = () => {
            // Speed adjusted by heart rate
            const speed = heartRate / 30;

            // Clear a small strip ahead of the line
            ctx.fillStyle = 'white';
            ctx.fillRect(x, 0, 10, height);

            ctx.beginPath();
            ctx.strokeStyle = '#EF4444';
            ctx.lineWidth = 2;
            ctx.moveTo(x, midY);

            // ECG Waveform Logic
            const cyclePos = x % 100;
            let y = midY;

            if (cyclePos > 10 && cyclePos < 15) { // P-wave
                y -= 5;
            } else if (cyclePos >= 15 && cyclePos < 18) { // Q
                y += 5;
            } else if (cyclePos >= 18 && cyclePos < 22) { // R
                y -= 40;
            } else if (cyclePos >= 22 && cyclePos < 25) { // S
                y += 15;
            } else if (cyclePos > 40 && cyclePos < 60) { // T-wave
                y -= 10;
            }

            ctx.lineTo(x + speed, y);
            ctx.stroke();

            x += speed;
            if (x >= width) {
                x = 0;
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [heartRate]);

    return (
        <div style={{ background: '#000', borderRadius: '12px', padding: '12px', border: '1px solid #333', boxShadow: 'inset 0 0 20px rgba(239, 68, 68, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#EF4444', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live ECG</span>
                <span style={{ color: '#EF4444', fontSize: '0.75rem', fontWeight: 700 }}>{heartRate} BPM</span>
            </div>
            <canvas
                ref={canvasRef}
                width={300}
                height={100}
                style={{ width: '100%', height: '60px', borderRadius: '4px' }}
            />
        </div>
    );
}
