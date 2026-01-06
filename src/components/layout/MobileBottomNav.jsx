import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Layers, Search, Download, User } from 'lucide-react';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map tab IDs to actual routes
  const tabRoutes = {
    home: '/',
    category: '/categories',
    search: '/search',
    download: '/download',
    profile: '/profile', // or '/profile' — change based on your route
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'category', label: 'Category', icon: Layers },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'download', label: 'Download', icon: Download },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Determine current active tab based on pathname
  const currentPath = location.pathname;
  const activeTab = Object.entries(tabRoutes).find(([_, route]) => {
    // Exact match for home, partial for others (you can refine this logic)
    if (route === '/') return currentPath === '/';
    return currentPath.startsWith(route);
  })?.[0] || 'home';

  const handleTabClick = (tabId) => {
    const route = tabRoutes[tabId];
    if (route) {
      navigate(route);
    }
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 shadow-lg">
      <div className="flex justify-around items-center max-w-2xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all duration-200"
            >
              <Icon
                size={24}
                className={isActive ? 'text-blue-600' : 'text-gray-600'}
                fill={isActive && item.id === 'home' ? 'currentColor' : 'none'}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;