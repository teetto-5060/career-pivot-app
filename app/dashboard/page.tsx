"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Users, TrendingUp, Mail, Clock, Award } from 'lucide-react';

interface DashboardData {
  total: {
    total_submissions: string;
    unique_users: string;
  };
  businessTypes: Array<{
    selected_business_type: string;
    count: string;
  }>;
  daily: Array<{
    date: string;
    count: string;
  }>;
  domains: Array<{
    domain: string;
    count: string;
  }>;
  recent: Array<{
    id: number;
    name: string;
    email: string;
    selected_business_type: string;
    business_type_title: string;
    created_at: string;
  }>;
  hourly: Array<{
    hour: string;
    count: string;
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError('데이터를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('서버 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const sendEmailToUser = async (submission: any) => {
    const confirmed = confirm(`${submission.name}님께 이메일을 발송하시겠습니까?`);
    
    if (!confirmed) return;

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: submission.email,
          name: submission.name,
          businessType: submission.selected_business_type,
          businessTitle: submission.business_type_title,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`✅ ${submission.name}님께 이메일이 발송되었습니다!`);
      } else {
        alert(`❌ 이메일 발송에 실패했습니다: ${result.error}`);
      }
    } catch (error) {
      console.error('Email sending error:', error);
      alert('❌ 이메일 발송 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || '데이터를 불러올 수 없습니다.'}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  const totalSubmissions = parseInt(data.total.total_submissions);
  const uniqueUsers = parseInt(data.total.unique_users);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">📊 Teetto 대시보드</h1>
          <p className="text-orange-100">시니어 창업 지원 플랫폼 분석</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 주요 지표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">총 제출 건수</p>
                  <p className="text-3xl font-bold text-gray-900">{totalSubmissions}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <BarChart3 className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">고유 사용자</p>
                  <p className="text-3xl font-bold text-gray-900">{uniqueUsers}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">평균 재방문율</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalSubmissions > 0 ? ((totalSubmissions / uniqueUsers - 1) * 100).toFixed(0) : 0}%
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1">오늘 제출</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {data.daily.length > 0 ? data.daily[0].count : 0}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Award className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 사업 유형별 통계 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                사업 유형별 통계
              </h2>
              <div className="space-y-4">
                {data.businessTypes.map((type, idx) => {
                  const percentage = (parseInt(type.count) / totalSubmissions * 100).toFixed(1);
                  return (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-700 font-medium">{type.selected_business_type}</span>
                        <span className="text-gray-600">{type.count}건 ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 일별 제출 추이 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                최근 7일 제출 추이
              </h2>
              <div className="space-y-3">
                {data.daily.map((day, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-24 text-gray-600 text-sm">
                      {new Date(day.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-8 rounded-full flex items-center justify-end pr-3 text-white text-sm font-bold transition-all"
                        style={{ width: `${Math.max(parseInt(day.count) / Math.max(...data.daily.map(d => parseInt(d.count))) * 100, 15)}%` }}
                      >
                        {day.count}건
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 이메일 도메인 통계 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-primary" />
                이메일 도메인 TOP 10
              </h2>
              <div className="space-y-2">
                {data.domains.map((domain, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 font-bold">#{idx + 1}</span>
                      <span className="text-gray-700">@{domain.domain}</span>
                    </div>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                      {domain.count}명
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 시간대별 통계 */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-primary" />
                시간대별 제출 현황
              </h2>
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: 24 }, (_, i) => {
                  const hourData = data.hourly.find(h => parseInt(h.hour) === i);
                  const count = hourData ? parseInt(hourData.count) : 0;
                  const maxCount = Math.max(...data.hourly.map(h => parseInt(h.count)));
                  const height = count > 0 ? Math.max((count / maxCount) * 100, 20) : 10;
                  
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-gradient-to-t from-orange-500 to-orange-300 rounded-t transition-all hover:opacity-80"
                        style={{ height: `${height}px` }}
                        title={`${i}시: ${count}건`}
                      ></div>
                      <span className="text-xs text-gray-500">{i}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-gray-500 text-sm mt-3">시간 (0-23시)</p>
            </CardContent>
          </Card>
        </div>

        {/* 최근 제출 목록 */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">최근 제출 목록 (20건)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">이름</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">이메일</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">사업 유형</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">아이템</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">제출 시간</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">액션</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recent.map((submission) => (
                    <tr key={submission.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">#{submission.id}</td>
                      <td className="py-3 px-4 font-medium">{submission.name}</td>
                      <td className="py-3 px-4 text-gray-600">{submission.email}</td>
                      <td className="py-3 px-4">
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">
                          {submission.selected_business_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 max-w-xs truncate">
                        {submission.business_type_title}
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {new Date(submission.created_at).toLocaleString('ko-KR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => sendEmailToUser(submission)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                        >
                          📧 이메일
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 새로고침 버튼 */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchDashboardData}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            🔄 데이터 새로고침
          </button>
        </div>
      </div>
    </div>
  );
}
