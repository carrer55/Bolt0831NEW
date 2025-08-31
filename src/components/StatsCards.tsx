import React, { useMemo } from 'react';
import { Info, TrendingUp, TrendingDown, Sparkles, Zap, Crown } from 'lucide-react';
import { useUserData } from '../hooks/useUserData';

function StatsCards() {
  const { userData, loading } = useUserData();

  const statsData = useMemo(() => [
    {
      title: '今月の出張日当',
      value: `¥${userData.stats.monthlyBusinessTrips.toLocaleString()}`,
      trend: userData.stats.monthlyBusinessTrips > 0 ? `+${userData.stats.monthlyBusinessTrips > 50000 ? '高' : '中'}` : 'なし',
      trendUp: userData.stats.monthlyBusinessTrips > 0,
      chartColor: 'from-emerald-500 to-emerald-700',
      data: userData.stats.monthlyBusinessTrips,
      icon: Sparkles,
      bgGradient: 'from-emerald-50/50 via-emerald-100/30 to-emerald-50/50',
      borderGradient: 'from-emerald-200/60 to-emerald-300/60'
    },
    {
      title: '今月の交通費・宿泊費',
      value: `¥${userData.stats.monthlyExpenses.toLocaleString()}`,
      trend: userData.stats.monthlyExpenses > 0 ? `+${userData.stats.monthlyExpenses > 50000 ? '高' : '中'}` : 'なし',
      trendUp: userData.stats.monthlyExpenses > 0,
      chartColor: 'from-blue-500 to-blue-700',
      data: userData.stats.monthlyExpenses,
      icon: Zap,
      bgGradient: 'from-blue-50/50 via-blue-100/30 to-blue-50/50',
      borderGradient: 'from-blue-200/60 to-blue-300/60'
    },
    {
      title: '今月の精算合計',
      value: `¥${(userData.stats.monthlyExpenses + userData.stats.monthlyBusinessTrips).toLocaleString()}`,
      trend: `承認済み¥${userData.stats.approvedAmount > 0 ? userData.stats.approvedAmount.toLocaleString() : '0'}`,
      trendUp: userData.stats.approvedAmount > 0,
      chartColor: 'from-purple-500 to-purple-700',
      data: userData.stats.monthlyExpenses + userData.stats.monthlyBusinessTrips,
      icon: Crown,
      bgGradient: 'from-purple-50/50 via-purple-100/30 to-purple-50/50',
      borderGradient: 'from-purple-200/60 to-purple-300/60'
    }
  ], [userData.stats]);

  // データが読み込み中の場合はスケルトン表示
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="backdrop-blur-xl bg-gradient-to-br from-white/30 via-white/20 to-white/30 rounded-2xl p-6 lg:p-8 border border-white/40 shadow-2xl relative overflow-hidden"
          >
            <div className="animate-pulse">
              <div className="h-5 bg-slate-300 rounded-lg mb-6"></div>
              <div className="h-10 bg-slate-300 rounded-lg mb-6"></div>
              <div className="h-4 bg-slate-300 rounded-lg mb-6"></div>
              <div className="h-16 bg-slate-300 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <div
            key={index}
            className={`backdrop-blur-xl bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 lg:p-8 border border-gradient-to-r ${stat.borderGradient} shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 group relative overflow-hidden cursor-pointer`}
          >
            {/* Enhanced glass effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-white/40 backdrop-blur-xl"></div>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-60`}></div>
            
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.chartColor}`}></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-slate-700 text-sm lg:text-base font-bold tracking-wide">{stat.title}</h3>
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${stat.chartColor} shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                <IconComponent className="w-5 h-5 lg:w-6 lg:h-6 text-white drop-shadow-lg" />
              </div>
            </div>
            
            <div className="mb-6 relative z-10">
              <p className="text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 mb-3 tracking-tight group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </p>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${stat.trendUp ? 'bg-emerald-100' : 'bg-red-100'} shadow-lg`}>
                  {stat.trendUp ? (
                    <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
                  )}
                </div>
                <span className={`text-sm lg:text-base font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.trend}
                </span>
              </div>
            </div>

            {/* Enhanced Mini Chart */}
            <div className="h-16 lg:h-20 relative z-10">
              {index === 0 && (
                <svg className="w-full h-full" viewBox="0 0 200 48">
                  <defs>
                    <linearGradient id={`gradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <filter id={`glow${index}`}>
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d="M0 40 Q50 20 100 25 T200 15"
                    fill="none"
                    stroke={`url(#gradient${index})`}
                    strokeWidth="3"
                    filter={`url(#glow${index})`}
                    className="group-hover:stroke-[4] transition-all duration-300"
                  />
                  {/* Data points */}
                  <circle cx="0" cy="40" r="3" fill="#10b981" className="animate-pulse" />
                  <circle cx="100" cy="25" r="3" fill="#059669" className="animate-pulse animation-delay-300" />
                  <circle cx="200" cy="15" r="3" fill="#047857" className="animate-pulse animation-delay-600" />
                </svg>
              )}
              {index === 1 && (
                <div className="flex items-end justify-between h-full space-x-1">
                  {[40, 35, 45, 50, 42, 48, 38, 52, 46, 44].map((height, i) => (
                    <div
                      key={i}
                      className={`bg-gradient-to-t ${stat.chartColor} rounded-lg transition-all duration-500 group-hover:scale-110 shadow-lg`}
                      style={{ 
                        height: `${height}%`, 
                        width: '8%',
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
              )}
              {index === 2 && (
                <svg className="w-full h-full" viewBox="0 0 200 48">
                  <defs>
                    <linearGradient id={`gradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#7c3aed" />
                      <stop offset="100%" stopColor="#6d28d9" />
                    </linearGradient>
                    <filter id={`glow${index}`}>
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d="M0 30 Q50 35 100 20 T200 25"
                    fill="none"
                    stroke={`url(#gradient${index})`}
                    strokeWidth="3"
                    filter={`url(#glow${index})`}
                    className="group-hover:stroke-[4] transition-all duration-300"
                  />
                  {/* Gradient fill area */}
                  <path
                    d="M0 30 Q50 35 100 20 T200 25 L200 48 L0 48 Z"
                    fill={`url(#gradient${index})`}
                    opacity="0.2"
                    className="group-hover:opacity-30 transition-opacity duration-300"
                  />
                </svg>
              )}
            </div>

            {/* Floating particles effect */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-white/60 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500 animation-delay-200"></div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;