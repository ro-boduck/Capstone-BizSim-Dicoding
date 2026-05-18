export function renderLanding() {
  return `
    <div class="animate-fade-in text-slate-300">
      <!-- HERO SECTION -->
      <section class="relative overflow-hidden py-32 sm:py-40">
        <div class="mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 text-indigo-400 text-[10px] uppercase tracking-[0.2em] font-bold mb-8 border border-white/10 shadow-lg backdrop-blur-md">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Platform Ketahanan Modal UMKM #1
          </div>
          <h1 class="mx-auto max-w-4xl font-display text-4xl font-extrabold tracking-tight text-white sm:text-7xl leading-[1.1] mb-6">
            Simulasikan <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">Ketahanan Modal</span> UMKM Anda
          </h1>
          <p class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 font-body">
            Gunakan kekuatan Deep Learning AI untuk memprediksi cash runway bisnis Anda secara instan. Ambil keputusan finansial taktis sebelum kas Anda mengering.
          </p>
          
          <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <!-- Nested CTA Button -->
            <button id="hero-cta" class="btn-island-primary text-sm p-1.5 pl-6">
              <span>Mulai Simulasi Gratis</span>
              <div class="btn-island-icon-circle w-9 h-9 bg-white/10 text-white flex items-center justify-center rounded-full ml-4">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
            </button>
            <a href="#features" class="text-xs font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-white transition-spring">
              Pelajari Lebih Lanjut <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
      </section>

      <!-- SOCIAL PROOF -->
      <section class="py-12 bg-black/40 border-y border-white/5 backdrop-blur-md relative z-10">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 class="text-center text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
            Didukung & Dipercaya Oleh Institusi Terkemuka
          </h2>
          <div class="mx-auto mt-8 flex justify-center gap-12 sm:gap-20 opacity-40 items-center flex-wrap">
            <span class="text-sm font-display font-extrabold tracking-widest text-white hover:opacity-100 transition-spring">
              DBS FOUNDATION
            </span>
            <span class="text-sm font-display font-extrabold tracking-widest text-white hover:opacity-100 transition-spring">
              DICODING ACADEMY
            </span>
            <span class="text-sm font-display font-extrabold tracking-widest text-white hover:opacity-100 transition-spring">
              KAMPUS MERDEKA
            </span>
            <span class="text-sm font-display font-extrabold tracking-widest text-white hover:opacity-100 transition-spring">
              KEMENKOP UKM
            </span>
          </div>
        </div>
      </section>

      <!-- PROBLEM SECTION -->
      <section class="py-32 sm:py-40 relative z-10">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center mb-20">
            <span class="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6 inline-block">
              Fakta Pahit Bisnis
            </span>
            <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Mengapa Banyak UMKM Gagal di 2 Tahun Pertama?</h2>
            <p class="mt-6 text-base leading-relaxed text-slate-400">
              Lebih dari <span class="text-rose-400 font-semibold">60% UMKM</span> gulung tikar karena kehabisan arus kas (runway) tanpa disadari. Mereka salah memprediksi durasi ketahanan modal di tengah gejolak biaya operasional.
            </p>
          </div>
          
          <div class="mx-auto max-w-none">
            <dl class="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <!-- Double-Bezel Card 1 -->
              <div class="bezel-shell hover:scale-[1.01]">
                <div class="bezel-core p-8 h-full flex flex-col justify-between">
                  <div>
                    <div class="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20 text-rose-400 mb-6">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
                    </div>
                    <dt class="text-base font-bold text-white mb-3">Kurangnya Perencanaan Finansial</dt>
                    <dd class="text-xs leading-relaxed text-slate-400">
                      Banyak pelaku usaha tidak memiliki visibilitas atas *burn rate* bulanan riil mereka, sehingga gagal mendeteksi ancaman kebangkrutan sebelum terlambat.
                    </dd>
                  </div>
                </div>
              </div>
              
              <!-- Double-Bezel Card 2 -->
              <div class="bezel-shell hover:scale-[1.01]">
                <div class="bezel-core p-8 h-full flex flex-col justify-between">
                  <div>
                    <div class="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-400 mb-6">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                    </div>
                    <dt class="text-base font-bold text-white mb-3">Pengambilan Keputusan Buta</dt>
                    <dd class="text-xs leading-relaxed text-slate-400">
                      Melakukan kredit tambahan atau merekrut staf baru secara spekulatif tanpa menguji dampak perubahan kas terhadap sisa runway operasional.
                    </dd>
                  </div>
                </div>
              </div>
              
              <!-- Double-Bezel Card 3 -->
              <div class="bezel-shell hover:scale-[1.01]">
                <div class="bezel-core p-8 h-full flex flex-col justify-between">
                  <div>
                    <div class="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400 mb-6">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <dt class="text-base font-bold text-white mb-3">Menyadari Terlalu Lambat</dt>
                    <dd class="text-xs leading-relaxed text-slate-400">
                      Seringkali pemilik bisnis baru menyadari kasnya habis saat sisa saldo cadangan hanya cukup untuk 1-2 minggu saja, membuat upaya pivot mustahil dilakukan.
                    </dd>
                  </div>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <!-- SOLUTION & BENEFITS SECTION -->
      <section class="py-32 sm:py-40 relative z-10" id="features">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-y-16 gap-x-16 lg:grid-cols-2 lg:items-center">
            <div class="lg:pr-8">
              <div class="lg:max-w-lg">
                <span class="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6 inline-block">
                  Solusi BizSim
                </span>
                <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Prediksi Runway Presisi Tinggi</h2>
                <p class="mt-6 text-base leading-relaxed text-slate-400">
                  BizSim bukan sekadar kalkulator matematika sederhana. Kami menggunakan model kecerdasan buatan berbasis *Neural Networks* untuk mendiagnosis kesehatan modal, memproyeksikan probabilitas status usaha, serta memberikan rekomendasi restrukturisasi kas taktis.
                </p>
                
                <dl class="mt-10 max-w-xl space-y-8 text-sm leading-7 text-slate-400">
                  <div class="relative pl-9">
                    <dt class="inline font-bold text-white">
                      <span class="absolute left-1 top-0.5 h-5 w-5 text-indigo-400">✓</span>
                      Prediksi Instan Deep Learning.
                    </dt>
                    <dd class="inline">Menganalisis probabilitas kelangsungan operasional Anda secara akurat dalam hitungan milidetik.</dd>
                  </div>
                  <div class="relative pl-9">
                    <dt class="inline font-bold text-white">
                      <span class="absolute left-1 top-0.5 h-5 w-5 text-indigo-400">✓</span>
                      Rencana Mitigasi Finansial.
                    </dt>
                    <dd class="inline">Dapatkan rekomendasi strategis kustom yang disesuaikan secara dinamis dengan tingkat burn rate usaha Anda.</dd>
                  </div>
                  <div class="relative pl-9">
                    <dt class="inline font-bold text-white">
                      <span class="absolute left-1 top-0.5 h-5 w-5 text-indigo-400">✓</span>
                      Privasi Finansial Terjamin.
                    </dt>
                    <dd class="inline">Data input Anda dienkripsi secara ketat dan hanya digunakan untuk pemrosesan prediksi lokal real-time.</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <!-- Sleek Mockup using Double-Bezel Hardware Wrapper -->
            <div class="bezel-shell w-full max-w-md lg:max-w-none lg:w-[32rem] mx-auto hover:scale-[1.01]">
              <div class="bezel-core p-8 relative overflow-hidden">
                <div class="absolute inset-0 bg-white/[0.01] pointer-events-none"></div>
                <div class="flex justify-between items-center mb-6">
                  <div class="h-3 w-1/3 bg-indigo-500/10 rounded-full border border-indigo-500/20"></div>
                  <span class="text-[9px] text-indigo-400 font-mono uppercase tracking-wider">BizSim AI Simulator</span>
                </div>
                <div class="space-y-4">
                  <div class="h-10 w-full bg-white/[0.02] rounded-xl border border-white/5 px-4 flex items-center justify-between">
                    <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Modal Awal</span>
                    <span class="text-xs text-white font-mono">Rp 150.000.000</span>
                  </div>
                  <div class="h-10 w-full bg-white/[0.02] rounded-xl border border-white/5 px-4 flex items-center justify-between">
                    <span class="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Biaya Tetap</span>
                    <span class="text-xs text-white font-mono">Rp 12.000.000</span>
                  </div>
                  <div class="h-10 w-full bg-indigo-500/15 rounded-xl border border-indigo-500/35 text-center flex items-center justify-center font-display font-extrabold text-[10px] uppercase tracking-widest text-indigo-300">
                    Menganalisis Proyeksi...
                  </div>
                </div>
                
                <div class="mt-8 pt-8 border-t border-white/5 flex flex-col items-center">
                  <div class="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin-slow relative flex items-center justify-center">
                    <div class="absolute inset-2 bg-[#08080a] rounded-full flex flex-col items-center justify-center border border-white/5 shadow-inner">
                      <span class="text-lg font-bold text-white">18</span>
                      <span class="text-[8px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">Bulan</span>
                    </div>
                  </div>
                  <div class="mt-5 text-[9px] text-emerald-400 font-mono uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    Kategori: Sehat (Growth)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TESTIMONIALS -->
      <section class="py-32 sm:py-40 relative z-10">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-xl text-center mb-20">
            <span class="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6 inline-block">
              Testimoni Nyata
            </span>
            <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Tanggapan Pemilik Usaha</h2>
          </div>
          
          <div class="mx-auto max-w-none">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <!-- Double-Bezel Card Testimonial 1 -->
              <div class="bezel-shell hover:scale-[1.01]">
                <div class="bezel-core p-8 h-full flex flex-col justify-between">
                  <div>
                    <div class="flex gap-1 text-amber-400 text-xs mb-4">★★★★★</div>
                    <p class="text-xs text-slate-400 leading-relaxed italic">"BizSim benar-benar membuka mata saya. Dulu saya pikir dana cadangan aman, tapi setelah disimulasikan, sisa runway hanya 3 bulan. Kami langsung memotong biaya operasional yang tidak krusial."</p>
                  </div>
                  <div class="mt-8 flex items-center gap-4 pt-6 border-t border-white/5">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-extrabold text-xs">BS</div>
                    <div>
                      <h3 class="font-bold text-white text-xs">Budi Santoso</h3>
                      <p class="text-slate-500 text-[10px]">Pemilik Kedai Kopi</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Double-Bezel Card Testimonial 2 -->
              <div class="bezel-shell hover:scale-[1.01]">
                <div class="bezel-core p-8 h-full flex flex-col justify-between">
                  <div>
                    <div class="flex gap-1 text-amber-400 text-xs mb-4">★★★★★</div>
                    <p class="text-xs text-slate-400 leading-relaxed italic">"UI-nya sangat modern dan mudah dipahami, tidak membingungkan seperti program akuntansi korporat. Grafik proyeksi sisa kasnya sangat membantu melihat titik kritis."</p>
                  </div>
                  <div class="mt-8 flex items-center gap-4 pt-6 border-t border-white/5">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-rose-500 flex items-center justify-center text-white font-extrabold text-xs">SA</div>
                    <div>
                      <h3 class="font-bold text-white text-xs">Siti Aminah</h3>
                      <p class="text-slate-500 text-[10px]">Distributor Retail Fashion</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Double-Bezel Card Testimonial 3 -->
              <div class="bezel-shell hover:scale-[1.01]">
                <div class="bezel-core p-8 h-full flex flex-col justify-between">
                  <div>
                    <div class="flex gap-1 text-amber-400 text-xs mb-4">★★★★★</div>
                    <p class="text-xs text-slate-400 leading-relaxed italic">"Model prediksi AI BizSim memberikan baseline estimasi runway yang sangat bernilai. Kami memanfaatkannya sebagai bahan data pendukung sebelum mengajukan modal kerja."</p>
                  </div>
                  <div class="mt-8 flex items-center gap-4 pt-6 border-t border-white/5">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-extrabold text-xs">AW</div>
                    <div>
                      <h3 class="font-bold text-white text-xs">Andi Wijaya</h3>
                      <p class="text-slate-500 text-[10px]">Founder Agrotech Startup</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- PRICING -->
      <section class="py-32 sm:py-40 relative z-10">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="mx-auto max-w-2xl text-center mb-16">
            <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">Akses Penuh. Selamanya Rp 0.</h2>
            <p class="mt-4 text-sm text-slate-400">BizSim dikembangkan sebagai inisiatif kontribusi sosial untuk memajukan literasi keuangan UMKM Indonesia.</p>
          </div>
          
          <!-- Double Bezel shell on pricing block -->
          <div class="bezel-shell max-w-3xl mx-auto hover:scale-[1.005]">
            <div class="bezel-core p-8 sm:p-10 lg:flex lg:items-center lg:gap-8">
              <div class="lg:flex-auto">
                <h3 class="text-xl font-bold tracking-tight text-white">Lisensi Akses BizSim Pro</h3>
                <p class="mt-4 text-xs leading-relaxed text-slate-400">Jalankan simulasi skenario kas tanpa batas harian, simpan riwayat proyeksi, dan akses rekomendasi restrukturisasi taktis.</p>
                <div class="mt-6 flex items-center gap-x-4">
                  <h4 class="flex-none text-[9px] font-bold uppercase tracking-wider text-indigo-400">Fitur Eksklusif</h4>
                  <div class="h-px flex-auto bg-white/10"></div>
                </div>
                <ul role="list" class="mt-6 grid grid-cols-1 gap-3 text-xs leading-6 text-slate-400 sm:grid-cols-2">
                  <li class="flex gap-x-3"><span class="text-indigo-400">✓</span> AI Dual-Inference Tanpa Batas</li>
                  <li class="flex gap-x-3"><span class="text-indigo-400">✓</span> Proyeksi Grafik Interaktif SVG</li>
                  <li class="flex gap-x-3"><span class="text-indigo-400">✓</span> Penyimpanan Riwayat Lokal</li>
                  <li class="flex gap-x-3"><span class="text-indigo-400">✓</span> AI Expert Advisory Taktis</li>
                </ul>
              </div>
              <div class="mt-8 lg:mt-0 lg:w-80 lg:flex-shrink-0">
                <div class="rounded-2xl bg-white/[0.01] py-8 text-center border border-white/5 flex flex-col justify-center">
                  <p class="text-[10px] font-mono uppercase tracking-wider text-slate-500">Inisiatif Sosial</p>
                  <p class="mt-4 flex items-baseline justify-center gap-x-1.5">
                    <span class="text-4xl font-extrabold tracking-tight text-white">Rp 0</span>
                    <span class="text-[9px] font-bold uppercase tracking-wider text-indigo-400">/ selamanya</span>
                  </p>
                  <div class="px-6 mt-6">
                    <button id="pricing-cta" class="btn-island-primary text-xs p-1 w-full pl-5">
                      <span>Jalankan Aplikasi</span>
                      <div class="btn-island-icon-circle w-7 h-7 bg-white/10 text-white flex items-center justify-center rounded-full ml-3">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </div>
                    </button>
                  </div>
                  <p class="mt-4 text-[9px] text-slate-600">Didukung penuh oleh DBS Foundation & Coding Camp.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="py-32 sm:py-40 relative z-10">
        <div class="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 class="text-3xl font-extrabold tracking-tight text-white text-center mb-16">
            Pertanyaan yang Sering Diajukan
          </h2>
          <div class="space-y-6">
            <!-- Double Bezel for FAQ item 1 -->
            <div class="bezel-shell hover:scale-[1.005]">
              <div class="bezel-core p-6">
                <h3 class="text-sm font-bold text-white mb-2">Apakah data keuangan usaha saya aman?</h3>
                <p class="text-xs text-slate-400 leading-relaxed">Sangat aman. Seluruh parameter keuangan yang Anda masukkan hanya diproses secara lokal di browser Anda. BizSim tidak pernah merekam detail sensitif tanpa enkripsi atau memindahkannya ke server publik.</p>
              </div>
            </div>
            <!-- Double Bezel for FAQ item 2 -->
            <div class="bezel-shell hover:scale-[1.005]">
              <div class="bezel-core p-6">
                <h3 class="text-sm font-bold text-white mb-2">Bagaimana cara kerja model AI BizSim?</h3>
                <p class="text-xs text-slate-400 leading-relaxed">BizSim menggabungkan model regresi (meramal durasi sisa cadangan kas) dan klasifikasi (menentukan rating kesehatan usaha) yang dilatih menggunakan ribuan database pelaku UMKM riil di Indonesia.</p>
              </div>
            </div>
            <!-- Double Bezel for FAQ item 3 -->
            <div class="bezel-shell hover:scale-[1.005]">
              <div class="bezel-core p-6">
                <h3 class="text-sm font-bold text-white mb-2">Apakah model ini cocok untuk sektor jasa?</h3>
                <p class="text-xs text-slate-400 leading-relaxed">Ya. Model keuangan kami didesain berbasis rasio perputaran arus kas secara umum, sehingga sangat kompatibel untuk pelaku usaha jasa, kuliner ritel dagang, hingga tech-startup.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FINAL CTA SECTION -->
      <section class="relative bg-gradient-to-b from-[#030303] to-[#0a0a0f] py-32 sm:py-40 z-10">
        <div class="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-5xl leading-tight">
            Amankan Masa Depan Finansial Bisnis Anda Sekarang
          </h2>
          <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-400">
            Jangan tunggu hingga kas Anda kosong. Ketahui kekuatan ketahanan finansial UMKM Anda dan rancang rencana penyelamatan bisnis sejak dini.
          </p>
          <div class="mt-10 flex items-center justify-center">
            <!-- Nested CTA -->
            <button id="final-cta" class="btn-island-primary text-sm p-1.5 pl-6">
              <span>Jalankan Simulasi Taktis</span>
              <div class="btn-island-icon-circle w-9 h-9 bg-white/10 text-white flex items-center justify-center rounded-full ml-4">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
            </button>
          </div>
          <p class="mt-6 text-[10px] text-indigo-400 flex items-center justify-center gap-1.5 font-mono uppercase tracking-wider">
            <span>⚡</span> 100% Gratis · Responsif · Berbasis AI Dual-Inference
          </p>
        </div>
      </section>
    </div>
  `;
}
