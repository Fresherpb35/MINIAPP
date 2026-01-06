// ============================================
// src/pages/AllAppsPage.jsx
// ============================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';

const AllAppsPage = () => {
  const navigate = useNavigate();

  const allApps = [
    { id: 1, icon: '💪', name: 'FitTracker', category: 'Health', size: '14843MB' },
    { id: 2, icon: '📸', name: 'SocialHub', category: 'Social', size: '5451MB' },
    { id: 3, icon: '🎵', name: 'MusicFlow', category: 'Entertainment', size: '5451MB' },
    { id: 4, icon: '📚', name: 'LearnQuick', category: 'Education', size: '5451MB' },
    { id: 5, icon: '📊', name: 'TaskMaster Pro', category: 'Productivity', size: '5451MB' },
    { id: 6, icon: '🖼️', name: 'MiniAppStore', category: 'Productivity', size: '28733MB' },
    { id: 7, icon: '📱', name: 'miniapp', category: 'Productivity', size: '28733MB' },
    { id: 8, icon: '📸', name: 'New Test App', category: 'Health', size: '5451MB' },
  ];

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-white">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
        </header>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center px-8 py-4 bg-white border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        </div>
        
        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 lg:pb-6 max-w-2xl mx-auto">
            {/* Apps List */}
            <div className="space-y-4">
              {allApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                    {app.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{app.name}</h3>
                    <p className="text-gray-500 text-sm">
                      {app.category} • {app.size}
                    </p>
                  </div>
                  
                  <button className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap">
                    Install
                  </button>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default AllAppsPage;