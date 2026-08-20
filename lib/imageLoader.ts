/**
 * Image URLs for a static export.
 *
 * There's no Node server on GitHub Pages, so the image optimiser can't run.
 * The obvious switch — `images: { unoptimized: true }` — emits every `src`
 * exactly as written, which quietly drops the basePath and 404s the photos
 * once the site is served from /<repo>/. This loader hands back the original
 * file with the prefix in front, so new images stay correct by default.
 */
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return src.startsWith("/") ? `${basePath}${src}` : src;
}
