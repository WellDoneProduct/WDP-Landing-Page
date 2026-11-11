export type ContentImage = { url: string; alt: string; width?: number; height?: number };
type TextSpan = { _key: string; _type: 'span'; text: string; marks?: string[] };
export type TextBlock = { _key: string; _type: 'block'; style?: string; children: TextSpan[]; markDefs?: { _key: string; _type: string; href?: string }[]; listItem?: string; level?: number };
export type ImageBlock = { _key: string; _type: 'contentImage'; image: ContentImage; caption?: string };
export type GalleryBlock = { _key: string; _type: 'imageGallery'; images: ContentImage[]; caption?: string };
export type ContentBlock = TextBlock | ImageBlock | GalleryBlock;
export type Post = { _id: string; _updatedAt?: string; slug: string; title: string; category: string; publishedAt: string; thumbnail?: ContentImage; cover?: ContentImage; excerpt?: string; body: ContentBlock[] };
export type Project = { _id: string; slug: string; title: string; category: string; service: string; description: string; period: string; scope: string; client: string; tags: string[]; order: number; status: 'comingSoon' | 'public'; thumbnail: ContentImage; logo?: ContentImage; logoWidth?: number; tint?: string; heroImage?: ContentImage; heroMobileImage?: ContentImage; overview: string; body: ContentBlock[]; related?: string[] };

export type NewsItem = { _id: string; title: string; publishedAt: string; url: string; thumbnail: ContentImage };
