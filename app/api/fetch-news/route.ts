import { runNewsProcessor } from '@/lib/processor';

export async function GET() {
  try {
    const result = await runNewsProcessor();
    return Response.json({ success: true, ...result });
  } catch (err) {
    return Response.json(
      { success: false, error: err instanceof Error ? err.message : 'Unbekannter Fehler' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
