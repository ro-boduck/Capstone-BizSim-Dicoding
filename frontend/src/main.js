/**
 * BizSim — Main application entry point
 * Satisfies: FE Vite module bundler, FE Axios networking, FE RESTful API calls
 */

import './style.css';
import { predict, saveSimulation, getSimulations, checkAIHealth } from './api.js';
import { FIELD_CONFIG, renderSimulationForm, validateForm, parseRupiah, updateLivePreview } from './components/SimForm.js';
import { renderResult, animateResult } from './components/ResultCard.js';
import { renderHistory, renderHistoryLoading } from './components/History.js';
import { renderNavigation } from './components/Navigation.js';
import { renderLanding } from './components/Landing.js';
import { renderAbout } from './components/About.js';

// ─── App State ───────────────────────────────────────────────────────────────
let state = {
  view: 'landing',   // 'landing' | 'about' | 'form' | 'result' | 'history'
  formData: { modal_awal: '', biaya_tetap_bulanan: '', biaya_variabel_bulanan: '', pendapatan_bulanan: '' },
  errors: {},
  loading: false,
  result: null,
  simulations: [],
  aiOnline: null,
};

// ─── Root element ─────────────────────────────────────────────────────────────
const app = document.getElementById('app');

// ─── Render helpers ──────────────────────────────────────────────────────────

function renderNav() {
  const tabs = [
    { id: 'form',    label: 'Simulasi',  icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>' },
    { id: 'history', label: 'Riwayat',   icon: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>' },
  ];
  return `
    <nav class="flex gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-md">
      ${tabs.map(tab => `
        <button
          id="nav-${tab.id}"
          class="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-display font-bold transition-all duration-300
                 ${state.view === tab.id || (tab.id === 'form' && state.view === 'result')
                   ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                   : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'}"
          aria-current="${state.view === tab.id ? 'page' : 'false'}"
        >
          <span>${tab.icon}</span> ${tab.label}
        </button>
      `).join('')}
    </nav>
  `;
}

function renderAIStatus() {
  if (state.aiOnline === null) return '';
  const online = state.aiOnline;
  return `
    <div class="flex items-center gap-2 text-[10px] bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-full font-mono">
      <div class="w-1.5 h-1.5 rounded-full ${online ? 'bg-teal-400 animate-pulse' : 'bg-rose-500'}"></div>
      <span class="text-slate-400">AI Core: ${online ? 'ONLINE' : 'OFFLINE'}</span>
    </div>
  `;
}

function renderHeader() {
  return `
    <header class="text-center py-8 animate-fade-up">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-display font-semibold mb-3">
        <span class="animate-pulse text-indigo-400">●</span> BizSim AI Engine
      </div>
      <h1 class="text-3.5xl font-display font-extrabold tracking-tight text-white leading-tight">
        Simulasi<br/>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Ketahanan Modal</span>
      </h1>
      <p class="mt-3 text-slate-400 text-xs max-w-xs mx-auto leading-relaxed">
        Lakukan simulasi taktis cadangan kas bisnis UMKM Anda dengan dukungan model AI ganda.
      </p>
    </header>
  `;
}

function render() {
  const isAppView = ['form', 'result', 'history'].includes(state.view);

  let content = '';

  if (state.view === 'landing') {
    content = renderLanding();
  } else if (state.view === 'about') {
    content = renderAbout();
  } else if (isAppView) {
    content = `
      <div class="min-h-screen pt-24 pb-20 relative z-10">
        <main class="relative mx-auto max-w-4xl px-4 sm:px-6">
          ${renderHeader()}

          <!-- Status bar -->
          <div class="flex items-center justify-between mb-4">
            ${renderNav()}
            ${renderAIStatus()}
          </div>

          <!-- Content panels (Bento Architecture) -->
          <div class="bezel-shell">
            <div class="bezel-core p-5 sm:p-6" id="content-panel">
              ${state.view === 'history'
                ? renderHistory(state.simulations)
                : state.view === 'result' && state.result
                  ? renderResult(state.result, state.formData)
                  : renderSimulationForm(state.formData, state.errors, state.loading)
              }
            </div>
          </div>
        </main>
      </div>
    `;
  }

  app.innerHTML = `
    <!-- Glowing Aurora Background Blobs -->
    <div class="aurora-container">
      <div class="aurora-blob aurora-indigo"></div>
      <div class="aurora-blob aurora-teal"></div>
      <div class="aurora-blob aurora-pink"></div>
    </div>
    
    ${renderNavigation(state.view)}
    
    ${content}
    
    ${!isAppView ? `
      <!-- Global Footer -->
      <footer class="bg-[#05070f]/80 backdrop-blur-md py-12 text-center text-sm text-slate-500 mt-auto border-t border-white/5 relative z-10">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs shadow-md">B</div>
              <span class="font-bold text-white">BizSim</span>
            </div>
            <p>Coding Camp 2026 · DBS Foundation · Team CC26-PRU422</p>
          </div>
        </div>
      </footer>
    ` : `
      <!-- App Footer -->
      <footer class="text-center mt-8 pb-8 text-xs text-slate-500 font-display relative z-10">
        Coding Camp 2026 · DBS Foundation · Team CC26-PRU422
      </footer>
    `}
  `;

  attachListeners();

  // Animate result if on result view
  if (state.view === 'result' && state.result) {
    animateResult(state.result.predicted_runway_months);
  }
}

// ─── Event listeners ─────────────────────────────────────────────────────────

function attachListeners() {
  // Global Navigation
  const navIds = ['landing', 'about', 'app'];
  navIds.forEach(id => {
    const btn = document.getElementById(`mainnav-${id}`);
    if (btn) {
      btn.addEventListener('click', () => {
        state.view = id === 'app' ? 'form' : id;
        window.scrollTo(0, 0);
        render();
      });
    }
  });

  const logoBtn = document.getElementById('nav-logo');
  if (logoBtn) {
    logoBtn.addEventListener('click', () => {
      state.view = 'landing';
      window.scrollTo(0, 0);
      render();
    });
  }

  // CTA buttons in landing
  const ctas = ['mainnav-cta', 'hero-cta', 'pricing-cta', 'final-cta'];
  ctas.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        state.view = 'form';
        window.scrollTo(0, 0);
        render();
      });
    }
  });

  // App Navigation
  const navForm    = document.getElementById('nav-form');
  const navHistory = document.getElementById('nav-history');
  if (navForm)    navForm.addEventListener('click', () => { state.view = 'form'; render(); });
  if (navHistory) navHistory.addEventListener('click', () => showHistory());

  // Form submission
  const form = document.getElementById('sim-form');
  if (form) {
    // Live formatting + live preview update on every input
    FIELD_CONFIG.forEach(({ id }) => {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('input', (e) => {
        const raw = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '');
        e.target.value = raw ? Number(raw).toLocaleString('id-ID') : '';

        // Collect current values and push to live preview (no full re-render)
        const liveData = {};
        FIELD_CONFIG.forEach(({ id: fid }) => {
          const el = document.getElementById(fid);
          liveData[fid] = el ? parseRupiah(el.value) : 0;
        });
        updateLivePreview(liveData);
      });
    });

    form.addEventListener('submit', handleSubmit);
  }

  // Result buttons
  const resetBtn   = document.getElementById('reset-btn');
  const historyBtn = document.getElementById('history-btn');
  if (resetBtn)   resetBtn.addEventListener('click', () => { state.view = 'form'; state.result = null; render(); });
  if (historyBtn) historyBtn.addEventListener('click', () => showHistory());
}

// ─── Form submission handler ─────────────────────────────────────────────────

async function handleSubmit(e) {
  e.preventDefault();

  // Collect & parse form data
  const raw = {};
  FIELD_CONFIG.forEach(({ id }) => {
    const input = document.getElementById(id);
    raw[id] = input ? parseRupiah(input.value) : 0;
  });

  // Validate
  const errors = validateForm(raw);
  if (Object.keys(errors).length > 0) {
    state.errors = errors;
    // Focus first error field
    const firstError = Object.keys(errors)[0];
    render();
    document.getElementById(firstError)?.focus();
    return;
  }

  state.formData = raw;
  state.errors   = {};
  state.loading  = true;
  render();

  try {
    // 1. Call FastAPI AI model (main feature)
    const prediction = await predict({
      modal_awal:               raw.modal_awal,
      biaya_tetap_bulanan:      raw.biaya_tetap_bulanan,
      biaya_variabel_bulanan:   raw.biaya_variabel_bulanan,
      pendapatan_bulanan:       raw.pendapatan_bulanan,
    });

    state.result  = prediction;
    state.loading = false;

    // 2. Save to Express API (data persistence)
    await saveSimulation({
      ...raw,
      predicted_months: prediction.predicted_runway_months,
    }).catch(err => console.warn('Express save failed:', err.message));

    state.view = 'result';
    render();
  } catch (err) {
    state.loading = false;
    // Fallback: use heuristic estimate if AI offline
    const burnRate = raw.biaya_tetap_bulanan + raw.biaya_variabel_bulanan - raw.pendapatan_bulanan;
    const estimated = burnRate > 0 ? Math.round(raw.modal_awal / burnRate) : 36;
    state.result = {
      predicted_runway_months: estimated,
      confidence_note: '⚠ AI offline — hasil estimasi heuristik (tidak akurat).',
    };
    state.view = 'result';
    showToast('AI service tidak tersedia. Menampilkan estimasi sementara.', 'warn');
    render();
  }
}

// ─── History ──────────────────────────────────────────────────────────────────

async function showHistory() {
  state.view = 'history';
  state.simulations = [];
  render();

  // Show skeleton while loading
  const panel = document.getElementById('content-panel');
  if (panel) panel.innerHTML = `<div class="space-y-3.5">${renderHistoryLoading()}</div>`;

  try {
    const data         = await getSimulations();
    state.simulations  = data.data || data;
    if (panel) panel.innerHTML = renderHistory(state.simulations);
  } catch (err) {
    if (panel) panel.innerHTML = `<p class="text-center text-slate-500 py-12 text-sm">Tidak dapat memuat riwayat. <button id="retry-hist" class="text-indigo-400 font-bold underline ml-1">Coba lagi</button></p>`;
    document.getElementById('retry-hist')?.addEventListener('click', showHistory);
  }
}

// ─── Toast notification ───────────────────────────────────────────────────────

function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const colors = { info: 'bg-white text-surface-900', warn: 'bg-amber-950 text-amber-300 border-amber-500/20', error: 'bg-rose-950 text-rose-300 border-rose-500/20', success: 'bg-teal-950 text-teal-300 border-teal-500/20' };
  const toast = document.createElement('div');
  toast.className = `toast ${colors[type] || colors.info}`;
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.appendChild(toast);
  setTimeout(() => toast?.remove(), 4000);
}

// ─── Initial setup ────────────────────────────────────────────────────────────

async function init() {
  render();
  // Check AI service health in background
  try {
    await checkAIHealth();
    state.aiOnline = true;
  } catch {
    state.aiOnline = false;
  }
  // Re-render just the status without full re-render
  const statusEl = document.querySelector('.flex.justify-end.mb-4');
  if (statusEl) statusEl.innerHTML = renderAIStatus();
}

init();
