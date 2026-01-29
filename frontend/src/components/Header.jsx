import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Search, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Header = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            {/* Top Bar - Flipkart Style Blue */}
            <div className="bg-[#2874f0] h-14 lg:h-16 flex items-center">
                <div className="container mx-auto px-4 md:px-0 lg:max-w-7xl flex items-center justify-between gap-4 lg:gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex flex-col items-start min-w-max">
                        <div className="flex items-center gap-1 italic">
                            <h1 className="text-xl font-black text-white">FertilizerMart</h1>
                        </div>
                        <p className="text-[10px] text-white/80 font-bold italic -mt-1 hover:text-white transition-colors">
                            Explore <span className="text-[#ffe500]">Plus</span> ✦
                        </p>
                    </Link>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative group">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for products, brands and more"
                                className="w-full bg-white px-4 py-2 rounded shadow-sm text-sm focus:outline-none placeholder:text-gray-500"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </form>

                    {/* Desktop Navigation */}
                    <div className="flex items-center space-x-8 text-white">
                        {isAuthenticated ? (
                            <div className="flex items-center space-x-6">
                                {isAdmin && (
                                    <Link to="/admin" className="flex items-center space-x-2 font-bold hover:text-[#ffe500]">
                                        <LayoutDashboard className="w-5 h-5" />
                                        <span>Dashboard</span>
                                    </Link>
                                )}

                                <div className="relative group">
                                    <button className="flex items-center space-x-2 bg-white text-[#2874f0] px-8 py-1.5 rounded-sm font-bold shadow transition-all hover:bg-gray-50">
                                        <span>{isAdmin ? 'Admin' : user?.name?.split(' ')[0]}</span>
                                        <svg className="w-2.5 h-2.5 fill-current transition-transform group-hover:rotate-180" viewBox="0 0 10 7">
                                            <path d="M5 7L0 0h10z" />
                                        </svg>
                                    </button>
                                    {/* Dropdown Menu */}
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-800 shadow-xl rounded py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-100">
                                        {!isAdmin && (
                                            <Link to="/profile" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 flex items-center gap-3">
                                                <User className="w-4 h-4 text-primary" />
                                                <span>My Profile</span>
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3">
                                            <LogOut className="w-4 h-4 text-primary" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-white text-[#2874f0] px-8 py-1.5 rounded-sm font-bold shadow transition-all hover:bg-gray-50">
                                Login
                            </Link>
                        )}

                        {!isAdmin && (
                            <Link to="/cart" className="flex items-center space-x-2 font-bold hover:text-[#ffe500] relative">
                                <div className="relative">
                                    <ShoppingCart className="w-5 h-5" />
                                    {getCartCount() > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-[#ff6161] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse border-2 border-[#2874f0]">
                                            {getCartCount()}
                                        </span>
                                    )}
                                </div>
                                <span className="hidden lg:inline">Cart</span>
                            </Link>
                        )}

                        <Link to="#" className="hidden xl:flex items-center space-x-2 font-bold hover:text-[#ffe500]">
                            <Sprout className="w-5 h-5" />
                            <span>Become a Seller</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
