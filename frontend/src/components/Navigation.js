export function renderNavigation(currentView) {
  const links = [
    { id: 'landing', label: 'Home' },
    { id: 'about', label: 'Tentang Kami' },
    { id: 'app', label: 'Aplikasi' }
  ];

  // Helper to determine active state
  const isActive = (linkId) => {
    if (currentView === linkId) return true;
    if (linkId === 'app' && ['form', 'result', 'history'].includes(currentView)) return true;
    return false;
  };

  return `
    <div class="fixed top-0 left-0 w-full px-4 pt-5 z-50 flex justify-center pointer-events-none">
      <nav class="w-full max-w-3xl bg-black/45 border border-white/10 rounded-full backdrop-blur-2xl px-6 py-2 flex items-center justify-between pointer-events-auto transition-spring shadow-[0_15px_35px_rgba(0,0,0,0.6)]">
        <!-- Logo -->
        <div class="flex items-center gap-2.5 cursor-pointer group" id="nav-logo">
          <div class="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-display font-extrabold text-xs shadow-md transition-spring group-hover:scale-105">
            B
          </div>
          <span class="font-display font-bold text-sm text-white tracking-tight">
            Biz<span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Sim</span>
          </span>
        </div>
        
        <!-- Links -->
        <div class="hidden md:flex items-center gap-6">
          ${links.map(link => `
            <button 
              id="mainnav-${link.id}"
              class="relative text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-white transition-spring py-1.5 ${isActive(link.id) ? 'text-white nav-link-active' : ''}"
            >
              ${link.label}
            </button>
          `).join('')}
        </div>
        
        <!-- Nested CTA Button -->
        <div>
          <button id="mainnav-cta" class="btn-island-primary py-1 px-1 pl-4 text-xs">
            <span>Mulai Simulasi</span>
            <div class="btn-island-icon-circle w-6 h-6 bg-white/10 text-white flex items-center justify-center rounded-full ml-3">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
          </button>
        </div>
      </nav>
    </div>
  `;
}
