import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';

const DeveloperConsolePage = () => {
  const [activeTab, setActiveTab] = useState('myapp');

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-300">
        <Header title="Developer Console" showNotification={false} />
        
        <div className="lg:ml-64">
          <main className="pb-24 lg:pb-6">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900 px-6 pt-6 mb-4">Developer Console</h1>
            
            {/* Tabs */}
            <div className="flex gap-4 px-6 pt-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                  activeTab === 'dashboard' 
                    ? 'bg-white text-gray-900' 
                    : 'bg-transparent text-gray-700 hover:bg-white/50'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('myapp')}
                className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                  activeTab === 'myapp' 
                    ? 'bg-white text-blue-500' 
                    : 'bg-transparent text-gray-700 hover:bg-white/50'
                }`}
              >
                My App
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                  activeTab === 'analytics' 
                    ? 'bg-white text-gray-900' 
                    : 'bg-transparent text-gray-700 hover:bg-white/50'
                }`}
              >
                Analytics
              </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[60vh]">
              {/* Content will go here based on active tab */}
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default DeveloperConsolePage;
