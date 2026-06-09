'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';

interface CostItem {
  name: string;
  amount: string;
}

export default function InteractivePreview() {
  const [modalAwal, setModalAwal] = useState('150.000.000');
  const [pendapatan, setPendapatan] = useState('10.000.000');
  const [fixedCosts, setFixedCosts] = useState<CostItem[]>([
    { name: 'Sewa Ruko', amount: '6.000.000' },
    { name: 'Gaji Staff', amount: '5.000.000' },
    { name: 'Internet & Air', amount: '1.000.000' },
  ]);
  const [variableCosts, setVariableCosts] = useState<CostItem[]>([
    { name: 'Bahan Baku', amount: '2.000.000' },
    { name: 'Iklan Medsos', amount: '1.000.000' },
  ]);

  const parseCurrency = (s: string) => {
    return Number(s.replace(/\./g, '')) || 0;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('id-ID');
  };

  const handleCurrencyInput = (val: string, setter: (v: string) => void) => {
    const digits = val.replace(/\./g, '').replace(/[^0-9]/g, '');
    const formatted = digits ? Number(digits).toLocaleString('id-ID') : '';
    setter(formatted);
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

  const sumCosts = (items: CostItem[]) => items.reduce((sum, item) => sum + parseCurrency(item.amount), 0);

  const modalVal = parseCurrency(modalAwal);
  const pendapatanVal = parseCurrency(pendapatan);
  const tetapVal = sumCosts(fixedCosts);
  const variabelVal = sumCosts(variableCosts);

  // Calculate runway
  const totalCosts = tetapVal + variabelVal;
  const netLoss = totalCosts - pendapatanVal;
  
  let runway = 0;
  let statusText = 'Elite (Safe)';
  let statusColor = 'text-health-elite border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900';
  let strokeDashoffset = 0;

  if (netLoss <= 0) {
    runway = 999;
    statusText = 'Elite (Surplus)';
    statusColor = 'text-health-elite border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900';
  } else {
    runway = Math.round(modalVal / netLoss);
    if (runway >= 12) {
      statusText = 'Elite (Safe)';
      statusColor = 'text-health-elite border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900';
    } else if (runway >= 6) {
      statusText = 'Growth (Stable)';
      statusColor = 'text-health-growth border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-900';
    } else if (runway >= 3) {
      statusText = 'Struggling (Warning)';
      statusColor = 'text-health-struggling border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900';
    } else {
      statusText = 'Critical (Danger)';
      statusColor = 'text-health-critical border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900';
    }
  }

  const circ = 251.2;
  const maxMonthsForGauge = 24;
  const percentage = runway >= 999 ? 100 : Math.min(100, (runway / maxMonthsForGauge) * 100);
  strokeDashoffset = circ - (percentage / 100) * circ;

  return (
    <div className="aura-card w-full max-w-md mx-auto p-5 border border-border-aura bg-background shadow-xl relative overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-5 border-b border-border-aura pb-3">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-200/60 bg-emerald-50/50 text-[8px] text-health-growth font-bold tracking-wider uppercase font-mono dark:bg-emerald-950/20 dark:border-emerald-900">
          <span className="w-1.5 h-1.5 rounded-full bg-health-growth inline-block" />
          Preview Tracker
        </div>
        <span className="text-[9px] text-muted-text font-mono uppercase tracking-wider">Aura Dashboard Simulator</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Modal Awal */}
        <div>
          <label className="block text-[8px] text-muted-text font-bold uppercase tracking-wider mb-1">Modal Awal (Rp)</label>
          <input
            type="text"
            value={modalAwal}
            onChange={(e) => handleCurrencyInput(e.target.value, setModalAwal)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-md border border-border-aura bg-secondary-surface text-foreground font-mono focus:outline-none focus:border-primary-action"
            placeholder="0"
          />
        </div>
        {/* Pendapatan */}
        <div>
          <label className="block text-[8px] text-muted-text font-bold uppercase tracking-wider mb-1">Pendapatan (Rp)</label>
          <input
            type="text"
            value={pendapatan}
            onChange={(e) => handleCurrencyInput(e.target.value, setPendapatan)}
            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-md border border-border-aura bg-secondary-surface text-foreground font-mono focus:outline-none focus:border-primary-action"
            placeholder="0"
          />
        </div>
      </div>

      {/* Cost Sections */}
      <div className="space-y-4 max-h-48 overflow-y-auto pr-1 mb-4 scrollbar-thin">
        {/* Fixed Costs */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[8px] font-bold text-foreground uppercase tracking-widest">Biaya Tetap (Sewa, Staf, dll)</span>
            <button
              onClick={() => addCostItem('fixed')}
              className="text-[8px] font-bold text-primary-action hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <Icon name="add" size={10} /> Tambah
            </button>
          </div>
          <div className="space-y-1.5">
            {fixedCosts.map((item, index) => (
              <div key={`fixed-${index}`} className="flex gap-1.5">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateCostItem('fixed', index, 'name', e.target.value)}
                  placeholder="Nama Biaya"
                  className="flex-1 text-[10px] px-2 py-1 border border-border-aura rounded-md bg-secondary-surface text-foreground focus:outline-none"
                />
                <input
                  type="text"
                  value={item.amount}
                  onChange={(e) => updateCostItem('fixed', index, 'amount', e.target.value)}
                  placeholder="Jumlah (Rp)"
                  className="w-28 text-[10px] px-2 py-1 border border-border-aura rounded-md bg-secondary-surface text-foreground font-mono focus:outline-none text-right"
                />
                <button
                  onClick={() => removeCostItem('fixed', index)}
                  className="text-muted-text hover:text-health-critical cursor-pointer p-1"
                >
                  <Icon name="delete" size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Variable Costs */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[8px] font-bold text-foreground uppercase tracking-widest">Biaya Variabel (Bahan Baku, Iklan)</span>
            <button
              onClick={() => addCostItem('variable')}
              className="text-[8px] font-bold text-primary-action hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <Icon name="add" size={10} /> Tambah
            </button>
          </div>
          <div className="space-y-1.5">
            {variableCosts.map((item, index) => (
              <div key={`variable-${index}`} className="flex gap-1.5">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateCostItem('variable', index, 'name', e.target.value)}
                  placeholder="Nama Biaya"
                  className="flex-1 text-[10px] px-2 py-1 border border-border-aura rounded-md bg-secondary-surface text-foreground focus:outline-none"
                />
                <input
                  type="text"
                  value={item.amount}
                  onChange={(e) => updateCostItem('variable', index, 'amount', e.target.value)}
                  placeholder="Jumlah (Rp)"
                  className="w-28 text-[10px] px-2 py-1 border border-border-aura rounded-md bg-secondary-surface text-foreground font-mono focus:outline-none text-right"
                />
                <button
                  onClick={() => removeCostItem('variable', index)}
                  className="text-muted-text hover:text-health-critical cursor-pointer p-1"
                >
                  <Icon name="delete" size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary totals */}
      <div className="bg-secondary-surface border border-border-aura rounded-md p-2 flex justify-between text-[9px] text-muted-text font-mono mb-4">
        <div>Total Pengeluaran: <span className="text-foreground font-bold">{formatNumber(totalCosts)}</span></div>
        <div>Burn Rate Bersih: <span className="text-foreground font-bold">{formatNumber(netLoss > 0 ? netLoss : 0)}</span></div>
      </div>

      {/* Result Gauge */}
      <div className="pt-4 border-t border-border-aura flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" className="stroke-border-aura fill-transparent" strokeWidth="4" />
              <circle
                cx="28"
                cy="28"
                r="24"
                className="stroke-primary-action fill-transparent transition-all duration-300 ease-out"
                strokeWidth="4"
                strokeDasharray="150.7"
                strokeDashoffset={150.7 - (percentage / 100) * 150.7}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xs font-black text-foreground">{runway >= 999 ? '∞' : runway}</span>
              <span className="text-[5px] text-muted-text font-mono uppercase">{runway >= 999 ? 'Aman' : 'Bln'}</span>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-bold text-foreground">Cash Runway Proyeksi</h4>
            <p className="text-[8px] text-muted-text font-medium">Ketahanan sisa kas usaha</p>
          </div>
        </div>

        <div className={`text-[8px] font-mono uppercase tracking-wider border px-2.5 py-1 rounded-full font-bold transition-all duration-300 ${statusColor}`}>
          {statusText}
        </div>
      </div>
    </div>
  );
}
