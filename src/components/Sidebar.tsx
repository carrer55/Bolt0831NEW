import React from 'react';
import { 
  Home, 
  Plane, 
  Receipt, 
  FolderOpen, 
  Calculator, 
  Settings, 
  LogOut,
  User,
  X,
  Shield,
  Users,
  Sparkles,
  Crown,
  Zap
} from 'lucide-react';
import { useUserData } from '../hooks/useUserData';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: string) => void;
  currentView?: string;
}

function Sidebar({ isOpen, onClose, onNavigate, currentView = 'dashboard' }: SidebarProps) {
  const { logout } = useAuth();
  const { userData } = useUserData();
  
  const handleLogout = async () => {
    try {
      await logout();
      // ログアウト後の処理は必要に応じて追加
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  // ユーザーの役割に基づいてメニュー項目を生成
  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: 'ホーム', view: 'dashboard', show: true, color: 'text-slate-600' },
      { icon: Plane, label: '出張申請', view: 'business-trip', show: true, color: 'text-navy-600' },
      { icon: Receipt, label: '経費申請', view: 'expense', show: true, color: 'text-emerald-600' },
      { icon: FolderOpen, label: '書類管理', view: 'document-management', show: true, color: 'text-blue-600' },
      { icon: Calculator, label: '節税シミュレーション', view: 'tax-simulation', show: true, color: 'text-purple-600' },
      { icon: Settings, label: '出張規定管理', view: 'travel-regulation-management', show: true, color: 'text-amber-600' },
      { icon: User, label: 'マイページ（設定）', view: 'my-page', show: true, color: 'text-indigo-600' },
    ];

    // 管理者・マネージャーのみ表示する項目
    const adminItems = [
      { icon: Shield, label: '管理者ダッシュボード', view: 'admin-dashboard', show: userData.profile?.role === 'admin', color: 'text-purple-600' },
      { icon: Users, label: 'ユーザー管理', view: 'user-management', show: userData.profile?.role === 'admin' || userData.profile?.role === 'manager', color: 'text-red-600' },
    ];

    return [...baseItems, ...adminItems].filter(item => item.show);
  };

  const handleMenuClick = (view: string) => {
    if (onNavigate) {
      onNavigate(view);
    }
    // Close sidebar on mobile when item is clicked
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  // ユーザーの役割に応じたバッジを取得
  const getRoleBadge = () => {
    const role = userData.profile?.role;
    switch (role) {
      case 'admin':
        return {
          icon: Crown,
          label: '管理者',
          gradient: 'from-purple-600 to-purple-800',
          textColor: 'text-purple-100'
        };
      case 'manager':
        return {
          icon: Zap,
          label: 'マネージャー',
          gradient: 'from-emerald-600 to-emerald-800',
          textColor: 'text-emerald-100'
        };
      default:
        return {
          icon: Sparkles,
          label: '一般ユーザー',
          gradient: 'from-navy-600 to-navy-800',
          textColor: 'text-navy-100'
        };
    }
  };

  const menuItems = getMenuItems();
  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  return (
    <div className="w-64 h-full backdrop-blur-xl bg-gradient-to-b from-white/30 via-white/20 to-white/30 border-r border-white/40 flex flex-col shadow-2xl relative overflow-hidden">
      {/* Enhanced glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/40 backdrop-blur-xl"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-indigo-50/20 to-purple-50/30"></div>
      
      {/* Animated side accent */}
      <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-navy-400 via-blue-500 to-indigo-600"></div>
      
      <div className="p-6 flex-shrink-0 relative z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="lg:hidden p-3 text-slate-600 hover:text-slate-800 hover:bg-white/40 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Enhanced user info display */}
        {userData.profile && (
          <div className="mt-6 p-5 bg-gradient-to-br from-white/30 to-white/20 rounded-2xl border border-white/40 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-14 h-14 bg-gradient-to-br ${roleBadge.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white text-lg font-black drop-shadow-lg">
                    {userData.profile.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                {/* Premium glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${roleBadge.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm lg:text-base font-bold text-slate-800 truncate mb-1">
                  {userData.profile.full_name || 'ユーザー'}
                </p>
                <div className={`inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${roleBadge.gradient} rounded-full shadow-lg`}>
                  <RoleIcon className={`w-3 h-3 ${roleBadge.textColor}`} />
                  <span className={`text-xs font-bold ${roleBadge.textColor} tracking-wide`}>
                    {roleBadge.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 relative z-10 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            
            return (
              <li key={index}>
                <button
                  onClick={() => handleMenuClick(item.view)}
                  className={`
                    w-full flex items-center space-x-4 px-4 py-3 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden
                    ${isActive 
                      ? 'bg-gradient-to-r from-navy-600 via-navy-700 to-navy-800 text-white shadow-2xl scale-105 border border-navy-400/30' 
                      : 'text-slate-700 hover:bg-white/40 hover:text-slate-900 hover:scale-105 hover:shadow-xl'
                    }
                  `}
                >
                  {/* Active state shimmer effect */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                  )}
                  
                  <div className={`p-2 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : `bg-white/30 ${item.color} group-hover:bg-white/50`
                  }`}>
                    <Icon className="w-5 h-5 flex-shrink-0 drop-shadow-lg" />
                  </div>
                  <span className="text-sm lg:text-base font-bold truncate tracking-wide">
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse shadow-lg"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Enhanced logout button */}
      <div className="p-4 flex-shrink-0 relative z-10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-4 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white rounded-2xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 relative overflow-hidden group border border-red-400/30"
        >
          {/* Animated background shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
          
          <div className="w-6 h-6 bg-white/20 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
            <LogOut className="w-4 h-4 drop-shadow-lg" />
          </div>
          <span className="text-sm lg:text-base font-black tracking-wide drop-shadow-lg">ログアウト</span>
          
          {/* Premium glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>
      </div>

      {/* Floating particles effect */}
      <div className="absolute top-20 right-4 w-2 h-2 bg-white/40 rounded-full animate-ping opacity-60"></div>
      <div className="absolute bottom-32 left-4 w-1 h-1 bg-white/30 rounded-full animate-pulse opacity-40"></div>
    </div>
  );
}

export default Sidebar;