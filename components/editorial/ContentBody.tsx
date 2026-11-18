import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { ContentBlock } from '@/lib/content-types';
import { titleText } from '@/lib/title-text';

const components: PortableTextComponents = {
  types: {
    contentImage: ({ value }) => value.image?.url ? <figure><img src={value.image.url} alt={value.image.alt ?? ''} loading="lazy" />{value.caption && <figcaption>{value.caption}</figcaption>}</figure> : null,
    imageGallery: ({ value }) => <figure><div className="content-gallery">{value.images?.filter((img: { url?: string }) => img?.url).map((img: { url: string; alt?: string }, i: number) => <img key={i} src={img.url} alt={img.alt ?? ''} loading="lazy" />)}</div>{value.caption && <figcaption>{value.caption}</figcaption>}</figure>,
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
