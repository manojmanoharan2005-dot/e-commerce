import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Sprout, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';

import Settings from './pages/Settings';
import Addresses from './pages/Addresses';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import NotificationTicker from './components/NotificationTicker';


// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Admin trying to access user-only pages
  if (userOnly && isAdmin) {
    return <Navigate to="/admin" />;
  }

  // Non-admin trying to access admin pages
  if (adminOnly && !isAdmin) {
    return <Navigate to="/products" />;
  }

  return children;
};

// Home Route - Redirect based on role
const HomeRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (isAdmin) return <Navigate to="/admin" />;
    return <Products />;
  }

  return <Products />;
};

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute userOnly>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-orders"
              element={
                <ProtectedRoute userOnly>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute userOnly>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute userOnly>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/addresses"
              element={
                <ProtectedRoute userOnly>
                  <Addresses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute userOnly>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <NotificationTicker />

        {/* Premium Footer */}
        <footer className="bg-primary text-white py-16 mt-auto border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
          <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 mb-6 group">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Sprout className="w-5 h-5 text-accent" />
                </div>
                <span className="text-2xl font-black tracking-tight italic">Agri<span className="text-accent">Store</span></span>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] leading-relaxed">
                  © 2026 AgriStore <span className="text-white/20 mx-2">|</span> High-Yield Agricultural Solutions
                </p>
                <p className="text-slate-500 text-[10px] font-medium tracking-wide italic">
                  Empowering the future of agriculture through precision supply chain and intelligent resource management.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-6 opacity-30">
                <ShieldCheck className="w-5 h-5" />
                <Sparkles className="w-5 h-5" />
                <MapPin className="w-5 h-5" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
