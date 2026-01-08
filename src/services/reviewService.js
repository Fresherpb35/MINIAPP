import api from '../config/api';

/**
 * Get logged-in user's reviews
 * @param {number} page
 * @param {number} limit
 */
export const getUserReviews = async (page = 1, limit = 10) => {
  const res = await api.get(
    `/api/user/reviews?page=${page}&limit=${limit}`
  );
  return res.data;
};
