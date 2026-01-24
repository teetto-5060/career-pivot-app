# 🚀 빠른 시작 가이드

## ✅ 해결된 문제들

1. ✅ **PDF 다운로드 오류** 수정 완료
2. ✅ **OpenAI API 연동** 완료

---

## 📦 설치 순서

### 1단계: 기본 설치
```bash
# 압축 해제 후
cd career-pivot-app

# 패키지 설치 (openai 포함)
npm install
```

### 2단계: OpenAI API 키 설정

#### A. API 키 발급
1. https://platform.openai.com 접속
2. 로그인 → **API keys** → **Create new secret key**
3. 키 복사 (sk-proj-...)

#### B. 환경 변수 설정
```bash
# .env.local.example을 복사
cp .env.local.example .env.local

# .env.local 파일 열어서 API 키 입력
# OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

**윈도우에서:**
```bash
# .env.local 파일 직접 생성
notepad .env.local
```

내용:
```
OPENAI_API_KEY=sk-proj-your-actual-api-key-here
```

### 3단계: 실행
```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 🎯 테스트 방법

### Mock 데이터로 테스트 (API 없이)
- 그냥 실행하면 됩니다
- API 호출 실패 시 자동으로 Mock 데이터 사용
- "AI 문제 생성에 실패했습니다. Mock 데이터로 진행합니다." 메시지

### 실제 API로 테스트
1. `.env.local`에 유효한 API 키 입력
2. 개발 서버 재시작: `npm run dev`
3. Step 2에서 문제 5개 입력
4. "AI로 30개 문제 카드 만들기" 클릭
5. 실시간으로 AI가 30개 생성!

---

## 💡 작동 방식

### Step 2A: 사용자 입력
```
사용자가 5-10개 문제 입력
↓
"AI로 30개 문제 카드 만들기" 버튼 클릭
```

### Step 2B: AI 생성
```
프론트엔드 → /api/generate-problems (POST)
↓
OpenAI API 호출 (GPT-4o-mini)
↓
30개 문제 카드 생성
↓
프론트엔드로 반환
```

### PDF 다운로드
```
Step 5에서 "PDF 리포트 다운로드" 클릭
↓
html2canvas로 DOM을 이미지로 변환
↓
jsPDF로 PDF 생성
↓
자동 다운로드
```

---

## 🐛 문제 해결

### PDF 다운로드 안 될 때
```bash
# 브라우저 콘솔 확인 (F12)
# 오류 메시지 확인

# 다시 시도
1. 페이지 새로고침
2. Step 5까지 다시 진행
3. PDF 다운로드 버튼 클릭
```

### OpenAI API 오류

#### "API key not found"
```bash
# .env.local 파일 확인
cat .env.local

# 개발 서버 재시작
npm run dev
```

#### "Rate limit exceeded"
- 무료 크레딧 소진
- https://platform.openai.com/usage 에서 확인

#### "Invalid API key"
- API 키 다시 확인
- 공백이나 줄바꿈 없는지 확인

### Mock 데이터가 계속 나올 때
```bash
# API가 제대로 호출되지 않는 경우
# 브라우저 콘솔에서 확인:

POST http://localhost:3000/api/generate-problems
```

---

## 💰 비용 안내

### GPT-4o-mini (권장)
- 1회 생성: **약 $0.001** (1원)
- 월 1,000명 사용: **$1** (1,500원)

### GPT-4o
- 1회 생성: **약 $0.01** (15원)
- 월 1,000명 사용: **$10** (15,000원)

### 첫 사용
- $5 무료 크레딧 제공
- 약 5,000회 테스트 가능 (GPT-4o-mini 기준)

---

## 🚀 Vercel 배포

### 1. GitHub 업로드
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

### 2. Vercel 설정
1. https://vercel.com 접속
2. "New Project" → GitHub 연동
3. **Environment Variables** 추가:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-proj-...`
4. Deploy!

### 3. 배포 후 테스트
- 배포된 URL 접속
- 전체 플로우 테스트
- PDF 다운로드 확인

---

## 📁 새로 추가된 파일

```
career-pivot-app/
├── app/
│   ├── api/
│   │   └── generate-problems/
│   │       └── route.ts          ← OpenAI API 호출
│   └── page.tsx                  ← API 연동 업데이트
├── .env.local.example            ← 환경 변수 템플릿
├── OPENAI-SETUP.md              ← 상세 설정 가이드
└── package.json                  ← openai 패키지 추가
```

---

## ✨ 주요 변경사항

1. **PDF 생성 개선**
   - 여러 페이지 지원
   - 오류 처리 개선
   - 성공 메시지 추가

2. **OpenAI API 연동**
   - `/api/generate-problems` 엔드포인트
   - GPT-4o-mini 사용
   - Fallback Mock 데이터

3. **환경 변수 관리**
   - `.env.local` 사용
   - 보안 강화

---

## 📞 지원

문제가 있으면:
1. `OPENAI-SETUP.md` 상세 가이드 확인
2. 브라우저 콘솔(F12) 확인
3. 터미널 오류 메시지 확인

완료! 🎉
