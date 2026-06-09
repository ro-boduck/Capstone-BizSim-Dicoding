'use client';

import React, { useEffect, useRef } from 'react';

interface AiAnimationProps {
  onComplete: () => void;
}

const STEPS = [
  { label: 'Memuat parameter finansial...', delay: 0 },
  { label: 'Preprocessing 150.000 data historis...', delay: 500 },
  { label: 'Menjalankan model klasifikasi kas...', delay: 1100 },
  { label: 'Menghasilkan rencana mitigasi bisnis...', delay: 1800 },
];

export default function AiAnimation({ onComplete }: AiAnimationProps) {
  const completedRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 2600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-10 animate-fade-in">
      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-surface border border-border-aura text-foreground text-[10px] font-semibold uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse inline-block" />
        Aura Health Engine v3.0 — RUNNING
      </div>

      {/* Flat Node Network SVG */}
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
          {/* Outer ring */}
          <circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke="var(--color-border-aura)"
            strokeWidth="1"
          />
          {/* Spinning segment */}
          <circle
            cx="100" cy="100" r="80"
            fill="none"
            stroke="var(--color-foreground)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="50 450"
            style={{ animation: 'spin 2s linear infinite', transformOrigin: 'center' }}
          />

          {/* Inner ring */}
          <circle
            cx="100" cy="100" r="50"
            fill="none"
            stroke="var(--color-border-aura)"
            strokeWidth="1"
          />
          <circle
            cx="100" cy="100" r="50"
            fill="none"
            stroke="var(--color-muted-text)"
            strokeWidth="1"
            strokeDasharray="20 300"
            style={{ animation: 'spin 1.5s linear infinite reverse', transformOrigin: 'center' }}
          />

          {/* Connections */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 50 * Math.cos(rad);
            const y1 = 100 + 50 * Math.sin(rad);
            const x2 = 100 + 80 * Math.cos(rad + Math.PI / 6);
            const y2 = 100 + 80 * Math.sin(rad + Math.PI / 6);
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="var(--color-border-aura)"
                strokeWidth="1"
              />
            );
          })}

          {/* Inner nodes */}
          {[0, 120, 240].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x   = 100 + 50 * Math.cos(rad);
            const y   = 100 + 50 * Math.sin(rad);
            return (
              <circle
                key={i}
                cx={x} cy={y} r="5"
                fill="var(--color-foreground)"
                style={{ animation: `pulse ${1.2 + i * 0.3}s ease-in-out infinite alternate` }}
              />
            );
          })}

          {/* Outer nodes */}
          {[30, 150, 270].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const x   = 100 + 80 * Math.cos(rad);
            const y   = 100 + 80 * Math.sin(rad);
            return (
              <circle
                key={i}
                cx={x} cy={y} r="4"
                fill="var(--color-muted-text)"
              />
            );
          })}

          {/* Center core */}
          <circle cx="100" cy="100" r="20" fill="var(--color-background)" stroke="var(--color-border-aura)" strokeWidth="1" />
          <text
            x="100" y="104"
            textAnchor="middle"
            fill="var(--color-foreground)"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            CORE
          </text>
        </svg>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            from { opacity: 0.3; }
            to   { opacity: 1; }
          }
        `}</style>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-[10px] font-mono text-muted-text mb-1">
          <span>Memproses parameter...</span>
          <span className="text-foreground font-semibold">100%</span>
        </div>
        <div className="h-1 bg-secondary-surface rounded-full overflow-hidden border border-border-aura">
          <div
            className="h-full bg-foreground"
            style={{ animation: 'progressFill 2.4s cubic-bezier(0.4,0,0.2,1) forwards' }}
          />
          <style>{`
            @keyframes progressFill {
              from { width: 0%; }
              to   { width: 100%; }
            }
          `}</style>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="w-full max-w-xs space-y-2">
        {STEPS.map(({ label, delay }, i) => (
          <StepItem key={i} label={label} delay={delay} />
        ))}
      </div>

      <p className="caption-default text-subtle-text text-center uppercase tracking-wider">
        Heuristic Classifier · 150k UMKM Dataset
      </p>
    </div>
  );
}

function StepItem({ label, delay }: { label: string; delay: number }) {
  return (
    <div
      className="flex items-center gap-2.5 text-[11px] text-medium-gray font-mono"
      style={{ animation: `stepFadeIn 0.4s ease forwards`, animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <span
        className="w-3.5 h-3.5 rounded-full border border-border-aura bg-secondary-surface flex items-center justify-center flex-shrink-0"
        style={{ animation: `stepCheck 0.3s ease forwards`, animationDelay: `${delay + 200}ms` }}
      >
        <svg className="w-2.5 h-2.5 text-foreground" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span>{label}</span>
      <style>{`
        @keyframes stepFadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
