import React from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Privacy Policy" showNotification={false} />

        <div className="lg:ml-64">
          <main className="px-4 sm:px-6 lg:px-8 py-8 lg:py-12 pb-24 lg:pb-12 max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-10 lg:mb-16">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                Privacy Policy
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Last updated: January 10, 2026
              </p>
            </div>

            {/* Introduction */}
            <div className="prose prose-lg prose-gray max-w-none mb-12 lg:mb-16">
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. This Privacy Policy explains how TaskMaster ("we", "us", or "our") collects, 
                uses, shares, and protects your personal information when you use our mobile application and related services 
                (collectively, the "Service").
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By using the Service, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>

            {/* Sections with better hierarchy */}
            <div className="space-y-12 lg:space-y-16">
              {/* 1. Information We Collect */}
              <section>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  1. Information We Collect
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p>We collect several different types of information for various purposes to provide and improve our Service to you:</p>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Personal Data</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Name and email address</li>
                    <li>Profile information (photo, bio)</li>
                    <li>Payment information (processed securely by third-party providers)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Usage Data</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Device information (type, OS version)</li>
                    <li>App usage statistics (features used, time spent)</li>
                    <li>Search queries and interaction patterns</li>
                  </ul>
                </div>
              </section>

              {/* 2. How We Use Your Information */}
              <section>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  2. How We Use Your Information
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p>We use the collected data for various purposes:</p>
                  <ul className="list-disc pl-6 space-y-3 text-gray-700">
                    <li>To provide and maintain our Service</li>
                    <li>To notify you about changes to our Service</li>
                    <li>To allow you to participate in interactive features</li>
                    <li>To provide customer support</li>
                    <li>To gather analysis or valuable information for service improvement</li>
                    <li>To detect, prevent and address technical issues</li>
                  </ul>
                </div>
              </section>

              {/* 3. Data Security */}
              <section>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  3. Data Security
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p>
                    The security of your data is important to us, but remember that no method of transmission over the Internet, 
                    or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to 
                    protect your Personal Data, we cannot guarantee its absolute security.
                  </p>
                </div>
              </section>

              {/* 4. Third-Party Services */}
              <section>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  4. Third-Party Services
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p>
                    Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, 
                    you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every 
                    site you visit.
                  </p>
                  <p className="mt-4">
                    We have no control over and assume no responsibility for the content, privacy policies or practices of any 
                    third party sites or services.
                  </p>
                </div>
              </section>

              {/* 5. Changes to Policy */}
              <section>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  5. Changes to This Privacy Policy
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p>
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                    Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                  <p className="mt-4">
                    You are advised to review this Privacy Policy periodically for any changes.
                  </p>
                </div>
              </section>

              {/* 6. Contact Us */}
              <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  6. Contact Us
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p>
                    If you have any questions about this Privacy Policy, please contact us:
                  </p>
                  <div className="mt-6 space-y-3">
                    <p className="font-medium text-gray-800">Email: privacy@taskmaster.app</p>
                    <p className="font-medium text-gray-800">Support in-app: Help → Contact Support</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer note */}
            <div className="mt-16 lg:mt-20 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} TaskMaster. All rights reserved.
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default PrivacyPolicyPage;