import { Link, useLocation } from 'react-router-dom';
import { Package, User, Heart, MapPin, Power, CreditCard, Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserSidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-full space-y-4 sticky top-20">
            {/* User Hello Card */}
            <div className="bg-white p-3 flex items-center gap-4 shadow-sm rounded-sm">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=2874f0&color=fff`}
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Hello,</span>
                    <span className="text-base font-black text-gray-900 truncate max-w-[140px]">{user?.name}</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                {/* Orders Section */}
                <Link
                    to="/my-orders"
                    className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 group transition-all"
                >
                    <div className="flex items-center gap-4">
                        <Package className={`w-5 h-5 ${isActive('/my-orders') ? 'text-[#2874f0]' : 'text-[#2874f0]'}`} />
                        <span className={`text-sm font-black uppercase tracking-tight ${isActive('/my-orders') ? 'text-[#2874f0]' : 'text-gray-500 group-hover:text-[#2874f0]'}`}>My Orders</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>

                {/* Account Settings Section */}
                <div className="border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-4 p-4 text-[#2874f0]">
                        <User className="w-5 h-5" />
                        <span className="text-sm font-black uppercase tracking-tight">Account Settings</span>
                    </div>
                    <nav className="pl-14 space-y-1">
                        <Link
                            to="/profile"
                            className={`block py-2 text-sm ${isActive('/profile') ? 'bg-blue-50 text-[#2874f0] font-black' : 'text-gray-900 hover:text-[#2874f0] font-medium'}`}
                        >
                            Profile Information
                        </Link>

                        <Link
                            to="/coupons"
                            className={`block py-2 text-sm ${isActive('/coupons') ? 'bg-blue-50 text-[#2874f0] font-black' : 'text-gray-900 hover:text-[#2874f0] font-medium'}`}
                        >
                            Coupons & Rewards
                        </Link>
                    </nav>
                </div>

                {/* Notifications & Support Section */}
                <div className="border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-4 p-4 text-[#2874f0]">
                        <Bell className="w-5 h-5" />
                        <span className="text-sm font-black uppercase tracking-tight">Support & Settings</span>
                    </div>
                    <nav className="pl-14 space-y-1">
                        <Link to="#" className="block py-2 text-sm text-gray-900 hover:text-[#2874f0] font-medium">Notification Preferences</Link>
                        <Link to="#" className="block py-2 text-sm text-gray-900 hover:text-[#2874f0] font-medium">Help Center</Link>
                    </nav>
                </div>

                {/* My Stuff Section */}
                <div className="border-b border-gray-100 pb-2">
                    <div className="flex items-center gap-4 p-4 text-[#2874f0]">
                        <Bell className="w-5 h-5" />
                        <span className="text-sm font-black uppercase tracking-tight">My Stuff</span>
                    </div>
                    <nav className="pl-14 space-y-1">
                        <Link
                            to="/wishlist"
                            className={`block py-2 text-sm ${isActive('/wishlist') ? 'bg-blue-50 text-[#2874f0] font-black' : 'text-gray-900 hover:text-[#2874f0] font-medium'}`}
                        >
                            My Wishlist
                        </Link>
                        <Link to="#" className="block py-2 text-sm text-gray-900 hover:text-[#2874f0] font-medium">My Reviews & Ratings</Link>
                    </nav>
                </div>

                {/* Logout Section */}
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 p-4 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all border-t border-gray-50 mt-4"
                >
                    <Power className="w-5 h-5" />
                    <span className="text-sm font-black uppercase tracking-tight">Logout</span>
                </button>
            </div>

            <p className="text-[11px] text-gray-400 font-bold px-4 py-2 uppercase tracking-widest">Version 2.4.1 (Stable)</p>
        </div>
    );
};

export default UserSidebar;
