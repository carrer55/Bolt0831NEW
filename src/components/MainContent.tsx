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
      <div className="min-h-full p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced header with better spacing and typography */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 lg:mb-12">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-2">
                ダッシュボード
              </h1>
              {userData.profile && (
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                  <p className="text-slate-600 text-lg">
                    ようこそ、<span className="font-semibold text-slate-800">{userData.profile.full_name}</span>さん
                  </p>
                  {userData.profile.company && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                      <span className="text-slate-500 text-sm font-medium">{userData.profile.company}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white rounded-xl font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
                <span>管理者ダッシュボード</span>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <span className="text-xs">→</span>
                </div>
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