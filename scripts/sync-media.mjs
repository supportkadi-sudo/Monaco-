import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const targetDir = path.join(process.cwd(), 'public', 'images', 'monaco');
const userAgent = 'MonacoAquaparkWebsite/1.0';
const officialSite = 'https://monaqua.uz/';

const files = {
  'hero.webp': 'https://monaqua.uz/wp-content/uploads/2025/11/img_1279-scaled.webp',
  'ship-vertical.webp': 'https://monaqua.uz/wp-content/uploads/2025/11/img_0421.webp',
  'pool-wide.webp': 'https://monaqua.uz/wp-content/uploads/2023/11/01.webp',
  'sauna.jpg': 'https://monaqua.uz/wp-content/themes/monaco/assets/img/text-block/04.jpg',
  'party.webp': 'https://monaqua.uz/wp-content/uploads/2025/11/6.webp'
};

async function fetchText(url) {
  const response = await fetch(url, { headers: { 'user-agent': userAgent } });
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`);
  return response.text();
}

function absoluteUrl(value) {
  try {
    return new URL(value, officialSite).href;
  } catch {
    return null;
  }
}

function svgAspectRatio(svg) {
  const viewBox = svg.match(/viewBox=["']\s*([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s*["']/i);
  if (!viewBox) return 0;
  const width = Number(viewBox[3]);
  const height = Number(viewBox[4]);
  return width > 0 && height > 0 ? width / height : 0;
}

async function discoverOfficialLogoSvg() {
  const html = await fetchText(officialSite);
  const header = html.match(/<header\b[\s\S]*?<\/header>/i)?.[0] || html.slice(0, 50000);
  const candidates = [];

  const addCandidate = (raw) => {
    const url = absoluteUrl(raw?.trim());
    if (!url || !/\.svg(?:[?#].*)?$/i.test(url)) return;
    if (!/logo|brand|monaco/i.test(url)) return;
    candidates.push(url);
  };

  for (const match of header.matchAll(/(?:src|href|data-src|data)=['"]([^'"]+\.svg(?:[?#][^'"]*)?)['"]/gi)) {
    addCandidate(match[1]);
  }
  for (const match of html.matchAll(/(?:src|href|data-src|data)=['"]([^'"]*(?:logo|brand|monaco)[^'"]*\.svg(?:[?#][^'"]*)?)['"]/gi)) {
    addCandidate(match[1]);
  }
  for (const match of header.matchAll(/url\((?:['"])?([^)'"\s]+\.svg(?:[?#][^)'"\s]*)?)(?:['"])?\)/gi)) {
    addCandidate(match[1]);
  }

  // Theme fallbacks are only used if the current HTML does not expose the asset directly.
  candidates.push(
    'https://monaqua.uz/wp-content/themes/monaco/assets/img/logo.svg',
    'https://monaqua.uz/wp-content/themes/monaco/assets/img/header/logo.svg',
    'https://monaqua.uz/wp-content/themes/monaco/assets/img/common/logo.svg'
  );

  for (const url of [...new Set(candidates)]) {
    try {
      const response = await fetch(url, { headers: { 'user-agent': userAgent } });
      if (!response.ok) continue;
      const svg = await response.text();
      if (!/<svg\b/i.test(svg)) continue;
      return { svg, source: url };
    } catch {}
  }

  const inlineSvgs = [...header.matchAll(/<svg\b[\s\S]*?<\/svg>/gi)].map((match) => match[0]);
  const wideInlineLogo = inlineSvgs
    .map((svg) => ({ svg, ratio: svgAspectRatio(svg) }))
    .filter((item) => item.ratio >= 2.2)
    .sort((a, b) => b.ratio - a.ratio)[0];

  if (wideInlineLogo) {
    return { svg: wideInlineLogo.svg, source: `${officialSite} (inline header SVG)` };
  }

  throw new Error('Could not discover the official Monaco logo SVG on monaqua.uz');
}

await mkdir(targetDir, { recursive: true });

for (const [name, url] of Object.entries(files)) {
  const destination = path.join(targetDir, name);
  try {
    await access(destination);
    console.log(`Media exists: ${name}`);
    continue;
  } catch {}

  const response = await fetch(url, {
    headers: { 'user-agent': userAgent }
  });
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, bytes);
  console.log(`Saved ${name} (${bytes.length} bytes)`);
}

const logoDestination = path.join(targetDir, 'logo.svg');
try {
  await access(logoDestination);
  console.log('Media exists: logo.svg');
} catch {
  const { svg, source } = await discoverOfficialLogoSvg();
  await writeFile(logoDestination, svg, 'utf8');
  console.log(`Saved logo.svg from official source: ${source}`);
}
