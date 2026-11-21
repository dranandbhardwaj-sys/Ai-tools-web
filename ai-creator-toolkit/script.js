import { t } from './js/i18n.js';
import { CATEGORIES, TOOLS, getToolById } from './js/catalog.js';
import {
  PREMIUM_PLAN,
  loadState,
  saveState,
  getRuntimeSessionToken,
  setRuntimeSessionToken,
  resetAllLocalState,
  hasActivePremium,
  submitMembershipRequest,
  cancelMembershipPlan
} from './js/storage.js';
import { AI_PROVIDERS, generateCreatorContent, testAiConnection } from './js/ai-service.js';

let state = loadState();
let currentView = 'dashboard';
let activeCategory = 'all';
let searchQuery = '';
let mobileDrawerOpen = false;
let activeTool = null;
let isGenerating = false;

let modalDraft = {
  topic: '',
  context: '',
  tone: 'engaging',
  outLang: state.language === 'hi' ? 'hi' : 'en',
  length: 'medium',
  output: '',
  sourceNote: ''
};

const root = document.getElementById('app-root');
const toastEl = document.getElementById('toast-root');
let toastTimer = null;

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.add('hidden'), 3200);
}

function applyThemeAndLang() {
  const pref = state.theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    : state.theme;
  document.body.classList.toggle('theme-light', pref === 'light');
  document.documentElement.lang = state.language === 'hi' ? 'hi' : 'en';
  document.title = `${t(state.language).appName} — ${t(state.language).heroTitle}`;
}

function persistAndRender() {
  saveState(state);
  applyThemeAndLang();
  render();
}

function toolTitle(tool) {
  return state.language === 'hi' ? tool.titleHi : tool.titleEn;
}

function toolDesc(tool) {
  return state.language === 'hi' ? tool.descHi : tool.descEn;
}

function catTitle(cat) {
  return state.language === 'hi' ? cat.titleHi : cat.titleEn;
}

function downloadFile(content, filename, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function openToolModal(tool, prefillTopic = '', prefillOutput = '') {
  activeTool = tool;
  isGenerating = false;
  modalDraft = {
    topic: prefillTopic,
    context: '',
    tone: 'engaging',
    outLang: state.language === 'hi' ? 'hi' : 'en',
    length: 'medium',
    output: prefillOutput,
    sourceNote: ''
  };
  state.recentTools = [tool.id, ...state.recentTools.filter((id) => id !== tool.id)].slice(0, 6);
  saveState(state);
  render();
}

function renderLangSwitchHtml() {
  const s = t(state.language);
  return `
    <div class="lang-switch" role="group" aria-label="${esc(s.langSwitchAria)}">
      <button type="button" class="${state.language === 'en' ? 'active' : ''}" data-set-lang="en">${esc(s.langEnShort)}</button>
      <button type="button" class="${state.language === 'hi' ? 'active' : ''}" data-set-lang="hi">${esc(s.langHiShort)}</button>
    </div>
  `;
}

function renderSidebar() {
  const s = t(state.language);
  const navItems = [
    { id: 'dashboard', icon: '🏠', label: s.navDashboard },
    { id: 'all', icon: '🧰', label: s.navAllTools },
    { id: 'workspace', icon: '📝', label: s.navWorkspace },
    { id: 'favorites', icon: '⭐', label: s.navFavorites },
    { id: 'history', icon: '🕒', label: s.navHistory },
    { id: 'membership', icon: '💎', label: s.navMembership },
    { id: 'settings', icon: '⚙️', label: s.navSettings }
  ];

  return `
    <aside class="sidebar ${mobileDrawerOpen ? 'open' : ''}">
      <div class="brand-row">
        <img src="./assets/logo.svg" alt="${esc(s.appName)}" />
        <div>
          <div class="brand-title">${esc(s.appName)}</div>
          <div class="brand-sub">${esc(s.appTagline)}</div>
        </div>
      </div>

      <nav class="nav-list" aria-label="Main Navigation">
        ${navItems.map((item) => `
          <button type="button" class="nav-btn ${currentView === item.id ? 'active' : ''}" data-nav="${item.id}">
            <span>${item.icon}</span>
            <span>${esc(item.label)}</span>
          </button>
        `).join('')}
      </nav>

      <div class="card" style="margin-top:auto;background:var(--surface-soft);box-shadow:none;padding:14px;display:grid;gap:8px;">
        <div style="font-weight:700;font-size:0.9rem;">${esc(s.planProName)}</div>
        <div class="mono" style="font-size:1.05rem;font-weight:700;color:var(--accent);">${esc(s.planProPrice)}</div>
        <button type="button" class="btn btn-primary btn-sm" data-nav="membership">${esc(s.topbarUpgradeBtn)}</button>
      </div>
    </aside>
  `;
}

function renderToolCard(tool) {
  const s = t(state.language);
  const cat = CATEGORIES.find((c) => c.id === tool.cat);
  const isFav = state.favorites.includes(tool.id);

  return `
    <article class="tool-card" data-open-tool="${esc(tool.id)}">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <span class="badge" style="background:${cat.color}20;color:${cat.color};">${cat.icon} ${esc(catTitle(cat))}</span>
        <span class="badge ${tool.tier === 'pro' ? 'badge-accent' : 'badge-success'}">${esc(tool.tier === 'pro' ? s.proTag : s.freeTag)}</span>
      </div>
      <div>
        <h3 style="font-size:1rem;margin-bottom:4px;">${esc(toolTitle(tool))}</h3>
        <p class="muted" style="font-size:0.84rem;">${esc(toolDesc(tool))}</p>
      </div>
      <div style="margin-top:auto;display:flex;justify-content:space-between;align-items:center;gap:8px;padding-top:6px;">
        <button type="button" class="btn btn-primary btn-sm" data-open-tool="${esc(tool.id)}">${esc(s.openToolBtn)}</button>
        <button type="button" class="btn btn-outline btn-sm" data-toggle-fav="${esc(tool.id)}">${esc(isFav ? '★' : '☆')}</button>
      </div>
    </article>
  `;
}

function renderDashboardOrTools(isDashboard) {
  const s = t(state.language);
  const active = hasActivePremium(state);
  const sub = state.subscription;
  const planBadge = active
    ? s.planActiveBadge
    : sub.status === 'pending'
      ? s.planPendingBadge
      : sub.status === 'cancelled'
        ? s.planCancelledBadge
        : s.planFreeBadge;

  const q = searchQuery.trim().toLowerCase();
  const filteredTools = TOOLS.filter((tool) => {
    const matchesCat = activeCategory === 'all' || tool.cat === activeCategory;
    if (!matchesCat) return false;
    if (!q) return true;
    const cat = CATEGORIES.find((c) => c.id === tool.cat);
    return [tool.titleEn, tool.titleHi, tool.descEn, tool.descHi, cat?.titleEn, cat?.titleHi]
      .some((v) => String(v || '').toLowerCase().includes(q));
  });

  const quickToolIds = ['ai_blog_writer', 'instagram_caption', 'reel_script', 'ad_copy', 'image_prompt', 'whatsapp_business'];
  const quickTools = quickToolIds.map((id) => getToolById(id)).filter(Boolean);

  return `
    ${isDashboard ? `
      <section class="hero-banner">
        <div style="display:grid;gap:12px;">
          <span class="badge badge-accent" style="width:fit-content;">✨ ${esc(s.welcomePrefix)} ${esc(state.profile.name)} • ${esc(state.profile.niche)}</span>
          <h1 style="font-size:clamp(1.5rem,3vw,2.15rem);line-height:1.15;">${esc(s.heroTitle)}</h1>
          <p class="muted" style="font-size:0.95rem;">${esc(s.heroSubtitle)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:4px;">
            <button type="button" class="btn btn-primary" data-nav="all">${esc(s.heroPrimaryCta)}</button>
            <button type="button" class="btn btn-outline" data-nav="workspace">${esc(s.heroSecondaryCta)}</button>
          </div>
        </div>
        <div>
          <img src="./assets/illustrations/hero-creator.svg" alt="${esc(s.appName)}" />
        </div>
      </section>

      <section class="stats-grid">
        <div class="stat-card"><span class="muted" style="font-size:0.78rem;">${esc(s.statsTotalTools)}</span><strong style="font-size:1.4rem;">64</strong></div>
        <div class="stat-card"><span class="muted" style="font-size:0.78rem;">${esc(s.statsGeneratedToday)}</span><strong style="font-size:1.4rem;">${state.usage.todayCount}</strong></div>
        <div class="stat-card"><span class="muted" style="font-size:0.78rem;">${esc(s.statsTotalCreated)}</span><strong style="font-size:1.4rem;">${state.usage.totalGenerations}</strong></div>
        <div class="stat-card"><span class="muted" style="font-size:0.78rem;">${esc(s.statsSavedDrafts)}</span><strong style="font-size:1.4rem;">${state.drafts.length}</strong></div>
        <div class="stat-card"><span class="muted" style="font-size:0.78rem;">${esc(s.statsPlan)}</span><strong style="font-size:1rem;color:var(--accent);">${esc(planBadge)}</strong></div>
      </section>

      <section style="display:grid;gap:12px;">
        <div>
          <h2>${esc(s.quickCreateHeading)}</h2>
          <p class="muted" style="font-size:0.86rem;">${esc(s.quickCreateSub)}</p>
        </div>
        <div class="tools-grid">${quickTools.map(renderToolCard).join('')}</div>
      </section>
    ` : ''}

    <section style="display:grid;gap:14px;">
      <div class="card" style="display:grid;gap:12px;padding:16px;">
        <input id="tool-search" class="input" type="search" value="${esc(searchQuery)}" placeholder="${esc(s.searchPlaceholder)}" />
        <div class="chips-row">
          <button type="button" class="chip ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">${esc(s.allCatLabel)} (64)</button>
          ${CATEGORIES.map((cat) => `
            <button type="button" class="chip ${activeCategory === cat.id ? 'active' : ''}" data-cat="${cat.id}">
              ${cat.icon} ${esc(catTitle(cat))}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="tools-grid">${filteredTools.map(renderToolCard).join('')}</div>
    </section>

    ${isDashboard ? `
      <section class="grid-2">
        <div class="card" style="display:grid;gap:10px;">
          <h3>${esc(s.recentHeading)}</h3>
          ${state.history.length === 0 ? `<p class="muted" style="font-size:0.88rem;">${esc(s.noRecentYet)}</p>` : state.history.slice(0, 4).map((h) => `
            <div style="border:1px solid var(--border);border-radius:12px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <div style="min-width:0;">
                <strong style="font-size:0.88rem;">${esc(h.toolTitle)}</strong>
                <div class="muted" style="font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${esc(h.topic)}</div>
              </div>
              <button type="button" class="btn btn-soft btn-sm" data-restore-history="${esc(h.id)}">${esc(s.restoreToEditorBtn)}</button>
            </div>
          `).join('')}
        </div>

        <div class="card" style="display:grid;gap:10px;">
          <h3>${esc(s.recentToolsHeading)}</h3>
          ${state.recentTools.length === 0 ? `<p class="muted" style="font-size:0.88rem;">${esc(s.noRecentYet)}</p>` : state.recentTools.map((id) => getToolById(id)).filter(Boolean).map((tool) => `
            <div style="border:1px solid var(--border);border-radius:12px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <strong>${esc(toolTitle(tool))}</strong>
              <button type="button" class="btn btn-soft btn-sm" data-open-tool="${esc(tool.id)}">${esc(s.openToolBtn)}</button>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}
  `;
}

function renderWorkspaceView() {
  const s = t(state.language);
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <div>
        <h2>${esc(s.workspaceTitle)}</h2>
        <p class="muted">${esc(s.workspaceSubtitle)}</p>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        <button type="button" class="btn btn-primary btn-sm" id="btn-new-draft">${esc(s.newDraftBtn)}</button>
        <button type="button" class="btn btn-outline btn-sm" id="btn-export-md">${esc(s.exportMdBtn)}</button>
        <button type="button" class="btn btn-outline btn-sm" id="btn-export-json">${esc(s.exportJsonBtn)}</button>
      </div>
    </div>

    ${state.drafts.length === 0 ? `
      <div class="card" style="text-align:center;padding:34px 20px;display:grid;gap:12px;justify-items:center;">
        <img src="./assets/illustrations/workspace-empty.svg" alt="${esc(s.emptyWorkspaceTitle)}" style="max-width:220px;" />
        <h3>${esc(s.emptyWorkspaceTitle)}</h3>
        <p class="muted" style="max-width:460px;">${esc(s.emptyWorkspaceDesc)}</p>
        <button type="button" class="btn btn-primary" id="btn-new-draft-empty">${esc(s.newDraftBtn)}</button>
      </div>
    ` : `
      <div style="display:grid;gap:14px;">
        ${state.drafts.map((d) => `
          <div class="card" style="display:grid;gap:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <input class="input" style="max-width:380px;font-weight:700;" data-draft-title="${esc(d.id)}" value="${esc(d.title)}" />
              <span class="badge badge-primary">${esc(d.toolTitle)} • ${esc(d.updatedAt)}</span>
            </div>
            <textarea class="textarea" style="min-height:140px;" data-draft-body="${esc(d.id)}">${esc(d.content)}</textarea>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              <button type="button" class="btn btn-primary btn-sm" data-save-draft="${esc(d.id)}">${esc(s.saveDraftAction)}</button>
              <button type="button" class="btn btn-soft btn-sm" data-copy-draft="${esc(d.id)}">${esc(s.copyBtn)}</button>
              <button type="button" class="btn btn-soft btn-sm" data-dl-draft="${esc(d.id)}">${esc(s.downloadTxtBtn)}</button>
              <button type="button" class="btn btn-danger btn-sm" data-del-draft="${esc(d.id)}" style="margin-left:auto;">${esc(s.deleteDraftAction)}</button>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  `;
}

function renderFavoritesView() {
  const s = t(state.language);
  const favTools = state.favorites.map((id) => getToolById(id)).filter(Boolean);
  return `
    <h2>${esc(s.favoritesHeading)}</h2>
    ${favTools.length === 0 ? `<div class="card"><p class="muted">${esc(s.noFavoritesYet)}</p></div>` : `
      <div class="tools-grid">${favTools.map(renderToolCard).join('')}</div>
    `}
  `;
}

function renderHistoryView() {
  const s = t(state.language);
  return `
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
      <h2>${esc(s.historyTitle)} (${state.history.length})</h2>
      ${state.history.length > 0 ? `<button type="button" class="btn btn-danger btn-sm" id="btn-clear-history">${esc(s.clearHistoryBtn)}</button>` : ''}
    </div>
    ${state.history.length === 0 ? `<div class="card"><p class="muted">${esc(s.noHistoryText)}</p></div>` : `
      <div style="display:grid;gap:12px;">
        ${state.history.map((item) => `
          <div class="card" style="display:grid;gap:10px;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <div>
                <strong>${esc(item.toolTitle)}</strong>
                <div class="muted" style="font-size:0.82rem;">${esc(item.topic)} • ${esc(item.createdAt)}</div>
              </div>
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                <button type="button" class="btn btn-primary btn-sm" data-restore-history="${esc(item.id)}">${esc(s.restoreToEditorBtn)}</button>
                <button type="button" class="btn btn-soft btn-sm" data-copy-history="${esc(item.id)}">${esc(s.copyBtn)}</button>
                <button type="button" class="btn btn-soft btn-sm" data-dl-history="${esc(item.id)}">${esc(s.downloadTxtBtn)}</button>
                <button type="button" class="btn btn-soft btn-sm" data-md-history="${esc(item.id)}">${esc(s.downloadMdBtn)}</button>
              </div>
            </div>
            <pre style="white-space:pre-wrap;font-family:var(--font-sans);font-size:0.86rem;background:var(--surface-soft);padding:12px;border-radius:12px;max-height:180px;overflow-y:auto;">${esc(item.output)}</pre>
          </div>
        `).join('')}
      </div>
    `}
  `;
}

function renderMembershipView() {
  const s = t(state.language);
  const sub = state.subscription;
  const active = hasActivePremium(state);
  const statusBadge = active
    ? s.planActiveBadge
    : sub.status === 'pending'
      ? s.planPendingBadge
      : sub.status === 'cancelled'
        ? s.planCancelledBadge
        : s.planFreeBadge;

  const renewalDateFormatted = sub.renewalDateIso
    ? new Date(sub.renewalDateIso).toLocaleDateString()
    : '';
  const renewalText = active && renewalDateFormatted
    ? `${s.subRenewalActive} ${renewalDateFormatted}`
    : sub.status === 'pending'
      ? s.subRenewalPending
      : s.subRenewalOff;

  return `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
      <div>
        <h2>${esc(s.membershipTitle)}</h2>
        <p class="muted">${esc(s.membershipSubtitle)}</p>
      </div>
      <span class="badge ${active ? 'badge-success' : sub.status === 'pending' ? 'badge-warning' : sub.status === 'cancelled' ? 'badge-danger' : 'badge-primary'}">${esc(s.currentPlanLabel)}: ${esc(statusBadge)}</span>
    </div>

    <div class="card" style="display:grid;gap:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
        <h3>${esc(s.subStatusHeading)}</h3>
        ${sub.status === 'pending' || active ? `<button type="button" class="btn btn-danger btn-sm" id="btn-cancel-status">${esc(s.cancelSubBtn)}</button>` : ''}
      </div>
      <div class="stats-grid">
        <div class="stat-card" style="background:var(--surface-soft);">
          <span class="muted" style="font-size:0.78rem;">${esc(s.subPlanLabel)}</span>
          <strong style="font-size:1rem;">${esc(active ? PREMIUM_PLAN.name : sub.status === 'pending' ? `${PREMIUM_PLAN.name} (${s.pendingPlanBadge})` : s.planFreeName)}</strong>
        </div>
        <div class="stat-card" style="background:var(--surface-soft);">
          <span class="muted" style="font-size:0.78rem;">${esc(s.subPriceLabel)}</span>
          <strong class="mono" style="font-size:1rem;">${esc(s.subPriceValue)}</strong>
        </div>
        <div class="stat-card" style="background:var(--surface-soft);">
          <span class="muted" style="font-size:0.78rem;">${esc(s.subDurationLabel)}</span>
          <strong style="font-size:1rem;">${esc(s.subDurationValue)}</strong>
        </div>
        <div class="stat-card" style="background:var(--surface-soft);">
          <span class="muted" style="font-size:0.78rem;">${esc(s.subUsageLabel)}</span>
          <strong style="font-size:0.95rem;">${esc(active ? s.subUsagePremium : s.subUsageFree)}</strong>
        </div>
      </div>
      <div style="border:1px solid var(--border);border-radius:12px;padding:12px;font-size:0.88rem;">
        <strong>${esc(s.subRenewalLabel)}:</strong> <span class="muted">${esc(renewalText)}</span>
      </div>
    </div>

    <div class="grid-2">
      <div class="card" style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3>${esc(s.planFreeName)}</h3>
          <span class="badge badge-primary">${esc(s.freeTag)}</span>
        </div>
        <div class="mono" style="font-size:1.85rem;font-weight:700;">${esc(s.planFreePrice)}</div>
        <ul class="muted" style="padding-left:18px;display:grid;gap:8px;font-size:0.9rem;">
          ${s.planFreeFeatures.map((f) => `<li>${esc(f)}</li>`).join('')}
        </ul>
      </div>

      <div class="card" style="border-color:var(--accent);display:flex;flex-direction:column;gap:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3>${esc(s.planProName)}</h3>
          <span class="badge badge-accent">${esc(s.proTag)}</span>
        </div>
        <div class="mono" style="font-size:1.85rem;font-weight:700;color:var(--accent);">${esc(s.planProPrice)}</div>
        <div class="muted" style="font-size:0.82rem;margin-top:-8px;">${esc(s.planProCurrencyNote)}</div>
        <ul class="muted" style="padding-left:18px;display:grid;gap:6px;font-size:0.88rem;">
          ${s.planProFeatures.map((f) => `<li>${esc(f)}</li>`).join('')}
        </ul>
        <button type="button" class="btn btn-primary" id="btn-focus-billing">${esc(s.upgradeBtn)}</button>
      </div>
    </div>

    <div class="card" style="display:grid;gap:12px;">
      <h3>${esc(s.billingSectionTitle)}</h3>
      <p class="muted" style="font-size:0.86rem;">${esc(s.billingSecurityNote)}</p>
      <form id="membership-form" style="display:grid;gap:12px;">
        <div class="grid-2">
          <div>
            <label class="field-label" for="bill-method">${esc(s.paymentMethodLabel)}</label>
            <select id="bill-method" class="select">
              <option value="UPI Autopay">UPI Autopay (₹399/month)</option>
              <option value="Payment Gateway Placeholder">Payment Gateway Mandate (₹399/month)</option>
              <option value="UPI UTR Reference">UPI Reference / UTR</option>
            </select>
          </div>
          <div>
            <label class="field-label" for="bill-ref">${esc(s.paymentRefLabel)}</label>
            <input id="bill-ref" class="input" placeholder="${esc(s.paymentRefPlaceholder)}" required minlength="4" />
          </div>
        </div>
        <label style="display:flex;align-items:flex-start;gap:10px;font-size:0.86rem;cursor:pointer;">
          <input type="checkbox" id="bill-consent" style="margin-top:4px;" />
          <span>${esc(s.consentText)}</span>
        </label>
        <div style="display:flex;flex-wrap:wrap;gap:10px;">
          <button type="submit" class="btn btn-primary">${esc(s.submitBillingBtn)}</button>
          ${sub.status === 'pending' || active ? `<button type="button" class="btn btn-danger" id="btn-cancel-membership">${esc(s.cancelSubBtn)}</button>` : ''}
        </div>
      </form>
    </div>

    <div class="card">
      <h3 style="margin-bottom:10px;">${esc(s.billingHistoryTitle)} (${sub.billingHistory.length})</h3>
      ${sub.billingHistory.length === 0 ? `<p class="muted">${esc(s.noBillingRecords)}</p>` : `
        <div style="display:grid;gap:8px;">
          ${sub.billingHistory.map((b) => `
            <div style="border:1px solid var(--border);border-radius:12px;padding:10px 12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <div>
                <strong>${esc(b.plan)} • ${esc(b.status.toUpperCase())}</strong>
                <div class="mono muted" style="font-size:0.78rem;">${esc(b.paymentMethod)} • ${esc(b.referenceId)} • ${esc(b.createdAt)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function renderSettingsView() {
  const s = t(state.language);
  const cfg = state.aiConfig;
  const activeProv = AI_PROVIDERS.find((p) => p.id === cfg.provider) || AI_PROVIDERS[0];

  return `
    <h2>${esc(s.settingsTitle)}</h2>

    <div class="grid-2">
      <form id="profile-form" class="card" style="display:grid;gap:12px;">
        <h3>${esc(s.profileSection)}</h3>
        <div>
          <label class="field-label" for="prof-name">${esc(s.nameLabel)}</label>
          <input id="prof-name" class="input" value="${esc(state.profile.name)}" required />
        </div>
        <div>
          <label class="field-label" for="prof-niche">${esc(s.nicheLabel)}</label>
          <input id="prof-niche" class="input" value="${esc(state.profile.niche)}" />
        </div>
        <button type="submit" class="btn btn-primary">${esc(s.saveProfileBtn)}</button>
      </form>

      <div class="card" style="display:grid;gap:14px;">
        <h3>${esc(s.appearanceSection)}</h3>
        <div>
          <div class="field-label">${esc(s.themeLabel)}</div>
          <div class="chips-row">
            ${['dark', 'light', 'system'].map((m) => `
              <button type="button" class="chip ${state.theme === m ? 'active' : ''}" data-set-theme="${m}">${esc(s.themeOptions[m])}</button>
            `).join('')}
          </div>
        </div>
        <div>
          <div class="field-label">${esc(s.uiLangLabel)}</div>
          <div class="chips-row">
            <button type="button" class="chip ${state.language === 'en' ? 'active' : ''}" data-set-lang="en">English</button>
            <button type="button" class="chip ${state.language === 'hi' ? 'active' : ''}" data-set-lang="hi">हिन्दी (Hindi)</button>
          </div>
        </div>
      </div>
    </div>

    <form id="ai-config-form" class="card" style="display:grid;gap:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <h3>${esc(s.aiEngineSection)}</h3>
        <span class="badge ${cfg.mode === 'api' ? 'badge-success' : 'badge-warning'}">${esc(cfg.mode === 'api' ? s.apiModePill : s.demoModePill)}</span>
      </div>
      <p class="muted" style="font-size:0.86rem;">${esc(s.aiSecurityNotice)}</p>
      <div class="grid-2">
        <div>
          <label class="field-label" for="ai-mode">${esc(s.aiModeLabel)}</label>
          <select id="ai-mode" class="select">
            <option value="demo" ${cfg.mode === 'demo' ? 'selected' : ''}>${esc(s.aiModeDemo)}</option>
            <option value="api" ${cfg.mode === 'api' ? 'selected' : ''}>${esc(s.aiModeApi)}</option>
          </select>
        </div>
        <div>
          <label class="field-label" for="ai-provider">${esc(s.aiProviderLabel)}</label>
          <select id="ai-provider" class="select">
            ${AI_PROVIDERS.map((p) => `<option value="${p.id}" ${cfg.provider === p.id ? 'selected' : ''}>${esc(p.label)}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="grid-2">
        <div>
          <label class="field-label" for="ai-model">${esc(s.aiModelLabel)}</label>
          <select id="ai-model" class="select">
            ${activeProv.models.map((m) => `<option value="${m}" ${cfg.model === m ? 'selected' : ''}>${esc(m)}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="field-label" for="ai-endpoint">${esc(s.aiEndpointLabel)}</label>
          <input id="ai-endpoint" class="input" type="url" value="${esc(cfg.endpointUrl)}" placeholder="${esc(s.aiEndpointPlaceholder)}" />
        </div>
      </div>
      <div>
        <label class="field-label" for="ai-session-token">${esc(s.aiSessionKeyLabel)}</label>
        <input id="ai-session-token" class="input" type="password" value="${esc(getRuntimeSessionToken())}" placeholder="${esc(s.aiSessionKeyPlaceholder)}" autocomplete="off" />
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;">
        <button type="submit" class="btn btn-primary">${esc(s.saveAiBtn)}</button>
        <button type="button" class="btn btn-outline" id="btn-test-ai">${esc(s.testAiBtn)}</button>
        <button type="button" class="btn btn-danger" id="btn-reset-all" style="margin-left:auto;">${esc(s.resetDataBtn)}</button>
      </div>
      <div id="ai-test-status" class="mono muted" style="font-size:0.84rem;"></div>
    </form>
  `;
}

function renderToolModal() {
  if (!activeTool) return '';
  const s = t(state.language);
  const tool = activeTool;
  const cat = CATEGORIES.find((c) => c.id === tool.cat);
  const isFav = state.favorites.includes(tool.id);
  const isApi = state.aiConfig.mode === 'api' && state.aiConfig.endpointUrl;

  return `
    <div class="modal-backdrop" id="tool-backdrop" role="dialog" aria-modal="true" aria-label="${esc(toolTitle(tool))}">
      <div class="modal-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:12px;">
          <div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
              <span class="badge" style="background:${cat.color}20;color:${cat.color};">${cat.icon} ${esc(catTitle(cat))}</span>
              <span class="badge ${tool.tier === 'pro' ? 'badge-accent' : 'badge-success'}">${esc(tool.tier === 'pro' ? s.proTag : s.freeTag)}</span>
            </div>
            <h2 style="margin-top:8px;">${esc(toolTitle(tool))}</h2>
            <p class="muted" style="font-size:0.86rem;">${esc(toolDesc(tool))}</p>
          </div>
          <div style="display:flex;gap:8px;align-items:center;">
            <button type="button" class="btn btn-outline btn-sm" id="modal-fav-btn">${esc(isFav ? s.favBtnAdded : s.favBtnAdd)}</button>
            <button type="button" class="btn btn-outline btn-sm" id="btn-close-modal" aria-label="${esc(s.closeAria)}">✕</button>
          </div>
        </div>

        <div class="card" style="background:var(--surface-soft);padding:10px 14px;margin-bottom:14px;font-size:0.82rem;box-shadow:none;">
          ${esc(isApi ? s.modeBannerApi : s.modeBannerDemo)}
          ${tool.tier === 'pro' && !hasActivePremium(state) ? `
            <div style="margin-top:6px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
              <span style="color:var(--accent);font-weight:600;">${esc(s.proNotice)}</span>
              <button type="button" class="btn btn-primary btn-sm" id="btn-modal-upgrade">${esc(s.upgradeBtn)}</button>
            </div>` : ''}
        </div>

        <div style="display:grid;gap:12px;">
          <div>
            <label class="field-label" for="ws-topic">${esc(s.topicLabel)}</label>
            <textarea id="ws-topic" class="textarea" style="min-height:92px;" placeholder="${esc(s.topicPlaceholder)}">${esc(modalDraft.topic)}</textarea>
          </div>
          <div>
            <label class="field-label" for="ws-context">${esc(s.contextLabel)}</label>
            <input id="ws-context" class="input" value="${esc(modalDraft.context)}" placeholder="${esc(s.contextPlaceholder)}" />
          </div>
          <div class="grid-3">
            <div>
              <label class="field-label" for="ws-tone">${esc(s.toneLabel)}</label>
              <select id="ws-tone" class="select">
                ${Object.entries(s.tones).map(([k, lbl]) => `<option value="${k}" ${modalDraft.tone === k ? 'selected' : ''}>${esc(lbl)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="field-label" for="ws-out-lang">${esc(s.languageLabel)}</label>
              <select id="ws-out-lang" class="select">
                ${Object.entries(s.outLanguages).map(([k, lbl]) => `<option value="${k}" ${modalDraft.outLang === k ? 'selected' : ''}>${esc(lbl)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="field-label" for="ws-length">${esc(s.lengthLabel)}</label>
              <select id="ws-length" class="select">
                ${Object.entries(s.lengths).map(([k, lbl]) => `<option value="${k}" ${modalDraft.length === k ? 'selected' : ''}>${esc(lbl)}</option>`).join('')}
              </select>
            </div>
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button type="button" class="btn btn-primary" style="flex:1;" id="btn-generate" ${isGenerating ? 'disabled' : ''}>
              ${isGenerating ? `<span class="spinner"></span> ${esc(s.generatingText)}` : `✨ ${esc(s.generateBtn)}`}
            </button>
            <button type="button" class="btn btn-outline" id="btn-ws-clear">${esc(s.clearResultBtn)}</button>
          </div>

          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
              <label class="field-label" for="ws-result" style="margin:0;">${esc(s.resultLabel)}</label>
              ${modalDraft.sourceNote ? `<span class="badge badge-primary">${esc(modalDraft.sourceNote)}</span>` : ''}
            </div>
            <textarea id="ws-result" class="result-box" placeholder="${esc(s.resultPlaceholder)}">${esc(modalDraft.output)}</textarea>
          </div>

          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <button type="button" class="btn btn-soft btn-sm" id="btn-ws-copy">📋 ${esc(s.copyBtn)}</button>
            <button type="button" class="btn btn-soft btn-sm" id="btn-ws-dl">⬇ ${esc(s.downloadTxtBtn)}</button>
            <button type="button" class="btn btn-soft btn-sm" id="btn-ws-save-history">🕒 ${esc(s.saveHistoryBtn)}</button>
            <button type="button" class="btn btn-soft btn-sm" id="btn-ws-save-draft">📝 ${esc(s.saveDraftBtn)}</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMainContent() {
  switch (currentView) {
    case 'all': return renderDashboardOrTools(false);
    case 'workspace': return renderWorkspaceView();
    case 'favorites': return renderFavoritesView();
    case 'history': return renderHistoryView();
    case 'membership': return renderMembershipView();
    case 'settings': return renderSettingsView();
    default: return renderDashboardOrTools(true);
  }
}

function render() {
  const s = t(state.language);
  const isApi = state.aiConfig.mode === 'api' && state.aiConfig.endpointUrl;
  root.innerHTML = `
    <div class="app-shell">
      ${renderSidebar()}
      <div class="main-area">
        <header class="topbar">
          <div style="display:flex;align-items:center;gap:10px;">
            <button type="button" class="btn btn-outline btn-sm mobile-only" id="btn-drawer" aria-label="${esc(s.menuAria)}">☰</button>
            <strong style="font-family:var(--font-display);">${esc(s.appName)}</strong>
            <span class="badge ${isApi ? 'badge-success' : 'badge-warning'}" style="display:inline-flex;">${esc(isApi ? s.apiModePill : s.demoModePill)}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end;">
            ${renderLangSwitchHtml()}
            <button type="button" class="btn btn-outline btn-sm" id="btn-theme-toggle" aria-label="${esc(s.themeToggleAria)}">${state.theme === 'dark' ? '☀' : '☾'}</button>
            <button type="button" class="btn btn-primary btn-sm" data-nav="membership">${esc(s.topbarUpgradeBtn)}</button>
          </div>
        </header>
        <main class="workspace-body">${renderMainContent()}</main>
      </div>
    </div>

    <nav class="bottom-nav" aria-label="Mobile Navigation">
      <button type="button" class="${currentView === 'dashboard' ? 'active' : ''}" data-nav="dashboard"><span>🏠</span><span>${esc(s.bottomHome)}</span></button>
      <button type="button" class="${currentView === 'all' ? 'active' : ''}" data-nav="all"><span>🧰</span><span>${esc(s.bottomTools)}</span></button>
      <button type="button" class="${currentView === 'workspace' ? 'active' : ''}" data-nav="workspace"><span>📝</span><span>${esc(s.bottomWorkspace)}</span></button>
      <button type="button" class="${currentView === 'history' ? 'active' : ''}" data-nav="history"><span>🕒</span><span>${esc(s.bottomHistory)}</span></button>
      <button type="button" class="${currentView === 'membership' ? 'active' : ''}" data-nav="membership"><span>💎</span><span>${esc(s.bottomPlan)}</span></button>
    </nav>

    ${renderToolModal()}
  `;
  bindEvents();
}

function syncModalDraftFromDom() {
  const topicEl = document.getElementById('ws-topic');
  if (!topicEl) return;
  modalDraft.topic = topicEl.value;
  modalDraft.context = document.getElementById('ws-context')?.value || '';
  modalDraft.tone = document.getElementById('ws-tone')?.value || 'engaging';
  modalDraft.outLang = document.getElementById('ws-out-lang')?.value || 'en';
  modalDraft.length = document.getElementById('ws-length')?.value || 'medium';
  modalDraft.output = document.getElementById('ws-result')?.value || '';
}

function bindEvents() {
  const s = t(state.language);

  document.getElementById('btn-drawer')?.addEventListener('click', () => {
    mobileDrawerOpen = !mobileDrawerOpen;
    render();
  });

  document.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentView = btn.dataset.nav;
      mobileDrawerOpen = false;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('[data-set-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.language = btn.dataset.setLang === 'hi' ? 'hi' : 'en';
      persistAndRender();
    });
  });

  document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    persistAndRender();
  });

  document.querySelectorAll('[data-set-theme]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.theme = btn.dataset.setTheme;
      persistAndRender();
    });
  });

  const searchInput = document.getElementById('tool-search');
  searchInput?.addEventListener('input', (e) => {
    const pos = e.target.selectionStart;
    searchQuery = e.target.value;
    render();
    const nextInput = document.getElementById('tool-search');
    if (nextInput) {
      nextInput.focus();
      nextInput.setSelectionRange(pos, pos);
    }
  });

  document.querySelectorAll('[data-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      render();
    });
  });

  document.querySelectorAll('[data-toggle-fav]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.toggleFav;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((x) => x !== id);
      } else {
        state.favorites = [id, ...state.favorites];
      }
      persistAndRender();
    });
  });

  document.querySelectorAll('[data-open-tool]').forEach((card) => {
    card.addEventListener('click', () => {
      const tool = getToolById(card.dataset.openTool);
      if (tool) openToolModal(tool);
    });
  });

  document.getElementById('btn-clear-history')?.addEventListener('click', () => {
    state.history = [];
    persistAndRender();
  });
  document.querySelectorAll('[data-restore-history]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = state.history.find((h) => h.id === btn.dataset.restoreHistory);
      if (!item) return;
      const tool = getToolById(item.toolId) || TOOLS[0];
      openToolModal(tool, item.topic, item.output);
    });
  });
  document.querySelectorAll('[data-copy-history]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = state.history.find((h) => h.id === btn.dataset.copyHistory);
      if (!item) return;
      navigator.clipboard?.writeText(item.output);
      showToast(s.toastCopied);
    });
  });
  document.querySelectorAll('[data-dl-history]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = state.history.find((h) => h.id === btn.dataset.dlHistory);
      if (item) downloadFile(item.output, `${item.toolId}.txt`);
    });
  });
  document.querySelectorAll('[data-md-history]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = state.history.find((h) => h.id === btn.dataset.mdHistory);
      if (item) downloadFile(`# ${item.toolTitle}\n\n${item.output}`, `${item.toolId}.md`, 'text/markdown;charset=utf-8');
    });
  });

  const createBlankDraft = () => {
    state.drafts = [{
      id: `dr_${Date.now()}`,
      toolTitle: 'Creator Draft',
      title: 'Untitled Creator Draft',
      content: '',
      updatedAt: new Date().toLocaleString()
    }, ...state.drafts];
    persistAndRender();
  };
  document.getElementById('btn-new-draft')?.addEventListener('click', createBlankDraft);
  document.getElementById('btn-new-draft-empty')?.addEventListener('click', createBlankDraft);
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    downloadFile(JSON.stringify({ drafts: state.drafts, history: state.history }, null, 2), 'ai-creator-toolkit-export.json', 'application/json');
  });
  document.getElementById('btn-export-md')?.addEventListener('click', () => {
    const md = state.drafts.map((d) => `# ${d.title}\n\n${d.content}`).join('\n\n---\n\n');
    downloadFile(md || '# No Drafts', 'ai-creator-drafts.md', 'text/markdown;charset=utf-8');
  });
  document.querySelectorAll('[data-save-draft]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.saveDraft;
      const title = document.querySelector(`[data-draft-title="${id}"]`)?.value || 'Draft';
      const content = document.querySelector(`[data-draft-body="${id}"]`)?.value || '';
      state.drafts = state.drafts.map((d) => d.id === id ? { ...d, title, content, updatedAt: new Date().toLocaleString() } : d);
      persistAndRender();
      showToast(s.toastSavedDraft);
    });
  });
  document.querySelectorAll('[data-copy-draft]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const content = document.querySelector(`[data-draft-body="${btn.dataset.copyDraft}"]`)?.value || '';
      navigator.clipboard?.writeText(content);
      showToast(s.toastCopied);
    });
  });
  document.querySelectorAll('[data-dl-draft]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.dlDraft;
      const title = document.querySelector(`[data-draft-title="${id}"]`)?.value || 'draft';
      const content = document.querySelector(`[data-draft-body="${id}"]`)?.value || '';
      downloadFile(content, `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.txt`);
    });
  });
  document.querySelectorAll('[data-del-draft]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.drafts = state.drafts.filter((d) => d.id !== btn.dataset.delDraft);
      persistAndRender();
    });
  });

  document.getElementById('btn-focus-billing')?.addEventListener('click', () => {
    document.getElementById('bill-ref')?.focus();
  });
  document.getElementById('membership-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      submitMembershipRequest(state, {
        paymentMethod: document.getElementById('bill-method').value,
        referenceId: document.getElementById('bill-ref').value,
        consentAccepted: document.getElementById('bill-consent').checked
      });
      persistAndRender();
      showToast(s.toastBillingSubmitted);
    } catch (err) {
      if (err.message === 'CONSENT_REQUIRED') showToast(s.errConsent);
      else if (err.message === 'INVALID_REF') showToast(s.errRef);
      else showToast(err.message);
    }
  });
  const handleCancel = () => {
    cancelMembershipPlan(state);
    persistAndRender();
    showToast(s.toastBillingCancelled);
  };
  document.getElementById('btn-cancel-membership')?.addEventListener('click', handleCancel);
  document.getElementById('btn-cancel-status')?.addEventListener('click', handleCancel);
  document.getElementById('btn-modal-upgrade')?.addEventListener('click', () => {
    activeTool = null;
    currentView = 'membership';
    render();
  });

  document.getElementById('profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.profile.name = document.getElementById('prof-name').value.trim() || 'Creator';
    state.profile.niche = document.getElementById('prof-niche').value.trim();
    persistAndRender();
    showToast(s.toastProfileSaved);
  });
  document.getElementById('ai-provider')?.addEventListener('change', (e) => {
    const prov = AI_PROVIDERS.find((p) => p.id === e.target.value);
    if (prov) {
      state.aiConfig.provider = prov.id;
      state.aiConfig.model = prov.models[0];
      persistAndRender();
    }
  });
  document.getElementById('ai-config-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    state.aiConfig = {
      mode: document.getElementById('ai-mode').value,
      provider: document.getElementById('ai-provider').value,
      model: document.getElementById('ai-model').value,
      endpointUrl: document.getElementById('ai-endpoint').value.trim()
    };
    setRuntimeSessionToken(document.getElementById('ai-session-token').value.trim());
    persistAndRender();
    showToast(s.toastAiSaved);
  });
  document.getElementById('btn-test-ai')?.addEventListener('click', async () => {
    const draftCfg = {
      mode: document.getElementById('ai-mode').value,
      provider: document.getElementById('ai-provider').value,
      model: document.getElementById('ai-model').value,
      endpointUrl: document.getElementById('ai-endpoint').value.trim()
    };
    setRuntimeSessionToken(document.getElementById('ai-session-token').value.trim());
    const out = document.getElementById('ai-test-status');
    out.textContent = '...';
    const res = await testAiConnection(draftCfg);
    out.style.color = res.ok ? 'var(--success)' : 'var(--danger)';
    out.textContent = res.message;
  });
  document.getElementById('btn-reset-all')?.addEventListener('click', () => {
    state = resetAllLocalState();
    persistAndRender();
    showToast(s.toastResetDone);
  });

  document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    activeTool = null;
    isGenerating = false;
    render();
  });
  document.getElementById('tool-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'tool-backdrop') {
      activeTool = null;
      isGenerating = false;
      render();
    }
  });
  document.getElementById('modal-fav-btn')?.addEventListener('click', () => {
    if (!activeTool) return;
    syncModalDraftFromDom();
    if (state.favorites.includes(activeTool.id)) {
      state.favorites = state.favorites.filter((id) => id !== activeTool.id);
    } else {
      state.favorites = [activeTool.id, ...state.favorites];
    }
    persistAndRender();
  });
  document.getElementById('btn-ws-clear')?.addEventListener('click', () => {
    syncModalDraftFromDom();
    modalDraft.output = '';
    modalDraft.sourceNote = '';
    render();
  });
  document.getElementById('btn-generate')?.addEventListener('click', async () => {
    if (!activeTool || isGenerating) return;
    syncModalDraftFromDom();
    if (!modalDraft.topic.trim()) {
      showToast(s.errNoTopic);
      document.getElementById('ws-topic')?.focus();
      return;
    }
    isGenerating = true;
    render();
    try {
      const result = await generateCreatorContent({
        aiConfig: state.aiConfig,
        tool: activeTool,
        topic: modalDraft.topic,
        context: modalDraft.context,
        tone: modalDraft.tone,
        outLang: modalDraft.outLang,
        length: modalDraft.length
      });
      modalDraft.output = result.text;
      modalDraft.sourceNote = result.source;
      state.usage.totalGenerations += 1;
      state.usage.todayCount += 1;
      state.history = [{
        id: `his_${Date.now()}`,
        toolId: activeTool.id,
        toolTitle: toolTitle(activeTool),
        topic: modalDraft.topic.trim().slice(0, 120),
        output: result.text,
        createdAt: new Date().toLocaleString()
      }, ...state.history].slice(0, 40);
      saveState(state);
    } catch (err) {
      showToast(err.message);
    } finally {
      isGenerating = false;
      render();
    }
  });
  document.getElementById('btn-ws-copy')?.addEventListener('click', () => {
    syncModalDraftFromDom();
    if (!modalDraft.output) return;
    navigator.clipboard?.writeText(modalDraft.output);
    showToast(s.toastCopied);
  });
  document.getElementById('btn-ws-dl')?.addEventListener('click', () => {
    syncModalDraftFromDom();
    if (!modalDraft.output || !activeTool) return;
    downloadFile(modalDraft.output, `${activeTool.id}.txt`);
  });
  document.getElementById('btn-ws-save-history')?.addEventListener('click', () => {
    syncModalDraftFromDom();
    if (!modalDraft.output || !activeTool) return;
    state.history = [{
      id: `his_${Date.now()}`,
      toolId: activeTool.id,
      toolTitle: toolTitle(activeTool),
      topic: modalDraft.topic.trim().slice(0, 120) || toolTitle(activeTool),
      output: modalDraft.output,
      createdAt: new Date().toLocaleString()
    }, ...state.history].slice(0, 40);
    saveState(state);
    showToast(s.toastSavedHistory);
  });
  document.getElementById('btn-ws-save-draft')?.addEventListener('click', () => {
    syncModalDraftFromDom();
    if (!modalDraft.output || !activeTool) return;
    state.drafts = [{
      id: `dr_${Date.now()}`,
      toolTitle: toolTitle(activeTool),
      title: modalDraft.topic.trim().slice(0, 60) || toolTitle(activeTool),
      content: modalDraft.output,
      updatedAt: new Date().toLocaleString()
    }, ...state.drafts];
    saveState(state);
    showToast(s.toastSavedDraft);
  });
}

applyThemeAndLang();
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}
