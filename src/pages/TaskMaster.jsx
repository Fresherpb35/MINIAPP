// src/pages/AppDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Check, X, Star, Download, Package, Shield, Users, Calendar, Sparkles, Trash2 } from 'lucide-react';
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
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [isInstalled, setIsInstalled] = useState(() => {
    const installedApps = JSON.parse(localStorage.getItem('installedApps') || '[]');
    return installedApps.includes(id);
  });

  const [isFavorited, setIsFavorited] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistMessage, setWishlistMessage] = useState('');

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

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
        console.log('Wishlist check failed (normal if not logged in)');
      }
    };

    checkWishlist();
  }, [id]);

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
        const res = await api.delete(`/api/user/wishlist/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setIsFavorited(false);
          setWishlistMessage('Removed from wishlist');
        }
      } else {
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

  const handleInstall = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please sign in to install apps');
      navigate('/signin');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const res = await api.get(`/api/apps/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setDownloadProgress(percent);
          }
        },
      });

      if (res.status === 200) {
        const blob = new Blob([res.data], { type: 'application/vnd.android.package-archive' });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${app.name.replace(/\s+/g, '_')}.apk`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        setDownloadProgress(100);
        
        const installedApps = JSON.parse(localStorage.getItem('installedApps') || '[]');
        if (!installedApps.includes(id)) {
          installedApps.push(id);
          localStorage.setItem('installedApps', JSON.stringify(installedApps));
        }
        
        setIsInstalled(true);
        alert('Download completed!');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert(err.response?.data?.message || 'Failed to start download. Please try again.');
    } finally {
      setIsDownloading(false);
      setTimeout(() => setDownloadProgress(0), 2000);
    }
  };

  const handleUninstall = () => {
    if (window.confirm('Are you sure you want to uninstall this app?')) {
      const installedApps = JSON.parse(localStorage.getItem('installedApps') || '[]');
      const updatedApps = installedApps.filter(appId => appId !== id);
      localStorage.setItem('installedApps', JSON.stringify(updatedApps));
      
      setIsInstalled(false);
      alert('App uninstalled successfully');
    }
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please sign in to submit a review');
      navigate('/signin');
      return;
    }

    if (rating === 0 || !reviewText.trim()) {
      setSubmitError('Please give a rating and write a review');
      setTimeout(() => setSubmitError(''), 3000);
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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        setSubmitMessage('✓ Review submitted successfully!');
        setRating(0);
        setReviewText('');
        setHoveredRating(0);

        const reviewsRes = await api.get(`/api/apps/${id}/reviews`, {
          params: { page: 1, limit: 10 },
        });
        if (reviewsRes.data.success) {
          setReviews(reviewsRes.data.data || []);
        }
        
        setTimeout(() => setSubmitMessage(''), 5000);
      }
    } catch (err) {
      console.error('Review submission failed:', err);
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error ||
                      'Failed to submit review. You must download the app first.';
      setSubmitError(errorMsg);
      setTimeout(() => setSubmitError(''), 5000);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-4 mx-auto w-16 h-16 sm:w-20 sm:h-20">
            <div className="w-full h-full border-4 border-blue-200 rounded-full" />
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading app details...</p>
        </div>
      </div>
    );
  }

  if (error || !app) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-lg font-semibold text-red-500">{error || 'App not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">App Details</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 sm:pt-20 pb-8 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="w-full max-w-[1600px] mx-auto">
          {/* Wishlist Message */}
          {wishlistMessage && (
            <div className="mb-4 p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-800 text-center rounded-2xl font-semibold shadow-md animate-pulse">
              {wishlistMessage}
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* App Header Card */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-2xl sm:rounded-3xl overflow-hidden flex-shrink-0 shadow-2xl ring-4 ring-blue-100">
                    <img
                      src={app.icon_url || '/placeholder-app-icon.png'}
                      alt={app.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 w-full sm:w-auto">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-2">{app.name}</h2>
                    <p className="text-gray-500 text-xs sm:text-sm mb-3">{app.package_name || 'com.example.app'}</p>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-xs sm:text-sm font-semibold rounded-full border border-blue-100">
                        {app.category}
                      </span>
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 rounded-full border border-yellow-200">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-gray-900">{app.rating || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-full border border-green-200">
                        <Download className="w-4 h-4 text-green-600" />
                        <span className="text-xs sm:text-sm font-semibold text-green-700">{app.download_count?.toLocaleString() || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  {!isInstalled ? (
                    <>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleInstall}
                          disabled={isDownloading}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
                        >
                          <Download className="w-5 h-5" />
                          {isDownloading ? `Downloading... ${downloadProgress}%` : 'Install Now'}
                        </button>

                        <button
                          onClick={toggleWishlist}
                          disabled={wishlistLoading || isDownloading}
                          className="p-3 sm:p-4 rounded-2xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 relative shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
                        >
                          <Heart
                            className={`w-6 h-6 transition-all ${
                              isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'
                            }`}
                          />
                          {wishlistLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-2xl">
                              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </button>
                      </div>

                      {isDownloading && (
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-700">Downloading...</span>
                            <span className="text-sm font-bold text-blue-600">{downloadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300 relative overflow-hidden"
                              style={{ width: `${downloadProgress}%` }}
                            >
                              <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        disabled
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 sm:py-4 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 cursor-not-allowed text-sm sm:text-base"
                      >
                        <Check className="w-5 h-5" />
                        Installed
                      </button>
                      <button
                        onClick={handleUninstall}
                        className="px-6 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl font-bold hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 text-sm sm:text-base cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                        Uninstall
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-6 h-6 text-indigo-500" />
                  About This App
                </h3>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-left">
                  {app.description || 'No description available.'}
                </p>
              </div>

              {/* Screenshots */}
              {app.screenshots?.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-500" />
                    Screenshots
                  </h3>
                  <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
                    {app.screenshots.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`Screenshot ${i + 1}`}
                        className="w-36 sm:w-40 md:w-48 lg:w-56 h-64 sm:h-72 md:h-80 lg:h-96 object-cover rounded-2xl shadow-xl flex-shrink-0 snap-start border-2 border-gray-100 hover:scale-105 transition-transform duration-300 cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Permissions */}
              {app.permissions?.length > 0 && (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-100">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-amber-500" />
                    Permissions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {app.permissions.map((perm, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 cursor-default">
                        {perm.granted ? (
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                            <X className="w-5 h-5 text-white" />
                          </div>
                        )}
                        <span className="text-gray-700 text-sm font-medium text-left">{perm.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* App Info */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">App Information</h3>
                <div className="space-y-4">
                  <InfoCard icon={<Package className="w-5 h-5 text-blue-500" />} label="Version" value={app.version || 'N/A'} />
                  <InfoCard icon={<Download className="w-5 h-5 text-green-500" />} label="Downloads" value={app.download_count?.toLocaleString() || 'N/A'} />
                  <InfoCard icon={<Star className="w-5 h-5 text-yellow-500" />} label="Rating" value={`${app.rating || 'N/A'} ★`} />
                  <InfoCard icon={<Users className="w-5 h-5 text-purple-500" />} label="Size" value={`${(app.file_size / (1024 * 1024)).toFixed(2)} MB`} />
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <InfoRow label="Category" value={app.category} />
                  <InfoRow label="Price" value={app.price === 0 || !app.price ? 'Free' : `₹${app.price}`} />
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  Reviews ({reviews.length})
                </h3>
                {reviewsLoading ? (
                  <p className="text-gray-500 text-center py-8">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium text-sm">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full overflow-hidden flex-shrink-0 shadow-md ring-2 ring-blue-100">
                            {review.user?.avatar_url ? (
                              <img src={review.user.avatar_url} alt={review.user.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                                {review.user?.name?.[0]?.toUpperCase() || 'U'}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-1 mb-2">
                              <span className="font-bold text-gray-900 text-sm truncate">{review.user?.name || 'Anonymous'}</span>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-2 text-left">{review.comment}</p>
                            <p className="text-gray-400 text-xs flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
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

              {/* Write Review */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-100">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Write a Review</h3>

                <div className="flex gap-1 sm:gap-2 mb-6 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transform transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-all ${
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
                  className="w-full border-2 border-gray-200 rounded-2xl p-4 min-h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all text-left"
                />

                {submitMessage && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 font-semibold text-center rounded-2xl text-sm">
                    {submitMessage}
                  </div>
                )}
                {submitError && (
                  <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 font-semibold text-center rounded-2xl text-sm">
                    {submitError}
                  </div>
                )}

                <button
                  onClick={handleSubmitReview}
                  disabled={submittingReview || rating === 0 || !reviewText.trim()}
                  className="w-full mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base cursor-pointer"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all cursor-default">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 text-left">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-base sm:text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="space-y-1 text-left cursor-default">
    <span className="text-xs text-gray-500 font-medium block">{label}</span>
    <span className="text-sm font-bold text-gray-900 block">{value}</span>
  </div>
);

export default AppDetailPage;