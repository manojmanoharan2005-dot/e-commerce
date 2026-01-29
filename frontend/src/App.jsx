import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import Settings from './pages/Settings';
import Addresses from './pages/Addresses';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';


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

  return <Home />;
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
              path="/wishlist"
              element={
                <ProtectedRoute userOnly>
                  <Wishlist />
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

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400">
              © 2026 FertilizerMart - AI-Powered Agricultural Solutions
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Empowering farmers with intelligent shopping
            </p>
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
