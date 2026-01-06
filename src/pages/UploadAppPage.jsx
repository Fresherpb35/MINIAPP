import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';

const UploadAppPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    appName: '',
    packageName: '',
    description: '',
    category: '',
    pricing: 'free',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Upload App" showNotification={false} />
        
        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 lg:pb-6 max-w-3xl mx-auto">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900 mb-6">Upload App</h1>
            
            {/* Stepper */}
            <div className="text-center mb-8">
              <p className="text-gray-700 font-medium mb-4">Step {currentStep} of 3: Basic Information</p>
              <div className="flex items-center justify-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  1
                </div>
                <div className={`w-24 h-1 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  2
                </div>
                <div className={`w-24 h-1 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                  3
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* App Name */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">App Name *</label>
                <input
                  type="text"
                  name="appName"
                  placeholder="App Name"
                  value={formData.appName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
              </div>

              {/* Package Name */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Package Name*</label>
                <input
                  type="text"
                  name="packageName"
                  placeholder="Package Name"
                  value={formData.packageName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Description *</label>
                <textarea
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none"
                ></textarea>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option value="productivity">Productivity</option>
                  <option value="education">Education</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="health">Health</option>
                  <option value="games">Games</option>
                </select>
              </div>

              {/* Pricing */}
              <div>
                <label className="block text-gray-900 font-semibold mb-3">Pricing</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="pricing"
                      value="free"
                      checked={formData.pricing === 'free'}
                      onChange={handleInputChange}
                      className="w-5 h-5 accent-blue-500 cursor-pointer"
                    />
                    <span className="text-gray-900">Free</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="pricing"
                      value="paid"
                      checked={formData.pricing === 'paid'}
                      onChange={handleInputChange}
                      className="w-5 h-5 accent-blue-500 cursor-pointer"
                    />
                    <span className="text-gray-900">Paid</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex-1 py-4 bg-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 py-4 bg-blue-500 text-white font-semibold rounded-2xl hover:bg-blue-600 transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default UploadAppPage;