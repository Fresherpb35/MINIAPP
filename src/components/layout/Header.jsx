import React from 'react';
import { Bell } from 'lucide-react';

const Header = ({ onNotificationClick }) => {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white px-6 py-4 flex items-center justify-between border-b border-gray-200">
      <h1 className="text-2xl font-bold italic text-gray-900">Mini App Store</h1>
      <button
        onClick={onNotificationClick}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
      >
        <Bell size={24} className="text-gray-900" />
      </button>
    </header>
  );
};

export default Header;