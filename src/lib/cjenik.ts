import type cjenikData from '../data/cjenik.json';

export type CjenikBaza = typeof cjenikData;
export type CjenikStavka = CjenikBaza['stavke'][number];

export function buildCsvFileName(data: CjenikBaza): string {
  const d = new Date(data.datumObjave);
  const YYYY = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const DD = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');

  return `${data.oblik}_${data.adresa}_${data.poslovnica}_${data.brojPohrane}_${YYYY}${MM}${DD}_${HH}${mm}.csv`;
}

export function buildCsv(data: CjenikBaza): string {
  const header = `Naziv usluge,Maloprodajna cijena,Poseban oblik prodaje (DA/NE),Naziv posebnog oblika prodaje,"Sidrena cijena\n10.9.2026."\n`;

  const rows = data.stavke.map(s => {
    const naziv = `"${s.naziv.replace(/"/g, '""')}"`;
    const cijena = s.cijena.toFixed(2).replace('.', ',');
    const poseban = s.posebanOblik;
    const nazivPosebnog = s.nazivPosebnogOblika ? `"${s.nazivPosebnogOblika}"` : '';
    const sidrena = s.sidrenaCijena.toFixed(2).replace('.', ',');
    return `${naziv},${cijena},${poseban},${nazivPosebnog},${sidrena}`;
  }).join('\n');

  return '\uFEFF' + header + rows;
}

export function csvResponse(body: string, fileName: string): Response {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}