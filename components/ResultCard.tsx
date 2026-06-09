'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { PredictResult, SimulationInput } from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import Icon from '@/components/Icon';

type BusinessClass = 'Critical' | 'Struggling' | 'Growth' | 'Elite';

function getStatus(months: number) {
  if (months <= 3) {
    return {
      label: 'Kritis',
      colorClass: 'text-red-500 bg-red-50 border-red-200',
      iconName: 'error_outline',
      iconColor: 'text-red-500',
      desc: 'Sisa cadangan modal Anda berada pada batas sangat berbahaya. Segera lakukan restrukturisasi kas darurat.'
    };
  }
  if (months <= 12) {
    return {
      label: 'Waspada',
      colorClass: 'text-orange-500 bg-orange-50 border-orange-200',
      iconName: 'error_outline',
      iconColor: 'text-orange-500',
      desc: 'Runway operasional Anda terbatas. Efisiensi pengeluaran taktis dan akselerasi omzet sangat direkomendasikan.'
    };
  }
  return {
    label: 'Stabil',
    colorClass: 'text-emerald-500 bg-emerald-50 border-emerald-200',
    iconName: 'check_circle',
    iconColor: 'text-emerald-500',
    desc: 'Struktur modal Anda sangat sehat. Anda berada di posisi prima untuk ekspansi atau investasi bisnis.'
  };
}

const CLASS_LABELS: Record<BusinessClass, string> = {
  Critical:  'Kritis (Critical)',
  Struggling:'Memprihatinkan (Struggling)',
  Growth:    'Tumbuh (Growth)',
  Elite:     'Prima (Elite)',
};

const CLASS_COLORS: Record<BusinessClass, string> = {
  Critical:  'text-red-500 border-red-200 bg-red-50',
  Struggling:'text-orange-500 border-orange-200 bg-orange-50',
  Growth:    'text-emerald-500 border-emerald-200 bg-emerald-50',
  Elite:     'text-primary-action border-blue-200 bg-blue-50',
};

const CLASS_BAR_COLORS: Record<BusinessClass, string> = {
  Critical:  'bg-red-500',
  Struggling:'bg-orange-500',
  Growth:    'bg-emerald-500',
  Elite:     'bg-primary-action',
};

const ADVICE: Record<BusinessClass, [string, string][]> = {
  Critical: [
    ['Pemangkasan Biaya Agresif', 'Tangguhkan seluruh pengeluaran non-primer. Negosiasi ulang termin pembayaran tagihan dalam 30 hari kedepan.'],
    ['Likuiditas Cepat', 'Jual kelebihan stok barang melalui diskon khusus atau sistem pre-order tunai.'],
    ['Biaya Tetap Menjadi Variabel', 'Ubah beban operasional tetap menjadi biaya variabel berdasarkan volume penjualan untuk mengurangi risiko.'],
    ['Pembiayaan Lunak', 'Cari bantuan modal kerja darurat dari program kemitraan UMKM pemerintah.'],
  ],
  Struggling: [
    ['Audit Biaya Rutin', 'Pangkas 15–20% pengeluaran variabel seperti pemasaran non-konversi dan inefisiensi logistik.'],
    ['Bundling Produk Berorientasi Margin', 'Fokus jual produk bermargin tinggi dengan strategi bundling atau paket hemat.'],
    ['Restrukturisasi Arus Kas', 'Gunakan modal kerja tambahan khusus untuk aktivitas produktif penambah omzet langsung.'],
    ['Insentif Piutang', 'Tawarkan diskon kecil untuk pelanggan yang membayar tagihan lebih awal.'],
  ],
  Growth: [
    ['Ekspansi Pasar Taktis', 'Alokasikan dana surplus untuk periklanan digital atau ekspansi ke e-commerce baru.'],
    ['Dana Cadangan Bisnis', 'Sisihkan minimal 10% keuntungan bulanan langsung ke pos dana darurat bisnis.'],
    ['Pendanaan Kemitraan', 'Ajukan program pendanaan modal kerja atau SE Grant untuk akselerasi skala bisnis.'],
    ['Otomasi Digital', 'Gunakan program kasir POS digital untuk meningkatkan akurasi stok dan efisiensi waktu kerja.'],
  ],
  Elite: [
    ['Skala Reinvestasi Maksimal', 'Gunakan surplus kas untuk ekspansi lini produk baru atau rekrutmen spesialis UMKM.'],
    ['Investasi Cadangan Kas', 'Simpan kelebihan kas di instrumen likuid berpendapatan tetap untuk menumbuhkan dana idle.'],
    ['Kemitraan Strategis Korporat', 'Gunakan reputasi sehat Anda untuk menjalin kontrak suplai volume besar dengan korporasi.'],
    ['Diskon Pembelian Grosir', 'Manfaatkan sisa modal untuk membeli bahan baku dalam jumlah besar untuk memperkecil harga pokok.'],
  ],
};

interface ResultCardProps {
  result:   PredictResult;
  formData: SimulationInput;
  onReset:  () => void;
}

export default function ResultCard({ result, formData, onReset }: ResultCardProps) {
  const { user } = useAuth();
  const months     = result.predicted_runway_months;
  const status     = getStatus(months);
  const burnRate   = formData.biaya_tetap_bulanan + formData.biaya_variabel_bulanan - formData.pendapatan_bulanan;
  const totalCost  = formData.biaya_tetap_bulanan + formData.biaya_variabel_bulanan;
  const margin     = formData.pendapatan_bulanan > 0 ? ((formData.pendapatan_bulanan - totalCost) / formData.pendapatan_bulanan * 100).toFixed(1) : '-100';
  
  const bClass     = (result.business_class || (months <= 3 ? 'Critical' : months <= 12 ? 'Struggling' : months <= 24 ? 'Growth' : 'Elite')) as BusinessClass;
  const probs      = result.class_probabilities || { Critical: 0.01, Struggling: 0.14, Growth: 0.81, Elite: 0.04 };
  const advice     = ADVICE[bClass];

  // SVG chart parameters
  const graphSteps = Math.min(Math.max(4, months), 12);
  const points     = Array.from({ length: graphSteps + 1 }, (_, i) => ({
    month:   i,
    balance: Math.max(0, formData.modal_awal - i * burnRate),
  }));
  const maxVal   = Math.max(formData.modal_awal, ...points.map(p => p.balance));
  
  const pX = 36, pY = 16, gW = 316, gH = 140;
  const svgPts   = points.map((p, idx) => ({
    x: pX + (idx / graphSteps) * gW,
    y: pY + gH - (maxVal > 0 ? p.balance / maxVal : 1) * gH,
    raw: p,
  }));
  const linePath = svgPts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = svgPts.length > 0 ? `${linePath} L ${svgPts[svgPts.length - 1].x} ${pY + gH} L ${svgPts[0].x} ${pY + gH} Z` : '';

  const formatCompactRupiah = (v: number) => {
    if (v >= 1000000000) return 'Rp ' + (v / 1000000000).toFixed(1).replace('.0', '') + 'M';
    if (v >= 1000000) return 'Rp ' + (v / 1000000).toFixed(0) + 'Jt';
    return 'Rp ' + v.toLocaleString('id-ID');
  };

  const ringRef  = useRef<SVGCircleElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barsRef  = useRef<HTMLDivElement[]>([]);
  const [tooltip, setTooltip] = useState<{ month: number; balance: number; x: number; y: number } | null>(null);

  useEffect(() => {
    const circ = 283;
    const pct  = Math.min(months / 24, 1);
    
    if (ringRef.current) {
      ringRef.current.style.strokeDashoffset = String(circ - pct * circ);
    }

    if (countRef.current) {
      let start: number | null = null;
      const step = (ts: number) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / 1000, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        if (countRef.current) {
          countRef.current.textContent = String(Math.round(eased * months));
        }
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    const timer = setTimeout(() => {
      barsRef.current.forEach(bar => {
        if (bar) bar.style.width = bar.getAttribute('data-width') || '0%';
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [months]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Section: Health Dial & Class Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left: Dial Card */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-secondary-surface border border-border-aura rounded-md text-center">
          <span className="label-medium text-muted-text uppercase tracking-wider mb-4 block flex items-center gap-1">
            <Icon name="schedule" size={14} />
            Cash Runway Bisnis
          </span>
          
          <div className="relative w-28 h-28 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-border-aura)" strokeWidth="5" />
              <circle
                ref={ringRef}
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--color-primary-action)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="283"
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span ref={countRef} className="text-3xl font-bold font-mono text-foreground">
                0
              </span>
              <span className="caption-default text-muted-text font-mono uppercase tracking-widest mt-0.5">
                Bulan
              </span>
            </div>
          </div>

          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${status.colorClass} mb-3`}>
            <Icon name={status.iconName} size={14} className={status.iconColor} />
            {status.label}
          </div>
          
          <p className="caption-default text-medium-gray px-4 leading-relaxed">
            {status.desc}
          </p>
        </div>

        {/* Right: AI Health Classification */}
        <div className="md:col-span-7 flex flex-col justify-between p-6 bg-secondary-surface border border-border-aura rounded-md">
          <div>
            <span className="label-medium text-muted-text block uppercase tracking-wider mb-2 flex items-center gap-1">
              <Icon name="auto_awesome" size={14} className="text-primary-action" />
              Klasifikasi Kesehatan UMKM
            </span>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold text-foreground">{CLASS_LABELS[bClass]}</span>
              <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm border ${CLASS_COLORS[bClass]}`}>
                Kategori
              </span>
            </div>
          </div>

          {/* Probability Bars */}
          <div className="space-y-2.5">
            {(Object.entries(probs) as [BusinessClass, number][]).map(([cls, prob], i) => (
              <div key={cls}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className={cls === bClass ? 'text-foreground font-bold' : 'text-muted-text'}>
                    {cls}
                  </span>
                  <span className={cls === bClass ? 'text-foreground font-bold' : 'text-medium-gray'}>
                    {(prob * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden border border-border-aura">
                  <div
                    ref={el => { if (el) barsRef.current[i] = el; }}
                    className={`h-full rounded-full ${CLASS_BAR_COLORS[cls]}`}
                    style={{ width: '0%', transition: 'width 1s ease' }}
                    data-width={`${(prob * 100).toFixed(0)}%`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border-aura flex justify-between items-center">
            <div>
              <span className="caption-default text-muted-text uppercase block">Net Burn Rate Bulanan</span>
              <span className={`text-base font-bold font-mono ${burnRate > 0 ? 'text-health-critical' : 'text-health-growth'}`}>
                {burnRate > 0 ? '− ' : '+ '}Rp {Math.abs(burnRate).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="text-right">
              <span className="caption-default text-muted-text uppercase block">Margin Kotor</span>
              <span className={`text-base font-bold font-mono ${Number(margin) >= 0 ? 'text-health-growth' : 'text-health-critical'}`}>
                {margin}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mid Section: SVG Cash Curve Graph */}
      <div className="p-6 bg-secondary-surface border border-border-aura rounded-md">
        <div className="flex justify-between items-center mb-4">
          <span className="label-medium text-muted-text block uppercase tracking-wider flex items-center gap-1">
            <Icon name="show_chart" size={14} className="text-primary-action" />
            Kurva Proyeksi Sisa Modal Kerja
          </span>
          <span className="caption-default text-subtle-text">Dekati titik koordinat untuk info saldo</span>
        </div>

        <div className="relative w-full h-48 sm:h-56">
          {tooltip && (
            <div
              className="absolute z-10 p-2 bg-background border border-border-aura rounded-md text-[10px] leading-relaxed shadow-none pointer-events-none"
              style={{ left: `${tooltip.x}px`, top: `${tooltip.y - 45}px` }}
            >
              <span className="font-bold block">Bulan ke-{tooltip.month}</span>
              <span className="font-mono text-medium-gray">Kas: Rp {tooltip.balance.toLocaleString('id-ID')}</span>
            </div>
          )}
          <svg viewBox="0 0 380 185" className="w-full h-full animate-fade-in">
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary-action)" stopOpacity="0.15" />
                <stop offset="100%" stopColor="var(--color-primary-action)" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            <line x1={pX} y1={pY} x2={pX+gW} y2={pY} stroke="rgba(23,23,23,0.04)" strokeWidth="1" />
            <line x1={pX} y1={pY+gH/2} x2={pX+gW} y2={pY+gH/2} stroke="rgba(23,23,23,0.04)" strokeDasharray="3 3" strokeWidth="1" />
            <line x1={pX} y1={pY+gH} x2={pX+gW} y2={pY+gH} stroke="rgba(23,23,23,0.1)" strokeWidth="1" />

            <text x={pX - 6} y={pY} textAnchor="end" dominantBaseline="middle" className="text-[7px] font-bold fill-muted-text font-sans">{formatCompactRupiah(maxVal)}</text>
            <text x={pX - 6} y={pY + gH/2} textAnchor="end" dominantBaseline="middle" className="text-[7px] font-bold fill-muted-text font-sans">{formatCompactRupiah(maxVal / 2)}</text>
            <text x={pX - 6} y={pY + gH} textAnchor="end" dominantBaseline="middle" className="text-[7px] font-bold fill-muted-text font-sans">Rp 0</text>

            {areaPath && (
              <path
                d={areaPath}
                fill="url(#chartGradient)"
                className="animate-fade-in opacity-0"
                style={{ animationDelay: '400ms' }}
              />
            )}

            <path
              d={linePath}
              fill="none"
              stroke="var(--color-primary-action)"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-draw-path"
            />

            {svgPts.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="3.5"
                fill="var(--color-background)"
                stroke="var(--color-primary-action)"
                strokeWidth="2"
                className="cursor-pointer animate-pop-in opacity-0"
                style={{ animationDelay: `${i * 100 + 400}ms` }}
                onMouseEnter={e => {
                  const rect = (e.target as SVGElement).closest('svg')!.getBoundingClientRect();
                  setTooltip({
                    month: p.raw.month,
                    balance: p.raw.balance,
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                  (e.target as SVGCircleElement).setAttribute('r', '5');
                }}
                onMouseLeave={e => {
                  setTooltip(null);
                  (e.target as SVGCircleElement).setAttribute('r', '3.5');
                }}
              />
            ))}
            
            {svgPts.filter((_, i) => i === 0 || i === Math.floor(svgPts.length / 2) || i === svgPts.length - 1).map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={pY + gH + 15}
                textAnchor="middle"
                fill="var(--color-muted-text)"
                className="text-[8px] font-bold fill-muted-text font-sans"
              >
                Bln {p.raw.month}
              </text>
            ))}
          </svg>
        </div>
      </div>

      {/* Advisory Section */}
      <div className="p-6 bg-secondary-surface border border-border-aura rounded-md">
        <span className="label-medium text-foreground block uppercase tracking-wider mb-4 flex items-center gap-1">
          <Icon name="help_outline" size={14} className="text-primary-action" />
          Rencana Taktis Penyelamatan Arus Kas
        </span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {advice.map(([title, body], i) => (
            <div key={i} className="p-4 bg-background border border-border-aura rounded-md">
              <span className="label-medium text-foreground block font-bold mb-1">
                {title}
              </span>
              <p className="caption-default text-medium-gray leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
        
        {result.confidence_note && (
          <p className="mt-4 text-[10px] text-subtle-text font-mono text-center">
            {result.confidence_note}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={onReset}
          className="aura-btn-secondary flex-1 flex items-center justify-center gap-1.5"
        >
          <Icon name="refresh" size={16} />
          Simulasi Ulang
        </button>

        {user ? (
          <Link
            href="/dashboard"
            className="aura-btn-primary flex-1 flex items-center justify-center gap-1.5"
          >
            <Icon name="dashboard" size={16} />
            Buka Dashboard Anda
          </Link>
        ) : (
          <Link
            href="/register"
            className="aura-btn-primary flex-1 flex items-center justify-center gap-1.5"
          >
            <Icon name="auto_awesome" size={16} />
            Simpan Hasil (Daftar Akun)
          </Link>
        )}
      </div>
    </div>
  );
}
