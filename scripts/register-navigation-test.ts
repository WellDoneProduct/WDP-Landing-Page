import {getCliClient} from 'sanity/cli';
const client = getCliClient({apiVersion: '2026-11-06'});
async function main() {
  if (client.config().projectId !== 'r3e6hitc' || client.config().dataset !== 'development') throw Error('Development dataset only');
  const source = await client.getDocument('blog-ai-design-test-20261109');
  if (!source) throw Error('First test post missing');
  await client.createIfNotExists({
    _id: 'blog-ai-navigation-test-20261109', _type: 'blogPost',
    title: '[테스트 2] AI 블로그의 이전 글과 다음 글 이동 확인',
    slug: {_type: 'slug', current: 'ai-navigation-test'},
    category: source.category, thumbnail: source.thumbnail, cover: source.cover,
    publishedAt: new Date().toISOString(),
    excerpt: '두 테스트 글 사이의 이전 글·다음 글 이동을 확인하기 위한 콘텐츠입니다.',
    body: [{_key: 'intro', _type: 'block', style: 'normal', markDefs: [], children: [{_key: 'text', _type: 'span', marks: [], text: 'AI 카테고리의 두 번째 테스트 글입니다. 아래 이전 글을 누르면 첫 번째 테스트 글로 이동하고, 첫 번째 글의 다음 글을 누르면 이 글로 돌아옵니다. 목록으로 버튼으로 블로그 목록도 확인할 수 있습니다.'}]}],
  });
  console.log('Published: /blog/ai-navigation-test');
}
main().catch(error => {console.error(error.message);process.exitCode = 1;});
