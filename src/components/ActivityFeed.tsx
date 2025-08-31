import React from 'react';
import { Bell, CheckCircle, AlertCircle, Info, XCircle, Sparkles, Zap } from 'lucide-react';
import { useUserData } from '../hooks/useUserData';

function ActivityFeed() {
  const { userData, loading } = useUserData();

  // 通知タイプに応じたアイコンを取得
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600 drop-shadow-lg" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-600 drop-shadow-lg" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600 drop-shadow-lg" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 drop-shadow-lg" />;
    }
  };

  // 通知タイプに応じた色を取得
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-300/60 bg-gradient-to-r from-emerald-50/60 to-emerald-100/40 hover:from-emerald-100/70 hover:to-emerald-200/50';
      case 'warning':
        return 'border-amber-300/60 bg-gradient-to-r from-amber-50/60 to-amber-100/40 hover:from-amber-100/70 hover:to-amber-200/50';
      case 'error':
        return 'border-red-300/60 bg-gradient-to-r from-red-50/60 to-red-100/40 hover:from-red-100/70 hover:to-red-200/50';
      default:
        return 'border-blue-300/60 bg-gradient-to-r from-blue-50/60 to-blue-100/40 hover:from-blue-100/70 hover:to-blue-200/50';
    }
  };

  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '今日';
    } else if (diffDays === 2) {
      return '昨日';
    } else if (diffDays <= 7) {
      return `${diffDays}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', {
        month: '2-digit',
        day: '2-digit'
      });
    }
  };

  // データが読み込み中の場合はスケルトン表示
  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/30 via-white/20 to-white/30 rounded-2xl p-6 lg:p-8 border border-white/40 shadow-2xl relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-8">
          <div className="h-8 w-8 bg-slate-300 rounded-2xl animate-pulse"></div>
          <div className="h-7 bg-slate-300 rounded-lg w-32 animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="flex items-start space-x-4 p-4 rounded-xl border border-white/30">
              <div className="h-6 w-6 bg-slate-300 rounded-xl animate-pulse flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-300 rounded-lg w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-300 rounded-lg w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 通知がない場合の表示
  if (userData.notifications.length === 0) {
    return (
      <div className="backdrop-blur-xl bg-gradient-to-br from-white/30 via-white/20 to-white/30 rounded-2xl p-6 lg:p-8 border border-white/40 shadow-2xl relative overflow-hidden">
        {/* Enhanced glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/40 backdrop-blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/20"></div>
        
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600"></div>
        
        <div className="flex items-center space-x-3 mb-8 relative z-10">
          <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-xl">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">アクティビティ</h2>
        </div>
        
        <div className="text-center py-12 text-slate-500 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Bell className="w-10 h-10 text-slate-400" />
          </div>
          <p className="text-lg font-semibold mb-2">通知はありません</p>
          <p className="text-sm">新しい申請や更新があるとここに表示されます</p>
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
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600"></div>
      
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="flex items-center space-x-3 mb-8 relative z-10">
        <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-xl">
          <Bell className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl lg:text-2xl font-bold text-slate-800 tracking-tight">アクティビティ</h2>
      </div>
      
      <div className="space-y-4 relative z-10">
        {userData.notifications.slice(0, 5).map((notification, index) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-4 p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer ${getNotificationColor(notification.type)}`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 bg-white/50 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                {getNotificationIcon(notification.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm lg:text-base font-bold text-slate-800 leading-tight">
                  {notification.title}
                </h3>
                <span className="text-xs text-slate-500 ml-3 font-medium bg-white/50 px-2 py-1 rounded-lg">
                  {formatDate(notification.created_at)}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {notification.message}
              </p>
            </div>
          </div>
        ))}
        
        {userData.notifications.length > 5 && (
          <div className="text-center pt-4">
            <button 
              onClick={() => onNavigate('notification-history')}
              className="text-sm text-slate-500 hover:text-slate-700 font-medium px-4 py-2 bg-white/30 hover:bg-white/50 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              さらに{userData.notifications.length - 5}件の通知を表示
            </button>
          </div>
        )}
      </div>

      {/* Floating particles effect */}
      <div className="absolute top-6 right-6 w-2 h-2 bg-white/60 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-8 left-8 w-1 h-1 bg-white/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500 animation-delay-200"></div>
    </div>
  );
}

export default ActivityFeed;