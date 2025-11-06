# UIH Playground Vercel 배포 가이드

## 현재 배포 URL

https://uih-playground.vercel.app

## 중요: Vercel 설정 (404 에러 방지)

### Root Directory 설정 필수!

Vercel 대시보드에서 **반드시** 다음을 설정해야 합니다:

1. **Project Settings** → **General** → **Root Directory**
   - 값: `playground`
   - ⚠️ **중요**: `.` (root)가 아니라 `playground`로 설정!

2. **Build & Development Settings**
   - Build Command: 비워두기 (vercel.json이 자동 처리)
   - Output Directory: 비워두기 (vercel.json이 자동 처리)
   - Install Command: 비워두기 (vercel.json이 자동 처리)

### 설정 파일 구조

**playground/vercel.json** (메인 설정 - Root Directory가 playground일 때 사용됨):
```json
{
  "buildCommand": "cd .. && pnpm install --frozen-lockfile && pnpm build && cd playground && pnpm build",
  "installCommand": "pnpm install --frozen-lockfile",
  "framework": "nextjs"
}
```

**빌드 순서**:
1. 상위 디렉토리로 이동 (`cd ..`)
2. 전체 workspace 의존성 설치
3. 전체 workspace 빌드 (parser, codegen 빌드)
4. playground로 돌아옴
5. Next.js 앱 빌드

## Monorepo 구조 설명

```
uih/
├── packages/
│   ├── parser/          # UIH 파서 (의존성)
│   └── codegen-react/   # React 코드 생성기 (의존성)
└── playground/          # Next.js 앱 (배포 대상)
    ├── vercel.json      # Vercel 빌드 설정
    ├── next.config.ts   # Next.js 설정 (outputFileTracingRoot)
    └── package.json     # workspace:* 의존성
```

playground는 `uih-parser`와 `uih-codegen-react`를 `workspace:*` 프로토콜로 의존하므로,
배포 시 상위 패키지들을 먼저 빌드해야 합니다.

## 초기 배포 (CLI)

### 1단계: Vercel 로그인
```bash
npx vercel login
```

### 2단계: 프로젝트 배포
```bash
cd /Users/jaewonlee/Documents/CODESBYLEEJAEWON/uih/playground
npx vercel
```

### 3단계: 프로덕션 배포
```bash
npx vercel --prod
```

## GitHub 자동 배포

GitHub에 푸시하면 자동으로 배포됩니다:
- `main` 브랜치 → 프로덕션 배포
- 다른 브랜치 → 프리뷰 배포

## 로컬 테스트

배포 전 로컬에서 프로덕션 빌드 테스트:

```bash
cd playground
pnpm build
pnpm start
```

http://localhost:3000 에서 정상 작동 확인

## 재배포 방법

1. 코드 변경 후 `git push`
2. Vercel이 자동으로 감지하여 배포
3. 또는 Vercel 대시보드에서 수동 **Redeploy** 클릭

## 문제 해결

### 404 에러 (가장 흔한 문제)

**증상**: 빌드는 성공하지만 페이지 접속 시 404

**원인**: Root Directory 설정이 잘못됨

**해결**:
1. Vercel 대시보드 → Project Settings → General
2. **Root Directory**를 `playground`로 변경
3. **Save** 후 Deployments 탭에서 **Redeploy** 클릭
4. 배포 완료 후 사이트 접속 확인

### npm workspace 에러

**증상**: `npm error Unsupported URL Type "workspace:"`

**원인**: Vercel이 npm 대신 pnpm을 사용하지 못함

**해결**:
- 프로젝트 루트에 `.npmrc` 파일 확인
- 루트 `package.json`에 `"packageManager": "pnpm@10.19.0"` 확인

### No Next.js version detected

**증상**: Next.js를 찾을 수 없다는 에러

**원인**: Root Directory가 잘못 설정되어 package.json을 찾지 못함

**해결**: Root Directory를 `playground`로 설정

### Output Directory 에러

**증상**: `.next` 디렉토리를 찾을 수 없음

**원인**: Root Directory와 outputDirectory 경로 불일치

**해결**: Root Directory를 `playground`로 설정하면 자동으로 `.next` 사용

## 배포 설정 체크리스트

배포 전 확인 사항:

- [ ] Vercel 대시보드에서 Root Directory = `playground`
- [ ] playground/vercel.json 파일 존재
- [ ] playground/package.json에 next 의존성 존재
- [ ] 루트 package.json에 `"packageManager": "pnpm@10.19.0"` 존재
- [ ] 루트에 `.npmrc` 파일 존재
- [ ] 로컬 프로덕션 빌드 테스트 완료 (`pnpm build && pnpm start`)

## 배포 로그 확인

문제 발생 시 로그 확인:
1. Vercel 대시보드 → Deployments
2. 최신 배포 클릭
3. **Build Logs** 탭에서 빌드 과정 확인
4. **Functions** 탭에서 API 라우트 확인 (`/api/compile`)
5. **Runtime Logs** 탭에서 실행 중 에러 확인

## 성능 최적화 (선택)

### Edge Functions 활용
- API 라우트를 Edge Runtime으로 변환 가능
- playground/app/api/compile/route.ts에 `export const runtime = 'edge'` 추가

### Analytics 설정
- Vercel 대시보드 → Analytics 탭
- 트래픽, 성능 지표 확인

### 커스텀 도메인 (선택)
1. Vercel 대시보드 → Settings → Domains
2. 도메인 추가 및 DNS 설정
