'use client';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';

export default defineConfig({
  name: 'wdp', title: `WDP 콘텐츠 · ${process.env.NEXT_PUBLIC_SANITY_DATASET || 'development'}`,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'unconfigured', dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'development', basePath: '/studio',
  plugins: [structureTool({ structure: S => S.list().id('content').title('콘텐츠 관리').items([
    S.listItem().id('blog-posts').title('블로그 글').child(S.documentTypeList('blogPost').title('블로그 글').defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])),
    S.listItem().id('blog-categories').title('블로그 카테고리').child(S.documentTypeList('blogCategory').title('카테고리').defaultOrdering([{ field: 'order', direction: 'asc' }])),
    S.divider(),
    S.listItem().id('projects').title('포트폴리오').child(S.documentTypeList('project').title('프로젝트').defaultOrdering([{ field: 'order', direction: 'asc' }])),
    S.listItem().id('news').title('언론 보도').child(S.documentTypeList('newsArticle').title('언론 보도').defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])),
  ]) })], schema: { types: schemaTypes },
});
