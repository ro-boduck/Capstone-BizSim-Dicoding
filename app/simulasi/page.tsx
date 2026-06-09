'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from '@/components/AuthProvider';
import SimForm, { type FormData, parseRupiah } from '@/components/SimForm';
import ResultCard from '@/components/ResultCard';
import History from '@/components/History';
import { predict, saveSimulation, type PredictResult, type SimulationInput } from '@/lib/api';
import Link from 'next/link';
import Icon from '@/components/Icon';

const AiAnimation = dynamic(() => import('@/components/AiAnimation'), { ssr: false });

type View = 'form' | 'ai-loading' | 'result' | 'history';

const EMPTY_FORM: FormData = {
  modal_awal:             '',
  biaya_tetap_bulanan:    '',
  biaya_variabel_bulanan: '',
  pendapatan_bulanan:     '',
};

export default function SimulasiPage() {
  const { user, isDemo, addDemoSimulation } = useAuth();
  const [view, setView] = useState<View>('form');
  const [formInput, setFormInput] = useState<SimulationInput | null>(null);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [pendingResult, setPendingResult] = useState<PredictResult | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'info' | 'warn' | 'error' } | null>(null);

  function showToast(msg: string, type: 'info' | 'warn' | 'error' = 'info') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  const handleFormSubmit = useCallback(async (data: FormData) => {
    const parsed: SimulationInput = {
      modal_awal:             parseRupiah(data.modal_awal),
      biaya_tetap_bulanan:    parseRupiah(data.biaya_tetap_bulanan),
      biaya_variabel_bulanan: parseRupiah(data.biaya_variabel_bulanan),
      pendapatan_bulanan:     parseRupiah(data.pendapatan_bulanan),
    };

    setFormInput(parsed);
    setView('ai-loading');

    try {
      const prediction = await predict(parsed);
      setPendingResult(prediction);

      if (user) {
        const payload = {
          ...parsed,
          predicted_months: prediction.predicted_runway_months,
          business_class: prediction.business_class,
          burn_rate: prediction.burn_rate_monthly,
        };
        if (isDemo) {
          addDemoSimulation({
            id: `demo-sim-${Date.now()}`,
            user_id: user.id,
            created_at: new Date().toISOString(),
            ...payload
          });
        } else {
          await saveSimulation(payload);
        }
      }
    } catch (err) {
      const burn = parsed.biaya_tetap_bulanan + parsed.biaya_variabel_bulanan - parsed.pendapatan_bulanan;
      const estimated = burn > 0 ? Math.round(parsed.modal_awal / burn) : 60;
      const fallbackResult: PredictResult = {
        predicted_runway_months: Math.min(estimated, 60),
        burn_rate_monthly:       Math.max(0, Math.round(burn)),
        business_class:          estimated <= 3 ? 'Critical' : estimated <= 12 ? 'Struggling' : estimated <= 24 ? 'Growth' : 'Elite',
        class_probabilities:     { Critical: 0.05, Struggling: 0.15, Growth: 0.70, Elite: 0.10 },
        confidence_note:         'Hasil estimasi luring (Heuristic Offline Engine).',
        model_mode:              'heuristic_fallback',
      };
      setPendingResult(fallbackResult);

      if (user) {
        const payload = {
          ...parsed,
          predicted_months: fallbackResult.predicted_runway_months,
          business_class: fallbackResult.business_class,
          burn_rate: fallbackResult.burn_rate_monthly,
        };
        if (isDemo) {
          addDemoSimulation({
            id: `demo-sim-${Date.now()}`,
            user_id: user.id,
            created_at: new Date().toISOString(),
            ...payload
          });
        } else {
          try {
            await saveSimulation(payload);
          } catch (saveErr) {
            console.error('Failed to save fallback simulation', saveErr);
          }
        }
      }
      showToast('API luring. Menampilkan estimasi dari engine internal.', 'warn');
    }
  }, [user, isDemo, addDemoSimulation]);

  const handleAnimationComplete = useCallback(() => {
    if (!pendingResult || !formInput) return;
    setResult(pendingResult);
    setView('result');
  }, [pendingResult, formInput]);

  const handleReset = useCallback(() => {
    setView('form');
    setResult(null);
    setPendingResult(null);
    setFormInput(null);
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <main className="mx-auto max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-surface border border-border-aura text-primary-action text-xs font-semibold mb-3">
            <Icon name="auto_awesome" size={14} />
            <span>BizSim Instan Predictor</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
            Kalkulator Kesehatan Bisnis
          </h1>
          <p className="mt-2 text-medium-gray text-sm max-w-md mx-auto leading-relaxed">
            Lakukan simulasi cepat untuk mengetahui cash runway operasional dan klasifikasi risiko modal usaha Anda.
          </p>
          
          {user && (view === 'form' || view === 'history') && (
            <div className="mt-4 flex justify-center animate-fade-in">
              <button
                onClick={() => setView(view === 'form' ? 'history' : 'form')}
                className="aura-btn-secondary text-xs font-semibold px-4 py-1.5 flex items-center gap-1.5 cursor-pointer"
              >
                {view === 'form' ? (
                  <>
                    <Icon name="show_chart" size={14} className="text-primary-action" />
                    <span>Lihat Riwayat Analisis</span>
                  </>
                ) : (
                  <>
                    <Icon name="auto_awesome" size={14} className="text-primary-action" />
                    <span>Mulai Analisis Baru</span>
                  </>
                )}
              </button>
            </div>
          )}
        </header>

        {/* Banner */}
        {view === 'form' && (
          <div className="mb-6 p-4 rounded-lg bg-secondary-surface border border-border-aura flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
            <div className="text-xs text-medium-gray leading-relaxed max-w-xl">
              {user ? (
                <>
                  <span className="font-bold text-foreground flex items-center gap-1 mb-0.5">
                    <Icon name="auto_awesome" size={14} className="text-primary-action" />
                    Mode Terotentikasi ({user.email})
                  </span>
                  Setiap simulasi yang Anda jalankan akan disimpan secara otomatis ke riwayat akun Anda.
                </>
              ) : (
                <>
                  <span className="font-bold text-foreground flex items-center gap-1 mb-0.5">
                    <Icon name="lock" size={14} className="text-primary-action" />
                    Mode Simulasi Publik (Guest)
                  </span>
                  Data analisis ini tidak akan disimpan secara permanen. Daftarkan akun gratis untuk menggunakan fitur pencatatan multi-bulan di dashboard Anda.
                </>
              )}
            </div>
            {!user && (
              <div className="flex gap-2 flex-shrink-0">
                <Link href="/login" className="text-xs font-semibold text-foreground border border-border-aura px-3 py-1.5 rounded-md hover:bg-secondary-surface transition-colors">
                  Masuk
                </Link>
                <Link href="/register" className="aura-btn-primary py-1.5 px-3.5 text-xs">
                  Daftar
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Content Box */}
        <div className="aura-card p-6 md:p-8 border border-border-aura animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          {view === 'form' && (
            <SimForm
              initialData={EMPTY_FORM}
              onSubmit={handleFormSubmit}
              loading={false}
            />
          )}

          {view === 'ai-loading' && (
            <AiAnimation onComplete={handleAnimationComplete} />
          )}

          {view === 'result' && result && formInput && (
            <ResultCard
              result={result}
              formData={formInput}
              onReset={handleReset}
            />
          )}

          {view === 'history' && (
            <History onBack={() => setView('form')} />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-xs text-subtle-text">
          Coding Camp 2026 · DBS Foundation · Team CC26-PRU422
        </footer>
      </main>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 px-4 py-3 border rounded-md text-xs font-semibold bg-background z-50 transition-all duration-200"
          role="status"
          aria-live="polite"
          style={{
            color: toast.type === 'warn' ? 'var(--color-health-struggling)' : toast.type === 'error' ? 'var(--color-health-critical)' : 'var(--color-foreground)',
            borderColor: toast.type === 'warn' ? 'var(--color-health-struggling)' : toast.type === 'error' ? 'var(--color-health-critical)' : 'var(--color-border-aura)',
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
