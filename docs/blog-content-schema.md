# 블로그 콘텐츠 스키마 (자동화 연동용)

n8n 등에서 Sanity API로 글을 만들거나 고칠 때 맞춰야 하는 데이터 형태입니다. 정의 원본은 `sanity/schemaTypes.ts`입니다.

## 연결 정보

| 항목 | 값 |
|---|---|
| 프레임워크 / 배포 | Next.js 16 App Router 정적 생성 / Vercel |
| Sanity project ID | `r3e6hitc` |
| dataset | 운영 `production`, 개발 `development` |
| Studio | 운영 https://www.welldoneproduct.com/studio , 개발 https://wdp-landing-dev.vercel.app/studio |
| 반영 방식 | 게시(publish)·수정·삭제 → Sanity webhook → Vercel Deploy Hook → 사이트 전체 재빌드 (1~2분) |
| API 버전 | `2026-11-06` |

- 쓰기 토큰은 자동화 실행 환경의 자격증명 저장소에만 둡니다. 문서·시트·코드에 적지 않습니다.
- `drafts.` 로 시작하는 ID는 초안입니다. 사이트에는 게시된 문서만 나옵니다.
- 게시일(`publishedAt`)이 미래인 글은 그 시각 이후의 다음 빌드부터 나옵니다. 예약 게시를 쓰려면 그 시각에 Deploy Hook을 한 번 더 호출해야 합니다.

## 문서 타입

### `person` (작성자)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `name` | string | ✓ | 이름 |
| `role` | string | | 직함 |
| `image` | image (+`alt`) | | 프로필 사진 |
| `bio` | text (160자) | | 한 줄 소개 |
| `url` | url (https) | | 공개 프로필 링크 |

### `blogCategory`

| 필드 | 타입 | 필수 |
|---|---|---|
| `title` | string | ✓ |
| `order` | number | ✓ |

### `blogPost`

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `title` | string (120자) | ✓ | 제목. H1으로 표시 |
| `slug` | slug `{ current }` | ✓ | `/blog/{slug}` 주소. 영문·숫자·하이픈 |
| `previousSlugs` | string[] | | 예전 slug. 각각 새 주소로 301 이동 |
| `category` | reference → `blogCategory` | ✓ | |
| `tags` | string[] (최대 10, 각 30자) | | 주제어. 글 하단 표시, JSON-LD `keywords`. 태그별 목록 페이지는 없음 |
| `publishedAt` | datetime | ✓ | 최초 게시일 |
| `contentUpdatedAt` | datetime | | 실제 내용 수정일. 비우면 게시일. 사이트맵 `lastmod`, `dateModified`에 사용 |
| `thumbnail` | image (+`alt` 필수) | ✓ | 목록 썸네일 |
| `cover` | image (+`alt` 필수) | ✓ | 상세 상단 배경 |
| `excerpt` | text (180자) | | 목록·검색 요약 |
| `body` | `richText` (아래) | ✓ | 본문 |
| `author` | reference → `person` | ✓ | 작성자 |
| `sources` | `{ title, url, checkedAt }[]` | | 출처. `checkedAt`은 `YYYY-MM-DD` |
| `relatedPosts` | reference → `blogPost` [] (최대 3) | | 관련 글 |
| `relatedServices` | string[] (최대 3) | | `web-app`, `ai-system`, `ax-automation`, `ai-monitoring`, `enterprise-system`, `modernization` |
| `relatedProjects` | reference → `project` [] (최대 3) | | 공개 상태 프로젝트만 표시 |
| `relatedNews` | reference → `newsArticle` [] (최대 3) | | 공개된 언론 보도 링크 |
| `consultation` | `{ enabled, title, description, label }` | | 상담 CTA. `enabled`를 켜면 홈 문의 폼으로 연결 |
| `seoTitle` | string (60자 권장) | | 비우면 `제목 | 웰던프로덕트` |
| `seoDescription` | text (160자 권장) | | 비우면 `excerpt` |
| `ogImage` | image (+`alt`) | | 공유 이미지 1200×630. 비우면 `cover` |
| `isTest` | boolean | | 운영에서 숨김 (개발 확인용) |

## 본문 `richText` (Portable Text)

배열의 각 항목은 아래 중 하나입니다. 모든 항목에 고유한 `_key`가 필요합니다.

### 텍스트 블록 `block`

- `style`: `normal` · `h2` · `h3` · `blockquote` (H1은 글 제목 전용이라 본문에 쓰지 않습니다)
- `listItem`: `bullet` · `number`, `level`: 1부터
- 꾸밈(`marks`): `strong` · `em` · `code`
- 링크: `markDefs`에 `{ _type: "link", _key, href }` (`http`, `https`, `mailto`, `/`로 시작하는 상대 경로)

```json
{ "_type": "block", "_key": "p1", "style": "normal", "markDefs": [{ "_type": "link", "_key": "l1", "href": "https://example.com" }],
  "children": [{ "_type": "span", "_key": "s1", "text": "자세한 내용은 ", "marks": [] }, { "_type": "span", "_key": "s2", "text": "여기", "marks": ["l1"] }] }
```

### 이미지 `contentImage`

```json
{ "_type": "contentImage", "_key": "i1", "caption": "설명", "image": { "_type": "image", "alt": "대체 텍스트", "asset": { "_type": "reference", "_ref": "image-…" } } }
```

이미지 파일은 먼저 `POST /assets/images/{dataset}`로 올리고 받은 `_id`를 `_ref`에 넣습니다.

### 이미지 갤러리 `imageGallery`

`images`에 이미지 정확히 3개 (`alt` 필수), 선택 `caption`.

### 표 `contentTable`

```json
{ "_type": "contentTable", "_key": "t1", "hasHeaderRow": true, "caption": "플랜 비교",
  "table": { "rows": [
    { "_type": "tableRow", "_key": "r1", "cells": ["항목", "A", "B"] },
    { "_type": "tableRow", "_key": "r2", "cells": ["가격", "10만", "20만"] } ] } }
```

### 코드 `code`

```json
{ "_type": "code", "_key": "c1", "language": "typescript", "filename": "lib/seo.ts", "code": "export const a = 1;", "highlightedLines": [1] }
```

`language`: `typescript`, `tsx`, `javascript`, `jsx`, `json`, `html`, `css`, `bash`, `python`, `sql`, `yaml`, `markdown`, `text`. 그 밖의 값은 일반 텍스트로 표시됩니다.

## 게시 전 확인

- 같은 사람을 작성자와 검토자로 동시에 지정하지 않습니다.
- FAQ·리뷰 같은 구조화 데이터는 만들지 않습니다. 화면에 있는 내용만 구조화 데이터로 출력됩니다.
- slug를 바꾸면 예전 slug를 `previousSlugs`에 추가합니다.
