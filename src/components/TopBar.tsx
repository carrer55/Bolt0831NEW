import React from 'react';
import { Bell, HelpCircle, MessageCircle, User, Menu, Sparkles } from 'lucide-react';
import { useUserData } from '../hooks/useUserData';

interface TopBarProps {
  onMenuClick: () => void;
  onNavigate?: (view: string) => void;
}

function TopBar({ onMenuClick, onNavigate }: TopBarProps) {
  const { userData, loading } = useUserData();

  // ユーザーのプラン情報を取得
  const getCurrentPlan = () => {
    if (!userData.profile) return 'Free';
    
    // 役割に基づいてプランを決定
    switch (userData.profile.role) {
      case 'admin':
        return 'Enterprise';
      case 'manager':
        return 'Pro';
      default:
        return 'Standard';
    }
  };

  // 未読通知数を取得
  const getUnreadNotificationCount = () => {
    return userData.notifications.filter(notification => !notification.is_read).length;
  };

  const currentPlan = getCurrentPlan();
  const unreadCount = getUnreadNotificationCount();

  return (
    <div className="h-16 backdrop-blur-xl bg-gradient-to-r from-white/30 via-white/20 to-white/30 border-b border-white/30 flex items-center justify-between px-4 lg:px-6 shadow-2xl relative overflow-hidden w-full z-50">
      {/* Enhanced glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-white/40 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-indigo-50/20 to-purple-50/30"></div>
      
      {/* Subtle animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      
      <div className="flex items-center space-x-4 relative z-10">
        {/* Mobile Menu Button - Enhanced with better touch targets */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-3 text-gray-600 hover:text-gray-800 hover:bg-white/40 rounded-xl transition-all duration-300 backdrop-blur-sm hover:shadow-lg relative z-10 touch-manipulation group"
        >
          <Menu className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>
        
        {/* Logo with enhanced styling */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="relative">
            <img 
              src="/賢者の精算Logo2_Transparent_NoBuffer copy.png" 
              alt="賢者の精算ロゴ" 
              className="w-28 h-7 sm:w-36 sm:h-9 lg:w-44 lg:h-11 object-contain drop-shadow-lg"
            />
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 blur-lg -z-10 opacity-50"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-4 relative z-10">
        <div className="flex items-center space-x-1 lg:space-x-2">
          {/* Enhanced notification button */}
          <div className="relative group">
            <button 
              onClick={() => onNavigate && onNavigate('notification-history')}
              className="p-2 sm:p-2.5 text-slate-600 hover:text-slate-800 hover:bg-white/40 rounded-xl transition-all duration-300 backdrop-blur-sm hover:shadow-lg relative group-hover:scale-110"
            >
              <Bell className="w-5 h-5 sm:w-5 sm:h-5" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                  {/* Pulsing ring effect */}
                  <span className="absolute -top-1 -right-1 bg-red-400 rounded-full h-5 w-5 sm:h-6 sm:w-6 animate-ping opacity-75"></span>
                </>
              )}
            </button>
            {/* Enhanced tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-slate-900/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm">
              お知らせ
              {unreadCount > 0 && ` (${unreadCount}件の未読)`}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-900/90 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>
          </div>

          {/* Enhanced help button */}
          <div className="relative group">
            <button 
              onClick={() => onNavigate && onNavigate('help')}
              className="p-2 sm:p-2.5 text-slate-600 hover:text-slate-800 hover:bg-white/40 rounded-xl transition-all duration-300 backdrop-blur-sm hover:shadow-lg group-hover:scale-110"
            >
              <HelpCircle className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-slate-900/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm">
              ヘルプ
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-900/90 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>
          </div>

          {/* Enhanced support button */}
          <div className="relative group">
            <button 
              onClick={() => onNavigate && onNavigate('support')}
              className="p-2 sm:p-2.5 text-slate-600 hover:text-slate-800 hover:bg-white/40 rounded-xl transition-all duration-300 backdrop-blur-sm hover:shadow-lg group-hover:scale-110"
            >
              <MessageCircle className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-slate-900/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm">
              お問い合わせ
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-900/90 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>
          </div>

          {/* Enhanced plan badge */}
          <div className="relative group">
            <div className="h-10 bg-gradient-to-r from-navy-600 via-navy-700 to-navy-800 rounded-full flex items-center justify-center ml-2 shadow-xl px-4 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <Sparkles className="w-4 h-4 text-yellow-300 mr-2 animate-pulse" />
              <span className="text-white text-xs sm:text-sm font-bold tracking-wide">{currentPlan}</span>
            </div>
            <div className="absolute right-0 top-full mt-2 px-3 py-2 bg-slate-900/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm">
              現在のプラン: {currentPlan}
              <div className="absolute right-4 bottom-full w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-b-4 border-b-slate-900/90"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;