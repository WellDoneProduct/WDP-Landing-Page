# WDP Landing Page

## 로컬 실행

Node.js 24를 사용합니다. `npm install` 후 `.env.example`을 `.env.local`로 복사하고 Sanity 프로젝트 ID와 데이터셋을 입력하세요. `npm run dev`로 실행합니다.

## 콘텐츠 편집

- 편집 화면: http://127.0.0.1:3000/studio
- Sanity 프로젝트: WELLDONEPRODUCT (`r3e6hitc`), 개발 데이터셋: `development`
- 프로젝트 접근 권한이 있는 Sanity 계정으로 로그인합니다.
- 입력은 초안으로 자동 저장됩니다. **Publish**를 눌러야 사이트에 반영됩니다.
- 게시된 변경은 약 30초 후 다음 페이지 요청부터 갱신됩니다. 이미 열어둔 페이지는 새로고침하세요.

### 블로그

왼쪽 **블로그 글**에서 새 문서를 만듭니다. 제목, 주소(Generate), 카테고리, 게시일, 목록 썸네일을 입력하고 **상세 본문** 탭에서 상단 이미지와 본문을 작성합니다. 이미지에는 대체 텍스트도 입력하세요. 본문은 제목, 목록, 링크, 이미지 및 3장 갤러리를 지원합니다. 미래 게시일의 글은 그 시간이 지나야 보입니다.

`[작성 예시]` 초안은 작성 연습용이며 게시되지 않았습니다. 실제 내용으로 바꾸거나 별도 새 글을 작성하세요. **블로그 카테고리**에서 카테고리와 표시 순서를 관리합니다.

### 포트폴리오

현재 카드 7개가 등록되어 있습니다. **목록·공개 설정**에서 배경 이미지, 로고, 로고 크기, 오버레이 색, 표시 순서를 수정합니다. 숫자가 작은 프로젝트부터 표시됩니다.

**준비 중**은 카드만 노출하고 상세 접근을 막습니다. 상세를 열려면 상단 소개·프로젝트 정보·상세 콘텐츠를 채운 뒤 **공개**로 변경하고 Publish를 누르세요. 필수 정보가 누락되면 게시가 차단됩니다. 문서 상단 **Published**를 선택한 뒤 하단 **Unpublish**는 사이트에서 숨기고 편집 가능한 초안을 남깁니다.

홈의 기존 사례 카드는 정적 HTML입니다. CMS 편집은 블로그와 포트폴리오 페이지에 반영됩니다.

## 개발 데이터 초기화

`npx sanity login` 후 `npx sanity exec scripts/seed-development.ts --with-user-token`을 실행합니다. 개발 데이터셋에만 작동하며 기존 문서를 덮어쓰지 않습니다.

## 배포 연결

Vercel 계정 이관 후 개발 프로젝트에 `.env.example`의 변수를 설정하고 실제 호스트를 Sanity 프로젝트 API → CORS origins에 등록(Allow credentials)합니다. `/studio`가 편집 주소입니다. `WDP_LOCAL_DESIGN_PREVIEW`는 기본 false이며 true일 때 로컬 개발에서만 샘플 데이터를 사용합니다. 운영 데이터셋과 개발 데이터셋을 혼용하지 마세요.

검증: `npm run typecheck`, `npm run build`, `npx sanity documents validate --workspace wdp --yes`.

## 개발계 배포 (2026-11-09)

### 운영 SEO 배포와의 구분

이 브랜치는 새 메뉴와 CMS가 포함된 개발계 소스입니다. 새 화면의 운영 공개는 별도 확인 후 진행합니다.
현재 운영은 `0a0ad21` 기준의 기존 홈에 SEO만 적용한 별도 배포이며, 변경 내역은 `seo/production-seo.patch`에 보관했습니다.
운영 본문·메뉴·동작 스크립트는 기존 그대로 유지했습니다.

개발계 SEO에는 페이지별 canonical/OG/Twitter, JSON-LD, 서버 렌더링 메뉴, 카테고리 URL과 페이지네이션, 자체 호스팅 폰트가 포함됩니다.
새 메뉴를 운영에 공개할 때는 `WDP_ENVIRONMENT=production`과 `NEXT_PUBLIC_SANITY_DATASET=production`이 모두 필요하며 Vercel Preview는 계속 noindex입니다.
기존 운영 홈 전용 배포는 운영 환경에서 홈 URL만 사이트맵에 포함합니다.
Sanity의 테스트 콘텐츠 설정, 이미지 설명, 기존 글 주소는 새 화면 운영 공개 전 다시 검토합니다.

- Vercel 팀: `not-yellow-mango-yes-red-mango-s-projects`
- 별도 개발 프로젝트: `wdp-landing-dev`
- 사이트: https://wdp-landing-dev.vercel.app
- 편집기: https://wdp-landing-dev.vercel.app/studio
- Sanity: `r3e6hitc` / `development`
- 이번 배포는 CLI로 현재 작업 폴더를 업로드했습니다. Git 자동 배포 연결은 아직 설정하지 않았습니다.
- 재배포: Node 24에서 `vercel deploy --prod --scope not-yellow-mango-yes-red-mango-s-projects` (반드시 `.vercel/project.json`의 프로젝트가 `wdp-landing-dev`인지 확인).
- `www.dev-welldoneproduct.com`은 개발 프로젝트에 등록됐지만 DNS 설정 대기 중입니다. 해당 도메인의 DNS에 `CNAME www → 73f2f6e8280edba7.vercel-dns-016.com`을 등록한 뒤 검증하고, Sanity CORS에 해당 HTTPS 출처를 추가하세요.
