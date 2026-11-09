import { createReadStream } from 'node:fs';
import path from 'node:path';
import { getCliClient } from 'sanity/cli';
import { categories, starterProjects } from '../lib/demo-content';

const client = getCliClient({ apiVersion: '2026-11-06' });
async function upload(url: string, alt: string) {
  const asset = await client.assets.upload('image', createReadStream(path.join(process.cwd(), 'public', url)), { filename: path.basename(url) });
  return { _type: 'image', alt, asset: { _type: 'reference', _ref: asset._id } };
}
async function main() {
  if (client.config().projectId !== 'r3e6hitc' || client.config().dataset !== 'development') throw new Error('This seed only supports the WDP development dataset.');
  for (const [order, title] of categories.entries()) await client.createIfNotExists({ _id: `category-${title.toLowerCase()}`, _type: 'blogCategory', title, order });
  for (const project of starterProjects) {
    if (await client.getDocument(project._id) || await client.getDocument(`drafts.${project._id}`)) continue;
    const { thumbnail, logo, related: _related, ...fields } = project;
    await client.createIfNotExists({ ...fields, _type: 'project', slug: { _type: 'slug', current: project.slug }, thumbnail: await upload(thumbnail.url, thumbnail.alt || project.title), logo: logo ? await upload(logo.url, project.title) : undefined });
    console.log(`Registered: ${project.title}`);
  }
  const exampleId = 'drafts.blog-editor-guide';
  if (!await client.getDocument(exampleId) && !await client.getDocument('blog-editor-guide')) {
    const cover = await upload('/editorial/blog-imgUnsplashOqtafYt5KTw1.png', '코드가 표시된 화면');
    await client.createIfNotExists({ _id: exampleId, _type: 'blogPost', title: '[작성 예시] 첫 블로그 글을 작성해 보세요', slug: { _type: 'slug', current: 'first-blog-post' }, category: { _type: 'reference', _ref: 'category-ai' }, publishedAt: new Date().toISOString(), thumbnail: cover, cover, excerpt: '제목, 카테고리, 이미지와 본문을 수정한 뒤 Publish를 누르면 사이트에 표시됩니다.', body: [{ _key: 'guide', _type: 'block', style: 'normal', markDefs: [], children: [{ _key: 'text', _type: 'span', marks: [], text: '이 글은 편집 방법을 위한 초안입니다. 실제 콘텐츠로 바꾼 뒤 Publish를 눌러 게시하세요. 본문에는 제목, 목록, 링크, 이미지와 갤러리를 추가할 수 있습니다.' }] }] });
  }
  console.log('Development content ready. Existing documents were preserved.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
