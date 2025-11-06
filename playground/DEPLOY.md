# UIH Playground 배포 가이드

## Vercel 배포 (추천)

### 1단계: Vercel 로그인
```bash
npx vercel login
```
이메일 또는 GitHub 계정으로 로그인합니다.

### 2단계: 프로젝트 연결
```bash
cd /Users/jaewonlee/Documents/CODESBYLEEJAEWON/uih
npx vercel
```

프롬프트가 나타나면:
1. **Set up and deploy?** → Yes
2. **Which scope?** → 본인 계정 선택
3. **Link to existing project?** → No
4. **Project name?** → uih-playground (또는 원하는 이름)
5. **In which directory is your code located?** → ./
6. **Override settings?** → No

### 3단계: 프로덕션 배포
```bash
npx vercel --prod
```

배포가 완료되면 URL이 표시됩니다:
```
https://uih-playground.vercel.app
```

## 배포 후 설정

### 커스텀 도메인 연결 (선택)
Vercel 대시보드에서:
1. 프로젝트 선택
2. Settings → Domains
3. 도메인 추가

### 환경 변수 (필요시)
현재는 환경 변수가 필요 없지만, 나중에 추가하려면:
1. Vercel 대시보드
2. Settings → Environment Variables

## 자동 배포

GitHub에 푸시하면 자동으로 배포됩니다:
- `main` 브랜치 → 프로덕션
- 다른 브랜치 → 프리뷰

## 문제 해결

### 빌드 실패
```bash
# 로컬에서 빌드 테스트
pnpm --filter uih-playground build
```

### 로그 확인
Vercel 대시보드 → Deployments → 해당 배포 → Build Logs
