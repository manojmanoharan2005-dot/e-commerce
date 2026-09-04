import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, MapPin, Heart, Settings, Package, LogOut, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const menuLinks = [
  { to: '/profile', label: 'My Profile', icon: User },
  { to: '/my-orders', label: 'My Orders', icon: Package },
  { to: '/cart', label: 'Shopping Cart', icon: ShoppingCart }
];

const settingsLinks = [
  { to: '/addresses', label: 'Saved Addresses', icon: MapPin },
  { to: '/wishlist', label: 'My Wishlist', icon: Heart },
  { to: '/settings', label: 'Account Settings', icon: Settings }
];

const UserSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const name = user?.name || 'Account';
  const email = user?.email || '';

  const renderLink = (link) => {
    const isActive = location.pathname === link.to;
    const Icon = link.icon;

    return (
      <Link
        key={link.to}
        to={link.to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all ${
          isActive
            ? 'bg-agri-forest text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        <span className={`w-7 h-7 rounded-lg grid place-items-center ${
          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 border border-slate-200 text-slate-500'
        }`}>
          <Icon size={14} />
        </span>
        {link.label}
      </Link>
    );
  };

  return (
    <aside className="space-y-4 lg:sticky lg:top-28">
      {/* Account Info Card */}
      <div className="card p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-agri-forest text-white grid place-items-center font-black text-lg uppercase shadow-sm">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-slate-900 text-sm truncate">{name}</h3>
            <p className="text-xs text-slate-400 truncate">{email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="card p-4 space-y-4">
        <div>
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2 px-2">
            Dashboard
          </span>
          <nav className="space-y-1">{menuLinks.map(renderLink)}</nav>
        </div>

        <div className="pt-3 border-t border-slate-100">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2 px-2">
            Preferences
          </span>
          <nav className="space-y-1">{settingsLinks.map(renderLink)}</nav>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-rose-600 font-bold text-xs hover:bg-rose-50 transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-rose-100 border border-rose-200 grid place-items-center text-rose-600">
              <LogOut size={14} />
            </span>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
