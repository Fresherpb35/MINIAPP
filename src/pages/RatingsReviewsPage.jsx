import React, { useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import { getUserReviews } from '../services/reviewService';

const RatingsReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await getUserReviews(1, 10); // fetch first 10 reviews
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

    fetchReviews();
  }, []);

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
                <p className="text-gray-700 mb-1">Rating: {review.rating} ★</p>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-sm text-gray-400 mt-1">
                  Reviewed on: {new Date(review.created_at).toLocaleDateString()}
                </p>
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
