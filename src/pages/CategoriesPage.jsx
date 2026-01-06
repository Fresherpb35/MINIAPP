// ============================================
// src/pages/CategoriesPage.jsx (Updated)
// ============================================
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import CategoryCard from '../components/ui/CategoryCard';

const CategoriesPage = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 1, icon: '🎬', title: 'Produc...', fullTitle: 'Productivity', appCount: 4 },
    { id: 2, icon: '🎓', title: 'Educati...', fullTitle: 'Education', appCount: 1 },
    { id: 3, icon: '🎬', title: 'Social', fullTitle: 'Social', appCount: 1 },
    { id: 4, icon: '🎬', title: 'Business', fullTitle: 'Business', appCount: 0 },
    { id: 5, icon: '🎬', title: 'Enterta...', fullTitle: 'Entertainment', appCount: 1 },
    { id: 6, icon: '❤️', title: 'Health', fullTitle: 'Health', appCount: 1 },
    { id: 7, icon: '🎬', title: 'Utilities', fullTitle: 'Utilities', appCount: 0 },
    { id: 8, icon: '🎮', title: 'Games', fullTitle: 'Games', appCount: 0 },
    { id: 9, icon: '🎬', title: 'New ca...', fullTitle: 'New Category', appCount: 0 },
  ];

  const handleCategoryClick = (categoryFullTitle) => {
    navigate(`/category/${categoryFullTitle}`);
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Categories" showNotification={false} />
        
        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 lg:pb-6 max-w-7xl">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900 mb-6">Categories</h1>
            
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  icon={category.icon}
                  title={category.title}
                  appCount={category.appCount}
                  onClick={() => handleCategoryClick(category.fullTitle)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default CategoriesPage;