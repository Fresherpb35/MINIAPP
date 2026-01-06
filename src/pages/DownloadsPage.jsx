// src/pages/DownloadsPage.jsx
import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';

const DownloadsPage = () => {
  const [activeTab, setActiveTab] = useState('installed');

  const tabs = [
    { id: 'installed', label: 'Installed(0)' },
    { id: 'history', label: 'History(0)' },
  ];

  // Yeh wahi active state hai jo HomePage mein use hota hai
  const navActiveTab = 'download'; // Fixed for this page (same as HomePage ka 'home')

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop pe active "Download" menu blue highlight ke saath */}
      <Sidebar activeTab={navActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Tabs Section - Centered with proper active blue styling */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-center gap-16 max-w-md mx-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative py-2 text-sm font-medium cursor-pointer transition-all"
                >
                  <span
                    className={`inline-block pb-3 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-600 border-transparent hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Empty State */}
        <main className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-lg text-gray-500">No downloads found</p>
        </main>

        {/* Mobile Bottom Navigation - Mobile pe "Download" tab blue highlight */}
        <MobileBottomNav activeTab={navActiveTab} />
      </div>
    </div>
  );
};

export default DownloadsPage;