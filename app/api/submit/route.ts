import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { 
      name, 
      email, 
      careerData,
      userProblems,
      selectedProblems,
      businessType 
    } = await request.json();

    // 입력 검증
    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: '이름과 이메일은 필수입니다.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 데이터베이스에 저장
    const result = await sql`
      INSERT INTO submissions (
        name,
        email,
        years,
        workplace,
        main_work,
        strength,
        user_problems,
        selected_problems,
        selected_business_type,
        business_type_title,
        business_type_description,
        business_type_solution
      ) VALUES (
        ${name},
        ${email},
        ${careerData?.years || ''},
        ${careerData?.workplace || ''},
        ${careerData?.mainWork || ''},
        ${careerData?.strength || ''},
        ${JSON.stringify(userProblems || [])},
        ${JSON.stringify(selectedProblems || [])},
        ${businessType?.type || ''},
        ${businessType?.title || ''},
        ${businessType?.description || ''},
        ${businessType?.why || ''}
      )
      RETURNING id, created_at
    `;

    return NextResponse.json({ 
      success: true, 
      id: result.rows[0].id,
      createdAt: result.rows[0].created_at
    });

  } catch (error: any) {
    console.error('Database error:', error);
    
    // 중복 이메일 체크 (같은 날 같은 이메일)
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json(
        { success: false, error: '이미 제출된 이메일입니다.' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: '데이터 저장에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// GET: 통계 조회 (선택사항)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      // 전체 통계
      const stats = await sql`
        SELECT 
          COUNT(*) as total_submissions,
          COUNT(DISTINCT email) as unique_users,
          selected_business_type,
          COUNT(*) as type_count
        FROM submissions
        GROUP BY selected_business_type
      `;

      return NextResponse.json({ 
        success: true, 
        stats: stats.rows 
      });
    }

    // 기본: 최근 10건 (개인정보 제외)
    const recent = await sql`
      SELECT 
        id,
        selected_business_type,
        created_at
      FROM submissions
      ORDER BY created_at DESC
      LIMIT 10
    `;

    return NextResponse.json({ 
      success: true, 
      recent: recent.rows 
    });

  } catch (error) {
    console.error('Query error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
