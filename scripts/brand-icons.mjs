// Generates the favicon, touch icons and Open Graph image from the crest PNG.
// The source logo is dark line-work on pure white, which the brand rules forbid,
// so we turn its darkness into an alpha mask, recolour it Ink and set it on Soft Chalk / Warm Linen.
// Re-run (`node scripts/brand-icons.mjs`) when the client supplies an SVG or transparent logo.
import sharp from 'sharp';

const SRC = 'src/assets/brand/logo.png';
const INK = { r: 0x1e, g: 0x1e, b: 0x1c };
const CHALK = { r: 0xf5, g: 0xf1, b: 0xea, alpha: 1 };
const LINEN = { r: 0xe9, g: 0xd9, b: 0xc7, alpha: 1 };

// The AM monogram alone reads best at 32px. The shield's inner frame steps in beside the A,
// so after cropping we blank its corners and one stray mark (coordinates are in the source image).
const MONOGRAM = { left: 289, top: 128, width: 200, height: 250 };
const FRAME_CORNERS = [
  { x0: 0, x1: 302, y0: 0, y1: 205 },
  { x0: 478, x1: 9999, y0: 0, y1: 205 },
  { x0: 0, x1: 340, y0: 0, y1: 160 },
  { x0: 430, x1: 9999, y0: 0, y1: 160 },
  { x0: 482, x1: 9999, y0: 360, y1: 9999 },
];
// Near-white JPEG noise in the source would otherwise show as a faint box.
const NOISE_FLOOR = 24;

async function inkOnTransparent(region, erase = []) {
  const img = sharp(SRC);
  const cropped = region ? img.extract(region) : img;
  const { data, info } = await cropped
    .greyscale()
    .negate()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    rgba[i * 4] = INK.r;
    rgba[i * 4 + 1] = INK.g;
    rgba[i * 4 + 2] = INK.b;
    const x = (i % info.width) + (region?.left ?? 0);
    const y = Math.floor(i / info.width) + (region?.top ?? 0);
    const erased = erase.some((r) => x >= r.x0 && x < r.x1 && y >= r.y0 && y < r.y1);
    const a = erased ? 0 : data[i * info.channels];
    rgba[i * 4 + 3] = a < NOISE_FLOOR ? 0 : Math.round(((a - NOISE_FLOOR) * 255) / (255 - NOISE_FLOOR));
  }
  return sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
}

async function icon(mark, size, file, padding = 0.1) {
  const inner = Math.round(size * (1 - padding * 2));
  const resized = await sharp(mark)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: CHALK } })
    .composite([{ input: resized, gravity: 'centre' }])
    .png()
    .toFile(`public/${file}`);
}

const monogram = await inkOnTransparent(MONOGRAM, FRAME_CORNERS);
await icon(monogram, 32, 'favicon-32.png', 0.06);
await icon(monogram, 180, 'apple-touch-icon.png', 0.14);
await icon(monogram, 192, 'icon-192.png', 0.14);
await icon(monogram, 512, 'icon-512.png', 0.14);

const fullLogo = await inkOnTransparent();
const ogLogo = await sharp(fullLogo).resize({ height: 500 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: LINEN } })
  .composite([{ input: ogLogo, gravity: 'centre' }])
  .flatten({ background: LINEN })
  .jpeg({ quality: 88 })
  .toFile('public/og-image.jpg');

// On-page crest: transparent, so it sits on any light section without a white box.
// A Linen copy is written too, for dark sections.
await sharp(fullLogo).toFile('src/assets/brand/logo-ink.png');
const { data: inkPixels, info: inkInfo } = await sharp(fullLogo).raw().toBuffer({ resolveWithObject: true });
const linenPixels = Buffer.from(inkPixels);
for (let i = 0; i < linenPixels.length; i += 4) {
  linenPixels[i] = LINEN.r;
  linenPixels[i + 1] = LINEN.g;
  linenPixels[i + 2] = LINEN.b;
}
await sharp(linenPixels, { raw: { width: inkInfo.width, height: inkInfo.height, channels: 4 } })
  .png()
  .toFile('src/assets/brand/logo-linen.png');

// The AM monogram alone, transparent, for the floating header: Antique Bronze (a logo, so exempt from text contrast).
const BRONZE = { r: 0x90, g: 0x7b, b: 0x60 };
const { data: monoPixels, info: monoInfo } = await sharp(monogram).raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < monoPixels.length; i += 4) {
  monoPixels[i] = BRONZE.r;
  monoPixels[i + 1] = BRONZE.g;
  monoPixels[i + 2] = BRONZE.b;
}
await sharp(monoPixels, { raw: { width: monoInfo.width, height: monoInfo.height, channels: 4 } })
  .trim()
  .png()
  .toFile('src/assets/brand/monogram-bronze.png');

console.log('Brand icons written to public/, on-page crests and monogram to src/assets/brand/');
