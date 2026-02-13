import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Search, Sprout } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const Header = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.length > 1) {
                setIsSearching(true);
                try {
                    const response = await api.get(`/products?search=${searchQuery}`);
                    setSearchResults((response.data?.data || []).slice(0, 5));
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

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
        <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-lg py-2' : 'bg-white py-4'}`}>
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex items-center justify-between gap-8">
                    {/* Logo - Modern & Minimalist */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-primary/20">
                            <Sprout className="w-6 h-6 text-accent" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight text-primary leading-none">Agri<span className="text-accent text-gradient">Store</span></span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Premium Quality</span>
                        </div>
                    </Link>

                    {/* Search Bar - Sophisticated */}
                    <form onSubmit={handleSearch} className="flex-1 max-w-xl relative hidden md:block group">
                        <div className="relative overflow-hidden rounded-2xl bg-slate-100 border border-transparent focus-within:border-accent/30 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-accent/5 transition-all duration-300">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search premium products..."
                                className="w-full bg-transparent px-5 py-3 text-sm focus:outline-none placeholder:text-slate-400 font-medium"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Search Results Dropdown */}
                        {(isSearching || searchResults.length > 0) && (
                            <div className="absolute top-full left-0 w-full bg-white shadow-2xl rounded-2xl border border-slate-100 overflow-hidden z-[100] mt-3 animate-fade-in">
                                {isSearching && (
                                    <div className="p-6 text-center">
                                        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    </div>
                                )}
                                {!isSearching && searchResults.map(p => (
                                    <Link
                                        key={p._id}
                                        to={`/products/${p._id}`}
                                        onClick={() => setSearchQuery('')}
                                        className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group"
                                    >
                                        <div className="w-12 h-12 bg-white rounded-lg p-1 border border-slate-100 flex items-center justify-center">
                                            <img src={p.imageUrl} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 group-hover:text-accent transition-colors">{p.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{p.category}</p>
                                        </div>
                                        <span className="text-primary font-black text-sm">₹{p.price}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </form>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-3 lg:gap-6">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <Link to="/admin" className="hidden lg:flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors">
                                        <LayoutDashboard className="w-5 h-5" />
                                        <span className="text-sm">Dashboard</span>
                                    </Link>
                                )}

                                <div className="relative group">
                                    <button className="flex items-center gap-3 bg-white border border-slate-200 pl-2 pr-4 py-1.5 rounded-2xl hover:border-accent hover:shadow-lg hover:shadow-accent/5 transition-all group">
                                        <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-colors">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{isAdmin ? 'Admin' : (user?.username || user?.name || 'User')}</span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute top-full right-0 mt-3 w-56 bg-white shadow-2xl rounded-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-slate-100 z-50 transform translate-y-2 group-hover:translate-y-0">
                                        {!isAdmin && (
                                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors font-medium">
                                                <User className="w-4 h-4" />
                                                <span>My Profile</span>
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors font-medium border-t border-slate-50 mt-1">
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-primary text-white px-8 py-2.5 rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:scale-95 text-sm">
                                Sign In
                            </Link>
                        )}

                        {!isAdmin && (
                            <Link to="/cart" className="relative group p-2">
                                <div className="p-2 bg-slate-100 rounded-2xl group-hover:bg-accent group-hover:text-white transition-all duration-300">
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                                {getCartCount() > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Mobile Search Toggle (Optional improvement) */}
                        <button className="md:hidden p-2 text-slate-600">
                            <Search className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};


export default Header;
