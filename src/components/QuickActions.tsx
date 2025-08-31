import React from 'react';
import { Plane, Receipt, Plus, Sparkles, Zap } from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (view: 'dashboard' | 'business-trip' | 'expense' | 'tax-simulation') => void;
}

function QuickActions({ onNavigate }: QuickActionsProps) {
  return (
    <div className="mb-8 lg:mb-12">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-navy-600 to-navy-800 rounded-2xl flex items-center justify-center shadow-xl">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">クイックアクション</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* 出張申請ボタン */}
        <button 
          onClick={() => onNavigate('business-trip')}
          className="group relative flex items-center justify-center space-x-4 px-8 py-6 bg-gradient-to-br from-navy-600 via-navy-700 to-navy-800 hover:from-navy-700 hover:via-navy-800 hover:to-navy-900 rounded-2xl text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-navy-400/30"
        >
          {/* Animated background shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
          
          {/* Icon container with enhanced styling */}
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Plus className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
              <Plane className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <span className="text-lg lg:text-xl font-black tracking-wide drop-shadow-lg">出張申請</span>
          
          {/* Premium glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-navy-400/20 to-navy-600/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>

        {/* 経費申請ボタン */}
        <button 
          onClick={() => onNavigate('expense')}
          className="group relative flex items-center justify-center space-x-4 px-8 py-6 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:via-emerald-800 hover:to-emerald-900 rounded-2xl text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-emerald-400/30"
        >
          {/* Animated background shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
          
          {/* Icon container with enhanced styling */}
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Plus className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
              <Receipt className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <span className="text-lg lg:text-xl font-black tracking-wide drop-shadow-lg">経費申請</span>
          
          {/* Premium glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>

        {/* 節税シミュレーションボタン */}
        <button 
          onClick={() => onNavigate('tax-simulation')}
          className="group relative flex items-center justify-center space-x-4 px-8 py-6 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 rounded-2xl text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 overflow-hidden border border-purple-400/30 sm:col-span-2 lg:col-span-1"
        >
          {/* Animated background shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
          
          {/* Icon container with enhanced styling */}
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <Sparkles className="w-6 h-6 text-white drop-shadow-lg animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <span className="text-lg lg:text-xl font-black tracking-wide drop-shadow-lg">節税シミュレーション</span>
          
          {/* Premium glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>
      </div>
    </div>
  );
}

export default QuickActions;