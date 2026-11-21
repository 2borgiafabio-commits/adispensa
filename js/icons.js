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

// Altri prodotti comuni (non sono tra quelli di partenza, ma è facile averli in casa)
Object.assign(ICONS, {
  formaggio: `<path d="M3 10.5 15.5 5l5.5 3v2.5"/><path d="M3 10.5h18v8H3z"/><circle cx="8" cy="14.5" r="1.6"/><circle cx="14" cy="15.6" r="1.1"/><circle cx="17.6" cy="13.2" r=".8"/>`,
  ricotta: `<path d="M5 11h14l-1.5 8.6a1 1 0 0 1-1 .9h-9a1 1 0 0 1-1-.9z"/><path d="M5.5 11c.5-3 3.2-5 6.5-5s6 2 6.5 5"/><path d="M8.5 14v3.5M12 14v4M15.5 14v3.5"/>`,
  salame: `<path d="M3.9 14.6c-1.3-1.3-1.1-3.6.5-5.2l4.9-4.9c1.6-1.6 3.9-1.8 5.2-.5s1.1 3.6-.5 5.2l-4.9 4.9c-1.6 1.6-3.9 1.8-5.2.5z"/><path d="M14.5 4 16.5 2"/><circle cx="16.5" cy="16.5" r="4.5"/>${dot(6.5, 11.5)}${dot(9.5, 8.5)}${dot(11.8, 6.6, 0.6)}${dot(15, 15.2)}${dot(18, 17.2)}${dot(15.8, 18.6, 0.6)}${dot(17.6, 14.4, 0.6)}`,
  pollo: `<path d="M8.06 10.02 14.5 9.5l-.52 6.44A5.5 5.5 0 1 1 8.06 10.02z"/><path d="M14.5 9.5l2.6-2.6"/><circle cx="17.6" cy="5.4" r="1.3"/><circle cx="18.6" cy="6.4" r="1.3"/>`,
  carne: `<path d="M4 12c0-4 3.6-7.5 8.5-7.5S20.5 7 20.5 11c0 2.5-1.5 4-3.5 4.5-1.5.4-2 1.5-2.5 2.7-.7 1.6-2 2.3-4 2.3C6.5 20.5 4 16.5 4 12z"/><circle cx="14.5" cy="10" r="2"/><path d="M7 12.5c0-2.6 2.2-4.8 5-5"/>`,
  pesce: `<path d="M3 12c3-4 8.5-5.5 13-2.5L20.5 7v10L16 14.5c-4.5 3-10 1.5-13-2.5z"/>${dot(7.5, 11, 0.9)}<path d="M11 9.4c.8 1.7.8 3.5 0 5.2"/>`,
  wurstel: `<path d="M3.4 8.2c.5-.9 1.6-1.2 2.4-.6 3.6 2.7 8.8 2.7 12.4 0 .8-.6 1.9-.3 2.4.6.4.8.1 1.7-.6 2.2-4.6 3.5-11.4 3.5-16 0-.7-.5-1-1.4-.6-2.2z"/><path d="M3.4 14.2c.5-.9 1.6-1.2 2.4-.6 3.6 2.7 8.8 2.7 12.4 0 .8-.6 1.9-.3 2.4.6.4.8.1 1.7-.6 2.2-4.6 3.5-11.4 3.5-16 0-.7-.5-1-1.4-.6-2.2z"/>`,
  arancia: `<circle cx="12" cy="13.2" r="7.5"/><path d="M12 5.7c0-1.4.7-2.5 1.8-3"/><path d="M12.6 4.6c1.5-1 3.5-.8 4.5.3-1.5 1-3.4 1-4.5-.3z"/>${dot(9, 11.5, 0.6)}${dot(14.5, 15.5, 0.6)}${dot(15.5, 11, 0.6)}${dot(10, 16.2, 0.6)}`,
  pere: `<path d="M12 6.5c-1.6 0-2.8 1.4-2.8 3.2 0 1.6-.8 2.4-1.8 3.6-.9 1.1-1.4 2.4-1.4 3.8 0 2.7 2.7 4.4 6 4.4s6-1.7 6-4.4c0-1.4-.5-2.7-1.4-3.8-1-1.2-1.8-2-1.8-3.6 0-1.8-1.2-3.2-2.8-3.2z"/><path d="M12 6.5c0-1.6.5-2.8 1.5-3.5"/>`,
  fragole: `<path d="M12 20.5c-3.5-1.5-7-5.5-7-9 0-2.5 2-3.5 3.8-3.5 1.4 0 2.4.5 3.2 1 .8-.5 1.8-1 3.2-1 1.8 0 3.8 1 3.8 3.5 0 3.5-3.5 7.5-7 9z"/><path d="M12 9V4.5M12 7.5 9 5.5M12 7.5l3-2"/>${dot(9.3, 12, 0.6)}${dot(14.7, 12, 0.6)}${dot(12, 13.8, 0.6)}${dot(10.6, 16.3, 0.6)}${dot(13.4, 16.3, 0.6)}`,
  uva: `<circle cx="8.5" cy="9.5" r="1.8"/><circle cx="12" cy="9.5" r="1.8"/><circle cx="15.5" cy="9.5" r="1.8"/><circle cx="10.2" cy="12.8" r="1.8"/><circle cx="13.8" cy="12.8" r="1.8"/><circle cx="12" cy="16.1" r="1.8"/><path d="M12 7.7V3.5"/><path d="M12 5.2c1.4-1.5 3.4-1.6 4.6-.6-1.1 1.5-3.2 1.6-4.6.6z"/>`,
  kiwi: `<circle cx="12" cy="12" r="8.5"/><ellipse cx="12" cy="12" rx="2.8" ry="2.1"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => dot((12 + 4.7 * Math.cos(a * Math.PI / 180)).toFixed(2), (12 + 4.7 * Math.sin(a * Math.PI / 180)).toFixed(2), 0.55)).join('')}`,
  avocado: `<path d="M12 3.5c-2.5 0-3.5 3-4.5 5.5S5 12.5 5 15a7 6 0 0 0 14 0c0-2.5-1.5-3.5-2.5-6S14.5 3.5 12 3.5z"/><circle cx="12" cy="15" r="2.5"/>`,
  aglio: `<path d="M12 6c-1 2-6.5 3.5-6.5 8.5 0 3.5 3 6 6.5 6s6.5-2.5 6.5-6C18.5 9.5 13 8 12 6z"/><path d="M12 6V3"/><path d="M12 8.5c-2 2.6-2.6 6.4-1.8 11.8M12 8.5c2 2.6 2.6 6.4 1.8 11.8"/>`,
  carote: `<path d="M15.2 8.8c-1.3-1.3-3.6-1.2-5 .3L4.3 19c-.4.6.1 1.2.7.9l9.9-5.9c1.5-1.4 1.6-3.7.3-5.2z"/><path d="M15.5 8.5 16.5 4M15.5 8.5l4.5-1M15.5 8.5l3.5-3.5"/><path d="M8.2 13.6l1.4 1.4M10.6 11l1.2 1.2"/>`,
  zucchine: `<path d="M4.6 19.4c-1.5-1.5-1.3-4 .5-5.8l8.5-8.5c1.8-1.8 4.3-2 5.8-.5s1.3 4-.5 5.8l-8.5 8.5c-1.8 1.8-4.3 2-5.8.5z"/><path d="M19.2 4.8 21 3"/><path d="M8 14.5l1.5-1.5M11 12.5l1.5-1.5M10 16.5l1.5-1.5M13 14.5l1.5-1.5"/>`,
  melanzane: `<path d="M15.5 8.5c-2-1.5-4.5-.5-5.5 1.5-1 2-2.5 2.5-4 4-2 2-1.7 5.2.3 6.5 2 1.4 5 .7 6.6-1.6 1-1.4 1.4-3 2.7-4.4 1.6-1.8 1.9-4.6-.1-6z"/><path d="M13.6 8.6c.5-1.3 1.8-2 3-1.8.6 1.2.2 2.6-.8 3.4"/><path d="M16.2 7l1.6-2.6"/>`,
  peperoni: `<path d="M12 7.2c-1.2-1-3.2-1.2-4.8-.3C4.8 8.2 4.5 11 5 14c.6 3.5 2.5 6.5 4.5 6.5.9 0 1.6-.6 2.5-.6s1.6.6 2.5.6c2 0 3.9-3 4.5-6.5.5-3 .2-5.8-2.2-7.1-1.6-.9-3.6-.7-4.8.3z"/><path d="M12 7.2c0-1.6.6-3 2.2-3.7"/><path d="M12 10.5v9"/>`,
  funghi: `<path d="M3.5 12a8.5 6.5 0 0 1 17 0z"/><path d="M9.5 12v6a2.5 2.5 0 0 0 5 0v-6"/>`,
  broccoli: `<path d="M10 14.5v6h4v-6"/><path d="M7 14.5a3 3 0 0 1-1-5.6 3.5 3.5 0 0 1 4.5-4.4 3.5 3.5 0 0 1 5.8 1.3 3 3 0 0 1 1.5 5.7 3 3 0 0 1-.8 3z"/>`,
  erbe: `<path d="M12 21V8.5"/><path d="M12 13.5c-3 0-5-2-5-5 3 0 5 2 5 5zM12 11c0-3 2-5 5-5 0 3-2 5-5 5zM12 18c-2.5 0-4.5-1.7-4.5-4.2 2.5 0 4.5 1.7 4.5 4.2zM12 16c0-2.5 2-4.2 4.5-4.2 0 2.5-2 4.2-4.5 4.2z"/>`,
  barattolo: `<path d="M7 3.5h10V7H7z"/><path d="M6.5 7h11a1 1 0 0 1 1 1v11.5A1.5 1.5 0 0 1 17 21H7a1.5 1.5 0 0 1-1.5-1.5V8a1 1 0 0 1 1-1z"/><path d="M5.5 11h13M5.5 17h13"/>`,
  cereali: `<path d="M3.5 11.5h17c0 4.7-3.8 8.5-8.5 8.5s-8.5-3.8-8.5-8.5z"/><path d="M14 11.5 19.5 4"/><ellipse cx="7.8" cy="9.9" rx="1.6" ry=".9"/><ellipse cx="11" cy="9.2" rx="1.4" ry=".8"/>`,
  pepe: `<path d="M9 2.5h6l-.5 3h-5z"/><path d="M9.5 5.5h5c0 2-1.5 3-1.5 5.5 0 2 2 3.5 2 6.5v2a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-2c0-3 2-4.5 2-6.5 0-2.5-1-3.5-1-5.5z"/>`,
  crackers: `<rect x="4" y="4" width="16" height="16" rx="2"/>${[8, 12, 16].flatMap((y) => [8, 12, 16].map((x) => dot(x, y, 0.75))).join('')}`,
  grissini: `<rect x="4.6" y="3" width="2.8" height="18" rx="1.4" transform="rotate(-10 6 12)"/><rect x="10.6" y="3" width="2.8" height="18" rx="1.4"/><rect x="16.6" y="3" width="2.8" height="18" rx="1.4" transform="rotate(10 18 12)"/>`,
  te: `<path d="M4 10h12v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H15.5"/><path d="M9 12.5V5.5l3-1.5"/><path d="M12 2.5h3V6h-3z"/><path d="M3 21.5h15"/>`,
  cioccolato: `<path d="M5 9V4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20v-5"/><path d="M5 9h14M5 15h14M12 3v18.5"/>`,
  pizza: `<path d="M12 21 4 6.5c5-3 11-3 16 0z"/><path d="M5.6 9.3c4-2 8.8-2 12.8 0"/><circle cx="10" cy="11.8" r="1"/><circle cx="14" cy="12.2" r="1"/><circle cx="12" cy="15.6" r="1"/>`,
  patatine: `<path d="M3.5 12.5h17c0 4.4-3.8 8-8.5 8s-8.5-3.6-8.5-8z"/><ellipse cx="8.3" cy="10" rx="2.8" ry="1.7" transform="rotate(-20 8.3 10)"/><ellipse cx="15.2" cy="9.6" rx="2.8" ry="1.7" transform="rotate(18 15.2 9.6)"/><ellipse cx="11.8" cy="6.4" rx="2.5" ry="1.5" transform="rotate(-6 11.8 6.4)"/>`,
  vino: `<path d="M7 2.5h2v4c1.5.8 2 2 2 3.5v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V10c0-1.5.5-2.7 2-3.5z"/><path d="M14 9.5h6c0 2.5-1.3 4.5-3 4.5s-3-2-3-4.5z"/><path d="M17 14v6M15 20.5h4"/>`,
  birra: `<path d="M5 7.5h10v12a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 5 19.5z"/><path d="M15 10h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2"/><path d="M5 7.5c0-2 1.5-3.5 3-3 1-1.5 3.5-1.5 4.5 0 1.5-.5 2.5 1 2.5 3"/><path d="M8.5 11v7M11.5 11v7"/>`,
  lattina: `<path d="M7.5 4.5h9l1 2v13l-1 2h-9l-1-2v-13z"/><path d="M6.5 6.5h11M6.5 19.5h11"/><path d="M10.5 3h3"/><path d="M9.5 10.5c1.7 1.2 3.3-1.2 5 0M9.5 14c1.7 1.2 3.3-1.2 5 0"/>`,
  gelato: `<path d="M7.5 11.5 12 21l4.5-9.5"/><path d="M7 11.5a5 5 0 1 1 10 0z"/><path d="M9.8 15.5h4.4"/>`,
  surgelati: `<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="M9.5 4.5 12 6.5l2.5-2M9.5 19.5 12 17.5l2.5 2"/>`,
  flacone: `<path d="M6 10c0-1.7 1.3-3 3-3h5l2.5 2.5h1A1.5 1.5 0 0 1 19 11v8.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 19.5z"/><path d="M10 7V4h3v3"/><path d="M9 13h6v4H9z"/>`,
  secchio: `<path d="M5 11h12l-1.3 9a1 1 0 0 1-1 .9H7.3a1 1 0 0 1-1-.9z"/><path d="M5 11c0-1.1 1-2 2-2h8c1 0 2 .9 2 2"/><path d="M14 9 19.5 2.5"/>`,
  panno: `<path d="M4 5h16v11l-4 4H4z"/><path d="M20 16h-4v4"/><path d="M4 9h16"/>`,
  spazzolino: `<path d="M10.5 10h3v10a1.5 1.5 0 0 1-3 0z"/><path d="M10.5 10V4a1.5 1.5 0 0 1 3 0v6"/><path d="M10.5 4.5H8M10.5 6.5H8M10.5 8.5H8"/>`,
  rasoio: `<path d="M5 3.5h14v4H5z"/><path d="M8 5.5h8"/><path d="M10.5 7.5h3V20a1.5 1.5 0 0 1-3 0z"/>`,
  crema: `<path d="M5 10h14v8.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M4.5 6.5h15V10h-15z"/><path d="M9 14.5c1-.8 2-.8 3 0s2 .8 3 0"/>`,
  assorbenti: `<rect x="7" y="3" width="10" height="18" rx="5"/><rect x="9.6" y="7" width="4.8" height="10" rx="2.4"/>`,
  cotone: `<path d="M7 17 17 7"/><ellipse cx="18.3" cy="5.7" rx="2.4" ry="1.5" transform="rotate(-45 18.3 5.7)"/><ellipse cx="5.7" cy="18.3" rx="2.4" ry="1.5" transform="rotate(-45 5.7 18.3)"/>`,
  pannolini: `<path d="M3.5 7h17v2.5c0 6-4 10.5-8.5 10.5S3.5 15.5 3.5 9.5z"/><path d="M3.5 10c3 0 5 2 5.5 5M20.5 10c-3 0-5 2-5.5 5"/>`,
  sciroppo: `<path d="M8.5 3h5v3.5h-5z"/><path d="M8 6.5h6c.8 0 1.5.7 1.5 1.5v11.5a1.5 1.5 0 0 1-1.5 1.5H8a1.5 1.5 0 0 1-1.5-1.5V8c0-.8.7-1.5 1.5-1.5z"/><path d="M6.5 12h9"/><path d="M18.5 9v8"/><ellipse cx="18.5" cy="7.5" rx="1.5" ry="2"/>`,
  vitamine: `<path d="M6.5 3h11v3.5h-11z"/><path d="M7.5 6.5h9v13a1.5 1.5 0 0 1-1.5 1.5H9a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M7.5 10.5h9v5.5h-9z"/>`,
  termometro: `<path d="M10 14.5V5a2 2 0 0 1 4 0v9.5a4 4 0 1 1-4 0z"/><path d="M12 9v8"/>`,
  tovaglioli: `<rect x="4" y="5" width="16" height="10" rx="1"/><path d="M4 10h16"/><path d="M4.5 18h15M6 21h12"/>`,
  candele: `<path d="M8 10h8v10.5H8z"/><path d="M12 10V8.3"/><path d="M12 7.8c-1.2-1-1.6-2.4-.8-4 .3.7.8 1 1.3.8 1 1.5.8 2.6-.5 3.2z"/>`,
  animali: `<ellipse cx="12" cy="16" rx="4" ry="3.6"/><circle cx="6.5" cy="10.5" r="1.7"/><circle cx="9.8" cy="6.8" r="1.7"/><circle cx="14.2" cy="6.8" r="1.7"/><circle cx="17.5" cy="10.5" r="1.7"/>`,
});

// Icone generiche di categoria, per i prodotti che non hanno ancora la loro
const GENERIC = {
  frigo: `<rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M6 9h12M9 5.2v1.6M9 11.5v3"/>`,
  frutta: `<path d="M3.5 10h17l-1.6 9.2a1.5 1.5 0 0 1-1.5 1.3H6.6a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M7.5 10 10 4.5M16.5 10 14 4.5"/><path d="M9 13.5v4M12 13.5v4M15 13.5v4"/>`,
  dispensa: ICONS.barattolo,
  bevande: `<path d="M6 3.5h12l-1.5 16A1.5 1.5 0 0 1 15 21H9a1.5 1.5 0 0 1-1.5-1.5z"/><path d="M6.5 9h11"/>`,
  surgelati: ICONS.surgelati,
  pulizia: ICONS.sgrassatore,
  igiene: `<circle cx="9" cy="14" r="4.5"/><circle cx="16" cy="8" r="3"/><circle cx="17" cy="16.5" r="1.8"/><path d="M7 12.5c.4-.9 1.1-1.4 2-1.6"/>`,
  farmaci: `<rect x="3.5" y="6.5" width="17" height="13" rx="2"/><path d="M9 6.5v-2h6v2"/><path d="M12 10v6M9 13h6"/>`,
  casa: `<path d="M4 11 12 4l8 7"/><path d="M6 9.5V20h12V9.5"/><path d="M10 20v-5h4v5"/>`,
};

// Parole che fanno scegliere un'icona. Vince la parola che compare per prima nel nome
// ("Succo d'arancia" = succo), a parità quella più lunga ("Sale lavastoviglie" = lavastoviglie).
// Le parole sono inizi di parola: "pomodor" vale per pomodoro e pomodori.
const WORDS = {
  latte: ['latte', 'panna'],
  yogurt: ['yogurt', 'yoghurt', 'skyr', 'kefir'],
  burro: ['burro', 'margarina'],
  uova: ['uova', 'uovo'],
  mozzarella: ['mozzarell', 'burrata', 'bocconcini', 'fior di latte'],
  parmigiano: ['parmigian', 'grana', 'pecorino'],
  formaggio: ['formagg', 'stracchino', 'gorgonzola', 'fontina', 'asiago', 'provola', 'scamorza', 'emmental', 'taleggio', 'mascarpone', 'feta', 'philadelphia', 'sottilette', 'caciotta', 'brie', 'squacquerone', 'crescenza'],
  ricotta: ['ricotta'],
  'prosciutto cotto': ['prosciutt', 'mortadella', 'bresaola', 'speck', 'affettat', 'fesa', 'cotto'],
  salame: ['salam', 'salsicc', 'pancetta', 'guanciale', 'coppa', 'nduja', 'chorizo', 'cotechino'],
  pollo: ['pollo', 'petto di pollo', 'cosce', 'alette', 'tacchino'],
  carne: ['carne', 'manzo', 'vitello', 'maiale', 'bistecc', 'hamburger', 'macinat', 'arrosto', 'agnello', 'fettine', 'spezzatino', 'polpett', 'scaloppin', 'costin', 'braciol'],
  pesce: ['pesce', 'salmone', 'merluzzo', 'orata', 'branzino', 'gamber', 'cozze', 'vongole', 'calamar', 'bastoncini', 'sgombro', 'alici', 'acciughe', 'polpo', 'seppi', 'baccala', 'surimi'],
  wurstel: ['wurstel', 'hot dog'],
  mele: ['mele', 'mela'],
  banane: ['banan'],
  limoni: ['limon', 'lime'],
  arancia: ['arance', 'arancia', 'mandarin', 'clementin', 'pompelm'],
  pere: ['pere', 'pera'],
  fragole: ['fragol', 'frutti di bosco', 'mirtill', 'lampon', 'more', 'ciliegi'],
  uva: ['uva', 'uvetta'],
  kiwi: ['kiwi'],
  avocado: ['avocado'],
  insalata: ['insalata', 'lattuga', 'rucola', 'valeriana', 'songino', 'radicchio', 'misticanza', 'spinaci', 'cavolo', 'verza', 'bietol', 'cicoria', 'scarola', 'indivia'],
  erbe: ['basilico', 'prezzemolo', 'rosmarino', 'salvia', 'menta', 'erba cipollina', 'timo', 'aromi', 'erbe', 'aneto', 'coriandolo'],
  pomodori: ['pomodor', 'pachino', 'ciliegini', 'datterini'],
  patate: ['patat'],
  cipolle: ['cipoll', 'scalogn', 'porr'],
  aglio: ['aglio'],
  carote: ['carot'],
  zucchine: ['zucchin', 'cetriol', 'zucca'],
  melanzane: ['melanzan'],
  peperoni: ['peperon', 'peperoncin'],
  funghi: ['fungh', 'champignon', 'porcini'],
  broccoli: ['broccol', 'cavolfior', 'cavolini', 'carciof', 'asparag', 'finocch', 'sedano', 'fagiolini'],
  pasta: ['pasta', 'spaghetti', 'penne', 'fusilli', 'rigatoni', 'farfalle', 'tagliatelle', 'lasagne', 'gnocchi', 'tortellini', 'ravioli', 'orecchiette', 'linguine', 'paccheri', 'bucatini', 'maccheroni', 'noodles', 'mezze maniche', 'tortiglioni', 'ditalini', 'pastina', 'conchiglie'],
  riso: ['riso', 'risotto', 'couscous', 'cous cous', 'quinoa', 'farro', 'orzo', 'polenta'],
  'passata di pomodoro': ['passata', 'pelati', 'polpa di pomodoro', 'sugo', 'sughi', 'salsa', 'concentrato', 'ragu'],
  'olio extravergine': ['olio', 'aceto'],
  caffe: ['caffe', 'capsule', 'cialde', 'espresso', 'moka'],
  zucchero: ['zucchero', 'dolcificante', 'stevia'],
  farina: ['farina', 'lievito', 'fecola', 'pangrattato', 'semola', 'amido', 'maizena'],
  biscotti: ['biscott', 'frollini', 'merendin', 'wafer', 'cookies', 'plumcake', 'torta', 'brioche', 'cornett', 'crostatin', 'pan di stelle', 'macine', 'tarallucci', 'savoiardi', 'pandoro', 'panettone', 'colomba'],
  pane: ['pane', 'panin', 'pancarre', 'pan carre', 'piadin', 'focacc', 'tramezzin', 'baguette', 'pane in cassetta', 'pan bauletto', 'tortill', 'pita'],
  crackers: ['cracker', 'fette biscottate', 'gallette', 'taralli', 'friselle', 'schiacciatine'],
  grissini: ['grissin'],
  sale: ['sale'],
  pepe: ['pepe', 'spezie', 'curry', 'paprika', 'cannella', 'noce moscata', 'origano', 'zafferano', 'curcuma', 'peperoncino macinato'],
  'tonno in scatola': ['tonno', 'sardine', 'carne in scatola', 'simmenthal', 'sgombro in scatola'],
  legumi: ['legumi', 'fagiol', 'ceci', 'lenticchi', 'mais', 'olive', 'scatolett', 'piselli in scatola'],
  barattolo: ['marmellat', 'confettur', 'nutella', 'crema spalmabile', 'crema di nocciole', 'miele', 'pesto', 'maionese', 'ketchup', 'senape', 'burro di arachidi', 'sottaceti', 'sottoli', 'capperi', 'dado', 'cacao', 'brodo', 'salsa di soia', 'barattol'],
  cereali: ['cereal', 'muesli', 'granola', 'fiocchi', 'corn flakes', 'porridge', 'avena'],
  te: ['te', 'the', 'tisan', 'camomill', 'infus', 'karkade'],
  cioccolato: ['cioccolat', 'barrett', 'snack', 'kinder', 'caramell', 'dolci', 'gomme', 'chewing gum', 'merende'],
  pizza: ['pizza', 'pizze'],
  patatine: ['patatine', 'chips', 'popcorn', 'pop corn', 'salatini', 'arachidi', 'noccioline', 'frutta secca', 'mandorle', 'noci', 'pistacchi', 'anacardi'],
  acqua: ['acqua'],
  'succo di frutta': ['succo', 'succhi', 'spremuta', 'te freddo', 'estathe', 'smoothie', 'centrifugat'],
  lattina: ['coca', 'cola', 'aranciata', 'bibit', 'tonica', 'gassosa', 'sprite', 'fanta', 'energy', 'red bull', 'redbull', 'chinotto', 'lattin', 'gatorade', 'powerade'],
  vino: ['vino', 'vini', 'prosecco', 'spumante', 'champagne', 'liquor', 'amaro', 'grappa', 'vodka', 'gin', 'rum', 'whisky', 'limoncello', 'aperol', 'campari', 'martini', 'vermouth'],
  birra: ['birra', 'birre'],
  gelato: ['gelat', 'ghiaccioli', 'sorbetto', 'cornetto algida'],
  'piselli surgelati': ['piselli'],
  surgelati: ['surgelat', 'minestrone', 'verdure grigliate', 'ghiaccio', 'sofficini', 'frozen'],
  'detersivo piatti': ['detersivo piatti', 'detersivo per piatti', 'detersivo stoviglie', 'svelto', 'nelsen', 'piatti a mano'],
  'pastiglie lavastoviglie': ['sale lavastoviglie', 'sale per lavastoviglie', 'lavastoviglie', 'pastiglie', 'brillantante', 'caps lavastoviglie', 'finish'],
  'detersivo lavatrice': ['lavatrice', 'bucato', 'detersivo', 'smacchiatore', 'sapone di marsiglia', 'dixan', 'dash', 'perlana', 'caps'],
  flacone: ['candeggina', 'ammorbidente', 'pavimenti', 'lavapavimenti', 'ace', 'wc', 'anitra', 'idraulico', 'disgorgante', 'mastro lindo'],
  secchio: ['mocio', 'scopa', 'secchio', 'paletta'],
  panno: ['panni', 'panno', 'strofinacci', 'microfibra', 'swiffer', 'salviette', 'salviettine', 'stracci', 'guanti'],
  'sacchi spazzatura': ['sacchi', 'sacchetti', 'spazzatura', 'immondizia', 'pattumiera', 'umido', 'buste', 'differenziata'],
  'carta da cucina': ['carta da cucina', 'scottex', 'carta assorbente', 'rotoloni', 'asciugatutto', 'carta cucina'],
  spugne: ['spugn', 'pagliett', 'spazzol'],
  sgrassatore: ['sgrassator', 'spray', 'vetri', 'anticalcare', 'multiuso', 'chanteclair', 'cif', 'viakal', 'bagno spray'],
  'carta igienica': ['carta igienica', 'igienica'],
  dentifricio: ['dentifric'],
  spazzolino: ['spazzolin', 'filo interdentale', 'scovolin', 'testine'],
  shampoo: ['shampoo', 'balsamo', 'collutorio', 'maschera', 'tinta', 'colluttorio'],
  bagnoschiuma: ['bagnoschiuma', 'doccia', 'docciaschiuma', 'bagno'],
  'sapone mani': ['sapone', 'igienizzante', 'gel mani'],
  deodorante: ['deodorant', 'profum', 'lacca'],
  rasoio: ['rasoi', 'lamette', 'schiuma da barba', 'dopobarba', 'gillette', 'ceretta', 'strisce depilatorie'],
  crema: ['crema', 'creme', 'latte detergente', 'struccante', 'solare', 'burrocacao', 'balsamo labbra', 'idratante', 'body lotion', 'mascara', 'trucco', 'fondotinta', 'rossetto'],
  assorbenti: ['assorbent', 'salvaslip', 'tampon', 'proteggislip', 'coppetta'],
  cotone: ['cotone', 'cotton', 'dischetti', 'bastoncini cotonati', 'ovatta'],
  pannolini: ['pannolin', 'salviettine bambini', 'baby'],
  paracetamolo: ['paracetamolo', 'tachipirina', 'ibuprofene', 'moment', 'oki', 'aspirin', 'brufen', 'nurofen', 'antidolorific', 'compresse', 'antibiotic', 'antistaminic', 'farmac', 'medicin', 'pillol', 'pastiglie per', 'efferalgan', 'voltaren', 'gaviscon', 'imodium', 'bentelan', 'antinfiammator'],
  sciroppo: ['sciropp', 'gocce', 'spray nasale', 'collirio', 'fluimucil', 'aerosol', 'soluzione fisiologica', 'fisiologica'],
  vitamine: ['integrator', 'vitamin', 'magnesio', 'potassio', 'fermenti', 'probiotic', 'omega', 'melatonina', 'supradyn', 'multicentrum', 'enterogermina'],
  termometro: ['termometr'],
  cerotti: ['cerott', 'garze', 'garza', 'bende', 'benda', 'fasce'],
  disinfettante: ['disinfettant', 'acqua ossigenata', 'betadine', 'amuchina', 'alcol', 'alcool', 'citrosil'],
  batterie: ['batteri', 'pile', 'pila', 'stilo', 'ministilo'],
  lampadine: ['lampadin', 'led'],
  pellicola: ['pellicola', 'carta forno', 'domopak', 'sacchetti gelo', 'sacchetti freezer', 'sacchetti alimenti', 'zip'],
  alluminio: ['alluminio', 'stagnola', 'vaschette'],
  fazzoletti: ['fazzolett', 'kleenex'],
  tovaglioli: ['tovagliol', 'tovaglie', 'piatti di carta', 'piatti di plastica', 'bicchieri', 'posate di plastica', 'cannucce'],
  candele: ['candel', 'fiammifer', 'accendin', 'incenso'],
  animali: ['gatto', 'gatti', 'cane', 'cani', 'croccantin', 'crocchett', 'lettiera', 'sabbia', 'cibo per', 'antiparassitario', 'pet'],
};

const key = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’`]/g, ' ').replace(/\s+/g, ' ').trim();

// Elenco [parola, icona]: i nomi stessi delle icone valgono come parole
const RULES = [];
for (const id of Object.keys(ICONS)) RULES.push([key(id), id]);
for (const [id, words] of Object.entries(WORDS)) for (const w of words) RULES.push([key(w), id]);

const isLetter = (ch) => /[a-z0-9]/.test(ch || '');
function findIcon(name) {
  const n = key(name);
  if (!n) return null;
  if (ICONS[n]) return n;
  let best = null;
  for (const [w, id] of RULES) {
    let i = n.indexOf(w);
    while (i >= 0) {
      const startOk = i === 0 || !isLetter(n[i - 1]);
      // le parole cortissime ("te", "ace", "wc") devono essere intere
      const endOk = w.length > 3 || !isLetter(n[i + w.length]);
      if (startOk && endOk) {
        if (!best || i < best.i || (i === best.i && w.length > best.len)) best = { i, len: w.length, id };
        break;
      }
      i = n.indexOf(w, i + 1);
    }
  }
  return best ? best.id : null;
}

function genericFor(category) {
  const c = key(category);
  for (const k of Object.keys(GENERIC)) if (c.includes(k)) return GENERIC[k];
  if (c.includes('verdur')) return GENERIC.frutta;
  if (c.includes('medicin')) return GENERIC.farmaci;
  if (c.includes('bagno') || c.includes('persona')) return GENERIC.igiene;
  return GENERIC.frutta; // un cestino della spesa
}

const svg = (paths) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const hasIcon = (name) => Boolean(findIcon(name));

// Tassello con l'icona del prodotto; se non c'è, l'icona (più chiara) della sua categoria
export function itemIcon(name, category = '') {
  const id = findIcon(name);
  if (id) return `<span class="ico">${svg(ICONS[id])}</span>`;
  return `<span class="ico gen" title="Icona generica">${svg(genericFor(category))}</span>`;
}

export const ICON_NAMES = Object.keys(ICONS);
export const _findIcon = findIcon; // per le prove
