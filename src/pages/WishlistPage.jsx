import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, Star, Download, Sparkles, AlertCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import { getUserWishlist, removeAppFromWishlist } from '../services/userService';

const WishlistPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please sign in to view your wishlist');
        navigate('/signin');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const res = await getUserWishlist(1, 50);
        if (res.success) {
          setWishlist(res.data || []);
        } else {
          setError(res.message || 'Failed to load wishlist');
        }
      } catch (err) {
        console.error('Wishlist fetch error:', err);
        if (err.response?.status === 401) {
          setError('Session expired. Please sign in again.');
          localStorage.removeItem('access_token');
          navigate('/signin');
        } else {
          setError('Unable to load wishlist. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  const handleRemove = async (appId, appName) => {
    setRemovingId(appId);
    try {
      const res = await removeAppFromWishlist(appId);
      if (res.success) {
        setWishlist(prev => prev.filter(item => item.app_id !== appId));
        setMessage(`${appName} removed from wishlist`);
        setTimeout(() => setMessage(''), 4000);
      }
    } catch (err) {
      console.error('Remove error:', err);
      setMessage(err.response?.data?.message || 'Failed to remove from wishlist');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setRemovingId(null);
    }
  };

  const goToApp = (appId) => navigate(`/app/${appId}`);

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <Header title="My Wishlist" showNotification={true} />

        <div className="lg:ml-64">
          <main className="px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-8 w-full mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                  My Wishlist
                </h1>
              </div>
              {!loading && !error && wishlist.length > 0 && (
                <p className="text-gray-600 ml-14">
                  {wishlist.length} app{wishlist.length !== 1 ? 's' : ''} saved
                </p>
              )}
            </div>

            {/* Toast Message */}
            {message && (
              <div
                className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white font-semibold transition-all duration-300 transform animate-in slide-in-from-top ${
                  message.includes('removed') ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'
                } flex items-center gap-3`}
              >
                {message.includes('removed') ? (
                  <Sparkles className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{message}</span>
              </div>
            )}

            {/* Loading State */}
            {loading && <LoadingState />}

            {/* Error State */}
            {!loading && error && <ErrorState error={error} navigate={navigate} />}

            {/* Empty State */}
            {!loading && !error && wishlist.length === 0 && <EmptyState navigate={navigate} />}

            {/* Wishlist Grid */}
            {!loading && wishlist.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 lg:gap-6">
                {wishlist.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    removingId={removingId}
                    goToApp={goToApp}
                    handleRemove={handleRemove}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

// Loading State Component
const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <div className="relative w-24 h-24 mb-8">
      <div className="absolute inset-0 border-4 border-pink-200 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      <Heart className="absolute inset-0 m-auto w-10 h-10 text-pink-500 fill-pink-500 animate-pulse" />
    </div>
    <p className="text-gray-600 text-lg font-medium">Loading your favorites...</p>
    <p className="text-gray-500 text-sm mt-2">Gathering your saved apps</p>
  </div>
);

// Error State Component
const ErrorState = ({ error, navigate }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
      <AlertCircle className="w-12 h-12 text-red-600" />
    </div>
    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{error}</h2>
    {error.includes('sign in') && (
      <button
        onClick={() => navigate('/signin')}
        className="mt-6 px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
      >
        Sign In
      </button>
    )}
  </div>
);

// Empty State Component
const EmptyState = ({ navigate }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mb-8 relative">
      <Heart className="w-16 h-16 text-pink-500" />
      <div className="absolute inset-0 rounded-full bg-pink-300 animate-ping opacity-20"></div>
    </div>
    <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
      Your Wishlist is Empty
    </h2>
    <p className="text-lg text-gray-600 mb-8 max-w-md">
      Start adding apps you love by tapping the heart icon on any app page
    </p>
    <button
      onClick={() => navigate('/home')}
      className="px-10 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-3"
    >
      <Sparkles className="w-5 h-5" />
      Discover Apps
    </button>
  </div>
);

// Wishlist Card Component
const WishlistCard = ({ item, removingId, goToApp, handleRemove }) => {
  const app = item.apps;

  return (
    <div
      className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-gray-100 hover:border-pink-300 flex flex-col h-full"
      onClick={() => goToApp(app.id)}
    >
      {/* App Icon with consistent aspect ratio */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        <img
          src={app.icon_url || '/placeholder.png'}
          alt={app.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Remove Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemove(app.id, app.name);
          }}
          disabled={removingId === app.id}
          className="absolute top-3 right-3 p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 group/btn"
          title="Remove from wishlist"
        >
          {removingId === app.id ? (
            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Trash2 className="w-5 h-5 text-red-600 group-hover/btn:scale-110 transition-transform" />
          )}
        </button>

        {/* Favorite Badge */}
        <div className="absolute top-3 left-3 p-2 bg-pink-500 rounded-full shadow-lg">
          <Heart className="w-4 h-4 text-white fill-white" />
        </div>
      </div>

      {/* App Info - Fixed height section */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1 group-hover:text-pink-600 transition-colors mb-1">
          {app.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-1 mb-3">{app.category}</p>

        {/* Stats - Fixed at bottom */}
        <div className="mt-auto space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold text-gray-700">
                {app.average_rating?.toFixed(1) || '—'}
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Download className="w-3.5 h-3.5" />
              <span className="font-medium">
                {app.downloads ? (app.downloads >= 1000 ? `${(app.downloads / 1000).toFixed(1)}k` : app.downloads) : '0'}
              </span>
            </div>
          </div>

          {/* Install Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToApp(app.id);
            }}
            className="w-full py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-700 hover:to-rose-700 transition-all duration-300 hover:shadow-lg text-sm"
          >
            View App
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;