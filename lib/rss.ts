import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 12000,
  headers: { 'User-Agent': 'Uplift.news RSS Reader/1.0' },
});

export const RSS_FEEDS = [
  { url: 'https://www.goodnewsnetwork.org/feed/', name: 'Good News Network' },
  { url: 'https://www.positive.news/feed/', name: 'Positive News' },
  { url: 'https://www.upworthy.com/rss', name: 'Upworthy' },
  { url: 'https://www.thehappybroadcast.com/rss', name: 'The Happy Broadcast' },
  { url: 'https://rss.dw.com/rdf/rss-de-all', name: 'DW News' },
  { url: 'http://feeds.bbci.co.uk/news/science_and_environment/rss.xml', name: 'BBC Science & Environment' },
  { url: 'https://feeds.reuters.com/reuters/scienceNews', name: 'Reuters Science' },
  { url: 'https://newsfeed.zeit.de/wissen/index', name: 'Zeit Wissen' },
  { url: 'https://www.sciencedaily.com/rss/top/science.xml', name: 'Science Daily' },
  { url: 'https://www.nationalgeographic.com/feed/rss', name: 'National Geographic' },
  { url: 'https://www.wwf.de/rss', name: 'WWF Deutschland' },
  { url: 'https://feeds.euronews.com/news/green', name: 'Euronews Green' },
];

export interface RSSArticle {
  url: string;
  title: string;
  content: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
}

export async function fetchAllFeeds(): Promise<RSSArticle[]> {
  const articles: RSSArticle[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      console.log(`[RSS] Lade Feed: ${feed.name}`);
      const result = await parser.parseURL(feed.url);

      const items = (result.items ?? []).slice(0, 15).flatMap((item) => {
        const url = item.link ?? item.guid ?? '';
        const title = item.title ?? '';
        if (!url || !title) return [];
        return [{
          url,
          title,
          content: item.contentSnippet ?? item.content ?? item.summary ?? '',
          source: feed.name,
          sourceUrl: feed.url,
          publishedAt: item.pubDate ?? item.isoDate ?? new Date().toISOString(),
        }];
      });

      console.log(`[RSS] ${feed.name}: ${items.length} Artikel`);
      articles.push(...items);
    } catch (err) {
      console.error(`[RSS] Fehler bei "${feed.name}":`, err instanceof Error ? err.message : err);
    }
  }

  return articles;
}
