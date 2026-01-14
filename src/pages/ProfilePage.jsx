// src/pages/SettingsPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code, Upload, Heart, Star, Bell, Shield, HelpCircle,
  LogOut, User, Mail, Edit2, Save, X, Camera, Phone, FileText, Lock, Users, CheckCircle2, AlertCircle
} from 'lucide-react';

import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import MobileBottomNav from '../components/layout/MobileBottomNav';
import SettingItem from '../components/ui/SettingItem';
import api from '../config/api'; // Axios instance

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    avatar_url: null,
    role: 'user'
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Fetch current user
  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return navigate('/signin');

    try {
      const { data } = await api.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.user) {
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

  useEffect(() => {
    fetchCurrentUser();
  }, []);

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
      const { data } = await api.put('/api/auth/updatedetails', editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (err) {
      console.error('Update profile error:', err);
      const msg = err.response?.data?.message || 'An error occurred while updating profile';
      setMessage({ type: 'error', text: msg });
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
      const { data } = await api.put('/api/auth/avatar/upload', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
      });

      if (data.success) {
        setUser({ ...user, avatar_url: data.avatar_url });
        setMessage({ type: 'success', text: 'Avatar uploaded successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to upload avatar' });
      }
    } catch (err) {
      console.error('Upload avatar error:', err);
      const msg = err.response?.data?.message || 'An error occurred while uploading avatar';
      setMessage({ type: 'error', text: msg });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm('Are you sure you want to remove your profile picture?')) return;

    setUploadingAvatar(true);
    setMessage({ type: '', text: '' });
    const token = localStorage.getItem('access_token');

    try {
      const { data } = await api.delete('/api/auth/avatar/remove', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUser({ ...user, avatar_url: null });
        setMessage({ type: 'success', text: 'Profile picture removed successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to remove profile picture' });
      }
    } catch (err) {
      console.error('Remove avatar error:', err);
      const msg = err.response?.data?.message || 'An error occurred while removing profile picture';
      setMessage({ type: 'error', text: msg });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token');
    try {
      await api.get('/api/auth/logout', { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      navigate('/signin');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your settings...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
        <Header title="Settings" showNotification={false} />
        <div className="lg:ml-64">
          <main className="px-4 sm:px-6 py-6 pb-24 lg:pb-8 max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="hidden lg:block text-4xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Settings
              </h1>
              <p className="hidden lg:block text-gray-600">Manage your account and preferences</p>
            </div>

            {/* Message Alert */}
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 shadow-sm animate-in slide-in-from-top duration-300 ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle2 size={20} className="flex-0 mt-0.5" />
                ) : (
                  <AlertCircle size={20} className="flex-0 mt-0.5" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            {/* Profile Section */}
            <section className="mb-8">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-lg shadow-blue-100/50 overflow-hidden">
                <div className="bg-linear-to-r from-blue-600 to-purple-600 h-24 sm:h-32"></div>
                
                <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 -mt-12 sm:-mt-16">
                  <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6 mb-6">
                    {/* Avatar */}
                    <div className="relative flex-0 group cursor-pointer">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-linear-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={48} className="text-blue-600" />
                        )}
                      </div>
                      
                      <label className="absolute bottom-0 right-0 p-2.5 bg-linear-to-r from-blue-600 to-purple-600 rounded-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-110">
                        <Camera size={18} className="text-white" />
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif"
                          onChange={handleAvatarUpload}
                          disabled={uploadingAvatar}
                          className="hidden"
                        />
                      </label>

                      {user.avatar_url && !uploadingAvatar && (
                        <button
                          onClick={handleRemoveAvatar}
                          className="absolute top-0 left-0 p-2 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-red-600 cursor-pointer"
                          title="Remove profile picture"
                        >
                          <X size={18} className="text-white" />
                        </button>
                      )}

                      {uploadingAvatar && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                          {user.name || 'Your Profile'}
                        </h2>
                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-linear-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200">
                            {user.role || 'user'}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={handleEditToggle}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer self-start sm:self-auto"
                      >
                        {isEditing ? <X size={18} /> : <Edit2 size={18} />}
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    {isEditing ? (
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <InputField
                            label="Full Name"
                            value={editForm.name}
                            onChange={(val) => setEditForm({ ...editForm, name: val })}
                            icon={User}
                          />
                          <InputField
                            label="Email Address"
                            value={editForm.email}
                            onChange={(val) => setEditForm({ ...editForm, email: val })}
                            type="email"
                            icon={Mail}
                          />
                        </div>
                        <InputField
                          label="Phone Number"
                          value={editForm.phone}
                          onChange={(val) => setEditForm({ ...editForm, phone: val })}
                          type="tel"
                          icon={Phone}
                        />
                        <TextareaField
                          label="Bio"
                          value={editForm.bio}
                          onChange={(val) => setEditForm({ ...editForm, bio: val })}
                          icon={FileText}
                        />
                        <button
                          onClick={handleSaveProfile}
                          disabled={saving}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <Save size={20} /> {saving ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                      </div>
                    ) : (
                      <DisplayProfile user={user} />
                    )}
                  </div>
                </div>
              </div>
            </section>

            {user.role === 'developer' && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Code size={24} className="text-blue-600" />
                  Developer Tools
                </h2>
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg shadow-blue-100/50 divide-y divide-gray-200">
                  <SettingItem
                    icon={Code}
                    label="Developer Console"
                    onClick={() => navigate('/developer-console')}
                  />
                  <SettingItem
                    icon={Upload}
                    label="Upload App"
                    onClick={() => navigate('/upload-app')}
                  />
                </div>
              </section>
            )}

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={24} className="text-purple-600" />
                Account Settings
              </h2>
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg shadow-purple-100/50 divide-y divide-gray-200">
                <SettingItem icon={Heart} label="Wishlist" onClick={() => navigate('/wishlist')} />
                <SettingItem
                  icon={Star}
                  label="My Reviews"
                  onClick={() => navigate('/ratings-reviews')}
                />
                <SettingItem
                  icon={Bell}
                  label="Notifications"
                  onClick={() => navigate('/notifications')}
                />
                <SettingItem
                  icon={Shield}
                  label="Privacy & Security"
                  onClick={() => navigate('/privacy-policy')}
                />
                <SettingItem
                  icon={HelpCircle}
                  label="Help & Support"
                  onClick={() => navigate('/help-support')}
                />
              </div>
            </section>

            <button
              onClick={handleLogout}
              className="w-full py-4 bg-linear-to-r from-red-500 to-pink-500 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 cursor-pointer"
            >
              <LogOut size={20} /> Log Out
            </button>
          </main>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

// ────────────────────────────────────────────────
// Reusable components (added cursor-pointer where appropriate)
// ────────────────────────────────────────────────

const InputField = ({ label, value, onChange, type = 'text', icon: Icon }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <Icon size={18} />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
      />
    </div>
  </div>
);

const TextareaField = ({ label, value, onChange, icon: Icon }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute left-4 top-4 text-gray-400 pointer-events-none">
          <Icon size={18} />
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
      />
    </div>
  </div>
);

const DisplayProfile = ({ user }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <InfoCard icon={Mail} label="Email" value={user.email || 'Not set'} />
      <InfoCard icon={Phone} label="Phone" value={user.phone || 'Not set'} />
    </div>
    
    {user.bio && (
      <div className="p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <FileText size={20} className="text-blue-600 mt-0.5 flex-0" />
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Bio</p>
            <p className="text-gray-800">{user.bio}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon size={18} className="text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-gray-900 font-medium truncate">{value}</p>
      </div>
    </div>
  </div>
);

export default SettingsPage;