import React from 'react';
import StatsCards from './StatsCards';
import QuickActions from './QuickActions';
import RecentApplications from './RecentApplications';
import ActivityFeed from './ActivityFeed';
import { useUserData } from '../hooks/useUserData';

interface MainContentProps {
  onNavigate: (view: string) => void;
  onShowDetail: (type: 'business-trip' | 'expense', id: string) => void;
}

function MainContent({ onNavigate, onShowDetail }: MainContentProps) {
  const { userData, loading } = useUserData();

  // ユーザーの役割を取得
  const getUserRole = () => {
    return userData.profile?.role || 'user';
  };

  const userRole = getUserRole();
  const isAdmin = userRole === 'admin' || userRole === 'manager';

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-full p-4 lg:p-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced header with premium styling */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-12">
            <div className="mb-6 lg:mb-0">
              <div className="relative">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-3 tracking-tight">
                  ダッシュボード
                </h1>
                {/* Subtle text shadow effect */}
                <div className="absolute inset-0 text-4xl lg:text-5xl xl:text-6xl font-black text-slate-200/30 blur-sm -z-10">
                  ダッシュボード
                </div>
              </div>
              {userData.profile && (
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full animate-pulse shadow-lg"></div>
                    <p className="text-slate-600 text-lg lg:text-xl">
                      ようこそ、<span className="font-bold text-slate-800 bg-gradient-to-r from-navy-600 to-navy-800 bg-clip-text text-transparent">{userData.profile.full_name}</span>さん
                    </p>
                  </div>
                  {userData.profile.company && (
                    <div className="flex items-center space-x-3 px-4 py-2 bg-white/30 rounded-full backdrop-blur-sm border border-white/40 shadow-lg">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full animate-pulse"></div>
                      <span className="text-slate-600 text-sm font-semibold tracking-wide">{userData.profile.company}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="relative flex items-center space-x-4 px-8 py-4 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group overflow-hidden border border-purple-400/30"
              >
                {/* Animated background shimmer */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                
                <div className="w-3 h-3 bg-purple-300 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-lg font-bold tracking-wide drop-shadow-lg">管理者ダッシュボード</span>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                  <span className="text-sm font-bold">→</span>
                </div>
                
                {/* Premium glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            )}
          </div>
          
          <StatsCards />
          <QuickActions onNavigate={onNavigate} />
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <RecentApplications onShowDetail={onShowDetail} onNavigate={onNavigate} />
            <ActivityFeed />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContent;