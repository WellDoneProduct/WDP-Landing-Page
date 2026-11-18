'use client';

import imageUrlBuilder from '@sanity/image-url';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useClient } from 'sanity';
import type { UserViewComponent } from 'sanity/structure';
import type { ContentBlock, ContentImage, Project } from '@/lib/content-types';

type DraftImage = { asset?: { _ref?: string }; alt?: string };
type DraftBlock =
  | Exclude<ContentBlock, { _type: 'contentImage' | 'imageGallery' }>
  | { _key: string; _type: 'contentImage'; image?: DraftImage; caption?: string }
  | { _key: string; _type: 'imageGallery'; images?: DraftImage[]; caption?: string };
type ProjectDraft = Partial<Omit<Project, 'body' | 'heroImage' | 'heroMobileImage' | 'thumbnail' | 'logo' | 'related' | 'slug'>> & {
  heroImage?: DraftImage;
  heroMobileImage?: DraftImage;
  body?: DraftBlock[];
  related?: { _ref: string }[];
};
const viewportOptions = [
  { label: '편집창 너비', width: '100%' },
  { label: 'PC', width: '1440' },
  { label: '태블릿', width: '744' },
  { label: '모바일', width: '393' },
];

const ProjectPreview: UserViewComponent = ({ document, documentId }) => {
  const client = useClient({ apiVersion: '2026-11-06' });
  const images = useMemo(() => imageUrlBuilder(client), [client]);
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const [width, setWidth] = useState('100%');
  const draft: ProjectDraft = document.displayed;
  const project = useMemo<Project>(() => {
    const image = (value?: DraftImage): ContentImage | undefined => {
      const ref = value?.asset?._ref;
      return ref ? { url: images.image(ref).url(), alt: value?.alt ?? '' } : undefined;
    };
    const body = (draft.body ?? []).flatMap<ContentBlock>(block => {
      if (block._type === 'contentImage') {
        const displayImage = image(block.image);
        return displayImage ? [{ ...block, image: displayImage }] : [];
      }
      if (block._type === 'imageGallery') {
        const gallery = (block.images ?? []).flatMap(value => {
          const displayImage = image(value);
          return displayImage ? [displayImage] : [];
        });
        return gallery.length ? [{ ...block, images: gallery }] : [];
      }
      return [block];
    });
    return {
      _id: documentId,
      slug: '',
      title: draft.title || '프로젝트 이름',
      status: draft.status ?? 'comingSoon',
      order: draft.order ?? 0,
      category: draft.category ?? '',
      service: draft.service ?? '',
      description: draft.description ?? '',
      tags: draft.tags ?? [],
      period: draft.period ?? '',
      scope: draft.scope ?? '',
      client: draft.client ?? '',
      overview: draft.overview ?? '',
      thumbnail: { url: '', alt: '' },
      heroImage: image(draft.heroImage),
      heroMobileImage: image(draft.heroMobileImage),
      related: draft.related?.map(item => item._ref),
      body,
    };
  }, [documentId, draft, images]);

  useEffect(() => {
    function receive(event: MessageEvent) {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === 'wdp:portfolio-preview-ready') {
        setReady(true);
      }
    }
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, []);

  useEffect(() => {
    if (ready) frame.current?.contentWindow?.postMessage(
      { type: 'wdp:portfolio-preview', project },
      window.location.origin,
    );
  }, [project, ready]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--card-bg-color)' }}>
      <label style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        미리보기 화면 크기
        <select value={width} onChange={event => setWidth(event.target.value)}>
          {viewportOptions.map(option => <option key={option.width} value={option.width}>{option.label}</option>)}
        </select>
      </label>
      <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <iframe
          ref={frame}
          src="/studio/portfolio-preview"
          title="포트폴리오 상세 미리보기"
          style={{ display: 'block', width: width === '100%' ? width : Number(width), height: '100%', minHeight: 480, border: 0, margin: '0 auto' }}
        />
      </div>
    </div>
  );
};

export default ProjectPreview;
