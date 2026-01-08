import React from 'react';

const AppCard = ({ icon, name, category, size, onInstall }) => {
  const isUrl = typeof icon === 'string' && icon.startsWith('http');

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-all">
      
      <div className="flex-shrink-0 w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
        {isUrl ? (
          <img src={icon} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">{icon}</span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-lg mb-1">{name}</h3>
        <p className="text-gray-500 text-sm">
          {category} • {size}
        </p>
      </div>
      
      <button
        onClick={onInstall}
        className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap"
      >
        Install
      </button>
    </div>
  );
};

export default AppCard;
