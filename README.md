# SuhaMarinaEu27 🛥️

Produkcijska web platforma obrta **Proizd – Suha Marina i vez** (Vela Luka, Korčula), migrirana sa zastarjelog sistema Joomla 3.10.12 na moderan, ultra-brzi **Astro 7** framework.

Projekt je optimiziran prema OleaD standardima: minimalan JavaScript footprint, semantička SEO/GEO optimizacija, lokalizacija (HR/EN/DE), integrirani YouTube Lite modal te puna zakonska usklađenost s mjerama kontrole cijena (NN 101/2026).

---

## 🚀 Tehnološki stack

* **Framework:** [Astro](https://astro.build/) (Static Site Generation / Island Architecture)
* **Tranzicije stranica:** Astro `ClientRouter` (nativni View Transitions)
* **Stilizacija:** [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
* **Fontovi:** Self-hosted Inter & JetBrains Mono (latin + latin-ext, `font-display: swap`)
* **Tipizacija:** TypeScript & Strict Type Checking
* **Optimizacija slika:** `astro:assets` (`<Image />` WebP/AVIF konverzija)
* **Deploy & Poslužitelj:** Docker kontejner na MyDataKnox VPS (Coolify orkestracija)
* **Mail & DNS:** Totohost cPanel (MX i DNS mail zapisi ostaju nepromijenjeni)

---

## ✨ Ključne funkcionalnosti

### 1. Interni Release & Build Tracker (`version.json`)
* Uvedeno interno praćenje verzija i buildova aplikacije kroz datoteku `src/data/version.json`.
* U podnožju stranice (footer) u realnom vremenu se prikazuje oznaka:
  $$\text{v1.0.0\#20260919.1}$$
  zajedno s hover prikazom datuma zadnjeg builda i sažetkom izmjena (changelog), što omogućuje trenutnu provjeru uspješnosti deploya na poslužitelju.

### 2. Puna zakonska usklađenost (NN 101/2026 & HOK)
* **Isticanje sidrene cijene:** Uz svaku aktualnu cijenu usluge vidljivo je istaknuta referentna (sidrena) cijena koja je vrijedila na dan **10. rujna 2026.**
* **Strojno čitljiv cjenik (CSV):** Implementiran dinamički endpoint `/cjenik-download.csv` koji automatski generira datoteku prema službenoj HOK nomenklaturi:
  `USL_VELALUKA_001_0001_YYYYMMDD_HHMM.csv`
* **Arhiva promjena:** Podstranica `/objava-cjenika` osigurava javnu dostupnost svih verzija cjenika minimalno 30 dana od objave. Svaka promjena `src/data/cjenik.json` automatski se pohranjuje kao snapshot u `src/data/arkhiva/` (skripta `scripts/snapshot-cjenik.mjs` pri svakom buildu), a verzije su dostupne i strojno na `/arkhiva/<datum>.csv`.

### 3. Višejezičnost (i18n)
* Podržana 3 jezika bez vanjskih ovisnosti:
  * 🇭🇷 **Hrvatski (HR):** Zadana ruta (`/`)
  * 🇬🇧 **Engleski (EN):** Prefiks (`/en/`)
  * 🇩🇪 **Njemački (DE):** Prefiks (`/de/`)
* Automatski mapirani `hreflang` tagovi za međunarodni SEO.
* Prilagođene poruke za WhatsApp upite ovisno o trenutno aktivnom jeziku posjetitelja.

### 4. Visoka konverzija (CTA) & Mediji
* **Primarni kontakt:** Direktno povezivanje na glavni broj telefona: **`+385 98 954 03 88`**.
* **Mobilni Sticky CTA:** Fiksna traka na dnu mobilnih uređaja za direktan poziv i WhatsApp upit jednim dodirom.
* **YouTube Lite Embed:** Lazy-load komponenta za video isječak (`mxzdmVqcefc`) koja ne usporava početno renderiranje stranice.
* **Kapaciteti:** Istaknute specifikacije kamionskog krana Scania F600 AXP nosivosti 16 tona s 3 širilice za brage te pozicija 500 m od mora.

---

## 📁 Struktura projekta

```text
SuhaMarinaEu27/
├── docs/
│   └── dev-logs/              # Dnevnički zapisi po datumima (SOP)
├── public/
│   ├── favicon.svg            # Glavni SVG favicon
│   ├── favicon.ico
│   ├── robots.txt             # SEO indeksacija i veza na sitemap
│   ├── og-image.jpg           # Social-share slika (Open Graph, 1200x630)
│   └── fonts/                 # Self-hosted Inter & JetBrains Mono (woff2 + fonts.css)
├── scripts/
│   └── snapshot-cjenik.mjs    # Automatska pohrana verzija cjenika u arhivu
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   └── gallery/       # Korištene fotografije krana, hangara i radionice
│   │   └── logos/             # Transparentni PROIZD logo i brendovi partnera
│   ├── components/
│   │   ├── Footer.astro       # OleaD potpis, zakonski linkovi i prikaz verzije
│   │   ├── Navbar.astro       # Navigacija, jezični preklopnik i astro:page-load eventi
│   │   ├── Hero.astro         # Hero s kranom, specifikacijama i YouTube Lite playerom
│   │   ├── Partners.astro     # Logotipi partnera
│   │   ├── ServicesGrid.astro # Mreža usluga (HR/EN/DE)
│   │   ├── Gallery.astro      # Galerija infrastrukture
│   │   ├── PriceTable.astro   # NN 101/2026 cjenik sa sidrenim cijenama
│   │   ├── QuickContactCTA.astro# Fiksni mobilni poziv / WhatsApp
│   │   ├── SEO.astro          # Canonical, hreflang, OpenGraph, Twitter i meta tagovi
│   │   └── Schema.astro       # JSON-LD LocalBusiness strukturirani podaci
│   ├── data/
│   │   ├── cjenik.json        # Verzionirana baza usluga i sidrenih cijena
│   │   ├── arkhiva/           # Snapshotovi prethodnih verzija cjenika (NN 101/2026)
│   │   └── version.json       # Podaci o internoj verziji aplikacije i buildu
│   ├── i18n/
│   │   └── ui.ts              # Rječnik prijevoda i pomoćne i18n funkcije
│   ├── layouts/
│   │   └── Layout.astro       # Bazni HTML kostur s ClientRouterom i fontovima
│   ├── lib/
│   │   ├── cjenik.ts          # Dijeljeni CSV builder i imena datoteka (single source)
│   │   └── arkhiva.ts         # Čitanje i sortiranje snimljenih verzija cjenika
│   └── pages/
│       ├── index.astro        # Glavna stranica (HR)
│       ├── objava-cjenika.astro # Zakonska objava + digitalna arhiva (NN 101/2026)
│       ├── cjenik.csv.ts      # Generiranje strojnog CSV-a po HOK standardu
│       ├── cjenik-download.csv.ts # Alias ruta za /cjenik-download.csv
│       ├── arkhiva/[datum].csv.ts  # Strojni CSV preuzimanje arhivskih verzija
│       ├── 404.astro          # OleaD brendirana stranica greške
│       ├── 500.astro          # Stranica poslužiteljske greške
│       ├── en/
│       │   └── index.astro    # Početna stranica na engleskom jeziku
│       └── de/
│           └── index.astro    # Početna stranica na njemačkom jeziku
├── astro.config.mjs           # i18n sitemap i Tailwind v4 Vite plugin
├── package.json
└── src/styles/global.css      # Tailwind v4 (@import + @theme) i custom utilities
```
