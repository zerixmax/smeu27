import type { APIRoute } from 'astro';
import cjenikData from '../data/cjenik.json';
import { buildCsv, buildCsvFileName, csvResponse } from '../lib/cjenik';

export const GET: APIRoute = async () => {
  return csvResponse(buildCsv(cjenikData), buildCsvFileName(cjenikData));
};