// src/pages/CategoryDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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

  return (
    <>
      <Sidebar />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Mobile Header - enhanced with shadow and better padding */}
        <header className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md px-5 py-4 flex items-center gap-4 border-b border-gray-200 shadow-sm">
          <button
            onClick={handleBack}
            className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={26} className="text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 truncate flex-1">
            {displayTitle}
          </h1>
        </header>

        {/* Desktop Back Button - cleaner, more modern */}
        <div className="hidden lg:flex items-center px-8 py-5 bg-white border-b border-gray-200 shadow-sm">
          <button
            onClick={handleBack}
            className="flex items-center gap-2.5 px-5 py-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 text-gray-700 hover:text-gray-900 font-medium"
          >
            <ArrowLeft size={20} />
            <span>Back to Categories</span>
          </button>
        </div>

        <div className="lg:ml-64">
          <main className="px-5 sm:px-8 lg:px-10 py-8 lg:py-10 pb-28 lg:pb-10 max-w-6xl mx-auto">
            {/* Category Header - more elegant, larger icon, better typography */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl flex items-center justify-center text-5xl shadow-md border border-gray-200">
                {displayIcon}
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
                  {displayTitle}
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mt-2 font-medium">
                  {loading ? (
                    <span className="inline-flex items-center">
                      <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></span>
                      Loading...
                    </span>
                  ) : (
                    `${displayCount} ${displayCount === 1 ? 'app' : 'apps'}`
                  )}
                </p>
              </div>
            </div>

            {/* Loading - centered, larger spinner */}
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-lg text-gray-600 font-medium">
                  Loading apps...
                </p>
              </div>
            )}

            {/* Error - nicer card style */}
            {error && !loading && (
              <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">⚠️</span>
                </div>
                <p className="text-xl font-semibold text-gray-800 mb-3">
                  {error}
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-8 py-3 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition shadow-md"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No apps - cleaner empty state */}
            {!loading && !error && apps.length === 0 && (
              <div className="max-w-lg mx-auto bg-white rounded-2xl shadow border border-gray-200 p-10 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
                  📂
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  No apps found
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  This category might be empty right now or still being populated.<br />
                  Check back later!
                </p>
              </div>
            )}

            {/* Apps list - modern card design with better spacing */}
            {!loading && !error && apps.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map((app) => (
                  <div
                    key={app.id || app.appId || app.packageName || Math.random()}
                    className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-400 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Icon + Info Row */}
                    <div className="flex items-center gap-5 p-6">
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
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
                          <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-blue-50 to-purple-50">
                            📱
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xl text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                          {app.name || app.title || 'Unnamed App'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1.5 line-clamp-1">
                          {app.category || displayTitle}
                        </p>
                        {app.description && (
                          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                            {app.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Install Button - full width, more prominent */}
                    <div className="px-6 pb-6">
                      <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg active:scale-98">
                        Install
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