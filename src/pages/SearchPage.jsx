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
  const [allApps, setAllApps] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load ALL apps ONCE
  useEffect(() => {
    const loadApps = async () => {
      try {
        setLoading(true);
        const res = await searchApps({
          sortBy: 'downloads', // still using this for initial sort
          limit: 100,
        });

        if (res.data?.success) {
          setAllApps(res.data.data || []);
          setResults(res.data.data || []);
        }
      } catch (err) {
        setError('Unable to load apps');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, []);

  // Client-side search (also search in description)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults(allApps);
      return;
    }

    const q = searchQuery.toLowerCase();
    const filtered = allApps.filter(app =>
      app.name?.toLowerCase().includes(q) ||
      app.description?.toLowerCase().includes(q)
    );

    setResults(filtered);
  }, [searchQuery, allApps]);

  const handleAppClick = (id) => {
    navigate(`/app/${id}`);
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Search" showNotification />

        <div className="lg:ml-64">
          <main className="px-4 sm:px-6 py-6 pb-24 lg:pb-8 max-w-7xl mx-auto">
            {/* Full-width sticky search bar */}
            <div className="mb-8 sticky top-0 z-10 bg-gray-50 pt-2 pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 lg:px-0">
              <div className="relative max-w-3xl mx-auto">
                <SearchIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={24}
                />
                <input
                  type="text"
                  placeholder="Search apps, categories, developers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-white border border-gray-300 rounded-2xl 
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           shadow-sm text-lg placeholder-gray-400 transition-all"
                  autoFocus
                />
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading apps...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-600 font-medium">
                {error}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 font-medium">
                  {searchQuery.trim()
                    ? `No results found for "${searchQuery}"`
                    : "Start typing to search apps"}
                </p>
                <p className="mt-3 text-gray-500">
                  Try searching for app names, categories or developers
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((app) => (
                  <div key={app.id} className="w-full">
                    <SearchResultCard
                      icon={app.icon_url}
                      name={app.name}
                      description={app.description || 'No description available'}
                      rating={app.rating || app.average_rating || '0.0'}
                 
                      onClick={() => handleAppClick(app.id)}
                    />
                  </div>
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