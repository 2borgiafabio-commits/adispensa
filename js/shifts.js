// Turni: orari di Benedetta e Fabio, ed esportazione in calendario (iCal / .ics).

// Benedetta: da lunedì a giovedì 15:30-20:30, da venerdì a domenica 15:30-23:30
export const BENNI = { name: 'Benedetta', weekday: ['15:30', '20:30'], weekend: ['15:30', '23:30'] };

// Fabio: tre turni, più riposo e ferie
export const FABIO = {
  name: 'Fabio',
  shifts: {
    E: { label: 'Early', start: '06:30', end: '14:30', color: 'amber' },
    L: { label: 'Late', start: '14:30', end: '22:30', color: 'blue' },
    N: { label: 'Night', start: '22:30', end: '06:00', color: 'purple' },
    R: { label: 'Riposo', color: 'gray' },
    F: { label: 'Ferie', color: 'green' },
  },
  cycle: [null, 'E', 'L', 'N', 'R', 'F'],
};

export const parseDay = (day) => { const [y, m, d] = day.split('-').map(Number); return new Date(y, m - 1, d); };
export const isoDay = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

// Orario di Benedetta per un giorno (con l'eventuale inizio diverso, es. 13:30)
export function benniHours(day, start) {
  const wd = parseDay(day).getDay(); // 0 = domenica
  const base = wd === 0 || wd >= 5 ? BENNI.weekend : BENNI.weekday;
  return [start || base[0], base[1]];
}

export function normalizeTime(v) {
  const m = String(v || '').trim().match(/^(\d{1,2})[.:,]?(\d{2})?$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2] || 0);
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

// ---------- iCal ----------

const TZ = [
  'BEGIN:VTIMEZONE', 'TZID:Europe/Rome',
  'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'TZNAME:CEST', 'DTSTART:19700329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'END:DAYLIGHT',
  'BEGIN:STANDARD', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'TZNAME:CET', 'DTSTART:19701025T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD',
  'END:VTIMEZONE',
];

const icsText = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const compact = (day) => day.replace(/-/g, '');
const stamp = () => new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');

// Le righe più lunghe di 75 caratteri vanno spezzate (regola del formato iCal)
function fold(line) {
  const out = [];
  let rest = line;
  while (rest.length > 74) { out.push(rest.slice(0, 74)); rest = ` ${rest.slice(74)}`; }
  out.push(rest);
  return out.join('\r\n');
}

function timedEvent(uid, day, start, end, summary) {
  const startT = start.replace(':', '');
  const endT = end.replace(':', '');
  const endDay = end <= start ? isoDay(new Date(parseDay(day).getTime() + 864e5)) : day; // turno di notte: finisce il giorno dopo
  return [
    'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${stamp()}`,
    `DTSTART;TZID=Europe/Rome:${compact(day)}T${startT}00`,
    `DTEND;TZID=Europe/Rome:${compact(endDay)}T${endT}00`,
    `SUMMARY:${icsText(summary)}`, 'END:VEVENT',
  ];
}

function allDayEvent(uid, day, summary) {
  const next = isoDay(new Date(parseDay(day).getTime() + 864e5));
  return [
    'BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${stamp()}`,
    `DTSTART;VALUE=DATE:${compact(day)}`, `DTEND;VALUE=DATE:${compact(next)}`,
    `SUMMARY:${icsText(summary)}`, 'TRANSP:TRANSPARENT', 'END:VEVENT',
  ];
}

// rows: righe dei giorni; who: { benni, fabio, plans }
export function buildIcs(rows, who) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//ADispensa//Turni//IT', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:Turni di famiglia', ...TZ];
  let count = 0;
  for (const r of rows) {
    if (who.benni && r.benni) {
      const [s, e] = benniHours(r.day, r.benni_start);
      lines.push(...timedEvent(`benni-${r.day}@adispensa`, r.day, s, e, `${BENNI.name} al lavoro`));
      count++;
    }
    const f = r.fabio && FABIO.shifts[r.fabio];
    if (who.fabio && f && r.fabio !== 'R') {
      lines.push(...(f.start
        ? timedEvent(`fabio-${r.day}@adispensa`, r.day, f.start, f.end, `${FABIO.name} · ${f.label}`)
        : allDayEvent(`fabio-${r.day}@adispensa`, r.day, `${FABIO.name} · ${f.label}`)));
      count++;
    }
    if (who.plans && r.plan) {
      lines.push(...allDayEvent(`piano-${r.day}@adispensa`, r.day, r.plan));
      count++;
    }
  }
  lines.push('END:VCALENDAR');
  return { ics: `${lines.map(fold).join('\r\n')}\r\n`, count };
}

// ---------- Turni di Fabio scritti a parole ----------
// Es. "dal 22 al 27 nov late, dal 29 al 30 anche, il 4 e 5 gen early".
// Ogni pezzo (separato da virgola o a capo) ha un turno; se manca o c'è "anche", vale quello di prima.

const MONTHS = {
  gen: 1, gennaio: 1, jan: 1, january: 1, feb: 2, febbraio: 2, february: 2, mar: 3, marzo: 3, march: 3,
  apr: 4, aprile: 4, april: 4, mag: 5, maggio: 5, may: 5, giu: 6, giugno: 6, jun: 6, june: 6,
  lug: 7, luglio: 7, jul: 7, july: 7, ago: 8, agosto: 8, aug: 8, august: 8, set: 9, sett: 9, settembre: 9, sep: 9, sept: 9, september: 9,
  ott: 10, ottobre: 10, oct: 10, october: 10, nov: 11, novembre: 11, november: 11, dic: 12, dicembre: 12, dec: 12, december: 12,
};
const SHIFT_WORDS = {
  early: 'E', mattina: 'E', mattino: 'E', mattine: 'E',
  late: 'L', pomeriggio: 'L', pomeriggi: 'L', pome: 'L',
  night: 'N', nights: 'N', notte: 'N', notti: 'N',
  riposo: 'R', riposi: 'R', libero: 'R', liberi: 'R', off: 'R',
  ferie: 'F', vacanza: 'F', vacanze: 'F',
};
const SAME = new Set(['anche', 'stesso', 'idem', 'uguale']);
const RANGE = new Set(['al', 'ale', 'all', 'a', 'fino', '-', '–', '—', 'to', 'till']);

// ref: "YYYY-MM" del mese che si sta guardando (serve per mese e anno quando non sono scritti)
export function parseFabioText(text, ref) {
  const [refY, refM] = ref.split('-').map(Number);
  const yearFor = (m) => [refY - 1, refY, refY + 1].reduce((best, y) => {
    const dist = Math.abs((y * 12 + m) - (refY * 12 + refM));
    return dist < best.dist ? { y, dist } : best;
  }, { y: refY, dist: Infinity }).y;

  const clean = String(text || '').toLowerCase()
    .replace(/\b\d{1,2}[:.]\d{2}\b/g, ' ') // orari tipo 6:30
    .replace(/(\d)([a-zà-ù])/g, '$1 $2').replace(/([a-zà-ù])(\d)/g, '$1 $2')
    .replace(/(\d)\s*[-–—]\s*(\d)/g, '$1 al $2')
    .replace(/[.'’]/g, ' ');

  const out = new Map();
  const warnings = [];
  let shift = null;
  let month = refM;

  for (const raw of clean.split(/[,;\n]+/)) {
    const words = raw.match(/[a-zà-ù]+|\d+|[-–—]/g) || [];
    if (!words.length) continue;
    let clauseShift = null;
    const nums = []; // { d, m, rangeStart }
    let pending = [];
    let range = false;
    for (const w of words) {
      if (/^\d+$/.test(w)) {
        const n = { d: Number(w), m: null, rangeFrom: range && nums.length ? nums[nums.length - 1] : null };
        nums.push(n); pending.push(n); range = false;
      } else if (MONTHS[w]) {
        for (const n of pending) { n.m = MONTHS[w]; n.named = true; }
        pending = []; month = MONTHS[w];
      } else if (SHIFT_WORDS[w]) clauseShift = SHIFT_WORDS[w];
      else if (SAME.has(w)) clauseShift = clauseShift || shift;
      else if (RANGE.has(w)) range = true;
    }
    for (const n of pending) n.m = month;
    if (clauseShift) shift = clauseShift;
    if (!nums.length) continue;
    if (!shift) { warnings.push(`"${raw.trim()}": manca il turno`); continue; }

    const toDate = (n) => new Date(yearFor(n.m), n.m - 1, n.d);
    const valid = (n) => n.d >= 1 && n.d <= new Date(yearFor(n.m), n.m, 0).getDate();
    const isStart = new Set(nums.filter((n) => n.rangeFrom).map((n) => n.rangeFrom));
    for (const n of nums) {
      if (isStart.has(n)) continue; // l'inizio di un intervallo lo gestisce la sua fine
      if (!valid(n)) { warnings.push(`il ${n.d}/${n.m} non esiste`); continue; }
      let end = toDate(n);
      let start = end;
      if (n.rangeFrom) {
        if (!valid(n.rangeFrom)) { warnings.push(`il ${n.rangeFrom.d}/${n.rangeFrom.m} non esiste`); continue; }
        start = toDate(n.rangeFrom);
        // es. "dal 28 al 3 dic" = dal 28 novembre; "dal 28 al 3" = fino al 3 del mese dopo
        if (end < start) {
          if (n.named && n.rangeFrom.named && n.m === n.rangeFrom.m) start = new Date(start.getFullYear(), start.getMonth() - 1, start.getDate());
          else end = new Date(end.getFullYear(), end.getMonth() + 1, end.getDate());
        }
      }
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) out.set(isoDay(d), shift);
    }
  }
  const days = [...out.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([day, code]) => ({ day, fabio: code }));
  return { days, warnings };
}
