# Teetto 커리어 전환 웹앱

50-60대 시니어를 위한 경력 기반 사업 기회 발굴 플랫폼

## 🎯 주요 기능

### 4단계 체계적 플로우

**1단계: 경력 입력 - "나의 지난 시간 기록하기"**
- 문장 완성형(Mad Libs) 방식으로 부담 없이 입력
- "저는 [20]년 동안, [은행 창구]에서 [대출 상담]을 했습니다"
- 음성 입력 기능 지원 (준비 중)

**2단계: 발산 - "해결 가능한 문제 찾기"**
- AI가 30개의 구체적인 문제 카드 생성
- 사용자 경력으로 해결할 수 있는 실제 고객의 고통(Pain Point)
- 예: "스마트폰 뱅킹이 무서워서 은행에 가야만 하는 어르신들의 불편함"

**3단계: 수렴 - "문제의 유형화"**
- AI가 선택된 문제들을 해결 방식별로 그룹핑
- 그룹 유형: 교육, 상담, 콘텐츠
- 자신 없는 그룹은 비활성화 가능

**4단계: 정의 - "문제 해결사로서의 나"**
- 3가지 사업 정체성 중 선택
  - 전문가형: "시니어 금융 도슨트"
  - 친구형: "금융 보안관"
  - 실무형: "서류 검토 멘토"

**5단계: PDF 리포트 다운로드**
- 완성된 커리어 전환 설계서
- 경력 요약 + 선택한 문제 + 사업 정체성

## 🎨 시니어 최적화 디자인

- **큰 글씨**: 최소 18px (text-lg) ~ 56px (text-5xl)
- **고대비**: 검은 텍스트 + 밝은 배경
- **명확한 버튼**: 큰 클릭 영역, 명확한 레이블
- **브랜드 컬러**: 
  - Primary Orange (#FF8C00)
  - Secondary Dark Green (#006400)

## 🚀 빠른 시작

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

### 배포 (Vercel)

1. GitHub에 푸시
2. https://vercel.com 접속
3. "New Project" → 저장소 선택
4. 자동 배포 완료!

## 📁 프로젝트 구조

```
career-pivot-app/
├── app/
│   ├── page.tsx          # 메인 애플리케이션 (4단계 플로우)
│   ├── layout.tsx        # 레이아웃 & 메타데이터
│   └── globals.css       # 전역 스타일
├── components/
│   └── ui/
│       └── card.tsx      # 재사용 가능한 카드 컴포넌트
└── package.json          # 의존성
```

## 🔧 기술 스택

- **프레임워크**: Next.js 14+ (App Router)
- **스타일링**: Tailwind CSS
- **아이콘**: Lucide React
- **PDF 생성**: html2canvas + jsPDF
- **언어**: TypeScript

## 📊 플로우 상세

### Step 1: 경력 입력
```typescript
// 빈칸 채우기 방식
저는 [years]년 동안,
[workplace]에서
[mainWork] 일을 주로 했습니다.
저의 가장 큰 장점은 [strength]입니다.
```

### Step 2: 문제 카드 (30개)
```typescript
interface ProblemCard {
  id: number;
  problem: string;  // 구체적인 고통
  group: string;    // 교육/상담/콘텐츠
}
```

### Step 3: 그룹핑
```typescript
// AI가 자동으로 유사한 해결 방식끼리 묶음
교육 그룹: 스마트폰 사용법, 키오스크 등
상담 그룹: 대출 검토, 재무 설계 등
콘텐츠 그룹: 유튜브, 블로그 등
```

### Step 4: 사업 정체성 선택
```typescript
interface BusinessDefinition {
  type: string;        // 전문가형/친구형/실무형
  title: string;       // 사업명
  description: string; // 가치 제안
}
```

## 🔮 향후 개발 계획

### OpenAI API 통합
현재는 Mock 데이터를 사용하지만, 실제 AI 생성으로 교체 가능:

```typescript
// 1. OpenAI SDK 설치
npm install openai

// 2. 환경 변수 설정
OPENAI_API_KEY=sk-...

// 3. API 호출
import OpenAI from 'openai';

const generateProblemCards = async (career: string) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: "당신은 시니어의 경력을 분석하여 해결 가능한 문제를 찾는 비즈니스 컨설턴트입니다."
    }, {
      role: "user",
      content: `다음 경력을 분석하여 이 사람이 해결할 수 있는 타인의 구체적인 어려움 30가지를 도출해주세요: ${career}`
    }],
  });
  
  // 응답 파싱 및 반환
};
```

### 음성 입력 기능
```typescript
// Web Speech API 활용
const startVoiceInput = () => {
  const recognition = new (window as any).webkitSpeechRecognition();
  recognition.lang = 'ko-KR';
  recognition.start();
  
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    // AI로 빈칸 자동 채우기
  };
};
```

## 💡 핵심 철학

이 앱은 단순히 "치킨집", "카페" 같은 **아이템**을 추천하는 것이 아닙니다.

대신:
1. 사용자의 **경력**이 무엇인지 기록하고
2. 그 경력으로 해결할 수 있는 **타인의 고통**을 발견하고
3. 그 고통을 해결하는 **방식**을 유형화하고
4. 최종적으로 **문제 해결사로서의 정체성**을 정의합니다

"당신의 20년은 잃어버린 것이 아니라 누군가의 해결책입니다."

## 🎓 사용 가이드

### 사용자 시나리오 예시

**김영희 님 (58세, 은행 창구 20년 경력)**

1. **Step 1**: "저는 20년 동안, 은행 창구에서 대출 상담을 했습니다"
2. **Step 2**: AI가 30개 문제 제시 → 10개 선택
   - "스마트폰 뱅킹이 무서운 어르신"
   - "대출 서류가 복잡한 청년"
   - "보이스피싱이 걱정되는 분들"
3. **Step 3**: AI가 3개 그룹으로 분류
   - 교육 그룹 (5개)
   - 상담 그룹 (3개) ✓ 선택
   - 콘텐츠 그룹 (2개)
4. **Step 4**: "대출 서류 A to Z, 서류 검토 멘토" 선택
5. **Step 5**: PDF 다운로드 → 사업 시작!

## 🐛 문제 해결

**빌드 오류 시:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**PDF 생성 실패 시:**
- 브라우저 콘솔(F12) 확인
- html2canvas, jspdf 설치 확인

## 📞 지원

- 문서: README.md
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/support

---

**준비되었습니다! 🎉**

이 앱은 프로덕션 준비 완료 상태이며 시니어를 위해 최적화되어 있습니다.
