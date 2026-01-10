import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
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
      <div className="min-h-screen bg-gray-50">
        <Header title="My Wishlist" showNotification={true} />

        <div className="lg:ml-64">
          <main className="px-4 sm:px-6 py-6 pb-24 lg:pb-6 max-w-7xl mx-auto">
            {/* Toast-like message */}
            {message && (
              <div
                className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-medium transition-all duration-300 transform ${
                  message.includes('removed') ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {message}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <Heart className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <p className="mt-6 text-gray-600 text-lg font-medium">Loading your favorites...</p>
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                  <Trash2 className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">{error}</h2>
                {error.includes('sign in') && (
                  <button
                    onClick={() => navigate('/signin')}
                    className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-md"
                  >
                    Sign In
                  </button>
                )}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && wishlist.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-32 h-32 bg-pink-50 rounded-full flex items-center justify-center mb-8">
                  <Heart className="w-16 h-16 text-pink-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Your Wishlist is Empty</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-md">
                  Start adding apps you love by tapping the heart icon on any app page
                </p>
                <button
                  onClick={() => navigate('/home')}
                  className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg transform hover:-translate-y-0.5"
                >
                  Discover Apps
                </button>
              </div>
            )}

            {/* Wishlist Grid */}
            {!loading && wishlist.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
                {wishlist.map((item) => {
                  const app = item.apps;
                  return (
                    <div
                      key={item.id}
                      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
                      onClick={() => goToApp(app.id)}
                    >
                      <div className="relative aspect-square">
                        <img
                          src={app.icon_url || '/placeholder.png'}
                          alt={app.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(app.id, app.name);
                          }}
                          disabled={removingId === app.id}
                          className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 opacity-90 hover:opacity-100"
                          title="Remove from wishlist"
                        >
                          {removingId === app.id ? (
                            <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5 text-red-600" />
                          )}
                        </button>
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 truncate text-lg group-hover:text-blue-700 transition-colors">
                          {app.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{app.category}</p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="font-medium text-gray-700">
                              {app.average_rating?.toFixed(1) || '—'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 font-medium">
                            {app.downloads?.toLocaleString() || '0'} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default WishlistPage;