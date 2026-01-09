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

const RatingsReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editData, setEditData] = useState({ rating: '', comment: '' });
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await getUserReviews(1, 50); // Fetch first 50 reviews
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

  // Start editing a review
  const handleEdit = (review) => {
    setEditingReviewId(review.id);
    setEditData({ rating: review.rating, comment: review.comment });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditData({ rating: '', comment: '' });
  };

  // Submit updated review
  const handleUpdate = async (reviewId) => {
    if (!editData.rating || !editData.comment) return;
    setActionLoading(true);
    try {
      const res = await updateUserReview(reviewId, editData.rating, editData.comment);
      if (res.success) {
        // Update review in state
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

  // Delete a review
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

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-white">
        <Header title="My Reviews" showNotification={false} />

        <div className="lg:ml-64 px-6 py-6 pb-24 lg:pb-6 max-w-4xl mx-auto">
          {loading ? (
            <p className="text-center text-gray-500">Loading reviews...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : reviews.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No reviews yet</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border rounded p-4 mb-4">
                <div className="flex items-center mb-2">
                  {review.apps?.icon_url && (
                    <img
                      src={review.apps.icon_url}
                      alt={review.apps.name}
                      className="w-10 h-10 rounded mr-3"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900">{review.apps?.name || 'App'}</h3>
                </div>

                {editingReviewId === review.id ? (
                  <div>
                    <div className="mb-2">
                      <label className="block text-gray-700 mb-1">Rating (1-5)</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={editData.rating}
                        onChange={(e) => setEditData({ ...editData, rating: e.target.value })}
                        className="border rounded w-20 px-2 py-1"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700 mb-1">Comment</label>
                      <textarea
                        value={editData.comment}
                        onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                        className="border rounded w-full px-2 py-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(review.id)}
                        disabled={actionLoading}
                        className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                      >
                        {actionLoading ? 'Updating...' : 'Update'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 mb-1">Rating: {review.rating} ★</p>
                    <p className="text-gray-600 mb-1">{review.comment}</p>
                    <p className="text-sm text-gray-400 mb-2">
                      Reviewed on: {new Date(review.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default RatingsReviewsPage;
