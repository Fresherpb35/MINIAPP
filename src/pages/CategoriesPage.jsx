// src/pages/CategoriesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import CategoryCard from '../components/ui/CategoryCard';
import { getCategories } from '../services/appsService';

const CategoriesPage = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await getCategories();

        console.log('[CATEGORIES-API] Full response:', res);
        console.log('[CATEGORIES-API] Payload:', res.data);

        const apiData = res.data || {};

        if (!apiData.success) {
          throw new Error('API did not return success: true');
        }

        const categoryList = apiData.data || apiData.categories || apiData.results || [];

        console.log('[CATEGORIES] Received count:', categoryList.length);

        // Debug summary – shows all categories clearly
        console.groupCollapsed('[CATEGORIES] Loaded categories');
        const summary = categoryList.map((cat, i) => {
          const count =
            cat.appCount ??
            cat.apps_count ??
            cat.app_count ??
            cat.count ??
            cat.appsCount ??
            cat.totalApps ??
            (Array.isArray(cat.apps) ? cat.apps.length : 0) ??
            0;

          return {
            '#': i + 1,
            name: cat.name || cat.title || 'Unnamed',
            id: cat.id || cat._id || '-',
            slug: cat.slug || '-',
            apps: count,
            icon: cat.icon || cat.icon_url || '-',
          };
        });
        console.table(summary);
        console.groupEnd();

        // Prepare data for rendering
        const normalizedCategories = categoryList.map((cat) => {
          const appCount =
            cat.appCount ??
            cat.apps_count ??
            cat.app_count ??
            cat.count ??
            cat.appsCount ??
            cat.totalApps ??
            (Array.isArray(cat.apps) ? cat.apps.length : 0) ??
            0;

          return {
            ...cat,
            displayName: cat.name || cat.title || 'Unnamed',
            displayIcon: cat.icon || cat.icon_url || cat.emoji || '📁',
            normalizedAppCount: appCount,
          };
        });

        setCategories(normalizedCategories);
      } catch (err) {
        console.error('[CATEGORIES] Error:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (name) => {
    if (!name) return;
    const path = `/category/${encodeURIComponent(name)}`;
    console.log('[NAV]', path);
    navigate(path);
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Categories" showNotification={true} />

        <div className="lg:ml-64">
          <main className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10 pb-24 lg:pb-12 max-w-screen-2xl mx-auto">
            <div className="mb-10 lg:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                Explore Categories
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-gray-600 max-w-3xl">
                Discover amazing apps across every category
              </p>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="relative">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 border-4 border-blue-200 rounded-full" />
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="mt-6 text-lg lg:text-xl text-gray-600 font-medium">
                  Loading categories...
                </p>
              </div>
            )}

            {error && !loading && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl lg:text-5xl">⚠️</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">
                  {error}
                </h2>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 px-8 py-3 lg:px-10 lg:py-4 bg-red-600 text-white text-base lg:text-lg font-medium rounded-xl hover:bg-red-700 transition shadow-md"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && categories.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
                  <span className="text-5xl lg:text-6xl">📂</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                  No Categories Found
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 max-w-xl">
                  No categories are available at the moment.<br />
                  Please check back later or contact support.
                </p>
              </div>
            )}

            {!loading && !error && categories.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-5 sm:gap-6 lg:gap-8">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id || category.displayName}
                    icon={category.displayIcon}
                    title={category.displayName}
                    appCount={category.normalizedAppCount}
                    onClick={() => handleCategoryClick(category.displayName)}
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

export default CategoriesPage;