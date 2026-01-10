import React from 'react';
import { Mail, Phone, MessageCircle, ChevronRight, HelpCircle } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';

const HelpSupportPage = () => {
  const faqs = [
    { question: "How do I download an app?", answer: "Tap on any app card, then click the 'Install' or 'Download' button." },
    { question: "How can I update my apps?", answer: "Go to 'My Downloads' section and tap 'Update All' or update individual apps." },
    { question: "How do I add apps to wishlist?", answer: "Tap the heart icon on any app card to save it to your wishlist." },
    { question: "How can I submit a review?", answer: "After installing, go to the app detail page and tap 'Write a Review'." },
    { question: "How do I report a problem?", answer: "Use the 'Report Issue' button on the app page or contact support below." },
  ];

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Help & Support" showNotification={false} />

        <div className="lg:ml-64">
          <main className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24 lg:pb-12 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-10 lg:mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                Help & Support
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                We're here to help. Find quick answers or get in touch with our team.
              </p>
            </div>

            {/* Search-like hint (optional future feature) */}
            <div className="mb-12">
            
            </div>

            {/* FAQs - Accordion style (expandable) */}
            <section className="mb-16">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm 
                             hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <summary className="flex justify-between items-center cursor-pointer p-5 lg:p-6">
                      <span className="font-medium text-gray-900 text-base lg:text-lg">
                        {faq.question}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-5 lg:px-6 pb-5 lg:pb-6 pt-1 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* Contact Options */}
            <section className="mb-16">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                Contact Our Support Team
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">Email Support</h3>
                      <p className="text-gray-600 text-sm">Usually reply within 24 hours</p>
                    </div>
                  </div>
                  <a
                    href="mailto:support@miniappstore.com"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    support@miniappstore.com
                  </a>
                </div>

                {/* Phone Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">Phone Support</h3>
                      <p className="text-gray-600 text-sm">Mon–Fri, 10 AM – 6 PM IST</p>
                    </div>
                  </div>
                  <a
                    href="tel:+919876543210"
                    className="text-green-600 font-medium hover:underline"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>
            </section>


            {/* Footer note */}
            <div className="text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} MiniApp Store • All rights reserved
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default HelpSupportPage;