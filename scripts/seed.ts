import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, '..', '.env.local') });

if (!process.env.POSTGRES_URL) {
  console.error('POSTGRES_URL is not set. Make sure .env.local exists.');
  process.exit(1);
}

const sql = neon(process.env.POSTGRES_URL);

const articles = [
  {
    url: 'https://www.nature.com/articles/solar-energy-record-2026',
    title: 'Durchbruch: Neue Solarzelle erreicht Wirkungsgrad von 47 Prozent',
    summary: 'Forschenden der Technischen Universität München ist ein bahnbrechender Fortschritt gelungen: Eine neuartige Tandem-Solarzelle aus Perowskit und Silizium wandelt 47 Prozent des Sonnenlichts in Strom um – ein Weltrekord. Die Zelle könnte die Kosten für erneuerbaren Solarstrom um mehr als die Hälfte senken und die Energiewende weltweit erheblich beschleunigen.',
    category: 'Wissenschaft',
    image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    source: 'Nature Energy',
    source_url: 'https://www.nature.com',
  },
  {
    url: 'https://www.science.org/articles/alzheimer-vaccine-trial-2026',
    title: 'Vielversprechender Alzheimer-Impfstoff zeigt erste Erfolge in klinischer Studie',
    summary: 'Ein internationales Forschungsteam unter Leitung des Deutschen Zentrums für Neurodegenerative Erkrankungen (DZNE) meldet beeindruckende Zwischenergebnisse: Ein neuer mRNA-basierter Impfstoff konnte bei Probanden in Phase-II-Studien die Ablagerung von Beta-Amyloid-Plaques im Gehirn um bis zu 68 Prozent reduzieren. Die Wissenschaftlerinnen und Wissenschaftler sind vorsichtig optimistisch, dass sich daraus eine Präventionsstrategie gegen Alzheimer entwickeln lässt.',
    category: 'Wissenschaft',
    image_url: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=800&q=80',
    source: 'Science Magazine',
    source_url: 'https://www.science.org',
  },
  {
    url: 'https://www.wwf.de/berichte/wolf-population-wachstum-2026',
    title: 'Wölfe kehren zurück: Population in Deutschland wächst auf über 2.000 Tiere',
    summary: 'Nach Jahrzehnten der Abwesenheit hat sich der Wolf in Deutschland erfolgreich wiederangesiedelt. Laut aktuellem Monitoringbericht des Bundesamts für Naturschutz leben mittlerweile mehr als 2.000 Wölfe in rund 260 Rudeln hierzulande. Besonders in Brandenburg, Sachsen und Niedersachsen hat sich die Population stabilisiert – ein Zeichen für die Erholung heimischer Ökosysteme.',
    category: 'Natur',
    image_url: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80',
    source: 'WWF Deutschland',
    source_url: 'https://www.wwf.de',
  },
  {
    url: 'https://www.nabu.de/meldungen/korallenriff-wiederherstellung-2026',
    title: 'Großes Korallenriff vor Australien erholt sich schneller als erwartet',
    summary: 'Meeresbiologen des Australian Institute of Marine Science berichten von einer überraschend positiven Entwicklung: Teile des Great Barrier Reef, die durch Bleicheereignisse geschädigt worden waren, zeigen die schnellste natürliche Erholung seit Beginn der systematischen Aufzeichnungen. Neue Korallenstöcke bedecken bereits wieder über 30 Prozent der zuvor kahlen Riffstrukturen – ein Hoffnungszeichen für marine Ökosysteme weltweit.',
    category: 'Natur',
    image_url: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&q=80',
    source: 'NABU',
    source_url: 'https://www.nabu.de',
  },
  {
    url: 'https://www.zeit.de/gesellschaft/schule-finnland-modell-2026',
    title: 'Junger Lehrer aus Bayern revolutioniert Schulunterricht mit finnischem Modell',
    summary: 'Der 29-jährige Grundschullehrer Jonas Berger aus Regensburg hat an seiner Schule ein innovatives Lernkonzept eingeführt, das auf Eigenverantwortung, Neugier und projektbasiertem Lernen basiert. Seitdem sind Fehlzeiten um 40 Prozent gesunken, Noten haben sich verbessert – und die Kinder kommen laut Elternberichten wesentlich motivierter in die Schule. Sein Konzept wird nun in sechs weiteren Bundesländern erprobt.',
    category: 'Menschen',
    image_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80',
    source: 'Die Zeit',
    source_url: 'https://www.zeit.de',
  },
  {
    url: 'https://www.sueddeutsche.de/gesellschaft/gemeinschaft-dorf-wiederbelebung-2026',
    title: 'Wie eine Gemeinschaft aus 40 Familien ein verlassenes Dorf in der Eifel neu belebt',
    summary: 'Das fast verlassene Dorf Kirchweiler in der Eifel hat eine zweite Chance bekommen: Eine Gruppe von 40 Familien aus ganz Deutschland hat sich zusammengefunden, renovierte leerstehende Häuser und baute eine lebendige Dorfgemeinschaft auf. Mit eigenem Gemeindegarten, Schulbus-Netzwerk und gemeinschaftlicher Energieversorgung ist Kirchweiler heute ein Modell für nachhaltiges Zusammenleben auf dem Land.',
    category: 'Menschen',
    image_url: 'https://images.unsplash.com/photo-1464082354059-27db6ce50048?w=800&q=80',
    source: 'Süddeutsche Zeitung',
    source_url: 'https://www.sueddeutsche.de',
  },
  {
    url: 'https://www.handelsblatt.com/wirtschaft/gruendungen-rekordjahr-2026',
    title: 'Rekordjahr für Start-ups: Deutschland verzeichnet höchste Gründungsquote seit 20 Jahren',
    summary: 'Das Bundesministerium für Wirtschaft meldet ermutigende Zahlen: Im Jahr 2025 wurden in Deutschland über 380.000 neue Unternehmen gegründet – so viele wie seit zwei Jahrzehnten nicht. Besonders in den Bereichen GreenTech, HealthTech und KI-Anwendungen boomt die Gründerszene. Frauen stellen mittlerweile 44 Prozent aller Neugründungen – ebenfalls ein historischer Höchstwert.',
    category: 'Wirtschaft',
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80',
    source: 'Handelsblatt',
    source_url: 'https://www.handelsblatt.com',
  },
  {
    url: 'https://www.wirtschaftswoche.de/fairtrade-wachstum-2026',
    title: 'Fairer Handel wächst: Umsatz steigt um 18 Prozent – Bauern profitieren direkt',
    summary: 'Die Fairtrade-Organisation Deutschland meldet das stärkste Wachstum seit ihrer Gründung: Der Umsatz fair gehandelter Produkte stieg 2025 um 18 Prozent auf über 3,2 Milliarden Euro. Besonders erfreulich: Dank der Fairtrade-Prämien konnten mehr als 120.000 Kleinbauernfamilien in Lateinamerika, Afrika und Asien in Schulen, Wasserversorgung und Gesundheitsversorgung investieren.',
    category: 'Wirtschaft',
    image_url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80',
    source: 'WirtschaftsWoche',
    source_url: 'https://www.wiwo.de',
  },
  {
    url: 'https://www.aerzteblatt.de/nachrichten/herzerkrankungen-rueckgang-2026',
    title: 'Herzerkrankungen in Europa auf niedrigstem Stand seit 30 Jahren',
    summary: 'Die Europäische Herzgesellschaft veröffentlichte heute eine wegweisende Studie: Die Sterblichkeitsrate durch Herz-Kreislauf-Erkrankungen in der EU ist auf den niedrigsten Stand seit drei Jahrzehnten gesunken. Als Hauptgründe nennen die Forschenden verbesserte Früherkennung, neue Medikamente und gesündere Ernährungsgewohnheiten – besonders unter jungen Erwachsenen zwischen 25 und 40 Jahren.',
    category: 'Gesundheit',
    image_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80',
    source: 'Deutsches Ärzteblatt',
    source_url: 'https://www.aerzteblatt.de',
  },
  {
    url: 'https://www.spiegel.de/gesundheit/mentale-gesundheit-programme-schulen-2026',
    title: 'Neue Schulprogramme zur mentalen Gesundheit zeigen messbare Erfolge bei Jugendlichen',
    summary: 'Ein bundesweites Pilotprogramm zur Förderung der psychischen Gesundheit an Schulen hat nach zwei Jahren beeindruckende Ergebnisse geliefert: An den 500 teilnehmenden Schulen sank die Rate von Angststörungen bei Schülerinnen und Schülern um 23 Prozent, und das allgemeine Wohlbefinden verbesserte sich signifikant. Das Programm, das Achtsamkeitsübungen, Gesprächsgruppen und Bewegungsangebote kombiniert, soll nun auf alle deutschen Schulen ausgeweitet werden.',
    category: 'Gesundheit',
    image_url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    source: 'Der Spiegel',
    source_url: 'https://www.spiegel.de',
  },
  {
    url: 'https://www.geo.de/natur/tiere/seeadler-comeback-2026',
    title: 'Seeadler-Comeback: Über 1.000 Brutpaare in Deutschland – historischer Rekord',
    summary: 'Der Naturschutzbund Deutschland (NABU) feiert einen außergewöhnlichen Erfolg: Erstmals seit dem Mittelalter gibt es in Deutschland wieder über 1.000 Brutpaare des Seeadlers. Der majestätische Greifvogel, der durch DDT-Einsatz und Lebensraumverlust fast ausgerottet wurde, hat sich dank konsequentem Schutz der Nistgebiete und dem Verbot schädlicher Pestizide eindrucksvoll erholt.',
    category: 'Tiere',
    image_url: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=800&q=80',
    source: 'GEO Magazin',
    source_url: 'https://www.geo.de',
  },
  {
    url: 'https://www.nationalgeographic.de/tiere/elefanten-kenia-schutz-2026',
    title: 'Elefantenpopulation in Kenia wächst erstmals seit Jahrzehnten wieder an',
    summary: 'Die kenianische Wildlife Service Behörde meldet ermutigende Neuigkeiten für den Artenschutz: Die Elefantenpopulation im Amboseli-Nationalpark ist auf über 1.600 Tiere angewachsen – das sind 200 mehr als noch vor fünf Jahren. Lokale Gemeinschaften spielen dabei eine Schlüsselrolle: Durch Öko-Tourismus-Programme profitieren Dörfer rund um den Park direkt vom Schutz der Tiere und engagieren sich aktiv gegen Wilderei.',
    category: 'Tiere',
    image_url: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80',
    source: 'National Geographic Deutschland',
    source_url: 'https://www.nationalgeographic.de',
  },
];

let inserted = 0;
let skipped = 0;

for (const article of articles) {
  const result = await sql`
    INSERT INTO articles (url, title, summary, category, image_url, source, source_url, published_at, status)
    VALUES (
      ${article.url}, ${article.title}, ${article.summary}, ${article.category},
      ${article.image_url}, ${article.source}, ${article.source_url},
      ${new Date().toISOString()}, 'published'
    )
    ON CONFLICT (url) DO NOTHING
    RETURNING id`;
  if (result.length > 0) inserted++; else skipped++;
}

console.log(`✓ ${inserted} Artikel eingefügt, ${skipped} bereits vorhanden.`);
