// src/pages/DeveloperConsolePage.jsx
import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import api from '../config/api'; // Axios instance

const DeveloperConsolePage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Shared apps data
  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState(null);

  // Dashboard extra stats (optional)
  const [dashboardStats, setDashboardStats] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const fetchApps = async () => {
    setAppsLoading(true);
    setAppsError(null);

    try {
      const response = await api.get('/api/developers/apps');
      if (response.data?.success && Array.isArray(response.data.data)) {
        setApps(response.data.data);
      } else {
        setApps([]);
      }
    } catch (err) {
      console.error('Failed to fetch apps:', err);
      setAppsError(err.response?.data?.message || 'Failed to load your apps');
      setApps([]);
    } finally {
      setAppsLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    setDashboardLoading(true);
    try {
      const response = await api.get('/api/developers/dashboard');
      if (response.data?.data) {
        setDashboardStats(response.data.data);
      }
    } catch (err) {
      console.warn('Dashboard stats not available:', err);
      // We continue with client-side calculated values
    } finally {
      setDashboardLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'myapp') {
      fetchApps();
    }

    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeTab]);

  // Derived values from apps list (most reliable source)
  const totalApps = apps.length;
  const publishedApps = apps.filter(app => app.status === 'published').length;
  const pendingApps = apps.filter(app =>
    ['pending', 'review', 'in_review'].includes(app.status)
  ).length;

  // Use backend values when available, fallback to calculated
  const totalDownloads =
    dashboardStats?.totalDownloads ??
    apps.reduce((sum, app) => sum + (Number(app.downloads) || 0), 0);

  const totalRevenue = dashboardStats?.totalRevenue ?? 0;

  const averageRating = dashboardStats?.averageRating ?? (() => {
    if (apps.length === 0) return 'N/A';

    const validRatings = apps
      .map(app => parseFloat(app.average_rating))
      .filter(r => !isNaN(r) && r > 0);

    if (validRatings.length === 0) return 'N/A';

    return (validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(1);
  })();

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-300">
        <Header title="Developer Console" showNotification={false} />

        <div className="lg:ml-64">
          <main className="pb-24 lg:pb-6">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900 px-6 pt-6 mb-4">
              Developer Console
            </h1>

            {/* Tabs */}
            <div className="flex gap-4 px-6 pt-6">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'bg-transparent text-gray-700 hover:bg-white/60'
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab('myapp')}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'myapp'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'bg-transparent text-gray-700 hover:bg-white/60'
                }`}
              >
                My Apps
              </button>

           
            </div>

            <div className="px-6 py-8 min-h-[60vh]">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>

                  {(appsLoading || dashboardLoading) && (
                    <p className="text-gray-600 mb-6">Loading dashboard data...</p>
                  )}

                  {appsError && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-xl mb-6">
                      <strong>Note:</strong> {appsError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Total Apps" value={totalApps} color="text-gray-900" />
                    <StatCard title="Published" value={publishedApps} color="text-green-600" />
                    <StatCard title="Pending Review" value={pendingApps} color="text-yellow-600" />
                    <StatCard title="Total Downloads" value={totalDownloads.toLocaleString()} color="text-blue-600" />
                    <StatCard title="Total Revenue" value={`$${Number(totalRevenue).toFixed(2)}`} color="text-green-600" />
                    <StatCard title="Average Rating" value={`⭐ ${averageRating}`} color="text-purple-600" />
                  </div>
                </div>
              )}

              {/* My Apps Tab */}
              {activeTab === 'myapp' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">My Apps</h2>

                  {appsLoading && <p className="text-gray-600">Loading your apps...</p>}
                  {appsError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
                      <strong>Error:</strong> {appsError}
                    </div>
                  )}

                  {!appsLoading && apps.length === 0 ? (
                    <p className="text-gray-600 text-center py-12">You haven't published any apps yet.</p>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-4 mb-8 max-w-md">
                        <MiniStat title="Total" value={totalApps} />
                        <MiniStat title="Published" value={publishedApps} color="text-green-600" />
                        <MiniStat title="Pending" value={pendingApps} color="text-yellow-600" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {apps.map(app => (
                          <div
                            key={app.id}
                            className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
                          >
                            <h3 className="font-semibold text-lg text-gray-900">{app.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Version: {app.version || '1.0.0'}
                            </p>

                            <div className="mt-4 flex items-center justify-between">
                              <span
                                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                                  app.status === 'published'
                                    ? 'bg-green-100 text-green-800'
                                    : ['pending', 'review', 'in_review'].includes(app.status)
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {app.status
                                  ? app.status.charAt(0).toUpperCase() + app.status.slice(1)
                                  : 'Unknown'}
                              </span>
                              <span className="text-sm text-gray-600">
                                ⭐ {app.average_rating ? parseFloat(app.average_rating).toFixed(1) : 'N/A'}
                              </span>
                            </div>

                            <div className="mt-4 text-sm text-gray-600">
                              Downloads: <strong>{(app.downloads ?? 0).toLocaleString()}</strong>
                            </div>

                            <div className="text-xs text-gray-400 mt-3">
                              Created:{' '}
                              {app.created_at
                                ? new Date(app.created_at).toLocaleDateString()
                                : 'N/A'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="text-center py-20 text-gray-600">
                  <p className="text-lg font-medium">Analytics coming soon!</p>
                  <p className="mt-2">Detailed insights & charts will be available here</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <MobileBottomNav />
    </>
  );
};

// Small helper components
const StatCard = ({ title, value, color = 'text-gray-900' }) => (
  <div className="bg-white p-6 rounded-xl shadow">
    <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

const MiniStat = ({ title, value, color = 'text-gray-900' }) => (
  <div className="bg-white p-4 rounded-xl shadow text-center">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-sm text-gray-600 mt-1">{title}</p>
  </div>
);

export default DeveloperConsolePage;