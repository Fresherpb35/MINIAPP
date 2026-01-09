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
import { Bell } from 'lucide-react';
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <Header onNotificationClick={handleNotificationClick} />

      <main className="lg:ml-64 pb-20 lg:pb-6">
        {/* Notification button for large screens */}
        <div className="hidden lg:flex items-center justify-end px-8 py-6 bg-white border-b border-gray-200">
          <button
            onClick={handleNotificationClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Bell size={24} className="text-gray-900" />
          </button>
        </div>

        <div className="px-6 py-6 max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={() => {}}
            />
          </div>

          {/* Search Results */}
          {searchQuery.trim() && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Results</h2>
              {searchLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.length > 0 ? (
                    searchResults.map((app) => (
                      <div
                        key={app.id}
                        className="cursor-pointer transform transition hover:scale-105"
                        onClick={() => handleAppClick(app.id)}
                      >
                        <AppCard
                          icon={app.icon_url || '📱'}
                          name={app.name}
                          category={app.category}
                          size={`${(app.file_size / (1024 * 1024)).toFixed(2)} MB`}
                          onInstall={(e) => {
                            e.stopPropagation();
                            handleInstall(app.id);
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <p>No results found</p>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Hero Card */}
          <div className="mb-8">
            <HeroCard
              title="Discover Amazing Apps"
              subtitle="Find the perfect app for every need"
              buttonText="Explore Now"
              onButtonClick={() => navigate('/categories')}
            />
          </div>

          {/* Categories */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
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
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Apps</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredApps.map((app) => (
                <div
                  key={app.id}
                  className="cursor-pointer transform transition hover:scale-105"
                  onClick={() => handleAppClick(app.id)}
                >
                  <AppCard
                    icon={app.icon_url || '📱'}
                    name={app.name}
                    category={app.category}
                    size={`${(app.file_size / (1024 * 1024)).toFixed(2)} MB`}
                    onInstall={(e) => {
                      e.stopPropagation();
                      handleInstall(app.id);
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Popular This Week */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Popular This Week</h2>
              <button
                onClick={() => navigate('/home')}
                className="text-blue-500 font-semibold hover:text-blue-600"
              >
                See All
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {popularApps.map((app) => (
                <div
                  key={app.id}
                  className="cursor-pointer transform transition hover:scale-105"
                  onClick={() => handleAppClick(app.id)}
                >
                  <AppCard
                    icon={app.icon_url || '📱'}
                    name={app.name}
                    category={app.category}
                    size={`${(app.file_size / (1024 * 1024)).toFixed(2)} MB`}
                    onInstall={(e) => {
                      e.stopPropagation();
                      handleInstall(app.id);
                    }}
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default HomePage;
