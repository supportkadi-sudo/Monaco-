import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const targetDir = path.join(process.cwd(), 'public', 'images', 'monaco');
const brandSourceFile = path.join(process.cwd(), '.monaco-brand-source.json');
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
  if (viewBox) {
    const width = Number(viewBox[3]);
    const height = Number(viewBox[4]);
    if (width > 0 && height > 0) return width / height;
  }

  const width = Number(svg.match(/\bwidth=["']([\d.]+)/i)?.[1]);
  const height = Number(svg.match(/\bheight=["']([\d.]+)/i)?.[1]);
  return width > 0 && height > 0 ? width / height : 0;
}

function looksLikeLogoUrl(url) {
  try {
    const parsed = new URL(url);
    const filename = parsed.pathname.split('/').pop() || '';
    return /(?:logo|brand)/i.test(filename) || /\/(?:logo|brand)(?:s)?\//i.test(parsed.pathname);
  } catch {
    return false;
  }
}

function extractSvgUrls(fragment) {
  const values = [];
  for (const match of fragment.matchAll(/(?:src|href|data-src|data)=['"]([^'"]+\.svg(?:[?#][^'"]*)?)['"]/gi)) {
    values.push(match[1]);
  }
  for (const match of fragment.matchAll(/url\((?:['"])?([^)'"\s]+\.svg(?:[?#][^)'"\s]*)?)(?:['"])?\)/gi)) {
    values.push(match[1]);
  }
  return values;
}

async function validateExternalLogo(url) {
  try {
    const response = await fetch(url, { headers: { 'user-agent': userAgent } });
    if (!response.ok) return null;
    const svg = await response.text();
    if (!/<svg\b/i.test(svg)) return null;

    const ratio = svgAspectRatio(svg);
    if (ratio < 2 || ratio > 10) return null;
    return { svg, source: url, ratio };
  } catch {
    return null;
  }
}

async function discoverOfficialLogoSvg() {
  const html = await fetchText(officialSite);
  const header = html.match(/<header\b[\s\S]*?<\/header>/i)?.[0] || html.slice(0, 60000);
  const candidates = [];

  // First inspect markup explicitly identified as a logo/brand container. This avoids
  // treating decorative hero icons such as hero/ico01.svg as the Monaco logo.
  const brandFragments = [
    ...header.matchAll(/<[^>]+(?:class|id)=['"][^'"]*(?:logo|brand)[^'"]*['"][^>]*>[\s\S]{0,5000}?<\/[^>]+>/gi)
  ].map((match) => match[0]);

  for (const fragment of brandFragments) {
    for (const raw of extractSvgUrls(fragment)) {
      const url = absoluteUrl(raw?.trim());
      if (url) candidates.push(url);
    }
  }

  // Then accept only URLs whose own filename/path identifies them as a logo/brand.
  for (const raw of extractSvgUrls(header)) {
    const url = absoluteUrl(raw?.trim());
    if (url && looksLikeLogoUrl(url)) candidates.push(url);
  }

  // Conservative theme fallbacks. Each candidate is fetched and aspect-ratio checked.
  candidates.push(
    'https://monaqua.uz/wp-content/themes/monaco/assets/img/logo.svg',
    'https://monaqua.uz/wp-content/themes/monaco/assets/img/header/logo.svg',
    'https://monaqua.uz/wp-content/themes/monaco/assets/img/common/logo.svg'
  );

  for (const url of [...new Set(candidates)]) {
    const validated = await validateExternalLogo(url);
    if (validated) return validated;
  }

  // Some WordPress themes inline the brand SVG in the header rather than reference a file.
  // Prefer a wide SVG, which matches the horizontal Monaco wordmark rather than UI icons.
  const inlineSvgs = [...header.matchAll(/<svg\b[\s\S]*?<\/svg>/gi)].map((match) => match[0]);
  const wideInlineLogo = inlineSvgs
    .map((svg) => ({ svg, ratio: svgAspectRatio(svg), size: svg.length }))
    .filter((item) => item.ratio >= 2 && item.ratio <= 10)
    .sort((a, b) => b.size - a.size)[0];

  if (wideInlineLogo) {
    return {
      svg: wideInlineLogo.svg,
      source: `${officialSite} (inline header SVG)`,
      ratio: wideInlineLogo.ratio
    };
  }

  throw new Error('Could not discover a verified wide Monaco logo SVG on monaqua.uz');
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

// Always re-discover and replace the logo during media sync. The logo is tiny, and this
// prevents a previously misidentified decorative SVG from remaining cached indefinitely.
const logoDestination = path.join(targetDir, 'logo.svg');
const { svg, source, ratio } = await discoverOfficialLogoSvg();
await writeFile(logoDestination, svg, 'utf8');
await writeFile(
  brandSourceFile,
  `${JSON.stringify({ source, aspectRatio: ratio, syncedAt: new Date().toISOString() }, null, 2)}\n`,
  'utf8'
);
console.log(`Saved verified logo.svg from official source: ${source} (ratio ${ratio.toFixed(2)})`);
