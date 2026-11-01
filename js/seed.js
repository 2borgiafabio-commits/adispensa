// Dati di partenza: categorie, negozi e prodotti comuni di una casa italiana.

export const COLORS = ['green', 'amber', 'lime', 'cyan', 'teal', 'blue', 'pink', 'purple', 'red', 'gray'];

export const DEFAULT_CATEGORIES = [
  { key: 'frigo',    name: 'Frigo',             color: 'green' },
  { key: 'frutta',   name: 'Frutta e verdura',  color: 'lime' },
  { key: 'dispensa', name: 'Dispensa',          color: 'amber' },
  { key: 'bevande',  name: 'Bevande',           color: 'teal' },
  { key: 'surgelati',name: 'Surgelati',         color: 'cyan' },
  { key: 'pulizia',  name: 'Pulizia',           color: 'blue' },
  { key: 'igiene',   name: 'Igiene',            color: 'pink' },
  { key: 'farmaci',  name: 'Farmaci',           color: 'purple' },
  { key: 'casa',     name: 'Casa',              color: 'gray' },
];

export const DEFAULT_STORES = [
  { key: 'super',    name: 'Supermercato' },
  { key: 'farmacia', name: 'Farmacia' },
  { key: 'mercato',  name: 'Mercato' },
  { key: 'online',   name: 'Online' },
];

// [nome, categoria, negozio, unità]
export const COMMON_ITEMS = [
  ['Latte', 'frigo', 'super', 'bott.'],
  ['Yogurt', 'frigo', 'super', 'vasetti'],
  ['Burro', 'frigo', 'super', 'pz'],
  ['Uova', 'frigo', 'super', 'pz'],
  ['Mozzarella', 'frigo', 'super', 'pz'],
  ['Parmigiano', 'frigo', 'super', 'pz'],
  ['Prosciutto cotto', 'frigo', 'super', 'conf.'],
  ['Mele', 'frutta', 'mercato', 'kg'],
  ['Banane', 'frutta', 'mercato', 'kg'],
  ['Limoni', 'frutta', 'mercato', 'pz'],
  ['Insalata', 'frutta', 'mercato', 'pz'],
  ['Pomodori', 'frutta', 'mercato', 'kg'],
  ['Patate', 'frutta', 'mercato', 'kg'],
  ['Cipolle', 'frutta', 'mercato', 'pz'],
  ['Pasta', 'dispensa', 'super', 'pacchi'],
  ['Riso', 'dispensa', 'super', 'pacchi'],
  ['Passata di pomodoro', 'dispensa', 'super', 'bott.'],
  ['Olio extravergine', 'dispensa', 'super', 'bott.'],
  ['Caffè', 'dispensa', 'super', 'pacchi'],
  ['Zucchero', 'dispensa', 'super', 'kg'],
  ['Farina', 'dispensa', 'super', 'kg'],
  ['Biscotti', 'dispensa', 'super', 'pacchi'],
  ['Pane', 'dispensa', 'super', 'pz'],
  ['Sale', 'dispensa', 'super', 'pacchi'],
  ['Tonno in scatola', 'dispensa', 'super', 'scatolette'],
  ['Legumi', 'dispensa', 'super', 'scatolette'],
  ['Acqua', 'bevande', 'super', 'casse'],
  ['Succo di frutta', 'bevande', 'super', 'bott.'],
  ['Piselli surgelati', 'surgelati', 'super', 'buste'],
  ['Detersivo piatti', 'pulizia', 'super', 'bott.'],
  ['Pastiglie lavastoviglie', 'pulizia', 'super', 'conf.'],
  ['Detersivo lavatrice', 'pulizia', 'super', 'bott.'],
  ['Sacchi spazzatura', 'pulizia', 'super', 'rotoli'],
  ['Carta da cucina', 'pulizia', 'super', 'rotoli'],
  ['Spugne', 'pulizia', 'super', 'pz'],
  ['Sgrassatore', 'pulizia', 'super', 'bott.'],
  ['Carta igienica', 'igiene', 'super', 'rotoli'],
  ['Dentifricio', 'igiene', 'super', 'tubetti'],
  ['Shampoo', 'igiene', 'super', 'bott.'],
  ['Bagnoschiuma', 'igiene', 'super', 'bott.'],
  ['Sapone mani', 'igiene', 'super', 'bott.'],
  ['Deodorante', 'igiene', 'super', 'pz'],
  ['Paracetamolo', 'farmaci', 'farmacia', 'conf.'],
  ['Cerotti', 'farmaci', 'farmacia', 'conf.'],
  ['Disinfettante', 'farmaci', 'farmacia', 'bott.'],
  ['Batterie', 'casa', 'super', 'pz'],
  ['Lampadine', 'casa', 'online', 'pz'],
  ['Pellicola', 'casa', 'super', 'rotoli'],
  ['Alluminio', 'casa', 'super', 'rotoli'],
  ['Fazzoletti', 'casa', 'super', 'pacchi'],
];

// Parole chiave per indovinare la categoria di un prodotto nuovo
export const CATEGORY_HINTS = {
  frigo: ['latte', 'yogurt', 'burro', 'uova', 'uovo', 'mozzarella', 'formaggio', 'parmigiano', 'prosciutto', 'salame', 'ricotta', 'panna', 'stracchino', 'mortadella', 'bresaola', 'pollo', 'carne', 'pesce', 'affettati', 'wurstel'],
  frutta: ['mele', 'mela', 'banan', 'pere', 'arance', 'limon', 'insalata', 'pomodor', 'patat', 'cipoll', 'aglio', 'zucchin', 'carot', 'frutta', 'verdura', 'basilico', 'prezzemolo', 'fragol', 'uva', 'kiwi', 'peperon', 'melanzan', 'spinaci'],
  dispensa: ['pasta', 'riso', 'passata', 'olio', 'caff', 'zucchero', 'farina', 'biscott', 'pane', 'sale', 'tonno', 'legumi', 'fagioli', 'ceci', 'lenticchie', 'cereali', 'marmellata', 'miele', 'aceto', 'pepe', 'crackers', 'grissini', 'fette biscottate', 'tè', 'the', 'camomilla', 'cioccolat', 'nutella', 'sugo', 'pelati', 'spezie'],
  bevande: ['acqua', 'succo', 'vino', 'birra', 'bibite', 'coca', 'aranciata', 'latte di'],
  surgelati: ['surgelat', 'gelato', 'pizza surg', 'bastoncini', 'minestrone surg'],
  pulizia: ['detersivo', 'lavastoviglie', 'lavatrice', 'sacchi', 'spazzatura', 'carta da cucina', 'scottex', 'spugn', 'sgrassatore', 'candeggina', 'ammorbidente', 'anticalcare', 'brillantante', 'pavimenti', 'vetri', 'panni'],
  igiene: ['carta igienica', 'dentifricio', 'shampoo', 'bagnoschiuma', 'sapone', 'deodorante', 'rasoi', 'lamette', 'spazzolino', 'balsamo', 'crema', 'assorbenti', 'cotone', 'filo interdentale', 'collutorio'],
  farmaci: ['paracetamolo', 'tachipirina', 'ibuprofene', 'moment', 'oki', 'cerott', 'disinfettante', 'garze', 'integrator', 'vitamin', 'sciroppo', 'termometro', 'antistaminico', 'farmac', 'medicin'],
  casa: ['batteri', 'pile', 'lampadin', 'pellicola', 'alluminio', 'fazzoletti', 'tovaglioli', 'candele', 'filtri', 'croccantini', 'crocchette', 'gatto', 'cane', 'lettiera', 'scatolette gatto'],
};

// Parole per generare il codice famiglia (facile da dettare a voce)
export const CODE_WORDS = [
  'BASILICO', 'LIMONE', 'PEPERONE', 'CAROTA', 'OLIVA', 'MANDORLA', 'NOCCIOLA', 'FRAGOLA',
  'CILIEGIA', 'ARANCIA', 'POMODORO', 'CARCIOFO', 'ZUCCA', 'FINOCCHIO', 'RUCOLA', 'CECIO',
  'FAGIOLO', 'LENTICCHIA', 'PISELLO', 'MAIS', 'GRANO', 'FARRO', 'ORZO', 'RISO',
  'PANE', 'GRISSINO', 'BISCOTTO', 'CANNOLO', 'BABA', 'TIRAMISU', 'GELATO', 'CAFFE',
  'MIELE', 'ZAFFERANO', 'ROSMARINO', 'SALVIA', 'ORIGANO', 'MENTA', 'ALLORO', 'TIMO',
  'PECORINO', 'MOZZARELLA', 'RICOTTA', 'BURRATA', 'FONTINA', 'ASIAGO', 'GORGONZOLA', 'PROVOLA',
  'TORTELLINO', 'RAVIOLO', 'GNOCCO', 'LASAGNA', 'FUSILLO', 'PENNA', 'RIGATONE', 'TROFIA',
  'PESCA', 'ALBICOCCA', 'SUSINA', 'MELONE', 'ANGURIA', 'KIWI', 'FICO', 'CASTAGNA',
];
