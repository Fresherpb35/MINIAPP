import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-white">
        <Header title="Privacy Policy" showNotification={false} />
        
        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 lg:pb-6 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            
            <p className="text-gray-700 text-base mb-8">
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our application.
            </p>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-700 text-base">
                We may collect personal information such as your name, email address, and app usage data to improve our services.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 text-base">
                The information we collect is used to provide, maintain, and improve our application, and to communicate important updates.
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 text-base">
                We take reasonable measures to protect your data from unauthorized access, loss, or misuse.
              </p>
            </section>

            {/* Third-Party Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-700 text-base">
                Our app may use third-party services that collect information used to identify you. Please review their privacy policies separately.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 text-base">
                We may update this Privacy Policy from time to time. Changes will be reflected on this page.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 text-base">
                If you have any questions about this Privacy Policy, please contact us through the app support.
              </p>
            </section>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default PrivacyPolicyPage;