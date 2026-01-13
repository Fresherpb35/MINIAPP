// src/components/ui/CategoryCard.jsx
import React from 'react';

const CategoryCard = ({ icon, title, appCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-2xl lg:rounded-3xl shadow-md border border-gray-100 
                 overflow-hidden hover:shadow-2xl hover:border-blue-200 
                 transition-all duration-300 hover:-translate-y-1 
                 h-full flex flex-col justify-between p-6 lg:p-8
                 cursor-pointer"   // ← Added cursor-pointer here
    > 
      {/* Icon background - subtle decorative element */}
      <div className="absolute -top-6 -right-6 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full opacity-40 group-hover:opacity-60 transition-opacity"></div>

      <div className="relative z-10 mb-6 lg:mb-8">
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-3xl lg:text-4xl shadow-inner group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="font-bold text-xl lg:text-2xl text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
          {title}
        </h3>
        <p className="text-base lg:text-lg text-gray-600 font-medium">
          {appCount.toLocaleString()} {appCount === 1 ? 'app' : 'apps'}
        </p>
      </div>
    </button>
  );
};

export default CategoryCard;