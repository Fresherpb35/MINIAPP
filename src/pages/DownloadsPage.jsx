// src/pages/DownloadsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Clock, Download, Trash2, ExternalLink } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import MobileBottomNav from '../components/layout/MobileBottomNav';

const DownloadsPage = () => {
  const [downloads, setDownloads] = useState([]);
  const [activeTab, setActiveTab] = useState('installed');
  const [loading, setLoading] = useState(true);

  const navActiveTab = 'download';

  useEffect(() => {
    const fetchDownloads = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://localhost:4000/api/user/downloads', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDownloads(res.data.data || []);
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
      {/* Sidebar */}
      <Sidebar activeTab={navActiveTab} />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header title="Downloads" showNotification={true} />

        {/* Main Content with left margin for sidebar on desktop */}
        <div className="lg:ml-64">
          {/* Tabs Section */}
          <div className="bg-white border-b border-gray-200 shadow-sm sticky top-16 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-center lg:justify-start gap-8 sm:gap-12">
                <button
                  onClick={() => setActiveTab('installed')}
                  className={`py-4 px-2 text-sm sm:text-base font-semibold whitespace-nowrap relative ${
                    activeTab === 'installed'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  Installed ({downloads.length})
                  {activeTab === 'installed' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-4 px-2 text-sm sm:text-base font-semibold whitespace-nowrap relative ${
                    activeTab === 'history'
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  History ({downloads.length})
                  {activeTab === 'history' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Downloads List */}
          <main className="p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto">
              {/* Page Title - Desktop Only */}
              <div className="hidden lg:block mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {activeTab === 'installed' ? 'Installed Apps' : 'Download History'}
                </h1>
                <p className="text-gray-600">
                  {activeTab === 'installed' 
                    ? 'Manage your installed applications' 
                    : 'View your complete download history'}
                </p>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 font-medium">Loading downloads...</p>
                </div>
              ) : downloads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No downloads yet</h3>
                  <p className="text-gray-500 text-center max-w-sm">
                    Apps you download will appear here. Start exploring the store to find great apps!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                  {downloads.map((d) => {
                    const app = d.app || {};
                    const developer = app.developer || {};

                    return (
                      <div
                        key={d.id}
                        className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 flex flex-col border border-gray-100 group"
                      >
                        {/* App Icon & Status Badge */}
                        <div className="relative mb-4">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                            {app.icon_url ? (
                              <img
                                src={app.icon_url}
                                alt={app.name || 'App Icon'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full">
                                <Package className="w-10 h-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                          {/* Status Badge */}
                          <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold shadow-md ${
                            d.status === 'completed'
                              ? 'bg-green-500 text-white'
                              : 'bg-yellow-500 text-white'
                          }`}>
                            {d.status === 'completed' ? '✓' : '⋯'}
                          </div>
                        </div>

                        {/* App Info */}
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-900 truncate mb-1 group-hover:text-blue-600 transition-colors">
                            {app.name || 'Unknown App'}
                          </h3>
                          <p className="text-gray-500 text-sm truncate mb-3">
                            {developer.name || 'Unknown Developer'}
                          </p>

                          {/* Category */}
                          {app.category && (
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full mb-3">
                              {app.category}
                            </span>
                          )}

                          {/* Download Info */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span className="text-xs">
                                {new Date(d.downloaded_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Download className="w-4 h-4 flex-shrink-0" />
                              <span className="text-xs">
                                Version {d.version_downloaded || app.version || 'N/A'}
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

      {/* Mobile Bottom Nav */}
      <MobileBottomNav activeTab={navActiveTab} />
    </>
  );
};

export default DownloadsPage;