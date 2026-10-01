# Tehnička dokumentacija projekta: Suha Marina PROIZD (suhamarina.eu)

**Verzija dokumentacije:** 1.0.0  
**Datum ažuriranja:** 19. rujna 2026.  
**Autor:** OleaD  
**Klijent:** Obrt Proizd – Suha Marina, Vela Luka, Otok Korčula  

---

## 1. Pregled projekta

Cilj projekta je kompletna modernizacija i migracija web stranice s naslijeđenog Joomla 3.10.12 CMS-a na suvremeni statički generiran web stog (Jamstack) pogonjen **Astro** razvojnim okvirom.

Nova web stranica donosi:
- **Maksimalne performanse i brzinu učitavanja** (statički HTML bez serverskog opterećenja).
- **Zakonito isticanje cijena (NN 101/2026)** s referentnim/sidrenim cijenama i strojnim CSV izvozom usklađenim s HOK predloškom.
- **Višejezičnost (i18n)** s podrškom za hrvatski (HR), engleski (EN) i njemački (DE) jezik.
- **Optimiziranu konverziju na mobilnim uređajima** putem trajnog (sticky) CTA panela za poziv i WhatsApp upite.
- **Strukturirane SEO podatke (Schema.org)** i `hreflang` jezične anotacije.

---

## 2. Tehnološki stog (Tech Stack)

| Tehnologija | Uloga / Opis |
|---|---|
| **Astro** | Glavni web framework (Static Site Generation - SSG) |
| **TypeScript** | Statička tipizacija (`strict` način rada) |
| **Tailwind CSS v4** | Suvremeno stiliziranje u tamnoj nautičkoj temi (`@tailwindcss/vite`) |
| **Self-hosted fontovi** | Inter & JetBrains Mono, **4 variable WOFF2 datoteke** (`public/fonts/`, `font-display: swap`) |
| **Astro Assets** | Automatska konverzija i kompresija slika u WebP formatu |
| **Astro ClientRouter** | SPA tranzicije među stranicama bez ponovnog učitavanja |
| **Schema.org JSON-LD** | Strukturirani podaci za lokalno poslovanje (*LocalBusiness*, *EmergencyService*, *Service*) |
| **Nginx (`nginx:alpine`)** | Produkcijski poslužitelj statičkog sadržaja (gzip + cache politike po tipu asseta) |

---

## 3. Struktura direktorija projekta

```text
suhamarinaeu27/
├── docs/
│   ├── dev-logs/
│   │   ├── 2026-09-19.md       # Dnevnik rada i kronologija promjena po sesijama
│   │   └── 2026-10-01.md       # Optimizacija LCP/fonata/usluga, landing, nginx
│   └── DOKUMENTACIJA.md        # Glavni tehnički dokument projekta
├── scripts/
│   └── snapshot-cjenik.mjs     # Automatska pohrana verzija cjenika u arhivu (pre-build)
├── nginx.conf                  # Nginx konfiguracija produkcijskog kontejnera
├── Dockerfile                  # Dvofazni build: Node (build) → nginx:alpine (serving)
├── public/                     # Statičke datoteke (favicon, robots.txt, fontovi, og-image)
│   ├── fonts/                  # 4 variable WOFF2 (Inter, JetBrains Mono; latin + latin-ext)
│   │   ├── fonts.css           # @font-face s weight-range deskriptorima
│   │   ├── Inter-var-latin.woff2 / Inter-var-latin-ext.woff2
│   │   └── JetBrainsMono-var-latin.woff2 / JetBrainsMono-var-latin-ext.woff2
│   └── version.json            # Javni izlaz verzije (sinkroniziran s src/data/version.json)
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   └── gallery/        # Galerija visoke rezolucije (kran, hangar, servis)
│   │   └── logos/              # Vektorski i rasterski logotipi brendova i obrta
│   ├── components/             # Modularne Astro komponente
│   ├── data/
│   │   ├── cjenik.json         # Središnji izvor podataka o cijenama i uslugama
│   │   ├── version.json        # Verzija/build prikazana u podnožju
│   │   └── arkhiva/            # Snapshotovi svih objavljenih verzija cjenika
│   ├── i18n/
│   │   └── ui.ts               # Rječnik prijevoda (HR, EN, DE) i useTranslations hook
│   ├── layouts/
│   │   └── Layout.astro        # Glavni HTML kostur sa SEO, meta, fontovima i Schema.org
│   ├── lib/                    # Dijeljeni moduli (CSV builder, arhiva)
│   └── pages/
│       ├── index.astro         # Glavna stranica (hrvatski jezik)
│       ├── objava-cjenika.astro# Javna objava + digitalna arhiva cjenika
│       ├── ugradnja-minn-kota-garmin-force-korcula.astro # Landing stranica (HR)
│       ├── cjenik.csv.ts       # Dinamički generator CSV datoteke prema NN 101/2026
│       ├── cjenik-download.csv.ts # Alias ruta za /cjenik-download.csv
│       ├── arkhiva/[datum].csv.ts # Strojni CSV preuzimanje arhiviranih verzija
│       ├── en/                 # Engleska verzija stranice
│       └── de/                 # Njemačka verzija stranice
├── astro.config.mjs            # Konfiguracijska datoteka Astra (sitemap, Tailwind v4)
├── package.json                # Ovisnosti projekta i npm skripte
├── src/styles/global.css       # Tailwind v4 (@import + @theme) i custom utilities
└── tsconfig.json               # TypeScript pravila
```

---

## 4. Zakonska usklađenost cjenika (NN 101/2026)

U skladu s propisima o transparentnosti cijena i odlukom o isticanju dodatnih cijena u RH, implementiran je mehanizam dvojnog i strojnog prikaza cijena.

### 4.1. Centralni podaci (`src/data/cjenik.json`)
Cjenik je definiran kroz strukturirani JSON koji sadrži:
- **Podatke o subjektu:** Naziv, adresa poslovnice, oznaka oblika (`USL`), broj pohrane i vremenska oznaka objave.
- **Stavke usluga:**
  - `cijena`: Trenutna maloprodajna cijena u EUR (€).
  - `sidrenaCijena`: Referentna cijena koja je vrijedila na propisani referentni dan (10.9.2026.).
  - `posebanOblik`: Oznaka posebnog oblika prodaje (`DA`/`NE`).
  - Višejezične nazive i opise usluga.

### 4.2. Generiranje strojnog CSV izvoza (`src/lib/cjenik.ts`, `src/pages/cjenik.csv.ts`)
Zajednički modul `src/lib/cjenik.ts` centralno gradi CSV i naziv datoteke (jedinstveni izvor istine), a ruta `/cjenik.csv` (i alias `/cjenik-download.csv`) izlaže trenutni cjenik prema službenom predlošku Hrvatske obrtničke komore (HOK):
- **Naziv datoteke:**  
  `OBLIK_ADRESA_POSLOVNICA_BROJPOHRANE_YYYYMMDD_HHmm.csv`  
  *(Primjer: `USL_VELALUKA_001_0001_20261001_0755.csv`)*
- **Enkodiranje:** UTF-8 s oznakom redoslijeda bajtova (BOM: `\uFEFF`) kako bi se datoteka ispravno otvorila u Microsoft Excelu s hrvatskim dijakritičkim znakovima (č, ć, ž, š, đ).
- **Format brojeva:** Decimalni brojevi formatirani su sa zarezom (npr. `120,00`).

### 4.3. Digitalna arhiva verzija cjenika (`scripts/snapshot-cjenik.mjs`, `/arkhiva/[datum].csv`)
Sukladno članku 4. Odluke (NN 101/2026) prethodne verzije cjenika čuvaju se ≥30 dana:
- Pri svakom `npm run build`, skripta `scripts/snapshot-cjenik.mjs` uspoređuje `src/data/cjenik.json` s najnovijim snapshotom u `src/data/arkhiva/` i uvijek pohranjuje novu verziju (`YYYY-MM-DD_HHmm.json`) ako se razlikuje.
- Stranica `/objava-cjenika` prikazuje tablicu svih arhiviranih verzija s naknadom "Aktualni" na trenutnu.
- Svaka arhivirana verzija strojno je dostupna na `/arkhiva/<datum>.csv` (isti HOK format).

---

## 5. Sustav višejezičnosti (i18n)

Implementiran je lagan i proširiv sustav prevođenja u `src/i18n/ui.ts`.

- **Zadani jezik:** `hr` (Hrvatski).
- **Podržani jezici:** `hr`, `en`, `de`.
- **Korištenje u komponentama:**
  ```astro
  ---
  import { useTranslations } from '../i18n/ui';
  const t = useTranslations('hr');
  ---
  <h1>{t('hero.title_pre')}</h1>
  ```
- Ako ključ nedostaje u odabranom jeziku, funkcija automatski vraća hrvatsku varijantu kao fallback.

---

## 6. Optimizacija performansi i medija

1. **Astro Assets (`<Image />`):**  
   Sve slike u galeriji i logotipi partnera automatski se dimenzioniraju, komprimiraju i poslužuju u suvremenom `.webp` formatu pri generiranju stranice. Širine u `srcset`-u **ne smiju prelaziti nativnu rezoluciju** izvorne slike (upscale samo troši bandwidth); `Hero.astro` zato koristi `widths={[360, 450]}` uz `loading="eager"` i `fetchpriority="high"` jer je hero slika **LCP element**.
2. **Self-hosted variable fontovi:**  
   `public/fonts/fonts.css` deklariira **4 `@font-face` bloka** (Inter + JetBrains Mono × latin/latin-ext) s weight-range deskriptorima (`100 900` / `400 800`) i `font-display: swap`. Inter i JetBrains Mono su na Google Fonts-u objavljeni kao **variable fontovi** — sve težine dijele isti URL, pa su 16 zasebnih datoteka bile identičan duplikat (~885 KB → 176 KB), a uz to se variable font renderirao clamp-an na 400 pa `font-extrabold`/`font-black` **nije radio**. Oba Inter podskupa se preloadaju jer su hrvatski dijakritici (č, ć, ž, š, đ) u `latin-ext`.
3. **YouTube Lite Fasada:**  
   Umjesto učitavanja teškog YouTube iframea pri prvom prikazu (što bi usporilo učitavanje za preko 1 MB i više od 20 mrežnih zahtjeva), prikazuje se optimizirana slika naslovnice s gumbom za reprodukciju. Pravi YouTube iframe učitava se tek na korisnički klik.
4. **Google Maps Fasada** (`src/components/LocationAndReviews.astro`):  
   Embed iframe **nema `src`** u početnom HTML-u — URL je u `data-src` atributu, pa pri inicijalnom učitavanju nema **nijednog** zahtjeva prema Googleu. Mapa se učitava na klik guba ili kad se sekcija približi viewportu (`IntersectionObserver`, `rootMargin: '200px'`). Dok se ne učita, iframe je `aria-hidden="true" tabindex="-1"`, a bez JavaScripta `<noscript>` nudi izravan link na Google Maps. **Sve skripte komponenti slušaju na `astro:page-load`** radi ClientRouter prijelaza.
5. **ClientRouter:**  
   Pruža trenutni prijelaz između stranica bez potpunog osvježavanja preglednika, zadržavajući visoke SEO standarde statičkog HTML-a.
6. **Nginx cache i kompresija** (`nginx.conf`):

   | Lokacija | Cache-Control | Napomena |
   |---|---|---|
   | `/_astro/` | `public, max-age=31536000, immutable` | Astro u ime stavlja content hash → `immutable` je siguran |
   | `/fonts/` | `public, max-age=604800, must-revalidate` | Imena fontova **nisu hash-ana**; nakon uvođenja hasha → 1 godina |
   | `/` (HTML) | `public, max-age=0, must-revalidate` | Osigurava da korisnik ne vidi zastarjeli HTML |
   | `*.csv` | `public, max-age=3600` | Uz `Content-Type: text/csv; charset=utf-8` |

   `gzip` je uključen s `gzip_min_length 256` (samo tekstualni tipovi — woff2/webp/jpg su već komprimirani).

   > **Nginx zamka:** `add_header` u `location` bloku **ne nasljeđuje** `add_header` sa server razine. Svaki `location` s vlastitim `add_header` mora eksplicitno ponoviti sigurnosna zaglavlja, inače ih gubi na tim rutama. Također, uz `expires 1y` **nemojte** dodavati vlastiti `add_header Cache-Control` — dobivate dva zaglavlja.

---

## 7. Razvojne naredbe i rad s projektom

### Pokretanje lokalnog poslužitelja
Prema smjernicama projekta, poslužitelj se pokreće u pozadini:
```bash
astro dev --background
```
Upravljanje poslužiteljem:
- `astro dev status` — provjera statusa
- `astro dev logs` — pregled dnevnika izvođenja
- `astro dev stop` — zaustavljanje poslužitelja

### Provjera tipova koda
```bash
npx astro check
```

### Produkcijska izgradnja (Build)
```bash
npm run build
```
Izlazni optimizirani statički HTML, CSS, JS i WebP mediji smještaju se u direktorij `dist/`, spremni za postavljanje na produkcijski web poslužitelj.

### Provjera nginx konfiguracije (Docker)

`nginx.conf` može se validirati bez pokretanja kontejnera:
```bash
docker run --rm -v "$PWD/nginx.conf:/etc/nginx/conf.d/default.conf:ro" nginx:alpine nginx -t
```

Testiranje zaglavlja na stvarnom poslužitelju (zaustavlja nakon provjere):
```bash
docker run -d --rm --name shm-nginx-test -p 8099:80 \
  -v "$PWD/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
  -v "$PWD/dist:/usr/share/nginx/html:ro" nginx:alpine
curl -s -o /dev/null -D - -H "Accept-Encoding: gzip" http://localhost:8099/
docker stop shm-nginx-test
```

---

## 8. Verzioniranje

Verzija je zapisana u **tri** datoteke koje moraju ostati sinkronizirane:
- `package.json` (`npm version patch --no-git-tag-version`)
- `src/data/version.json` — izvor verzije za footer (`Footer.astro:5`)
- `public/version.json` — javno dostupna kopija iste verzije

Format build ID-a je `YYYYMMDD.N`; footer prikazuje `vX.Y.Z#YYYYMMDD.N`. Nakon svake sesije provjeriti da se ispravna verzija pojavljuje u `dist/index.html`.

Trenutno stanje: **v1.0.9 / `20261001.1`**.
