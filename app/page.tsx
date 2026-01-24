"use client";

import { useState, useRef } from "react";
import { Lightbulb, Sparkles, Download, ArrowRight, Check, Mic, Layers, Target, Plus, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ProblemCard {
  id: number;
  problem: string;
  group: string;
}

interface GroupedProblems {
  [key: string]: ProblemCard[];
}

interface BusinessDefinition {
  id: number;
  type: string;
  title: string;
  description: string;
}

export default function Home() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Career Input
  const [years, setYears] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [mainWork, setMainWork] = useState("");
  const [strength, setStrength] = useState("");
  
  // User Info
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  
  // Step 2A: User Input Problems (5-10개)
  const [userProblems, setUserProblems] = useState<string[]>(["", "", "", "", ""]);
  const [isGeneratingCards, setIsGeneratingCards] = useState(false);
  
  // Step 2B: AI Generated Problem Cards (30개)
  const [problemCards, setProblemCards] = useState<ProblemCard[]>([]);
  const [selectedProblems, setSelectedProblems] = useState<number[]>([]);
  
  // Step 3: Grouped Problems
  const [groupedProblems, setGroupedProblems] = useState<GroupedProblems>({});
  const [disabledGroups, setDisabledGroups] = useState<string[]>([]);
  
  // Step 4: Business Definition
  const [businessDefinitions, setBusinessDefinitions] = useState<BusinessDefinition[]>([]);
  const [selectedDefinition, setSelectedDefinition] = useState<BusinessDefinition | null>(null);
  
  const reportRef = useRef<HTMLDivElement>(null);

  // API Call: Generate 30 problem cards based on career + user problems
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
      alert('AI 문제 생성에 실패했습니다.\n\nMock 데이터로 진행합니다.');
      
      // Fallback: Mock 데이터 반환 (개발/테스트용)
      const groups = ["교육형", "상담형", "콘텐츠형", "커뮤니티형", "도구형"];
      
      const problems = [
        { id: 1, problem: "어르신들이 스마트폰 뱅킹을 집에서 편안하게 사용하면 좋겠다", group: "교육형" },
        { id: 2, problem: "대출 서류가 복잡한 청년들이 쉽게 이해하면 좋겠다", group: "상담형" },
        { id: 3, problem: "은퇴 자금을 안전하게 관리할 방법을 알 수 있으면 좋겠다", group: "상담형" },
        { id: 4, problem: "보이스피싱을 구별하는 방법을 쉽게 배울 수 있으면 좋겠다", group: "콘텐츠형" },
        { id: 5, problem: "ATM기를 눈치 보지 않고 천천히 사용할 수 있으면 좋겠다", group: "교육형" },
        { id: 6, problem: "집 담보 대출 서류를 혼자서도 준비할 수 있으면 좋겠다", group: "상담형" },
        { id: 7, problem: "금융 사기 수법을 미리 알고 대비할 수 있으면 좋겠다", group: "콘텐츠형" },
        { id: 8, problem: "키오스크를 천천히 따라하며 배울 수 있으면 좋겠다", group: "교육형" },
        { id: 9, problem: "내게 맞는 저축 상품을 쉽게 찾을 수 있으면 좋겠다", group: "상담형" },
        { id: 10, problem: "신용등급 관리 방법을 간단히 알 수 있으면 좋겠다", group: "콘텐츠형" },
        { id: 11, problem: "모바일 송금을 실수 없이 할 수 있으면 좋겠다", group: "교육형" },
        { id: 12, problem: "노후 자금 계획을 체계적으로 세울 수 있으면 좋겠다", group: "상담형" },
        { id: 13, problem: "부모님 통장을 안전하게 관리하는 방법을 알면 좋겠다", group: "콘텐츠형" },
        { id: 14, problem: "간편 결제 앱을 안전하게 사용할 수 있으면 좋겠다", group: "교육형" },
        { id: 15, problem: "주택청약 서류를 단계별로 준비할 수 있으면 좋겠다", group: "상담형" },
        { id: 16, problem: "금융 상품 설명을 쉬운 말로 들을 수 있으면 좋겠다", group: "콘텐츠형" },
        { id: 17, problem: "공과금 자동이체를 쉽게 설정할 수 있으면 좋겠다", group: "교육형" },
        { id: 18, problem: "대출 상환 방식을 이해하고 선택할 수 있으면 좋겠다", group: "상담형" },
        { id: 19, problem: "금융 앱 비밀번호를 안전하게 관리할 방법이 있으면 좋겠다", group: "교육형" },
        { id: 20, problem: "절세 상품의 차이를 쉽게 비교할 수 있으면 좋겠다", group: "상담형" },
        { id: 21, problem: "같은 고민을 가진 사람들과 정보를 나눌 수 있으면 좋겠다", group: "커뮤니티형" },
        { id: 22, problem: "금리 변동 시 대출 전환 시점을 알 수 있으면 좋겠다", group: "상담형" },
        { id: 23, problem: "금융용어를 쉬운 말로 찾아볼 수 있으면 좋겠다", group: "콘텐츠형" },
        { id: 24, problem: "은행 앱 업데이트 후에도 계속 사용할 수 있으면 좋겠다", group: "교육형" },
        { id: 25, problem: "프리랜서 소득세 신고를 쉽게 할 수 있으면 좋겠다", group: "상담형" },
        { id: 26, problem: "시니어 눈높이의 재테크 정보를 볼 수 있으면 좋겠다", group: "콘텐츠형" },
        { id: 27, problem: "카드 혜택을 한눈에 비교할 수 있으면 좋겠다", group: "도구형" },
        { id: 28, problem: "금융앱 보안 설정을 쉽게 할 수 있으면 좋겠다", group: "교육형" },
        { id: 29, problem: "퇴직금 수령 방식을 현명하게 선택할 수 있으면 좋겠다", group: "상담형" },
        { id: 30, problem: "자녀 교육비 마련 방법을 비교할 수 있으면 좋겠다", group: "상담형" },
      ];
      
      return problems;
    }
  };

  // Mock AI: Group problems
  const groupProblemsByType = (problems: ProblemCard[]): GroupedProblems => {
    const grouped: GroupedProblems = {};
    
    problems.forEach(problem => {
      if (!grouped[problem.group]) {
        grouped[problem.group] = [];
      }
      grouped[problem.group].push(problem);
    });
    
    return grouped;
  };

  // API Call: Generate 6 personalized business types
  const generateBusinessDefinitions = async (): Promise<BusinessDefinition[]> => {
    try {
      const selectedProblemData = problemCards.filter(p => selectedProblems.includes(p.id));
      
      const response = await fetch('/api/generate-business-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          career: getCareerSummary(),
          userProblems: userProblems.filter(p => p.trim() !== ''),
          selectedProblems: selectedProblemData,
          groupedProblems: groupedProblems,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'API 호출 실패');
      }

      return data.businessTypes;

    } catch (error) {
      console.error('사업 유형 생성 오류:', error);
      alert('AI 사업 유형 생성에 실패했습니다.\n\nMock 데이터로 진행합니다.');
      
      // Fallback: Mock 데이터
      return [
        {
          id: 1,
          type: "교육형 (Educator)",
          title: "스마트폰 뱅킹 사용의 두려움",
          description: "디지털 금융이 낯선 60대 이상 시니어",
        },
        {
          id: 2,
          type: "상담형 (Consultant)",
          title: "노후 자금 관리 불안과 투자 막막함",
          description: "은퇴 준비 중인 50-60대",
        },
        {
          id: 3,
          type: "콘텐츠형 (Creator)",
          title: "금융 사기 피해 예방 정보 부족",
          description: "보이스피싱이 걱정되는 시니어",
        },
        {
          id: 4,
          type: "커뮤니티형 (Community Builder)",
          title: "금융 고민 나눌 또래 친구 필요",
          description: "같은 세대 정보 교류 원하는 5060",
        },
        {
          id: 5,
          type: "도구형 (Tool Maker)",
          title: "복잡한 금융 상품 비교의 어려움",
          description: "대출·적금 선택이 막막한 일반인",
        },
        {
          id: 6,
          type: "하이브리드형 (Hybrid)",
          title: "종합적인 금융 생활 지원 필요",
          description: "디지털 금융 전환기의 모든 시니어",
        }
      ];
    }
  };

  const handleStep1Submit = () => {
    // 이름/이메일 검증
    if (!userName.trim()) {
      alert("이름을 입력해주세요");
      return;
    }
    
    if (!userEmail.trim()) {
      alert("이메일을 입력해주세요");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      alert("올바른 이메일 형식을 입력해주세요");
      return;
    }
    
    // 경력 정보 검증
    if (!years || !workplace || !mainWork || !strength) {
      alert("모든 빈칸을 채워주세요");
      return;
    }

    setStep(2);
    setTimeout(() => {
      document.getElementById("step2a")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const addUserProblem = () => {
    if (userProblems.length < 10) {
      setUserProblems([...userProblems, ""]);
    }
  };

  const removeUserProblem = (index: number) => {
    if (userProblems.length > 5) {
      setUserProblems(userProblems.filter((_, i) => i !== index));
    }
  };

  const updateUserProblem = (index: number, value: string) => {
    const updated = [...userProblems];
    updated[index] = value;
    setUserProblems(updated);
  };

  const handleGenerateCards = async () => {
    const filledProblems = userProblems.filter(p => p.trim() !== "");
    
    if (filledProblems.length < 5) {
      alert("최소 5개의 문제를 입력해주세요");
      return;
    }

    setIsGeneratingCards(true);
    
    try {
      const career = getCareerSummary();
      const cards = await generateProblemCards(career, filledProblems);
      setProblemCards(cards);
      setStep(2.5); // Step 2B
      
      setTimeout(() => {
        document.getElementById("step2b")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error('카드 생성 오류:', error);
      alert('문제 카드 생성에 실패했습니다.');
    } finally {
      setIsGeneratingCards(false);
    }
  };

  const toggleProblemSelection = (id: number) => {
    if (selectedProblems.includes(id)) {
      setSelectedProblems(selectedProblems.filter(p => p !== id));
    } else {
      setSelectedProblems([...selectedProblems, id]);
    }
  };

  const handleStep2Submit = () => {
    if (selectedProblems.length === 0) {
      alert("최소 1개 이상의 문제를 선택해주세요");
      return;
    }

    const selected = problemCards.filter(p => selectedProblems.includes(p.id));
    const grouped = groupProblemsByType(selected);
    setGroupedProblems(grouped);
    setStep(3);
    
    setTimeout(() => {
      document.getElementById("step3")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const toggleGroupDisable = (group: string) => {
    if (disabledGroups.includes(group)) {
      setDisabledGroups(disabledGroups.filter(g => g !== group));
    } else {
      setDisabledGroups([...disabledGroups, group]);
    }
  };

  const handleStep3Submit = async () => {
    setIsLoading(true);
    
    try {
      const definitions = await generateBusinessDefinitions();
      setBusinessDefinitions(definitions);
      setStep(4);
      
      setTimeout(() => {
        document.getElementById("step4")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error('사업 정의 생성 오류:', error);
      alert('사업 유형 생성에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDefinition = (definition: BusinessDefinition) => {
    setSelectedDefinition(definition);
    setStep(5);
    
    setTimeout(() => {
      document.getElementById("step5")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // 데이터베이스에 저장
  const submitToDatabase = async () => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          careerData: {
            years,
            workplace,
            mainWork,
            strength
          },
          userProblems: userProblems.filter(p => p.trim() !== ''),
          selectedProblems: problemCards.filter(p => selectedProblems.includes(p.id)),
          businessType: selectedDefinition
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('제출 오류:', error);
      return false;
    }
  };

  const generatePDF = async () => {
    if (!reportRef.current) {
      alert("리포트를 먼저 생성해주세요.");
      return;
    }

    // 1. 먼저 데이터베이스에 저장
    const saved = await submitToDatabase();
    if (saved) {
      console.log('✅ 데이터가 저장되었습니다');
    }

    try {
      // HTML2Canvas로 요소를 캡처
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        logging: false,
      });

      // Canvas를 이미지로 변환 (JPEG, 품질 95%)
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      // jsPDF 생성
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
        hotfixes: ["px_scaling"],
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // 첫 페이지
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // 추가 페이지
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // 다운로드
      const fileName = `Teetto-Report-${new Date().getTime()}.pdf`;
      pdf.save(fileName);
      
      // 이메일 발송
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: userEmail,
            name: userName,
            businessType: selectedDefinition?.type || '',
            businessTitle: selectedDefinition?.title || '',
          }),
        });

        const emailResult = await emailResponse.json();
        
        if (emailResult.success) {
          alert("✅ PDF 다운로드가 완료되었습니다!\n📧 이메일도 발송되었습니다.");
        } else {
          alert("✅ PDF 다운로드가 완료되었습니다!\n⚠️ 이메일 발송은 실패했습니다.");
        }
      } catch (emailError) {
        console.error('Email sending error:', emailError);
        alert("✅ PDF 다운로드가 완료되었습니다!\n⚠️ 이메일 발송 중 오류가 발생했습니다.");
      }
      
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
  };

  const scrollToInput = () => {
    document.getElementById("step1")?.scrollIntoView({ behavior: "smooth" });
  };

  const getCareerSummary = () => {
    return `저는 ${years}년 동안, ${workplace}에서 ${mainWork} 일을 주로 했습니다. 저의 가장 큰 장점(특기)은 ${strength}입니다.`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Landing Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-4 sm:mb-6 p-3 sm:p-4 bg-primary/10 rounded-full">
            <Lightbulb className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-primary" />
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2">
            선생님의 오랜 경력은
            <br />
            <span className="text-primary">잃어버린 것이 아닙니다.</span>
            <br />
            <span className="text-secondary">해결책입니다.</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-10 lg:mb-12 font-medium px-4">
            선생님의 경력으로 새로운 사업 기회를 찾아보세요
          </p>
          
          <button
            onClick={scrollToInput}
            className="bg-primary hover:bg-orange-600 text-white text-lg sm:text-xl lg:text-2xl font-bold py-3 sm:py-4 lg:py-5 px-6 sm:px-8 lg:px-10 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 sm:gap-3 mx-auto w-full sm:w-auto justify-center max-w-sm sm:max-w-md"
          >
            진단 시작하기
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
          </button>
        </div>
      </section>

      {/* Step 1: Career Input */}
      <section id="step1" className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-block mb-3 sm:mb-4 p-2 sm:p-3 bg-secondary/10 rounded-full">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-secondary" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
              나의 지난 시간 기록하기
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 px-4">
              빈칸을 채우듯 편하게 작성해주세요
            </p>
          </div>

          <Card className="mb-6 sm:mb-8">
            <CardContent>
              <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b-2 border-gray-200">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">📋 기본 정보</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                      이름 *
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      placeholder="홍길동"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
                      이메일 *
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">💼 경력 정보</h3>
              <div className="bg-amber-50 p-4 sm:p-6 lg:p-8 rounded-lg border-2 border-amber-200">
                <div className="text-base sm:text-lg lg:text-xl leading-relaxed space-y-3 sm:space-y-4 lg:space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-700">저는</span>
                    <input
                      type="text"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-16 sm:w-20 lg:w-24 px-2 sm:px-3 py-2 text-base sm:text-lg lg:text-xl font-bold text-center border-b-4 border-primary bg-white rounded"
                      placeholder="20"
                    />
                    <span className="text-gray-700">년 동안,</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={workplace}
                      onChange={(e) => setWorkplace(e.target.value)}
                      className="flex-1 min-w-[120px] sm:min-w-[150px] lg:min-w-[200px] px-2 sm:px-3 lg:px-4 py-2 text-base sm:text-lg lg:text-xl font-bold border-b-4 border-primary bg-white rounded"
                      placeholder="은행 창구"
                    />
                    <span className="text-gray-700">에서</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={mainWork}
                      onChange={(e) => setMainWork(e.target.value)}
                      className="flex-1 min-w-[150px] sm:min-w-[200px] lg:min-w-[300px] px-2 sm:px-3 lg:px-4 py-2 text-base sm:text-lg lg:text-xl font-bold border-b-4 border-primary bg-white rounded"
                      placeholder="대출 상담 및 고객 응대"
                    />
                    <span className="text-gray-700">일을 주로 했습니다.</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-gray-700">저의 가장 큰 장점(특기)은</span>
                    <input
                      type="text"
                      value={strength}
                      onChange={(e) => setStrength(e.target.value)}
                      className="flex-1 min-w-[150px] sm:min-w-[200px] lg:min-w-[300px] px-2 sm:px-3 lg:px-4 py-2 text-base sm:text-lg lg:text-xl font-bold border-b-4 border-primary bg-white rounded"
                      placeholder="꼼꼼한 서류 검토"
                    />
                    <span className="text-gray-700">입니다.</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4">
                <button className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-base md:text-lg transition-colors w-full md:w-auto justify-center">
                  <Mic className="w-5 md:w-6 h-5 md:h-6" />
                  음성으로 입력하기
                </button>
                <p className="text-gray-500 text-sm md:text-base text-center">그냥 편하게 말씀하시면 AI가 빈칸을 채워드려요</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <button
              onClick={handleStep1Submit}
              className="bg-secondary hover:bg-green-700 text-white text-xl md:text-2xl font-bold py-4 md:py-6 px-8 md:px-12 rounded-full shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto w-full md:w-auto justify-center max-w-md"
            >
              다음 단계로
              <ArrowRight className="w-6 md:w-8 h-6 md:h-8" />
            </button>
          </div>
        </div>
      </section>

      {/* Step 2A: User Input Problems */}
      {step >= 2 && (
        <section id="step2a" className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 p-3 bg-primary/10 rounded-full">
                <Target className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                해결하고 싶은 문제는 무엇인가요?
              </h2>
              <p className="text-xl text-gray-600 mb-2">
                "이런 것들이 해결되면 좋겠는데..."
              </p>
              <p className="text-lg text-gray-500">
                5~10개의 <span className="font-bold text-secondary">"~하면 좋겠다"</span> 형식으로 적어주세요
              </p>
            </div>

            <Card className="mb-8">
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-lg text-gray-700">
                    💡 <span className="font-bold">긍정적 문장</span>으로 작성해주세요<br/>
                    예시: "어르신들이 스마트폰 뱅킹을 편안하게 사용하면 좋겠다"
                  </p>
                </div>

                <div className="space-y-4">
                  {userProblems.map((problem, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={problem}
                        onChange={(e) => updateUserProblem(index, e.target.value)}
                        className="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="예: 시니어가 보이스피싱 걱정 없이 금융 앱을 쓰면 좋겠다"
                      />
                      {userProblems.length > 5 && (
                        <button
                          onClick={() => removeUserProblem(index)}
                          className="flex-shrink-0 w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {userProblems.length < 10 && (
                  <button
                    onClick={addUserProblem}
                    className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-lg text-lg font-semibold transition-colors"
                  >
                    <Plus className="w-6 h-6" />
                    문장 추가하기 ({userProblems.length}/10)
                  </button>
                )}
              </CardContent>
            </Card>

            <div className="text-center">
              <button
                onClick={handleGenerateCards}
                disabled={isGeneratingCards}
                className="bg-primary hover:bg-orange-600 text-white text-xl md:text-2xl font-bold py-4 md:py-6 px-8 md:px-12 rounded-full shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto w-full md:w-auto justify-center max-w-md"
              >
                {isGeneratingCards ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
                    티토가 30개 문장 만드는 중...
                  </>
                ) : (
                  <>
                    티토와 함께 30개 문장 만들기
                    <ArrowRight className="w-6 md:w-8 h-6 md:h-8" />
                  </>
                )}
              </button>
              <p className="mt-4 text-gray-500 text-lg">
                입력하신 문장을 확장하여 관련된 30개의 문장을 생성합니다
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Step 2B: AI Generated Problem Cards */}
      {step >= 2.5 && problemCards.length > 0 && (
        <section id="step2b" className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 p-3 bg-secondary/10 rounded-full">
                <Sparkles className="w-12 h-12 text-secondary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                티토가 발견한 연관 아이디어들
              </h2>
              <p className="text-xl text-gray-600 mb-2">
                입력하신 문장을 바탕으로 티토도 30개의 문장을 만들었어요
              </p>
              <p className="text-lg text-gray-500">
                공감되는 문장을 클릭해서 선택해주세요 (여러 개 선택 가능)
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {problemCards.map((card) => (
                <Card
                  key={card.id}
                  onClick={() => toggleProblemSelection(card.id)}
                  selected={selectedProblems.includes(card.id)}
                  className="h-full hover:transform hover:-translate-y-1 cursor-pointer"
                >
                  <CardContent>
                    <div className="flex items-start justify-between mb-3">
                      {selectedProblems.includes(card.id) && (
                        <div className="bg-primary text-white p-2 rounded-full ml-auto">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <p className="text-lg text-gray-800 leading-relaxed">
                      {card.problem}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-xl text-gray-700 mb-4">
                선택된 문장: <span className="font-bold text-primary">{selectedProblems.length}개</span>
              </p>
              <button
                onClick={handleStep2Submit}
                className="bg-primary hover:bg-orange-600 text-white text-xl md:text-2xl font-bold py-4 md:py-6 px-8 md:px-12 rounded-full shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto w-full md:w-auto justify-center max-w-md"
              >
                선택 완료
                <ArrowRight className="w-6 md:w-8 h-6 md:h-8" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: Grouped Problems */}
      {step >= 3 && Object.keys(groupedProblems).length > 0 && (
        <section id="step3" className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-orange-50 to-white">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
              <div className="inline-block mb-4 p-3 bg-secondary/10 rounded-full">
                <Layers className="w-12 h-12 text-secondary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                문제를 해결하는 방식
              </h2>
              <p className="text-xl text-gray-600">
                AI가 비슷한 해결 방식끼리 묶어드렸어요. 자신 없는 그룹은 비활성화하세요.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {Object.entries(groupedProblems).map(([group, problems]) => {
                const isDisabled = disabledGroups.includes(group);
                return (
                  <Card key={group} className={isDisabled ? "opacity-40" : ""}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-3xl flex items-center gap-3">
                          <span className="inline-block px-4 py-2 bg-primary text-white rounded-lg">
                            {group}
                          </span>
                          <span className="text-gray-600 text-xl">
                            {problems.length}개 문제
                          </span>
                        </CardTitle>
                        <button
                          onClick={() => toggleGroupDisable(group)}
                          className={`px-6 py-3 rounded-lg text-lg font-semibold transition-colors ${
                            isDisabled
                              ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          }`}
                        >
                          {isDisabled ? "다시 활성화" : "자신 없어요"}
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {problems.map((problem) => (
                          <li key={problem.id} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                            <span className="text-lg text-gray-700">{problem.problem}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={handleStep3Submit}
                disabled={isLoading}
                className="bg-secondary hover:bg-green-700 text-white text-xl md:text-2xl font-bold py-4 md:py-6 px-8 md:px-12 rounded-full shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto w-full md:w-auto justify-center max-w-md"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
                    티토가 맞춤형 아이템 생성 중...
                  </>
                ) : (
                  <>
                    아이템 정의하기
                    <ArrowRight className="w-6 md:w-8 h-6 md:h-8" />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: Business Definition (5가지) */}
      {step >= 4 && businessDefinitions.length > 0 && (
        <section id="step4" className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white">
          <div className="max-w-6xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                선생님만을 위한 맞춤형 비즈니스 아이템
              </h2>
              <p className="text-xl text-gray-600 mb-2">
                티토가 선생님의 경력과 선택한 문장을 분석하여 생성한 6가지 아이템
              </p>
              <p className="text-lg text-gray-500">
                가장 마음에 드는 것을 선택해주세요
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {businessDefinitions.map((def) => (
                <Card
                  key={def.id}
                  onClick={() => handleSelectDefinition(def)}
                  selected={selectedDefinition?.id === def.id}
                  className="h-full hover:transform hover:-translate-y-2 cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-semibold">
                        {def.type}
                      </span>
                      {selectedDefinition?.id === def.id && (
                        <div className="bg-primary text-white p-2 rounded-full">
                          <Check className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                        <p className="text-sm font-bold text-red-700 mb-1">어떤 문제를</p>
                        <p className="text-lg font-semibold text-gray-900">{def.title}</p>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm font-bold text-blue-700 mb-1">누구를 위해</p>
                        <p className="text-lg text-gray-800">{def.description}</p>
                      </div>
                      

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Step 5: Result & PDF */}
      {step >= 5 && selectedDefinition && (
        <section id="step5" className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-green-50 to-white">
          <div className="max-w-4xl mx-auto w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                선생님의 커리어 전환 설계서
              </h2>
              <p className="text-xl text-gray-600">
                PDF로 다운로드하여 보관하세요
              </p>
            </div>

            <Card className="mb-8">
              <CardContent>
                <div className="space-y-8">
                  <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">나의 경력</h3>
                    <p className="text-xl text-gray-700 leading-relaxed">
                      {getCareerSummary()}
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-400 pl-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">내가 발견한 문제들</h3>
                    <ul className="space-y-2">
                      {userProblems
                        .filter(p => p.trim() !== "")
                        .map((problem, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                            <span className="text-lg text-gray-700">{problem}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="border-l-4 border-secondary pl-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">선택한 문제 ({selectedProblems.length}개)</h3>
                    <ul className="space-y-2">
                      {problemCards
                        .filter(p => selectedProblems.includes(p.id))
                        .slice(0, 5)
                        .map(problem => (
                          <li key={problem.id} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                            <span className="text-lg text-gray-700">{problem.problem}</span>
                          </li>
                        ))}
                      {selectedProblems.length > 5 && (
                        <li className="text-gray-500 text-lg pl-8">
                          외 {selectedProblems.length - 5}개
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="border-l-4 border-primary pl-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">나의 사업 정체성</h3>
                    <div className="bg-amber-50 p-6 rounded-lg">
                      <p className="text-sm text-secondary font-semibold mb-2">
                        {selectedDefinition.type}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mb-3">
                        {selectedDefinition.title}
                      </p>
                      <p className="text-lg text-gray-700">
                        {selectedDefinition.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <button
                onClick={generatePDF}
                className="bg-primary hover:bg-orange-600 text-white text-2xl font-bold py-6 px-12 rounded-full shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <Download className="w-8 h-8" />
                PDF 리포트 다운로드
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Hidden PDF Report Template */}
      <div style={{ position: 'fixed', left: '-9999px', top: '0' }}>
        <div ref={reportRef} className="bg-white p-12" style={{ width: '794px', fontFamily: 'Arial, sans-serif' }}>
          <div className="text-center mb-12 pb-8 border-b-4 border-primary">
            <h1 className="text-5xl font-bold mb-2" style={{ color: '#FF8C00' }}>
              Teetto 커리어 전환 리포트
            </h1>
            <p className="text-2xl text-gray-600">선생님의 경험은 선생님의 강점입니다</p>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#006400' }}>
              나의 경력
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-xl leading-relaxed text-gray-800">{getCareerSummary()}</p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-4" style={{ color: '#006400' }}>
              내가 발견한 아이디어들
            </h2>
            <div className="space-y-3">
              {userProblems
                .filter(p => p.trim() !== "")
                .map((problem, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-orange-50 p-4 rounded">
                    <span className="font-bold text-primary" style={{ minWidth: '30px' }}>{idx + 1}.</span>
                    <span className="text-lg text-gray-800">{problem}</span>
                  </div>
                ))}
            </div>
          </div>

          {selectedDefinition && (
            <>
              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#006400' }}>
                  AI가 발견한 연관 아이디어들
                </h2>
                <div className="space-y-3">
                  {problemCards
                    .filter(p => selectedProblems.includes(p.id))
                    .slice(0, 10)
                    .map(problem => (
                      <div key={problem.id} className="flex items-start gap-3 bg-green-50 p-4 rounded">
                        <span className="text-lg text-gray-800">• {problem.problem}</span>
                      </div>
                    ))}
                  {selectedProblems.length > 10 && (
                    <p className="text-sm text-gray-500 italic mt-2">
                      외 {selectedProblems.length - 10}개 항목...
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#006400' }}>
                  나의 사업 정체성
                </h2>
                <div className="bg-orange-50 p-6 rounded-lg border-l-8" style={{ borderColor: '#FF8C00' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#006400' }}>
                    {selectedDefinition.type}
                  </p>
                  <p className="text-2xl font-bold mb-3 text-gray-900">
                    {selectedDefinition.title}
                  </p>
                  <p className="text-lg leading-relaxed text-gray-800">
                    {selectedDefinition.description}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="mb-10 p-8 rounded-lg" style={{ backgroundColor: '#FFF4E6' }}>
            <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: '#FF8C00' }}>
              선생님은 할 수 있습니다
            </h3>
            <p className="text-lg leading-relaxed text-gray-800 text-center">
              수십 년의 경험은 선생님께 문제 해결 능력, 업계 지식, 그리고 교실에서 배울 수 없는 지혜를 주었습니다.
              이것은 단순한 사업 아이디어가 아닙니다. 새로운 형태로 이어지는 선생님의 유산입니다.
            </p>
          </div>

          {selectedDefinition && (
            <>
              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#006400' }}>
                  선생님만을 위한 맞춤형 비즈니스 아이템
                </h2>
                <div className="bg-blue-50 p-6 rounded-lg border-l-8 border-blue-500 mb-4">
                  <p className="text-sm font-bold mb-2 text-blue-700">
                    어떤 문제를
                  </p>
                  <p className="text-xl font-semibold text-gray-900 mb-3">
                    {selectedDefinition.title}
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg border-l-8 border-purple-500 mb-4">
                  <p className="text-sm font-bold mb-2 text-purple-700">
                    누구를 위해
                  </p>
                  <p className="text-xl text-gray-900">
                    {selectedDefinition.description}
                  </p>
                </div>
                {selectedDefinition.why && (
                  <div className="bg-green-50 p-6 rounded-lg border-l-8 border-green-500">
                    <p className="text-sm font-bold mb-2 text-green-700">
                      어떻게 해결
                    </p>
                    <p className="text-xl text-gray-900">
                      {selectedDefinition.why}
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-10">
                <h2 className="text-3xl font-bold mb-4" style={{ color: '#006400' }}>
                  나의 사업 정체성
                </h2>
                <div className="bg-orange-50 p-6 rounded-lg border-l-8" style={{ borderColor: '#FF8C00' }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: '#006400' }}>
                    {selectedDefinition.type}
                  </p>
                  <p className="text-2xl font-bold mb-3 text-gray-900">
                    {selectedDefinition.title}
                  </p>
                  <p className="text-lg leading-relaxed text-gray-800">
                    {selectedDefinition.description}
                  </p>
                </div>
              </div>

              <div className="mb-10 bg-gradient-to-r from-orange-100 to-green-100 p-8 rounded-lg text-center">
                <h2 className="text-4xl font-bold mb-4" style={{ color: '#FF8C00' }}>
                  선생님은 할 수 있습니다!
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  오랜 경력은 누구도 따라올 수 없는 선생님만의 자산입니다.<br/>
                  이제 그 경험을 새로운 기회로 만들어보세요.<br/>
                  티토가 함께 하겠습니다.
                </p>
              </div>
            </>
          )}

          <div className="text-center pt-8 pb-6 border-t-4" style={{ borderColor: '#FF8C00' }}>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#FF8C00' }}>
                티토 컨설팅
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                시니어 커리어 전환 전문가와 함께하세요
              </p>
              <p className="text-xl font-bold" style={{ color: '#006400' }}>
                문의: <span className="underline">https://teetto.kr</span>
              </p>
            </div>
            
            <div className="pt-6 border-t-2 border-gray-300">
              <p className="text-lg text-gray-600 mb-2">
                <span className="font-bold">리포트 생성자:</span> {userName} ({userEmail})
              </p>
              <p className="text-base text-gray-500">
                생성일: {new Date().toLocaleDateString('ko-KR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
