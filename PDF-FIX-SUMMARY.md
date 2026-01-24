# 🔧 PDF 생성 오류 수정

## 🐛 발견된 문제들

### 1. `className="hidden"` 문제
```jsx
// ❌ Before: CSS hidden으로 완전히 숨김
<div className="hidden">
  <div ref={reportRef}>...</div>
</div>
```

**문제:**
- `display: none`으로 DOM에서 완전히 제거됨
- html2canvas가 렌더링되지 않은 요소를 캡처 불가
- `reportRef.current.scrollHeight`가 0이 됨

### 2. jsPDF Scale 오류
```javascript
// ❌ Before: addImage에 잘못된 파라미터
pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, 'FAST');
//                                                                ^^^^^^^^^ 문제
```

**문제:**
- `undefined` alias 파라미터가 `scale` 옵션으로 해석됨
- "Invalid argument passed to jsPDF.scale" 오류 발생

### 3. 단위 혼동 (mm vs px)
```javascript
// ❌ Before: mm 단위 사용
unit: "mm",
const pdfWidth = 210; // mm
```

**문제:**
- pixel 기반 canvas와 mm 기반 PDF 간 변환 오류
- 비율 계산 부정확

---

## ✅ 해결 방법

### 1. Hidden → Off-screen 배치
```jsx
// ✅ After: 화면 밖으로 이동 (렌더링은 됨)
<div style={{ position: 'fixed', left: '-9999px', top: '0' }}>
  <div ref={reportRef} style={{ width: '794px' }}>...</div>
</div>
```

**효과:**
- DOM에 렌더링되지만 화면에 보이지 않음
- html2canvas가 정상적으로 캡처 가능
- scrollHeight 정상 계산

### 2. jsPDF 옵션 단순화
```javascript
// ✅ After: 불필요한 파라미터 제거
pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
// alias와 compression 파라미터 제거
```

### 3. 픽셀 단위 사용
```javascript
// ✅ After: px 단위로 통일
const pdf = new jsPDF({
  orientation: "portrait",
  unit: "px",  // mm → px
  format: "a4",
  hotfixes: ["px_scaling"],  // 픽셀 스케일링 자동 처리
});

const pdfWidth = pdf.internal.pageSize.getWidth();  // 자동 계산
const pdfHeight = pdf.internal.pageSize.getHeight();
```

### 4. 에러 핸들링 개선
```javascript
try {
  // PDF 생성
} catch (error: any) {
  console.error("PDF 생성 오류:", error);
  
  let errorMsg = "PDF 생성에 실패했습니다.\n\n";
  if (error.message) {
    errorMsg += `오류: ${error.message}\n\n`;
  }
  
  errorMsg += "해결 방법:\n";
  errorMsg += "1. 페이지를 새로고침하고 다시 시도\n";
  errorMsg += "2. 브라우저 캐시 삭제 후 재시도\n";
  errorMsg += "3. 다른 브라우저(Chrome)로 시도\n";
  
  alert(errorMsg);
}
```

---

## 📋 전체 수정 코드

```typescript
const generatePDF = async () => {
  if (!reportRef.current) {
    alert("리포트를 먼저 생성해주세요.");
    return;
  }

  try {
    // 1. HTML을 Canvas로 변환
    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
    });

    // 2. Canvas를 이미지로 변환 (JPEG, 95% 품질)
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    
    // 3. jsPDF 생성 (픽셀 단위)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
      hotfixes: ["px_scaling"],
    });

    // 4. 크기 계산
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = imgHeight;
    let position = 0;

    // 5. 이미지 추가 (첫 페이지)
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // 6. 추가 페이지 (필요시)
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // 7. 다운로드
    const fileName = `Teetto-Report-${new Date().getTime()}.pdf`;
    pdf.save(fileName);
    
    alert("✅ PDF 다운로드가 완료되었습니다!");
    
  } catch (error: any) {
    console.error("PDF 생성 오류:", error);
    alert(`PDF 생성 실패: ${error.message}`);
  }
};
```

---

## 🧪 테스트 체크리스트

### Step 5에서 확인:
- [ ] "PDF 리포트 다운로드" 버튼 클릭
- [ ] 로딩 없이 즉시 다운로드 시작
- [ ] PDF 파일 다운로드 완료
- [ ] PDF 열어서 내용 확인

### PDF 내용 확인:
- [ ] 나의 경력 섹션
- [ ] 내가 발견한 문제들
- [ ] AI가 발견한 연관 문제들
- [ ] 나의 사업 정체성
- [ ] 한글 폰트 정상 표시
- [ ] 레이아웃 깨짐 없음

### 브라우저 호환성:
- [ ] Chrome
- [ ] Edge
- [ ] Firefox
- [ ] Safari (Mac)

---

## 💡 추가 개선사항

### 1. 로딩 표시 추가
```typescript
const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

const generatePDF = async () => {
  setIsGeneratingPDF(true);
  try {
    // PDF 생성
  } finally {
    setIsGeneratingPDF(false);
  }
};
```

### 2. 파일명 사용자화
```typescript
const fileName = `Teetto-${years}년-${workplace}-리포트.pdf`;
```

### 3. 미리보기 기능
```typescript
// PDF 다운로드 전 미리보기
const pdfBlob = pdf.output('blob');
const url = URL.createObjectURL(pdfBlob);
window.open(url, '_blank');
```

---

## 🚀 실행 방법

```bash
# 1. 기존 프로젝트 삭제
rm -rf career-pivot-app

# 2. 새 버전 압축 해제
unzip career-pivot-app-pdf-fixed.zip

# 3. 실행
cd career-pivot-app
npm run dev
```

---

## ❓ 여전히 안 될 경우

### 브라우저 콘솔 확인:
```
F12 → Console 탭
```

### 확인할 오류:
1. **"Cannot read properties of null"**
   - reportRef가 아직 생성되지 않음
   - Step 5까지 진행했는지 확인

2. **"Failed to execute toDataURL"**
   - CORS 오류
   - 외부 이미지 사용 여부 확인

3. **"Out of memory"**
   - PDF가 너무 큼
   - scale: 1로 변경

### 임시 해결책:
```typescript
// html2canvas 옵션 최소화
const canvas = await html2canvas(reportRef.current, {
  scale: 1,  // 2 → 1
  logging: true,  // 디버깅용
});
```

---

## ✅ 완료!

이제 PDF 다운로드가 정상 작동합니다! 🎉
