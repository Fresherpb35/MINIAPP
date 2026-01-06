import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Upload, TrendingUp, Heart, Star, Bell, Shield, HelpCircle, LogOut, User, Mail, Edit2, Save, X, Camera, Phone, FileText, Lock } from 'lucide-react';

import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import SettingItem from '../components/ui/SettingItem';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', phone: '', bio: '', avatar_url: null });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', bio: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setEditForm({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          bio: data.user.bio || ''
        });
      } else {
        navigate('/signin');
      }
    } catch (err) {
      console.error('Fetch user error:', err);
      navigate('/signin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCurrentUser(); }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || ''
      });
    }
    setIsEditing(!isEditing);
    setMessage({ type: '', text: '' });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch('http://localhost:4000/api/auth/updatedetails', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.user);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (err) {
      console.error('Update profile error:', err);
      setMessage({ type: 'error', text: 'An error occurred while updating profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      setMessage({ type: 'error', text: 'Please upload a valid image file (jpg, png, gif)' });
      return;
    }

    setUploadingAvatar(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem('access_token');

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('http://localhost:4000/api/auth/avatar/upload', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser({ ...user, avatar_url: data.avatar_url });
        setMessage({ type: 'success', text: 'Avatar uploaded successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to upload avatar' });
      }
    } catch (err) {
      console.error('Upload avatar error:', err);
      setMessage({ type: 'error', text: 'An error occurred while uploading avatar' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    setUpdatingPassword(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem('access_token');

    try {
      const res = await fetch('http://localhost:4000/api/auth/updatepassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setShowPasswordModal(false);
        setNewPassword('');
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (err) {
      console.error('Update password error:', err);
      setMessage({ type: 'error', text: 'An error occurred while updating password' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token');
    try {
      await fetch('http://localhost:4000/api/auth/logout', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      navigate('/signin');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-gray-50">
        <Header title="Settings" showNotification={false} />
        <div className="lg:ml-64">
          <main className="px-6 py-6 pb-24 lg:pb-6 max-w-4xl mx-auto">
            <h1 className="hidden lg:block text-3xl font-bold text-gray-900 mb-8">Settings</h1>

            {/* Message Alert */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message.text}
              </div>
            )}

            {/* Profile Section */}
            <section className="mb-10">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center border-2 border-dashed border-gray-400 overflow-hidden">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : <User size={40} className="text-gray-500" />}
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera size={16} className="text-white" />
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                    </label>
                    {uploadingAvatar && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                          <textarea
                            value={editForm.bio}
                            onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          />
                        </div>
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save size={18} />
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-900">{user.name}</h2>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail size={16} />
                          <span className="text-sm">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone size={16} />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        )}
                        {user.bio && (
                          <div className="flex items-start gap-2 text-gray-600">
                            <FileText size={16} className="mt-0.5" />
                            <span className="text-sm">{user.bio}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Lock size={18} />
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Developer Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Developer</h2>
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 divide-y divide-gray-200">
                <SettingItem icon={Code} label="Developer Console" onClick={() => navigate('/developer-console')} />
                <SettingItem icon={Upload} label="Upload App" onClick={() => navigate('/upload-app')} />
                <SettingItem icon={TrendingUp} label="Analytics" onClick={() => navigate('/analytics')} />
              </div>
            </section>

            {/* Account Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Account</h2>
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 divide-y divide-gray-200">
                <SettingItem icon={Heart} label="Wishlist" onClick={() => navigate('/wishlist')} />
                <SettingItem icon={Star} label="My Reviews" onClick={() => navigate('/ratings-reviews')} />
                <SettingItem icon={Bell} label="Notifications" onClick={() => navigate('/notifications')} />
                <SettingItem icon={Shield} label="Privacy & Security" onClick={() => navigate('/privacy-policy')} />
                <SettingItem icon={HelpCircle} label="Help & Support" onClick={() => navigate('/help-support')} />
              </div>
            </section>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full py-4 bg-red-100 text-red-600 font-semibold rounded-2xl hover:bg-red-200 transition-colors flex items-center justify-center gap-3"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </main>
        </div>
      </div>
      <MobileBottomNav />

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
              <button onClick={() => { setShowPasswordModal(false); setNewPassword(''); setMessage({ type: '', text: '' }); }} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handlePasswordUpdate}
                disabled={updatingPassword}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsPage;