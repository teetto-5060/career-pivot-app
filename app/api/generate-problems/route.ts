import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { career, userProblems } = await request.json();

    const prompt = `
당신은 KJ 매핑 전문가이자 시니어 창업 컨설턴트입니다.
사용자의 아이디어를 함께 구체화하는 협력자로서, 긍정적이고 확장성 있는 문장을 생성합니다.

## 사용자 경력:
${career}

## 사용자가 작성한 "~하면 좋겠다" 문장들:
${userProblems.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

## KJ 매핑 원칙:
1. **긍정적 프레이밍**: 문제가 아닌 "해결되면 좋을 것" 관점
2. **확장적 사고**: 사용자 입력을 다양한 각도로 확장
3. **구체성**: 막연한 희망이 아닌 실현 가능한 아이디어
4. **사용자 중심**: 사용자의 경력과 강점을 활용할 수 있는 것

## 요청사항:
위 사용자 입력을 **확장**하여, 관련된 30개의 "~하면 좋겠다" 문장을 생성해주세요.

### 생성 가이드:
- 모든 문장은 **"~하면 좋겠다"** 또는 **"~할 수 있으면 좋겠다"**로 끝나야 함
- 사용자가 입력한 문장과 연관성이 높을수록 좋음
- 사용자의 경력(${career.split(',')[0]})을 활용할 수 있는 것
- 다양한 해결 방식 포함: 교육, 상담, 콘텐츠, 커뮤니티, 도구 등
- 50-60대 시니어가 공감할 수 있는 구체적인 상황

### 예시:
- "시니어가 스마트폰 뱅킹을 집에서 편안하게 사용하면 좋겠다"
- "은퇴 준비하는 분들이 적절한 투자처를 쉽게 찾을 수 있으면 좋겠다"
- "어르신들이 보이스피싱 걱정 없이 금융 앱을 쓸 수 있으면 좋겠다"

## 출력 형식 (JSON):
{
  "problems": [
    {
      "id": 1,
      "problem": "~하면 좋겠다 형식의 문장",
      "group": "교육형|상담형|콘텐츠형|커뮤니티형|도구형|하이브리드형"
    },
    ... 총 30개
  ]
}

**중요:**
- 반드시 정확히 30개 생성
- 모든 문장이 "~하면 좋겠다" 형식
- group은 내부 분류용 (UI에는 표시 안 함)
- 각 그룹에 골고루 분산 (각 5개 이상)
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "당신은 KJ 매핑 전문가입니다. 사용자의 아이디어를 긍정적으로 확장하여 구체화합니다. JSON 형식으로만 응답하세요."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 3000,
    });

    const result = completion.choices[0].message.content;
    
    if (!result) {
      throw new Error('OpenAI returned empty response');
    }

    const parsed = JSON.parse(result);
    const problems = parsed.problems || [];

    // 검증: 30개가 맞는지 확인
    if (problems.length < 30) {
      console.warn(`Only ${problems.length} problems generated, expected 30`);
    }

    return NextResponse.json({ 
      success: true, 
      problems: problems 
    });

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
    // 에러 상세 정보 로깅
    if (error.response) {
      console.error('API Response Error:', error.response.data);
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        details: error.response?.data || null
      },
      { status: 500 }
    );
  }
}
