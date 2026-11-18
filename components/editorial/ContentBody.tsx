import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { sanityImageUrl, sanitySrcSet } from '@/lib/sanity-image';
import type { ContentBlock, TableBlock } from '@/lib/content-types';
import { titleText } from '@/lib/title-text';

// CMS tables are plain text grids. Wide tables scroll inside their own box so the page never
// overflows on mobile; the scroll box is focusable so keyboard users can scroll it too.
const ContentTable = ({ value }: { value: TableBlock }) => {
  const rows = (value?.table?.rows ?? []).map(row => ({ key: row?._key, cells: Array.isArray(row?.cells) ? row.cells.map(cell => cell ?? '') : [] })).filter(row => row.cells.length);
  if (!rows.length) return null;
  const header = value?.hasHeaderRow !== false && rows.length > 1 ? rows[0] : undefined;
  const bodyRows = header ? rows.slice(1) : rows;
  return <figure className="content-table">
    <div className="table-scroll" role="region" aria-label={value?.caption || '표'} tabIndex={0}>
      <table>
        {header && <thead><tr>{header.cells.map((cell, index) => <th key={index} scope="col">{cell}</th>)}</tr></thead>}
        <tbody>{bodyRows.map((row, rowIndex) => <tr key={row.key ?? rowIndex}>{row.cells.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
    {value?.caption && <figcaption>{value.caption}</figcaption>}
  </figure>;
};

const components: PortableTextComponents = {
  types: {
    contentTable: ContentTable,
    contentImage: ({ value }) => value.image?.url ? <figure><img src={sanityImageUrl(value.image.url, 1200)} srcSet={sanitySrcSet(value.image.url, [640, 960, 1200, 1600])} sizes="(max-width: 767px) calc(100vw - 40px), 1040px" alt={value.image.alt ?? ''} loading="lazy" decoding="async" />{value.caption && <figcaption>{value.caption}</figcaption>}</figure> : null,
    imageGallery: ({ value }) => <figure><div className="content-gallery">{value.images?.filter((img: { url?: string }) => img?.url).map((img: { url: string; alt?: string }, i: number) => <img key={i} src={sanityImageUrl(img.url, 1040)} srcSet={sanitySrcSet(img.url, [480, 720, 1040])} sizes="(max-width: 767px) calc(100vw - 40px), 620px" alt={img.alt ?? ''} loading="lazy" decoding="async" />)}</div>{value.caption && <figcaption>{value.caption}</figcaption>}</figure>,
  },
  marks: { link: ({ children, value }) => {
    const href = value?.href;
    return typeof href === 'string' && /^(https?:\/\/|mailto:|\/|#)/i.test(href) && !href.startsWith('//') ? <a href={href}>{children}</a> : <>{children}</>;
  } },
};
export default function ContentBody({ blocks }: { blocks: ContentBlock[] }) {
  const displayBlocks = blocks.map(block => {
    if (block._type !== 'block' || !/^h[1-6]$/.test(block.style ?? '')) return block;
    const text = block.children.map(child => child.text).join('');
    const end = titleText(text.trimEnd()).length;
    let offset = 0;
    return { ...block, children: block.children.map(child => {
      const remaining = Math.max(0, end - offset);
      offset += child.text.length;
      return { ...child, text: child.text.slice(0, remaining) };
    }) };
  });
  return <PortableText value={displayBlocks} components={components} />;
}
