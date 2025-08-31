import React from 'react';
import { Bell, HelpCircle, MessageCircle, User, Menu, Sparkles, Crown, Zap } from 'lucide-react';
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

  // プランに応じたアイコンとカラーを取得
  const getPlanConfig = () => {
    switch (currentPlan) {
      case 'Enterprise':
        return {
          icon: Crown,
          gradient: 'from-purple-600 via-purple-700 to-purple-800',
          hoverGradient: 'hover:from-purple-700 hover:via-purple-800 hover:to-purple-900',
          glowColor: 'from-purple-400/20 to-purple-600/20'
        };
      case 'Pro':
        return {
          icon: Zap,
          gradient: 'from-emerald-600 via-emerald-700 to-emerald-800',
          hoverGradient: 'hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900',
          glowColor: 'from-emerald-400/20 to-emerald-600/20'
        };
      default:
        return {
          icon: Sparkles,
          gradient: 'from-navy-600 via-navy-700 to-navy-800',
          hoverGradient: 'hover:from-navy-700 hover:via-navy-800 hover:to-navy-900',
          glowColor: 'from-navy-400/20 to-navy-600/20'
        };
    }
  };

  const planConfig = getPlanConfig();
  const PlanIcon = planConfig.icon;

  return (
    <div className="h-16 backdrop-blur-xl bg-gradient-to-r from-white/40 via-white/30 to-white/40 border-b border-white/40 flex items-center justify-between px-4 lg:px-6 shadow-2xl relative overflow-hidden w-full z-50">
      {/* Enhanced glass effect overlay with animated shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/30 to-white/50 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 via-indigo-50/30 to-purple-50/40"></div>
      
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse opacity-60"></div>
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div>
      
      <div className="flex items-center space-x-4 relative z-10">
        {/* Enhanced Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-3 text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-2xl transition-all duration-300 backdrop-blur-sm hover:shadow-xl relative z-10 touch-manipulation group hover:scale-110 active:scale-95"
        >
          <Menu className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </button>
        
        {/* Enhanced Logo with premium styling */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="relative group">
            <img 
              src="/賢者の精算Logo2_Transparent_NoBuffer copy.png" 
              alt="賢者の精算ロゴ" 
              className="w-32 h-8 sm:w-40 sm:h-10 lg:w-48 lg:h-12 object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-300"
            />
            {/* Premium glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-indigo-400/30 to-purple-400/30 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            {/* Subtle pulse animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-300/20 to-indigo-300/20 blur-lg -z-20 animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 lg:space-x-4 relative z-10">
        <div className="flex items-center space-x-1 lg:space-x-2">
          {/* Premium notification button with enhanced animations */}
          <div className="relative group">
            <button 
              onClick={() => onNavigate && onNavigate('notification-history')}
              className="p-2.5 sm:p-3 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-2xl transition-all duration-300 backdrop-blur-sm hover:shadow-xl relative group-hover:scale-110 active:scale-95"
            >
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white text-xs rounded-full h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center font-bold shadow-xl animate-bounce border-2 border-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                  {/* Enhanced pulsing ring effect */}
                  <span className="absolute -top-1 -right-1 bg-red-400 rounded-full h-6 w-6 sm:h-7 sm:w-7 animate-ping opacity-75"></span>
                  <span className="absolute -top-1 -right-1 bg-red-300 rounded-full h-6 w-6 sm:h-7 sm:w-7 animate-ping opacity-50 animation-delay-150"></span>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </button>
            {/* Premium tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-slate-900/95 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm shadow-2xl border border-white/10">
              お知らせ
              {unreadCount > 0 && ` (${unreadCount}件の未読)`}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-900/95 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>
          </div>

          {/* Enhanced help button */}
          <div className="relative group">
            <button 
              onClick={() => onNavigate && onNavigate('help')}
              className="p-2.5 sm:p-3 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-2xl transition-all duration-300 backdrop-blur-sm hover:shadow-xl group-hover:scale-110 active:scale-95"
            >
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </button>
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-slate-900/95 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm shadow-2xl border border-white/10">
              ヘルプ
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-900/95 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>
          </div>

          {/* Enhanced support button */}
          <div className="relative group">
            <button 
              onClick={() => onNavigate && onNavigate('support')}
              className="p-2.5 sm:p-3 text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-2xl transition-all duration-300 backdrop-blur-sm hover:shadow-xl group-hover:scale-110 active:scale-95"
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </button>
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-slate-900/95 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm shadow-2xl border border-white/10">
              お問い合わせ
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-slate-900/95 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>
          </div>

          {/* Premium plan badge with enhanced styling */}
          <div className="relative group">
            <div className={`h-11 bg-gradient-to-r ${planConfig.gradient} ${planConfig.hoverGradient} rounded-2xl flex items-center justify-center ml-2 shadow-2xl px-5 hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer border border-white/20 relative overflow-hidden`}>
              {/* Animated background shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
              
              <PlanIcon className="w-4 h-4 text-yellow-300 mr-2 animate-pulse drop-shadow-lg" />
              <span className="text-white text-xs sm:text-sm font-bold tracking-wide drop-shadow-lg">{currentPlan}</span>
              
              {/* Premium glow effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${planConfig.glowColor} blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            </div>
            <div className="absolute right-0 top-full mt-2 px-4 py-3 bg-slate-900/95 text-white text-xs rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm shadow-2xl border border-white/10">
              <div className="flex items-center space-x-2">
                <PlanIcon className="w-4 h-4 text-yellow-300" />
                <span>現在のプラン: {currentPlan}</span>
              </div>
              <div className="absolute right-4 bottom-full w-0 h-0 border-l-2 border-l-transparent border-r-2 border-r-transparent border-b-4 border-b-slate-900/95"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;