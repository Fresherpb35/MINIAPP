// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import SearchBar from '../components/ui/SearchBar';
import HeroCard from '../components/ui/HeroCard';
import CategoryCard from '../components/ui/CategoryCard';
import AppCard from '../components/ui/AppCard';
import { Bell, TrendingUp, Star, Sparkles, Search as SearchIcon } from 'lucide-react';
import api from '../config/api';
import { getCategories, getFeaturedApps, getTopApps, searchApps } from '../services/appsService';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // App data
  const [allApps, setAllApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredApps, setFeaturedApps] = useState([]);
  const [popularApps, setPopularApps] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔹 Fetch all initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const [catRes, featRes, topRes, allAppsRes] = await Promise.all([
          getCategories(),
          getFeaturedApps(),
          getTopApps(),
          searchApps({ sortBy: 'downloads', limit: 200 }), // Fetch all apps once, NO q
        ]);

        if (catRes.data.success) setCategories(catRes.data.data || []);
        if (featRes.data.success) setFeaturedApps(featRes.data.data || []);
        if (topRes.data.success) setPopularApps(topRes.data.data || []);
        if (allAppsRes.data.success) setAllApps(allAppsRes.data.data || []);

      } catch (err) {
        console.error('HomePage fetch error:', err);
        setError('Failed to load apps. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Handle client-side search
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    const q = query.toLowerCase();

    // Filter apps by name on frontend
    const filtered = allApps.filter(app => app.name?.toLowerCase().includes(q));
    setSearchResults(filtered);
    setSearchLoading(false);
  };

  // 🔹 Navigation handlers
  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  const handleAppClick = (appId) => {
    navigate(`/app/${appId}`);
  };

  // 🔹 Handle install/download (requires login)
  const handleInstall = async (appId) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please sign in to install apps');
      navigate('/signin');
      return;
    }

    try {
      const res = await api.get(`/api/apps/${appId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        window.open(res.data.data.downloadUrl, '_blank');
      } else {
        alert(res.data.message || 'Failed to download app');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('An error occurred while downloading the app.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading amazing apps...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-red-600 font-semibold text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <Header onNotificationClick={handleNotificationClick} />

      <main className="lg:ml-64 pb-20 lg:pb-6">
        {/* Notification button for large screens */}
        <div className="hidden lg:flex items-center justify-end px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <button
            onClick={handleNotificationClick}
            className="relative p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 hover:scale-110 group"
          >
            <Bell size={22} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full mx-auto">
          {/* Search Bar with enhanced styling */}
          <div className="mb-8">
            <div className="relative">
              <SearchBar
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onSearch={() => {}}
              />
              {searchQuery && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <SearchIcon size={20} className="text-blue-600 animate-pulse" />
                </div>
              )}
            </div>
          </div>

          {/* Search Results */}
          {searchQuery.trim() && (
            <section className="mb-12 animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                  <SearchIcon size={20} className="text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Search Results
                </h2>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {searchResults.length}
                </span>
              </div>
              {searchLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {searchResults.length > 0 ? (
                    searchResults.map((app) => (
                      <EnhancedAppCard
                        key={app.id}
                        app={app}
                        onAppClick={handleAppClick}
                        onInstall={handleInstall}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SearchIcon size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-600 text-lg font-medium">No results found</p>
                      <p className="text-gray-500 text-sm mt-2">Try searching with different keywords</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Hero Card with enhanced spacing */}
          {!searchQuery.trim() && (
            <>
              <div className="mb-12">
                <HeroCard
                  title="Discover Amazing Apps"
                  subtitle="Find the perfect app for every need"
                  buttonText="Explore Now"
                  onButtonClick={() => navigate('/categories')}
                />
              </div>

              {/* Categories */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Categories
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {categories.map((cat) => (
                    <CategoryCard
                      key={cat.id}
                      icon={cat.icon || '📱'}
                      title={cat.name}
                      appCount={cat.appCount || 0}
                      onClick={() => handleCategoryClick(cat.name)}
                    />
                  ))}
                </div>
              </section>

              {/* Featured Apps */}
              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl">
                    <Star size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Featured Apps
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {featuredApps.map((app) => (
                    <EnhancedAppCard
                      key={app.id}
                      app={app}
                      onAppClick={handleAppClick}
                      onInstall={handleInstall}
                    />
                  ))}
                </div>
              </section>

              {/* Popular This Week */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Popular This Week
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {popularApps.map((app) => (
                    <EnhancedAppCard
                      key={app.id}
                      app={app}
                      onAppClick={handleAppClick}
                      onInstall={handleInstall}
                    />
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

// ────────────────────────────────────────────────
// Enhanced App Card Component with Fixed Dimensions
// ────────────────────────────────────────────────

const EnhancedAppCard = ({ app, onAppClick, onInstall }) => {
  return (
    <div
      className="group cursor-pointer"
      onClick={() => onAppClick(app.id)}
    >
      <div className="h-full bg-white rounded-2xl border-2 border-gray-200 overflow-hidden transition-all duration-300 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 flex flex-col">
        {/* App Icon & Info - Fixed Height */}
        <div className="p-5 flex items-center gap-4 border-b border-gray-100">
          <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
            {app.icon_url ? (
              <img src={app.icon_url} alt={app.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">📱</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-blue-600 transition-colors">
              {app.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600 truncate">{app.category}</span>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500 flex-shrink-0">
                {(app.file_size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>
        </div>

        {/* Install Button - Fixed Height */}
        <div className="p-5 mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onInstall(app.id);
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;