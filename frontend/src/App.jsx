import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Splash & Onboarding
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';

// Public Pages
import Portal from './pages/Portal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import ProductDetails from './pages/ProductDetails';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutAddress from './pages/CheckoutAddress';
import CheckoutPayment from './pages/CheckoutPayment';
import CheckoutSuccess from './pages/CheckoutSuccess';
import OrderSuccess from './pages/OrderSuccess';
import PaymentFailed from './pages/PaymentFailed';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';
import OrderReceipt from './pages/OrderReceipt';
import Addresses from './pages/Addresses';
import ChangePassword from './pages/ChangePassword';
import Search from './pages/Search';
import Category from './pages/Category';
import AdminLogin from './pages/admin/AdminLogin';

// Layout & Protected Routes
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import AdminLayout from './components/AdminLayout';
import PWAInstallPrompt from './components/PWAInstallPrompt';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetails from './pages/admin/AdminUserDetails';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCreateCategory from './pages/admin/AdminCreateCategory';
import AdminEditCategory from './pages/admin/AdminEditCategory';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCreateProduct from './pages/admin/AdminCreateProduct';
import AdminProductDetails from './pages/admin/AdminProductDetails';
import AdminEditProduct from './pages/admin/AdminEditProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetails from './pages/admin/AdminOrderDetails';
import AdminReceipts from './pages/admin/AdminReceipts';
import AdminReceiptDetails from './pages/admin/AdminReceiptDetails';

// ── Inner component: has access to Router context so useNavigate works ─────────
// Receives the role chosen during onboarding and redirects once on mount.
function AppContent({ initialRole }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (initialRole === 'admin') {
      navigate('/admin/login', { replace: true });
    } else if (initialRole === 'customer') {
      navigate('/login', { replace: true });
    }
    // If no initialRole (e.g. user refreshed), stay at current URL
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 fade-in flex flex-col">
      <Navbar />
      <main className="grow pb-16 md:pb-0">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category/:categoryId" element={<Category />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/products/:productId" element={<ProductDetails />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/addresses" element={<Addresses />} />
            <Route path="/profile/change-password" element={<ChangePassword />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/address" element={<CheckoutAddress />} />
            <Route path="/checkout/payment" element={<CheckoutPayment />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/payment-failed/:orderId" element={<PaymentFailed />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:orderId" element={<OrderDetails />} />
            <Route path="/orders/:orderId/receipt" element={<OrderReceipt />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:userId" element={<AdminUserDetails />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="categories/create" element={<AdminCreateCategory />} />
              <Route path="categories/:categoryId/edit" element={<AdminEditCategory />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/create" element={<AdminCreateProduct />} />
              <Route path="products/:productId" element={<AdminProductDetails />} />
              <Route path="products/:productId/edit" element={<AdminEditProduct />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:orderId" element={<AdminOrderDetails />} />
              <Route path="receipts" element={<AdminReceipts />} />
              <Route path="receipts/:orderId" element={<AdminReceiptDetails />} />
            </Route>
          </Route>
        </Routes>
      </main>
      
      <MobileBottomNav />

      <style>{`
        .fade-in {
          animation: fadeIn 0.6s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── AppFlow component ──────────────────────────────────────────────────────────
// Handles Splash, Onboarding and auth-aware routing.
function AppFlow() {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // We use localStorage to remember if the user has seen the splash/onboarding this session
  // But if they are logged in, we always skip them.
  const [showSplash, setShowSplash] = useState(() => !localStorage.getItem('token') && location.pathname === '/');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [initialRole, setInitialRole] = useState(null);
  const [appReady, setAppReady] = useState(() => !!localStorage.getItem('token') || location.pathname !== '/');

  // If AuthContext resolves and user is logged in, skip everything
  useEffect(() => {
    if (!loading && user) {
      setShowSplash(false);
      setShowOnboarding(false);
      setAppReady(true);
    } else if (!loading && !user && !appReady && !showSplash && !showOnboarding) {
      // If we finished loading, no user, and app isn't ready, show splash
      setShowSplash(true);
    }
  }, [user, loading, appReady, showSplash, showOnboarding]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = (role) => {
    setInitialRole(role || 'customer');
    setShowOnboarding(false);
    setAppReady(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      {appReady && <AppContent initialRole={initialRole} />}
      {!showSplash && <PWAInstallPrompt />}
    </>
  );
}

// ── Root App component ─────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppFlow />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
