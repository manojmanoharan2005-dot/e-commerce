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
            <div className="min-h-[calc(100vh-64px)] bg-[#f1f3f6] flex items-center justify-center py-10">
                <div className="bg-white p-10 rounded-sm shadow-sm text-center max-w-md w-full">
                    <img
                        src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90"
                        alt="Empty Cart"
                        className="w-48 mx-auto mb-6"
                    />
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty!</h2>
                    <p className="text-sm text-gray-500 mb-6">Add items to it now.</p>
                    <Link to="/products" className="bg-[#2874f0] text-white px-12 py-3 rounded-sm font-medium shadow-md hover:shadow-lg transition-all inline-block uppercase text-sm">
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    const totalMRP = cart.reduce((sum, item) => sum + (item.price * 1.2 * item.quantity), 0);
    const totalDiscount = totalMRP - getCartTotal();

    return (
        <div className="min-h-screen bg-[#f1f3f6] py-4">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-4 items-start">

                    {/* Left Side: Cart Items */}
                    <div className="flex-1 bg-white shadow-sm rounded-sm overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h1 className="text-lg font-medium flex items-center gap-2">
                                FertilizerMart ({cart.length})
                            </h1>
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-[#2874f0]" />
                                <span className="text-gray-600">Deliver to</span>
                                <span className="font-medium">{user?.address?.city || 'Select Location'}</span>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {cart.map((item) => (
                                <div key={item._id} className="p-6">
                                    <div className="flex gap-6">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-28 h-28 flex items-center justify-center bg-gray-50 rounded">
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                                                />
                                            </div>
                                            <div className="flex items-center border border-gray-200 rounded-sm">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={item.quantity}
                                                    className="w-12 h-8 text-center border-x border-gray-200 text-sm font-medium focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
                                                    disabled={item.quantity >= item.stock}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg hover:text-[#2874f0] cursor-pointer transition-colors max-w-md line-clamp-1">{item.name}</h3>
                                                    <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                                                    <p className="text-xs text-gray-400 mt-2">Seller: AgriSmart Solutions</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-400 line-through">₹{(item.price * 1.2).toFixed(0)}</p>
                                                    <p className="text-xl font-black text-gray-900">₹{item.price}</p>
                                                    <p className="text-xs text-[#388e3c] font-bold mt-1">20% Off</p>
                                                </div>
                                            </div>

                                            <div className="mt-8 flex items-center gap-6">
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-gray-800 font-bold uppercase text-sm hover:text-[#2874f0] transition-colors"
                                                >
                                                    Remove
                                                </button>
                                                <button className="text-gray-800 font-bold uppercase text-sm hover:text-[#2874f0] transition-colors">
                                                    Save for Later
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-100 flex justify-end gap-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                            <button
                                onClick={() => {
                                    clearCart();
                                    navigate('/products');
                                }}
                                className="bg-gray-100 text-gray-700 px-10 py-3 rounded-sm font-black uppercase text-sm hover:bg-gray-200 transition-all border border-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePlaceOrder}
                                className="bg-[#fb641b] text-white px-16 py-3 rounded-sm font-black uppercase text-sm shadow hover:bg-[#eb5d1a] transition-all"
                            >
                                Place Order
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Price Details */}
                    <div className="lg:w-[380px] w-full space-y-4 sticky top-24">
                        <div className="bg-white shadow-sm rounded-sm">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-gray-500 font-black uppercase text-sm tracking-wider leading-relaxed">Price Details</h2>
                            </div>
                            <div className="p-4 space-y-5">
                                <div className="flex justify-between text-gray-800">
                                    <span>Price ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                    <span>₹{totalMRP.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-800">
                                    <span>Discount</span>
                                    <span className="text-[#388e3c]">- ₹{totalDiscount.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-800 border-b border-dashed border-gray-200 pb-5">
                                    <span>Delivery Charges</span>
                                    <span className="text-[#388e3c]">FREE</span>
                                </div>
                                <div className="flex justify-between text-xl font-black text-gray-900 pt-1">
                                    <span>Total Amount</span>
                                    <span>₹{getCartTotal().toFixed(0)}</span>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-100">
                                <p className="text-[#388e3c] font-bold text-sm">
                                    You will save ₹{totalDiscount.toFixed(0)} on this order
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 text-gray-500">
                            <ShieldCheck className="w-10 h-10 opacity-40 shrink-0" />
                            <p className="text-[12px] font-bold leading-relaxed">
                                Safe and Secure Payments. Easy returns. 100% Authentic products.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Cart;
