'use client';

import React, { useState, useCallback } from 'react';
import Icon from '@/components/Icon';

// ─── Field configuration ──────────────────────────────────────────────────────
export const FIELD_CONFIG = [
  { id: 'modal_awal',             label: 'Modal Awal',            hint: 'Total modal/dana kas bisnis Anda (Rp)', placeholder: 'Contoh: 50.000.000',  min: 100000 },
  { id: 'biaya_tetap_bulanan',    label: 'Biaya Tetap Bulanan',   hint: 'Sewa, gaji tetap, internet, dll (Rp)',   placeholder: 'Contoh: 8.000.000',   min: 0 },
  { id: 'biaya_variabel_bulanan', label: 'Biaya Variabel Bulanan',hint: 'Bahan baku, komisi, dll (Rp)',            placeholder: 'Contoh: 12.000.000',  min: 0 },
  { id: 'pendapatan_bulanan',     label: 'Pendapatan Bulanan',    hint: 'Rata-rata omzet kotor per bulan (Rp)',   placeholder: 'Contoh: 25.000.000',  min: 0 },
] as const;

export type FieldId = typeof FIELD_CONFIG[number]['id'];
export type FormData = Record<FieldId, string>;
export type FormErrors = Partial<Record<FieldId, string>>;

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function formatRupiah(v: number | string) {
  if (!v && v !== 0) return '';
  return Number(v).toLocaleString('id-ID');
}

export function parseRupiah(s: string) {
  return Number(s.replace(/\./g, '').replace(',', '.')) || 0;
}

export function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};
  FIELD_CONFIG.forEach(({ id, label, min }) => {
    const val = parseRupiah(data[id]);
    if (!data[id]) { errors[id] = `${label} wajib diisi`; return; }
    if (isNaN(val)) { errors[id] = `${label} harus berupa angka`; return; }
    if (val < min) { errors[id] = `${label} minimal Rp ${min.toLocaleString('id-ID')}`; }
  });
  if (parseRupiah(data.biaya_tetap_bulanan) + parseRupiah(data.biaya_variabel_bulanan) === 0) {
    errors.biaya_tetap_bulanan = 'Total biaya bulanan tidak boleh nol';
  }
  return errors;
}

// ─── Live preview ─────────────────────────────────────────────────────────────
function LivePreview({ data }: { data: FormData }) {
  const modal    = parseRupiah(data.modal_awal);
  const tetap    = parseRupiah(data.biaya_tetap_bulanan);
  const variabel = parseRupiah(data.biaya_variabel_bulanan);
  const revenue  = parseRupiah(data.pendapatan_bulanan);
  const total    = tetap + variabel;
  const burn     = total - revenue;
  const runway   = burn > 0 && modal > 0 ? Math.min(Math.round(modal / burn), 99) : burn <= 0 && modal > 0 ? 99 : 0;
  const margin   = revenue > 0 ? ((revenue - total) / revenue * 100).toFixed(1) : null;
  const hasData  = modal > 0 || total > 0 || revenue > 0;
  const barMax   = Math.max(tetap, variabel, revenue, 1);

  const runwayColorClass = runway <= 3
    ? 'text-health-critical border-red-200 bg-red-50'
    : runway <= 12
      ? 'text-health-struggling border-orange-200 bg-orange-50'
      : 'text-health-growth border-emerald-200 bg-emerald-50';

  const runwayIconName = runway <= 3
    ? 'warning'
    : runway <= 12
      ? 'bolt'
      : 'check_circle';

  const runwayIconColor = runway <= 3
    ? 'text-health-critical'
    : runway <= 12
      ? 'text-health-struggling'
      : 'text-health-growth';

  const burnColorClass = burn > 0
    ? 'text-health-critical'
    : burn < 0
      ? 'text-health-growth'
      : 'text-medium-gray';

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-12 opacity-60">
        <Icon name="monitor_heart" size={32} className="text-subtle-text" />
        <p className="caption-default text-muted-text uppercase tracking-widest text-center leading-relaxed">
          Isi variabel keuangan<br />untuk melihat kalkulasi langsung
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Runway Card */}
      <div className={`p-4 border rounded-md ${runwayColorClass}`}>
        <div className="flex justify-between items-center mb-1">
          <span className="label-medium block uppercase tracking-wider opacity-80">
            Proyeksi Runway Kas
          </span>
          <Icon name={runwayIconName} size={16} className={runwayIconColor} />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-bold font-mono">
            {runway >= 99 ? '99+' : runway}
          </span>
          <span className="text-xs font-semibold uppercase">Bulan</span>
        </div>
        <span className="caption-default font-semibold mt-1 block flex items-center gap-1">
          {runway >= 99 ? '● Arus Kas Positif' : runway <= 3 ? 'Sangat Berisiko (Critical)' : runway <= 12 ? 'Pantau Berkala (Warning)' : 'Posisi Aman (Safe)'}
        </span>
      </div>

      {/* Net Burn Rate */}
      <div className="p-4 bg-secondary-surface border border-border-aura rounded-md">
        <span className="label-medium text-muted-text block uppercase tracking-wider mb-1">
          Net Burn Rate / Bulan
        </span>
        <span className={`text-base font-bold font-mono ${burnColorClass}`}>
          {burn > 0 ? '− ' : burn < 0 ? '+ ' : ''}Rp {Math.abs(burn).toLocaleString('id-ID')}
        </span>
      </div>

      {/* Composition */}
      <div className="p-4 bg-secondary-surface border border-border-aura rounded-md">
        <span className="label-medium text-muted-text block uppercase tracking-wider mb-3">
          Rasio Komposisi Kas
        </span>
        <div className="space-y-3">
          {[
            { label: 'Biaya Tetap', val: tetap, color: 'bg-red-500' },
            { label: 'Biaya Variabel', val: variabel, color: 'bg-orange-400' },
            { label: 'Pendapatan', val: revenue, color: 'bg-primary-action' }
          ].map(({ label, val, color }) => (
            <div key={label}>
              <div className="flex justify-between text-[10px] font-semibold text-medium-gray mb-1">
                <span>{label}</span>
                <span className="font-mono">Rp {val.toLocaleString('id-ID')}</span>
              </div>
              <div className="h-1.5 bg-background rounded-full overflow-hidden border border-border-aura">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${Math.min((val / barMax) * 100, 100).toFixed(0)}%`, transition: 'width 0.4s ease' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {margin !== null && (
        <div className="p-4 bg-secondary-surface border border-border-aura rounded-md">
          <span className="label-medium text-muted-text block uppercase tracking-wider mb-1">
            Margin Kotor Operasional
          </span>
          <span className={`text-base font-bold font-mono ${Number(margin) >= 0 ? 'text-health-growth' : 'text-health-critical'}`}>
            {margin}%
          </span>
        </div>
      )}
    </div>
  );
}

// ─── SimForm Component ────────────────────────────────────────────────────────
interface SimFormProps {
  initialData: FormData;
  onSubmit:    (data: FormData) => void;
  loading:     boolean;
}

export default function SimForm({ initialData, onSubmit, loading }: SimFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [errors,   setErrors]   = useState<FormErrors>({});

  const handleChange = useCallback((id: FieldId, raw: string) => {
    const digits = raw.replace(/\./g, '').replace(/[^0-9]/g, '');
    const formatted = digits ? Number(digits).toLocaleString('id-ID') : '';
    setFormData(prev => ({ ...prev, [id]: formatted }));
    setErrors(prev => ({ ...prev, [id]: undefined }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm(formData);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(formData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Form Fields */}
      <div className="md:col-span-7">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="mb-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-1.5">
              <Icon name="calculate" size={20} className="text-primary-action" />
              Variabel Finansial
            </h2>
            <p className="text-xs text-muted-text leading-relaxed mt-0.5">
              Isi data di bawah sesuai kondisi riil bulanan. Preview instan akan dikalkulasikan secara langsung.
            </p>
          </div>

          {FIELD_CONFIG.map(({ id, label, hint, placeholder }) => (
            <div key={id} className="flex flex-col gap-1">
              <label htmlFor={id} className="label-medium text-foreground">
                {label} <span className="text-health-critical ml-0.5">*</span>
              </label>
              
              <div className="relative flex items-center">
                <span className="absolute left-4 text-muted-text text-xs font-mono pointer-events-none flex items-center gap-1.5 select-none">
                  <span>Rp</span>
                  <span className="h-3.5 w-[1px] bg-border-aura" />
                </span>
                <input
                  type="text"
                  id={id}
                  name={id}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder={placeholder}
                  value={formData[id]}
                  onChange={e => handleChange(id, e.target.value)}
                  className={`aura-input w-full ${errors[id] ? 'border-health-critical' : ''}`}
                  style={{ paddingLeft: '46px' }}
                  aria-label={label}
                  disabled={loading}
                />
              </div>
              
              <span className="caption-default text-subtle-text">{hint}</span>
              
              {errors[id] && (
                <span className="text-xs text-health-critical font-medium flex items-center gap-1 mt-0.5" role="alert">
                  <Icon name="warning" size={14} className="flex-shrink-0" />
                  {errors[id]}
                </span>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="aura-btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? 'Menghitung Analisis...' : 'Analisis Kesehatan Bisnis'}
          </button>
        </form>
      </div>

      {/* Real-time Preview Panel */}
      <div className="md:col-span-5 border-l border-border-aura pl-0 md:pl-8">
        <h2 className="text-lg font-bold text-foreground mb-4">Preview Analisis</h2>
        <LivePreview data={formData} />
      </div>
    </div>
  );
}
