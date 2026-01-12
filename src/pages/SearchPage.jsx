import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Sparkles, Filter, X } from 'lucide-react';
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
          sortBy: 'downloads',
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

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header title="Search" showNotification />

        <div className="lg:ml-64">
          <main className="px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 w-full mx-auto">
            {/* Enhanced Search Header */}
            <div className="mb-8 sticky top-0 z-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-4 pb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                {/* Title */}
                <div className="mb-6 text-center">
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-3">
                    <SearchIcon className="w-8 h-8 text-blue-600" />
                    Discover Apps
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Search from {allApps.length} amazing apps
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl"></div>
                  <div className="relative">
                    <SearchIcon
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors z-10"
                      size={24}
                    />
                    <input
                      type="text"
                      placeholder="Search apps, categories, developers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-16 pr-14 py-4 sm:py-5 bg-white border-2 border-gray-200 rounded-3xl 
                               focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500
                               shadow-lg hover:shadow-xl text-base sm:text-lg placeholder-gray-400 transition-all duration-300"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                      >
                        <X size={20} className="text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Search Stats */}
                {searchQuery && (
                  <div className="mt-4 text-center animate-in fade-in slide-in-from-top duration-300">
                    <p className="text-sm text-gray-600">
                      Found <span className="font-bold text-blue-600">{results.length}</span> result{results.length !== 1 ? 's' : ''} 
                      {searchQuery && ` for "${searchQuery}"`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className="w-full">
              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState error={error} />
              ) : results.length === 0 ? (
                <EmptyState searchQuery={searchQuery} />
              ) : (
                <ResultsGrid results={results} handleAppClick={handleAppClick} />
              )}
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

// Loading State Component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-32">
    <div className="relative w-20 h-20 mb-6">
      <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="text-gray-600 text-lg font-medium">Loading amazing apps...</p>
    <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
  </div>
);

// Error State Component
const ErrorState = ({ error }) => (
  <div className="flex flex-col items-center justify-center py-32">
    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
      <X className="w-10 h-10 text-red-500" />
    </div>
    <p className="text-xl text-red-600 font-semibold mb-2">{error}</p>
    <p className="text-gray-500">Please try again later</p>
  </div>
);

// Empty State Component
const EmptyState = ({ searchQuery }) => (
  <div className="flex flex-col items-center justify-center py-32">
    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
      <SearchIcon className="w-12 h-12 text-blue-600" />
    </div>
    <p className="text-2xl text-gray-900 font-bold mb-2">
      {searchQuery.trim() ? `No results found` : "Start Your Search"}
    </p>
    <p className="text-gray-600 text-center max-w-md mb-4">
      {searchQuery.trim()
        ? `We couldn't find any apps matching "${searchQuery}"`
        : "Type in the search bar to discover amazing apps"}
    </p>
    <div className="flex flex-wrap gap-2 justify-center mt-6">
      <SuggestionChip text="Games" />
      <SuggestionChip text="Productivity" />
      <SuggestionChip text="Social" />
      <SuggestionChip text="Entertainment" />
    </div>
  </div>
);

// Suggestion Chip Component
const SuggestionChip = ({ text }) => (
  <span className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-colors cursor-pointer">
    {text}
  </span>
);

// Results Grid Component
const ResultsGrid = ({ results, handleAppClick }) => (
  <div className="space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
    {results.map((app, index) => (
      <div 
        key={app.id} 
        className="w-full animate-in fade-in slide-in-from-bottom duration-300"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <EnhancedSearchCard app={app} onClick={() => handleAppClick(app.id)} />
      </div>
    ))}
  </div>
);

// Enhanced Search Card Component
const EnhancedSearchCard = ({ app, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-3xl border-2 border-gray-200 p-4 sm:p-6 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 w-full"
    >
      <div className="flex items-start gap-4 sm:gap-6">
        {/* App Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg ring-4 ring-white group-hover:ring-blue-100 transition-all duration-300">
          {app.icon_url ? (
            <img
              src={app.icon_url}
              alt={app.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl">
              📱
            </div>
          )}
        </div>

        {/* App Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {app.name}
            </h3>
            {app.rating && (
              <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full border border-yellow-200 flex-shrink-0">
                <span className="text-yellow-500 text-sm">★</span>
                <span className="text-sm font-bold text-gray-900">
                  {app.rating || app.average_rating || '0.0'}
                </span>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-3 leading-relaxed">
            {app.description || 'No description available'}
          </p>

          {/* Metadata Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {app.category && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                {app.category}
              </span>
            )}
            {app.download_count && (
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                {app.download_count.toLocaleString()} downloads
              </span>
            )}
            {app.file_size && (
              <span className="px-3 py-1 bg-gray-50 text-gray-700 text-xs font-semibold rounded-full border border-gray-200">
                {(app.file_size / (1024 * 1024)).toFixed(1)} MB
              </span>
            )}
          </div>
        </div>

        {/* Hover Arrow */}
        <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-blue-50 rounded-full group-hover:bg-blue-600 transition-all duration-300 flex-shrink-0">
          <svg
            className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;