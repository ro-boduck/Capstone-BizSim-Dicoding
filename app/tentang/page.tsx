'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/Icon';
import ScrollReveal from '@/components/ScrollReveal';

interface TechInfo {
  name: string;
  category: string;
  desc: string;
  icon: string;
}

export default function TentangPage() {
  const [selectedTech, setSelectedTech] = useState<string>('Next.js 16');

  const techStack: TechInfo[] = [
    { name: 'Next.js 16', category: 'Frontend Framework', desc: 'Renders the fast, interactive user interface utilizing App Router and React Server Components.', icon: 'space_dashboard' },
    { name: 'Express.js', category: 'Backend Server', desc: 'Handles mathematical modeling, projections, and secure API gateways for transaction logging.', icon: 'dns' },
    { name: 'Supabase', category: 'Postgres & Auth', desc: 'Acts as the cloud database and JWT session provider, locking data behind Row-Level Security (RLS).', icon: 'security' },
    { name: 'Tailwind CSS v4', category: 'UI Styling System', desc: 'Powers the fluid Aura Design system using utility variables, HSL color tokens, and micro-animations.', icon: 'palette' },
    { name: 'Vercel', category: 'Hosting Platform', desc: 'Deploys the client application at the edge, guaranteeing instant response times and global load speeds.', icon: 'cloud_done' },
  ];

  const activeTech = techStack.find(t => t.name === selectedTech) || techStack[0];

  return (
    <div className="text-foreground min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-secondary-surface border border-border-aura text-primary-action mb-4 inline-block">
            Tentang Kami
          </span>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-foreground sm:text-5xl" style={{ letterSpacing: '-1.5px' }}>
            Coding Camp 2026
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-medium-gray max-w-xl mx-auto font-normal">
            Tim <span className="font-bold text-foreground">CC26-PRU422</span> mendesain BizSim untuk memecahkan masalah kritikal UMKM Indonesia: keterbatasan visibilitas kesehatan arus kas.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Mission (Col span 2) */}
          <ScrollReveal className="md:col-span-2 h-full">
            <div className="aura-card aura-card-hover p-8 border border-border-aura flex flex-col justify-between relative overflow-hidden bg-background h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-action/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary-surface border border-border-aura text-primary-action mb-6">
                  <Icon name="target" size={18} />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">Misi Utama BizSim</h2>
                <p className="text-xs text-medium-gray leading-relaxed text-justify max-w-xl">
                  Kami percaya alat ukur finansial interaktif yang andal tidak boleh eksklusif bagi korporasi besar saja. Melalui BizSim, kami mendemokratisasi akses proyeksi arus kas (<span className="italic">cash runway</span>) secara gratis, aman, dan intuitif. Misi kami adalah memberdayakan jutaan pemilik UMKM di Indonesia agar mampu mengantisipasi risiko kebangkrutan sebelum kas mereka mengering.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-border-aura flex items-center justify-between text-[10px] text-muted-text font-mono uppercase tracking-wider">
                <span>Demokratisasi Finansial</span>
                <span>100% Akses Publik</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Team (Col span 1) */}
          <ScrollReveal className="h-full">
            <div className="aura-card aura-card-hover p-6 border border-border-aura flex flex-col justify-between bg-background h-full">
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary-surface border border-border-aura text-primary-action mb-6">
                  <Icon name="group" size={18} />
                </div>
                <h2 className="text-base font-bold text-foreground mb-2">Identitas Tim</h2>
                <p className="text-[11px] text-muted-text font-mono uppercase tracking-wider mb-4">Capstone CC26-PRU422</p>
                <p className="text-xs text-medium-gray leading-relaxed">
                  Dikembangkan oleh talenta unggulan Coding Camp 2026 untuk menghadirkan platform simulasi dan pelacakan arus kas terbaik bagi pelaku usaha mikro.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-aura">
                <span className="text-[10px] font-bold text-primary-action flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-action inline-block animate-pulse" />
                  DBS Coding Camp
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Interactive Tech Stack (Col span 1, Row span 2) */}
          <ScrollReveal className="md:row-span-2 h-full">
            <div className="aura-card aura-card-hover p-6 border border-border-aura flex flex-col justify-between bg-background h-full">
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary-surface border border-border-aura text-primary-action mb-6">
                  <Icon name="terminal" size={18} />
                </div>
                <h2 className="text-base font-bold text-foreground mb-1">Tech Stack</h2>
                <p className="text-xs text-muted-text mb-6">Klik teknologi untuk detail peran</p>
                
                <div className="space-y-2">
                  {techStack.map(tech => {
                    const isSelected = selectedTech === tech.name;
                    return (
                      <button
                        key={tech.name}
                        onClick={() => setSelectedTech(tech.name)}
                        className={`w-full p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'border-primary-action bg-primary-action/5 text-primary-action'
                            : 'border-border-aura bg-secondary-surface text-foreground hover:bg-surface-muted'
                        }`}
                      >
                        <Icon name={tech.icon} size={16} className={isSelected ? 'text-primary-action' : 'text-muted-text'} />
                        <div>
                          <div className="text-xs font-bold">{tech.name}</div>
                          <div className="text-[9px] text-muted-text">{tech.category}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Display active tech info */}
              <div className="mt-6 p-4 rounded-lg bg-secondary-surface border border-border-aura animate-fade-in">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1.5">
                  <Icon name={activeTech.icon} size={14} className="text-primary-action" />
                  {activeTech.name}
                </h4>
                <p className="text-[11px] text-medium-gray leading-relaxed">
                  {activeTech.desc}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 4: Product Core Values (Col span 2) */}
          <ScrollReveal className="md:col-span-2 h-full">
            <div className="aura-card aura-card-hover p-8 border border-border-aura flex flex-col justify-between bg-background relative overflow-hidden h-full">
              <div className="absolute top-0 left-0 w-32 h-32 bg-health-growth/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary-surface border border-border-aura text-health-growth mb-6">
                  <Icon name="verified" size={18} />
                </div>
                <h2 className="text-lg font-bold tracking-tight text-foreground mb-4">Kenapa Memilih BizSim?</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1.5">
                      <Icon name="lock" size={14} className="text-primary-action" />
                      Row-Level Security (RLS)
                    </h4>
                    <p className="text-[11px] text-muted-text leading-relaxed">
                      Setiap data logs finansial dijamin terproteksi penuh menggunakan RLS database Supabase, memastikan data Anda tidak tercampur dengan pengguna lain.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-1.5">
                      <Icon name="speed" size={14} className="text-health-growth" />
                      Analisis Instan & Responsif
                    </h4>
                    <p className="text-[11px] text-muted-text leading-relaxed">
                      Dapatkan baseline runway dan visualisasi grafik tren arus kas bulanan secara responsif, mempermudah kalkulasi finansial harian Anda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border-aura flex justify-center sm:justify-start">
                <Link href="/simulasi" className="aura-btn-primary py-2 px-6 text-xs gap-1.5">
                  <span>Coba Simulator Sekarang</span>
                  <Icon name="arrow_forward" size={14} />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 5: Partners (Col span 2) */}
          <ScrollReveal className="md:col-span-2 h-full">
            <div className="aura-card aura-card-hover p-6 border border-border-aura flex flex-col justify-between bg-background h-full">
              <div>
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-secondary-surface border border-border-aura text-primary-action mb-6">
                  <Icon name="award" size={18} />
                </div>
                <h2 className="text-base font-bold text-foreground mb-1">Didukung &amp; Dibina Oleh</h2>
                <p className="text-xs text-muted-text mb-4">Mitra Institusi Utama Program</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-secondary-surface border border-border-aura rounded-lg text-center flex flex-col justify-center items-center">
                  <span className="text-xs font-black tracking-widest text-foreground font-mono">DBS FOUNDATION</span>
                  <span className="text-[9px] text-muted-text uppercase tracking-wider mt-1">Pembina Utama</span>
                </div>
                <div className="p-4 bg-secondary-surface border border-border-aura rounded-lg text-center flex flex-col justify-center items-center">
                  <span className="text-xs font-black tracking-widest text-foreground font-mono">DICODING ACADEMY</span>
                  <span className="text-[9px] text-muted-text uppercase tracking-wider mt-1">Platform Belajar</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>

      </div>
    </div>
  );
}
