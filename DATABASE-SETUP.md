# Vercel Postgres 데이터베이스 스키마

## 설정 방법

### 1. Vercel 대시보드
1. https://vercel.com/dashboard 접속
2. 프로젝트 선택
3. **Storage** 탭 클릭
4. **Create Database** → **Postgres** 선택
5. Database name: `teetto-db` (또는 원하는 이름)
6. Region: **Seoul** 선택 (가장 가까운 지역)
7. **Create** 클릭

### 2. 프로젝트 연결
1. **Connect to Project** 선택
2. 환경 변수 자동 추가됨:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

### 3. 테이블 생성

Vercel 대시보드 → Storage → 프로젝트 → **Query** 탭에서 실행:

```sql
-- 사용자 제출 데이터 테이블
CREATE TABLE IF NOT EXISTS submissions (
  id SERIAL PRIMARY KEY,
  
  -- 개인 정보
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  
  -- 경력 정보
  years VARCHAR(10),
  workplace VARCHAR(255),
  main_work TEXT,
  strength TEXT,
  
  -- 발견한 문제들 (JSON)
  user_problems JSONB,
  
  -- 선택한 AI 문제들 (JSON)
  selected_problems JSONB,
  
  -- 선택한 사업 아이템
  selected_business_type VARCHAR(50),
  business_type_title TEXT,
  business_type_description TEXT,
  business_type_solution TEXT,
  
  -- 메타 정보
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- 인덱스
  CONSTRAINT unique_email UNIQUE (email, created_at)
);

-- 이메일 검색 최적화
CREATE INDEX idx_email ON submissions(email);

-- 생성일 검색 최적화
CREATE INDEX idx_created_at ON submissions(created_at DESC);

-- 사업 타입별 통계용
CREATE INDEX idx_business_type ON submissions(selected_business_type);
```

### 4. 로컬 개발 환경 설정

`.env.local` 파일에 추가 (Vercel 대시보드에서 복사):

```env
# OpenAI
OPENAI_API_KEY=sk-proj-your-key

# Vercel Postgres (Vercel 대시보드에서 자동 생성됨)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

---

## 📊 테이블 구조

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | SERIAL | 자동 증가 ID |
| name | VARCHAR(100) | 사용자 이름 |
| email | VARCHAR(255) | 이메일 주소 |
| years | VARCHAR(10) | 경력 년수 |
| workplace | VARCHAR(255) | 직장/업무 장소 |
| main_work | TEXT | 주요 업무 |
| strength | TEXT | 강점/특기 |
| user_problems | JSONB | 사용자가 입력한 문제들 |
| selected_problems | JSONB | 선택한 AI 문제들 |
| selected_business_type | VARCHAR(50) | 사업 유형 |
| business_type_title | TEXT | 사업 아이템 제목 |
| business_type_description | TEXT | 사업 아이템 설명 |
| business_type_solution | TEXT | 해결 방법 |
| created_at | TIMESTAMP | 생성 시간 |

---

## 🔍 유용한 쿼리

### 전체 데이터 조회
```sql
SELECT * FROM submissions ORDER BY created_at DESC LIMIT 10;
```

### 이메일로 검색
```sql
SELECT * FROM submissions WHERE email = 'user@example.com';
```

### 사업 타입별 통계
```sql
SELECT 
  selected_business_type, 
  COUNT(*) as count 
FROM submissions 
GROUP BY selected_business_type 
ORDER BY count DESC;
```

### 오늘 제출된 데이터
```sql
SELECT * FROM submissions 
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

### 이메일 도메인별 통계
```sql
SELECT 
  SUBSTRING(email FROM '@(.*)$') as domain,
  COUNT(*) as count
FROM submissions
GROUP BY domain
ORDER BY count DESC;
```

---

## 🚀 배포 후 확인

### Vercel 환경 변수 확인:
1. Vercel 대시보드 → 프로젝트
2. **Settings** → **Environment Variables**
3. Postgres 관련 변수들이 자동 추가되었는지 확인

### 테스트:
```bash
# 로컬에서
npm run dev

# 제출 테스트 후 Vercel 대시보드에서 확인
Storage → Your Database → Query
SELECT * FROM submissions;
```

---

## 💰 무료 플랜 한도

**Vercel Postgres Hobby (무료):**
- Storage: 512 MB
- Compute: 60시간/월
- Row Limit: 제한 없음
- 예상 수용: **월 5,000~10,000건** 충분

**초과 시:**
- Pro Plan: $20/월
- 무제한 사용

---

## 📧 데이터 내보내기 (Excel)

```sql
-- CSV로 내보내기 (Vercel 대시보드 Query에서)
SELECT 
  name,
  email,
  years,
  workplace,
  TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') as submitted_at
FROM submissions
ORDER BY created_at DESC;

-- 결과를 복사해서 Excel에 붙여넣기
```

---

완료! 🎉

이제 API Route를 만들어서 연동하겠습니다.
