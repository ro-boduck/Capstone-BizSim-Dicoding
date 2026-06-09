'use client';

import React, { useEffect, useState } from 'react';
import { getSimulations, deleteSimulation, type Simulation } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import Icon from '@/components/Icon';

export default function History({ onBack }: { onBack: () => void }) {
  const { isDemo, demoSimulations, removeDemoSimulation } = useAuth();
  const [sims, setSims] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; date: string } | null>(null);

  useEffect(() => {
    if (isDemo) {
      setSims(demoSimulations);
      setLoading(false);
    } else {
      fetchSimulations();
    }
  }, [isDemo, demoSimulations]);

  async function fetchSimulations() {
    setLoading(true);
    setError('');
    try {
      const { data } = await getSimulations();
      setSims(data);
    } catch (err) {
      setError('Tidak dapat memuat riwayat dari server.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    if (isDemo) {
      removeDemoSimulation(id);
      setSims(prev => prev.filter(s => s.id !== id));
      setDeleting(null);
      setDeleteConfirm(null);
    } else {
      try {
        await deleteSimulation(id);
        setSims(prev => prev.filter(s => s.id !== id));
        setDeleteConfirm(null);
      } catch (err) {
        alert('Gagal menghapus data dari server.');
      } finally {
        setDeleting(null);
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-5 bg-secondary-surface border border-border-aura rounded-xl animate-pulse">
            <div className="flex justify-between items-center mb-3">
              <div className="h-4 w-1/4 bg-border-aura rounded" />
              <div className="h-4 w-1/6 bg-border-aura rounded" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="h-8 bg-border-aura rounded" />
              <div className="h-8 bg-border-aura rounded" />
              <div className="h-8 bg-border-aura rounded" />
              <div className="h-8 bg-border-aura rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 border border-dashed border-red-200 bg-red-50/50 rounded-xl p-6">
        <p className="body-small text-health-critical font-medium">{error}</p>
        <button
          onClick={fetchSimulations}
          className="mt-4 aura-btn-secondary py-1.5 px-4 text-xs font-semibold"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (sims.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border-aura rounded-xl bg-secondary-surface/30 p-8">
        <Icon name="inbox" size={40} className="mx-auto text-subtle-text mb-3" />
        <p className="body-default font-semibold text-foreground mb-1">Belum ada riwayat analisis</p>
        <p className="body-small text-muted-text mb-6">Mulai masukkan variabel keuangan pertama Anda.</p>
        <button
          onClick={onBack}
          className="aura-btn-primary py-2 px-6 text-xs gap-1.5"
        >
          <span>Mulai Analisis Baru</span>
          <Icon name="arrow_forward" size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border border-border-aura rounded-xl bg-background shadow-sm">
      {/* Desktop View Table */}
      <table className="aura-table hidden sm:table">
        <thead>
          <tr className="bg-secondary-surface/50">
            <th className="font-semibold"><span className="flex items-center gap-1.5"><Icon name="calendar_month" size={14} className="text-muted-text" /> Tanggal</span></th>
            <th className="font-semibold">Modal Awal</th>
            <th className="font-semibold">Fixed Cost</th>
            <th className="font-semibold">Variable Cost</th>
            <th className="font-semibold">Pendapatan</th>
            <th className="font-semibold"><span className="flex items-center gap-1.5"><Icon name="monitor_heart" size={14} className="text-muted-text" /> Runway</span></th>
            <th className="font-semibold">Status</th>
            <th className="font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {sims.map(sim => {
            const date = new Date(sim.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });
            const runway = sim.predicted_months ?? 0;
            
            let healthColorClass = '';
            let dotColorClass = '';
            if (runway <= 3) {
              healthColorClass = 'text-health-critical bg-red-50 border-red-100';
              dotColorClass = 'bg-health-critical';
            } else if (runway <= 12) {
              healthColorClass = 'text-health-struggling bg-orange-50 border-orange-100';
              dotColorClass = 'bg-health-struggling';
            } else if (runway <= 24) {
              healthColorClass = 'text-health-growth bg-green-50 border-green-100';
              dotColorClass = 'bg-health-growth';
            } else {
              healthColorClass = 'text-primary-action bg-blue-50 border-blue-100';
              dotColorClass = 'bg-primary-action';
            }

            const businessClass = sim.business_class || (runway <= 3 ? 'Critical' : runway <= 12 ? 'Struggling' : runway <= 24 ? 'Growth' : 'Elite');

            return (
              <tr key={sim.id} className="hover:bg-secondary-surface/40 transition-colors">
                <td className="font-mono text-xs text-muted-text">{date}</td>
                <td className="font-mono font-medium text-foreground">Rp {Number(sim.modal_awal).toLocaleString('id-ID')}</td>
                <td className="font-mono text-muted-text">Rp {Number(sim.biaya_tetap_bulanan).toLocaleString('id-ID')}</td>
                <td className="font-mono text-muted-text">Rp {Number(sim.biaya_variabel_bulanan).toLocaleString('id-ID')}</td>
                <td className="font-mono text-muted-text">Rp {Number(sim.pendapatan_bulanan).toLocaleString('id-ID')}</td>
                <td className="font-mono font-bold text-foreground">{runway} bln</td>
                <td>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${healthColorClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColorClass}`} />
                    {businessClass}
                  </span>
                </td>
                <td className="text-right pr-4">
                  <button
                    onClick={() => setDeleteConfirm({ id: sim.id, date })}
                    disabled={deleting === sim.id}
                    className="aura-btn-danger p-1.5 rounded-md"
                    aria-label={`Hapus data ${sim.id}`}
                  >
                    {deleting === sim.id ? (
                      <Icon name="hourglass_empty" size={14} className="animate-spin" />
                    ) : (
                      <Icon name="delete_outline" size={14} />
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile View Cards */}
      <div className="space-y-4 sm:hidden p-4 bg-secondary-surface/10">
        {sims.map(sim => {
          const date = new Date(sim.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          const runway = sim.predicted_months ?? 0;
          
          let healthColorClass = '';
          let dotColorClass = '';
          if (runway <= 3) {
            healthColorClass = 'text-health-critical bg-red-50 border-red-100';
            dotColorClass = 'bg-health-critical';
          } else if (runway <= 12) {
            healthColorClass = 'text-health-struggling bg-orange-50 border-orange-100';
            dotColorClass = 'bg-health-struggling';
          } else if (runway <= 24) {
            healthColorClass = 'text-health-growth bg-green-50 border-green-100';
            dotColorClass = 'bg-health-growth';
          } else {
            healthColorClass = 'text-primary-action bg-blue-50 border-blue-100';
            dotColorClass = 'bg-primary-action';
          }

          const businessClass = sim.business_class || (runway <= 3 ? 'Critical' : runway <= 12 ? 'Struggling' : runway <= 24 ? 'Growth' : 'Elite');

          return (
            <div key={sim.id} className="p-4 bg-background border border-border-aura rounded-xl space-y-3 shadow-sm animate-fade-in">
              <div className="flex justify-between items-center border-b border-border-aura pb-2">
                <span className="caption-default text-muted-text flex items-center gap-1">
                  <Icon name="calendar_month" size={12} />
                  {date}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${healthColorClass}`}>
                  <span className={`w-1 h-1 rounded-full ${dotColorClass}`} />
                  {businessClass}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="caption-default text-subtle-text block">Modal</span>
                  <span className="font-mono font-medium">Rp {Number(sim.modal_awal).toLocaleString('id-ID')}</span>
                </div>
                <div>
                  <span className="caption-default text-subtle-text block">Runway</span>
                  <span className="font-mono font-bold text-foreground">{runway} Bulan</span>
                </div>
                <div>
                  <span className="caption-default text-subtle-text block">Biaya Tetap</span>
                  <span className="font-mono text-muted-text">Rp {Number(sim.biaya_tetap_bulanan).toLocaleString('id-ID')}</span>
                </div>
                <div>
                  <span className="caption-default text-subtle-text block">Pendapatan</span>
                  <span className="font-mono text-muted-text">Rp {Number(sim.pendapatan_bulanan).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border-aura flex justify-end">
                <button
                  onClick={() => setDeleteConfirm({ id: sim.id, date })}
                  disabled={deleting === sim.id}
                  className="aura-btn-danger py-1 px-2.5 flex items-center gap-1"
                >
                  {deleting === sim.id ? (
                    <>
                      <Icon name="hourglass_empty" size={12} className="animate-spin" />
                      <span className="text-[10px]">Hapus...</span>
                    </>
                  ) : (
                    <>
                      <Icon name="delete_outline" size={12} />
                      <span className="text-[10px]">Hapus</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="aura-card w-full max-w-sm p-6 border border-border-aura bg-background shadow-2xl animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-health-critical">
                <Icon name="warning" size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Hapus Riwayat Analisis</h3>
                <p className="text-[10px] text-muted-text font-mono uppercase tracking-wider">Tindakan Permanen</p>
              </div>
            </div>
            <p className="text-xs text-medium-gray leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus data simulasi analisis tanggal <strong className="text-foreground">{deleteConfirm.date}</strong>? Data yang dihapus tidak dapat dipulihkan.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="aura-btn-secondary py-1.5 px-4 text-xs font-semibold"
                disabled={deleting === deleteConfirm.id}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm.id)}
                className="bg-health-critical hover:bg-red-700 text-white rounded-md py-1.5 px-4 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                disabled={deleting === deleteConfirm.id}
              >
                {deleting === deleteConfirm.id ? (
                  <>
                    <Icon name="hourglass_empty" size={14} className="animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Icon name="delete" size={14} />
                    <span>Hapus Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
