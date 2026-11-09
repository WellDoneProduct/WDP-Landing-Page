import { defineArrayMember, defineField, defineType } from 'sanity';

const imageFields = [defineField({ name: 'alt', title: '대체 텍스트', type: 'string', description: '이미지를 보지 못하는 방문자에게 설명할 내용입니다.', validation: rule => rule.required() })];
const richText = defineType({
  name: 'richText', title: '본문', type: 'array', of: [
    defineArrayMember({ type: 'block', styles: [{ title: '본문', value: 'normal' }, { title: '제목', value: 'h2' }, { title: '소제목', value: 'h3' }, { title: '인용', value: 'blockquote' }], lists: [{ title: '글머리 기호', value: 'bullet' }, { title: '번호 목록', value: 'number' }], marks: { decorators: [{ title: '굵게', value: 'strong' }, { title: '기울임', value: 'em' }, { title: '코드', value: 'code' }], annotations: [{ name: 'link', title: '링크', type: 'object', fields: [{ name: 'href', title: 'URL', type: 'url', validation: rule => rule.required().uri({ scheme: ['http', 'https', 'mailto'], allowRelative: true }) }] }] } }),
    defineArrayMember({ name: 'contentImage', title: '본문 이미지', type: 'object', fields: [defineField({ name: 'image', title: '이미지', type: 'image', options: { hotspot: true }, fields: imageFields, validation: rule => rule.required() }), defineField({ name: 'caption', title: '이미지 설명', type: 'string' })], preview: { select: { title: 'image.alt', media: 'image' } } }),
    defineArrayMember({ name: 'imageGallery', title: '이미지 갤러리 (큰 이미지 + 작은 이미지 2개)', type: 'object', fields: [defineField({ name: 'images', title: '이미지', type: 'array', of: [{ type: 'image', options: { hotspot: true }, fields: imageFields }], validation: rule => rule.required().length(3) }), defineField({ name: 'caption', title: '갤러리 설명', type: 'string' })], preview: { select: { media: 'images.0' }, prepare: ({ media }) => ({ title: '이미지 갤러리', media }) } }),
  ],
});
const blogCategory = defineType({ name: 'blogCategory', title: '블로그 카테고리', type: 'document', fields: [defineField({ name: 'title', title: '이름', type: 'string', validation: rule => rule.required() }), defineField({ name: 'order', title: '표시 순서', type: 'number', initialValue: 0, validation: rule => rule.required().integer().min(0) })], orderings: [{ title: '표시 순서', name: 'order', by: [{ field: 'order', direction: 'asc' }] }] });
const blogPost = defineType({
  name: 'blogPost', title: '블로그 글', type: 'document', groups: [{ name: 'summary', title: '목록·기본 정보', default: true }, { name: 'content', title: '상세 본문' }], fields: [
    defineField({ name: 'title', title: '제목', type: 'string', group: 'summary', description: '목록에서는 최대 2줄로 표시됩니다.', validation: rule => rule.required().max(120) }),
    defineField({ name: 'slug', title: '주소', type: 'slug', description: '의미가 드러나는 영문 주소를 입력하세요. 예: ai-native-journey. 게시 후 주소를 변경하면 기존 링크가 끊어집니다.', group: 'summary', options: { source: 'title', maxLength: 96 }, validation: rule => rule.required() }),
    defineField({ name: 'category', title: '카테고리', type: 'reference', to: [{ type: 'blogCategory' }], group: 'summary', validation: rule => rule.required() }),
    defineField({ name: 'publishedAt', title: '게시일', type: 'datetime', initialValue: () => new Date().toISOString(), group: 'summary', description: '미래 날짜의 글은 해당 시간이 지나면 목록에 표시됩니다.', validation: rule => rule.required() }),
    defineField({ name: 'thumbnail', title: '목록 썸네일', type: 'image', options: { hotspot: true }, fields: imageFields, group: 'summary', validation: rule => rule.required() }),
    defineField({ name: 'isTest', title: '테스트 콘텐츠 (운영에서 숨김)', type: 'boolean', initialValue: false, group: 'summary', description: '개발계에는 표시되지만 운영 목록·상세·사이트맵에서는 제외됩니다.' }),
    defineField({ name: 'excerpt', title: '검색 결과 요약', type: 'text', rows: 3, group: 'summary', validation: rule => rule.max(180) }),
    defineField({ name: 'cover', title: '상세 상단 배경 이미지', type: 'image', options: { hotspot: true }, fields: imageFields, group: 'content', validation: rule => rule.required() }),
    defineField({ name: 'body', title: '본문', type: 'richText', group: 'content', description: 'PC는 가운데 정렬, 모바일은 왼쪽 정렬로 표시됩니다.', validation: rule => rule.required().min(1) }),
  ], orderings: [{ title: '최신 게시일', name: 'date', by: [{ field: 'publishedAt', direction: 'desc' }] }], preview: { select: { title: 'title', subtitle: 'category.title', media: 'thumbnail' } },
});
const project = defineType({
  name: 'project', title: '포트폴리오', type: 'document', groups: [{ name: 'listing', title: '목록·공개 설정', default: true }, { name: 'hero', title: '상단 소개' }, { name: 'details', title: '프로젝트 정보' }, { name: 'body', title: '상세 콘텐츠' }],
  fields: [
    defineField({ name: 'title', title: '프로젝트 이름', type: 'string', group: 'listing', validation: rule => rule.required() }),
    defineField({ name: 'slug', title: '주소', type: 'slug', group: 'listing', options: { source: 'title', maxLength: 96 }, validation: rule => rule.required() }),
    defineField({ name: 'status', title: '상세 공개 상태', type: 'string', group: 'listing', initialValue: 'comingSoon', options: { list: [{ title: '준비 중 — 카드만 표시, 상세 접근 차단', value: 'comingSoon' }, { title: '공개 — 상세 접근 허용', value: 'public' }], layout: 'radio' }, validation: rule => rule.required() }),
    defineField({ name: 'order', title: '표시 순서', type: 'number', group: 'listing', initialValue: 0, validation: rule => rule.required().integer().min(0) }),
    defineField({ name: 'category', title: '프로젝트 카테고리', type: 'string', group: ['listing', 'details'], validation: rule => rule.required() }),
    defineField({ name: 'thumbnail', title: '카드 배경 이미지', type: 'image', options: { hotspot: true }, fields: imageFields, group: 'listing', validation: rule => rule.required() }),
    defineField({ name: 'logo', title: '카드 로고 (투명 배경)', type: 'image', fields: imageFields, group: 'listing' }),
    defineField({ name: 'logoWidth', title: '로고 최대 너비 (px)', type: 'number', initialValue: 240, group: 'listing', validation: rule => rule.min(40).max(360) }),
    defineField({ name: 'tint', title: '카드 배경 오버레이 색상', type: 'string', initialValue: 'rgba(0,0,0,0.3)', group: 'listing', description: '예: rgba(55,10,103,0.5)' }),
    defineField({ name: 'service', title: '제공 서비스', type: 'string', initialValue: '웹/앱 서비스 개발', group: 'hero', validation: rule => rule.custom((value, context) => context.document?.status === 'public' && !value ? '공개하려면 서비스 유형을 입력해주세요.' : true) }),
    defineField({ name: 'description', title: '프로젝트 소개', type: 'text', rows: 4, group: 'hero', validation: rule => rule.custom((value, context) => context.document?.status === 'public' && !value ? '공개하려면 소개를 입력해주세요.' : true) }),
    defineField({ name: 'tags', title: '해시태그', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' }, group: 'hero', validation: rule => rule.max(6) }),
    defineField({ name: 'heroImage', title: '대표 이미지 (PC)', type: 'image', fields: imageFields, group: 'hero', description: '화면 레이아웃은 해상도에 맞춰 자동으로 바뀝니다.', validation: rule => rule.custom((value, context) => context.document?.status === 'public' && !value?.asset ? '공개하려면 대표 이미지를 등록해주세요.' : true) }),
    defineField({ name: 'heroMobileImage', title: '대표 이미지 (모바일, 선택)', type: 'image', fields: imageFields, group: 'hero', description: '비워두면 PC 대표 이미지를 재사용합니다.' }),
    defineField({ name: 'period', title: '제작 기간', type: 'string', group: 'details', description: '예: 2026.01 ~ 2026.06 / 2026.01 ~ 진행중' }),
    defineField({ name: 'scope', title: '제작 범위', type: 'string', group: 'details' }),
    defineField({ name: 'client', title: '클라이언트', type: 'string', group: 'details' }),
    defineField({ name: 'overview', title: 'Overview', type: 'text', rows: 6, group: 'body', validation: rule => rule.custom((value, context) => context.document?.status === 'public' && !value ? '공개하려면 Overview를 입력해주세요.' : true) }),
    defineField({ name: 'body', title: '상세 본문·이미지', type: 'richText', group: 'body', validation: rule => rule.custom((value, context) => context.document?.status === 'public' && (!Array.isArray(value) || value.length === 0) ? '공개하려면 상세 콘텐츠를 입력해주세요.' : true) }),
    defineField({ name: 'related', title: '다른 프로젝트 둘러보기', type: 'array', of: [{ type: 'reference', to: [{ type: 'project' }] }], group: 'body', description: '비우면 나머지 프로젝트를 표시 순서대로 보여줍니다.' }),
  ], orderings: [{ title: '표시 순서', name: 'order', by: [{ field: 'order', direction: 'asc' }] }], preview: { select: { title: 'title', status: 'status', media: 'thumbnail' }, prepare: ({ title, status, media }) => ({ title, subtitle: status === 'public' ? '공개' : '준비 중 · 상세 비공개', media }) },
});
const newsArticle = defineType({
  name: 'newsArticle', title: '뉴스', type: 'document', fields: [
    defineField({name: 'title', title: '제목', type: 'string', validation: rule => rule.required()}),
    defineField({name: 'thumbnail', title: '썸네일', type: 'image', options: {hotspot: true}, fields: imageFields, validation: rule => rule.required()}),
    defineField({name: 'publishedAt', title: '기사 게시일', type: 'datetime', validation: rule => rule.required()}),
    defineField({name: 'url', title: '외부 기사 링크', type: 'url', description: '카드를 누르면 새 탭에서 열립니다.', validation: rule => rule.required().uri({scheme: ['http', 'https']})}),
  ], preview: {select: {title: 'title', subtitle: 'publishedAt', media: 'thumbnail'}},
  orderings: [{title: '최신 기사 순', name: 'date', by: [{field: 'publishedAt', direction: 'desc'}]}],
});
export const schemaTypes = [blogCategory, blogPost, project, richText, newsArticle];
