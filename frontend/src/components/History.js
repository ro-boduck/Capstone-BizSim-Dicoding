/**
 * BizSim — History panel component
 * Shows past simulations fetched from Express API
 */

export function renderHistory(simulations) {
  if (!simulations || simulations.length === 0) {
    return `
      <div class="text-center py-16 text-slate-500 animate-fade-in">
        <div class="mb-4 opacity-25 flex justify-center">
          <svg class="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
        </div>
        <p class="font-display font-bold text-sm text-slate-400">Belum Ada Riwayat Simulasi</p>
        <p class="text-xs text-slate-500 mt-1.5 max-w-[220px] mx-auto leading-relaxed">Jalankan simulasi kas pertama Anda pada tab Aplikasi Simulasi!</p>
      </div>
    `;
  }

  return `
    <div class="space-y-4 max-h-[460px] overflow-y-auto pr-1">
      ${simulations.map((sim, i) => {
        const date    = new Date(sim.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' });
        const months  = sim.predicted_months;
        // Premium HSL-based glow colors for runway values
        const isSafe = months > 12;
        const isWarning = months > 3 && months <= 12;
        const isCritical = months <= 3;
        
        let colorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/25';
        let statusText = 'Critical';
        if (isSafe) {
          colorClass = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25';
          statusText = 'Elite/Safe';
        } else if (isWarning) {
          colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/25';
          statusText = 'Warning';
        }

        return `
          <div class="bezel-shell hover:scale-[1.015] cursor-pointer animate-fade-up" style="animation-delay:${i * 50}ms">
            <div class="bezel-core p-4 flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl flex flex-col items-center justify-center font-display font-extrabold text-sm flex-shrink-0 border ${colorClass}">
                <span>${months}</span>
                <span class="text-[8px] uppercase tracking-wider font-semibold opacity-75">Bln</span>
              </div>
              
              <div class="flex-1 min-w-0">
                <p class="text-sm font-display font-bold text-white truncate">
                  Modal: Rp ${Number(sim.modal_awal).toLocaleString('id-ID')}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-[10px] px-2 py-0.5 rounded-full border ${colorClass} font-mono font-medium">${statusText}</span>
                  <span class="text-[10px] text-slate-500 font-mono">${date}</span>
                </div>
              </div>
              
              <div class="text-right flex-shrink-0 flex items-center">
                <svg class="w-4 h-4 text-slate-600 hover:text-slate-400 transition-spring" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export function renderHistoryLoading() {
  return Array.from({ length: 3 }, (_, i) => `
    <div class="bezel-shell" style="animation-delay:${i*50}ms">
      <div class="bezel-core p-4 flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl skeleton flex-shrink-0"></div>
        <div class="flex-1 space-y-2.5">
          <div class="h-3 w-2/3 rounded-full skeleton"></div>
          <div class="h-2 w-1/3 rounded-full skeleton"></div>
        </div>
        <div class="w-4 h-4 rounded skeleton flex-shrink-0"></div>
      </div>
    </div>
  `).join('');
}
