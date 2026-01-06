import React from 'react';
import { ChevronRight } from 'lucide-react';

const SettingItem = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 px-6 py-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100"
    >
      <Icon size={24} className="text-gray-600 flex-shrink-0" />
      <span className="flex-1 text-left text-gray-900 font-medium text-base">{label}</span>
      <ChevronRight size={20} className="text-gray-400 flex-shrink-0" />
    </button>
  );
};

export default SettingItem;