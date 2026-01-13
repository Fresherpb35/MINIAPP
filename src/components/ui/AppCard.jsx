// src/components/ui/AppCard.jsx
import React from 'react';

const AppCard = ({ icon, name, category, description, onInstall }) => {
  return (
    <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group cursor-pointer">
      <div className="flex-shrink-0 w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-3xl shadow-sm overflow-hidden">
        {icon ? (
          <img 
            src={icon} 
            alt={name} 
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/64?text=App'; }}
          />
        ) : (
          '📱'
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
          {name || 'Unnamed App'}
        </h4>
        {category && (
          <p className="text-sm text-gray-500 mt-0.5">{category}</p>
        )}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{description}</p>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onInstall?.();
        }}
        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"
      >
        Install
      </button>
    </div>
  );
};

export default AppCard;