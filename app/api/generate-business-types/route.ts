import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { career, userProblems, selectedProblems, groupedProblems } = await request.json();

    const problemSummary = selectedProblems
      .map((p: any) => `- ${p.problem}`)
      .join('\n');

    const groupSummary = Object.entries(groupedProblems)
      .map(([group, problems]: [string, any]) => `${group}: ${problems.length}개`)
      .join(', ');

    const prompt = `
당신은 린 스타트업 방법론과 KJ 매핑 기법을 활용하는 비즈니스 컨설턴트입니다.
사용자의 경력과 선택한 아이디어를 바탕으로 실행 가능한 비즈니스 아이템을 제안합니다.

## 사용자 경력:
${career}

## 사용자가 발견한 아이디어:
${userProblems.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

## 선택한 아이디어 (${selectedProblems.length}개):
${problemSummary}

## 아이디어 분포:
${groupSummary}

## 요청사항:
위 정보를 종합 분석하여, **실행 가능한 비즈니스 아이템 6가지**를 제안해주세요.

### 린 캔버스 3요소 구조:
각 아이템은 다음 형식으로 작성:
1. **문제 (What)**: 어떤 문제를 해결하는가?
2. **고객 (Who)**: 누구를 위한 것인가?
3. **해결책 (How)**: 어떻게 해결하는가?

### 6가지 유형:
1. **교육형** - 1:1 또는 소그룹 교육/코칭
2. **상담형** - 전문 상담 및 컨설팅 서비스
3. **콘텐츠형** - 온라인 콘텐츠 제작 (유튜브, 블로그 등)
4. **커뮤니티형** - 커뮤니티/모임 운영
5. **도구형** - 간단한 도구/템플릿/체크리스트 제공
6. **하이브리드형** - 위 방식들을 조합한 독특한 모델

### 작성 가이드:
- title(문제): 구체적인 문제나 고통 (예: "보이스피싱 불안과 금융 사기 두려움")
- description(고객): 타겟 고객과 상황 (예: "디지털 금융이 낯선 50-60대 시니어")
- why(해결책): 구체적 해결 방법 (예: "1:1 화상 통화로 실시간 뱅킹 지도")
- 사용자의 실제 경력과 강하게 연결
- 내일 당장 시작할 수 있을 정도로 구체적

### 예시:
{
  "type": "교육형 (Educator)",
  "title": "스마트폰 뱅킹 사용의 두려움과 실수 불안",
  "description": "디지털 금융 전환이 부담스러운 60대 이상 어르신",
  "why": "카카오톡 화상통화로 화면을 보며 함께 따라하는 1:1 개인 지도"
}

## 출력 형식 (JSON):
{
  "businessTypes": [
    {
      "id": 1,
      "type": "교육형 (Educator)",
      "title": "어떤 문제 (구체적으로)",
      "description": "누구를 위해 (타겟 고객)",
      "why": "어떻게 해결 (실행 방법)"
    },
    ... 총 6개
  ]
}

**중요:**
- 직업명이 아닌 **문제-고객-해결책** 구조
- title: 20자 내외로 간결하게
- description: 30자 내외로 구체적으로
- why: 40자 내외로 실행 가능하게
- 각 유형은 사용자 경력과 밀접하게 연결
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "당신은 린 스타트업 전문가입니다. [문제][고객][해결책] 구조로 실행 가능한 비즈니스 아이템을 제안합니다. JSON 형식으로만 응답하세요."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
      max_tokens: 2500,
    });

    const result = completion.choices[0].message.content;
    
    if (!result) {
      throw new Error('OpenAI returned empty response');
    }

    const parsed = JSON.parse(result);
    const businessTypes = parsed.businessTypes || [];

    if (businessTypes.length < 6) {
      console.warn(`Only ${businessTypes.length} types generated, expected 6`);
    }

    return NextResponse.json({ 
      success: true, 
      businessTypes: businessTypes 
    });

  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    
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
