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

**작성자**에서 소개를 작성한 뒤 블로그 글의 **작성·출처** 탭에서 작성자와 자료 출처를 설정합니다. 글 상단에는 최초 게시일과 작성자가 나오며, **내용 수정일**을 입력하면 수정일을 함께 표시합니다. **관련 링크** 탭에서 포트폴리오, 블로그, 언론 보도와 상담 CTA를 설정합니다. 본문에서 **코드 블록**과 **표**를 삽입할 수 있습니다.

### 포트폴리오

현재 카드 7개가 등록되어 있습니다. **목록·공개 설정**에서 배경 이미지, 로고, 로고 크기, 오버레이 색, 표시 순서를 수정합니다. 숫자가 작은 프로젝트부터 표시됩니다.

**준비 중**은 카드만 노출하고 상세 접근을 막습니다. 상세를 열려면 상단 소개·프로젝트 정보·상세 콘텐츠를 채운 뒤 **공개**로 변경하고 Publish를 누르세요. 필수 정보가 누락되면 게시가 차단됩니다. 문서 상단 **Published**를 선택한 뒤 하단 **Unpublish**는 사이트에서 숨기고 편집 가능한 초안을 남깁니다.

포트폴리오 카드 정보는 홈과 포트폴리오 목록에 함께 반영됩니다. `상세 미리보기` 탭에서 작업 중인 내용을 확인할 수 있습니다.

## 개발 데이터 초기화

`npx sanity login` 후 `npx sanity exec scripts/seed-development.ts --with-user-token`을 실행합니다. 개발 데이터셋에만 작동하며 기존 문서를 덮어쓰지 않습니다.

## 배포 연결

Vercel 계정 이관 후 개발 프로젝트에 `.env.example`의 변수를 설정하고 실제 호스트를 Sanity 프로젝트 API → CORS origins에 등록(Allow credentials)합니다. `/studio`가 편집 주소입니다. `WDP_LOCAL_DESIGN_PREVIEW`는 기본 false이며 true일 때 로컬 개발에서만 샘플 데이터를 사용합니다. 운영 데이터셋과 개발 데이터셋을 혼용하지 마세요.

검증: `npm run typecheck`, `npm run build`, `npx sanity documents validate --workspace wdp --yes`.

## 홈페이지 배포

| 환경 | GitHub 브랜치 | Vercel 프로젝트 | Sanity 데이터셋 |
| --- | --- | --- | --- |
| 개발 | `develop` | `wdp-landing-dev` | `development` |
| 운영 | `main` | `wdp-landing` | `production` |

작업 브랜치에서 `develop`으로 PR을 열고 필수 검사를 통과한 뒤 머지하면 Vercel이 개발 사이트를 자동 배포합니다. 개발에서 커밋과 동작을 확인한 뒤, 운영 배포가 승인되면 `develop`에서 `main`으로 PR을 열고 필수 검사를 통과한 뒤 머지합니다. 운영 배포에서도 Vercel의 Git 커밋 SHA를 확인합니다. 자동화 작업은 [AGENTS.md](AGENTS.md)를 따릅니다.

- 개발 사이트: https://wdp-landing-dev.vercel.app
- 운영 사이트: https://www.welldoneproduct.com
- 양쪽 편집 주소: `/studio`
- 콘텐츠 게시에 따른 정적 페이지 갱신은 각 환경의 Sanity 웹훅이 해당 Vercel 프로젝트에서 같은 Git 브랜치를 재빌드하는 방식입니다.

Sanity의 공개 문서 재빌드 필터에는 `blogPost`, `blogCategory`, `person`, `project`, `newsArticle`을 포함합니다. 작성자 문서만 수정한 경우에도 관련 글이 새 정보로 재빌드돼야 합니다.
