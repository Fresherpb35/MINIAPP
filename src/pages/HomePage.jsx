// ============================================
// src/pages/HomePage.jsx (Updated)
// ============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import SearchBar from '../components/ui/SearchBar';
import HeroCard from '../components/ui/HeroCard';
import CategoryCard from '../components/ui/CategoryCard';
import AppCard from '../components/ui/AppCard';
import { Bell } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, icon: '🎬', title: 'Produc...', fullTitle: 'Productivity', appCount: 4 },
    { id: 2, icon: '🎓', title: 'Educati...', fullTitle: 'Education', appCount: 1 },
    { id: 3, icon: '🎬', title: 'Social', fullTitle: 'Social', appCount: 1 },
    { id: 4, icon: '🎬', title: 'Business', fullTitle: 'Business', appCount: 0 },
    { id: 5, icon: '🎬', title: 'Enterta...', fullTitle: 'Entertainment', appCount: 1 },
    { id: 6, icon: '❤️', title: 'Health', fullTitle: 'Health', appCount: 1 },
    { id: 7, icon: '🎬', title: 'Utilities', fullTitle: 'Utilities', appCount: 0 },
    { id: 8, icon: '🎮', title: 'Games', fullTitle: 'Games', appCount: 0 },
    { id: 9, icon: '🎬', title: 'New ca...', fullTitle: 'New Category', appCount: 0 },
  ];

  const featuredApps = [
    { id: 1, icon: '📊', name: 'TaskMaster Pro', category: 'Productivity', size: '5451MB' },
    { id: 2, icon: '🎵', name: 'MusicFlow', category: 'Entertainment', size: '5451MB' },
    { id: 3, icon: '📚', name: 'LearnQuick', category: 'Education', size: '5451MB' },
  ];

  const popularApps = [
    { id: 4, icon: '💪', name: 'FitTracker', category: 'Health', size: '14843MB' },
    { id: 5, icon: '📸', name: 'SocialHub', category: 'Social', size: '5451MB' },
    { id: 6, icon: '🎵', name: 'MusicFlow', category: 'Entertainment', size: '5451MB' },
    { id: 7, icon: '📚', name: 'LearnQuick', category: 'Education', size: '5451MB' },
  ];

  const handleCategoryClick = (categoryFullTitle) => {
    navigate(`/category/${categoryFullTitle}`);
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Header for mobile */}
      <Header onNotificationClick={handleNotificationClick} />
      
      {/* Main content */}
      <main className="lg:ml-64 pb-20 lg:pb-6">
        {/* Desktop Header with Notification */}
        <div className="hidden lg:flex items-center justify-end px-8 py-6 bg-white border-b border-gray-200">
          <button
            onClick={handleNotificationClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <Bell size={24} className="text-gray-900" />
          </button>
        </div>

        <div className="px-6 py-6 max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Hero Card */}
          <div className="mb-8">
            <HeroCard
              title="Discover Amazing Apps"
              subtitle="Find the perfect app for every need"
              buttonText="Explore Now"
              onButtonClick={() => navigate('/categories')}
            />
          </div>

          {/* Categories Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  icon={category.icon}
                  title={category.title}
                  appCount={category.appCount}
                  onClick={() => handleCategoryClick(category.fullTitle)}
                />
              ))}
            </div>
          </section>

          {/* Featured Apps Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Apps</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-3">
              {featuredApps.map((app) => (
                <AppCard
                  key={app.id}
                  icon={app.icon}
                  name={app.name}
                  category={app.category}
                  size={app.size}
                  onInstall={() => console.log('Install clicked:', app.name)}
                />
              ))}
            </div>
          </section>

          {/* Popular This Week Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Popular This Week</h2>
             <button 
  onClick={() => navigate('/all-apps')}  // Changed from '/search' to '/all-apps'
  className="text-blue-500 font-semibold hover:text-blue-600 cursor-pointer"
>
  See All
</button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-3">
              {popularApps.map((app) => (
                <AppCard
                  key={app.id}
                  icon={app.icon}
                  name={app.name}
                  category={app.category}
                  size={app.size}
                  onInstall={() => console.log('Install clicked:', app.name)}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Nav for mobile */}
      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default HomePage;