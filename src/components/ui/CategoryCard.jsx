// src/components/ui/CategoryCard.jsx
import React from 'react';

const CategoryCard = ({ icon, title, appCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-gray-200/60
                 overflow-hidden hover:shadow-2xl hover:border-blue-300
                 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02]
                 h-full flex flex-col justify-between p-5 sm:p-6 lg:p-8
                 cursor-pointer active:scale-95"
    > 
      {/* Animated gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-28 h-28 lg:w-36 lg:h-36 bg-gradient-to-br from-blue-100/60 to-indigo-100/60 rounded-full blur-2xl opacity-50 group-hover:opacity-70 group-hover:scale-125 transition-all duration-500"></div>
      <div className="absolute -bottom-6 -left-6 w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-tr from-purple-100/40 to-pink-100/40 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>

      {/* Icon container */}
      <div className="relative z-10 mb-4 sm:mb-5 lg:mb-6">
        <div className="relative">
          {/* Icon glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl lg:rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
          
          {/* Main icon */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl lg:rounded-3xl flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl shadow-lg group-hover:shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
            <span className="filter drop-shadow-lg">{icon}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-2 sm:space-y-2.5 lg:space-y-3">
        {/* Title */}
        <h3 className="font-bold text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-900 group-hover:text-blue-700 transition-colors duration-300 leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {title}
        </h3>
        
        {/* App count badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 bg-gradient-to-r from-blue-50 to-indigo-50 group-hover:from-blue-600 group-hover:to-indigo-600 rounded-full transition-all duration-300 shadow-sm group-hover:shadow-md">
            <svg className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-blue-600 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span className="text-xs sm:text-sm lg:text-base font-bold text-blue-700 group-hover:text-white transition-colors duration-300">
              {appCount.toLocaleString()}
            </span>
            <span className="text-xs sm:text-sm lg:text-base font-medium text-blue-600 group-hover:text-blue-100 transition-colors duration-300">
              {appCount === 1 ? 'app' : 'apps'}
            </span>
          </div>
        </div>
      </div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </button>
  );
};

export default CategoryCard;