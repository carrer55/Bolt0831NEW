import React from 'react';
import { MoreHorizontal, FileText, Calendar, TrendingUp } from 'lucide-react';
import { useUserData } from '../hooks/useUserData';

interface RecentApplicationsProps {
  onShowDetail: (type: 'business-trip' | 'expense', id: string) => void;
  onNavigate: (view: string) => void;
}

function RecentApplications({ onShowDetail, onNavigate }: RecentApplicationsProps) {
  const { userData, loading } = useUserData();

  // 最近の申請データを生成（経費申請と出張申請を統合）
  const getRecentApplications = () => {
    const allApplications = [
      ...userData.applications.expense.map(app => ({
        id: app.id,
        date: app.created_at,
        type: '経費申請',
        amount: `¥${app.amount.toLocaleString()}`,
        status: getStatusText(app.status),
        statusColor: getStatusColor(app.status),
        originalType: 'expense' as const,
        title: app.title || '経費申請'
      })),
      ...userData.applications.businessTrip.map(app => ({
        id: app.id,
        date: app.created_at,
        type: '出張申請',
        amount: `¥${app.estimated_cost.toLocaleString()}`,
        status: getStatusText(app.status),
        statusColor: getStatusColor(app.status),
        originalType: 'business-trip' as const,
        title: app.title || `${app.destination}への出張`
      }))
    ];

    // 日付順でソートして最新5件を返す
    return allApplications
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  // ステータスを日本語テキストに変換
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待機中';
      case 'approved': return '承認済み';
      case 'rejected': return '却下';
      case 'cancelled': return 'キャンセル';
      default: return status;
    }
  };

  // ステータスに応じた色を返す
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-700 bg-gradient-to-r from-amber-100 to-amber-200 border border-amber-300';
      case 'approved': return 'text-emerald-700 bg-gradient-to-r from-emerald-100 to-emerald-200 border border-emerald-300';
      case 'rejected': return 'text-red-700 bg-gradient-to-r from-red-100 to-red-200 border border-red-300';
      case 'cancelled': return 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300';
      default: return 'text-slate-700 bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300';
    }
  };

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: '2-digit',
      day: '2-digit'
    });
  };

  const applications = getRecentApplications();

  // データが読み込み中の場合はスケルトン表示
  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/30 via-white/20 to-white/30 rounded-2xl p-6 lg:p-8 border border-white/40 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="h-7 bg-slate-300 rounded-lg w-40 animate-pulse"></div>
          <div className="h-6 w-6 bg-slate-300 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm font-bold text-slate-600 pb-4 border-b border-white/30">
            <span>申請日</span>
            <span>種別</span>
            <span>金額</span>
            <span>ステータス</span>
          </div>
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="grid grid-cols-4 gap-4 items-center py-4 hover:bg-white/20 rounded-xl transition-colors">
              <div className="h-5 bg-slate-300 rounded animate-pulse"></div>
              <div className="h-5 bg-slate-300 rounded animate-pulse"></div>
              <div className="h-5 bg-slate-300 rounded animate-pulse"></div>
              <div className="h-7 bg-slate-300 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-white/30 via-white/20 to-white/30 rounded-2xl p-6 lg:p-8 border border-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden group">
      {/* Enhanced glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/40 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/20"></div>
      
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy-400 via-blue-500 to-indigo-600"></div>
      
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-xl">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">最近の申請</h2>
        </div>
        <button 
          onClick={() => onNavigate('application-status')}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/30 rounded-xl transition-all duration-200 hover:scale-110"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-hidden relative z-10">
        <div className="overflow-x-auto">
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-4 text-sm font-bold text-slate-600 pb-4 border-b border-white/30 min-w-max">
              <span className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>申請日</span>
              </span>
              <span>種別</span>
              <span className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>金額</span>
              </span>
              <span>ステータス</span>
            </div>
            {applications.length > 0 ? (
              applications.map((app, index) => (
                <div 
                  key={app.id} 
                  className="grid grid-cols-4 gap-4 items-center py-4 px-3 rounded-xl min-w-max cursor-pointer hover:bg-white/30 transition-all duration-300 group/item border border-transparent hover:border-white/40 hover:shadow-lg"
                  onClick={() => onShowDetail(app.originalType, app.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-slate-700 text-sm font-medium group-hover/item:text-slate-900 transition-colors">
                    {formatDate(app.date)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      app.originalType === 'business-trip' ? 'bg-navy-500' : 'bg-emerald-500'
                    } animate-pulse`}></div>
                    <span className="text-slate-700 text-sm font-medium group-hover/item:text-slate-900 transition-colors">
                      {app.type}
                    </span>
                  </div>
                  <span className="text-slate-900 font-bold text-sm group-hover/item:text-navy-700 transition-colors">
                    {app.amount}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${app.statusColor} group-hover/item:scale-105 transition-transform duration-200`}>
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-lg font-semibold mb-2">申請データがありません</p>
                <p className="text-sm">新しい申請を作成してください</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute top-6 right-6 w-2 h-2 bg-white/60 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-8 left-8 w-1 h-1 bg-white/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500 animation-delay-200"></div>
    </div>
  );
}

export default RecentApplications;