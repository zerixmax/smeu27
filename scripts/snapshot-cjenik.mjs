import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const izvor = join(root, 'src/data/cjenik.json');
const arkhiva = join(root, 'src/data/arkhiva');

function kljuc(datumObjave) {
  const d = new Date(datumObjave);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
}

const data = JSON.parse(readFileSync(izvor, 'utf8'));
const key = kljuc(data.datumObjave);
const out = join(arkhiva, `${key}.json`);

if (existsSync(out)) {
  console.log(`[cjenik-arhiva] verzija ${key} već postoji u arhivi, preskačem`);
} else {
  mkdirSync(arkhiva, { recursive: true });
  writeFileSync(out, JSON.stringify(data, null, 2) + '\n');
  console.log(`[cjenik-arhiva] nova verzija cjenika pohranjena: ${key}.json`);
}