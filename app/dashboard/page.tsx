'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMonthlyLogs, saveMonthlyLog, deleteMonthlyLog, type MonthlyLog } from '@/lib/api';
import Icon from '@/components/Icon';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];
const YEARS = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'];

// Common expense suggestions
const FIXED_SUGGESTIONS = ['Sewa Tempat', 'Gaji Karyawan', 'Internet', 'Listrik', 'Asuransi'];
const VARIABLE_SUGGESTIONS = ['Bahan Baku', 'Kemasan', 'Ongkos Kirim', 'Komisi', 'Iklan'];

interface CostItem {
  name: string;
  amount: string;
}

export default function DashboardPage() {
  const { user, loading, isDemo, demoMonthlyLogs, addDemoMonthlyLog, removeDemoMonthlyLog } = useAuth();
  const router = useRouter();
  
  // Data state
  const [logs, setLogs] = useState<MonthlyLog[]>([]);
  const [fetching, setFetching] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  // Form state
  const [selectBulan, setSelectBulan] = useState(MONTHS[new Date().getMonth()]);
  const [selectTahun, setSelectTahun] = useState(new Date().getFullYear().toString());
  const [modalAwal, setModalAwal] = useState('');
  const [pendapatan, setPendapatan] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Granular cost items
  const [fixedCosts, setFixedCosts] = useState<CostItem[]>([{ name: '', amount: '' }]);
  const [variableCosts, setVariableCosts] = useState<CostItem[]>([{ name: '', amount: '' }]);

  // Route protection
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load monthly logs
  const loadData = useCallback(() => {
    if (!user) return;
    if (isDemo) {
      setLogs(demoMonthlyLogs);
      setFetching(false);
    } else {
      setFetching(true);
      getMonthlyLogs()
        .then(data => {
          setLogs(data);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, [user, isDemo, demoMonthlyLogs]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Format currency helpers
  const formatRupiah = (v: number) => {
    return 'Rp ' + Number(v).toLocaleString('id-ID');
  };

  const compactRupiah = (v: number) => {
    if (v >= 1000000000) return 'Rp ' + (v / 1000000000).toFixed(1).replace('.0', '') + 'M';
    if (v >= 1000000) return 'Rp ' + (v / 1000000).toFixed(0) + 'Jt';
    return 'Rp ' + v.toLocaleString('id-ID');
  };

  const handleCurrencyInput = (val: string, setter: (v: string) => void) => {
    const digits = val.replace(/\./g, '').replace(/[^0-9]/g, '');
    const formatted = digits ? Number(digits).toLocaleString('id-ID') : '';
    setter(formatted);
  };

  const parseCurrency = (s: string) => {
    return Number(s.replace(/\./g, '')) || 0;
  };

  // Cost item handlers
  const addCostItem = (type: 'fixed' | 'variable') => {
    if (type === 'fixed') {
      setFixedCosts([...fixedCosts, { name: '', amount: '' }]);
    } else {
      setVariableCosts([...variableCosts, { name: '', amount: '' }]);
    }
  };

  const removeCostItem = (type: 'fixed' | 'variable', index: number) => {
    if (type === 'fixed') {
      setFixedCosts(fixedCosts.filter((_, i) => i !== index));
    } else {
      setVariableCosts(variableCosts.filter((_, i) => i !== index));
    }
  };

  const updateCostItem = (type: 'fixed' | 'variable', index: number, field: 'name' | 'amount', value: string) => {
    const update = (items: CostItem[]) => {
      const updated = [...items];
      if (field === 'amount') {
        const digits = value.replace(/\./g, '').replace(/[^0-9]/g, '');
        updated[index] = { ...updated[index], [field]: digits ? Number(digits).toLocaleString('id-ID') : '' };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    };
    if (type === 'fixed') setFixedCosts(update(fixedCosts));
    else setVariableCosts(update(variableCosts));
  };

  const sumCosts = (items: CostItem[]) => items.reduce((sum, item) => sum + parseCurrency(item.amount), 0);

  // Submit new month log
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const finalBulan = `${selectBulan} ${selectTahun}`;

    if (!modalAwal || !pendapatan) {
      setFormError('Harap lengkapi Modal Awal dan Pendapatan.');
      return;
    }

    const modalVal = parseCurrency(modalAwal);
    const tetapVal = sumCosts(fixedCosts);
    const variabelVal = sumCosts(variableCosts);
    const pendapatanVal = parseCurrency(pendapatan);

    if (modalVal <= 0) {
      setFormError('Modal Awal harus lebih besar dari 0.');
      return;
    }

    if (tetapVal + variabelVal === 0) {
      setFormError('Minimal satu item biaya tetap atau variabel harus diisi.');
      return;
    }

    setSubmitLoading(true);

    const payload = {
      bulan: finalBulan,
      modal_awal: modalVal,
      biaya_tetap: tetapVal,
      biaya_variabel: variabelVal,
      pendapatan: pendapatanVal,
    };

    try {
      if (editingLogId) {
        if (isDemo) {
          removeDemoMonthlyLog(editingLogId);
        } else {
          await deleteMonthlyLog(editingLogId);
        }
      }

      if (isDemo) {
        addDemoMonthlyLog({
          id: editingLogId || `demo-log-${Date.now()}`,
          user_id: 'demo-user-id',
          created_at: new Date().toISOString(),
          ...payload,
        });
        setFormSuccess(editingLogId ? `Perubahan data ${finalBulan} berhasil disimpan.` : `Data ${finalBulan} berhasil dicatat secara lokal.`);
        setEditingLogId(null);
        resetForm();
      } else {
        await saveMonthlyLog(payload);
        setFormSuccess(editingLogId ? `Perubahan data ${finalBulan} berhasil disimpan.` : `Data ${finalBulan} berhasil disimpan ke database.`);
        setEditingLogId(null);
        resetForm();
        loadData();
      }
    } catch (err: any) {
      setFormError(err.message || 'Gagal menyimpan log finansial.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetForm = () => {
    setSelectBulan(MONTHS[new Date().getMonth()]);
    setSelectTahun(new Date().getFullYear().toString());
    setModalAwal('');
    setPendapatan('');
    setFixedCosts([{ name: '', amount: '' }]);
    setVariableCosts([{ name: '', amount: '' }]);
  };

  const handleStartEdit = (log: MonthlyLog) => {
    const parts = log.bulan.split(' ');
    if (parts.length === 2) {
      setSelectBulan(parts[0]);
      setSelectTahun(parts[1]);
    }
    setModalAwal(log.modal_awal.toLocaleString('id-ID'));
    setPendapatan(log.pendapatan.toLocaleString('id-ID'));
    setFixedCosts([{ name: 'Total Biaya Tetap (Restored)', amount: log.biaya_tetap.toLocaleString('id-ID') }]);
    setVariableCosts([{ name: 'Total Biaya Variabel (Restored)', amount: log.biaya_variabel.toLocaleString('id-ID') }]);
    setEditingLogId(log.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingLogId(null);
    resetForm();
  };

  // Delete month log
  const handleDelete = async (id: string) => {
    setDeleteLoading(id);
    try {
      if (isDemo) {
        removeDemoMonthlyLog(id);
        setLogs(prev => prev.filter(log => log.id !== id));
      } else {
        await deleteMonthlyLog(id);
        loadData();
      }
      setDeleteConfirm(null);
    } catch (err) {
      alert('Gagal menghapus catatan.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Calculate Health Metrics
  const logCount = logs.length;
  const latestLog = logCount > 0 ? logs[logs.length - 1] : null;
  const currentCapital = latestLog ? latestLog.modal_awal : 0;
  
  const averageBurnRate = logCount > 0
    ? Math.round(
        logs.reduce((acc, log) => acc + (log.biaya_tetap + log.biaya_variabel - log.pendapatan), 0) / logCount
      )
    : 0;

  const runwayMonths = averageBurnRate > 0 && currentCapital > 0
    ? Math.max(0, Math.min(60, Math.round(currentCapital / averageBurnRate)))
    : averageBurnRate <= 0 && currentCapital > 0
      ? 60
      : 0;

  const healthStatus = logCount === 0
    ? 'Belum ada data'
    : runwayMonths <= 3
      ? 'Kritis (Critical)'
      : runwayMonths <= 12
        ? 'Rentan (Struggling)'
        : runwayMonths <= 24
          ? 'Tumbuh (Growth)'
          : 'Prima (Elite)';

  const healthColorClass = logCount === 0
    ? 'text-subtle-text border-border-aura bg-secondary-surface'
    : runwayMonths <= 3
      ? 'text-health-critical border-red-200 bg-red-50'
      : runwayMonths <= 12
        ? 'text-health-struggling border-orange-200 bg-orange-50'
        : runwayMonths <= 24
          ? 'text-health-growth border-green-200 bg-green-50'
          : 'text-primary-action border-blue-200 bg-blue-50';

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="body-default text-muted-text">Memuat data pengguna...</p>
      </div>
    );
  }

  const chartMax = logs.length > 0
    ? Math.max(...logs.map(l => Math.max(l.pendapatan, l.biaya_tetap + l.biaya_variabel, 100000)))
    : 100000;

  // Render a cost items section
  const renderCostSection = (
    type: 'fixed' | 'variable',
    items: CostItem[],
    suggestions: string[],
    label: string,
    iconName: string
  ) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="label-medium text-foreground flex items-center gap-1">
          <Icon name={iconName} size={14} className="text-muted-text" />
          {label}
        </label>
        <span className="text-[10px] font-mono text-primary-action font-semibold">
          Total: Rp {sumCosts(items).toLocaleString('id-ID')}
        </span>
      </div>
      
      {items.map((item, idx) => (
        <div key={idx} className="flex gap-2 items-center animate-fade-in">
          <input
            type="text"
            value={item.name}
            onChange={e => updateCostItem(type, idx, 'name', e.target.value)}
            className="aura-input py-1.5 text-xs flex-1 min-w-0"
            placeholder={suggestions[idx % suggestions.length] || 'Nama item'}
            disabled={submitLoading}
          />
          <div className="relative flex items-center flex-1 min-w-0">
            <span className="absolute left-3 text-muted-text text-[10px] font-mono pointer-events-none">Rp</span>
            <input
              type="text"
              value={item.amount}
              onChange={e => updateCostItem(type, idx, 'amount', e.target.value)}
              className="aura-input py-1.5 text-xs font-mono w-full"
              style={{ paddingLeft: '28px' }}
              placeholder="0"
              disabled={submitLoading}
            />
          </div>
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => removeCostItem(type, idx)}
              className="p-1 text-muted-text hover:text-health-critical transition-colors cursor-pointer flex-shrink-0"
              title="Hapus item"
            >
              <Icon name="close" size={14} />
            </button>
          )}
        </div>
      ))}
      
      <button
        type="button"
        onClick={() => addCostItem(type)}
        className="flex items-center gap-1 text-[10px] font-semibold text-primary-action hover:text-foreground transition-colors cursor-pointer mt-1"
        disabled={submitLoading}
      >
        <Icon name="add" size={14} />
        Tambah Item
      </button>
    </div>
  );

  return (
    <div className="pt-28 pb-16 min-h-screen px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard Keuangan BizSim
            </h1>
            <p className="body-small text-medium-gray mt-1">
              Catat variabel keuangan bulanan Anda secara berkala untuk memantau kesehatan kas jangka panjang.
            </p>
          </div>
          <Link href="/simulasi" className="aura-btn-secondary gap-2 text-xs">
            <Icon name="show_chart" size={16} />
            Buka Simulasi Instan
          </Link>
        </div>

        {/* Health Stat Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="aura-card aura-card-hover p-6 animate-fade-in-up">
            <div className="flex justify-between items-start mb-2">
              <span className="label-medium text-muted-text uppercase tracking-wider">
                Modal Aktif Saat Ini
              </span>
              <Icon name="attach_money" size={16} className="text-muted-text" />
            </div>
            <span className="text-2xl font-bold text-foreground font-mono">
              {fetching ? '...' : formatRupiah(currentCapital)}
            </span>
            <p className="caption-default text-subtle-text mt-1">
              {latestLog ? `Berdasarkan saldo kas awal ${latestLog.bulan}` : 'Belum ada entri log'}
            </p>
          </div>

          <div className="aura-card aura-card-hover p-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex justify-between items-start mb-2">
              <span className="label-medium text-muted-text uppercase tracking-wider">
                Rata-Rata Burn Rate
              </span>
              <Icon name="monitor_heart" size={16} className="text-muted-text" />
            </div>
            <span className={`text-2xl font-bold font-mono ${averageBurnRate > 0 ? 'text-health-critical' : 'text-health-growth'}`}>
              {fetching ? '...' : (averageBurnRate > 0 ? '− ' : '+ ') + formatRupiah(Math.abs(averageBurnRate))}
            </span>
            <p className="caption-default text-subtle-text mt-1">
              Selisih biaya operasional &amp; omzet
            </p>
          </div>

          <div className={`aura-card aura-card-hover p-6 border flex flex-col justify-between ${healthColorClass} animate-fade-in-up`} style={{ animationDelay: '200ms' }}>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="label-medium uppercase tracking-wider opacity-85">
                  Kesehatan Finansial
                </span>
                {logCount > 0 && (
                  <Icon name={runwayMonths <= 12 ? 'error_outline' : 'check_circle'} size={20} />
                )}
              </div>
              <span className="text-xl font-bold block">
                {fetching ? '...' : healthStatus}
              </span>
            </div>
            <p className="caption-default opacity-80 mt-2">
              {logCount > 0 
                ? `Estimasi Runway: ${runwayMonths >= 60 ? '60+ (Arus Kas Surplus)' : `${runwayMonths} Bulan`}`
                : 'Catat log data pertama Anda'}
            </p>
          </div>
        </div>

        {/* Main Content Grid: Chart & Logging Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Chart Section */}
          <div className="lg:col-span-7 aura-card p-6 flex flex-col justify-between min-h-[300px] animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon name="bar_chart" size={16} className="text-primary-action" />
                <h2 className="text-base font-bold text-foreground">Tren Kas Bulanan</h2>
              </div>
              <p className="text-xs text-muted-text">Perbandingan Pendapatan (biru) vs Pengeluaran (hitam) setiap bulan.</p>
            </div>

            {fetching ? (
              <div className="flex justify-center items-center h-48">
                <p className="body-small text-muted-text">Memuat data tren...</p>
              </div>
            ) : logCount === 0 ? (
              <div className="flex flex-col justify-center items-center h-48 border border-dashed border-border-aura rounded-md p-6 text-center text-muted-text">
                <Icon name="bar_chart" size={32} className="text-subtle-text mb-2" />
                <p className="caption-default font-semibold uppercase tracking-wider">Grafik Belum Tersedia</p>
                <p className="text-[11px] text-subtle-text mt-0.5">Log minimal 1 data bulanan untuk memunculkan tren grafik.</p>
              </div>
            ) : (
              <div className="mt-6 w-full relative">
                <svg viewBox="0 0 500 200" className="w-full h-48">
                  <line x1="60" y1="30" x2="485" y2="30" stroke="var(--color-border-aura)" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="60" y1="76" x2="485" y2="76" stroke="var(--color-border-aura)" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="60" y1="123" x2="485" y2="123" stroke="var(--color-border-aura)" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="60" y1="170" x2="485" y2="170" stroke="var(--color-border-aura)" strokeWidth="1" />

                  <text x="50" y="34" textAnchor="end" className="text-[9px] font-semibold fill-muted-text font-mono">{compactRupiah(chartMax)}</text>
                  <text x="50" y="80" textAnchor="end" className="text-[9px] font-semibold fill-muted-text font-mono">{compactRupiah(chartMax * 0.66)}</text>
                  <text x="50" y="127" textAnchor="end" className="text-[9px] font-semibold fill-muted-text font-mono">{compactRupiah(chartMax * 0.33)}</text>
                  <text x="50" y="174" textAnchor="end" className="text-[9px] font-semibold fill-muted-text font-mono">Rp 0</text>

                  {(() => {
                    const sectionWidth = 425 / logs.length;
                    return logs.map((log, idx) => {
                      const expenses = log.biaya_tetap + log.biaya_variabel;
                      const revHeight = (log.pendapatan / chartMax) * 140;
                      const expHeight = (expenses / chartMax) * 140;
                      const baseX = 60 + idx * sectionWidth + sectionWidth / 2;

                      return (
                        <g key={log.id}>
                          <rect
                            x={baseX - 15}
                            y={170 - Math.max(revHeight, 2)}
                            width="12"
                            height={Math.max(revHeight, 2)}
                            fill="var(--color-primary-action)"
                            rx="2"
                            className="animate-grow-y hover:opacity-80 transition-opacity cursor-pointer"
                            style={{ transformOrigin: '0px 170px', animationDelay: `${idx * 120}ms` }}
                          >
                            <title>{`Pendapatan: ${formatRupiah(log.pendapatan)}`}</title>
                          </rect>

                          <rect
                            x={baseX + 3}
                            y={170 - Math.max(expHeight, 2)}
                            width="12"
                            height={Math.max(expHeight, 2)}
                            fill="var(--color-foreground)"
                            rx="2"
                            className="animate-grow-y hover:opacity-80 transition-opacity cursor-pointer"
                            style={{ transformOrigin: '0px 170px', animationDelay: `${idx * 120 + 60}ms` }}
                          >
                            <title>{`Pengeluaran: ${formatRupiah(expenses)}`}</title>
                          </rect>

                          <text
                            x={baseX}
                            y="190"
                            textAnchor="middle"
                            className="text-[9px] font-bold fill-muted-text"
                          >
                            {log.bulan}
                          </text>
                        </g>
                      );
                    });
                  })()}
                </svg>
              </div>
            )}
            
            {logCount > 0 && (
              <div className="flex justify-start gap-4 mt-4 pt-3 border-t border-border-aura text-[10px] font-semibold text-muted-text">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-primary-action rounded-sm inline-block" />
                  <span>Pendapatan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-foreground rounded-sm inline-block" />
                  <span>Total Pengeluaran</span>
                </div>
              </div>
            )}
          </div>

          {/* Logging Form Section */}
          <div className="lg:col-span-5 aura-card p-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="mb-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-1.5">
                <Icon name={editingLogId ? 'edit' : 'add'} size={16} className="text-primary-action" />
                {editingLogId ? 'Edit Data Bulan' : 'Catat Bulan Baru'}
              </h2>
              <p className="text-[11px] text-muted-text mt-0.5 border-none">
                {editingLogId ? 'Perbarui item biaya individual untuk catatan kas bulanan.' : 'Tambahkan item biaya individual untuk catatan kas bulanan.'}
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-2.5 border border-red-200 bg-red-50 text-[11px] text-health-critical rounded-sm flex items-start gap-1">
                <Icon name="error_outline" size={14} className="flex-shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div className="mb-4 p-2.5 border border-green-200 bg-green-50 text-[11px] text-health-growth rounded-sm flex items-start gap-1">
                <Icon name="check_circle" size={14} className="flex-shrink-0 mt-0.5" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="label-medium text-foreground">Bulan / Periode</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectBulan}
                    onChange={(e) => setSelectBulan(e.target.value)}
                    className="aura-input py-1.5 text-xs appearance-none cursor-pointer"
                    disabled={submitLoading}
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={selectTahun}
                    onChange={(e) => setSelectTahun(e.target.value)}
                    className="aura-input py-1.5 text-xs appearance-none cursor-pointer"
                    disabled={submitLoading}
                  >
                    {YEARS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="label-medium text-foreground">Modal Awal Kas (Rp)</label>
                <input
                  type="text"
                  value={modalAwal}
                  onChange={(e) => handleCurrencyInput(e.target.value, setModalAwal)}
                  className="aura-input py-1.5 text-xs font-mono"
                  placeholder="0"
                  required
                  disabled={submitLoading}
                />
              </div>

              {/* Granular Fixed Costs */}
              {renderCostSection('fixed', fixedCosts, FIXED_SUGGESTIONS, 'Biaya Tetap Bulanan', 'lock')}

              {/* Granular Variable Costs */}
              {renderCostSection('variable', variableCosts, VARIABLE_SUGGESTIONS, 'Biaya Variabel Bulanan', 'sync_alt')}

              <div className="flex flex-col gap-1">
                <label className="label-medium text-foreground">Pendapatan Bulanan (Rp)</label>
                <input
                  type="text"
                  value={pendapatan}
                  onChange={(e) => handleCurrencyInput(e.target.value, setPendapatan)}
                  className="aura-input py-1.5 text-xs font-mono"
                  placeholder="0"
                  required
                  disabled={submitLoading}
                />
              </div>

              {/* Summary */}
              <div className="p-3 bg-secondary-surface border border-border-aura rounded-md">
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-muted-text block">Total Biaya Tetap</span>
                    <span className="font-mono font-semibold text-foreground">Rp {sumCosts(fixedCosts).toLocaleString('id-ID')}</span>
                  </div>
                  <div>
                    <span className="text-muted-text block">Total Biaya Variabel</span>
                    <span className="font-mono font-semibold text-foreground">Rp {sumCosts(variableCosts).toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                {editingLogId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="aura-btn-secondary flex-1 py-2 text-xs cursor-pointer"
                    disabled={submitLoading}
                  >
                    Batal Edit
                  </button>
                )}
                <button
                  type="submit"
                  className={`aura-btn-primary py-2 text-xs cursor-pointer ${editingLogId ? 'flex-1' : 'w-full'}`}
                  disabled={submitLoading}
                >
                  {submitLoading ? 'Menyimpan...' : (editingLogId ? 'Simpan Perubahan' : 'Simpan Data Bulan')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Tabular Log List */}
        <div className="aura-card p-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="border-b border-border-aura pb-4 mb-4">
            <h2 className="text-lg font-bold text-foreground">Daftar Log Finansial Berkala</h2>
            <p className="text-xs text-muted-text">Catatan data kas riil yang telah Anda masukkan untuk perhitungan kesehatan bisnis.</p>
          </div>

          {fetching ? (
            <div className="py-12 text-center text-muted-text">Memuat tabel log...</div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center text-muted-text">
              <Icon name="calendar_month" size={32} className="text-subtle-text mb-2 mx-auto block" />
              <p className="caption-default font-semibold uppercase tracking-wider">Belum Ada Catatan Log</p>
              <p className="text-xs text-subtle-text mt-0.5">Silakan tambahkan data kas bulanan menggunakan formulir di atas.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="aura-table">
                <thead>
                  <tr>
                    <th>Bulan</th>
                    <th>Modal Awal</th>
                    <th>Biaya Tetap</th>
                    <th>Biaya Variabel</th>
                    <th>Pendapatan</th>
                    <th>Net Burn Rate</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const totalExpenses = log.biaya_tetap + log.biaya_variabel;
                    const netBurn = totalExpenses - log.pendapatan;
                    
                    return (
                      <tr key={log.id}>
                        <td className="font-semibold text-foreground">{log.bulan}</td>
                        <td className="font-mono">{formatRupiah(log.modal_awal)}</td>
                        <td className="font-mono">{formatRupiah(log.biaya_tetap)}</td>
                        <td className="font-mono">{formatRupiah(log.biaya_variabel)}</td>
                        <td className="font-mono">{formatRupiah(log.pendapatan)}</td>
                        <td className={`font-mono font-bold ${netBurn > 0 ? 'text-health-critical' : 'text-health-growth'}`}>
                          {netBurn > 0 ? '− ' : '+ '} {formatRupiah(Math.abs(netBurn))}
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEdit(log)}
                              className="aura-btn-secondary p-1 flex items-center justify-center cursor-pointer"
                              title="Edit"
                            >
                              <Icon name="edit" size={14} className="text-muted-text" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ id: log.id, name: log.bulan })}
                              disabled={deleteLoading === log.id}
                              className="aura-btn-danger p-1 flex items-center justify-center cursor-pointer"
                              title="Hapus"
                            >
                              {deleteLoading === log.id ? '...' : <Icon name="delete_outline" size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
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
                <h3 className="text-sm font-bold text-foreground">Hapus Catatan Finansial</h3>
                <p className="text-[10px] text-muted-text font-mono uppercase tracking-wider">Tindakan Permanen</p>
              </div>
            </div>
            <p className="text-xs text-medium-gray leading-relaxed mb-6">
              Apakah Anda yakin ingin menghapus catatan log finansial untuk periode <strong className="text-foreground">{deleteConfirm.name}</strong>? Data yang dihapus tidak dapat dipulihkan.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="aura-btn-secondary py-1.5 px-4 text-xs font-semibold"
                disabled={deleteLoading === deleteConfirm.id}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm.id)}
                className="bg-health-critical hover:bg-red-700 text-white rounded-md py-1.5 px-4 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                disabled={deleteLoading === deleteConfirm.id}
              >
                {deleteLoading === deleteConfirm.id ? (
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
