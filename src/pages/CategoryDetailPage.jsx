
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';

const CategoryDetailPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with real data from API
  const categoryData = {
    'Productivity': {
      icon: '🎬',
      title: 'Productivity',
      appCount: 4,
      apps: [
        { id: 1, icon: '🖼️', name: 'MiniAppStore', category: 'Productivity' },
        { id: 2, icon: '📱', name: 'miniapp', category: 'Productivity' },
        { id: 3, icon: '📱', name: 'MiniAPstore', category: 'Productivity' },
        { id: 4, icon: '📊', name: 'TaskMaster Pro', category: 'Productivity' },
      ]
    },
    // Add other categories as needed
  };

  const category = categoryData[categoryName] || { title: categoryName, appCount: 0, apps: [] };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-white px-4 py-4 flex items-center gap-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} className="text-gray-900" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Category</h1>
        </header>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        </div>
        
        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 lg:pb-6 max-w-4xl">
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl">
                {category.icon || '🎬'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                <p className="text-gray-500">{category.appCount} apps available</p>
              </div>
            </div>

            {/* Apps Section */}
            <section>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Apps</h3>
              
              {category.apps.length > 0 ? (
                <div className="space-y-3">
                  {category.apps.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-all"
                    >
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                        {app.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">{app.name}</h4>
                        <p className="text-gray-500 text-sm">{app.category}</p>
                      </div>
                      
                      <button className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap">
                        Install
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No apps available in this category</p>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default CategoryDetailPage;
