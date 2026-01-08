// src/pages/SearchPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import SearchResultCard from '../components/ui/SearchResultCard';
import { searchApps } from '../services/appsService';

const SearchPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true); // Start with loading
  const [error, setError] = useState('');

  // Load ALL apps on initial page load
  useEffect(() => {
    const loadAllApps = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await searchApps({
          limit: 50, // Show many apps initially
          sortBy: 'downloads', // Or 'newest' — your choice
        });

        if (res.data.success) {
          setResults(res.data.data || []);
        } else {
          setError('Failed to load apps');
        }
      } catch (err) {
        console.error('Failed to load all apps:', err);
        setError('Unable to load apps right now. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAllApps();
  }, []);

  // Debounced search when typing
  useEffect(() => {
    if (!searchQuery.trim()) {
      // If query is empty, reload all apps
      const reloadAll = async () => {
        setLoading(true);
        try {
          const res = await searchApps({
            limit: 50,
            sortBy: 'downloads',
          });
          if (res.data.success) {
            setResults(res.data.data || []);
          }
        } catch (err) {
          setError('Search temporarily unavailable');
        } finally {
          setLoading(false);
        }
      };
      reloadAll();
      return;
    }

    // Debounced search for non-empty query
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');

      try {
        const res = await searchApps({
          q: searchQuery.trim(),
          limit: 30,
          sortBy: 'relevance',
        });

        if (res.data.success) {
          setResults(res.data.data || []);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Search failed. Please try again.');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAppClick = (appId) => {
    navigate(`/app/${appId}`);
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Search" showNotification={true} />

        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 lg:pb-6 max-w-4xl mx-auto">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900 mb-8">
              Search Apps
            </h1>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <SearchIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />
                <input
                  type="text"
                  placeholder="Search apps, games, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-12 pr-6 py-4 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm transition"
                />
              </div>

              {/* Optional hint when no query */}
              {!searchQuery.trim() && !loading && results.length > 0 && (
                <p className="mt-4 text-gray-600 text-center">
                  Showing all apps • Start typing to search
                </p>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-lg">
                  {searchQuery.trim() ? 'Searching...' : 'Loading apps...'}
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-20">
                <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Results (only when searching) */}
            {!loading && searchQuery.trim() && results.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  No apps found for "<strong>{searchQuery}</strong>"
                </p>
                <p className="text-gray-400 mt-2">Try different keywords</p>
              </div>
            )}

            {/* Results List */}
            {!loading && results.length > 0 && (
              <div className="space-y-4">
                {results.map((app) => (
                  <SearchResultCard
                    key={app.id}
                    icon={app.icon_url || 'App'}
                    name={app.name}
                    description={app.description || 'No description'}
                    rating={app.rating ? app.rating.toFixed(1) : '0.0'}
                    downloads={app.download_count?.toLocaleString() || '0'}
                    onClick={() => handleAppClick(app.id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
};

export default SearchPage;