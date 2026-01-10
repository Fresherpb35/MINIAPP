// src/pages/DownloadsPage.jsx
import React, { useState, useEffect } from 'react';
import { Package, Clock, Download, CheckCircle2, Sparkles, TrendingUp } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import api from '../config/api'; // Axios instance

const DownloadsPage = () => {
  const [downloads, setDownloads] = useState([]);
  const [activeTab, setActiveTab] = useState('installed');
  const [loading, setLoading] = useState(true);

  const navActiveTab = 'download';

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

  return (
    <>
      <Sidebar activeTab={navActiveTab} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <Header title="" showNotification={true} />

        <div className="lg:ml-64">
          {/* Enhanced Tabs with glassmorphism */}
          <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="flex justify-center lg:justify-start gap-4 sm:gap-8 lg:gap-12">
                <button
                  onClick={() => setActiveTab('installed')}
                  className={`py-3 sm:py-4 px-3 sm:px-4 text-sm sm:text-base font-bold whitespace-nowrap relative transition-all duration-300 ${
                    activeTab === 'installed'
                      ? 'text-blue-600 scale-105'
                      : 'text-gray-500 hover:text-gray-900 hover:scale-102'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden xs:inline">Installed</span>
                    <span className="inline xs:hidden">Apps</span>
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                      {downloads.length}
                    </span>
                  </span>
                  {activeTab === 'installed' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-full shadow-lg" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-3 sm:py-4 px-3 sm:px-4 text-sm sm:text-base font-bold whitespace-nowrap relative transition-all duration-300 ${
                    activeTab === 'history'
                      ? 'text-blue-600 scale-105'
                      : 'text-gray-500 hover:text-gray-900 hover:scale-102'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>History</span>
                    <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                      {downloads.length}
                    </span>
                  </span>
                  {activeTab === 'history' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-full shadow-lg" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <main className="p-3 sm:p-4 md:p-6 lg:p-8 pb-20 sm:pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto">
              {/* Mobile title - Shows below tabs */}
              <div className="lg:hidden mb-6 mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    {activeTab === 'installed' ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <Clock className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <h1 className="text-2xl font-black text-gray-900">
                    {activeTab === 'installed' ? 'Installed Apps' : 'Download History'}
                  </h1>
                </div>
                <p className="text-gray-600 text-sm ml-13">
                  {activeTab === 'installed'
                    ? 'Manage your installed applications'
                    : 'View your download history'}
                </p>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24 lg:py-32">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 rounded-full" />
                    <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-gray-600 font-semibold mt-6 text-sm sm:text-base">Loading downloads...</p>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2">Please wait a moment</p>
                </div>
              ) : downloads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24 lg:py-32">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center shadow-xl">
                      <Package className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 text-center px-4">
                    No downloads yet
                  </h3>
                  <p className="text-gray-500 text-center max-w-md px-4 text-sm sm:text-base leading-relaxed">
                    Apps you download will appear here. Start exploring the store to discover amazing apps!
                  </p>
                  <button className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Explore Store
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                  {downloads.map((download) => {
                    const app = download.app || {};
                    const developer = app.developer || {};

                    return (
                      <div
                        key={download.id}
                        className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 p-4 sm:p-5 lg:p-6 flex flex-col border border-gray-100 group hover:scale-105 hover:border-blue-200 hover:-translate-y-1"
                      >
                        {/* Icon + Badge */}
                        <div className="relative mb-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 ring-2 ring-gray-100 group-hover:ring-blue-200">
                            {app.icon_url ? (
                              <img
                                src={app.icon_url}
                                alt={app.name || 'App icon'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
                                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                              </div>
                            )}
                          </div>

                          {download.status === 'completed' && (
                            <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 ring-2 ring-white">
                              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col">
                          <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                            {app.name || 'Unknown App'}
                          </h3>

                          <p className="text-gray-500 text-xs sm:text-sm truncate mb-3">
                            {developer.name || 'Unknown Developer'}
                          </p>

                          {app.category && (
                            <span className="inline-block self-start px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-xs font-semibold rounded-full mb-3 border border-blue-100">
                              {app.category}
                            </span>
                          )}

                          <div className="space-y-2 mt-auto text-xs sm:text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                              </div>
                              <span className="truncate">
                                {new Date(download.downloaded_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 sm:w-7 sm:h-7 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Download className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />
                              </div>
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