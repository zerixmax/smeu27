import type { APIRoute } from 'astro';
import { arkhivaEntries } from '../../lib/arkhiva';
import { buildCsv, buildCsvFileName, csvResponse } from '../../lib/cjenik';
import type { CjenikBaza } from '../../lib/cjenik';

export function getStaticPaths() {
  return arkhivaEntries().map((e) => ({ params: { datum: e.key }, props: { data: e.data } }));
}

export const GET: APIRoute = async ({ props }) => {
  const data = props.data as CjenikBaza;
  return csvResponse(buildCsv(data), buildCsvFileName(data));
};