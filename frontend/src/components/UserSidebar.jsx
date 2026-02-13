import { Link, useLocation } from 'react-router-dom';
import { Package, User, Heart, MapPin, Power, ChevronRight, Sparkles, ShieldCheck, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserSidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ to, icon: Icon, label, active }) => (
        <Link
            to={to}
            className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${active ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' : 'hover:bg-slate-50 text-slate-500 hover:text-primary'}`}
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-white/10' : 'bg-slate-100 group-hover:bg-white'}`}>
                    <Icon className={`w-4 h-4 ${active ? 'text-accent' : ''}`} />
                </div>
                <span className={`text-xs font-black uppercase tracking-wider ${active ? 'text-white' : ''}`}>{label}</span>
            </div>
            {!active && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />}
        </Link>
    );

    return (
        <div className="w-full space-y-6 sticky top-24">
            {/* Premium User Card */}
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative group">


                <div className="relative flex items-center gap-4 z-10">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 p-1 border border-slate-200 group-hover:rotate-6 transition-transform">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.name}&background=0f172a&color=10b981&bold=true`}
                            alt="User"
                            className="w-full h-full object-cover rounded-xl"
                        />
                    </div>
                    <div className="flex flex-col">

                        <span className="text-lg font-black text-slate-900 truncate max-w-[140px] italic">{user?.name}</span>
                        <span className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">{user?.email}</span>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white p-3 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="space-y-1">
                    <div className="px-4 py-3">
                        <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Menu</h4>
                    </div>

                    <NavItem to="/profile" icon={User} label="My Profile" active={isActive('/profile')} />
                    <NavItem to="/my-orders" icon={Package} label="My Orders" active={isActive('/my-orders')} />

                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 space-y-1">
                    <div className="px-4 py-3">
                        <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Settings</h4>
                    </div>

                    <NavItem to="/addresses" icon={MapPin} label="Saved Addresses" active={isActive('/addresses')} />
                </div>

                <div className="mt-6 p-2">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all font-black uppercase text-xs tracking-widest border border-transparent hover:border-rose-100"
                    >
                        <div className="p-2 bg-rose-100 rounded-xl">
                            <Power className="w-4 h-4" />
                        </div>
                        Logout
                    </button>
                </div>
            </div>

            <div className="px-6 py-2 flex items-center justify-between opacity-40 group">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">System v2.5.0</p>
                <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-accent group-hover:scale-150 transition-transform"></div>
                    <div className="w-1 h-1 rounded-full bg-primary group-hover:scale-150 transition-transform delay-75"></div>
                </div>
            </div>
        </div>
    );
};

export default UserSidebar;
