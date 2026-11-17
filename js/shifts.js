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
