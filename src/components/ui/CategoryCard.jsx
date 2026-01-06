import React from 'react';

const CategoryCard = ({ icon, title, appCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-900 text-base mb-1 truncate w-full text-center">
        {title}
      </h3>
      <p className="text-gray-400 text-sm">{appCount} Apps</p>
    </button>
  );
};

export default CategoryCard;