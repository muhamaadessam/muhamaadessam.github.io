import { buildLlmsText, llmsResponse } from '@/lib/llms';

export const dynamic = 'force-static';
export const revalidate = 86400;

// llms.txt: a plain-Markdown summary of the site for AI assistants and answer engines.
export async function GET() {
  return llmsResponse(await buildLlmsText(false));
}
