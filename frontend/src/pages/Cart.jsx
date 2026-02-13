import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, Loader, ShieldCheck, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await api.get('/products');
                setRecommendations((response.data?.data || []).slice(0, 4));
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };
        fetchRecommendations();
    }, []);

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    const handlePlaceOrder = () => {
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
                <div className="bg-white p-12 lg:p-16 rounded-[3rem] shadow-xl shadow-slate-200/50 text-center max-w-lg w-full border border-slate-100 relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors"></div>
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <ShoppingBag className="w-10 h-10 text-slate-300" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-3 italic tracking-tight">Your Cart is Empty</h2>
                    <p className="text-slate-400 font-medium mb-10">It looks like you haven't added any products to your cart yet.</p>
                    <Link
                        to="/products"
                        className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1 block sm:inline-block"
                    >
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    const totalMRP = cart.reduce((sum, item) => sum + (item.price * 1.3 * item.quantity), 0);
    const totalDiscount = totalMRP - getCartTotal();

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-10 items-start">

                    {/* Left Side: Cart Items */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <div className="flex items-center justify-between p-8 border-b border-slate-50">
                                <h1 className="text-2xl font-black text-slate-900 italic tracking-tight">
                                    My Cart <span className="text-xs font-bold text-slate-400 not-italic ml-2 normal-case">({cart.length} items)</span>
                                </h1>
                                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                    <MapPin className="w-4 h-4 text-accent" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{user?.address?.city || 'Region Tracking'}</span>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {cart.map((item) => (
                                    <div key={item._id} className="p-8 hover:bg-slate-50/50 transition-colors group">
                                        <div className="flex gap-8">
                                            <div className="flex flex-col items-center gap-6">
                                                <div className="w-32 h-32 flex items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="max-w-[70%] max-h-[70%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors disabled:opacity-20"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-black text-slate-700">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors disabled:opacity-20"
                                                        disabled={item.quantity >= item.stock}
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2">{item.category}</p>
                                                        <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
                                                        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            <span>High Quality</span>
                                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                            <span>Certified</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-slate-300 line-through font-bold">₹{(item.price * 1.3).toFixed(0)}</p>
                                                        <p className="text-2xl font-black text-primary">₹{item.price}</p>
                                                        <span className="inline-block mt-2 bg-accent/10 text-accent px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border border-accent/20">-30% Discount</span>
                                                    </div>
                                                </div>

                                                <div className="mt-8 flex items-center gap-8 border-t border-slate-100 pt-6">
                                                    <button
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="flex items-center gap-2 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-rose-500 transition-colors group/del"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 group-hover/del:animate-bounce" />
                                                        Remove
                                                    </button>
                                                    <button className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-primary transition-colors">
                                                        Save for later
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cart Action Footer */}
                            <div className="bg-slate-50 p-6 lg:px-8 border-t border-slate-100 flex items-center justify-between gap-6">
                                <button
                                    onClick={() => {
                                        clearCart();
                                        navigate('/products');
                                    }}
                                    className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-900 transition-colors"
                                >
                                    Clear Cart
                                </button>
                                <button
                                    onClick={handlePlaceOrder}
                                    className="bg-primary text-white px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 hover:bg-primary-dark transition-all transform hover:-translate-y-1 flex items-center gap-3"
                                >
                                    Checkout
                                    <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                                        <Plus className="w-3 h-3 text-accent" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:w-[400px] w-full sticky top-28">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                            <div className="p-8 border-b border-slate-50">
                                <h2 className="text-slate-900 font-black uppercase text-xs tracking-[0.2em] italic">Order Summary</h2>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span className="text-sm">Price</span>
                                    <span className="text-sm font-black text-slate-700">₹{totalMRP.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium">
                                    <span className="text-sm">Discount</span>
                                    <span className="text-sm font-black text-accent">- ₹{totalDiscount.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 font-medium pb-4">
                                    <span className="text-sm">Delivery</span>
                                    <span className="text-sm font-black text-accent uppercase tracking-widest text-[10px]">Free</span>
                                </div>
                                <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                                    <div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Amount</span>
                                        <span className="text-3xl font-black text-primary italic">₹{getCartTotal().toFixed(0)}</span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                        <ShieldCheck className="w-6 h-6 text-accent" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-accent/5 p-6 border-t border-slate-50 text-center">
                                <p className="text-accent font-black text-[10px] uppercase tracking-[0.15em]">
                                    You save: ₹{totalDiscount.toFixed(0)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 bg-primary rounded-[2rem] p-6 text-white text-center shadow-xl shadow-primary/10 relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col items-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-60">Verified Security</p>
                                <p className="text-xs font-medium text-white/80 leading-relaxed px-4">
                                    Secure payments and 24/7 farming support.
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/20 rounded-full blur-3xl"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};


export default Cart;
