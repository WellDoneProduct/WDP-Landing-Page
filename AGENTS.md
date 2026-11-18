<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## WDP 홈페이지 배포

- GitHub `WellDoneProduct/WDP-Landing-Page`를 배포 소스로 사용한다. 로컬 작업 폴더를 Vercel CLI로 직접 배포하지 않는다.
- 개발 배포는 작업 브랜치를 `develop`에 머지하고 GitHub에 푸시한다. Vercel `wdp-landing-dev`가 `develop`을 자동 배포한다. 배포 상태가 Ready이고 배포 커밋 SHA가 GitHub `develop`과 일치하는지 확인한다.
- 운영 배포는 사용자가 승인한 경우에만 진행한다. 성공한 개발 커밋을 확인한 뒤 `develop`을 `main`에 머지하고 GitHub에 푸시한다. Vercel `wdp-landing`이 `main`을 자동 배포한다. 배포 상태와 커밋 SHA를 확인하고 운영 주소에서 변경사항을 검증한다.
- 머지 전에 원격 브랜치를 갱신하고 로컬 변경과 양쪽 브랜치의 차이를 검토한다. CMS 호출 절감과 이미지 최적화 등 기존 변경이 유지되는지 확인한다. CI나 개발 배포가 실패하면 원인을 해결하기 전까지 운영으로 승격하지 않는다.
- 개발은 Sanity `development`, 운영은 `production` 데이터셋을 사용한다. 콘텐츠 게시에 따른 재빌드는 같은 환경의 브랜치를 가리키는 웹훅으로만 실행한다. 토큰, 배포 훅 URL, 로컬 환경 파일은 커밋하지 않는다.
