import type { Metadata } from 'next';
import Link from 'next/link';
import Icon from '@/components/Icon';
import InteractivePreview from '@/components/InteractivePreview';
import ScrollReveal from '@/components/ScrollReveal';

export const metadata: Metadata = {
  title: 'BizSim — Simulasi & Proyeksi Arus Kas Ketahanan Modal UMKM',
  description: 'Tracker finansial dan analisis kesehatan bisnis UMKM secara instan menggunakan white-blue-black design system.',
};

export default function HomePage() {
  return (
    <div className="text-foreground min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32 border-b border-border-aura hero-animated-bg">
        {/* Animated background orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center relative z-10">
          <h1 className="aura-build-title mx-auto max-w-4xl mb-8 animate-fade-in-up">
            Simulasikan.<br />
            Pantau Arus Kas.<br />
            Amankan Bisnis.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-medium-gray font-normal animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            BizSim membantu pelaku UMKM memprediksi ketahanan modal kerja bulanan. 
            Catat data finansial berkala, pantau tren arus kas di dashboard, dan mitigasi kebangkrutan sebelum kas Anda mengering.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link href="/simulasi" className="aura-btn-primary px-8 py-3.5 gap-2 group">
              Mulai Analisis Instan
              <Icon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/login" className="aura-btn-secondary px-8 py-3.5">
              Masuk ke Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────────────── */}
      <section className="py-8 bg-secondary-surface border-b border-border-aura overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-text mb-5">
            Didukung &amp; Dipercaya Oleh Institusi Terkemuka
          </h2>
          <div className="relative w-full overflow-hidden flex [mask-image:linear-gradient(to_right,transparent,white_15%,white_85%,transparent)]">
            <div className="flex gap-20 animate-marquee whitespace-nowrap">
              {[
                'DBS FOUNDATION', 'DICODING ACADEMY',
                'DBS FOUNDATION', 'DICODING ACADEMY',
                'DBS FOUNDATION', 'DICODING ACADEMY',
                'DBS FOUNDATION', 'DICODING ACADEMY',
                'DBS FOUNDATION', 'DICODING ACADEMY',
                'DBS FOUNDATION', 'DICODING ACADEMY'
              ].map((name, idx) => (
                <span key={`${name}-${idx}`} className="text-xs font-black tracking-widest text-medium-gray hover:text-foreground transition-colors duration-200">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="py-24 border-b border-border-aura">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-red-50 border border-red-200 text-health-critical mb-4 inline-block">
                Fakta Finansial
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl" style={{ letterSpacing: '-1px' }}>
                Mengapa Banyak UMKM Gagal di 2 Tahun Pertama?
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-medium-gray">
                Lebih dari <span className="text-health-critical font-bold">60% UMKM</span> gulung tikar karena kehabisan
                arus kas tanpa terdeteksi sejak awal oleh pemilik usaha.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[
                { icon: 'trending_down', iconColor: 'text-health-critical', title: 'Kurangnya Perencanaan Finansial', desc: 'Banyak pelaku usaha tidak memiliki visibilitas atas burn rate bulanan riil mereka, sehingga gagal mendeteksi ancaman kebangkrutan sebelum terlambat.' },
                { icon: 'visibility', iconColor: 'text-primary-action', title: 'Pengambilan Keputusan Spekulatif', desc: 'Melakukan kredit tambahan atau merekrut staf baru secara spekulatif tanpa menguji dampak finansial terhadap sisa runway operasional.' },
                { icon: 'schedule', iconColor: 'text-orange-500', title: 'Terlambat Menyadari Krisis', desc: 'Seringkali pemilik bisnis baru menyadari kasnya habis saat sisa saldo hanya cukup untuk 1-2 minggu, membuat upaya pivot atau penyelamatan mustahil dilakukan.' },
              ].map(({ icon, iconColor, title, desc }, idx) => (
                <div
                  key={title}
                  className="aura-card aura-card-hover p-8 border border-border-aura"
                >
                  <div className="mb-4">
                    <Icon name={icon} size={24} className={iconColor} />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-xs leading-relaxed text-medium-gray">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="py-24 border-b border-border-aura bg-secondary-surface" id="features">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-background border border-border-aura text-foreground mb-4 inline-block">
                  Fitur Utama BizSim
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl" style={{ letterSpacing: '-1px' }}>
                  Proyeksi Runway dan Kesehatan Kas Instan
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-medium-gray">
                  BizSim mendiagnosis kesehatan modal, memproyeksikan status ketahanan usaha, serta memberikan rekomendasi restrukturisasi kas taktis berdasarkan perhitungan finansial yang teruji.
                </p>
                <dl className="mt-8 space-y-6 text-xs text-medium-gray">
                  {[
                    ['Analisis Kesehatan Finansial Instan.', 'Menganalisis probabilitas kelangsungan operasional Anda secara akurat dalam hitungan milidetik.'],
                    ['Rencana Mitigasi Finansial.', 'Dapatkan rekomendasi strategis kustom yang disesuaikan secara dinamis dengan burn rate usaha Anda.'],
                  ].map(([title, body]) => (
                    <div key={title} className="relative pl-6">
                      <dt className="inline font-bold text-foreground">
                        <span className="absolute left-0 text-primary-action font-bold">
                          <Icon name="check" size={14} />
                        </span>
                        {title}{' '}
                      </dt>
                      <dd className="inline">{body}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <InteractivePreview />
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="py-24 border-b border-border-aura">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center mb-16">
              <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-secondary-surface border border-border-aura text-foreground mb-4 inline-block">
                Testimoni Nyata
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl" style={{ letterSpacing: '-1px' }}>
                Tanggapan Pemilik Usaha
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {[
                { initials: 'BS', name: 'Budi Santoso', role: 'Pemilik Kedai Kopi', quote: '"BizSim benar-benar membuka mata saya. Dulu saya pikir dana cadangan aman, tapi setelah disimulasikan, sisa runway hanya 3 bulan. Kami langsung memotong biaya operasional."' },
                { initials: 'SA', name: 'Siti Aminah', role: 'Distributor Retail Fashion', quote: '"Tampilannya sangat bersih dan mudah dipahami. Desain datanya sangat membantu saya melihat titik kritis keuangan bulanan tanpa pusing."' },
                { initials: 'AW', name: 'Andi Wijaya', role: 'Founder Agrotech Startup', quote: '"Model simulasi runway di dashboard BizSim ini memberikan estimasi baseline runway yang akurat untuk diajukan ke calon investor."' },
              ].map(({ initials, name, role, quote }, idx) => (
                <div
                  key={name}
                  className="aura-card aura-card-hover p-6 border border-border-aura flex flex-col justify-between animate-fade-in-up"
                  style={{ animationDelay: `${idx * 100 + 100}ms` }}
                >
                  <div>
                    <div className="flex gap-0.5 text-foreground text-xs mb-3">★★★★★</div>
                    <p className="text-xs text-medium-gray leading-relaxed italic">{quote}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border-aura">
                    <div className="w-8 h-8 rounded-full bg-secondary-surface border border-border-aura flex items-center justify-center text-foreground font-bold text-xs">{initials}</div>
                    <div>
                      <h3 className="font-semibold text-foreground text-xs">{name}</h3>
                      <p className="text-muted-text text-[9px]">{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="py-24 border-b border-border-aura bg-secondary-surface">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl" style={{ letterSpacing: '-1px' }}>
                Akses Penuh. Selamanya Rp 0.
              </h2>
              <p className="mt-2 text-sm text-medium-gray">BizSim dikembangkan sebagai inisiatif kontribusi sosial untuk memajukan literasi keuangan UMKM Indonesia.</p>
            </div>
            
            <div className="aura-card max-w-3xl mx-auto p-6 sm:p-8 border border-border-aura lg:flex lg:items-center lg:gap-8">
              <div className="lg:flex-auto">
                <h3 className="text-lg font-bold tracking-tight text-foreground">Akses Fitur BizSim</h3>
                <p className="mt-3 text-xs leading-relaxed text-medium-gray">Jalankan simulasi kas tanpa batas harian, simpan riwayat proyeksi ke dalam database aman, dan akses rekomendasi kesehatan bisnis terperinci.</p>
                <ul className="mt-4 grid grid-cols-1 gap-2 text-xs text-medium-gray sm:grid-cols-2">
                  {['Simulasi Finansial Tanpa Batas', 'Proyeksi Runway Kas Tepat', 'Penyimpanan Database Terproteksi', 'Expert Advisory Taktis UMKM'].map(f => (
                    <li key={f} className="flex gap-x-2">
                      <Icon name="check" size={14} className="text-primary-action" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 lg:mt-0 lg:w-72 lg:flex-shrink-0">
                <div className="rounded-md bg-secondary-surface py-6 text-center border border-border-aura">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-text">Lisensi Publik</p>
                  <p className="mt-2 flex items-baseline justify-center gap-x-1.5">
                    <span className="text-3xl font-black tracking-tight text-foreground">Rp 0</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-text">/ selamanya</span>
                  </p>
                  <div className="px-6 mt-4">
                    <Link href="/simulasi" className="aura-btn-primary text-xs py-2.5 w-full">
                      Jalankan Aplikasi
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="py-24 border-b border-border-aura">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground text-center mb-12" style={{ letterSpacing: '-1px' }}>
              Pertanyaan yang Sering Diajukan
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Apakah data keuangan usaha saya aman?',
                  a: 'Sangat aman. Seluruh parameter keuangan yang Anda masukkan hanya diproses secara lokal di browser Anda. BizSim tidak pernah merekam detail sensitif tanpa enkripsi atau memindahkannya ke server publik.'
                },
                {
                  q: 'Bagaimana cara kerja model AI BizSim?',
                  a: 'BizSim menggabungkan model regresi (meramal durasi sisa cadangan kas) dan klasifikasi (menentukan rating kesehatan usaha) yang dilatih menggunakan ribuan database pelaku UMKM riil di Indonesia.'
                },
                {
                  q: 'Apakah model ini cocok untuk sektor jasa?',
                  a: 'Ya. Model keuangan kami didesain berbasis rasio perputaran arus kas secara umum, sehingga sangat kompatibel untuk pelaku usaha jasa, kuliner ritel dagang, hingga tech-startup.'
                }
              ].map(({ q, a }, idx) => (
                <div key={idx} className="aura-card p-6 border border-border-aura">
                  <h3 className="text-xs font-bold text-foreground mb-2">{q}</h3>
                  <p className="text-[11px] text-medium-gray leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <ScrollReveal>
        <section className="py-24 text-center bg-secondary-surface">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl leading-tight" style={{ letterSpacing: '-1px' }}>
              Amankan Masa Depan Finansial Bisnis Anda Sekarang
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-medium-gray">
              Jangan tunggu kas Anda kosong. Ketahui ketahanan finansial UMKM Anda dan rancang rencana mitigasi penyelamatan bisnis sejak dini.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/simulasi" className="aura-btn-primary px-8 py-3.5 gap-2 group">
                Mulai Analisis Finansial
                <Icon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <p className="mt-4 text-[9px] text-muted-text flex items-center justify-center gap-1.5 font-mono uppercase tracking-wider">
              Dipercaya oleh ratusan pelaku UMKM Indonesia
            </p>
          </div>
        </section>
      </ScrollReveal>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-background py-12 border-t border-border-aura">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center">
                  <img src="/logo.svg" alt="BizSim Logo" className="w-6 h-6 dark:brightness-0 dark:invert" />
                </div>
                <span className="font-extrabold text-xs uppercase tracking-widest text-foreground">
                  Biz<span className="text-primary-action font-black">Sim</span>
                </span>
              </div>
              <p className="text-[11px] text-muted-text leading-relaxed max-w-xs">
                Platform analisis ketahanan modal & simulasi arus kas untuk pelaku UMKM Indonesia.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-3">Navigasi</h4>
              <ul className="space-y-2">
                {[
                  ['Home', '/'],
                  ['Tentang', '/tentang'],
                  ['Predictor', '/simulasi'],
                  ['Dashboard', '/dashboard'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-xs text-muted-text hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground mb-3">Sumber Daya</h4>
              <ul className="space-y-2">
                {[
                  ['FAQ', '#'],
                  ['Panduan Penggunaan', '#'],
                  ['Kebijakan Privasi', '#'],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-xs text-muted-text hover:text-foreground transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6 border-t border-border-aura flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-[10px] text-muted-text">
              © 2026 BizSim · Coding Camp 2026 · DBS Foundation · Team CC26-PRU422
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-text hover:text-foreground transition-colors">
                <Icon name="code" size={16} />
              </a>
              <a href="mailto:team@bizsim.id" className="text-muted-text hover:text-foreground transition-colors">
                <Icon name="mail" size={16} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
