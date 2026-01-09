// services/appsService.js
import api from '../config/api';

/**
 * Search apps (simple name-based search)
 */
export const searchApps = async ({
  q,
  sortBy = 'downloads', // ✅ FIX: no relevance
  page = 1,
  limit = 10,
} = {}) => {
  const params = {
    sortBy,
    page,
    limit,
  };

  // only send q if it exists
  if (q && q.trim()) {
    params.q = q.trim();
  }

  return api.get('/api/apps/search', { params });
};


/**
 * Get all categories
 */
export const getCategories = async () => {
  return api.get('/api/apps/categories');
};

/**
 * Get apps by category
 */
export const getAppsByCategory = async (category, page = 1, limit = 20) => {
  return searchApps({ category, page, limit });
};

/**
 * Get featured apps (e.g., newest or editor's choice)
 */
export const getFeaturedApps = async (limit = 10) => {
  return searchApps({ sortBy: 'newest', limit });
};

/**
 * Get top/popular apps (by downloads)
 */
export const getTopApps = async (limit = 10) => {
  return searchApps({ sortBy: 'downloads', limit });
};

/**
 * Get single app by ID
 */
export const getAppById = async (id) => {
  return api.get(`/api/apps/${id}`);
};

/**
 * Get signed download URL (Private - requires auth)
 */
export const downloadApp = async (id) => {
  return api.get(`/api/apps/${id}/download`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
  });
};

/**
 * Get app reviews (Public)
 */
export const getAppReviews = async (id, page = 1, limit = 10) => {
  return api.get(`/api/apps/${id}/reviews`, {
    params: { page, limit },
  });
};

/**
 * Submit a review (Private - requires auth)
 */
export const submitReview = async (id, { rating, comment }) => {
  return api.post(
    `/api/apps/${id}/reviews`,
    { rating, comment },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    }
  );
};