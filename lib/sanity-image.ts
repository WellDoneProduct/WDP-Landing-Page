// Sanity CDN resizes and re-encodes on the fly: `w` caps the width, `auto=format` serves
// AVIF/WebP to browsers that accept them, `fit=max` never upscales. SVGs and non-Sanity
// URLs are returned untouched (resizing an SVG would rasterize it).
const isSanityRaster = (url?: string) =>
  !!url && url.startsWith('https://cdn.sanity.io/images/') && !/\.svg(?:$|\?)/i.test(url);

export const sanityImageUrl = (url: string | undefined, width: number, quality = 75) => {
  if (!url) return '';
  if (!isSanityRaster(url)) return url;
  return `${url}${url.includes('?') ? '&' : '?'}w=${width}&q=${quality}&fit=max&auto=format`;
};

export const sanitySrcSet = (url: string | undefined, widths: number[], quality = 75) =>
  isSanityRaster(url) ? widths.map(width => `${sanityImageUrl(url, width, quality)} ${width}w`).join(', ') : undefined;
