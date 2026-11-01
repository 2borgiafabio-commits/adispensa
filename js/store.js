// Stato dell'app, regole delle scorte e sincronizzazione con Supabase.
// I dati vivono sempre anche sul telefono (localStorage): l'app funziona offline
// e manda le modifiche al database appena c'è rete.

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';
import { DEFAULT_CATEGORIES, DEFAULT_STORES, COMMON_ITEMS, CATEGORY_HINTS, CODE_WORDS } from './seed.js';

const LS_KEY = 'adispensa.v1';
const SUPABASE_JS = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
const DAY = 864e5;

export const cloudConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const COLUMNS = {
  categories: ['id', 'household_id', 'name', 'color', 'sort', 'updated_at'],
  stores: ['id', 'household_id', 'name', 'sort', 'updated_at'],
  items: ['id', 'household_id', 'name', 'category_id', 'store_id', 'unit', 'qty', 'min_qty', 'buy_qty',
    'status', 'on_list', 'expiry', 'notes', 'updated_at', 'updated_by'],
  events: ['id', 'household_id', 'item_id', 'type', 'qty', 'at', 'by_user'],
};

const emptyState = () => ({
  household: null,          // { id, name, code }
  me: { id: null, nickname: '' },
  mode: 'local',            // 'local' = solo questo telefono, 'cloud' = condiviso
  categories: [], stores: [], items: [], events: [], members: [],
  queue: [],                // modifiche da mandare al database
  lastSync: null,
});

export const state = load();
export const sync = { status: state.mode === 'cloud' ? 'pending' : 'local', error: null };

const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function emit() { save(); listeners.forEach((fn) => fn()); }

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(LS_KEY));
    if (saved) return Object.assign(emptyState(), saved);
  } catch { /* storage non disponibile */ }
  return emptyState();
}
function save() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* storage pieno o bloccato */ }
}

export function uid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
const nowIso = () => new Date().toISOString();
const pick = (table, row) => Object.fromEntries(COLUMNS[table].map((k) => [k, row[k] ?? null]));

export function makeCode() {
  const r = crypto.getRandomValues(new Uint32Array(4));
  const w = (i) => CODE_WORDS[r[i] % CODE_WORDS.length];
  return `${w(0)}-${w(1)}-${w(2)}-${String(r[3] % 1000).padStart(3, '0')}`;
}

export function normalize(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

// ---------- Lettura ----------

export const isTracked = (it) => it.qty !== null && it.qty !== undefined;
export const byId = (table, id) => state[table].find((r) => r.id === id) || null;
export const sortedCategories = () => [...state.categories].sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));
export const sortedStores = () => [...state.stores].sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name));

export function memberName(userId) {
  if (!userId) return null;
  if (userId === state.me.id) return 'te';
  return state.members.find((m) => m.user_id === userId)?.nickname || 'un familiare';
}

// Sceglie la categoria con la parola chiave più lunga trovata nel nome.
// Le parole corte (es. "tè") contano solo se sono una parola intera, non un pezzo di "crocchette".
export function guessCategory(name) {
  const n = normalize(name);
  const words = n.split(/[^a-z0-9]+/);
  let best = null;
  let bestLen = 0;
  for (const [key, hints] of Object.entries(CATEGORY_HINTS)) {
    for (const h of hints.map(normalize)) {
      const hit = h.length <= 3 ? words.includes(h) : n.includes(h);
      if (hit && h.length > bestLen) { best = key; bestLen = h.length; }
    }
  }
  if (best) {
    const def = DEFAULT_CATEGORIES.find((c) => c.key === best);
    const cat = state.categories.find((c) => normalize(c.name) === normalize(def.name));
    if (cat) return cat;
  }
  return state.categories.find((c) => normalize(c.name) === 'casa') || sortedCategories()[0] || null;
}

export function guessStore(category) {
  const stores = sortedStores();
  if (category && normalize(category.name) === 'farmaci') {
    const f = stores.find((s) => normalize(s.name) === 'farmacia');
    if (f) return f;
  }
  return stores[0] || null;
}

export function itemStats(itemId) {
  const evs = state.events.filter((e) => e.item_id === itemId);
  const buys = evs.filter((e) => e.type === 'bought').map((e) => new Date(e.at).getTime()).sort((a, b) => a - b);
  const first = evs.length ? Math.min(...evs.map((e) => new Date(e.at).getTime())) : null;
  const days = first ? Math.floor((Date.now() - first) / DAY) : 0;

  const months = [];
  const d = new Date();
  for (let i = 5; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() - i + 1, 1);
    const count = evs.filter((e) => {
      const t = new Date(e.at);
      return (e.type === 'bought' || e.type === 'used') && t >= m && t < next;
    }).length;
    months.push({ label: m.toLocaleDateString('it-IT', { month: 'short' }), count });
  }

  // La previsione si sblocca solo con abbastanza storia: almeno 3 riacquisti in almeno 60 giorni
  const learned = buys.length >= 3 && days >= 60;
  let interval = null;
  if (learned) {
    const gaps = buys.slice(1).map((t, i) => (t - buys[i]) / DAY).sort((a, b) => a - b);
    interval = Math.round(gaps[Math.floor(gaps.length / 2)]);
  }
  return { buys: buys.length, days, months, learned, interval };
}

// ---------- Scrittura (locale subito, database appena possibile) ----------

function upsertLocal(table, row) {
  const arr = state[table];
  const i = arr.findIndex((r) => r.id === row.id);
  if (i >= 0) arr[i] = row; else arr.push(row);
}

function enqueue(op) {
  if (state.mode !== 'cloud') return;
  if (op.op === 'upsert') {
    // Se c'è già una modifica in attesa per la stessa riga, la aggiorno al suo posto (mantiene l'ordine)
    const j = state.queue.findIndex((o) => o.op === 'upsert' && o.table === op.table && o.row.id === op.row.id);
    if (j >= 0) { state.queue[j] = op; return; }
  } else {
    state.queue = state.queue.filter((o) => !(o.table === op.table && o.row?.id === op.id));
  }
  state.queue.push(op);
}

function put(table, row) {
  if (table !== 'events') row.updated_at = nowIso();
  if (table === 'items') row.updated_by = state.me.id;
  upsertLocal(table, row);
  enqueue({ table, op: 'upsert', row: pick(table, row) });
}

function remove(table, id) {
  state[table] = state[table].filter((r) => r.id !== id);
  enqueue({ table, op: 'delete', id });
}

function log(item, type, qty = null) {
  const e = {
    id: uid(), household_id: state.household.id, item_id: item ? item.id : null,
    type, qty, at: nowIso(), by_user: state.me.id,
  };
  put('events', e);
  return e;
}

function commit() { emit(); scheduleFlush(); }

function computeStatus(it) {
  if (!isTracked(it)) return it.status;
  if (it.qty <= 0) return 'out';
  if (it.min_qty !== null && it.min_qty !== undefined && it.qty <= it.min_qty) return 'low';
  return 'ok';
}

// Ricalcola lo stato e, se un prodotto scende sotto soglia, lo mette in lista da solo
function refreshStatus(it, prevStatus) {
  it.status = computeStatus(it);
  if (it.status !== prevStatus && it.status !== 'ok') {
    it.on_list = true;
    log(it, it.status);
  }
}

export function newItemRow(data = {}) {
  return {
    id: uid(), household_id: state.household.id, name: '', category_id: null, store_id: null,
    unit: null, qty: null, min_qty: null, buy_qty: 1, status: 'ok', on_list: false,
    expiry: null, notes: null, updated_at: nowIso(), updated_by: state.me.id, ...data,
  };
}

export function saveItem(draft) {
  const existing = byId('items', draft.id);
  const it = { ...(existing || newItemRow()), ...draft };
  const prev = existing ? existing.status : 'ok';
  if (existing && isTracked(existing) && isTracked(it) && it.qty !== existing.qty) {
    const delta = it.qty - existing.qty;
    log(it, delta < 0 ? 'used' : 'added', Math.abs(delta));
  }
  if (isTracked(it)) refreshStatus(it, prev);
  put('items', it);
  commit();
  return it;
}

export function deleteItem(id) {
  // Gli eventi del prodotto spariscono col prodotto (anche sul database, a cascata)
  state.queue = state.queue.filter((o) => !(o.table === 'events' && o.row?.item_id === id));
  remove('items', id);
  state.events = state.events.filter((e) => e.item_id !== id);
  commit();
}

export function adjustQty(id, delta) {
  const it = { ...byId('items', id) };
  if (!isTracked(it)) return;
  const prev = it.status;
  it.qty = Math.max(0, Math.round((it.qty + delta) * 100) / 100);
  log(it, delta < 0 ? 'used' : 'added', Math.abs(delta));
  refreshStatus(it, prev);
  put('items', it);
  commit();
}

// "Sta finendo" / "Finito" / "C'è" segnati a mano
export function setStatus(id, status) {
  const it = { ...byId('items', id) };
  if (it.status === status) return;
  if (isTracked(it)) {
    if (status === 'out') it.qty = 0;
    if (status === 'ok' && it.qty <= (it.min_qty ?? 0)) it.qty = (it.min_qty ?? 0) + (it.buy_qty || 1);
  }
  it.status = status;
  if (status !== 'ok') { it.on_list = true; log(it, status); }
  put('items', it);
  commit();
}

export function addToList(id) {
  const it = { ...byId('items', id) };
  if (it.on_list) return;
  it.on_list = true;
  if (!isTracked(it) && it.status === 'ok') it.status = 'low';
  log(it, 'listed');
  put('items', it);
  commit();
}

export function removeFromList(id) {
  const it = { ...byId('items', id) };
  it.on_list = false;
  if (!isTracked(it)) it.status = 'ok';
  log(it, 'unlisted');
  put('items', it);
  commit();
}

// Spuntato nella lista della spesa: restituisce cosa serve per annullare
export function markBought(id) {
  const before = { ...byId('items', id) };
  const it = { ...before };
  const amount = it.buy_qty || 1;
  if (isTracked(it)) {
    it.qty = Math.round((it.qty + amount) * 100) / 100;
    it.status = computeStatus(it);
  } else {
    it.status = 'ok';
  }
  it.on_list = false;
  const ev = log(it, 'bought', amount);
  put('items', it);
  commit();
  return { before, eventId: ev.id };
}

export function undoBought({ before, eventId }) {
  put('items', { ...before });
  remove('events', eventId);
  commit();
}

// Scadenze: consumato in tempo o buttato
export function clearExpiry(id, wasted) {
  const it = { ...byId('items', id) };
  const prev = it.status;
  log(it, wasted ? 'wasted' : 'consumed', 1);
  it.expiry = null;
  if (isTracked(it) && it.qty > 0) {
    it.qty = Math.max(0, it.qty - 1);
    refreshStatus(it, prev);
  }
  put('items', it);
  commit();
}

// Mette in lista più cose insieme ("latte, uova, pane"): usa i prodotti esistenti o li crea
export function quickAdd(names) {
  const added = [];
  for (const raw of names) {
    const name = raw.trim();
    if (!name) continue;
    const found = findByName(name);
    if (found) {
      addToList(found.id);
      added.push(found.name);
    } else {
      const cat = guessCategory(name);
      const store = guessStore(cat);
      const it = newItemRow({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        category_id: cat?.id ?? null, store_id: store?.id ?? null, status: 'low', on_list: true,
      });
      put('items', it);
      log(it, 'listed');
      added.push(it.name);
    }
  }
  commit();
  return added;
}

export function findByName(name) {
  const n = normalize(name);
  return state.items.find((i) => normalize(i.name) === n)
    || state.items.find((i) => normalize(i.name).startsWith(n) && n.length >= 3)
    || null;
}

// Categorie e negozi
export function saveCategory(cat) {
  const row = cat.id ? { ...byId('categories', cat.id), ...cat }
    : { id: uid(), household_id: state.household.id, sort: state.categories.length, color: 'gray', ...cat };
  put('categories', row);
  commit();
  return row;
}
export function deleteCategory(id) {
  state.items.filter((i) => i.category_id === id).forEach((i) => put('items', { ...i, category_id: null }));
  remove('categories', id);
  commit();
}
export function saveStore(store) {
  const row = store.id ? { ...byId('stores', store.id), ...store }
    : { id: uid(), household_id: state.household.id, sort: state.stores.length, ...store };
  put('stores', row);
  commit();
  return row;
}
export function deleteStore(id) {
  state.items.filter((i) => i.store_id === id).forEach((i) => put('items', { ...i, store_id: null }));
  remove('stores', id);
  commit();
}

// ---------- Casa: creazione, ingresso, uscita ----------

function seedHousehold(withCommon) {
  const catByKey = {};
  DEFAULT_CATEGORIES.forEach((c, i) => {
    const row = { id: uid(), household_id: state.household.id, name: c.name, color: c.color, sort: i };
    put('categories', row);
    catByKey[c.key] = row.id;
  });
  const storeByKey = {};
  DEFAULT_STORES.forEach((s, i) => {
    const row = { id: uid(), household_id: state.household.id, name: s.name, sort: i };
    put('stores', row);
    storeByKey[s.key] = row.id;
  });
  if (withCommon) {
    COMMON_ITEMS.forEach(([name, cat, store, unit]) => {
      put('items', newItemRow({ name, category_id: catByKey[cat], store_id: storeByKey[store], unit }));
    });
  }
}

export async function createHousehold({ name, nickname, withCommon, cloud }) {
  const household = { id: uid(), name: name.trim() || 'Casa', code: makeCode() };
  if (cloud) {
    const c = await ensureSession();
    await createHouseholdRemote(c, household, nickname);
    state.mode = 'cloud';
  } else {
    state.mode = 'local';
    state.me.id = state.me.id || uid();
  }
  Object.assign(state, { household, categories: [], stores: [], items: [], events: [], queue: [] });
  state.me.nickname = nickname.trim();
  state.members = [{ user_id: state.me.id, nickname: state.me.nickname }];
  seedHousehold(withCommon);
  commit();
  startRealtime();
}

async function createHouseholdRemote(c, household, nickname) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const { error } = await c.rpc('create_household', {
      p_id: household.id, p_name: household.name, p_code: household.code, p_nickname: nickname.trim(),
    });
    if (!error) return;
    if (error.code === '23505' && /code/i.test(error.message + error.details)) { household.code = makeCode(); continue; }
    throw friendlyError(error);
  }
  throw new Error('Non riesco a creare la casa, riprova.');
}

export async function joinHousehold({ code, nickname }) {
  const c = await ensureSession();
  const { data, error } = await c.rpc('join_household', { p_code: code.trim(), p_nickname: nickname.trim() });
  if (error) throw friendlyError(error);
  const h = data[0];
  Object.assign(state, {
    household: { id: h.id, name: h.name, code: h.code }, mode: 'cloud',
    categories: [], stores: [], items: [], events: [], members: [], queue: [],
  });
  state.me.nickname = nickname.trim();
  save();
  await pull();
  startRealtime();
}

// Porta online una casa creata in modalità prova, tenendo tutti i dati
export async function migrateToCloud() {
  const c = await ensureSession();
  const oldMe = state.me.oldId || null;
  const localId = state.members[0]?.user_id;
  await createHouseholdRemote(c, state.household, state.me.nickname || 'Io');
  const swap = (v) => (v === localId || v === oldMe ? state.me.id : v);
  state.items.forEach((i) => { i.updated_by = swap(i.updated_by); });
  state.events.forEach((e) => { e.by_user = swap(e.by_user); });
  state.mode = 'cloud';
  state.queue = [];
  ['categories', 'stores', 'items', 'events'].forEach((t) => {
    state[t].forEach((row) => state.queue.push({ table: t, op: 'upsert', row: pick(t, row) }));
  });
  state.members = [{ user_id: state.me.id, nickname: state.me.nickname }];
  emit();
  await flush();
  if (state.queue.length) throw new Error('Alcuni dati non sono ancora stati caricati: riprova con la rete.');
  await pull();
  startRealtime();
}

export async function renameHousehold(name) {
  state.household.name = name;
  emit();
  if (state.mode === 'cloud') {
    const c = await ensureSession();
    const { error } = await c.from('households').update({ name }).eq('id', state.household.id);
    if (error) throw friendlyError(error);
  }
}

export async function setNickname(nickname) {
  state.me.nickname = nickname;
  const m = state.members.find((x) => x.user_id === state.me.id);
  if (m) m.nickname = nickname;
  emit();
  if (state.mode === 'cloud') {
    const c = await ensureSession();
    const { error } = await c.from('members').update({ nickname })
      .eq('household_id', state.household.id).eq('user_id', state.me.id);
    if (error) throw friendlyError(error);
  }
}

export async function leaveHousehold() {
  if (state.mode === 'cloud' && state.household) {
    const c = await ensureSession();
    await c.from('members').delete().eq('household_id', state.household.id).eq('user_id', state.me.id);
  }
  stopRealtime();
  const me = { id: state.me.id, nickname: state.me.nickname };
  Object.assign(state, emptyState(), { me });
  emit();
}

export function exportData() {
  const { household, categories, stores, items, events } = state;
  return JSON.stringify({ exported_at: nowIso(), household, categories, stores, items, events }, null, 2);
}

// ---------- Sincronizzazione ----------

let sb = null;
async function client() {
  if (!cloudConfigured) throw new Error('Il database non è ancora collegato.');
  if (sb) return sb;
  const { createClient } = await import(SUPABASE_JS);
  sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, storageKey: 'adispensa.auth' },
  });
  return sb;
}

async function ensureSession() {
  const c = await client();
  let { data: { session } } = await c.auth.getSession();
  if (!session) {
    const { data, error } = await c.auth.signInAnonymously();
    if (error) throw friendlyError(error);
    session = data.session;
  }
  if (state.me.id && state.me.id !== session.user.id) state.me.oldId = state.me.id;
  state.me.id = session.user.id;
  return c;
}

function isNetworkError(err) {
  return !navigator.onLine || /fetch|network|load failed|timeout/i.test(String(err?.message || err));
}

function friendlyError(err) {
  const msg = String(err?.message || err);
  if (/Codice non valido/i.test(msg)) return new Error('Codice non valido. Controlla e riprova.');
  if (/anonymous sign-ins are disabled/i.test(msg)) return new Error('Su Supabase va attivato l\'accesso anonimo (Authentication → Sign In / Providers → Anonymous).');
  if (isNetworkError(err)) return new Error('Sei offline. Riprova quando c\'è rete.');
  return new Error(msg);
}

function setSync(status, error = null) {
  if (sync.status === status && sync.error === error) return;
  sync.status = status;
  sync.error = error;
  listeners.forEach((fn) => fn());
}

let flushTimer = null;
function scheduleFlush() {
  if (state.mode !== 'cloud') return;
  setSync('pending');
  clearTimeout(flushTimer);
  flushTimer = setTimeout(flush, 400);
}

let flushing = false;
export async function flush() {
  if (state.mode !== 'cloud') { setSync('local'); return; }
  if (flushing) return;
  if (!state.queue.length) { setSync('ok'); return; }
  if (!navigator.onLine) { setSync('offline'); return; }
  flushing = true;
  setSync('syncing');
  try {
    const c = await ensureSession();
    while (state.queue.length) {
      const first = state.queue[0];
      let n = 1;
      if (first.op === 'upsert') {
        while (n < state.queue.length && n < 500 && state.queue[n].op === 'upsert' && state.queue[n].table === first.table) n++;
      }
      const batch = state.queue.slice(0, n);
      const { error } = first.op === 'upsert'
        ? await c.from(first.table).upsert(batch.map((o) => o.row))
        : await c.from(first.table).delete().eq('id', first.id);
      if (error) {
        if (isNetworkError(error)) { setSync('offline'); return; }
        // Riprovo una riga alla volta e scarto solo quelle rifiutate
        if (n > 1) {
          for (const o of batch) {
            const r = await c.from(o.table).upsert(o.row);
            if (r.error && isNetworkError(r.error)) { setSync('offline'); return; }
            if (r.error) console.warn('Modifica scartata', o, r.error);
            state.queue.shift();
            save();
          }
          continue;
        }
        console.warn('Modifica scartata', first, error);
      }
      state.queue.splice(0, n);
      save();
    }
    setSync('ok');
  } catch (err) {
    setSync(isNetworkError(err) ? 'offline' : 'error', String(err.message || err));
  } finally {
    flushing = false;
  }
}

async function fetchAll(c, table, filter) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await filter(c.from(table).select('*')).order('id').range(from, from + 999);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 1000) return rows;
  }
}

export async function pull() {
  if (state.mode !== 'cloud' || !state.household) return;
  const c = await ensureSession();
  const hid = state.household.id;
  const since = new Date(Date.now() - 400 * DAY).toISOString();
  const [h, members, categories, stores, items, events] = await Promise.all([
    c.from('households').select('id,name,code').eq('id', hid).maybeSingle(),
    c.from('members').select('user_id,nickname,joined_at').eq('household_id', hid),
    fetchAll(c, 'categories', (q) => q.eq('household_id', hid)),
    fetchAll(c, 'stores', (q) => q.eq('household_id', hid)),
    fetchAll(c, 'items', (q) => q.eq('household_id', hid)),
    fetchAll(c, 'events', (q) => q.eq('household_id', hid).gte('at', since)),
  ]);
  if (h.error) throw h.error;
  if (!h.data) { setSync('error', 'Non fai più parte di questa casa.'); return; }
  Object.assign(state, { household: h.data, members: members.data || [], categories, stores, items, events });
  // Riapplico le modifiche locali non ancora inviate
  for (const op of state.queue) {
    if (op.op === 'upsert') upsertLocal(op.table, { ...op.row });
    else state[op.table] = state[op.table].filter((r) => r.id !== op.id);
  }
  state.lastSync = nowIso();
  emit();
}

let syncing = null;
export function syncNow() {
  if (state.mode !== 'cloud' || !state.household) return Promise.resolve();
  if (syncing) return syncing;
  syncing = (async () => {
    try {
      await flush();
      if (!state.queue.length) await pull();
      if (sync.status !== 'error' && !state.queue.length) setSync('ok');
    } catch (err) {
      setSync(isNetworkError(err) ? 'offline' : 'error', String(err.message || err));
    } finally {
      syncing = null;
    }
  })();
  return syncing;
}

let channel = null;
let pullTimer = null;
async function startRealtime() {
  if (state.mode !== 'cloud' || !state.household || channel) return;
  try {
    const c = await ensureSession();
    const hid = state.household.id;
    const onChange = () => { clearTimeout(pullTimer); pullTimer = setTimeout(syncNow, 800); };
    channel = c.channel(`casa-${hid}`);
    ['items', 'categories', 'stores', 'members'].forEach((table) => {
      channel.on('postgres_changes', { event: '*', schema: 'public', table, filter: `household_id=eq.${hid}` }, onChange);
    });
    channel.subscribe();
  } catch { channel = null; }
}
function stopRealtime() {
  if (channel && sb) sb.removeChannel(channel);
  channel = null;
}

export function init() {
  if (state.mode === 'cloud' && state.household) {
    syncNow();
    startRealtime();
  } else {
    setSync('local');
  }
  window.addEventListener('online', syncNow);
  window.addEventListener('offline', () => state.mode === 'cloud' && setSync('offline'));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') syncNow(); });
  setInterval(() => { if (document.visibilityState === 'visible') syncNow(); }, 60000);
}
