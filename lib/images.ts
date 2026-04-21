export async function fetchUnsplashImage(query: string): Promise<string | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.warn('[Unsplash] Kein API-Key konfiguriert');
    return null;
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );
    if (!res.ok) {
      console.error(`[Unsplash] Status ${res.status}`);
      return null;
    }
    const data = await res.json();
    return (data.urls?.regular as string) ?? null;
  } catch (err) {
    console.error('[Unsplash] Fehler:', err instanceof Error ? err.message : err);
    return null;
  }
}
