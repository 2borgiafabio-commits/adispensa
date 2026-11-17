// Legge la foto del foglio turni di Benedetta senza AI, solo dai colori.
// Il foglio ha una riga per giorno: nella 2ª colonna c'è sempre qualcuno (rosa = BENNI,
// blu = ALESSIO, arancio = KYRIA); a volte c'è un secondo nome nella 3ª colonna.
// I giorni di fila con lo stesso colore non hanno righe divisorie, quindi misuro l'altezza
// del blocco colorato e la divido per i giorni del mese.

const MAX_W = 900;

// Riconosce i colori delle celle (tollerante alla compressione di WhatsApp)
export function colorClass(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max - min < 45) return null;                         // bianco, grigio, testo nero
  if (max < 90) return null;                                // troppo scuro: testo
  if (r > 190 && b > 140 && g < 175 && r - g > 55) return 'pink';
  if (b > 160 && b - r > 55 && g > 100) return 'blue';
  if (r > 190 && b < 110 && g > 70 && g < 175) return 'orange';
  if (g > 150 && g - r > 40 && g - b > 20) return 'green';
  return 'other';
}

async function loadBitmap(source) {
  if (source instanceof HTMLImageElement) return source;
  try {
    return await createImageBitmap(source, { imageOrientation: 'from-image' });
  } catch {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Non riesco a leggere questa foto.'));
      img.src = URL.createObjectURL(source);
    });
  }
}

export async function parseRoster(source, year, month /* 1-12 */, target = 'pink') {
  const bmp = await loadBitmap(source);
  const w0 = bmp.width || bmp.naturalWidth;
  const h0 = bmp.height || bmp.naturalHeight;
  const scale = Math.min(1, MAX_W / w0);
  const W = Math.round(w0 * scale);
  const H = Math.round(h0 * scale);
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(bmp, 0, 0, W, H);
  const px = ctx.getImageData(0, 0, W, H).data;
  const cls = new Array(W * H);
  for (let i = 0, p = 0; i < W * H; i++, p += 4) cls[i] = colorClass(px[p], px[p + 1], px[p + 2]);

  // 1) Colonna dei turni: le x con più pixel colorati, il primo blocco da sinistra
  const colCount = new Array(W).fill(0);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (cls[y * W + x]) colCount[x]++;
  const peak = Math.max(...colCount);
  if (peak < H * 0.2) return { ok: false, error: 'Non trovo le celle colorate dei turni in questa foto.' };
  let x0 = colCount.findIndex((c) => c > peak * 0.6);
  let x1 = x0;
  while (x1 + 1 < W && colCount[x1 + 1] > peak * 0.6) x1++;
  // stringo un po' per evitare i bordi
  const cx0 = Math.round(x0 + (x1 - x0) * 0.08);
  const cx1 = Math.round(x1 - (x1 - x0) * 0.08);

  // 2) Altezza del blocco colorato nella colonna dei turni
  const rowColored = (y) => {
    let n = 0;
    let tot = 0;
    for (let x = cx0; x <= cx1; x++) { tot++; if (cls[y * W + x]) n++; }
    return n / tot;
  };
  let y0 = 0;
  while (y0 < H && rowColored(y0) < 0.5) y0++;
  let y1 = H - 1;
  while (y1 > y0 && rowColored(y1) < 0.5) y1--;
  const days = new Date(year, month, 0).getDate();
  const rowH = (y1 - y0 + 1) / days;
  if (rowH < 6) return { ok: false, error: 'La foto è troppo piccola per leggere i giorni.' };

  // 3) Per ogni giorno: i colori presenti nella sua fascia, da sinistra a destra
  const result = [];
  const warnings = [];
  for (let d = 0; d < days; d++) {
    const ya = Math.round(y0 + rowH * (d + 0.25));
    const yb = Math.round(y0 + rowH * (d + 0.75));
    const segs = [];
    let cur = null;
    for (let x = x0; x < W; x++) {
      const counts = {};
      let colored = 0;
      for (let y = ya; y <= yb; y++) {
        const c = cls[y * W + x];
        if (c) { counts[c] = (counts[c] || 0) + 1; colored++; }
      }
      const best = colored > (yb - ya + 1) * 0.35 ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] : null;
      if (best && cur && cur.c === best) { cur.end = x; }
      else if (best) { cur = { c: best, start: x, end: x }; segs.push(cur); }
      else { cur = cur && x - cur.end <= 6 ? cur : null; }
    }
    // Quanto colore "suo" c'è nella fascia del giorno (il testo nelle celle spezza i blocchi,
    // quindi conto i pixel invece di cercare un blocco intero)
    let mine = 0;
    let colored = 0;
    for (let y = ya; y <= yb; y++) {
      for (let x = x0; x < W; x++) {
        const c = cls[y * W + x];
        if (c) colored++;
        if (c === target) mine++;
      }
    }
    const cellArea = (x1 - x0) * (yb - ya + 1);
    if (colored < cellArea * 0.3) warnings.push(d + 1);
    result.push({
      day: d + 1,
      colors: [...new Set(segs.filter((s) => s.end - s.start > (x1 - x0) * 0.1).map((s) => s.c))],
      works: mine > cellArea * 0.25,
    });
  }
  return { ok: true, days: result, warnings, rowH };
}
