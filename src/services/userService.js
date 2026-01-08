// src/services/userService.js
import api from '../config/api';

// Get user's wishlist
export const getUserWishlist = async (page = 1, limit = 20) => {
  const { data } = await api.get(`/api/user/wishlist`, {  
    params: { page, limit },
  });
  return data;
};

// Remove app from wishlist
export const removeAppFromWishlist = async (appId) => {
  const { data } = await api.delete(`/api/user/wishlist/${appId}`); 
  return data;
};


// Optional: add more user endpoints later
export const getUserProfile = async () => {
  const { data } = await api.get('/user/profile');
  return data;
};

export const getUserDownloads = async () => {
  const { data } = await api.get('/user/downloads');
  return data;
};
