import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const targetDir = path.join(process.cwd(), 'public', 'images', 'monaco');
const brandSourceFile = path.join(process.cwd(), '.monaco-brand-source.json');
const userAgent = 'MonacoAquaparkWebsite/1.0';

const officialLogo = {
  source: 'https://monaqua.uz/wp-content/themes/monaco/assets/img/logo.webp',
  fallback: 'https://monaqua.uz/wp-content/themes/monaco/assets/img/logo.png',
  destination: 'logo.webp'
};

const files = {
  'hero.webp': 'https://monaqua.uz/wp-content/uploads/2025/11/img_1279-scaled.webp',
  'ship-vertical.webp': 'https://monaqua.uz/wp-content/uploads/2025/11/img_0421.webp',
  'pool-wide.webp': 'https://monaqua.uz/wp-content/uploads/2023/11/01.webp',
  'sauna.jpg': 'https://monaqua.uz/wp-content/themes/monaco/assets/img/text-block/04.jpg',
  'party.webp': 'https://monaqua.uz/wp-content/uploads/2025/11/6.webp'
};

async function download(url, destination) {
  const response = await fetch(url, {
    headers: { 'user-agent': userAgent }
  });
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, bytes);
  return bytes.length;
}

await mkdir(targetDir, { recursive: true });

for (const [name, url] of Object.entries(files)) {
  const destination = path.join(targetDir, name);
  try {
    await access(destination);
    console.log(`Media exists: ${name}`);
    continue;
  } catch {}

  const size = await download(url, destination);
  console.log(`Saved ${name} (${size} bytes)`);
}

// The official site's header/footer markup uses this exact picture pair:
// <source srcset=".../logo.webp" type="image/webp">
// <img src=".../logo.png" alt="Logo">
// Use the site's preferred WebP asset locally instead of trying to infer a logo from
// unrelated SVG icons in the theme.
const logoDestination = path.join(targetDir, officialLogo.destination);
const logoSize = await download(officialLogo.source, logoDestination);
await writeFile(
  brandSourceFile,
  `${JSON.stringify({
    source: officialLogo.source,
    fallback: officialLogo.fallback,
    destination: `public/images/monaco/${officialLogo.destination}`,
    syncedAt: new Date().toISOString()
  }, null, 2)}\n`,
  'utf8'
);
console.log(`Saved official logo ${officialLogo.destination} (${logoSize} bytes) from ${officialLogo.source}`);
