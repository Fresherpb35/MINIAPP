import React from 'react';

const Button = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full py-4 rounded-2xl font-medium text-base transition-all cursor-pointer bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
    >
      {children}
    </button>
  );
};

export default Button;