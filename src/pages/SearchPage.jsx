import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import SearchResultCard from '../components/ui/SearchResultCard';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = [
    { id: 1, icon: '🖼️', name: 'MiniAppStore', description: 'App is going good...', rating: '0.0', downloads: '1' },
    { id: 2, icon: '📱', name: 'miniapp', description: 'light weight app...', rating: '0.0', downloads: '1' },
    { id: 3, icon: '📱', name: 'MiniAPstore', description: 'lightweight app...', rating: '0.0', downloads: '0' },
    { id: 4, icon: '📸', name: 'New Test App', description: 'test app', rating: '0.0', downloads: '0' },
    { id: 5, icon: '🎵', name: 'MusicFlow', description: 'Your music, your way', rating: '4.5', downloads: '32151' },
    { id: 6, icon: '💪', name: 'FitTracker', description: 'Your personal fitness companion', rating: '4.7', downloads: '5682' },
  ];

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Search" showNotification={false} />
        
        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 lg:pb-6 max-w-4xl">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900 mb-6">Search</h1>
            
            <div className="mb-6">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search app, games, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
                />
              </div>
            </div>

            <div className="space-y-3">
              {searchResults.map((app) => (
                <SearchResultCard
                  key={app.id}
                  icon={app.icon}
                  name={app.name}
                  description={app.description}
                  rating={app.rating}
                  downloads={app.downloads}
                  onClick={() => console.log('App clicked:', app.name)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default SearchPage;