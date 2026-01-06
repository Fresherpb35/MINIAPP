import React from 'react';

const SocialButton = ({ icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-14 h-14 rounded-full flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-all cursor-pointer"
  >
    {icon}
  </button>
);

export default SocialButton;
