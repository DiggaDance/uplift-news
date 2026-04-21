export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const cron = await import('node-cron');
    const { runNewsProcessor } = await import('./lib/processor');

    console.log('[Cron] Registriere RSS-Cron-Job (alle 3 Stunden)…');

    cron.schedule('0 */3 * * *', async () => {
      console.log('[Cron] Starte geplante Nachrichten-Verarbeitung…');
      try {
        await runNewsProcessor();
      } catch (err) {
        console.error('[Cron] Fehler:', err);
      }
    });

    console.log('[Cron] ✓ Aktiv. Nächster Lauf zur nächsten vollen 3. Stunde.');
  }
}
