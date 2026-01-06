import React from 'react';
import { Mail, Phone } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';

const HelpSupportPage = () => {
  const faqs = [
    'How do I download an app?',
    'How can I update my apps?',
    'How do I add apps to wishlist?',
    'How can I submit a review?',
    'How do I report a problem?',
  ];

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Help & Support" showNotification={false} />
        
        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 lg:pb-6 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
            
            <p className="text-gray-700 text-base mb-8">
              We are here to help you. Find answers to common questions or reach out to our support team if you need assistance.
            </p>

            {/* FAQs */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <ul className="space-y-2">
                {faqs.map((faq, index) => (
                  <li key={index} className="text-gray-700">• {faq}</li>
                ))}
              </ul>
            </section>

            {/* App Issues */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">App Issues</h2>
              <p className="text-gray-700 text-base">
                If the app crashes, loads slowly, or does not work as expected, try restarting the app or checking your internet connection.
              </p>
            </section>

            {/* Contact Support */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Support</h2>
              <p className="text-gray-700 text-base mb-4">
                If you still need help, please contact our support team using the details below.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail size={20} className="text-blue-500" />
                  <span>Email: support@miniappstore.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone size={20} className="text-blue-500" />
                  <span>Phone: +91 98765 43210</span>
                </div>
              </div>
            </section>

            {/* Feedback */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Feedback</h2>
              <p className="text-gray-700 text-base">
                We value your feedback. Please share your suggestions to help us improve your experience.
              </p>
            </section>

            {/* Support Hours */}
            <div className="text-center py-6 bg-gray-100 rounded-2xl">
              <p className="text-gray-600">Support available: Mon – Fri, 10 AM – 6 PM</p>
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default HelpSupportPage;
