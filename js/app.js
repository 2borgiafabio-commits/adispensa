// Interfaccia di A'Dispensa: schermate, swipe, schede e avvisi.

import * as S from './store.js';
import { COLORS } from './seed.js';

const { state, sync } = S;
const app = document.getElementById('app');
const sheetRoot = document.getElementById('sheet-root');
const toastRoot = document.getElementById('toast');

const ui = {
  tab: pref('tab', 'spesa'),
  store: 'all',
  scorteQ: '',
  addQ: '',
  welcome: 'start',
  busy: false,
};

// ---------- Piccoli aiuti ----------

function pref(k, d) { try { return localStorage.getItem(`adispensa.${k}`) || d; } catch { return d; } }
function setPref(k, v) { try { localStorage.setItem(`adispensa.${k}`, v); } catch { /* niente */ } }

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => (n === null || n === undefined ? '' : String(Math.round(n * 100) / 100).replace('.', ','));
const parseNum = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isNaN(n) ? null : n;
};
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const catOf = (it) => S.byId('categories', it.category_id);
const colorVar = (key) => `var(--cat-${COLORS.includes(key) ? key : 'gray'})`;
const cStyle = (c) => `style="--c:${colorVar(c?.color)}"`;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function daysUntil(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const t = new Date(); t.setHours(0, 0, 0, 0);
  return Math.round((new Date(y, m - 1, d) - t) / 864e5);
}
function relDays(n, dateStr) {
  if (n < -1) return `scaduto da ${n * -1} giorni`;
  if (n === -1) return 'scaduto ieri';
  if (n === 0) return 'scade oggi';
  if (n === 1) return 'domani';
  if (n <= 7) return `tra ${n} giorni`;
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
}
function timeAgo(iso) {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 60) return 'adesso';
  if (s < 3600) return `${Math.floor(s / 60)} min fa`;
  if (s < 86400) return `${Math.floor(s / 3600)} ore fa`;
  const d = Math.floor(s / 86400);
  return d === 1 ? 'ieri' : `${d} giorni fa`;
}

function groupByCategory(items) {
  const groups = S.sortedCategories().map((c) => ({ cat: c, items: items.filter((i) => i.category_id === c.id) }));
  const orphans = items.filter((i) => !i.category_id || !S.byId('categories', i.category_id));
  if (orphans.length) groups.push({ cat: { id: null, name: 'Altro', color: 'gray' }, items: orphans });
  return groups.filter((g) => g.items.length);
}

function syncLabel() {
  return {
    pending: 'Salvataggio…', syncing: 'Sincronizzo…', offline: 'Offline: salvo appena torna la rete',
    error: `Errore di sincronizzazione${sync.error ? `: ${sync.error}` : ''}`,
  }[sync.status] || '';
}

function expiringSoon() {
  return state.items.filter((i) => i.expiry && daysUntil(i.expiry) <= 3).length;
}

// ---------- Pezzi di interfaccia ----------

function header(title, sub) {
  const showDot = state.mode === 'cloud' && sync.status !== 'ok';
  const dot = showDot ? `<span class="sync-dot ${sync.status}" title="${esc(syncLabel())}"></span>` : '';
  const extra = sync.status === 'offline' ? ' · offline' : sync.status === 'error' ? ' · errore di sync' : '';
  return `<div class="top">
    <div><h1 class="title">${title}</h1><div class="subtitle">${dot}<span>${sub}${extra}</span></div></div>
    <button class="icon-btn" data-act="settings" aria-label="Impostazioni"><i class="ti ti-settings"></i></button>
  </div>`;
}

function tabbar() {
  const n = state.items.filter((i) => i.on_list).length;
  const e = expiringSoon();
  const tabs = [
    ['spesa', 'ti-shopping-cart', 'Spesa', n],
    ['scorte', 'ti-box', 'Scorte', 0],
    ['scadenze', 'ti-calendar-due', 'Scadenze', e],
    ['aggiungi', 'ti-circle-plus', 'Aggiungi', 0],
  ];
  return `<nav class="tabbar">${tabs.map(([k, icon, label, badge]) => `
    <button class="tab ${ui.tab === k ? 'on' : ''}" data-act="tab" data-v="${k}">
      <i class="ti ${icon}"></i>${label}${badge ? `<span class="badge">${badge}</span>` : ''}
    </button>`).join('')}</nav>`;
}

function empty(icon, title, text, cta, ctaAct, ctaV = '') {
  return `<div class="empty"><i class="ti ${icon}"></i><h3>${title}</h3><p>${text}</p>
    ${cta ? `<button class="btn primary" data-act="${ctaAct}" data-v="${ctaV}">${cta}</button>` : ''}</div>`;
}

function swRow(it, { left = '', right = '', sub = '', subCls = '', actions = [] }) {
  return `<div class="sw" data-id="${it.id}">
    <div class="sw-actions">${actions.map((a) => `<button class="${a.cls}" data-act="${a.act}"><i class="ti ${a.icon}"></i>${a.label}</button>`).join('')}</div>
    <div class="sw-row">${left}
      <div class="nm" data-act="open">${esc(it.name)}${sub ? `<small class="${subCls}">${sub}</small>` : ''}</div>${right}
    </div>
  </div>`;
}

function groupBlock(g, rowFn) {
  return `<section class="group" ${cStyle(g.cat)}>
    <div class="group-h"><span class="sq"></span>${esc(g.cat.name)}<span class="n">${g.items.length}</span></div>
    ${g.items.map(rowFn).join('')}
  </section>`;
}

const statusOrder = { out: 0, low: 1, ok: 2 };
const byUrgency = (a, b) => statusOrder[a.status] - statusOrder[b.status] || a.name.localeCompare(b.name, 'it');
const byName = (a, b) => a.name.localeCompare(b.name, 'it');

// ---------- Schermate ----------

function viewSpesa() {
  const list = state.items.filter((i) => i.on_list);
  const stores = S.sortedStores().map((s) => ({ s, n: list.filter((i) => i.store_id === s.id).length })).filter((x) => x.n);
  if (ui.store !== 'all' && !stores.some((x) => x.s.id === ui.store)) ui.store = 'all';
  const shown = ui.store === 'all' ? list : list.filter((i) => i.store_id === ui.store);

  const head = header('Da prendere', `${plural(list.length, 'cosa', 'cose')} · ${esc(state.household.name)}`);
  if (!list.length) {
    return { head, body: empty('ti-circle-check', 'Non manca niente', 'Quando qualcosa finisce, aggiungilo qui o segnalo con uno swipe nelle Scorte.', 'Aggiungi qualcosa', 'tab', 'aggiungi') };
  }
  const chips = stores.length > 1 ? `<div class="chips">
    <button class="chip ${ui.store === 'all' ? 'on' : ''}" data-act="store" data-v="all">Tutto</button>
    ${stores.map(({ s, n }) => `<button class="chip ${ui.store === s.id ? 'on' : ''}" data-act="store" data-v="${s.id}">${esc(s.name)}<span class="n">${n}</span></button>`).join('')}
  </div>` : '';

  const row = (it) => swRow(it, {
    left: '<button class="cb" data-act="bought" aria-label="Comprato"></button>',
    sub: it.status === 'out' ? 'finito' : '',
    subCls: 'out',
    right: S.isTracked(it) ? `<span class="meta">x${fmt(it.buy_qty)}${it.unit ? ` ${esc(it.unit)}` : ''}</span>` : '',
    actions: [
      ...(it.status !== 'out' ? [{ act: 'urgent', label: 'Finito', cls: 'a-danger', icon: 'ti-alert-circle' }] : []),
      { act: 'unlist', label: 'Togli', cls: 'a-gray', icon: 'ti-x' },
    ],
  });
  const body = chips + groupByCategory(shown).map((g) => groupBlock({ ...g, items: g.items.sort(byUrgency) }, row)).join('');
  return { head, body };
}

function scorteMeta(it) {
  if (S.isTracked(it)) {
    const text = it.min_qty !== null && it.min_qty !== undefined ? `${fmt(it.qty)} / ${fmt(it.min_qty)}` : `${fmt(it.qty)}${it.unit ? ` ${esc(it.unit)}` : ''}`;
    return `<span class="meta ${it.status}">${text}</span>`;
  }
  const text = { ok: '', low: 'sta finendo', out: 'finito' }[it.status];
  return text ? `<span class="meta ${it.status}">${text}</span>` : '';
}

const STATUS_ACTIONS = {
  ok: { act: 'st-ok', label: 'C\'è', cls: 'a-ok', icon: 'ti-check' },
  low: { act: 'st-low', label: 'Sta finendo', cls: 'a-warn', icon: 'ti-hourglass-low' },
  out: { act: 'st-out', label: 'Finito', cls: 'a-danger', icon: 'ti-alert-circle' },
};

function viewScorte() {
  const all = state.items;
  const q = S.normalize(ui.scorteQ);
  const items = q ? all.filter((i) => S.normalize(i.name).includes(q)) : all;
  const toBuy = all.filter((i) => i.status !== 'ok').length;
  const head = header('Scorte', `${plural(all.length, 'prodotto', 'prodotti')} · ${toBuy} da prendere`);
  const fixed = all.length ? `<label class="search"><i class="ti ti-search"></i><input id="scorte-q" type="search" placeholder="Cerca" autocomplete="off" value="${esc(ui.scorteQ)}"></label>` : '';
  if (!all.length) {
    return { head, fixed, body: empty('ti-box', 'Nessun prodotto', 'Aggiungi le cose che tenete in casa.', 'Nuovo prodotto', 'new') };
  }
  const row = (it) => swRow(it, {
    right: `${it.on_list ? '<i class="ti ti-shopping-cart in-list" aria-label="In lista"></i>' : ''}${scorteMeta(it)}`,
    actions: S.isTracked(it)
      ? [{ act: 'dec', label: '−1', cls: 'a-gray', icon: 'ti-minus' }, { act: 'inc', label: '+1', cls: 'a-ok', icon: 'ti-plus' }]
      : ['ok', 'low', 'out'].filter((s) => s !== it.status).map((s) => STATUS_ACTIONS[s]),
  });
  const groups = groupByCategory(items).map((g) => groupBlock({ ...g, items: g.items.sort(byName) }, row)).join('');
  const body = (groups || `<p class="hint">Nessun prodotto trovato.</p>`)
    + '<div style="margin-top:22px"><button class="btn block" data-act="new"><i class="ti ti-plus"></i>Nuovo prodotto</button></div>';
  return { head, fixed, body };
}

function viewScadenze() {
  const list = state.items.filter((i) => i.expiry).map((it) => ({ it, d: daysUntil(it.expiry) })).sort((a, b) => a.d - b.d);
  const soon = list.filter((x) => x.d <= 3).length;
  const head = header('Scadenze', list.length ? `${plural(list.length, 'prodotto', 'prodotti')} · ${soon} a breve` : 'Niente di aperto in scadenza');
  const addBtn = '<div style="margin-top:22px"><button class="btn block" data-act="pick-expiry"><i class="ti ti-calendar-plus"></i>Aggiungi una scadenza</button></div>';
  if (!list.length) {
    return { head, body: empty('ti-calendar-check', 'Nessuna scadenza', 'Segna quando scadono latte, yogurt, farmaci: ti avviso prima.', 'Aggiungi una scadenza', 'pick-expiry') };
  }
  const sections = [
    ['Scaduti', 'var(--danger)', (x) => x.d < 0],
    ['Entro 3 giorni', 'var(--warn)', (x) => x.d >= 0 && x.d <= 3],
    ['Entro una settimana', 'var(--text)', (x) => x.d > 3 && x.d <= 7],
    ['Più avanti', 'var(--muted)', (x) => x.d > 7],
  ];
  const row = ({ it, d }) => {
    const c = catOf(it);
    const cls = d <= 1 ? 'out' : d <= 3 ? 'low' : '';
    return swRow(it, {
      left: `<span class="sq" ${cStyle(c)}></span>`,
      right: `<span class="meta ${cls}">${d <= 3 ? '<i class="ti ti-flag"></i> ' : ''}${relDays(d, it.expiry)}</span>`,
      actions: [
        { act: 'consumed', label: 'Consumato', cls: 'a-ok', icon: 'ti-check' },
        { act: 'wasted', label: 'Buttato', cls: 'a-danger', icon: 'ti-trash' },
      ],
    });
  };
  const body = sections.map(([title, color, test]) => {
    const rows = list.filter(test);
    if (!rows.length) return '';
    return `<section class="group" style="--c:${color}"><div class="group-h">${title}<span class="n">${rows.length}</span></div>${rows.map(row).join('')}</section>`;
  }).join('') + addBtn;
  return { head, body };
}

function splitParts(q) {
  return q.split(/,|;|\n|\s+e\s+/i).map((s) => s.trim()).filter(Boolean);
}

function viewAggiungi() {
  const head = header('Aggiungi', 'Scrivi o detta cosa manca');
  const fixed = `<input class="big-input" id="add-q" type="text" placeholder="Es. latte, uova, carta igienica" enterkeyhint="done" autocomplete="off" autocapitalize="sentences" value="${esc(ui.addQ)}">
    <p class="hint">Separa più cose con la virgola. Puoi usare anche il microfono della tastiera.</p>`;
  return { head, fixed, body: `<div id="add-results">${addResults()}</div>` };
}

function addResults() {
  const q = ui.addQ.trim();
  const parts = splitParts(q);

  if (!q) {
    const counts = {};
    state.events.forEach((e) => { if (e.type === 'bought' || e.type === 'listed') counts[e.item_id] = (counts[e.item_id] || 0) + 1; });
    const sugg = state.items.filter((i) => !i.on_list)
      .sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0) || a.name.localeCompare(b.name, 'it'))
      .slice(0, 24);
    return `${sugg.length ? `<div class="section-h">Tocca per mettere in lista</div>
      <div class="tiles">${sugg.map((i) => `<button class="tile" data-act="tile-add" data-id="${i.id}" ${cStyle(catOf(i))}><span class="sq"></span>${esc(i.name)}</button>`).join('')}</div>` : ''}
      <div style="margin-top:22px"><button class="btn block" data-act="new"><i class="ti ti-plus"></i>Nuovo prodotto con dettagli</button></div>`;
  }

  if (parts.length > 1) {
    const rows = parts.map((p) => {
      const found = S.findByName(p);
      const c = found ? catOf(found) : S.guessCategory(p);
      const note = found ? (found.on_list ? 'già in lista' : 'lo metto in lista') : `nuovo · ${c ? esc(c.name) : 'Altro'}`;
      return `<div class="sw-row" style="padding-left:0"><span class="sq" ${cStyle(c)}></span><div class="nm">${esc(found ? found.name : capitalize(p))}<small>${note}</small></div></div>`;
    }).join('');
    return `<div class="section-h">Metto in lista</div>${rows}
      <div style="margin-top:16px"><button class="btn primary block" data-act="quick-all">Metti in lista (${parts.length})</button></div>`;
  }

  const n = S.normalize(q);
  const matches = state.items.filter((i) => S.normalize(i.name).includes(n))
    .sort((a, b) => Number(!S.normalize(a.name).startsWith(n)) - Number(!S.normalize(b.name).startsWith(n)) || byName(a, b))
    .slice(0, 20);
  const exact = state.items.some((i) => S.normalize(i.name) === n);
  const rows = matches.map((i) => {
    const c = catOf(i);
    const st = { ok: '', low: ' · sta finendo', out: ' · finito' }[i.status];
    return `<div class="sw-row" style="padding-left:0" data-id="${i.id}">
      <span class="sq" ${cStyle(c)}></span>
      <div class="nm" data-act="open">${esc(i.name)}<small>${c ? esc(c.name) : 'Altro'}${st}</small></div>
      <button class="add-btn ${i.on_list ? 'on' : ''}" data-act="toggle-list" aria-label="${i.on_list ? 'Togli dalla lista' : 'Metti in lista'}"><i class="ti ${i.on_list ? 'ti-check' : 'ti-plus'}"></i></button>
    </div>`;
  }).join('');
  const create = exact ? '' : `<button class="sw-row" style="padding-left:0;width:100%" data-act="create-from-q">
      <span class="add-btn"><i class="ti ti-plus"></i></span><div class="nm">Crea «${esc(capitalize(q))}»<small>${esc(S.guessCategory(q)?.name || 'Altro')} · premi Invio per metterlo subito in lista</small></div></button>`;
  return create + rows;
}

function viewWelcome() {
  const cloud = S.cloudConfigured;
  let body = '';
  if (ui.welcome === 'start') {
    body = `<button class="btn primary block" data-act="w-create">Crea una casa</button>
      ${cloud ? '<button class="btn block" data-act="w-join">Entra con un codice famiglia</button>'
        : '<p class="note">Il database non è ancora collegato: la casa resterà su questo telefono. Potrai condividerla con la famiglia più avanti, senza perdere niente.</p>'}`;
  } else if (ui.welcome === 'create') {
    body = `<div class="card">
        <div class="field"><label for="w-name">Nome della casa</label><input id="w-name" type="text" placeholder="Casa Borgia" autocomplete="off"></div>
        <div class="field"><label for="w-nick">Il tuo nome</label><input id="w-nick" type="text" placeholder="Fabio" autocomplete="given-name"></div>
        <div class="field"><label>Parti con 50 prodotti comuni</label><label class="switch"><input id="w-common" type="checkbox" checked><span></span></label></div>
      </div>
      <p class="error" id="w-err"></p>
      <button class="btn primary block" data-act="w-do-create">${ui.busy ? 'Un momento…' : 'Crea'}</button>
      <button class="btn block" data-act="w-back">Indietro</button>`;
  } else {
    body = `<div class="card">
        <div class="field"><label for="w-code">Codice</label><input id="w-code" type="text" placeholder="BASILICO-RICOTTA-PESCA-417" autocapitalize="characters" autocomplete="off" spellcheck="false"></div>
        <div class="field"><label for="w-nick">Il tuo nome</label><input id="w-nick" type="text" placeholder="Anna" autocomplete="given-name"></div>
      </div>
      <p class="error" id="w-err"></p>
      <button class="btn primary block" data-act="w-do-join">${ui.busy ? 'Un momento…' : 'Entra'}</button>
      <button class="btn block" data-act="w-back">Indietro</button>`;
  }
  return `<div class="welcome">
    <img class="logo" src="icons/icon-512.png" alt="">
    <h1>A'Dispensa</h1>
    <p class="lead">Le scorte di casa, condivise in famiglia.</p>
    ${body}
  </div>`;
}

// ---------- Disegno ----------

function render() {
  openRow = null;
  if (!state.household) {
    const key = `welcome-${ui.welcome}-${ui.busy}`;
    if (app.dataset.key !== key) {
      const keep = {};
      app.querySelectorAll('input[id]').forEach((el) => { keep[el.id] = el.type === 'checkbox' ? el.checked : el.value; });
      app.innerHTML = viewWelcome();
      Object.entries(keep).forEach(([id, v]) => {
        const el = document.getElementById(id);
        if (el) { if (el.type === 'checkbox') el.checked = v; else el.value = v; }
      });
      app.dataset.key = key;
    }
    return;
  }
  const view = { spesa: viewSpesa, scorte: viewScorte, scadenze: viewScadenze, aggiungi: viewAggiungi }[ui.tab] || viewSpesa;
  const { head, fixed = '', body } = view();
  const key = `tab-${ui.tab}-${fixed ? 'f' : 'n'}`;
  if (app.dataset.key === key) {
    // Aggiorno tutto tranne il campo di ricerca, così la tastiera non si chiude
    document.getElementById('v-head').innerHTML = head;
    document.getElementById('v-body').innerHTML = body;
    document.getElementById('v-tabs').innerHTML = tabbar();
  } else {
    app.innerHTML = `<main class="screen"><div id="v-head">${head}</div><div id="v-fixed">${fixed}</div><div id="v-body">${body}</div></main><div id="v-tabs">${tabbar()}</div>`;
    app.dataset.key = key;
  }
}

// ---------- Avvisi ----------

let toastTimer = null;
function toast(msg, action) {
  toastRoot.innerHTML = `<div class="toast"><span>${esc(msg)}</span>${action ? `<button data-toast>${esc(action.label)}</button>` : ''}</div>`;
  if (action) toastRoot.querySelector('[data-toast]').onclick = () => { toastRoot.innerHTML = ''; action.run(); };
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastRoot.innerHTML = ''; }, action ? 7000 : 2500);
}

// ---------- Swipe sulle righe ----------

let drag = null;
let openRow = null;
let lastSwipe = 0;
const actionsWidth = (row) => row.previousElementSibling?.offsetWidth || 0;

// I pulsanti dietro la riga restano nascosti finché non si fa lo swipe
function hideActionsLater(row) {
  setTimeout(() => { if (row !== openRow && row !== drag?.row) row.parentElement?.classList.remove('active'); }, 250);
}

function closeOpenRow() {
  if (openRow) {
    const row = openRow;
    row.style.transform = '';
    openRow = null;
    hideActionsLater(row);
  }
}

app.addEventListener('pointerdown', (e) => {
  const row = e.target.closest('.sw .sw-row');
  if (!row || e.target.closest('[data-act="bought"]')) return;
  drag = { row, x: e.clientX, y: e.clientY, base: row === openRow ? -actionsWidth(row) : 0, dx: 0, horiz: null, pid: e.pointerId };
});
app.addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.pid) return;
  const dx = e.clientX - drag.x;
  const dy = e.clientY - drag.y;
  if (drag.horiz === null) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
    drag.horiz = Math.abs(dx) > Math.abs(dy);
    if (!drag.horiz) { drag = null; return; }
    if (openRow && openRow !== drag.row) closeOpenRow();
    try { drag.row.setPointerCapture(e.pointerId); } catch { /* niente */ }
    drag.row.style.transition = 'none';
    drag.row.parentElement.classList.add('active');
  }
  const w = actionsWidth(drag.row);
  let x = drag.base + dx;
  if (x > 0) x = 0;
  if (x < -w) x = -w + (x + w) * 0.3;
  drag.dx = x;
  drag.row.style.transform = `translateX(${x}px)`;
});
function endDrag() {
  if (!drag) return;
  if (drag.horiz) {
    const w = actionsWidth(drag.row);
    drag.row.style.transition = '';
    const open = drag.dx < -w * 0.4;
    drag.row.style.transform = open ? `translateX(${-w}px)` : '';
    openRow = open ? drag.row : null;
    lastSwipe = Date.now();
    const row = drag.row;
    drag = null;
    if (!open) hideActionsLater(row);
    return;
  }
  drag = null;
}
app.addEventListener('pointerup', endDrag);
app.addEventListener('pointercancel', endDrag);

// ---------- Azioni nelle schermate ----------

app.addEventListener('click', (e) => {
  if (Date.now() - lastSwipe < 350) return;
  const el = e.target.closest('[data-act]');
  if (openRow && !e.target.closest('.sw-actions')) {
    closeOpenRow();
    if (!el || el.closest('.sw')) return;
  }
  if (!el) return;
  const id = el.closest('[data-id]')?.dataset.id;
  handle(el.dataset.act, id, el);
});

app.addEventListener('input', (e) => {
  if (e.target.id === 'add-q') {
    ui.addQ = e.target.value;
    const box = document.getElementById('add-results');
    if (box) box.innerHTML = addResults();
  } else if (e.target.id === 'scorte-q') {
    ui.scorteQ = e.target.value;
    render();
  }
});

app.addEventListener('keydown', (e) => {
  if (e.target.id !== 'add-q' || e.key !== 'Enter') return;
  e.preventDefault();
  quickAddFromInput();
});

function quickAddFromInput() {
  const parts = splitParts(ui.addQ);
  if (!parts.length) return;
  const added = S.quickAdd(parts);
  ui.addQ = '';
  const input = document.getElementById('add-q');
  if (input) input.value = '';
  const box = document.getElementById('add-results');
  if (box) box.innerHTML = addResults();
  toast(added.length === 1 ? `${added[0]} in lista` : `${added.length} cose in lista`);
}

function itemName(id) { return S.byId('items', id)?.name || ''; }

async function handle(act, id, el) {
  switch (act) {
    case 'tab':
      ui.tab = el.dataset.v; setPref('tab', ui.tab); render(); window.scrollTo(0, 0); break;
    case 'settings': openSettings(); break;
    case 'store': ui.store = el.dataset.v; render(); break;
    case 'bought': {
      el.classList.add('on');
      el.style.setProperty('--c', getComputedStyle(el.closest('.group')).getPropertyValue('--c'));
      el.innerHTML = '<i class="ti ti-check"></i>';
      const name = itemName(id);
      setTimeout(() => {
        const token = S.markBought(id);
        toast(`${name} comprato`, { label: 'Annulla', run: () => S.undoBought(token) });
      }, 280);
      break;
    }
    case 'urgent': S.setStatus(id, 'out'); break;
    case 'unlist': {
      const before = { ...S.byId('items', id) };
      S.removeFromList(id);
      toast(`${before.name} tolto dalla lista`, { label: 'Annulla', run: () => { S.addToList(id); if (before.status === 'out') S.setStatus(id, 'out'); } });
      break;
    }
    case 'open': openItem(id); break;
    case 'dec': S.adjustQty(id, -1); break;
    case 'inc': S.adjustQty(id, 1); break;
    case 'st-ok': S.setStatus(id, 'ok'); break;
    case 'st-low': S.setStatus(id, 'low'); toast(`${itemName(id)} in lista`); break;
    case 'st-out': S.setStatus(id, 'out'); toast(`${itemName(id)} in lista`); break;
    case 'consumed': S.clearExpiry(id, false); break;
    case 'wasted': S.clearExpiry(id, true); break;
    case 'new': openItem(null); break;
    case 'pick-expiry': openExpiryPicker(); break;
    case 'tile-add': S.addToList(id); toast(`${itemName(id)} in lista`); break;
    case 'toggle-list': {
      const it = S.byId('items', id);
      if (it.on_list) S.removeFromList(id); else { S.addToList(id); toast(`${it.name} in lista`); }
      const box = document.getElementById('add-results');
      if (box) box.innerHTML = addResults();
      break;
    }
    case 'create-from-q': {
      const name = capitalize(ui.addQ.trim());
      openItem(null, { name, on_list: true, status: 'low' });
      break;
    }
    case 'quick-all': quickAddFromInput(); break;
    case 'w-create': ui.welcome = 'create'; render(); document.getElementById('w-name')?.focus(); break;
    case 'w-join': ui.welcome = 'join'; render(); document.getElementById('w-code')?.focus(); break;
    case 'w-back': ui.welcome = 'start'; render(); break;
    case 'w-do-create': await doCreate(); break;
    case 'w-do-join': await doJoin(); break;
    default: break;
  }
}

async function doCreate() {
  if (ui.busy) return;
  const name = document.getElementById('w-name').value.trim() || 'Casa';
  const nickname = document.getElementById('w-nick').value.trim();
  const withCommon = document.getElementById('w-common').checked;
  const err = document.getElementById('w-err');
  if (!nickname) { err.textContent = 'Scrivi il tuo nome, così la famiglia sa chi ha segnato cosa.'; return; }
  ui.busy = true; render();
  try {
    await S.createHousehold({ name, nickname, withCommon, cloud: S.cloudConfigured });
    ui.busy = false; ui.tab = withCommon ? 'scorte' : 'aggiungi'; setPref('tab', ui.tab);
    render();
    toast(`Benvenuto in ${name}`);
  } catch (e) {
    ui.busy = false; render();
    document.getElementById('w-err').textContent = e.message;
  }
}

async function doJoin() {
  if (ui.busy) return;
  const code = document.getElementById('w-code').value.trim();
  const nickname = document.getElementById('w-nick').value.trim();
  const err = document.getElementById('w-err');
  if (!code || !nickname) { err.textContent = 'Servono il codice e il tuo nome.'; return; }
  ui.busy = true; render();
  try {
    await S.joinHousehold({ code, nickname });
    ui.busy = false; ui.tab = 'spesa'; setPref('tab', 'spesa');
    render();
    toast(`Sei entrato in ${state.household.name}`);
  } catch (e) {
    ui.busy = false; render();
    document.getElementById('w-err').textContent = e.message;
  }
}

// ---------- Fogli (schede che salgono dal basso) ----------

let sheet = null;

function showSheet(s) {
  sheet = s;
  sheetRoot.innerHTML = `<div class="sheet-bg"><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div><div id="sheet-body">${s.render()}</div></div></div>`;
  s.mount?.();
}
function refreshSheet() {
  if (!sheet) return;
  document.getElementById('sheet-body').innerHTML = sheet.render();
  sheet.mount?.();
}
function closeSheet() {
  sheet = null;
  sheetRoot.innerHTML = '';
}

sheetRoot.addEventListener('click', (e) => {
  if (e.target.classList.contains('sheet-bg')) { closeSheet(); return; }
  const el = e.target.closest('[data-act]');
  if (!el || !sheet) return;
  if (el.dataset.act === 'close') { closeSheet(); return; }
  sheet.click?.(el.dataset.act, el, el.closest('[data-id]')?.dataset.id);
});
sheetRoot.addEventListener('input', (e) => sheet?.input?.(e.target));
sheetRoot.addEventListener('change', (e) => sheet?.change?.(e.target));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet) closeSheet(); });

// Scheda prodotto (nuovo o esistente)
function openItem(id, preset = {}) {
  const existing = id ? S.byId('items', id) : null;
  if (id && !existing) return;
  const { focus, ...data } = preset;
  const d = existing ? { ...existing } : S.newItemRow(data);
  if (!existing && !d.category_id) {
    const c = d.name ? S.guessCategory(d.name) : S.sortedCategories()[0];
    d.category_id = c?.id ?? null;
    d.store_id = S.guessStore(c)?.id ?? null;
  }

  const statsCard = () => {
    const st = S.itemStats(d.id);
    const max = Math.max(1, ...st.months.map((m) => m.count));
    const learn = st.learned
      ? `Di solito lo ricompri ogni ~${st.interval} giorni`
      : `Sto imparando · ${Math.min(st.buys, 3)} di 3 riacquisti${st.days ? ` · ${plural(st.days, 'giorno', 'giorni')} di dati` : ''}`;
    return `<div class="card" ${cStyle(S.byId('categories', d.category_id))}>
      <div class="pick-label">Consumo negli ultimi 6 mesi</div>
      <div class="bars">${st.months.map((m) => `<div><i style="height:${Math.max(6, (m.count / max) * 70)}%"></i><span>${m.label}</span></div>`).join('')}</div>
      <div class="learn"><i class="ti ti-sparkles"></i>${learn}</div>
    </div>`;
  };

  const s = {
    render() {
      const tracked = S.isTracked(d);
      const cur = existing ? S.byId('items', d.id) || existing : null;
      const by = cur?.updated_at ? `Modificato ${S.memberName(cur.updated_by) ? `da ${esc(S.memberName(cur.updated_by))} ` : ''}${timeAgo(cur.updated_at)}` : '';
      const pill = cur ? `<span class="pill ${cur.status}">${{ ok: 'c\'è', low: 'sta finendo', out: 'finito' }[cur.status]}</span>${cur.on_list ? '<span class="pill">in lista</span>' : ''}` : '';
      return `<div class="sheet-top"><button class="link" data-act="close">Annulla</button><button class="link" data-act="save">${existing ? 'Salva' : 'Aggiungi'}</button></div>
        <input class="name-input" id="i-name" data-f="name" type="text" placeholder="Nome prodotto" autocomplete="off" value="${esc(d.name)}">
        ${cur ? `<div class="sub">${pill}<span>${by}</span></div>` : ''}
        <div class="card"><div class="pick-label">Categoria</div><div class="pick">
          ${S.sortedCategories().map((c) => `<button class="${c.id === d.category_id ? 'on' : ''}" data-act="cat" data-v="${c.id}" ${cStyle(c)}><span class="sq"></span>${esc(c.name)}</button>`).join('')}
        </div></div>
        <div class="card"><div class="pick-label">Dove si compra</div><div class="pick">
          ${S.sortedStores().map((st) => `<button class="${st.id === d.store_id ? 'on' : ''}" data-act="store" data-v="${st.id}">${esc(st.name)}</button>`).join('')}
        </div></div>
        <div class="card">
          <div class="field"><label>Conto le quantità</label><label class="switch"><input type="checkbox" data-f="tracked" ${tracked ? 'checked' : ''}><span></span></label></div>
          ${tracked ? `
            <div class="field"><label>In casa</label><div class="stepper"><button data-act="qminus" aria-label="Meno">−</button><b id="i-qty">${fmt(d.qty)}</b><button data-act="qplus" aria-label="Più">+</button></div></div>
            <div class="field"><label>Soglia minima</label><input type="text" inputmode="decimal" data-f="min_qty" value="${fmt(d.min_qty)}" placeholder="nessuna"></div>
            <div class="field"><label>Ne compro di solito</label><input type="text" inputmode="decimal" data-f="buy_qty" value="${fmt(d.buy_qty)}"></div>
            <div class="field"><label>Unità</label><input type="text" data-f="unit" list="units" value="${esc(d.unit || '')}" placeholder="pz, bott., kg"></div>`
            : '<p class="note" style="padding:0 0 10px">Lo segni tu con uno swipe nelle Scorte: c\'è, sta finendo, finito.</p>'}
        </div>
        <div class="card">
          <div class="field"><label>Scadenza</label><input type="date" id="i-exp" data-f="expiry" value="${d.expiry || ''}"></div>
          ${d.expiry ? '<div class="field"><span></span><button class="link" data-act="no-exp">Togli scadenza</button></div>' : ''}
          <div class="field"><textarea data-f="notes" placeholder="Note: marca, formato…">${esc(d.notes || '')}</textarea></div>
        </div>
        ${existing ? statsCard() : ''}
        ${existing ? `<button class="btn primary block" data-act="list-toggle">${cur?.on_list ? 'Togli dalla lista' : 'Metti in lista'}</button>
          <button class="btn danger block" data-act="delete">Elimina prodotto</button>` : ''}
        <datalist id="units"><option value="pz"><option value="conf."><option value="bott."><option value="pacchi"><option value="kg"><option value="g"><option value="l"><option value="rotoli"><option value="scatolette"></datalist>`;
    },
    click(act, el) {
      if (act === 'cat') { d.category_id = el.dataset.v; refreshSheet(); }
      else if (act === 'store') { d.store_id = d.store_id === el.dataset.v ? null : el.dataset.v; refreshSheet(); }
      else if (act === 'qminus' || act === 'qplus') {
        d.qty = Math.max(0, (d.qty || 0) + (act === 'qplus' ? 1 : -1));
        document.getElementById('i-qty').textContent = fmt(d.qty);
      } else if (act === 'no-exp') { d.expiry = null; refreshSheet(); }
      else if (act === 'save') save();
      else if (act === 'list-toggle') {
        if (!save(true)) return;
        const it = S.byId('items', d.id);
        if (it.on_list) S.removeFromList(d.id); else S.addToList(d.id);
        closeSheet();
        toast(it.on_list ? `${it.name} tolto dalla lista` : `${it.name} in lista`);
      } else if (act === 'delete') {
        // eslint-disable-next-line no-alert
        if (window.confirm(`Eliminare ${d.name}? Si perde anche lo storico dei consumi.`)) {
          S.deleteItem(d.id);
          closeSheet();
          toast(`${d.name} eliminato`);
        }
      }
    },
    input(el) {
      const f = el.dataset.f;
      if (!f || f === 'tracked') return;
      if (f === 'min_qty' || f === 'buy_qty') d[f] = parseNum(el.value);
      else if (f === 'expiry') d.expiry = el.value || null;
      else d[f] = el.value;
    },
    change(el) {
      if (el.dataset.f === 'tracked') {
        if (el.checked) {
          d.qty = d.status === 'ok' ? 1 : 0;
          if (d.min_qty === null || d.min_qty === undefined) d.min_qty = 1;
        } else {
          d.qty = null;
        }
        refreshSheet();
      } else if (el.dataset.f === 'expiry') {
        d.expiry = el.value || null;
        refreshSheet();
      }
    },
    mount() {
      if (focus === 'expiry') document.getElementById('i-exp')?.focus();
      else if (!existing && !d.name) document.getElementById('i-name')?.focus();
    },
  };

  function save(silent) {
    d.name = (d.name || '').trim();
    if (!d.name) {
      const n = document.getElementById('i-name');
      n.focus();
      n.placeholder = 'Scrivi il nome';
      return false;
    }
    if (S.isTracked(d) && (d.buy_qty === null || d.buy_qty <= 0)) d.buy_qty = 1;
    if (!S.isTracked(d) && !d.buy_qty) d.buy_qty = 1;
    S.saveItem(d);
    if (!silent) {
      closeSheet();
      toast(existing ? 'Salvato' : `${d.name} aggiunto${d.on_list ? ' in lista' : ''}`);
      if (!existing && ui.tab === 'aggiungi') {
        ui.addQ = '';
        const input = document.getElementById('add-q');
        if (input) input.value = '';
        render();
        const box = document.getElementById('add-results');
        if (box) box.innerHTML = addResults();
      }
    }
    return true;
  }

  showSheet(s);
}

// Scelta del prodotto a cui aggiungere una scadenza
function openExpiryPicker() {
  let q = '';
  const list = () => {
    const n = S.normalize(q);
    return state.items.filter((i) => !n || S.normalize(i.name).includes(n)).sort(byName).slice(0, 40)
      .map((i) => `<button class="row-link" data-act="pick" data-id="${i.id}"><span class="sq" ${cStyle(catOf(i))}></span><span class="grow">${esc(i.name)}</span>${i.expiry ? `<span class="meta">${relDays(daysUntil(i.expiry), i.expiry)}</span>` : ''}<i class="ti ti-chevron-right"></i></button>`).join('');
  };
  showSheet({
    render: () => `<div class="sheet-top"><span></span><button class="link" data-act="close">Chiudi</button></div>
      <h2>Che cosa scade?</h2>
      <label class="search" style="margin-top:10px"><i class="ti ti-search"></i><input id="pick-q" type="search" placeholder="Cerca un prodotto" autocomplete="off"></label>
      <div class="card" id="pick-list">${list()}</div>`,
    input(el) { if (el.id === 'pick-q') { q = el.value; document.getElementById('pick-list').innerHTML = list(); } },
    click(act, el, id) { if (act === 'pick') openItem(id, { focus: 'expiry' }); },
  });
}

// Impostazioni
function openSettings() {
  const cloud = state.mode === 'cloud';
  showSheet({
    render() {
      const cats = S.sortedCategories();
      const stores = S.sortedStores();
      const count = (key, id) => state.items.filter((i) => i[key] === id).length;
      const share = cloud
        ? `<div class="pick-label">Codice famiglia</div>
          <div class="card">
            <div class="code">${esc(state.household.code)}</div>
            <p class="note" style="padding:0 0 8px">Chi inserisce questo codice entra nella vostra casa e vede tutto. Dallo solo ai familiari.</p>
            <div class="field"><button class="link" data-act="share"><i class="ti ti-share"></i> Condividi il codice</button></div>
          </div>
          <div class="pick-label">In famiglia</div>
          <div class="card">${state.members.map((m) => `<div class="field"><span>${esc(m.nickname || 'Senza nome')}${m.user_id === state.me.id ? ' (tu)' : ''}</span></div>`).join('')}</div>`
        : `<div class="pick-label">Condivisione</div>
          <div class="card"><p class="note" style="padding:12px 0 6px">Questa casa è salvata solo su questo telefono.</p>
          ${S.cloudConfigured
            ? `<div class="field"><button class="link" data-act="migrate"><i class="ti ti-users"></i> ${ui.busy ? 'Un momento…' : 'Condividi con la famiglia'}</button></div>`
            : '<p class="note" style="padding:0 0 10px">Per condividerla va prima collegato il database (vedi il file LEGGIMI).</p>'}
          </div>`;
      return `<div class="sheet-top"><span></span><button class="link" data-act="close">Fine</button></div>
        <h2>Impostazioni</h2>
        <div class="pick-label">Casa</div>
        <div class="card">
          <div class="field"><label for="s-house">Nome</label><input id="s-house" type="text" data-f="house" value="${esc(state.household.name)}"></div>
          <div class="field"><label for="s-nick">Il tuo nome</label><input id="s-nick" type="text" data-f="nick" value="${esc(state.me.nickname)}"></div>
        </div>
        ${share}
        <div class="pick-label">Categorie</div>
        <div class="card">
          ${cats.map((c) => `<button class="row-link" data-act="edit-cat" data-id="${c.id}" ${cStyle(c)}><span class="sq"></span><span class="grow">${esc(c.name)}</span><span class="meta">${count('category_id', c.id)}</span><i class="ti ti-chevron-right"></i></button>`).join('')}
          <button class="row-link" data-act="new-cat"><i class="ti ti-plus"></i><span class="grow">Nuova categoria</span></button>
        </div>
        <div class="pick-label">Negozi</div>
        <div class="card">
          ${stores.map((st) => `<button class="row-link" data-act="edit-store" data-id="${st.id}"><i class="ti ti-building-store"></i><span class="grow">${esc(st.name)}</span><span class="meta">${count('store_id', st.id)}</span><i class="ti ti-chevron-right"></i></button>`).join('')}
          <button class="row-link" data-act="new-store"><i class="ti ti-plus"></i><span class="grow">Nuovo negozio</span></button>
        </div>
        <div class="pick-label">Dati</div>
        <div class="card">
          ${cloud ? `<button class="row-link" data-act="sync"><i class="ti ti-refresh"></i><span class="grow">Sincronizza ora</span><span class="meta">${state.lastSync ? timeAgo(state.lastSync) : ''}</span></button>` : ''}
          <button class="row-link" data-act="export"><i class="ti ti-download"></i><span class="grow">Esporta un backup</span></button>
        </div>
        ${cloud && sync.status === 'error' ? `<p class="note">${esc(syncLabel())}</p>` : ''}
        <button class="btn danger block" data-act="leave">Esci da questa casa</button>
        <p class="note" style="text-align:center">A'Dispensa · fase 1</p>`;
    },
    async change(el) {
      try {
        if (el.dataset.f === 'house' && el.value.trim()) { await S.renameHousehold(el.value.trim()); toast('Nome della casa salvato'); }
        if (el.dataset.f === 'nick' && el.value.trim()) { await S.setNickname(el.value.trim()); toast('Nome salvato'); }
      } catch (e) { toast(e.message); }
    },
    async click(act, el, id) {
      if (act === 'edit-cat' || act === 'new-cat') {
        const c = id ? S.byId('categories', id) : null;
        openNamed({
          title: c ? 'Categoria' : 'Nuova categoria', name: c?.name, color: c?.color || 'gray', withColor: true,
          onSave: ({ name, color }) => S.saveCategory({ ...(c ? { id: c.id } : {}), name, color }),
          onDelete: c ? () => S.deleteCategory(c.id) : null,
          deleteText: c ? `Eliminare ${c.name}? I prodotti restano, finiscono in "Altro".` : '',
        });
      } else if (act === 'edit-store' || act === 'new-store') {
        const st = id ? S.byId('stores', id) : null;
        openNamed({
          title: st ? 'Negozio' : 'Nuovo negozio', name: st?.name,
          onSave: ({ name }) => S.saveStore({ ...(st ? { id: st.id } : {}), name }),
          onDelete: st ? () => S.deleteStore(st.id) : null,
          deleteText: st ? `Eliminare ${st.name}? I prodotti restano senza negozio.` : '',
        });
      } else if (act === 'share') {
        const text = `Entra nella nostra dispensa "${state.household.name}" su A'Dispensa.\nCodice famiglia: ${state.household.code}\n${location.origin}${location.pathname}`;
        try {
          if (navigator.share) await navigator.share({ title: "A'Dispensa", text });
          else { await navigator.clipboard.writeText(text); toast('Codice copiato'); }
        } catch { /* condivisione annullata */ }
      } else if (act === 'migrate') {
        if (ui.busy) return;
        ui.busy = true; refreshSheet();
        try {
          await S.migrateToCloud();
          ui.busy = false;
          openSettings();
          toast('Fatto: ora puoi condividere il codice');
        } catch (e) {
          ui.busy = false; refreshSheet();
          toast(e.message);
        }
      } else if (act === 'sync') {
        await S.syncNow();
        refreshSheet();
        toast(sync.status === 'ok' ? 'Tutto aggiornato' : syncLabel());
      } else if (act === 'export') {
        const blob = new Blob([S.exportData()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `adispensa-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      } else if (act === 'leave') {
        const msg = cloud
          ? 'Uscire da questa casa? Potrai rientrare con il codice famiglia.'
          : 'Uscire? La casa è solo su questo telefono: tutti i dati verranno cancellati.';
        // eslint-disable-next-line no-alert
        if (!window.confirm(msg)) return;
        try { await S.leaveHousehold(); } catch (e) { toast(e.message); return; }
        closeSheet();
        ui.welcome = 'start';
        render();
      }
    },
  });
}

function openNamed({ title, name = '', color = 'gray', withColor = false, onSave, onDelete, deleteText }) {
  let n = name || '';
  let col = color;
  showSheet({
    render: () => `<div class="sheet-top"><button class="link" data-act="back">Indietro</button><button class="link" data-act="save">Salva</button></div>
      <h2>${title}</h2>
      <div class="card"><div class="field"><input id="n-name" type="text" placeholder="Nome" style="text-align:left" value="${esc(n)}" autocomplete="off"></div></div>
      ${withColor ? `<div class="card"><div class="pick-label">Colore</div><div class="swatches">${COLORS.map((k) => `<button class="${k === col ? 'on' : ''}" data-act="color" data-v="${k}" style="--c:${colorVar(k)}" aria-label="${k}"></button>`).join('')}</div></div>` : ''}
      ${onDelete ? '<button class="btn danger block" data-act="del">Elimina</button>' : ''}`,
    input(el) { if (el.id === 'n-name') n = el.value; },
    click(act, el) {
      if (act === 'color') { col = el.dataset.v; refreshSheet(); }
      else if (act === 'back') openSettings();
      else if (act === 'save') {
        if (!n.trim()) { document.getElementById('n-name').focus(); return; }
        onSave({ name: n.trim(), color: col });
        openSettings();
      } else if (act === 'del') {
        // eslint-disable-next-line no-alert
        if (window.confirm(deleteText)) { onDelete(); openSettings(); }
      }
    },
    mount() { if (!name) document.getElementById('n-name')?.focus(); },
  });
}

// ---------- Avvio ----------

S.subscribe(render);
S.init();
render();

if ('serviceWorker' in navigator && !new URLSearchParams(location.search).has('nosw')) {
  navigator.serviceWorker.register('sw.js').catch(() => { /* niente offline, pazienza */ });
}
