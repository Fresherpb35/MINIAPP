import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import SearchResultCard from '../components/ui/SearchResultCard';
import { searchApps } from '../services/appsService';

const SearchPage = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [allApps, setAllApps] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Load ALL apps ONCE (no q)
  useEffect(() => {
    const loadApps = async () => {
      try {
        setLoading(true);
        const res = await searchApps({
          sortBy: 'downloads',
          limit: 100, // adjust if needed
        });

        if (res.data.success) {
          setAllApps(res.data.data || []);
          setResults(res.data.data || []);
        }
      } catch (err) {
        setError('Unable to load apps');
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, []);

  // ✅ Client-side search (NO backend call)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults(allApps);
      return;
    }

    const q = searchQuery.toLowerCase();

    const filtered = allApps.filter(app =>
      app.name?.toLowerCase().includes(q)
    );

    setResults(filtered);
  }, [searchQuery, allApps]);

  const handleAppClick = (id) => {
    navigate(`/app/${id}`);
  };

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Search" showNotification />

        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 max-w-4xl mx-auto">

            <div className="mb-8">
              <div className="relative">
                <SearchIcon
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={22}
                />
                <input
                  type="text"
                  placeholder="Search apps..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 border rounded-2xl"
                />
              </div>
            </div>

            {loading && <p className="text-center">Loading…</p>}

            {!loading && results.length === 0 && (
              <p className="text-center text-gray-500">
                No apps found for "{searchQuery}"
              </p>
            )}

            {!loading && results.length > 0 && (
              <div className="space-y-4">
                {results.map(app => (
                  <SearchResultCard
                    key={app.id}
                    icon={app.icon_url || 'App'}
                    name={app.name}
                    description={app.description || 'No description'}
                    rating={app.rating || '0.0'}
                    downloads={app.download_count || 0}
                    onClick={() => handleAppClick(app.id)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default SearchPage;
