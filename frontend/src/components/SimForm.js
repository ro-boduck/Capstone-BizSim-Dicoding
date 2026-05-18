/**
 * BizSim — Simulation form component (Bento Grid Edition)
 * Two-panel layout: form inputs left + live financial preview right.
 * The preview updates in real-time as the user types.
 */

export const FIELD_CONFIG = [
  {
    id: 'modal_awal',
    label: 'Modal Awal',
    hint: 'Total modal/dana awal bisnis Anda (Rp)',
    icon: '<svg class="w-4 h-4 inline-block text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
    placeholder: 'Contoh: 50.000.000',
    min: 1000000,
    max: 10000000000,
    prefix: 'Rp',
  },
  {
    id: 'biaya_tetap_bulanan',
    label: 'Biaya Tetap Bulanan',
    hint: 'Sewa, gaji tetap, internet, dll (Rp)',
    icon: '<svg class="w-4 h-4 inline-block text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>',
    placeholder: 'Contoh: 8.000.000',
    min: 0,
    max: 1000000000,
    prefix: 'Rp',
  },
  {
    id: 'biaya_variabel_bulanan',
    label: 'Biaya Variabel Bulanan',
    hint: 'Bahan baku, komisi komersial, dll (Rp)',
    icon: '<svg class="w-4 h-4 inline-block text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>',
    placeholder: 'Contoh: 12.000.000',
    min: 0,
    max: 1000000000,
    prefix: 'Rp',
  },
  {
    id: 'pendapatan_bulanan',
    label: 'Pendapatan Bulanan',
    hint: 'Rata-rata omzet/pendapatan kotor per bulan (Rp)',
    icon: '<svg class="w-4 h-4 inline-block text-indigo-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>',
    placeholder: 'Contoh: 25.000.000',
    min: 0,
    max: 1000000000,
    prefix: 'Rp',
  },
];

export function formatRupiah(value) {
  if (!value) return '';
  return Number(value).toLocaleString('id-ID');
}

export function parseRupiah(str) {
  return Number(str.replace(/\./g, '').replace(',', '.')) || 0;
}

export function validateForm(data) {
  const errors = {};
  FIELD_CONFIG.forEach(({ id, label, min }) => {
    const val = Number(data[id]);
    if (!data[id] && data[id] !== 0) {
      errors[id] = `${label} wajib diisi`;
    } else if (isNaN(val)) {
      errors[id] = `${label} harus berupa angka`;
    } else if (val < min) {
      errors[id] = `${label} minimal Rp ${min.toLocaleString('id-ID')}`;
    }
  });
  if (Number(data.biaya_tetap_bulanan) + Number(data.biaya_variabel_bulanan) === 0) {
    errors.biaya_tetap_bulanan = 'Total biaya bulanan tidak boleh nol';
  }
  return errors;
}

// ─── Live preview tile (inserted into bento right panel) ─────────────────────
function renderLivePreview(formData) {
  const modal   = Number(formData.modal_awal) || 0;
  const tetap   = Number(formData.biaya_tetap_bulanan) || 0;
  const variabel= Number(formData.biaya_variabel_bulanan) || 0;
  const revenue = Number(formData.pendapatan_bulanan) || 0;

  const totalCost = tetap + variabel;
  const burnRate  = totalCost - revenue;
  const runway    = burnRate > 0 && modal > 0 ? Math.round(modal / burnRate) : burnRate <= 0 && modal > 0 ? 99 : 0;
  const margin    = revenue > 0 ? ((revenue - totalCost) / revenue * 100).toFixed(1) : null;

  const burnColor = burnRate > 0  ? '#f43f5e' : burnRate < 0 ? '#14b8a6' : '#64748b';
  const burnLabel = burnRate > 0  ? '− ' : burnRate < 0 ? '+ ' : '';
  const runwayBg  = runway <= 3   ? 'rgba(244,63,94,0.08)' :
                    runway <= 12  ? 'rgba(245,158,11,0.08)' :
                                    'rgba(20,184,166,0.08)';
  const runwayColor = runway <= 3   ? '#f43f5e' :
                      runway <= 12  ? '#f59e0b' :
                                      '#14b8a6';
  const hasData = modal > 0 || totalCost > 0 || revenue > 0;

  // Mini sparkline bars (proportional to cost/revenue)
  const barMax = Math.max(tetap, variabel, revenue, 1);
  const pTetap   = Math.min((tetap / barMax) * 100, 100).toFixed(0);
  const pVariabel= Math.min((variabel / barMax) * 100, 100).toFixed(0);
  const pRevenue = Math.min((revenue / barMax) * 100, 100).toFixed(0);

  if (!hasData) {
    return `
      <div class="flex flex-col items-center justify-center h-full text-center gap-3 py-8 opacity-60">
        <svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" stroke-width="1" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
        </svg>
        <p class="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Isi data untuk<br/>melihat preview langsung</p>
      </div>
    `;
  }

  return `
    <div class="space-y-3 animate-fade-in">
      <!-- Runway estimate -->
      <div class="live-preview-card" id="lp-runway-card" style="background:${runwayBg}; border-color:${runwayColor}30;">
        <div class="bento-label">Estimasi Runway</div>
        <div class="flex items-end gap-2">
          <span class="bento-stat-value" id="lp-runway" style="color:${runwayColor}; font-size:2.25rem;">${runway >= 99 ? '99+' : runway}</span>
          <span class="text-slate-500 text-xs font-mono mb-1">bulan</span>
        </div>
        <div class="mt-1 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
          ${runway >= 99 ? '● Cashflow positif' : runway <= 3 ? '⚠ Perlu tindakan segera' : runway <= 12 ? '⚡ Monitor ketat' : '✓ Posisi sehat'}
        </div>
      </div>

      <!-- Burn rate -->
      <div class="live-preview-card" id="lp-burn-card">
        <div class="bento-label">Net Burn Rate / Bulan</div>
        <div class="bento-stat-value" id="lp-burn" style="color:${burnColor}; font-size:1.1rem;">
          ${burnLabel}Rp ${Number(Math.abs(burnRate)).toLocaleString('id-ID')}
        </div>
      </div>

      <!-- Bar chart breakdown -->
      <div class="live-preview-card">
        <div class="bento-label">Komposisi Kas</div>
        <div class="space-y-2 mt-1">
          <div>
            <div class="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
              <span>Biaya Tetap</span><span>Rp ${tetap.toLocaleString('id-ID')}</span>
            </div>
            <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-rose-500/60 rounded-full transition-all duration-700" style="width:${pTetap}%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
              <span>Biaya Variabel</span><span>Rp ${variabel.toLocaleString('id-ID')}</span>
            </div>
            <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-amber-500/60 rounded-full transition-all duration-700" style="width:${pVariabel}%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-[9px] font-mono text-slate-500 mb-1">
              <span>Pendapatan</span><span>Rp ${revenue.toLocaleString('id-ID')}</span>
            </div>
            <div class="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-teal-500/60 rounded-full transition-all duration-700" style="width:${pRevenue}%"></div>
            </div>
          </div>
        </div>
      </div>

      ${margin !== null ? `
      <!-- Profit margin -->
      <div class="live-preview-card">
        <div class="bento-label">Margin Kotor</div>
        <div class="bento-stat-value" style="font-size:1.1rem; color:${Number(margin) >= 0 ? '#14b8a6' : '#f43f5e'}">
          ${margin}%
        </div>
      </div>` : ''}
    </div>
  `;
}

export function renderSimulationForm(formData, errors, loading) {
  return `
    <div class="bento-grid animate-fade-up" id="form-bento">

      <!-- LEFT PANEL: Form inputs (spans 7 on desktop, full on mobile) -->
      <div class="bento-span-7 bento-span-12 stagger-1 animate-fade-up" style="grid-column: span 7;">
        <form id="sim-form" class="space-y-4" novalidate>
          <div class="mb-5">
            <div class="bento-label">
              <svg class="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Input Skenario Finansial
            </div>
            <p class="text-[10px] text-slate-500 leading-relaxed">Masukkan data keuangan bisnis Anda. Preview langsung tersedia di panel kanan.</p>
          </div>

          ${FIELD_CONFIG.map((field, i) => `
            <div class="animate-fade-up stagger-${i + 1}">
              <label for="${field.id}" class="label-text">
                <span>${field.icon}</span> ${field.label}
                <span class="text-rose-400 ml-0.5" aria-label="required">*</span>
              </label>
              <div class="input-hardware-shell ${errors[field.id] ? 'border-rose-500/50 focus-within:border-rose-500' : ''}">
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-mono pointer-events-none">
                    ${field.prefix}
                  </span>
                  <input
                    type="text"
                    id="${field.id}"
                    name="${field.id}"
                    inputmode="numeric"
                    autocomplete="off"
                    placeholder="${field.placeholder}"
                    value="${formData[field.id] ? formatRupiah(formData[field.id]) : ''}"
                    class="input-hardware-field pl-11"
                    aria-label="${field.label}"
                    aria-describedby="${field.id}-hint ${errors[field.id] ? field.id + '-error' : ''}"
                    ${loading ? 'disabled' : ''}
                  />
                </div>
              </div>
              <p id="${field.id}-hint" class="mt-1 text-[10px] text-slate-500">${field.hint}</p>
              ${errors[field.id]
                ? `<p id="${field.id}-error" class="mt-1 text-xs text-rose-400 font-medium flex items-center gap-1 animate-fade-in" role="alert">
                    <svg class="w-3.5 h-3.5 inline-block" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    ${errors[field.id]}
                   </p>`
                : ''
              }
            </div>
          `).join('')}

          <button
            type="submit"
            id="simulate-btn"
            class="btn-island-primary w-full p-1.5 pl-6 mt-4"
            ${loading ? 'disabled' : ''}
            aria-busy="${loading}"
          >
            ${loading
              ? `<span>Menganalisis Skenario Finansial...</span>
                 <div class="btn-island-icon-circle w-9 h-9 bg-white/10 text-white flex items-center justify-center rounded-full ml-auto">
                   <svg class="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                     <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.15" />
                     <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-linecap="round" />
                   </svg>
                 </div>`
              : `<span>Simulasi Taktis Sekarang</span>
                 <div class="btn-island-icon-circle w-9 h-9 bg-white/10 text-white flex items-center justify-center rounded-full ml-auto">
                   <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                     <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke-linecap="round" stroke-linejoin="round"/>
                   </svg>
                 </div>`
            }
          </button>
        </form>
      </div>

      <!-- RIGHT PANEL: Live preview (spans 5 on desktop, full on mobile) -->
      <div class="bento-span-5 bento-span-12 stagger-2 animate-fade-up" style="grid-column: span 5;">
        <div class="bento-tile bento-tile-glow-indigo h-full" style="min-height: 320px;">
          <div class="bento-label mb-3">
            <svg class="w-3 h-3 text-teal-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            Preview Langsung
            <span class="ml-1 w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse inline-block"></span>
          </div>
          <div id="live-preview-content">
            ${renderLivePreview(formData)}
          </div>
        </div>
      </div>

    </div>
  `;
}

// Called externally to update only the live preview panel without a full re-render
export function updateLivePreview(formData) {
  const container = document.getElementById('live-preview-content');
  if (!container) return;
  container.innerHTML = renderLivePreview(formData);

  // Flash the runway card to signal update
  const runwayCard = document.getElementById('lp-runway-card');
  if (runwayCard) {
    runwayCard.classList.add('flash');
    setTimeout(() => runwayCard?.classList.remove('flash'), 400);
  }
}
