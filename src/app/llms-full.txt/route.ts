import { buildLlmsText, llmsResponse } from '@/lib/llms';

export const dynamic = 'force-static';
export const revalidate = 86400;

// llms-full.txt: the whole portfolio in one Markdown file, so an assistant can answer without crawling every page.
export async function GET() {
  return llmsResponse(await buildLlmsText(true));
}
