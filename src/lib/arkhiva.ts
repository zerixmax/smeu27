import type { CjenikBaza } from './cjenik';

export interface ArkhivaEntry {
  key: string;
  data: CjenikBaza;
}

const moduli = import.meta.glob<{ default: CjenikBaza }>('../data/arkhiva/*.json', { eager: true });

export function arkhivaEntries(): ArkhivaEntry[] {
  return Object.entries(moduli)
    .map(([putanja, mod]) => {
      const file = putanja.split('/').pop()!.replace(/\.json$/, '');
      return { key: file, data: mod.default };
    })
    .sort((a, b) => (a.key < b.key ? 1 : -1));
}