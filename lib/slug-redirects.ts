// 301 redirects from a blog post's previous slugs to its current slug. Loaded by next.config at build
// time; a slug change is published from Sanity, which triggers the Deploy Hook rebuild that refreshes this list.
type Row = { slug?: string; previousSlugs?: unknown };

const SLUG = /^[a-z0-9][a-z0-9-]*$/i;

export const loadSlugRedirects = async () => {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return [];
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'development';
  const query = '*[_type == "blogPost" && !(_id in path("drafts.**")) && defined(slug.current)]{"slug": slug.current, previousSlugs}';
  const url = `https://${projectId}.api.sanity.io/v2026-11-06/data/query/${dataset}?query=${encodeURIComponent(query)}&perspective=published`;
  const token = process.env.SANITY_API_READ_TOKEN;
  const response = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {}, cache: 'no-store' });
  // Fail the build rather than silently dropping redirects that search engines rely on.
  if (!response.ok) throw new Error(`Sanity redirect query failed: ${response.status}`);
  const rows: Row[] = (await response.json())?.result ?? [];
  const live = new Set(rows.map(row => row?.slug).filter(Boolean));
  return rows.flatMap(row => {
    const slug = row?.slug;
    if (!slug || !SLUG.test(slug)) return [];
    const previous = Array.isArray(row.previousSlugs) ? row.previousSlugs : [];
    // Never shadow a slug another post currently uses.
    return previous
      .filter((old): old is string => typeof old === 'string' && SLUG.test(old) && old !== slug && !live.has(old))
      .map(old => ({ source: `/blog/${old}`, destination: `/blog/${slug}`, statusCode: 301 as const }));
  });
};
