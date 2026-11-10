# A'Dispensa

Le scorte di casa, condivise in famiglia. Web app da aggiungere alla schermata Home del telefono.

## Cosa fa (fase 1)

- **Spesa**: lista di cosa manca, per categoria e filtrabile per negozio. Spunti = comprato (con "Annulla"). Swipe: *Finito* (urgente) o *Togli*.
- **Scorte**: tutti i prodotti. Swipe a sinistra: *In spesa* (o *Togli* se c'è già). Le quantità si cambiano dalla scheda del prodotto; sotto la soglia minima un prodotto va in lista da solo.
- **Scontrini**: si fotografano o si caricano le foto degli scontrini, visibili a tutta la famiglia. Per ora si salvano e basta: serviranno per il menu Spese.
- **Scadenze**: per ora nascoste (in `js/app.js`, `SHOW_EXPIRY = true` le riattiva; i dati restano).
- **Aggiungi**: scrivi o detta "latte, uova, pane" e premi Invio. I prodotti nuovi finiscono nella categoria giusta da soli.
- Ogni azione viene registrata: servirà alla fase 3 per prevedere quando finisce qualcosa (si attiva solo dopo almeno 3 riacquisti in 2 mesi).
- Funziona offline: le modifiche partono appena torna la rete.

## Collegare il database (una volta sola)

Senza database l'app funziona solo su un telefono. Per condividerla:

1. Su [supabase.com](https://supabase.com/dashboard) crea un **nuovo progetto** `adispensa` (separato da Neonatae), regione **Frankfurt (eu-central-1)**. Salva la password del database nel gestore password.
2. **SQL Editor** → New query → incolla tutto `supabase/schema.sql` → **Run**. Poi, in una nuova query, `supabase/002_scontrini.sql` → **Run** (crea la tabella e lo spazio privato per le foto degli scontrini).
3. **Authentication → Sign In / Providers** → attiva **Allow anonymous sign-ins** → Save.
4. **Project Settings → API Keys**: copia il *Project URL* e la chiave **publishable** (o *anon*) dentro `js/config.js`.
   - Queste due sono fatte per stare nell'app: si possono vedere senza rischi.
   - **Mai** la chiave *secret* / *service_role*: quella non va né nell'app né in chat.
5. Se avevi già creato la casa in modalità prova: *Impostazioni → Condividi con la famiglia* la porta online senza perdere niente.

## Pubblicare (come GymBro)

Repository GitHub `2borgiafabio-commits/adispensa` con GitHub Pages attivo sul ramo `main`.
L'app sarà su `https://2borgiafabio-commits.github.io/adispensa/`.

Sull'iPhone: apri il link in **Safari** → *Condividi* → **Aggiungi alla schermata Home**.

## Sicurezza

- Ogni telefono entra con un accesso anonimo; il **codice famiglia** lo fa entrare nella casa.
- Le regole del database (RLS) fanno vedere a ciascuno solo i dati della propria casa.
- Chi ha il codice vede tutto: dallo solo ai familiari.

## Prossime fasi

- **Fase 2**: codice a barre, Siri (Comandi Rapidi), notifiche push e riepilogo prima della spesa.
- **Fase 3**: scontrino, menu Spese/budget, previsioni stagionali.

## Per sviluppare

```bash
python3 -m http.server 8468
```

Poi apri `http://localhost:8468/?nosw` (`?nosw` disattiva la cache offline mentre lavori).
Quando cambi i file, aggiorna `VERSION` in `sw.js` per far scaricare la nuova versione ai telefoni.
