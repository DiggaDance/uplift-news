import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ProcessedArticle {
  isPositive: boolean;
  title: string;
  summary: string;
  category: string;
  imageQuery: string;
}

export async function processArticle(article: {
  title: string;
  content: string;
  source: string;
}): Promise<ProcessedArticle> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Du bist Redakteur für Uplift.news, eine deutsche Nachrichtenwebsite für positive Nachrichten.

Analysiere diesen Artikel und antworte NUR mit einem JSON-Objekt — kein weiterer Text:

Titel: ${article.title}
Inhalt: ${article.content.substring(0, 1500)}
Quelle: ${article.source}

JSON-Format:
{
  "isPositive": true,
  "title": "Emotionale, klickstarke deutsche Überschrift (max. 12 Wörter)",
  "summary": "Drei inspirierende Sätze auf Deutsch, die den positiven Kern erzählen.",
  "category": "Wissenschaft|Natur|Menschen|Wirtschaft|Gesundheit|Tiere",
  "imageQuery": "english image search term (2-3 words)"
}

Regeln:
- isPositive = true nur wenn wirklich positiv, konstruktiv oder hoffnungsvoll
- Negative, alarmierende oder polarisierende Inhalte → isPositive: false
- Titel max. 12 Wörter, emotional und klickstark
- Summary: genau 3 Sätze auf Deutsch
- imageQuery: einfacher englischer Begriff für ein passendes Unsplash-Bild`,
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Keine JSON-Antwort von Claude');
  return JSON.parse(match[0]) as ProcessedArticle;
}
