import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // 전체 통계
    const totalResult = await sql`
      SELECT 
        COUNT(*) as total_submissions,
        COUNT(DISTINCT email) as unique_users
      FROM submissions
    `;

    // 사업 유형별 통계
    const typeStats = await sql`
      SELECT 
        selected_business_type,
        COUNT(*) as count
      FROM submissions
      WHERE selected_business_type IS NOT NULL
      GROUP BY selected_business_type
      ORDER BY count DESC
    `;

    // 일별 제출 통계 (최근 7일)
    const dailyStats = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM submissions
      WHERE created_at >= NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    // 이메일 도메인 통계
    const domainStats = await sql`
      SELECT 
        SUBSTRING(email FROM '@(.*)$') as domain,
        COUNT(*) as count
      FROM submissions
      GROUP BY domain
      ORDER BY count DESC
      LIMIT 10
    `;

    // 최근 제출 목록
    const recentSubmissions = await sql`
      SELECT 
        id,
        name,
        email,
        selected_business_type,
        business_type_title,
        created_at
      FROM submissions
      ORDER BY created_at DESC
      LIMIT 20
    `;

    // 시간대별 통계
    const hourlyStats = await sql`
      SELECT 
        EXTRACT(HOUR FROM created_at) as hour,
        COUNT(*) as count
      FROM submissions
      GROUP BY hour
      ORDER BY hour
    `;

    return NextResponse.json({
      success: true,
      data: {
        total: totalResult.rows[0],
        businessTypes: typeStats.rows,
        daily: dailyStats.rows,
        domains: domainStats.rows,
        recent: recentSubmissions.rows,
        hourly: hourlyStats.rows
      }
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
