import React from 'react';

const HeroCard = ({ title, subtitle, buttonText, onButtonClick }) => {
  return (
    <div className="relative w-full h-64 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 p-8">
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
        <p className="text-white/90 text-lg mb-6">{subtitle}</p>
        <button
          onClick={onButtonClick}
          className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
        >
          {buttonText}
        </button>
      </div>
      
      {/* Phone illustration */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2">
        <div className="w-32 h-48 bg-blue-700/30 rounded-3xl border-4 border-blue-600/50 flex items-center justify-center">
          <div className="w-16 h-1 bg-blue-600/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;