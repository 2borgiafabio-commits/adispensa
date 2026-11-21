// Icone dei prodotti, disegnate a mano (24×24, a linea, colore della categoria).
// Si abbinano al NOME del prodotto: il database non cambia. I prodotti nuovi non hanno
// un'icona finché non la si aggiunge qui (chiave = nome in minuscolo, senza accenti).

const drop = (x, y) => `<path d="M${x} ${y}c-1.2 1.6-1.7 2.4-1.7 3.2a1.7 1.7 0 0 0 3.4 0c0-.8-.5-1.6-1.7-3.2z"/>`;
const dot = (x, y, r = 0.7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;

const ICONS = {
  // Frigo
  latte: `<path d="M8 2.5h8V6l2 3v11.5a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9l2-3z"/><path d="M6 9h12M8 6h8"/>${drop(12, 12.5)}`,
  yogurt: `<path d="M5.5 8h13l-1.4 11.7a1.5 1.5 0 0 1-1.5 1.3H8.4a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M4.5 5h15v3h-15z"/><path d="M8.5 13.5c1.2-.9 2.3-.9 3.5 0s2.3.9 3.5 0"/>`,
  burro: `<path d="M5 12.5 8 9.5h11l-3 3z"/><path d="M5 12.5h11v5H5z"/><path d="M16 12.5l3-3v5l-3 3"/><path d="M3 20h18"/>`,
  uova: `<path d="M8 4.5C5.7 4.5 3.8 8 3.8 11.2a4.2 4.2 0 0 0 8.4 0C12.2 8 10.3 4.5 8 4.5z"/><path d="M16.5 8.5c-2 0-3.6 3-3.6 5.7a3.6 3.6 0 0 0 7.2 0c0-2.7-1.6-5.7-3.6-5.7z"/>`,
  mozzarella: `<path d="M12 9c-4.1 0-7.2 2.5-7.2 5.8s3.1 5.7 7.2 5.7 7.2-2.4 7.2-5.7S16.1 9 12 9z"/><path d="M10.7 9.1c.2-1.6.6-3 1.3-4 .7 1 1.1 2.4 1.3 4"/><path d="M8 14c.5-1.2 1.6-2 3-2.3"/>`,
  parmigiano: `<path d="M3 15 17 6.5l4 2.5v9.5H3z"/><path d="M3 15h18"/><path d="M17 6.5 21 9"/>${dot(7.5, 17)}${dot(12, 16.6, 0.6)}${dot(16.5, 17.3, 0.5)}`,
  'prosciutto cotto': `<path d="M9.6 8.2c1.3-2.2 3.8-3.5 6.6-3.5 4 0 6.8 2.4 6.8 5.6 0 1.7-.7 3.1-1.9 4.2"/><ellipse cx="11" cy="13.8" rx="8" ry="6"/><ellipse cx="11.9" cy="14.4" rx="5.4" ry="3.9"/>`,

  // Frutta e verdura
  mele: `<path d="M12 7.6c-1.3-1-3-1.3-4.5-.8C5 7.6 4 10 4.5 13c.6 3.8 3.2 7.5 5.5 7.5 1 0 1.3-.5 2-.5s1 .5 2 .5c2.3 0 4.9-3.7 5.5-7.5.5-3-.5-5.4-3-6.2-1.5-.5-3.2-.2-4.5.8z"/><path d="M12 7.6c0-2 .6-3.4 1.8-4.4"/><path d="M13.2 5.6c1.4-.6 3-.3 3.9.6-1.4.7-3 .5-3.9-.6z"/>`,
  banane: `<path d="M3.5 12.5c2.3 5 9 7 13.8 3.3 2.2-1.7 3.3-4.4 3.2-7.3L19.8 6"/><path d="M3.5 12.5c4 1.8 9.6 1 12.8-3 1-1.3 1.7-2.8 1.8-4.4L19.8 6"/><path d="M18.1 5.1 18.6 3.5l1.6.2"/><path d="M3.5 12.5l-1 .3"/>`,
  limoni: `<path d="M5 17.6c-1.6-3.1-.1-7.6 3.6-10.2 3.4-2.4 7.6-3.1 10.4-1.7.5-.6 1.2-.9 1.8-.7.2.6-.1 1.3-.7 1.8 1.4 2.9-.1 7.4-3.6 10.1-3.5 2.6-7.6 3.3-10.4 1.9-.5.6-1.2.9-1.8.7-.2-.6.1-1.3.7-1.9z"/><path d="M8.6 15.4c-.6-1.6.3-3.9 2.4-5.4"/>`,
  insalata: `<path d="M3.5 11.5h17c0 4.7-3.8 8.5-8.5 8.5s-8.5-3.8-8.5-8.5z"/><path d="M12 11.5c-1.8-1.8-2-5.2 0-7.5 2 2.3 1.8 5.7 0 7.5z"/><path d="M9 11.5c-2.4-.6-4-3.2-3.5-6.2 2.8.7 4.2 3.5 3.5 6.2z"/><path d="M15 11.5c2.4-.6 4-3.2 3.5-6.2-2.8.7-4.2 3.5-3.5 6.2z"/><path d="M12 11.5V7.5"/>`,
  pomodori: `<path d="M12 7.5c-4.7 0-8.5 2.9-8.5 6.6S7.3 20.5 12 20.5s8.5-2.7 8.5-6.4S16.7 7.5 12 7.5z"/><path d="M12 7.5V4"/><path d="M12 7.5 9 5.8M12 7.5l3-1.7M12 7.5 8.3 9M12 7.5 15.7 9"/>`,
  patate: `<path d="M4.9 15.7c-1.6-3.1.4-7.2 4.6-9.2s8.6-1.4 10.1 1.6-.5 7.2-4.6 9.2-8.6 1.5-10.1-1.6z"/><circle cx="9" cy="11" r=".75" fill="currentColor" stroke="none"/><circle cx="13.6" cy="9.6" r=".75" fill="currentColor" stroke="none"/><circle cx="11.8" cy="15" r=".75" fill="currentColor" stroke="none"/><circle cx="16" cy="13" r=".75" fill="currentColor" stroke="none"/>`,
  cipolle: `<path d="M12 4.5c.6 2 4 3.4 6 5.8 2 2.5 2 6.6-1 8.6-1.4 1-3 1.6-5 1.6s-3.6-.6-5-1.6c-3-2-3-6.1-1-8.6 2-2.4 5.4-3.8 6-5.8z"/><path d="M12 7.5c-1.5 2.4-3 5-3 8.3 0 2 .7 3.6 1.4 4.4M12 7.5c1.5 2.4 3 5 3 8.3 0 2-.7 3.6-1.4 4.4"/><path d="M12 4.5V2.5"/>`,

  // Dispensa
  pasta: `<path d="M11 12 4.6 6.6C3.6 8.2 3 10 3 12s.6 3.8 1.6 5.4z"/><path d="M13 12l6.4-5.4C20.4 8.2 21 10 21 12s-.6 3.8-1.6 5.4z"/><path d="M11 9.8h2v4.4h-2z"/><path d="M6.5 10l1 2-1 2M17.5 10l-1 2 1 2"/>`,
  riso: `<path d="M3.5 11.5h17c0 4.7-3.8 8.5-8.5 8.5s-8.5-3.8-8.5-8.5z"/><path d="M5.6 11.5c.6-3 3.3-5 6.4-5s5.8 2 6.4 5"/><path d="M9 9.2l.9.4M12.4 8.3l.8-.3M14.8 10l.8.3M10.8 10.6l.7.3"/>`,
  'passata di pomodoro': `<path d="M10 2.5h4V5l1.5 2.5v13a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-13L10 5z"/><path d="M8.5 10.5h7v7h-7z"/><circle cx="12" cy="14.3" r="1.9"/><path d="M12 12.4v-1"/>`,
  'olio extravergine': `<path d="M10.5 2.5h3v3.3c2 1 3 2.6 3 4.7v10a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-10c0-2.1 1-3.7 3-4.7z"/>${drop(12, 12)}`,
  caffe: `<path d="M7 4.5h9l-2 7H9z"/><path d="M9 11.5h5l2 9H7z"/><path d="M7 4.5 5.4 5.6"/><path d="M16 5.5h2.6l-1 4.5h-3.1"/><path d="M11.5 4.5V3"/>`,
  zucchero: `<path d="M12 3.5l7.5 4v9l-7.5 4-7.5-4v-9z"/><path d="M4.5 7.5l7.5 4 7.5-4M12 11.5v9"/>${dot(8, 13.5, 0.55)}${dot(9.3, 16, 0.55)}${dot(15.5, 14.2, 0.55)}${dot(12, 7.4, 0.55)}`,
  farina: `<path d="M7.5 6.5C5.5 9 5 13 5 16c0 3 2 4.5 7 4.5s7-1.5 7-4.5c0-3-.5-7-2.5-9.5z"/><path d="M7.5 6.5 6.5 4h11l-1 2.5z"/><path d="M12 18.5V10.5"/><path d="M12 12.6l-2-1.6M12 12.6l2-1.6M12 15.1l-2-1.6M12 15.1l2-1.6M12 17.6l-2-1.6M12 17.6l2-1.6"/>`,
  biscotti: `<path d="M20.5 12A8.5 8.5 0 1 1 12 3.5a2.5 2.5 0 0 0 3 3 2.5 2.5 0 0 0 3 3 2.5 2.5 0 0 0 2.5 2.5z"/>${dot(8.5, 10, 0.9)}${dot(12.5, 15, 0.9)}${dot(8.5, 15.5, 0.7)}${dot(15.5, 12.5, 0.7)}${dot(11.5, 8, 0.6)}`,
  pane: `<path d="M3.5 15.2c0-4.2 3.8-7.4 8.5-7.4s8.5 3.2 8.5 7.4c0 1.6-1.1 2.8-2.7 2.8H6.2c-1.6 0-2.7-1.2-2.7-2.8z"/><path d="M7.6 11.4l1.6 2.6M11.3 10.4l1.6 2.6M15 11.4l1.6 2.6"/>`,
  sale: `<path d="M8 9.5c0-3 1.8-6 4-6s4 3 4 6"/><path d="M7 9.5h10l-1 11H8z"/>${dot(10.8, 6.3, 0.55)}${dot(13.2, 6.3, 0.55)}${dot(12, 4.9, 0.55)}<path d="M9 14h6"/>`,
  'tonno in scatola': `<ellipse cx="12" cy="8" rx="8" ry="3"/><path d="M4 8v8c0 1.7 3.6 3 8 3s8-1.3 8-3V8"/><path d="M7.6 15c1.7-1.6 4.3-1.6 6 0-1.7 1.6-4.3 1.6-6 0z"/><path d="M13.6 15l2.2-1.5v3z"/><circle cx="15.3" cy="7.6" r="1"/>`,
  legumi: `<path d="M6 5.5c0-1.1 2.7-2 6-2s6 .9 6 2v13c0 1.1-2.7 2-6 2s-6-.9-6-2z"/><path d="M6 5.5c0 1.1 2.7 2 6 2s6-.9 6-2"/><path d="M6 10.5c1.6.6 3.7 1 6 1s4.4-.4 6-1M6 17c1.6.6 3.7 1 6 1s4.4-.4 6-1"/><circle cx="9.4" cy="14.4" r="1.2"/><circle cx="12" cy="14.6" r="1.2"/><circle cx="14.6" cy="14.4" r="1.2"/>`,

  // Bevande
  acqua: `<path d="M10 2.5h4v2l2 2.5v13.5a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7l2-2.5z"/><path d="M8 11h8M8 15.5h8"/><path d="M10 4.5h4"/>`,
  'succo di frutta': `<path d="M6.5 8h10v13h-10z"/><path d="M6.5 8 8 5h7l1.5 3"/><path d="M13 5V2.5l3.5-1"/><circle cx="11.5" cy="14.5" r="2.6"/><path d="M11.5 11.9v5.2M8.9 14.5h5.2"/>`,

  // Surgelati
  'piselli surgelati': `<path d="M3.5 15.5c3-5.5 9-9.5 16-10 .6 0 1 .4 1 1-.5 7-4.6 12.6-9.6 13.2-3.5.4-6.2-1.4-7.4-4.2z"/><circle cx="9" cy="14.5" r="1.8"/><circle cx="12.6" cy="11.4" r="1.8"/><circle cx="16" cy="8.7" r="1.6"/>`,

  // Pulizia
  'detersivo piatti': `<path d="M9 8h6v1.4c1.5.7 2 1.8 2 3.1v7.5a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-7.5c0-1.3.5-2.4 2-3.1z"/><path d="M10.5 8V5.5h3V8"/><path d="M12 5.5V3.5h2.5"/><circle cx="18.5" cy="5" r="1.3"/><circle cx="20" cy="8.5" r=".8"/><path d="M9.5 15c.8-.6 1.7-.6 2.5 0s1.7.6 2.5 0"/>`,
  'pastiglie lavastoviglie': `<path d="M4 9.5l8-4 8 4v5.5l-8 4-8-4z"/><path d="M4 9.5l8 4 8-4M12 13.5V19"/><ellipse cx="12" cy="9.5" rx="2.4" ry="1.2"/>`,
  'detersivo lavatrice': `<rect x="4.5" y="3" width="15" height="18" rx="2"/><path d="M4.5 7h15"/><circle cx="12" cy="14" r="4"/><path d="M9.6 14.6c.8.7 1.6.7 2.4 0s1.6-.7 2.4 0"/>${dot(7.3, 5, 0.6)}${dot(9.3, 5, 0.6)}`,
  'sacchi spazzatura': `<path d="M6.3 10.5h11.4l-1.2 9.6a1 1 0 0 1-1 .9H8.5a1 1 0 0 1-1-.9z"/><path d="M5 10.5c0-1.4 1-2.5 2.4-2.5h9.2c1.4 0 2.4 1.1 2.4 2.5z"/><path d="M10 13.5l.4 4.5M14 13.5l-.4 4.5"/><path d="M10.5 8 9.3 4.5c1 0 2 .5 2.7 1.3.7-.8 1.7-1.3 2.7-1.3L13.5 8"/>`,
  'carta da cucina': `<ellipse cx="12" cy="5.5" rx="5" ry="1.5"/><ellipse cx="12" cy="5.5" rx="1.3" ry=".45"/><path d="M7 5.5v12c0 .8 2.2 1.5 5 1.5s5-.7 5-1.5v-12"/><path d="M7 10c1.5.5 3.2.7 5 .7s3.5-.2 5-.7M7 14c1.5.5 3.2.7 5 .7s3.5-.2 5-.7"/><path d="M12 2v3"/><path d="M12 19v2M7 21h10"/>`,
  spugne: `<rect x="3.5" y="10" width="17" height="4" rx="1"/><path d="M3.5 14h17v4.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z"/>${dot(8, 16.8, 0.7)}${dot(12, 17.1, 0.9)}${dot(16, 16.6, 0.6)}<circle cx="9" cy="6" r="1.3"/><circle cx="13.5" cy="4.6" r=".9"/>`,
  sgrassatore: `<path d="M7.5 10h6l1 2.5V20a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-7.5z"/><path d="M8.5 10V7h4v3"/><path d="M8.5 7V5a1 1 0 0 1 1-1h5l1.5 2.2h-3.5"/><path d="M12.5 8l2.5 1.7"/>${dot(18.5, 3.5, 0.6)}${dot(20.3, 5.6, 0.6)}${dot(18.6, 7.4, 0.6)}`,

  // Igiene
  'carta igienica': `<ellipse cx="7" cy="10" rx="3.5" ry="6"/><ellipse cx="7" cy="10" rx="1" ry="1.7"/><path d="M7 4h10c1.9 0 3.5 2.7 3.5 6v10.5h-7V16H7"/>`,
  dentifricio: `<path d="M5 3h14v2.5H5z"/><path d="M5.5 5.5h13L15.5 18h-7z"/><path d="M10 18h4v3.5h-4z"/><path d="M9 10h6"/>`,
  shampoo: `<path d="M8.5 7.5h7c1 0 2 1 2 2v10a1.5 1.5 0 0 1-1.5 1.5H8a1.5 1.5 0 0 1-1.5-1.5v-10c0-1 1-2 2-2z"/><path d="M9.5 7.5v-3h5v3"/><path d="M9 14c1-.8 2-.8 3 0s2 .8 3 0"/>`,
  bagnoschiuma: `<path d="M3 12.5h18v1.5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><path d="M7 19l-1 2M17 19l1 2"/><circle cx="9" cy="8.5" r="1.8"/><circle cx="13.5" cy="7" r="2.2"/><circle cx="17.2" cy="9.6" r="1.2"/>`,
  'sapone mani': `<path d="M8 10.5h8V20a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"/><path d="M10.5 10.5V8h3v2.5"/><path d="M12 8V5"/><path d="M9.5 5h6.5v1.6"/><path d="M10.5 15c.5-.4 1-.4 1.5 0s1 .4 1.5 0"/>`,
  deodorante: `<path d="M8 8.5h8V20a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"/><path d="M9 8.5V6h6v2.5"/><path d="M11 6V3.5h2V6"/>${dot(16, 3.4, 0.6)}${dot(18, 2.4, 0.6)}${dot(18, 4.6, 0.6)}<path d="M8 12.5h8"/>`,

  // Farmaci
  paracetamolo: `<path d="M4.6 19.4a4.2 4.2 0 0 1 0-6l8.8-8.8a4.2 4.2 0 0 1 6 6l-8.8 8.8a4.2 4.2 0 0 1-6 0z"/><path d="M9 9l6 6"/>`,
  cerotti: `<path d="M3.9 15.4a2.8 2.8 0 0 1 0-4L11.4 3.9a2.8 2.8 0 0 1 4 0l4.7 4.7a2.8 2.8 0 0 1 0 4l-7.5 7.5a2.8 2.8 0 0 1-4 0z"/><path d="M9.2 9.6l4.2-4.2 5.2 5.2-4.2 4.2z" transform="translate(-1.9 1.9)"/>${dot(10.6, 11.4, 0.5)}${dot(12.6, 13.4, 0.5)}${dot(12.6, 11.4, 0.5)}${dot(10.6, 13.4, 0.5)}`,
  disinfettante: `<path d="M9 3h6v3.5H9z"/><path d="M8 6.5h8a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1z"/><path d="M12 11v5M9.5 13.5h5"/>`,

  // Casa
  batterie: `<rect x="3" y="8" width="16" height="8" rx="1.5"/><path d="M19 10.5h2v3h-2"/><path d="M6.5 12h3M8 10.5v3M13.5 12h2.5"/>`,
  lampadine: `<path d="M9 16v-1.3c0-1.3-.9-2.3-1.8-3.3A6 6 0 1 1 18 8c0 1.5-.6 2.6-1.2 3.4-.9 1-1.8 2-1.8 3.3V16z"/><path d="M9 18.5h6M10 21h4"/>`,
  pellicola: `<path d="M5.5 4.5h13c1 0 1.8 1.3 1.8 3s-.8 3-1.8 3h-13"/><ellipse cx="5.5" cy="7.5" rx="1.8" ry="3"/><ellipse cx="5.5" cy="7.5" rx=".5" ry=".9"/><path d="M8 10.5v8.5l1.6 1 1.6-.6 1.6.6 1.6-.6 1.6.6 1.5-1v-8.5"/><path d="M10.5 13l2.5 3M13.6 13l1 1.2"/>`,
  alluminio: `<path d="M5.5 4.5h13c1 0 1.8 1.3 1.8 3s-.8 3-1.8 3h-13"/><ellipse cx="5.5" cy="7.5" rx="1.8" ry="3"/><ellipse cx="5.5" cy="7.5" rx=".5" ry=".9"/><path d="M8 10.5v8l1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5v-8"/><path d="M10 13.5l1.6 1.2 1.6-1.2 1.6 1.2"/>`,
  fazzoletti: `<path d="M3.5 11h17v8.5a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z"/><path d="M9 11c0-2.6 1-4.6 3-6.5.5 1.9 2.4 2.4 3.6 2.4-.6 1.4-.6 2.6-.6 4.1"/><path d="M7 14h10"/>`,
};

// Altri nomi per le stesse cose
const ALIASES = {
  caffe: ['caffe macinato', 'caffe in grani', 'capsule caffe', 'cialde caffe'],
  'olio extravergine': ['olio', 'olio evo', 'olio extra vergine', 'olio di oliva', "olio d'oliva"],
  'passata di pomodoro': ['passata', 'pelati', 'sugo'],
  'tonno in scatola': ['tonno'],
  'prosciutto cotto': ['prosciutto'],
  'piselli surgelati': ['piselli'],
  'pastiglie lavastoviglie': ['pastiglie', 'detersivo lavastoviglie', 'lavastoviglie'],
  'detersivo lavatrice': ['detersivo bucato'],
  'sacchi spazzatura': ['sacchetti spazzatura', 'sacchi immondizia', 'sacchetti'],
  'carta da cucina': ['scottex', 'carta assorbente'],
  'carta igienica': [],
  'sapone mani': ['sapone', 'sapone liquido'],
  paracetamolo: ['tachipirina'],
  batterie: ['pile'],
  lampadine: ['lampadina'],
  pellicola: ['pellicola trasparente'],
  alluminio: ['carta alluminio', "carta d'alluminio", 'carta stagnola'],
  uova: ['uovo'], mele: ['mela'], banane: ['banana'], limoni: ['limone'],
  pomodori: ['pomodoro'], patate: ['patata'], cipolle: ['cipolla'], spugne: ['spugna'],
  legumi: ['fagioli', 'ceci', 'lenticchie'], acqua: ['acqua naturale', 'acqua frizzante'],
  'succo di frutta': ['succo', 'succhi'], biscotti: ['biscotto'], insalata: ['lattuga'],
};

const key = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();
for (const [k, names] of Object.entries(ALIASES)) for (const n of names) if (!ICONS[n]) ICONS[n] = ICONS[k];

export const hasIcon = (name) => Boolean(ICONS[key(name)]);

// Tassello con l'icona; senza icona mostra l'iniziale
export function itemIcon(name) {
  const svg = ICONS[key(name)];
  if (!svg) return `<span class="ico none">${(name || '?').trim().charAt(0).toUpperCase()}</span>`;
  return `<span class="ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${svg}</svg></span>`;
}

export const ICON_NAMES = Object.keys(ICONS);
