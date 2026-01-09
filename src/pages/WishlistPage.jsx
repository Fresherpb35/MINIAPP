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

  // Remove app
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

  // Navigate to app detail
  const goToApp = (appId) => navigate(`/app/${appId}`);

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="My Wishlist" showNotification={true} />
        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 lg:pb-6 max-w-6xl mx-auto">

            {/* Feedback */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg text-center font-medium ${
                message.includes('removed') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-lg">Loading your wishlist...</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="text-center py-20">
                <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
                {error.includes('sign in') && (
                  <button
                    onClick={() => navigate('/signin')}
                    className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                  >
                    Sign In
                  </button>
                )}
              </div>
            )}

            {/* Empty */}
            {!loading && !error && wishlist.length === 0 && (
              <div className="text-center py-20">
                <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <p className="text-2xl font-medium text-gray-600 mb-2">Your wishlist is empty</p>
                <p className="text-gray-500 mb-6">Apps you ❤️ will appear here</p>
                <button
                  onClick={() => navigate('/home')}
                  className="px-8 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition"
                >
                  Browse Apps
                </button>
              </div>
            )}

            {/* Wishlist Grid */}
            {!loading && wishlist.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {wishlist.map((item) => {
                  const app = item.apps;
                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => goToApp(app.id)}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={app.icon_url || '/placeholder.png'}
                          alt={app.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(app.id, app.name);
                          }}
                          disabled={removingId === app.id}
                          className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition"
                          title="Remove from wishlist"
                        >
                          {removingId === app.id ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-600" />
                          )}
                        </button>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 truncate">{app.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{app.category}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">
                            ★ {app.average_rating?.toFixed(1) || '0.0'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {app.downloads?.toLocaleString() || '0'} dl
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
