import { Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from '../pages/SignInPage';
import SignUpPage from '../pages/SignUpPage';
import LoginViaOTPPage from '../pages/LoginViaOTPPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import HomePage from '../pages/HomePage';
import DownloadsPage from '../pages/DownloadsPage';
import CategoriesPage from '../pages/CategoriesPage';
import ProfilePage from '../pages/ProfilePage';
import SearchPage from '../pages/SearchPage';
import HelpSupportPage from '../pages/HelpSupportPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import NotificationsPage from '../pages/NotificationsPage';
import WishlistPage from '../pages/WishlistPage';
import UploadAppPage from '../pages/UploadAppPage';
import DeveloperConsolePage from '../pages/DeveloperConsolePage';
import RatingsReviewsPage from '../pages/RatingsReviewsPage';
import CategoryDetailPage from '../pages/CategoryDetailPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import AppStorePage from '../pages/TaskMaster'; // This is your individual app detail page

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Anyone can access */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/otp-login" element={<LoginViaOTPPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/category/:categoryName" element={<CategoryDetailPage />} />
      
      {/* THIS IS THE MISSING ROUTE */}
      <Route path="/app/:id" element={<AppStorePage />} />  {/* Individual app store page */}

      <Route path="/search" element={<SearchPage />} />
      <Route path="/help-support" element={<HelpSupportPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

      {/* Protected Routes - You can add auth guard later if needed */}
      <Route path="/download" element={<DownloadsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/upload-app" element={<UploadAppPage />} />
      <Route path="/developer-console" element={<DeveloperConsolePage />} />
      <Route path="/ratings-reviews" element={<RatingsReviewsPage />} />

      {/* Optional: Redirect old wrong path */}
      <Route path="/app-store" element={<Navigate to="/" replace />} />

      {/* Catch-all: Redirect unknown routes to home (or signin if you prefer) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;