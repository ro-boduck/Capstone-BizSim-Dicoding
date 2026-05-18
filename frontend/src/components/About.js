export function renderAbout() {
  return `
    <div class="animate-fade-in text-slate-300">
      <section class="py-32 sm:py-40 relative z-10">
        <div class="mx-auto max-w-5xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl lg:text-center mb-16">
            <span class="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6 inline-block">
              Tentang BizSim
            </span>
            <p class="mt-2 text-4xl font-display font-extrabold tracking-tight text-white sm:text-6xl">
              Coding Camp <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">2026</span>
            </p>
            <p class="mt-6 text-base leading-relaxed text-slate-400">
              Tim <span class="text-white font-semibold">CC26-PRU422</span> mempersembahkan karya Capstone ini untuk memecahkan problem krusial UMKM di Indonesia: keterbatasan literasi finansial terhadap sisa umur modal (*cash runway*) usaha.
            </p>
          </div>
          
          <div class="mx-auto max-w-3xl">
            <!-- Double-Bezel Nested Architecture -->
            <div class="bezel-shell hover:scale-[1.005]">
              <div class="bezel-core p-8 md:p-12 text-center">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-8 shadow-lg shadow-indigo-500/5">
                  <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 class="text-2xl font-bold tracking-tight text-white mb-6">Misi Utama Kami</h3>
                <p class="text-xs text-slate-400 leading-relaxed max-w-2xl mx-auto text-justify">
                  Kami percaya bahwa akses terhadap alat ukur finansial berbasis kecerdasan buatan (*AI financial diagnostics*) tidak boleh eksklusif milik korporat besar semata. Melalui BizSim, kami mendemokratisasi teknologi *Deep Learning* secara gratis, aman, dan intuitif agar dapat diadopsi dengan mudah oleh para pejuang UMKM dalam memperkuat benteng ketahanan modal usaha mereka.
                </p>
                
                <div class="mt-16 pt-12 border-t border-white/5">
                  <h4 class="text-[10px] font-bold tracking-[0.25em] text-slate-500 uppercase mb-8">Didukung & Dibina Oleh</h4>
                  <div class="flex justify-center items-center gap-12 md:gap-16 opacity-50">
                    <span class="text-sm font-display font-extrabold tracking-widest text-white hover:opacity-100 transition-spring">
                      DBS FOUNDATION
                    </span>
                    <span class="text-sm font-display font-extrabold tracking-widest text-white hover:opacity-100 transition-spring">
                      DICODING ACADEMY
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;
}
