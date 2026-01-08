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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [categories, setCategories] = useState([]);
  const [featuredApps, setFeaturedApps] = useState([]);
  const [popularApps, setPopularApps] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [catRes, featRes, topRes] = await Promise.all([
          getCategories(),
          getFeaturedApps(),
          getTopApps(),
        ]);

        if (catRes.data.success) setCategories(catRes.data.data || []);
        if (featRes.data.success) setFeaturedApps(featRes.data.data || []);
        if (topRes.data.success) setPopularApps(topRes.data.data || []);
      } catch (err) {
        console.error('HomePage fetch error:', err);
        setError('Failed to load apps. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    setError('');
    try {
      const res = await searchApps({ q: query, limit: 20 });
      if (res.data.success) {
        setSearchResults(res.data.data || []);
      } else {
        setError('Failed to fetch search results.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Network error while searching.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  // Go to app detail page
  const handleAppClick = (appId) => {
    navigate(`/app/${appId}`);
  };

  // Handle install (requires login)
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
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!e.target.value.trim()) setSearchResults([]);
              }}
              onSearch={() => handleSearch(searchQuery)}
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
                            e.stopPropagation(); // Crucial: prevent navigation when clicking Install
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
                onClick={() => navigate('/all-apps')}
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