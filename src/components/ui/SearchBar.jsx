import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = "Search app, games, and more...", value, onChange }) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white"
      />
    </div>
  );
};

export default SearchBar;