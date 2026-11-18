import { SiteHeader } from '@/components/editorial/SiteChrome';
import NewsList from '@/components/editorial/NewsList';
import JsonLd from '@/components/editorial/JsonLd';
import { pageMetadata, absoluteUrl } from '@/lib/seo';
import { getNews } from '@/lib/content';
export const metadata = pageMetadata('언론 보도 | 웰던프로덕트', 'AI-Native 외주개발사 웰던프로덕트의 기업 탐방과 언론 보도, AI 전시회 참가 소식을 확인하세요. 각 카드를 누르면 해당 언론사의 기사 원문을 새 탭에서 읽을 수 있습니다.', '/news');
export default async function NewsPage() {
  const items = await getNews();
  return <><SiteHeader /><main><JsonLd data={{'@context': 'https://schema.org', '@type': 'ItemList', name: '웰던프로덕트 언론 보도', url: absoluteUrl('/news'), itemListElement: items.map((item, index) => ({'@type': 'ListItem', position: index + 1, item: {'@type': 'NewsArticle', headline: item.title, datePublished: item.publishedAt, url: item.url, image: item.thumbnail.url}}))}} /><div className="editorial-container listing-title"><h1><span className="sr-only">웰던프로덕트 언론 보도 · </span>Press</h1><p className="listing-description">AI-Native 외주개발사 웰던프로덕트의 기업 탐방과 전시회 참가 소식입니다. 카드를 선택하면 언론사 기사 원문을 새 탭에서 확인할 수 있습니다.</p></div><NewsList items={items} /></main></>;
}
