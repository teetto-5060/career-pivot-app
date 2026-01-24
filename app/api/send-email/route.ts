import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      to, 
      name, 
      businessType, 
      businessTitle,
    } = body;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: [to],
      subject: '[Teetto] 커리어 전환 리포트가 준비되었습니다! 🎉',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .highlight {
      background: #fff4e6;
      border-left: 4px solid #FF8C00;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .business-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .cta-button {
      display: inline-block;
      background: #FF8C00;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>💡 Teetto 커리어 전환 리포트</h1>
    <p>선생님만을 위한 맞춤형 비즈니스 아이템</p>
  </div>
  
  <div class="content">
    <h2>안녕하세요, ${name}님! 👋</h2>
    
    <p>
      오랜 소중한 경력을 분석한 결과,<br>
      새로운 기회를 발견하셨습니다!
    </p>
    
    <div class="business-card">
      <h3 style="color: #FF8C00; margin-top: 0;">🎯 선택하신 비즈니스 아이템</h3>
      <p style="font-size: 14px; color: #666; margin: 5px 0;">사업 유형</p>
      <p style="font-size: 18px; font-weight: bold; margin: 5px 0 15px 0;">${businessType}</p>
      
      <p style="font-size: 14px; color: #666; margin: 5px 0;">아이템</p>
      <p style="font-size: 16px; margin: 5px 0;">${businessTitle}</p>
    </div>
    
    <div class="highlight">
      <p style="margin: 0;">
        <strong>📎 다운로드하신 리포트에는 다음 내용이 포함되어 있습니다:</strong>
      </p>
      <ul style="margin: 10px 0;">
        <li>나의 경력 분석</li>
        <li>발견한 아이디어들</li>
        <li>AI가 추천한 연관 아이디어</li>
        <li>선생님만을 위한 맞춤형 비즈니스 아이템</li>
        <li>사업 정체성 정의</li>
      </ul>
    </div>
    
    <p style="text-align: center;">
      <a href="https://teetto.kr" class="cta-button">
        더 자세한 상담 받기 →
      </a>
    </p>
    
    <div style="background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #FF8C00; margin-top: 0;">📞 문의하기</h3>
      <p style="margin: 5px 0;">🌐 웹사이트: <a href="https://teetto.kr">https://teetto.kr</a></p>
      <p style="margin: 5px 0;">📧 이메일: contact@teetto.kr</p>
      <p style="margin: 5px 0;">💬 카카오톡: @teetto</p>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      이 리포트는 선생님의 경험과 역량을 바탕으로 AI가 분석한 결과입니다.<br>
      실제 창업을 고려하신다면, 전문가와의 상담을 추천드립니다.
    </p>
  </div>
  
  <div class="footer">
    <p>
      이 이메일은 Teetto 서비스 이용 시 자동으로 발송됩니다.<br>
      © 2026 Teetto. All rights reserved.
    </p>
  </div>
</body>
</html>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: data?.id,
    });

  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
