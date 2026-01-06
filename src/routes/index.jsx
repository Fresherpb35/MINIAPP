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
import CategoryDetailPage from '../pages/CategoryDetailPage'; // Add this import
import AllAppsPage from '../pages/AllAppsPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login-otp" element={<LoginViaOTPPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
       <Route path="/" element={<HomePage />} />
         <Route path="/download" element={<DownloadsPage />} />
         <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
               <Route path="/search" element={<SearchPage />} />

                <Route path="/help-support" element={<HelpSupportPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/upload-app" element={<UploadAppPage />} />
      <Route path="/developer-console" element={<DeveloperConsolePage />} />
      <Route path="/ratings-reviews" element={<RatingsReviewsPage />} />

       <Route path="/category/:categoryName" element={<CategoryDetailPage />} />
       <Route path="/all-apps" element={<AllAppsPage />} />
       <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route path="/" element={<Navigate to="/signin" replace />} />
      
     
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
};

export default AppRoutes;