import { sql } from './db';
import { fetchAllFeeds } from './rss';
import { processArticle } from './ai';
import { fetchUnsplashImage } from './images';

export async function runNewsProcessor() {
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  console.log('[Processor] ▶ Starte Nachrichten-Verarbeitung...');

  const articles = await fetchAllFeeds();
  console.log(`[Processor] ${articles.length} Artikel aus RSS-Feeds geladen`);

  for (const article of articles) {
    if (!article.url) { skipped++; continue; }

    const existing = await sql`SELECT id FROM articles WHERE url = ${article.url}`;
    if (existing.length > 0) { skipped++; continue; }

    try {
      console.log(`[Processor] Verarbeite: ${article.title.substring(0, 60)}…`);

      const result = await processArticle({
        title: article.title,
        content: article.content,
        source: article.source,
      });

      if (!result.isPositive) {
        console.log(`[Processor] ✗ Verworfen (nicht positiv): ${article.title.substring(0, 50)}`);
        await sql`
          INSERT INTO articles (url, title, summary, category, image_url, source, source_url, published_at, status)
          VALUES (${article.url}, ${null}, ${null}, ${null}, ${null},
                  ${article.source}, ${article.sourceUrl}, ${article.publishedAt}, 'rejected')
          ON CONFLICT (url) DO NOTHING`;
        skipped++;
        continue;
      }

      const imageUrl = await fetchUnsplashImage(result.imageQuery);

      await sql`
        INSERT INTO articles (url, title, summary, category, image_url, source, source_url, published_at, status)
        VALUES (${article.url}, ${result.title}, ${result.summary}, ${result.category}, ${imageUrl},
                ${article.source}, ${article.sourceUrl}, ${article.publishedAt}, 'published')
        ON CONFLICT (url) DO NOTHING`;

      console.log(`[Processor] ✓ Gespeichert: ${result.title}`);
      processed++;

      await new Promise((r) => setTimeout(r, 400));
    } catch (err) {
      console.error(`[Processor] Fehler:`, err instanceof Error ? err.message : err);
      errors++;
    }
  }

  console.log(`[Processor] ■ Fertig — Neu: ${processed} | Übersprungen: ${skipped} | Fehler: ${errors}`);
  return { processed, skipped, errors };
}
