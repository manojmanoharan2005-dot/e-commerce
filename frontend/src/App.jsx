import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Addresses from './pages/Addresses';
import Wishlist from './pages/Wishlist';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';

import './App.css';

const ProtectedRoute = ({ children, adminOnly, userOnly }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-agri-surface">
        <div className="w-10 h-10 border-4 border-agri-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectTo)}`} replace />;
  }
  if (userOnly && isAdmin) return <Navigate to="/admin" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/products" replace />;

  return children;
};

const AppLayout = () => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (!loading && isAuthenticated && isAdmin && !isAdminRoute) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-agri-surface">
      {!isAuthPage && !isAdminRoute && <Header />}
      
      <div className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Farmer (authenticated, non-admin) */}
          <Route path="/cart" element={
            <ProtectedRoute userOnly>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute userOnly>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/order-success" element={
            <ProtectedRoute userOnly>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          <Route path="/my-orders" element={
            <ProtectedRoute userOnly>
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute userOnly>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute userOnly>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/addresses" element={
            <ProtectedRoute userOnly>
              <Addresses />
            </ProtectedRoute>
          } />
          <Route path="/wishlist" element={
            <ProtectedRoute userOnly>
              <Wishlist />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAuthPage && !isAdminRoute && <AIAssistant />}
      {!isAuthPage && !isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppLayout />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
