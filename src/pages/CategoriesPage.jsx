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
        if (res.data?.success) {
          setCategories(res.data.data || []);
        } else {
          setError('Failed to load categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Unable to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Categories" showNotification={true} />

        <div className="lg:ml-64">
          <main className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10 pb-24 lg:pb-12 max-w-screen-2xl mx-auto">
            {/* Header Section - more prominent on larger screens */}
            <div className="mb-10 lg:mb-12">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                Explore Categories
              </h1>
              <p className="mt-3 text-lg sm:text-xl text-gray-600 max-w-3xl">
                Find the perfect apps across every category you love
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="relative">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 border-4 border-blue-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-6 text-lg lg:text-xl text-gray-600 font-medium">
                  Discovering categories...
                </p>
              </div>
            )}

            {/* Error State */}
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

            {/* Empty State */}
            {!loading && !error && categories.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8">
                  <span className="text-5xl lg:text-6xl">📂</span>
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                  No Categories Available
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 max-w-xl">
                  We're constantly adding new categories. Please check back soon!
                </p>
              </div>
            )}

            {/* Categories Grid - optimized for large screens */}
            {!loading && !error && categories.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 gap-5 sm:gap-6 lg:gap-8">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    icon={category.icon || '📁'}
                    title={category.name}
                    appCount={category.appCount || category.apps_count || 0}
                    onClick={() => handleCategoryClick(category.name)}
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