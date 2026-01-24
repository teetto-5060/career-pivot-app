# OpenAI API 연동 가이드

## 🔑 1단계: OpenAI API 키 발급

1. https://platform.openai.com 접속
2. 로그인 또는 회원가입
3. 상단 메뉴 → **API keys** 클릭
4. **Create new secret key** 클릭
5. API 키 복사 (한 번만 표시됨!)

## 💳 요금 안내
- GPT-4: $0.03 / 1K tokens (입력), $0.06 / 1K tokens (출력)
- GPT-3.5-turbo: $0.0015 / 1K tokens (입력), $0.002 / 1K tokens (출력)
- 첫 사용 시 $5 무료 크레딧 제공

## 📦 2단계: 패키지 설치

프로젝트 폴더에서 실행:

```bash
npm install openai
```

## 🔐 3단계: 환경 변수 설정

프로젝트 루트에 `.env.local` 파일 생성:

```env
OPENAI_API_KEY=sk-proj-your-api-key-here
```

**중요:** `.env.local`은 절대 GitHub에 올리지 마세요!

`.gitignore`에 이미 포함되어 있습니다:
```
.env*.local
```

## 🚀 4단계: API Route 생성

Next.js는 서버 사이드에서 API를 호출해야 합니다. (보안상 클라이언트에서 직접 호출 금지)

### `app/api/generate-problems/route.ts` 생성:

```typescript
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { career, userProblems } = await request.json();

    const prompt = `
당신은 시니어의 경력을 분석하여 사업 기회를 발굴하는 비즈니스 컨설턴트입니다.

## 사용자 경력:
${career}

## 사용자가 발견한 문제들:
${userProblems.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

## 요청사항:
위 경력과 문제들을 분석하여, 이 사람이 해결할 수 있는 **구체적인 타인의 고통(Pain Point)** 30개를 생성해주세요.

각 문제는 다음 형식의 JSON 배열로 반환:
[
  {
    "id": 1,
    "problem": "구체적인 문제 설명",
    "group": "교육형|상담형|콘텐츠형|커뮤니티형|도구형"
  },
  ...
]

**중요:**
- 각 문제는 실제 사람들이 겪는 구체적인 어려움이어야 함
- 5가지 그룹에 골고루 분산
- 사용자 입력과 연관성 높은 문제 우선
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 또는 "gpt-4o" (더 비싸지만 성능 우수)
      messages: [
        {
          role: "system",
          content: "당신은 시니어 창업 컨설턴트입니다. JSON 형식으로만 응답하세요."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const result = completion.choices[0].message.content;
    const problemCards = JSON.parse(result || '{"problems": []}');

    return NextResponse.json({ 
      success: true, 
      problems: problemCards.problems || problemCards 
    });

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

## 🔄 5단계: 프론트엔드 수정

`app/page.tsx`에서 `generateProblemCards` 함수를 수정:

```typescript
// 기존 Mock 함수 제거하고 API 호출로 변경
const generateProblemCards = async (career: string, userInputs: string[]): Promise<ProblemCard[]> => {
  try {
    const response = await fetch('/api/generate-problems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        career,
        userProblems: userInputs.filter(p => p.trim() !== '')
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'API 호출 실패');
    }

    return data.problems;

  } catch (error) {
    console.error('문제 생성 오류:', error);
    alert('AI 문제 생성에 실패했습니다. 다시 시도해주세요.');
    
    // Fallback: Mock 데이터 반환 (개발용)
    return [
      { id: 1, problem: "스마트폰 뱅킹이 무서워서 은행에 직접 가야만 하는 어르신들의 불편함", group: "교육형" },
      // ... 나머지 Mock 데이터
    ];
  }
};

// handleGenerateCards 함수 수정 (async/await 추가)
const handleGenerateCards = async () => {
  const filledProblems = userProblems.filter(p => p.trim() !== "");
  
  if (filledProblems.length < 5) {
    alert("최소 5개의 문제를 입력해주세요");
    return;
  }

  setIsGeneratingCards(true);
  
  try {
    const career = getCareerSummary();
    const cards = await generateProblemCards(career, filledProblems); // await 추가
    setProblemCards(cards);
    setStep(2.5);
    
    setTimeout(() => {
      document.getElementById("step2b")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  } catch (error) {
    console.error('카드 생성 오류:', error);
  } finally {
    setIsGeneratingCards(false);
  }
};
```

## ✅ 6단계: 테스트

### 로컬 테스트:
```bash
npm run dev
```

### Vercel 배포 시:
1. Vercel 대시보드 접속
2. 프로젝트 선택 → **Settings** → **Environment Variables**
3. `OPENAI_API_KEY` 추가
4. 값에 API 키 입력
5. **Save**

## 🎛️ 모델 선택 가이드

### GPT-4o (추천)
- 최고 성능
- 한국어 이해도 우수
- 비용: 중간
- 모델명: `"gpt-4o"`

### GPT-4o-mini (가성비)
- 빠른 속도
- 적절한 성능
- 비용: 저렴 (GPT-4의 1/10)
- 모델명: `"gpt-4o-mini"`

### GPT-3.5-turbo
- 가장 저렴
- 기본적인 작업
- 모델명: `"gpt-3.5-turbo"`

## 🐛 문제 해결

### "API key not found" 오류
```bash
# .env.local 파일 확인
cat .env.local

# 개발 서버 재시작
npm run dev
```

### "Rate limit exceeded" 오류
- 무료 크레딧 소진 또는 요청 한도 초과
- https://platform.openai.com/usage 에서 사용량 확인

### JSON 파싱 오류
- GPT가 잘못된 형식 반환
- `response_format: { type: "json_object" }` 추가
- 프롬프트에 "JSON 형식으로만" 명시

## 💡 프롬프트 최적화 팁

### 1. 구체적으로 요청
```typescript
// ❌ 나쁜 예
"문제 30개 만들어줘"

// ✅ 좋은 예
"50-60대가 은행 업무에서 겪는 구체적이고 공감 가능한 어려움 30개"
```

### 2. 예시 제공
```typescript
예시:
- "ATM 사용법을 몰라 줄이 길어지면 눈치보는 어르신"
- "보이스피싱 구별법을 몰라 불안한 시니어"
```

### 3. 출력 형식 명시
```typescript
각 문제는 반드시 다음 JSON 형식:
{
  "id": 숫자,
  "problem": "한 문장으로 된 구체적 문제",
  "group": "5가지 중 하나"
}
```

## 📊 비용 예상

### 1회 문제 생성 (30개):
- 입력: ~500 tokens
- 출력: ~1,500 tokens
- GPT-4o-mini: **약 $0.001** (1원)
- GPT-4o: **약 $0.01** (15원)

### 월 1,000명 사용 시:
- GPT-4o-mini: **$1** (1,500원)
- GPT-4o: **$10** (15,000원)

## 🔒 보안 주의사항

1. ❌ **절대 금지:** 클라이언트에서 직접 API 호출
   ```typescript
   // 이렇게 하지 마세요!
   const openai = new OpenAI({ apiKey: 'sk-...' }); // API 키 노출!
   ```

2. ✅ **올바른 방법:** Next.js API Route 사용
   ```typescript
   // /app/api/generate-problems/route.ts 에서만 호출
   ```

3. 🔐 `.env.local`은 절대 커밋하지 마세요

## 🚀 배포 체크리스트

- [ ] OpenAI API 키 발급
- [ ] `.env.local` 파일 생성
- [ ] `npm install openai` 실행
- [ ] API Route 파일 생성
- [ ] 프론트엔드 수정
- [ ] 로컬 테스트
- [ ] Vercel에 환경 변수 추가
- [ ] 배포 후 테스트

완료! 🎉
