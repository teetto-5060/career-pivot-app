# 📧 이메일 자동 발송 설정 가이드

## ✅ 추가된 기능

### 1. PDF 다운로드 시 자동 이메일 발송
```
사용자가 PDF 다운로드
→ 자동으로 이메일 발송
→ 확인 메시지 알림
```

### 2. 대시보드에서 수동 이메일 발송
```
대시보드 → 최근 제출 목록
→ "📧 이메일" 버튼 클릭
→ 선택한 사용자에게 발송
```

---

## 🚀 설정 방법

### Step 1: Resend 계정 생성

1. **Resend 웹사이트 접속**
   ```
   https://resend.com
   ```

2. **회원가입**
   - Sign Up 클릭
   - 이메일 입력 (Gmail 가능)
   - 이메일 인증

3. **API Key 생성**
   ```
   Dashboard → API Keys → Create API Key
   이름: "Teetto Production"
   Permission: Full Access
   → Create
   ```

4. **API Key 복사**
   - `re_...`로 시작하는 키 복사
   - 안전한 곳에 보관

---

### Step 2: 패키지 설치

```bash
npm install resend
```

---

### Step 3: 환경 변수 설정

```bash
notepad .env.local
```

**기존 내용 아래에 추가:**

```env
# Resend Email API
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

**주의:**
- `re_your_actual_api_key_here`를 실제 API 키로 교체!
- `RESEND_FROM_EMAIL`은 무료 플랜에서는 `onboarding@resend.dev` 사용
- 유료 플랜 시 커스텀 도메인 설정 가능 (예: `noreply@teetto.kr`)

**Ctrl + S 저장**

---

### Step 4: 서버 재시작

```bash
# 현재 서버 중지 (Ctrl + C)
npm run dev
```

---

## 📧 이메일 내용

### 제목
```
[Teetto] 커리어 전환 리포트가 준비되었습니다! 🎉
```

### 본문 구성
```
1. 환영 메시지
   "안녕하세요, {이름}님!"

2. 선택한 비즈니스 아이템
   - 사업 유형
   - 아이템 제목

3. 리포트 내용 안내
   - 나의 경력 분석
   - 발견한 아이디어들
   - AI 추천 아이디어
   - 맞춤형 비즈니스 아이템
   - 사업 정체성

4. CTA (Call To Action)
   "더 자세한 상담 받기" 버튼

5. 문의 정보
   - 웹사이트
   - 이메일
   - 카카오톡

6. 푸터
   - 저작권 정보
```

---

## 🧪 테스트 방법

### 테스트 1: PDF 다운로드 시 자동 발송

1. **메인 페이지 접속**
   ```
   http://localhost:3000
   ```

2. **전체 플로우 진행**
   - 이름/이메일 입력 (실제 이메일!)
   - 경력 입력
   - 문제 입력
   - AI 생성
   - 비즈니스 아이템 선택

3. **PDF 다운로드**
   - "PDF 리포트 다운로드" 클릭
   - 알림 확인: "PDF 다운로드 완료 + 이메일 발송"

4. **이메일 확인**
   - 입력한 이메일 계정 확인
   - Teetto 이메일 도착 확인
   - 스팸함도 확인!

---

### 테스트 2: 대시보드에서 수동 발송

1. **대시보드 접속**
   ```
   http://localhost:3000/dashboard
   ```

2. **최근 제출 목록에서 "📧 이메일" 버튼 클릭**

3. **확인 팝업**
   - "{이름}님께 이메일을 발송하시겠습니까?"
   - 확인 클릭

4. **발송 완료 알림**
   - "✅ {이름}님께 이메일이 발송되었습니다!"

5. **이메일 확인**

---

## 🎨 이메일 디자인

### 반응형 HTML 템플릿
```
- 모바일/데스크톱 대응
- 깔끔한 레이아웃
- Teetto 브랜드 컬러 (오렌지)
- 전문적인 디자인
```

### 포함 요소
```
✅ 헤더 (그라데이션 배경)
✅ 환영 메시지
✅ 비즈니스 카드
✅ 하이라이트 박스
✅ CTA 버튼
✅ 문의 정보
✅ 푸터
```

---

## 📊 발송 내역 확인

### Resend 대시보드
```
https://resend.com/emails

확인 가능한 정보:
- 발송 시간
- 수신자
- 발송 상태 (Delivered, Bounced 등)
- 오픈율 (유료 플랜)
- 클릭률 (유료 플랜)
```

---

## 💰 비용

### 무료 플랜
```
✅ 월 3,000통
✅ 일 100통
✅ 기본 API 기능
✅ 이메일 로그
```

### 유료 플랜 (필요 시)
```
Pro: $20/월
- 월 50,000통
- 커스텀 도메인
- 분석 기능
- 우선 지원
```

### 예상 사용량 (월 1,000명)
```
사용자당 1통 = 1,000통/월
→ 무료 플랜으로 충분!
```

---

## ⚠️ 주의사항

### 1. API Key 보안
```
❌ GitHub에 커밋 금지!
❌ 공개적으로 공유 금지!
✅ .env.local에만 저장
✅ .gitignore에 .env.local 추가
```

### 2. 스팸 방지
```
- 사용자가 직접 요청한 경우에만 발송
- 과도한 발송 금지
- 수신 거부 링크 제공 (추후 추가 가능)
```

### 3. 이메일 도메인 설정
```
무료: onboarding@resend.dev
유료: noreply@teetto.kr (도메인 인증 필요)
```

---

## 🔧 커스터마이징

### 이메일 템플릿 수정

`app/api/send-email/route.ts` 파일에서:

```typescript
// HTML 템플릿 부분 수정
html: `
  ... 
  <h2>안녕하세요, ${name}님!</h2>
  ...
`
```

### 발송 조건 변경

`app/page.tsx`의 `generatePDF` 함수:

```typescript
// 이메일 발송 로직
const emailResponse = await fetch('/api/send-email', {
  method: 'POST',
  ...
});
```

---

## 🎯 다음 단계 (선택사항)

### 1. PDF 첨부
```typescript
// PDF를 Base64로 인코딩하여 첨부
attachments: [{
  filename: 'report.pdf',
  content: pdfBase64,
}]
```

### 2. 이메일 템플릿 여러 개
```
- 환영 이메일
- 리포트 발송 이메일
- 후속 상담 안내 이메일
- 뉴스레터
```

### 3. 자동화 시퀀스
```
Day 0: 리포트 발송
Day 3: 후속 상담 안내
Day 7: 성공 사례 공유
Day 14: 커뮤니티 초대
```

---

## 🐛 문제 해결

### 에러: "Resend API key is missing"
```
해결: .env.local에 RESEND_API_KEY 추가
서버 재시작 필요
```

### 이메일이 안 와요
```
1. 스팸함 확인
2. Resend 대시보드에서 발송 상태 확인
3. API Key 유효성 확인
4. 서버 로그 확인
```

### 발송은 되는데 에러 메시지
```
정상: 이메일은 발송되었지만
프론트엔드 에러 처리 개선 필요
→ 무시 가능
```

---

## ✅ 완료 체크리스트

```
□ Resend 계정 생성
□ API Key 발급
□ .env.local에 키 추가
□ npm install resend 완료
□ 서버 재시작
□ 테스트 이메일 발송
□ 실제 이메일 수신 확인
□ 대시보드에서 수동 발송 테스트
```

---

## 🎉 완성!

이메일 자동 발송 시스템이 준비되었습니다!

**테스트 후 결과 알려주세요!** 📧✨
