// src/services/reviewService.js
import api from '../config/api';

export const getUserReviews = async (page = 1, limit = 10) => {
  try {
    const res = await api.get(`/api/user/reviews?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const updateUserReview = async (reviewId, rating, comment) => {
  try {
    const res = await api.put(`/api/user/reviews/${reviewId}`, { rating, comment });
    return res.data;
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

export const deleteUserReview = async (reviewId) => {
  try {
    const res = await api.delete(`/api/user/reviews/${reviewId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};
