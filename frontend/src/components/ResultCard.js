/**
 * BizSim — Result display component (Bento Grid Edition)
 * Asymmetric masonry-style bento grid of result tiles.
 * Tiles: Runway Dial · Cash Chart · AI Classes · Key Metrics · Expert Advisory
 */

function getRunwayStatus(months) {
  if (months <= 3) {
    return {
      label: 'LIKUIDITAS KRITIS',
      color: '#f43f5e',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      glow: 'bento-tile-glow-rose',
      icon: '<svg class="w-4 h-4 inline-block text-rose-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>',
      desc: 'Sisa cadangan modal Anda berada pada batas sangat berbahaya. Segera lakukan restrukturisasi kas darurat.'
    };
  }
  if (months <= 12) {
    return {
      label: 'WASPADA OPERASIONAL',
      color: '#f59e0b',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      glow: 'bento-tile-glow-orange',
      icon: '<svg class="w-4 h-4 inline-block text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
      desc: 'Runway operasional Anda terbatas. Efisiensi pengeluaran taktis dan akselerasi revenue sangat direkomendasikan.'
    };
  }
  return {
    label: 'STABIL & PRIMA',
    color: '#14b8a6',
    bg: 'bg-teal-500/10',
    border: 'border-teal-500/20',
    glow: 'bento-tile-glow-teal',
    icon: '<svg class="w-4 h-4 inline-block text-teal-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
    desc: 'Struktur modal Anda sangat sehat. Anda berada di posisi prima untuk ekspansi dan reinvestasi modal.'
  };
}

function formatRupiah(n) {
  return `Rp ${Number(n).toLocaleString('id-ID')}`;
}

function calcBurnRate(data) {
  return Number(data.biaya_tetap_bulanan) + Number(data.biaya_variabel_bulanan) - Number(data.pendapatan_bulanan);
}

export function renderResult(result, formData) {
  const months      = result.predicted_runway_months;
  const status      = getRunwayStatus(months);
  const burnRate    = calcBurnRate(formData);
  const totalCost   = Number(formData.biaya_tetap_bulanan) + Number(formData.biaya_variabel_bulanan);
  const margin      = formData.pendapatan_bulanan > 0
    ? ((Number(formData.pendapatan_bulanan) - totalCost) / Number(formData.pendapatan_bulanan) * 100).toFixed(1)
    : '-100';

  // Circular dial
  const pct  = Math.min(months / 24, 1);
  const circ = 283;

  // Business class
  const businessClass = result.business_class || (months <= 3 ? 'Critical' : months <= 6 ? 'Struggling' : months <= 18 ? 'Growth' : 'Elite');
  const classColors = {
    Critical:  'text-rose-400 bg-rose-500/10 border-rose-500/20',
    Struggling:'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Growth:    'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    Elite:     'text-teal-400 bg-teal-500/10 border-teal-500/20',
  };
  const classProbabilities = result.class_probabilities || {
    Critical:  months <= 3  ? 0.90 : months <= 6  ? 0.15 : 0.01,
    Struggling:months <= 3  ? 0.08 : months <= 6  ? 0.75 : months <= 12 ? 0.20 : 0.01,
    Growth:    months > 3 && months <= 12 ? 0.70 : months > 12 && months <= 18 ? 0.80 : 0.05,
    Elite:     months > 18  ? 0.92 : months > 12  ? 0.18 : 0.01,
  };

  // SVG chart data
  const graphSteps   = Math.min(Math.max(4, months), 12);
  const points       = [];
  const initialCapital = Number(formData.modal_awal);
  for (let i = 0; i <= graphSteps; i++) {
    const balance = Math.max(0, initialCapital - i * burnRate);
    points.push({ month: i, balance });
  }
  const maxVal     = Math.max(initialCapital, ...points.map(p => p.balance));
  const paddingX   = 28;
  const paddingY   = 16;
  const graphWidth = 320;
  const graphHeight= 80;
  const svgPoints  = points.map((p, idx) => {
    const x     = paddingX + (idx / graphSteps) * graphWidth;
    const ratio = maxVal > 0 ? p.balance / maxVal : 1;
    const y     = paddingY + graphHeight - ratio * graphHeight;
    return { x, y, raw: p };
  });
  const linePath = svgPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = svgPoints.length > 0
    ? `${linePath} L ${svgPoints[svgPoints.length - 1].x} ${paddingY + graphHeight} L ${svgPoints[0].x} ${paddingY + graphHeight} Z`
    : '';

  // Advisory
  let adviceItems = [];
  if (businessClass === 'Critical') {
    adviceItems = [
      ['Pemangkasan Biaya Agresif', 'Tangguhkan seluruh pengeluaran non-primer. Renegosiasi termin pembayaran vendor dalam 30 hari ke depan.'],
      ['Akselerasi Likuiditas', 'Likuidasi kelebihan persediaan melalui diskon taktis atau pre-order tunai untuk menarik kas segar secepatnya.'],
      ['Restrukturisasi Operasional', 'Konversikan biaya tetap (gaji/overhead) menjadi biaya variabel berbasis performansi.'],
      ['Pembiayaan Mikro', 'Ajukan restrukturisasi pinjaman atau cari bridge financing lunak dari institusi UMKM.'],
    ];
  } else if (businessClass === 'Struggling') {
    adviceItems = [
      ['Audit Efisiensi Bulanan', 'Pangkas 15–20% pengeluaran variabel: langganan ganda, pemasaran non-konversi, logistik tidak efisien.'],
      ['Optimasi Pricing & Bundling', 'Tinjau elastisitas harga dan strategi bundling produk bernilai margin tinggi.'],
      ['Modal Kerja Produktif', 'Manfaatkan akses pembiayaan khusus UMKM (KUR) hanya untuk aset penunjang omzet langsung.'],
      ['Kontrol Piutang', 'Percepat tagihan piutang dengan insentif pembayaran lebih awal (early-payment discounts).'],
    ];
  } else if (businessClass === 'Growth') {
    adviceItems = [
      ['Ekspansi Pasar Taktis', 'Alokasikan surplus kas untuk digital Ads atau kanal distribusi e-commerce baru.'],
      ['Dana Cadangan Bisnis', 'Pindahkan minimal 10% dari omzet ke rekening dana darurat instrumen likuid.'],
      ['Grants & Inkubator', 'Ajukan DBS Foundation Social Enterprise Grant untuk akselerasi program dampak sosial.'],
      ['Investasi Teknologi', 'Gunakan otomasi POS/CRM sederhana untuk mereduksi inefisiensi jam kerja staf operasional.'],
    ];
  } else {
    adviceItems = [
      ['Skala Reinvestasi Maksimal', 'Lakukan akuisisi pasar, riset lini produk baru, atau rekrut talenta spesialis untuk dominasi pasar.'],
      ['Diversifikasi Kas Korporasi', 'Investasikan surplus ke instrumen berpendapatan tetap jangka menengah.'],
      ['Grants & Kemitraan Strategis', 'Jadilah Social Enterprise. Ajukan pendanaan nasional dari mitra DBS Foundation.'],
      ['Optimalisasi Rantai Pasok', 'Lakukan bulk purchase material untuk memperkuat daya tawar dan memperlebar margin kotor.'],
    ];
  }

  // Advisory color
  const adviceAccent = businessClass === 'Critical' ? 'text-rose-400' :
                       businessClass === 'Struggling' ? 'text-amber-400' :
                       businessClass === 'Growth'     ? 'text-indigo-400' :
                                                         'text-teal-400';

  return `
    <div class="bento-grid animate-fade-up" id="result-bento">

      <!-- TILE 1: Runway Dial (spans 5) -->
      <div class="bento-tile ${status.glow} stagger-1 animate-fade-up" style="grid-column: span 5;">
        <div class="bento-label">Runway Modal Usaha</div>
        <div class="flex flex-col items-center gap-3 pt-2">
          <!-- Circular Dial -->
          <div class="relative w-28 h-28">
            <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="6"/>
              <circle id="result-ring" cx="50" cy="50" r="45" fill="none"
                stroke="${status.color}" stroke-width="6" stroke-linecap="round"
                stroke-dasharray="${circ}" stroke-dashoffset="${circ}"
                style="transition: stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1); filter: drop-shadow(0 0 6px ${status.color}50)"/>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-display font-extrabold text-white" id="month-count">0</span>
              <span class="text-[8px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">Bulan</span>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest ${status.bg} border ${status.border}" style="color:${status.color}">
            ${status.icon} ${status.label}
          </div>

          <!-- Description -->
          <p class="text-[10px] text-slate-400 text-center leading-relaxed">${status.desc}</p>
        </div>
      </div>

      <!-- TILE 2: AI Class badge + burn rate (spans 7) -->
      <div class="bento-tile stagger-2 animate-fade-up" style="grid-column: span 7; display: flex; flex-direction: column; gap: 12px;">
        <!-- AI Classification -->
        <div>
          <div class="bento-label">
            <svg class="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            AI Classification
          </div>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-xl font-display font-extrabold text-white">${businessClass}</span>
            <span class="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${classColors[businessClass]}">Kategori</span>
          </div>
        </div>

        <!-- Probability bars -->
        <div class="space-y-2">
          ${Object.entries(classProbabilities).map(([cls, prob]) => {
            const width   = (prob * 100).toFixed(0);
            const isTarget= cls === businessClass;
            const barColor= cls === 'Elite' ? 'bg-teal-500' : cls === 'Growth' ? 'bg-indigo-500' : cls === 'Struggling' ? 'bg-amber-500' : 'bg-rose-500';
            return `
              <div>
                <div class="flex justify-between text-[9px] font-mono mb-0.5">
                  <span class="${isTarget ? 'text-white font-bold' : 'text-slate-500'}">${cls}</span>
                  <span class="${isTarget ? 'text-white font-bold' : 'text-slate-400'}">${(prob * 100).toFixed(1)}%</span>
                </div>
                <div class="bar-container h-1.5">
                  <div class="h-full rounded-full ${barColor} transition-all duration-1000" style="width:0%;" data-width="${width}%"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Burn rate stat -->
        <div class="mt-auto pt-3 border-t border-white/5">
          <div class="bento-label">Net Burn Rate / Bulan</div>
          <div class="text-base font-mono font-bold ${burnRate > 0 ? 'text-rose-400' : 'text-teal-400'}">
            ${burnRate > 0 ? '− ' : '+ '}${formatRupiah(Math.abs(burnRate))}
          </div>
        </div>
      </div>

      <!-- TILE 3: Cash Projection Chart (full width) -->
      <div class="bento-tile stagger-3 animate-fade-up" style="grid-column: span 12;">
        <div class="flex justify-between items-center mb-2">
          <div class="bento-label">
            <svg class="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            Kurva Proyeksi Sisa Kas
          </div>
          <span class="text-[9px] text-slate-500 font-mono">Sentuh node untuk detil →</span>
        </div>

        <div id="chart-tooltip" class="chart-tooltip"></div>

        <div class="relative w-full" style="height: 120px;">
          <svg viewBox="0 0 400 120" class="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${status.color}" stop-opacity="0.25" />
                <stop offset="100%" stop-color="${status.color}" stop-opacity="0" />
              </linearGradient>
              <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="${status.color}" />
                <stop offset="100%" stop-color="#818cf8" />
              </linearGradient>
            </defs>
            <!-- Grid lines -->
            <line x1="${paddingX}" y1="${paddingY}" x2="${paddingX + graphWidth}" y2="${paddingY}" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
            <line x1="${paddingX}" y1="${paddingY + graphHeight / 2}" x2="${paddingX + graphWidth}" y2="${paddingY + graphHeight / 2}" stroke="rgba(255,255,255,0.02)" stroke-dasharray="3 3" stroke-width="1"/>
            <line x1="${paddingX}" y1="${paddingY + graphHeight}" x2="${paddingX + graphWidth}" y2="${paddingY + graphHeight}" stroke="rgba(255,255,255,0.05)" stroke-width="1.5"/>

            <!-- Area -->
            ${areaPath ? `<path d="${areaPath}" fill="url(#chart-glow)" />` : ''}

            <!-- Curve -->
            <path d="${linePath}" fill="none" stroke="url(#line-grad)" stroke-width="2.5" stroke-linecap="round"/>

            <!-- Nodes -->
            ${svgPoints.map(p => `
              <circle
                class="chart-point"
                cx="${p.x}" cy="${p.y}" r="3.5"
                fill="#ffffff" stroke="${status.color}" stroke-width="2" fill-opacity="0.9"
                data-month="${p.raw.month}" data-balance="${p.raw.balance}"
              />
            `).join('')}

            <!-- Month labels on X axis -->
            ${svgPoints.filter((_, i) => i === 0 || i === Math.floor(svgPoints.length / 2) || i === svgPoints.length - 1).map(p => `
              <text x="${p.x}" y="${paddingY + graphHeight + 14}" text-anchor="middle"
                fill="rgba(100,116,139,0.7)" font-size="7" font-family="monospace">
                Bln ${p.raw.month}
              </text>
            `).join('')}
          </svg>
        </div>
      </div>

      <!-- TILE 4: Key Metrics (4 small tiles side by side) -->
      <div class="bento-tile stagger-4 animate-fade-up" style="grid-column: span 3;">
        <div class="bento-label">Modal Awal</div>
        <div class="bento-stat-value" style="font-size:0.9rem;">${formatRupiah(formData.modal_awal)}</div>
      </div>
      <div class="bento-tile stagger-4 animate-fade-up" style="grid-column: span 3;">
        <div class="bento-label">Biaya Tetap</div>
        <div class="bento-stat-value" style="font-size:0.9rem; color:#f59e0b;">${formatRupiah(formData.biaya_tetap_bulanan)}</div>
      </div>
      <div class="bento-tile stagger-4 animate-fade-up" style="grid-column: span 3;">
        <div class="bento-label">Biaya Variabel</div>
        <div class="bento-stat-value" style="font-size:0.9rem; color:#fb923c;">${formatRupiah(formData.biaya_variabel_bulanan)}</div>
      </div>
      <div class="bento-tile stagger-5 animate-fade-up" style="grid-column: span 3;">
        <div class="bento-label">Margin Kotor</div>
        <div class="bento-stat-value" style="font-size:0.9rem; color:${Number(margin) >= 0 ? '#14b8a6' : '#f43f5e'};">${margin}%</div>
      </div>

      <!-- TILE 5: Expert Advisory (full width) -->
      <div class="bento-tile stagger-5 animate-fade-up" style="grid-column: span 12;">
        <div class="bento-label ${adviceAccent}">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Rekomendasi Ahli AI Finansial
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          ${adviceItems.map(([title, body], i) => `
            <div class="live-preview-card stagger-${i + 1} animate-fade-up group cursor-default">
              <div class="text-[9px] font-bold ${adviceAccent} uppercase tracking-wider mb-1 group-hover:brightness-125 transition-all duration-300">${title}</div>
              <p class="text-[10px] text-slate-400 leading-relaxed">${body}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- TILE 6: Action Buttons -->
      <div class="stagger-6 animate-fade-up" style="grid-column: span 12;">
        <div class="flex flex-col sm:flex-row gap-3">
          <button id="reset-btn" class="btn-island-secondary flex-1 p-1 px-4 pl-6 text-xs justify-between">
            <span>Simulasi Ulang</span>
            <div class="btn-island-icon-circle w-7 h-7 bg-white/5 text-slate-400 flex items-center justify-center rounded-full ml-auto">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6.5"/></svg>
            </div>
          </button>
          <button id="history-btn" class="btn-island-primary flex-1 p-1 px-4 pl-6 text-xs justify-between">
            <span>Lihat Riwayat</span>
            <div class="btn-island-icon-circle w-7 h-7 bg-white/10 text-white flex items-center justify-center rounded-full ml-auto">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
            </div>
          </button>
        </div>
      </div>

    </div>
  `;
}

// ─── Animate result components after DOM render ───────────────────────────────
export function animateResult(months) {
  const status = getRunwayStatus(months);
  const pct    = Math.min(months / 24, 1);
  const circ   = 283;

  requestAnimationFrame(() => {
    // 1. Circular dial
    const ring = document.getElementById('result-ring');
    if (ring) {
      setTimeout(() => { ring.style.strokeDashoffset = circ - pct * circ; }, 50);
    }

    // 2. Count-up
    const countEl = document.getElementById('month-count');
    if (countEl) {
      let start = null;
      const duration = 1200;
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 4);
        countEl.textContent = Math.round(eased * months);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    // 3. Probability bars
    const bars = document.querySelectorAll('[data-width]');
    bars.forEach(bar => {
      const target = bar.getAttribute('data-width');
      setTimeout(() => { bar.style.width = target; }, 200);
    });

    // 4. Chart tooltip hover
    const points  = document.querySelectorAll('.chart-point');
    const tooltip = document.getElementById('chart-tooltip');
    points.forEach(point => {
      point.addEventListener('mouseenter', (e) => {
        const month   = e.target.getAttribute('data-month');
        const balance = Number(e.target.getAttribute('data-balance'));
        if (tooltip) {
          tooltip.innerHTML = `
            <div class="font-bold text-[10px] text-indigo-400 mb-0.5">Bulan ke-${month}</div>
            <div>Cadangan: <strong>Rp ${balance.toLocaleString('id-ID')}</strong></div>
          `;
          tooltip.style.opacity = '1';
        }
        e.target.setAttribute('r', '6');
        e.target.setAttribute('fill-opacity', '1');
      });
      point.addEventListener('mousemove', (e) => {
        if (tooltip) {
          const rect   = e.target.closest('svg').getBoundingClientRect();
          tooltip.style.left = `${e.clientX - rect.left}px`;
          tooltip.style.top  = `${e.clientY - rect.top}px`;
        }
      });
      point.addEventListener('mouseleave', (e) => {
        if (tooltip) tooltip.style.opacity = '0';
        e.target.setAttribute('r', '3.5');
        e.target.setAttribute('fill-opacity', '0.9');
      });
    });

    // 5. Advisory card hover tilt
    const adviceCards = document.querySelectorAll('.live-preview-card');
    adviceCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  });
}
