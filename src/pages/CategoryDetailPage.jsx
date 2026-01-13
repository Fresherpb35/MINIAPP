// src/pages/CategoryDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Star, TrendingUp } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import { getAppsByCategory } from '../services/appsService';

const CategoryDetailPage = () => {
  const { categoryName: encodedCategoryName } = useParams();
  const navigate = useNavigate();

  const categoryName = decodeURIComponent(encodedCategoryName || '');

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryInfo, setCategoryInfo] = useState(null);

  useEffect(() => {
    if (!categoryName) {
      setError('Invalid category');
      setLoading(false);
      return;
    }

    const fetchCategoryApps = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await getAppsByCategory(categoryName);

        const data = res.data || {};

        if (!data.success) {
          throw new Error(data.message || 'API did not return success');
        }

        let appsList = [];
        if (Array.isArray(data.data)) {
          appsList = data.data;
        } else if (Array.isArray(data.apps)) {
          appsList = data.apps;
        } else if (Array.isArray(data.results)) {
          appsList = data.results;
        }

        const catInfo = {
          name: data.category?.name || data.name || categoryName,
          icon: data.category?.icon || data.icon || '📁',
          description: data.category?.description || data.description || '',
          appCount: data.count ?? appsList.length ?? 0,
        };

        setApps(appsList);
        setCategoryInfo(catInfo);
      } catch (err) {
        console.error('Error fetching category apps:', err);
        setError(err.message || 'Failed to load apps for this category');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryApps();
  }, [categoryName]);

  const handleBack = () => navigate(-1);

  const displayIcon = categoryInfo?.icon || '📁';
  const displayTitle = categoryInfo?.name || categoryName || 'Category';
  const displayCount = categoryInfo?.appCount ?? apps.length;
  const displayDescription = categoryInfo?.description;

  return (
    <>
      <Sidebar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/30">
        {/* Mobile Header - Glass morphism effect */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/90 backdrop-blur-xl px-4 py-3.5 flex items-center gap-3 border-b border-gray-200/50 shadow-lg">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
            aria-label="Go back"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">{displayIcon}</span>
            <h1 className="text-lg font-bold text-gray-900 truncate">
              {displayTitle}
            </h1>
          </div>
        </header>

        {/* Desktop Back Button - Floating style */}
        <div className="hidden lg:flex items-center px-6 lg:px-8 py-4 lg:py-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200 text-gray-700 hover:text-gray-900 font-medium shadow-md hover:shadow-lg border border-gray-200"
          >
            <ArrowLeft size={18} />
            <span>Back to Categories</span>
          </button>
        </div>

        <div className="lg:ml-64">
          <main className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 pb-24 lg:pb-12 max-w-7xl mx-auto">
            {/* Category Header - Premium design with gradient card */}
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-3xl shadow-xl border border-gray-200/50 p-6 sm:p-8 lg:p-10 mb-8 lg:mb-10 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
                {/* Icon with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl blur-2xl opacity-20"></div>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-white to-gray-50 rounded-3xl flex items-center justify-center text-4xl sm:text-5xl lg:text-6xl shadow-2xl border-2 border-white">
                    {displayIcon}
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
                    {displayTitle}
                  </h1>
                  
                  {displayDescription && (
                    <p className="text-base sm:text-lg text-gray-600 mb-3 max-w-3xl">
                      {displayDescription}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-center sm:justify-start gap-4 flex-wrap">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold shadow-lg">
                      <TrendingUp size={18} />
                      <span>
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Loading...
                          </span>
                        ) : (
                          `${displayCount} ${displayCount === 1 ? 'App' : 'Apps'}`
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading - Modern spinner */}
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-lg text-gray-600 font-semibold">
                  Discovering amazing apps...
                </p>
              </div>
            )}

            {/* Error - Premium error card */}
            {error && !loading && (
              <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl p-8 text-center border border-red-100">
                <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-4xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h3>
                <p className="text-lg text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No apps - Beautiful empty state */}
            {!loading && !error && apps.length === 0 && (
              <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-xl border border-gray-200 p-10 text-center">
                <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 text-6xl shadow-lg">
                  📂
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  No Apps Yet
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  This category is being prepared for you.<br />
                  Check back soon for amazing apps!
                </p>
              </div>
            )}

            {/* Apps Grid - Premium card design */}
            {!loading && !error && apps.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {apps.map((app) => (
                  <div
                    key={app.id || app.appId || app.packageName || Math.random()}
                    className="group relative bg-white rounded-2xl lg:rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all duration-300 hover:-translate-y-2"
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-all duration-300 pointer-events-none"></div>

                    {/* Content */}
                    <div className="relative p-5 sm:p-6">
                      {/* App Icon & Info */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-md border border-gray-200 group-hover:scale-105 transition-transform duration-300">
                          {app.icon || app.icon_url ? (
                            <img
                              src={app.icon || app.icon_url}
                              alt={app.name || 'App icon'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/80?text=App';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-blue-100 to-purple-100">
                              📱
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2 mb-1">
                            {app.name || app.title || 'Unnamed App'}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500 font-medium">
                            {app.category || displayTitle}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      {app.description && (
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-4">
                          {app.description}
                        </p>
                      )}

                      {/* Stats row */}
                      <div className="flex items-center gap-3 mb-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-1 text-amber-600">
                          <Star size={14} fill="currentColor" />
                          <span className="font-semibold">
                            {app.rating || '4.5'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Download size={14} />
                          <span className="font-medium">
                            {app.downloads || '10K+'}
                          </span>
                        </div>
                      </div>

                      {/* Install Button - Gradient with icon */}
                      <button className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2">
                        <Download size={18} />
                        <span>Install Now</span>
                      </button>
                    </div>
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

export default CategoryDetailPage;