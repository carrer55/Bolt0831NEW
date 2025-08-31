import React from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

interface DashboardMainViewProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onNavigate: (view: string, param?: string) => void;
  onShowDetail: (type: 'business-trip' | 'expense', id: string) => void;
}

function DashboardMainView({ 
  isSidebarOpen, 
  toggleSidebar, 
  onNavigate, 
  onShowDetail 
}: DashboardMainViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23334155%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-100/20 via-transparent to-indigo-100/20"></div>
      
      {/* Floating orbs for visual enhancement */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-xl animate-pulse delay-500"></div>

      <div className="flex h-screen relative">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar isOpen={true} onClose={() => {}} onNavigate={onNavigate} currentView="dashboard" />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
              onClick={toggleSidebar}
            />
            <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
              <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} onNavigate={onNavigate} currentView="dashboard" />
            </div>
          </>
        )}

        {/* Main Content Area - Full Width */}
        <div className="flex-1 min-w-0 relative flex flex-col">
          {/* TopBar - Full Width */}
          <TopBar onMenuClick={toggleSidebar} onNavigate={onNavigate} />
          
          {/* Main Content */}
          <MainContent onNavigate={onNavigate} onShowDetail={onShowDetail} />
        </div>
      </div>
    </div>
  );
}

export default DashboardMainView;