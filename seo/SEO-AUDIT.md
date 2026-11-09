# 웰던프로덕트 랜딩 SEO 점검: `/news`, `/blog`

- 점검일: 2026-11-09
- 대상: https://wdp-landing-dev.vercel.app/news, https://wdp-landing-dev.vercel.app/blog, `/blog/[slug]` 상세 1건
- 방법: Googlebot UA로 HTML을 받아 `<head>` 메타, 헤딩, 링크, 이미지 alt, JSON-LD, robots.txt와 sitemap.xml을 확인

## 요약

SSR은 잘 되어 있습니다(Next.js App Router, prerender, ISR 300초). 크롤러가 받는 HTML에 본문이 모두 들어 있습니다.
부족한 부분은 **메타 정보, 크롤링 경로, 구조화 데이터**입니다.

## 확인된 문제

| # | 항목 | 지금 상태 | 심각도 |
|---|---|---|---|
| 1 | `robots` | 모든 페이지가 `noindex, nofollow` | dev라면 정상. **운영 배포에서 꼭 빠져야 함** |
| 2 | `/robots.txt`, `/sitemap.xml` | 둘 다 404 | 높음 |
| 3 | canonical | 없음 | 높음 (dev 도메인과 운영 도메인이 중복 색인될 위험) |
| 4 | OG / Twitter 메타 | 전혀 없음 | 높음 (공유 미리보기가 안 나옴) |
| 5 | JSON-LD | 없음 | 중간 |
| 6 | description | "언론에서 만나는 웰던프로덕트 소식"처럼 너무 짧고 일반적 | 중간 |
| 7 | H1 | `/news`는 "Press", `/blog`는 "Meet our log and insights". 영어라서 검색 키워드가 없음 | 중간 |
| 8 | 블로그 카테고리 필터 | `<button>`이라 크롤러가 따라갈 URL이 없음 | 중간 |
| 9 | 내부 링크 | SSR HTML에 `/`, `/blog`, `/news`로 가는 nav 링크가 없음. 로고도 링크가 아님 | 중간 |
| 10 | `/news` 콘텐츠 | 모든 항목이 외부 기사로만 이동함. 자체 콘텐츠가 거의 없는 얇은 페이지. 엑스포 기사 2개는 제목이 거의 같음 | 중간 |
| 11 | 블로그 이미지 alt | "chart", "화면에 표시된 프로그래밍 코드"처럼 일반적이거나 중복됨 | 낮음 |
| 12 | slug | `/blog/3-ai-ai-native`. 한글 제목을 slugify하면서 의미가 빠짐 | 낮음 |
| 13 | 테스트 글 | `[테스트]` 글이 3개 노출됨 | 운영 전에 삭제 |

## 고치는 방법 (Next.js App Router 기준)

### 1. 공통 metadata와 환경별 robots (`app/layout.tsx`)

```ts
const isProd = process.env.VERCEL_ENV === 'production';

export const metadata: Metadata = {
  metadataBase: new URL('https://welldoneproduct.com'), // 운영 도메인
  title: { default: '웰던프로덕트 | AI-Native 외주개발사', template: '%s | 웰던프로덕트' },
  robots: isProd ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: { siteName: '웰던프로덕트', locale: 'ko_KR', type: 'website', images: ['/og.png'] },
  twitter: { card: 'summary_large_image' },
};
```

### 2. 페이지별 metadata (`app/news/page.tsx`)

```ts
export const metadata: Metadata = {
  title: '언론 보도',
  description: 'AI-Native 외주개발사 웰던프로덕트의 언론 보도, 기업 탐방, 전시회 참가 소식을 모았습니다.',
  alternates: { canonical: '/news' },
  openGraph: { url: '/news', title: '웰던프로덕트 언론 보도' },
};
```

블로그 상세 페이지는 `generateMetadata`에서 Sanity 값으로 만듭니다. `openGraph.type: 'article'`, `publishedTime`, `images`(대표 이미지), `alternates.canonical: /blog/${slug}`를 넣습니다.

### 3. robots.ts / sitemap.ts 추가

```ts
// app/robots.ts
export default (): MetadataRoute.Robots =>
  process.env.VERCEL_ENV === 'production'
    ? { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://welldoneproduct.com/sitemap.xml' }
    : { rules: { userAgent: '*', disallow: '/' } };
```

```ts
// app/sitemap.ts
export default async (): Promise<MetadataRoute.Sitemap> => {
  const posts = (await getPosts()) ?? [];
  return [
    { url: `${BASE}/`, priority: 1 },
    { url: `${BASE}/blog` },
    { url: `${BASE}/news` },
    ...posts
      .filter((p) => p?.slug)
      .map((p) => ({ url: `${BASE}/blog/${p.slug}`, lastModified: p._updatedAt ?? undefined })),
  ];
};
```

### 4. JSON-LD

- 레이아웃: `Organization` (이름, 로고, 주소, 사업자 정보, email)
- `/blog`: `Blog`와 `ItemList`
- `/blog/[slug]`: `BlogPosting` (headline, datePublished, dateModified, author, image)와 `BreadcrumbList`
- `/news`: `ItemList`. 각 항목은 `NewsArticle`로 두고 `url`에 외부 기사 주소를 넣음

```tsx
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
```

### 5. 마크업

- H1을 한국어 키워드로 바꿉니다. 예: `웰던프로덕트 언론 보도`, `웰던프로덕트 블로그: AI 개발·PM·디자인 인사이트`. 영어 문구는 디자인 요소(span)로 남겨 두면 됩니다.
- 카테고리 필터를 `<Link href="/blog?category=ai">`나 `/blog/category/ai` 같은 크롤링 가능한 URL로 바꿉니다. 카테고리 페이지마다 title과 description도 따로 둡니다.
- 헤더와 푸터에 `<nav>`를 두고 `/`, `/blog`, `/news`로 가는 `<a>` 링크를 SSR로 렌더합니다. 로고는 `/`로 감쌉니다.
- 글이 많아지면 무한 스크롤 대신 `?page=2` 같은 링크형 페이지네이션을 씁니다.

### 6. 콘텐츠

- `/news`: 자체 콘텐츠를 늘리려면 `/news/[slug]` 상세 페이지를 만들고 요약 2~3문단, 출처, 원문 링크를 넣는 방법이 좋습니다. 상세 페이지를 만들지 않는다면 페이지 상단에 회사 소개 문단이라도 추가합니다. 거의 같은 엑스포 기사 2개는 하나로 합칩니다.
- 블로그 썸네일 alt가 비어 있거나 너무 일반적이면 글 제목을 대신 쓰게 합니다. Sanity 스키마에서 alt를 필수 입력으로 바꿉니다.
- slug는 의미가 드러나는 영어로 직접 입력합니다. 예: `ai-native-journey`
- 운영 전에 테스트 글을 지웁니다.

### 7. 성능 (Core Web Vitals, 부가 항목)

Pretendard를 jsdelivr CSS로 불러와서 렌더링을 막습니다. `next/font/local`로 바꾸면 이 문제가 없어집니다.

## 우선순위

1. 운영 환경 robots 분기, canonical, `metadataBase`
2. `robots.ts`와 `sitemap.ts`
3. OG 이미지와 메타 정보
4. H1, description, nav 링크
5. JSON-LD
6. 카테고리 URL과 news 상세 페이지
