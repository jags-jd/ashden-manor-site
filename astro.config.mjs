import { defineConfig } from 'astro/config';

// Static output; Vercel serves `dist/` with no adapter needed.
// Until the client's domain is known, absolute URLs (canonical, Open Graph) use the Vercel production URL.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export default defineConfig({
  site: vercelUrl ? `https://${vercelUrl}` : 'http://localhost:4321',
  output: 'static',
  // The site's CSS is small: inline it so no stylesheet request blocks the first paint.
  build: { inlineStylesheets: 'always' },
});
