import { useState } from 'react';
import UserSidebar from '../components/UserSidebar';
import { Heart, Trash2, Star, ShoppingBag, Sparkles, ShieldCheck, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { addToCart } = useCart();
    const [wishlist, setWishlist] = useState([
        {
            _id: 'w1',
            name: 'Organic Neem Fertilizer - 100% Pure & Natural',
            price: 750,
            originalPrice: 999,
            imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=1974&auto=format&fit=crop',
            rating: 4.5,
            reviews: 1250,
            category: 'Organic'
        },
        {
            _id: 'w2',
            name: 'Premium NPK Soluble Fertilizer (19:19:19)',
            price: 1250,
            originalPrice: 1500,
            imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=2173&auto=format&fit=crop',
            rating: 4.8,
            reviews: 840,
            category: 'Chemical'
        }
    ]);

    const removeFromWishlist = (id) => {
        setWishlist(wishlist.filter(item => item._id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-8">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    <div className="lg:w-80 shrink-0 w-full">
                        <UserSidebar />
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        {/* Hero Header */}
                        <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
                                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Curated Collection</span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-black text-primary italic tracking-tighter leading-none mb-2">My <span className="text-accent">Wishlist</span></h1>
                                <p className="text-slate-400 text-xs font-medium tracking-wide">Reserved biological assets for future procurement.</p>
                            </div>
                            <div className="text-right z-10">
                                <span className="text-5xl font-black text-slate-100 italic tracking-tighter block leading-none">{wishlist.length}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Total Assets</span>
                            </div>
                            <Sparkles className="w-48 h-48 absolute -bottom-10 -right-10 text-slate-50 group-hover:rotate-12 transition-transform opacity-50" />
                        </div>

                        {wishlist.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {wishlist.map((item) => (
                                    <div key={item._id} className="bg-white rounded-[2.5rem] p-6 lg:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-accent/10 transition-all group relative overflow-hidden">
                                        <div className="flex flex-col md:flex-row gap-8 items-center">
                                            {/* Product Image */}
                                            <div className="w-40 h-40 bg-slate-50 rounded-[2rem] p-6 relative group-hover:scale-105 transition-transform duration-500 shrink-0">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:-rotate-3"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-white/80 backdrop-blur-md text-[8px] font-black text-primary px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100 shadow-sm">{item.category}</span>
                                                </div>
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 space-y-4 text-center md:text-left">
                                                <h3 className="text-xl lg:text-2xl font-black text-primary italic tracking-tighter leading-tight group-hover:text-accent transition-colors line-clamp-2">
                                                    {item.name}
                                                </h3>

                                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                                    <div className="flex items-center gap-1.5 bg-accent/10 text-accent font-black text-xs px-3 py-1 rounded-full border border-accent/10">
                                                        <span>{item.rating}</span>
                                                        <Star className="w-3 h-3 fill-current" />
                                                    </div>
                                                    <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest">|</span>
                                                    <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{item.reviews} Global Verified Reviews</span>
                                                </div>

                                                <div className="flex items-center justify-center md:justify-start gap-4">
                                                    <div className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">AgriStore Certified</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Pricing and Actions */}
                                            <div className="flex flex-col gap-4 min-w-[180px] w-full md:w-auto pt-6 md:pt-0 md:border-l border-slate-50 md:pl-8 items-center md:items-end justify-center">
                                                <div className="text-center md:text-right">
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Asset Value</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-3xl font-black text-primary italic tracking-tighter">₹{item.price}</span>
                                                        <span className="text-sm text-slate-300 font-bold line-through">₹{item.originalPrice}</span>
                                                    </div>
                                                    <span className="inline-block text-[10px] text-accent font-black uppercase tracking-widest mt-1">
                                                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% Performance Discount
                                                    </span>
                                                </div>

                                                <div className="flex gap-3 w-full justify-center md:justify-end mt-2">
                                                    <button
                                                        onClick={() => removeFromWishlist(item._id)}
                                                        className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-400 border border-rose-100 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all group/btn"
                                                    >
                                                        <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="flex-1 md:flex-none px-6 h-12 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-105 transition-all group/atc"
                                                    >
                                                        <ShoppingCart className="w-4 h-4 text-accent transition-transform group-hover/atc:rotate-12" />
                                                        Deploy to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-20 lg:p-32 text-center rounded-[3rem] border border-slate-100 shadow-xl group overflow-hidden relative">
                                <div className="z-10 relative">
                                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        <Heart className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter mb-2 uppercase">COLLECTION EMPTY</h3>
                                    <p className="text-slate-400 text-sm font-medium mb-12 italic">Your curated biological asset registry is currently blank.</p>
                                    <Link to="/products" className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all group/link">
                                        Scan Product Catalog
                                        <ArrowRight className="w-4 h-4 text-accent group-hover/link:translate-x-2 transition-transform" />
                                    </Link>
                                </div>
                                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 text-slate-50 opacity-50 select-none pointer-events-none" />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Wishlist;
