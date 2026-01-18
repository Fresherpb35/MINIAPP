// src/pages/DownloadsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Clock, Download, CheckCircle2, Sparkles, ArrowRight, Store 
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import api from '../config/api';

const DownloadsPage = () => {
  const navigate = useNavigate();
  const [downloads, setDownloads] = useState([]);
  const [activeTab, setActiveTab] = useState('installed');
  const [loading, setLoading] = useState(true);
  const [installedIds, setInstalledIds] = useState(() => {
    return new Set(JSON.parse(localStorage.getItem('installedApps') || '[]'));
  });

  const navActiveTab = 'download';

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'installedApps') {
        setInstalledIds(new Set(JSON.parse(e.newValue || '[]')));
      }
    };
    window.addEventListener('storage', handleStorageChange);

    const handleFocus = () => {
      setInstalledIds(new Set(JSON.parse(localStorage.getItem('installedApps') || '[]')));
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    const fetchDownloads = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/user/downloads');
        setDownloads(response.data.data || []);
      } catch (err) {
        console.error('Error fetching downloads:', err);
        setDownloads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
  }, []);

  const handleExploreStore = () => {
    navigate('/home'); // ← adjust if your store/home route is different
  };

  const displayedDownloads = downloads.filter((download) => {
    const appId = download.app?.id || download.app_id;
    if (!appId) return false;

    if (activeTab === 'installed') {
      return installedIds.has(String(appId));
    }
    return true;
  });

  const installedCount = displayedDownloads.filter(d => {
    const appId = d.app?.id || d.app_id;
    return installedIds.has(String(appId));
  }).length;

  const historyCount = downloads.length;

  return (
    <>
      <Sidebar activeTab={navActiveTab} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Header title="" showNotification={true} />

        <div className="lg:ml-64">
          {/* Tabs */}
          <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center lg:justify-start gap-2 sm:gap-4 lg:gap-8">
                <button
                  onClick={() => setActiveTab('installed')}
                  className={`py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-semibold whitespace-nowrap relative transition-all duration-300 ${
                    activeTab === 'installed' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Installed</span>
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                      {installedCount}
                    </span>
                  </span>
                  {activeTab === 'installed' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-full" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base font-semibold whitespace-nowrap relative transition-all duration-300 ${
                    activeTab === 'history' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>History</span>
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                      {historyCount}
                    </span>
                  </span>
                  {activeTab === 'history' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-full" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <main className="p-4 sm:p-6 lg:p-8 pb-24 sm:pb-28 lg:pb-8">
            <div className="max-w-7xl mx-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 sm:py-40">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 border-4 border-blue-200 rounded-full" />
                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-lg font-semibold text-gray-700">Loading your downloads...</p>
                  <p className="text-gray-500 mt-2">Just a moment</p>
                </div>
              ) : displayedDownloads.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-32 text-center">
                  {/* Logo / Icon Section */}
                  <div className="relative mb-10">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                      <Store className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Your Downloads List is Empty
                  </h2>
                  
                  <p className="text-gray-600 max-w-md mb-10 text-base leading-relaxed">
                    Start exploring our store to discover amazing apps and games. 
                    Your downloaded and installed apps will appear here.
                  </p>

                  <button
                    onClick={handleExploreStore}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Explore Store
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
                  {displayedDownloads.map((download) => {
                    const app = download.app || {};
                    const developer = app.developer || {};

                    return (
                      <div
                        key={download.id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-4 flex flex-col border border-gray-100 group hover:border-blue-200 hover:-translate-y-1 cursor-pointer h-full"
                      >
                        <div className="relative mb-3 flex justify-center">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 ring-1 ring-gray-200 group-hover:ring-blue-300">
                            {app.icon_url ? (
                              <img
                                src={app.icon_url}
                                alt={app.name || 'App icon'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
                                <Package className="w-10 h-10 text-blue-500" />
                              </div>
                            )}
                          </div>

                          {download.status === 'completed' && (
                            <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 flex flex-col text-center">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors px-1">
                            {app.name || 'Unknown App'}
                          </h3>

                          <p className="text-gray-500 text-xs truncate mb-2 px-1">
                            {developer.name || 'Unknown Developer'}
                          </p>

                          {app.category && (
                            <div className="flex justify-center mb-3">
                              <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full border border-blue-100">
                                {app.category}
                              </span>
                            </div>
                          )}

                          <div className="space-y-1.5 mt-auto text-xs text-gray-500">
                            <div className="flex items-center justify-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                              <span className="truncate">
                                {new Date(download.downloaded_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            <div className="flex items-center justify-center gap-1.5">
                              <Download className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                              <span className="truncate">
                                v{download.version_downloaded || app.version || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <MobileBottomNav activeTab={navActiveTab} />
    </>
  );
};

export default DownloadsPage;