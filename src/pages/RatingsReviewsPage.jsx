// src/pages/RatingsReviewsPage.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import {
  getUserReviews,
  updateUserReview,
  deleteUserReview,
} from '../services/reviewService';

// Simple Star component
const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const RatingsReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editData, setEditData] = useState({ rating: '', comment: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await getUserReviews(1, 50);
      if (res.success) {
        setReviews(res.data);
      } else {
        setError(res.message || 'Failed to load reviews');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReviewId(review.id);
    setEditData({ rating: review.rating, comment: review.comment });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditData({ rating: '', comment: '' });
  };

  const handleUpdate = async (reviewId) => {
    if (!editData.rating || !editData.comment) return;
    setActionLoading(true);
    try {
      const res = await updateUserReview(reviewId, editData.rating, editData.comment);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, ...editData, updated_at: new Date().toISOString() } : r))
        );
        handleCancelEdit();
      } else {
        alert(res.message || 'Failed to update review');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating review');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setActionLoading(true);
    try {
      const res = await deleteUserReview(reviewId);
      if (res.success) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      } else {
        alert(res.message || 'Failed to delete review');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting review');
    } finally {
      setActionLoading(false);
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="My Reviews" showNotification={false} />

        <div className="lg:ml-64 px-4 sm:px-6 py-6 pb-24 lg:pb-6 max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-500">Loading your reviews...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
              {error}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No reviews yet</h3>
              <p className="text-gray-500">Your reviews for apps will appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-5">
                    {/* App Info */}
                    <div className="flex items-center gap-3 mb-4">
                      {review.apps?.icon_url && (
                        <img
                          src={review.apps.icon_url}
                          alt={review.apps.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {review.apps?.name || 'Unknown App'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {review.updated_at && review.updated_at !== review.created_at
                            ? `Edited • ${formatDate(review.updated_at)}`
                            : `Reviewed • ${formatDate(review.created_at)}`}
                        </p>
                      </div>
                    </div>

                    {editingReviewId === review.id ? (
                      /* Edit Mode */
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Rating
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={editData.rating}
                            onChange={(e) => setEditData({ ...editData, rating: e.target.value })}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Your Review
                          </label>
                          <textarea
                            value={editData.comment}
                            onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Share your experience..."
                          />
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleUpdate(review.id)}
                            disabled={actionLoading}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            {actionLoading ? 'Updating...' : 'Save Changes'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} />
                          <span className="text-lg font-medium text-gray-800">{review.rating}/5</span>
                        </div>

                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {review.comment}
                        </p>

                        <div className="flex gap-3 pt-3">
                          <button
                            onClick={() => handleEdit(review)}
                            className="px-4 py-1.5 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors text-sm font-medium"
                          >
                            Edit Review
                          </button>
                          <button
                            onClick={() => handleDelete(review.id)}
                            className="px-4 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default RatingsReviewsPage;