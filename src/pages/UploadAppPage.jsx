import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import axios from 'axios';

const UploadAppPage = () => {
  const [uploadProgress, setUploadProgress] = useState(0); // 0 to 100
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    appName: '',
    packageName: '',
    description: '',
    shortDescription: '',
    category: '',
    pricing: 'free',
    price: 0,
    version: '',
    minAndroidVersion: '',
    appIcon: null,
    screenshots: [],
    apkFile: null
  });

  const permissions = ['Camera', 'Storage', 'Location', 'Microphone'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleFileChange = (e, fieldName) => {
    const files = e.target.files;
    if (fieldName === 'screenshots') {
      if (files.length > 5) {
        setError('Maximum 5 screenshots allowed');
        return;
      }
      setFormData({ ...formData, [fieldName]: Array.from(files) });
    } else {
      setFormData({ ...formData, [fieldName]: files[0] });
    }
    setError('');
  };

  const togglePermission = (permission) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const validateStep = () => {
    switch(currentStep) {
      case 1:
        if (!formData.appName || !formData.packageName || !formData.description || !formData.category) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 2:
        if (!formData.version || !formData.minAndroidVersion) {
          setError('Please enter version and select minimum Android version');
          return false;
        }
        break;
      case 3:
        if (!formData.apkFile || !formData.appIcon) {
          setError('Please upload APK file and app icon');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
        setError('');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

 const handleSubmit = async () => {
  if (!validateStep()) return;

  setLoading(true);
  setError('');
  setSuccess('');
  setUploadProgress(0); // reset

  try {
    const submitData = new FormData();

    // Step 1 data
    submitData.append('name', formData.appName);
    submitData.append('package_name', formData.packageName);
    submitData.append('description', formData.description);
    submitData.append('short_description', formData.shortDescription || formData.description.substring(0, 100));
    submitData.append('category', formData.category);
    submitData.append('price', formData.pricing === 'paid' ? formData.price : 0);

    // Step 2 data
    submitData.append('version', formData.version);
    submitData.append('mini_android_version', formData.minAndroidVersion);
    submitData.append('min_sdk_version', formData.minAndroidVersion);
    submitData.append('target_sdk_version', '35');

    submitData.append('permissions', JSON.stringify(selectedPermissions));

    // Step 3 data
    if (formData.apkFile) submitData.append('apk', formData.apkFile);
    if (formData.appIcon) submitData.append('app_icon', formData.appIcon);
    if (formData.screenshots.length > 0) {
      formData.screenshots.forEach((screenshot) => submitData.append('screenshots', screenshot));
    }

    // Get token
    const sessionKey = Object.keys(localStorage).find(key => key.includes('sb-') && key.includes('auth-token'));
    let token = null;
    if (sessionKey) {
      const session = JSON.parse(localStorage.getItem(sessionKey) || '{}');
      token = session.access_token;
    }
    if (!token) token = localStorage.getItem('access_token');

    if (!token) {
      setError('Please login again – token missing');
      setLoading(false);
      return;
    }

    // User ID for RLS
    let userId = null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.sub;
    } catch (e) {}
    if (userId) {
      submitData.append('developer_id', userId);
      submitData.append('user_id', userId);
    }

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/developers/apps/upload`,
      submitData,
      {
        headers: { 'Authorization': `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      }
    );

    if (response.data.success) {
      setSuccess('App uploaded successfully! It is now pending review.');
      setTimeout(() => { window.location.href = '/home'; }, 2000);
    }
  } catch (err) {
    setError(err.response?.data?.error || err.response?.data?.message || 'Failed to upload app. Please try again.');
    console.error('Upload error:', err);
  } finally {
    setLoading(false);
    setUploadProgress(0); // reset after upload
  }
};


  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return 'Basic Information';
      case 2: return 'App Permissions';
      case 3: return 'Upload Files';
      default: return 'Basic Information';
    }
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Upload App" showNotification={false} />
        
        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 lg:pb-6 max-w-3xl mx-auto">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900 mb-6">Upload App</h1>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl">{error}</div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-2xl">{success}</div>
            )}
            
            <div className="text-center mb-8">
              <p className="text-gray-700 font-medium mb-4">Step {currentStep} of 3: {getStepTitle()}</p>
              <div className="flex items-center justify-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>1</div>
                <div className={`w-24 h-1 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>2</div>
                <div className={`w-24 h-1 ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${currentStep >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'}`}>3</div>
              </div>
            </div>

            <div className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div><label className="block text-gray-900 font-semibold mb-2">App Name *</label><input type="text" name="appName" value={formData.appName} onChange={handleInputChange} className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" required /></div>
                  <div><label className="block text-gray-900 font-semibold mb-2">Package Name *</label><input type="text" name="packageName" value={formData.packageName} onChange={handleInputChange} className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" required /></div>
                  <div><label className="block text-gray-900 font-semibold mb-2">Description *</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none" required></textarea></div>
                  <div><label className="block text-gray-900 font-semibold mb-2">Short Description</label><input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" maxLength={100} /></div>
                  <div><label className="block text-gray-900 font-semibold mb-2">Category *</label>
                    <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white cursor-pointer" required>
                      <option value="">Select Category</option>
                      <option value="productivity">Productivity</option>
                      <option value="education">Education</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="health">Health</option>
                      <option value="games">Games</option>
                      <option value="social">Social</option>
                      <option value="tools">Tools</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-900 font-semibold mb-3">Pricing</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="pricing" value="free" checked={formData.pricing === 'free'} onChange={handleInputChange} className="w-5 h-5 accent-blue-500 cursor-pointer" />
                        <span className="text-gray-900">Free</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="radio" name="pricing" value="paid" checked={formData.pricing === 'paid'} onChange={handleInputChange} className="w-5 h-5 accent-blue-500 cursor-pointer" />
                        <span className="text-gray-900">Paid</span>
                      </label>
                    </div>
                    {formData.pricing === 'paid' && (
                      <div className="mt-3">
                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" />
                      </div>
                    )}
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">Version *</label>
                      <input type="text" name="version" value={formData.version} onChange={handleInputChange} className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base" required />
                    </div>
                    <div>
                      <label className="block text-gray-900 font-semibold mb-2">Minimum Android Version *</label>
                      <select name="minAndroidVersion" value={formData.minAndroidVersion} onChange={handleInputChange} className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white cursor-pointer" required>
                        <option value="">Select</option>
                        <option value="24">Android 7.0 Nougat (API 24)</option>
                        <option value="26">Android 8.0 Oreo (API 26)</option>
                        <option value="28">Android 9.0 Pie (API 28)</option>
                        <option value="29">Android 10 (API 29)</option>
                        <option value="30">Android 11 (API 30)</option>
                        <option value="31">Android 12 (API 31)</option>
                        <option value="33">Android 13 (API 33)</option>
                        <option value="34">Android 14 (API 34)</option>
                        <option value="35">Android 15 (API 35)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-900 font-semibold mb-3">Permissions Required:</label>
                    <div className="space-y-3">
                      {permissions.map((permission) => (
                        <label key={permission} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={selectedPermissions.includes(permission)} onChange={() => togglePermission(permission)} className="w-5 h-5 accent-blue-500 cursor-pointer border-2 border-gray-400 rounded" />
                          <span className="text-gray-900">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">App Icon * (PNG, JPG)</label>
                    <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={(e) => handleFileChange(e, 'appIcon')} className="hidden" id="appIcon" />
                    <label htmlFor="appIcon" className="block w-full py-4 px-6 bg-purple-50 text-purple-600 font-medium rounded-full hover:bg-purple-100 transition-colors text-center cursor-pointer">
                      {formData.appIcon ? formData.appIcon.name : 'Select App Icon'}
                    </label>
                  </div>

                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">Screenshots (Up to 5 images)</label>
                    <input type="file" accept="image/png,image/jpeg,image/jpg" multiple onChange={(e) => handleFileChange(e, 'screenshots')} className="hidden" id="screenshots" />
                    <label htmlFor="screenshots" className="block w-full py-4 px-6 bg-purple-50 text-purple-600 font-medium rounded-full hover:bg-purple-100 transition-colors text-center cursor-pointer">
                      {formData.screenshots.length > 0 ? `${formData.screenshots.length} screenshot(s) selected` : 'Add Screenshots'}
                    </label>
                  </div>

                  <div>
                    <label className="block text-gray-900 font-semibold mb-2">APK File *</label>
                    <input type="file" accept=".apk" onChange={(e) => handleFileChange(e, 'apkFile')} className="hidden" id="apkFile" />
                    <label htmlFor="apkFile" className="block w-full py-4 px-6 bg-purple-50 text-purple-600 font-medium rounded-full hover:bg-purple-100 transition-colors text-center cursor-pointer">
                      {formData.apkFile ? formData.apkFile.name : 'Upload APK File'}
                    </label>
                  </div>

                  {(formData.appIcon || formData.screenshots.length > 0 || formData.apkFile) && (
                    <div className="bg-blue-50 p-4 rounded-2xl">
                      <h3 className="font-semibold text-gray-900 mb-2">Selected Files:</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {formData.appIcon && <li>✓ App Icon: {formData.appIcon.name}</li>}
                        {formData.screenshots.length > 0 && <li>✓ Screenshots: {formData.screenshots.length} file(s)</li>}
                        {formData.apkFile && <li>✓ APK: {formData.apkFile.name}</li>}
                      </ul>
                    </div>
                  )}
                </>
              )}
{loading && uploadProgress > 0 && (
  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
    <div
      className="bg-blue-500 h-3 rounded-full transition-all"
      style={{ width: `${uploadProgress}%` }}
    />
  </div>
)}

{loading && uploadProgress > 0 && (
  <p className="text-center text-gray-700 font-medium mb-4">{`Uploading... ${uploadProgress}%`}</p>
)}

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={handlePrevious} disabled={currentStep === 1} className="flex-1 py-4 bg-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Previous
                </button>
                <button type="button" onClick={currentStep === 3 ? handleSubmit : handleNext} disabled={loading} className="flex-1 py-4 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? 'Uploading...' : (currentStep === 3 ? 'Submit for review' : 'Next')}
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