import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Check, X, Star } from 'lucide-react';
import api from '../config/api';
import { getAppById } from '../services/appsService';

const AppDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Wishlist states
  const [isFavorited, setIsFavorited] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState('');

  // Review form
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Fetch app details
  useEffect(() => {
    const fetchApp = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const res = await getAppById(id);
        if (res.data.success) {
          setApp(res.data.data);
        } else {
          setError('App not found');
        }
      } catch (err) {
        console.error('Fetch app error:', err);
        setError('Failed to load app details');
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [id]);

  // Check if app is already in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      const token = localStorage.getItem('access_token');
      if (!token || !id) return;

      try {
        const res = await api.get(`/api/user/wishlist/check/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setIsFavorited(res.data.data.inWishlist);
        }
      } catch (err) {
        // Silently fail - it's okay if check fails
        console.log('Wishlist check failed (normal if not logged in)');
      }
    };

    checkWishlist();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      setReviewsLoading(true);
      try {
        const res = await api.get(`/api/apps/${id}/reviews`, {
          params: { page: 1, limit: 10 }
        });
        if (res.data.success) {
          setReviews(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id) fetchReviews();
  }, [id]);

  // TOGGLE WISHLIST - THIS IS THE MAIN NEW FUNCTION
  const toggleWishlist = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please sign in to add to wishlist');
      navigate('/signin');
      return;
    }

    setWishlistLoading(true);
    setWishlistMessage('');

    try {
      if (isFavorited) {
        // Remove from wishlist
        const res = await api.delete(`/api/user/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setIsFavorited(false);
          setWishlistMessage('Removed from wishlist');
        }
      } else {
        // Add to wishlist
        const res = await api.post(`/api/user/wishlist/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setIsFavorited(true);
          setWishlistMessage(res.data.message || 'Added to wishlist');
        }
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      if (err.response?.status === 400) {
        setWishlistMessage('Already in wishlist');
      } else {
        setWishlistMessage('Failed to update wishlist');
      }
    } finally {
      setWishlistLoading(false);
      setTimeout(() => setWishlistMessage(''), 3000);
    }
  };

  // Handle Install
  const handleInstall = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please sign in to install apps');
      navigate('/signin');
      return;
    }

    try {
      const res = await api.get(`/api/apps/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        window.open(res.data.data.downloadUrl, '_blank');
      } else {
        alert(res.data.message || 'Failed to get download link');
      }
    } catch (err) {
      alert('Download failed. Please try again.');
    }
  };

  // Handle Submit Review
  const handleSubmitReview = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please sign in to submit a review');
      navigate('/signin');
      return;
    }

    if (rating === 0 || !reviewText.trim()) {
      setSubmitError('Please give a rating and write a review');
      return;
    }

    setSubmittingReview(true);
    setSubmitMessage('');
    setSubmitError('');

    try {
      const res = await api.post(
        `/api/apps/${id}/reviews`,
        {
          rating: Number(rating),
          comment: reviewText.trim(),
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        setSubmitMessage('Review submitted successfully!');
        setRating(0);
        setReviewText('');
        setHoveredRating(0);

        const reviewsRes = await api.get(`/api/apps/${id}/reviews`, {
          params: { page: 1, limit: 10 }
        });
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.data || []);
        }
      }
    } catch (err) {
      console.error('Review submission failed:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
      setTimeout(() => {
        setSubmitMessage('');
        setSubmitError('');
      }, 6000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg">Loading app details...</p>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-red-500">
        <p className="text-lg">{error || 'App not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold">App Details</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Wishlist Message */}
        {wishlistMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 text-center rounded-lg font-medium">
            {wishlistMessage}
          </div>
        )}

        {/* App Header */}
        <div className="bg-white mt-4 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src={app.icon_url || '/placeholder-app-icon.png'}
                alt={app.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{app.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{app.package_name || 'com.example.app'}</p>
              <p className="text-gray-500 text-sm">{app.category}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleInstall}
              className="flex-1 bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition"
            >
              Install
            </button>
            <button
              onClick={toggleWishlist}
              disabled={wishlistLoading}
              className="p-3 rounded-full border border-gray-300 hover:bg-gray-50 transition relative"
            >
              <Heart
                className={`w-6 h-6 transition-all ${
                  isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700'
                }`}
              />
              {wishlistLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Screenshots */}
        {app.screenshots?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Screenshots</h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {app.screenshots.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Screenshot ${i + 1}`}
                  className="w-40 h-72 object-cover rounded-lg shadow-md flex-shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className="bg-white mt-6 rounded-lg p-4 shadow-sm">
          <h3 className="text-xl font-bold mb-3">About This App</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {app.description || 'No description available.'}
          </p>
        </div>

        {/* App Info */}
        <div className="bg-white mt-6 rounded-lg p-4 shadow-sm">
          <h3 className="text-xl font-bold mb-4">App Info</h3>
          <div className="space-y-3">
            <InfoRow label="Version" value={app.version || 'N/A'} />
            <InfoRow label="Category" value={app.category} />
            <InfoRow label="Price" value={app.price === 0 || !app.price ? 'Free' : `₹${app.price}`} />
            <InfoRow label="Size" value={`${(app.file_size / (1024 * 1024)).toFixed(2)} MB`} />
            <InfoRow label="Downloads" value={app.download_count?.toLocaleString() || 'N/A'} />
            <InfoRow label="Rating" value={`★ ${app.rating || 'N/A'}`} />
          </div>
        </div>

        {/* Permissions */}
        {app.permissions?.length > 0 && (
          <div className="bg-white mt-6 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-bold mb-4">Permissions</h3>
            <div className="space-y-3">
              {app.permissions.map((perm, i) => (
                <div key={i} className="flex items-center gap-3">
                  {perm.granted ? (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="text-gray-700">{perm.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Reviews */}
        <div className="bg-white mt-6 rounded-lg p-4 shadow-sm">
          <h3 className="text-xl font-bold mb-4">User Reviews ({reviews.length})</h3>
          {reviewsLoading ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex-shrink-0">
                      {review.user?.avatar_url ? (
                        <img src={review.user.avatar_url} alt={review.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white font-bold text-lg">
                          {review.user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{review.user?.name || 'Anonymous'}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{review.comment}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Write a Review */}
        <div className="bg-white mt-6 rounded-lg p-4 shadow-sm mb-10">
          <h3 className="text-xl font-bold mb-4">Write a Review</h3>

          <div className="flex gap-2 mb-6 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-12 h-12 transition-all ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this app..."
            className="w-full border border-gray-300 rounded-lg p-4 min-h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />

          {submitMessage && (
            <p className="mt-3 text-green-600 font-medium text-center">{submitMessage}</p>
          )}
          {submitError && (
            <p className="mt-3 text-red-600 font-medium text-center">{submitError}</p>
          )}

          <button
            onClick={handleSubmitReview}
            disabled={submittingReview || rating === 0 || !reviewText.trim()}
            className="w-full mt-5 bg-blue-500 text-white py-4 rounded-full font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold text-gray-900">{value}</span>
  </div>
);

export default AppDetailPage;