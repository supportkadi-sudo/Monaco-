import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const targetDir = path.join(process.cwd(), 'public', 'images', 'monaco');

const files = {
  'hero.webp': 'https://monaqua.uz/wp-content/uploads/2025/11/img_1279-scaled.webp',
  'ship-vertical.webp': 'https://monaqua.uz/wp-content/uploads/2025/11/img_0421.webp',
  'pool-wide.webp': 'https://monaqua.uz/wp-content/uploads/2023/11/01.webp',
  'sauna.jpg': 'https://monaqua.uz/wp-content/themes/monaco/assets/img/text-block/04.jpg',
  'party.webp': 'https://monaqua.uz/wp-content/uploads/2025/11/6.webp'
};

await mkdir(targetDir, { recursive: true });

for (const [name, url] of Object.entries(files)) {
  const destination = path.join(targetDir, name);
  try {
    await access(destination);
    console.log(`Media exists: ${name}`);
    continue;
  } catch {}

  const response = await fetch(url, {
    headers: { 'user-agent': 'MonacoAquaparkWebsite/1.0' }
  });
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(destination, bytes);
  console.log(`Saved ${name} (${bytes.length} bytes)`);
}
