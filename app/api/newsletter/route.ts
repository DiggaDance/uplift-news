import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string };
    const email = body.email?.trim();

    if (!email || !email.includes('@') || !email.includes('.')) {
      return Response.json({ error: 'Bitte eine gültige E-Mail-Adresse eingeben.' }, { status: 400 });
    }

    try {
      await sql`INSERT INTO newsletter_subscribers (email) VALUES (${email})`;
      return Response.json({ success: true, message: 'Erfolgreich angemeldet! Willkommen bei Uplift.news.' });
    } catch {
      return Response.json({ error: 'Diese E-Mail ist bereits angemeldet.' }, { status: 409 });
    }
  } catch {
    return Response.json({ error: 'Serverfehler. Bitte versuche es später.' }, { status: 500 });
  }
}
