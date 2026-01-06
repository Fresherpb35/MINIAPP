import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Layers, Search, Download, User } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map tab IDs to routes (keep consistent with MobileBottomNav)
  const tabRoutes = {
    home: '/',
    category: '/categories',
    search: '/search',
    download: '/download',
    profile: '/profile', // or '/profile' — make sure it matches your route
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'category', label: 'Category', icon: Layers },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'download', label: 'Download', icon: Download },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Determine active tab from current pathname
  const currentPath = location.pathname;
  const activeTab = Object.entries(tabRoutes).find(([_, route]) => {
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
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold italic text-gray-900">Mini App Store</h1>
      </div>

      <nav className="flex-1 px-4 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                className={isActive ? 'text-blue-600' : 'text-gray-600'}
              />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Optional: Add footer space or version */}
      <div className="p-6 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">© 2026 Mini App Store</p>
      </div>
    </aside>
  );
};

export default Sidebar;