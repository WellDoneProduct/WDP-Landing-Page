import type { ContentBlock, Post, Project } from './content-types';

export const categories = ['AI', 'FE-Dev', 'BE-Dev', 'PM', 'PD'];
const textBlock = (key: string, text: string, style = 'normal'): ContentBlock => ({ _key: key, _type: 'block', style, children: [{ _key: `${key}-span`, _type: 'span', text }] });
const lorem = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
const blogDetailPreview: Partial<Post> = {
  title: '반복 업무를 자동화할 때 먼저 정해야 할 것',
  contentUpdatedAt: '2026-11-03T00:00:00Z',
  author: { name: '웰던프로덕트 편집팀', role: '콘텐츠', bio: '기업의 업무를 개선하는 설계와 개발 과정을 소개합니다.' },
  body: [
    textBlock('intro', '자동화를 적용하기 전에 반복되는 작업과 담당자가 확인해야 할 시점을 구분합니다.'),
    textBlock('steps', '처리 기준과 예외를 나눠 정리합니다', 'h2'),
    {
      _key: 'guide-table', _type: 'contentTable', hasHeaderRow: true,
      caption: '업무 흐름을 확인하는 예시',
      table: { rows: [
        { _key: 'head', cells: ['단계', '입력 자료', '처리 방법', '확인 기준', '담당자'] },
        { _key: 'collect', cells: ['접수', '주문 자료', '주문 항목을 정리합니다.', '필수 항목의 누락 여부', '업무 담당자'] },
        { _key: 'review', cells: ['검토', '정리된 주문', '시스템의 품목과 대조합니다.', '단가와 품목 불일치 여부', '운영 담당자'] },
      ] },
    },
    {
      _key: 'guide-code', _type: 'code', language: 'javascript', filename: 'orders.js',
      code: 'const reviewed = orders.filter(order => order.approved && order.items.every(item => item.productId));\nconsole.log(reviewed.length);',
    },
  ],
  sources: [{ _key: 'guide-source', title: 'AX 업무 자동화 소개', url: 'https://www.welldoneproduct.com/services/ax-automation' }],
  relatedPosts: [{ title: '블로그 글 예시', slug: 'design-preview-2' }],
  consultation: { enabled: true, description: '반복되는 업무를 알려주시면 자동화할 범위부터 함께 살펴봅니다.' },
};

export const demoPosts: Post[] = Array.from({ length: 12 }, (_, i) => ({
  _id: `demo-post-${i + 1}`, slug: `design-preview-${i + 1}`, title: '제목영역입니다. 최대 두줄까지 작성할 수 있습니다.', category: categories[i % categories.length], publishedAt: `2026-10-${String(30 - i).padStart(2, '0')}T00:00:00Z`,
  cover: { url: '/editorial/blog-imgUnsplashOqtafYt5KTw1.png', alt: '코드가 표시된 화면' },
  body: [textBlock('heading-1', 'What is Lorem Ipsum?', 'h2'), textBlock('paragraph-1', lorem), { _key: 'image', _type: 'contentImage', image: { url: '/editorial/blog-imgFrame1410117987.png', alt: '함께 연구하는 사람들' } }, textBlock('heading-2', 'What is Lorem Ipsum?', 'h2'), textBlock('paragraph-2', lorem), textBlock('heading-3', 'Why do we use it?', 'h2'), textBlock('paragraph-3', lorem)],
  ...(i === 0 ? blogDetailPreview : {}),
}));
const projectAssets = [
  ['youmes', 'YOUMES', '엔터테인먼트', 'youmes-thumbnail.png', 'fantiks.svg', 180, 'rgba(0,0,0,.5)'],
  ['yonsei', '연세대학교 리빙랩', '교육·연구', 'imgFrame1410119026.png', 'imgYonsei1.png', 250, 'rgba(0,32,101,.5)'],
  ['ajou', '아주대학교의료원', '의료', 'imgFrame1410119033.png', 'imgAju1.png', 250, 'rgba(29,17,0,.5)'],
  ['koreamedix', '한국메딕스', '의료기기', 'imgFrame1410119027.png', 'imgKoreamedix1.png', 260, 'rgba(8,26,59,.5)'],
  ['cnc', 'C&C 미술학원', '교육', 'imgFrame2147228381.png', 'cnc.svg', 260, 'rgba(47,2,38,.5)'],
  ['higher', 'HIGHER', '뷰티·미용', 'imgFrame1410119028.png', 'imgGroup2.svg', 220, 'rgba(34,39,41,.5)'],
  ['aimesz', 'aimesz', '패션', 'imgFrame2147228382.png', 'aimesz.svg', 234, 'rgba(31,31,31,.4)'],
] as const;
export const starterProjects: Project[] = projectAssets.map(([slug, title, category, bg, logo, logoWidth, tint], order) => ({
  _id: `project-${slug}`, slug, title, category, order, status: 'comingSoon', service: '웹/앱 서비스 개발', description: '', period: '', scope: '', client: '', tags: [], overview: '', body: [],
  thumbnail: { url: `/editorial/portfolio-${bg}`, alt: `${title} 프로젝트` }, logo: { url: `/editorial/portfolio-${logo}`, alt: title }, logoWidth, tint,
}));
export const demoProject: Project = { ...starterProjects[0], description: '좋아하는 작품 캐릭터와 실시간 소통하고 특별한 일상을 공유할 수 있는 팬덤 플랫폼. SNS, 미디어, 스케줄 관리 기능을 갖춘 팬용 앱과 콘텐츠를 관리하는 관리자 웹', period: '2026.12 ~ 진행중', scope: '사용자 앱, 어드민', client: '(주)컨셉케이컴퍼니', tags: ['엔터테인먼트', '팬덤', '디지털 콘텐츠'], overview: lorem, body: [{ _key: 'wide', _type: 'contentImage', image: { url: '/editorial/detail-imgImg.png', alt: '프로젝트 이미지 영역' } }, textBlock('body-1', lorem), { _key: 'gallery', _type: 'imageGallery', images: [1, 2, 3].map(() => ({ url: '/editorial/detail-imgImg.png', alt: '프로젝트 이미지 영역' })) }, textBlock('body-2', lorem)] };
