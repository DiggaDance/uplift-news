import { getDb } from './db';
import { fetchAllFeeds } from './rss';
import { processArticle } from './ai';
import { fetchUnsplashImage } from './images';

export async function runNewsProcessor() {
  const db = getDb();
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  console.log('[Processor] ▶ Starte Nachrichten-Verarbeitung...');

  const articles = await fetchAllFeeds();
  console.log(`[Processor] ${articles.length} Artikel aus RSS-Feeds geladen`);

  const insertProcessed = db.prepare(`
    INSERT OR IGNORE INTO articles
      (url, title, summary, category, image_url, source, source_url, published_at, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const article of articles) {
    if (!article.url) { skipped++; continue; }

    const existing = db.prepare('SELECT id FROM articles WHERE url = ?').get(article.url);
    if (existing) { skipped++; continue; }

    try {
      console.log(`[Processor] Verarbeite: ${article.title.substring(0, 60)}…`);

      const result = await processArticle({
        title: article.title,
        content: article.content,
        source: article.source,
      });

      if (!result.isPositive) {
        console.log(`[Processor] ✗ Verworfen (nicht positiv): ${article.title.substring(0, 50)}`);
        insertProcessed.run(
          article.url, null, null, null, null,
          article.source, article.sourceUrl, article.publishedAt, 'rejected'
        );
        skipped++;
        continue;
      }

      const imageUrl = await fetchUnsplashImage(result.imageQuery);

      insertProcessed.run(
        article.url,
        result.title,
        result.summary,
        result.category,
        imageUrl,
        article.source,
        article.sourceUrl,
        article.publishedAt,
        'published'
      );

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
