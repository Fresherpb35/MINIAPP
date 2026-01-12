// src/pages/RatingsReviewsPage.jsx
import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import { Star, Edit3, Trash2, Calendar, CheckCircle, X } from 'lucide-react';
import {
  getUserReviews,
  updateUserReview,
  deleteUserReview,
} from '../services/reviewService';

// Enhanced Star Rating Component
const StarRating = ({ rating, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'
          } transition-all duration-200`}
        />
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header title="My Reviews" showNotification={false} />

        <div className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                My Reviews
              </h1>
            </div>
            <p className="text-gray-600 ml-14">
              {reviews.length > 0 ? `You have ${reviews.length} review${reviews.length !== 1 ? 's' : ''}` : 'Share your thoughts on apps'}
            </p>
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} />
          ) : reviews.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  editingReviewId={editingReviewId}
                  editData={editData}
                  setEditData={setEditData}
                  handleEdit={handleEdit}
                  handleCancelEdit={handleCancelEdit}
                  handleUpdate={handleUpdate}
                  handleDelete={handleDelete}
                  actionLoading={actionLoading}
                  formatDate={formatDate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

// Loading State Component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-32">
    <div className="relative w-20 h-20 mb-6">
      <div className="absolute inset-0 border-4 border-yellow-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    <p className="text-gray-600 text-lg font-medium">Loading your reviews...</p>
    <p className="text-gray-500 text-sm mt-2">Please wait a moment</p>
  </div>
);

// Error State Component
const ErrorState = ({ error }) => (
  <div className="flex flex-col items-center justify-center py-32">
    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
      <X className="w-10 h-10 text-red-500" />
    </div>
    <p className="text-xl text-red-600 font-semibold mb-2">{error}</p>
    <p className="text-gray-500">Please try again later</p>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-32">
    <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mb-6">
      <Star className="w-12 h-12 text-yellow-600" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-2">No reviews yet</h3>
    <p className="text-gray-600 text-center max-w-md mb-6">
      Start reviewing apps you've downloaded to help others make informed decisions
    </p>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" style={{ animationDelay: `${star * 100}ms` }} />
      ))}
    </div>
  </div>
);

// Review Card Component
const ReviewCard = ({
  review,
  editingReviewId,
  editData,
  setEditData,
  handleEdit,
  handleCancelEdit,
  handleUpdate,
  handleDelete,
  actionLoading,
  formatDate,
}) => {
  const isEditing = editingReviewId === review.id;

  return (
    <div className="group bg-white rounded-3xl border-2 border-gray-200 overflow-hidden hover:border-yellow-400 hover:shadow-2xl transition-all duration-300">
      {/* App Header */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          {review.apps?.icon_url && (
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white flex-shrink-0">
              <img
                src={review.apps.icon_url}
                alt={review.apps.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg sm:text-xl truncate">
              {review.apps?.name || 'Unknown App'}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
              <Calendar className="w-4 h-4" />
              <span>
                {review.updated_at && review.updated_at !== review.created_at
                  ? `Edited • ${formatDate(review.updated_at)}`
                  : `Reviewed • ${formatDate(review.created_at)}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {isEditing ? (
          <EditMode
            editData={editData}
            setEditData={setEditData}
            handleUpdate={() => handleUpdate(review.id)}
            handleCancelEdit={handleCancelEdit}
            actionLoading={actionLoading}
          />
        ) : (
          <ViewMode
            review={review}
            handleEdit={() => handleEdit(review)}
            handleDelete={() => handleDelete(review.id)}
          />
        )}
      </div>
    </div>
  );
};

// Edit Mode Component
const EditMode = ({ editData, setEditData, handleUpdate, handleCancelEdit, actionLoading }) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Star Rating Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setEditData({ ...editData, rating: star })}
              className="focus:outline-none transform transition-transform hover:scale-110"
            >
              <Star
                className={`w-10 h-10 sm:w-12 sm:h-12 transition-all ${
                  star <= editData.rating
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300 fill-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">{editData.rating}/5 stars</p>
      </div>

      {/* Comment Textarea */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
        <textarea
          value={editData.comment}
          onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
          rows={5}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all resize-none text-gray-800"
          placeholder="Share your experience with this app..."
        />
        <p className="text-xs text-gray-500 mt-2">{editData.comment.length} characters</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleUpdate}
          disabled={actionLoading || !editData.rating || !editData.comment}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          {actionLoading ? 'Updating...' : 'Save Changes'}
        </button>
        <button
          onClick={handleCancelEdit}
          className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-5 h-5" />
          Cancel
        </button>
      </div>
    </div>
  );
};

// View Mode Component
const ViewMode = ({ review, handleEdit, handleDelete }) => {
  return (
    <div className="space-y-4">
      {/* Rating Display */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
        <StarRating rating={review.rating} size="lg" />
        <span className="text-2xl font-bold text-gray-900">{review.rating}/5</span>
      </div>

      {/* Comment */}
      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {review.comment}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={handleEdit}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 font-semibold rounded-xl hover:from-amber-200 hover:to-yellow-200 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 border border-amber-200"
        >
          <Edit3 className="w-5 h-5" />
          Edit Review
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-50 to-rose-50 text-red-700 font-semibold rounded-xl hover:from-red-100 hover:to-rose-100 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 border border-red-200"
        >
          <Trash2 className="w-5 h-5" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default RatingsReviewsPage;