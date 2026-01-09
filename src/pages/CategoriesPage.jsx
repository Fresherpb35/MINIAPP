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

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getCategories();
        if (res.data.success) {
          // Assuming backend returns: { success: true, data: [{ id, name, icon, appCount }, ...] }
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
          <main className="px-6 py-6 pb-24 lg:pb-6 max-w-7xl mx-auto">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900 mb-8">
              Categories
            </h1>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading categories...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-20">
                <p className="text-red-500 text-lg font-medium">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && categories.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No categories available yet.</p>
              </div>
            )}

            {!loading && !error && categories.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-5">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    icon={category.icon || 'Folder'} // fallback emoji if no icon
                    title={category.name.length > 12 ? category.name.slice(0, 10) + '...' : category.name}
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