import React from 'react';
import { Star } from 'lucide-react';

const SearchResultCard = ({ icon, name, description, rating, downloads, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
        {typeof icon === 'string' ? (
          <img src={icon} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0 text-left">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">{name}</h3>
        <p className="text-gray-500 text-sm truncate">{description}</p>
      </div>
      
      <div className="flex-shrink-0 text-right">
        <div className="flex items-center gap-1 mb-1">
          <Star size={18} className="text-yellow-400" fill="currentColor" />
          <span className="font-bold text-gray-900 text-lg">{rating}</span>
        </div>
        <p className="text-gray-500 text-xs">{downloads} downloads</p>
      </div>
    </button>
  );
};

export default SearchResultCard;