import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';

const RatingsReviewsPage = () => {
  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-white">
        <Header title="Ratings & Reviews" showNotification={false} />
        
        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 lg:pb-6 flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <p className="text-gray-500 text-lg">No reviews yet</p>
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default RatingsReviewsPage;