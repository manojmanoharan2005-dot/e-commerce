import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sprout, Search, ShoppingCart, User, Heart, LogOut, Shield, Menu, X, ChevronRight, Package, Settings, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getCartCount } = useCart();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = useMemo(() => getCartCount(), [getCartCount]);
  const displayName = user?.name || 'Account';
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Close mobile drawer and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowUserDropdown(false);
    setShowSearchDropdown(false);
  }, [location.pathname]);

  // Live search debounced
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get('/products', { params: { search: query } });
        setResults(data.products?.slice(0, 5) || []);
        setShowSearchDropdown(true);
      } catch {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setShowSearchDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-200">
      {/* Top Banner Ticker */}
      <div className="bg-[#09251D] text-emerald-300 py-1.5 px-3 sm:px-4 text-xs font-semibold overflow-hidden border-b border-emerald-950">
        <div className="page-container flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-white truncate">Direct-from-Manufacturer Farm Inputs • Doorstep Delivery</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-300">
            <span>Toll Free: 1800-AGRI-STORE</span>
            <span>|</span>
            <Link to="/products?category=Seeds" className="hover:text-emerald-400 transition-colors">Hybrid Seeds</Link>
            <Link to="/products?category=Organic" className="hover:text-emerald-400 transition-colors">Bio Organic</Link>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="page-container py-2.5 sm:py-3 space-y-2.5">
        {/* Row 1: Logo & Actions */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo & Brand */}
            <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-2 sm:gap-3 group shrink-0">
              <span className="h-9 w-9 sm:h-11 sm:w-11 rounded-xl sm:rounded-2xl bg-[#0F382C] text-emerald-400 grid place-items-center shadow-md group-hover:bg-[#09251D] transition-colors">
                <Sprout size={20} className="sm:hidden" />
                <Sprout size={24} className="hidden sm:block" />
              </span>
              <div className="leading-tight">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-agri-forest transition-colors block">
                  AgriStore
                </span>
                <span className="text-[9px] sm:text-[10px] font-extrabold tracking-[0.2em] text-agri-green block">
                  PREMIUM AGRI
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          {!isAdminRoute && (
            <div className="hidden md:block flex-1 max-w-2xl relative">
              <form onSubmit={onSearchSubmit} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder="Search seeds, fertilizers, pesticides, equipment..."
                  className="w-full pl-11 pr-24 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-sm font-medium outline-none focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green focus:bg-white transition-all shadow-sm"
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-agri-forest hover:bg-agri-forest-dark text-white rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5"
                >
                  Search
                </button>
              </form>

              {/* Desktop Live Search Dropdown */}
              {showSearchDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 p-2">
                  <p className="px-3 py-1.5 text-[11px] font-bold text-slate-400 tracking-wider uppercase">Products</p>
                  {results.map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => {
                        navigate(`/products/${item._id}`);
                        setShowSearchDropdown(false);
                        setQuery('');
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 grid place-items-center text-agri-forest text-xs font-bold shrink-0">
                          {item.category?.slice(0, 2)}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-slate-400">{item.category}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-agri-forest shrink-0">₹{item.price}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Icons: Wishlist, Cart & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {!isAdminRoute && (
              <>
                <Link
                  to="/wishlist"
                  title="Wishlist"
                  className="p-2 sm:p-2.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <Heart size={20} />
                </Link>

                {!isAdmin && (
                  <Link
                    to="/cart"
                    title="Shopping Cart"
                    className="p-2 sm:p-2.5 rounded-xl bg-agri-forest hover:bg-agri-forest-dark text-white transition-all shadow-sm relative flex items-center gap-2 min-h-[44px] min-w-[44px] justify-center"
                  >
                    <ShoppingCart size={20} />
                    <span className="hidden sm:inline font-bold text-xs">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-agri-gold text-white text-[10px] font-black rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center border-2 border-white shadow-sm">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}
              </>
            )}

            {/* Profile / Auth Menu */}
            {isAuthenticated ? (
              isAdmin ? (
                <Link
                  to="/admin"
                  className="bg-slate-900 hover:bg-black text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors min-h-[44px]"
                >
                  <Shield size={16} className="text-emerald-400" /> Admin
                </Link>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-1.5 p-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-800 min-h-[44px]"
                  >
                    <span className="w-7 h-7 rounded-lg bg-agri-green text-white font-black text-xs grid place-items-center uppercase">
                      {displayName.charAt(0)}
                    </span>
                    <span className="hidden sm:inline text-xs font-bold max-w-[90px] truncate">{displayName}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-slide-up">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
                        <User size={15} className="text-agri-green" /> Profile
                      </Link>
                      <Link to="/my-orders" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
                        <Package size={15} className="text-agri-green" /> My Orders
                      </Link>
                      <Link to="/addresses" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
                        <MapPin size={15} className="text-agri-green" /> Saved Addresses
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 rounded-xl hover:bg-rose-50 transition-colors mt-1 border-t border-slate-100"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-2 rounded-xl bg-agri-green hover:bg-agri-green-hover text-white text-xs font-bold shadow-sm transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Full Width Search Bar for Mobile */}
        {!isAdminRoute && (
          <div className="md:hidden relative">
            <form onSubmit={onSearchSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search seeds, fertilizers, equipment..."
                className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-xs font-medium outline-none focus:ring-2 focus:ring-agri-green/30 focus:border-agri-green focus:bg-white shadow-xs"
              />
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-agri-forest text-white rounded-lg font-bold text-[11px]"
              >
                Search
              </button>
            </form>

            {/* Mobile Live Search Dropdown */}
            {showSearchDropdown && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 p-2">
                {results.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      navigate(`/products/${item._id}`);
                      setShowSearchDropdown(false);
                      setQuery('');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center justify-between gap-2"
                  >
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</span>
                    <span className="text-xs font-extrabold text-agri-forest shrink-0">₹{item.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Secondary Navigation Links for Desktop */}
        {!isAdminRoute && (
          <nav className="hidden md:flex items-center gap-8 pt-3 border-t border-slate-100 text-xs font-bold text-slate-600">
            <Link to="/" className={`hover:text-agri-forest transition-colors ${location.pathname === '/' ? 'text-agri-forest font-extrabold border-b-2 border-agri-green pb-1' : ''}`}>
              Home
            </Link>
            <Link to="/products" className={`hover:text-agri-forest transition-colors ${location.pathname === '/products' && !location.search ? 'text-agri-forest font-extrabold border-b-2 border-agri-green pb-1' : ''}`}>
              All Products
            </Link>
            <Link to="/products?category=Seeds" className="hover:text-agri-forest transition-colors">
              Seeds & Saplings
            </Link>
            <Link to="/products?category=Fertilizer" className="hover:text-agri-forest transition-colors">
              Fertilizers
            </Link>
            <Link to="/products?category=Organic" className="hover:text-agri-forest transition-colors">
              Bio Organic
            </Link>
            <Link to="/products?category=Pesticide" className="hover:text-agri-forest transition-colors">
              Crop Protection
            </Link>
            <Link to="/products?category=Equipment" className="hover:text-agri-forest transition-colors">
              Tools & Machinery
            </Link>
          </nav>
        )}
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-xl animate-fade-in">
          <div className="space-y-1 font-bold text-sm text-slate-800">
            <Link to="/" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50">
              Home <ChevronRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/products" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50">
              Shop Marketplace <ChevronRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/wishlist" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50">
              My Wishlist <ChevronRight size={16} className="text-slate-400" />
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/my-orders" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50">
                  My Orders <ChevronRight size={16} className="text-slate-400" />
                </Link>
                <Link to="/profile" className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50">
                  My Account <ChevronRight size={16} className="text-slate-400" />
                </Link>
              </>
            )}
          </div>

          {!isAuthenticated && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <Link to="/login" className="btn-secondary text-center text-xs py-2.5">Login</Link>
              <Link to="/register" className="btn-accent text-center text-xs py-2.5">Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
