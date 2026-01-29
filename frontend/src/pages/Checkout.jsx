import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight, CheckCircle, MapPin, Truck, CreditCard, ChevronDown, Plus, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/admin');
        }
    }, [user, navigate]);

    // Safety: ensure totals are numbers
    const totalAmount = getCartTotal() || 0;
    const totalMRP = cart?.reduce((sum, item) => sum + ((item?.price || 0) * 1.2 * (item?.quantity || 1)), 0) || 0;
    const totalDiscount = Math.max(0, totalMRP - totalAmount);

    const handlePlaceOrder = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const orderData = {
                items: cart.map(item => ({
                    productId: item._id, // Changed to productId to match typical patterns
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: totalAmount,
                shippingAddress: user.address || {
                    street: '123 Village Road',
                    city: 'Pune',
                    state: 'Maharashtra',
                    pincode: '411001'
                },
                paymentMethod: 'COD'
            };

            const response = await api.post('/orders', orderData);
            if (response.data.success) {
                clearCart();
                navigate('/my-orders', { state: { orderSuccess: true } });
            }
        } catch (error) {
            console.error('Order placement error:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center py-10">
                <div className="bg-white p-10 rounded-sm shadow-sm text-center max-w-md w-full">
                    <h2 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h2>
                    <Link to="/products" className="bg-[#2874f0] text-white px-12 py-3 rounded-sm font-medium shadow-md hover:shadow-lg transition-all inline-block uppercase text-sm mt-4">
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f3f6] py-4">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-4 items-start">

                    {/* Left Side: Checkout Steps */}
                    <div className="flex-1 w-full space-y-4">

                        {/* Step 1: Login */}
                        <div className="bg-white shadow-sm rounded-sm">
                            <div className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="bg-gray-100 text-[#2874f0] w-6 h-6 flex items-center justify-center text-xs font-black rounded-sm">1</span>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Login</span>
                                        <span className="text-sm font-black text-gray-900">{user.name} <span className="text-gray-400 mx-2 font-medium">|</span> {user.phone || 'No phone'}</span>
                                    </div>
                                </div>
                                <CheckCircle className="w-5 h-5 text-[#2874f0]" />
                            </div>
                        </div>

                        {/* Step 2: Delivery Address */}
                        <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                            <div className={`p-4 flex items-center gap-4 ${activeStep === 1 ? 'bg-[#2874f0] text-white' : ''}`}>
                                <span className={`w-6 h-6 flex items-center justify-center text-xs font-black rounded-sm ${activeStep === 1 ? 'bg-white text-[#2874f0]' : 'bg-gray-100 text-[#2874f0]'}`}>2</span>
                                <h2 className="font-black uppercase tracking-wider text-sm leading-none">Delivery Address</h2>
                                {activeStep !== 1 && <CheckCircle className="w-5 h-5 text-[#2874f0] ml-auto" />}
                            </div>

                            {activeStep === 1 && (
                                <div className="p-6">
                                    <div className="border border-[#2874f0] rounded-sm p-4 relative group cursor-pointer bg-blue-50/30">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-sm font-black text-gray-900">{user.name}</span>
                                            <span className="bg-gray-100 text-[10px] font-black px-1.5 py-0.5 rounded-sm uppercase text-gray-500 tracking-tighter">Home</span>
                                            <span className="text-sm font-black text-gray-900 ml-4">{user.phone}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                                            {user.address?.street || '123 Village Road'}, {user.address?.city || 'Pune'}, {user.address?.state || 'Maharashtra'} - <span className="font-black text-gray-900">{user.address?.pincode || '411001'}</span>
                                        </p>
                                        <button
                                            onClick={() => setActiveStep(2)}
                                            className="mt-6 bg-[#fb641b] text-white px-10 py-3 rounded-sm font-black uppercase text-sm shadow-md transition-all hover:bg-[#eb5d1a]"
                                        >
                                            Deliver Here
                                        </button>
                                    </div>
                                    <button className="mt-8 text-[#2874f0] font-black text-sm uppercase flex items-center gap-2 hover:underline">
                                        <Plus className="w-4 h-4" /> Add a new address
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Order Summary */}
                        <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                            <div className={`p-4 flex items-center gap-4 ${activeStep === 2 ? 'bg-[#2874f0] text-white' : ''}`}>
                                <span className={`w-6 h-6 flex items-center justify-center text-xs font-black rounded-sm ${activeStep === 2 ? 'bg-white text-[#2874f0]' : 'bg-gray-100 text-[#2874f0]'}`}>3</span>
                                <h2 className="font-black uppercase tracking-wider text-sm leading-none">Order Summary</h2>
                                {activeStep > 2 && <CheckCircle className="w-5 h-5 text-[#2874f0] ml-auto" />}
                            </div>

                            {activeStep === 2 && (
                                <div className="divide-y divide-gray-100">
                                    {cart.map((item) => (
                                        <div key={item._id} className="p-6 flex gap-6">
                                            <div className="w-20 h-20 flex items-center justify-center bg-gray-50 rounded p-2">
                                                <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-sm font-black text-gray-900 line-clamp-1">{item.name}</h3>
                                                <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-tight">Quantity: {item.quantity}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-lg font-black tracking-tight">₹{item.price}</span>
                                                    <span className="text-xs text-gray-400 line-through">₹{(item.price * 1.2).toFixed(0)}</span>
                                                    <span className="text-[#388e3c] text-[10px] font-black uppercase">20% Off</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="p-4 flex items-center justify-between bg-gray-50/50">
                                        <p className="text-xs text-gray-500 font-bold">Order confirmation email will be sent to <span className="text-gray-900 font-black">{user.email}</span></p>
                                        <button
                                            onClick={() => setActiveStep(3)}
                                            className="bg-[#fb641b] text-white px-10 py-3 rounded-sm font-black uppercase text-sm shadow-md hover:bg-[#eb5d1a]"
                                        >
                                            Continue
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 4: Payment Options */}
                        <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                            <div className={`p-4 flex items-center gap-4 ${activeStep === 3 ? 'bg-[#2874f0] text-white' : ''}`}>
                                <span className={`w-6 h-6 flex items-center justify-center text-xs font-black rounded-sm ${activeStep === 3 ? 'bg-white text-[#2874f0]' : 'bg-gray-100 text-[#2874f0]'}`}>4</span>
                                <h2 className="font-black uppercase tracking-wider text-sm leading-none">Payment Options</h2>
                            </div>

                            {activeStep === 3 && (
                                <div className="p-6 space-y-4">
                                    <div className="border border-[#2874f0] rounded-sm p-4 bg-blue-50/30">
                                        <div className="flex items-start gap-4">
                                            <div className="w-5 h-5 rounded-full border-2 border-[#2874f0] flex items-center justify-center mt-0.5">
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#2874f0]"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-sm font-black text-gray-900 uppercase">Cash on Delivery</h3>
                                                    <Truck className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium">Pay at your doorstep when your fertilizer arrives.</p>

                                                <div className="mt-8 flex justify-end items-center gap-8 pt-4 border-t border-blue-100">
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Amount to Pay</p>
                                                        <p className="text-xl font-black text-gray-900">₹{totalAmount.toFixed(0)}</p>
                                                    </div>
                                                    <button
                                                        onClick={handlePlaceOrder}
                                                        disabled={loading}
                                                        className="bg-[#fb641b] text-white px-12 py-3 rounded-sm font-black uppercase text-sm shadow-xl flex items-center gap-2 hover:bg-[#eb5d1a] disabled:opacity-50"
                                                    >
                                                        {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Confirm Order'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Price Details */}
                    <div className="lg:w-[380px] w-full space-y-4 lg:sticky lg:top-24">
                        <div className="bg-white shadow-sm rounded-sm">
                            <div className="p-4 border-b border-gray-100">
                                <h2 className="text-gray-400 font-black uppercase text-xs tracking-widest leading-relaxed">Price Details</h2>
                            </div>
                            <div className="p-4 space-y-5">
                                <div className="flex justify-between text-gray-800 text-sm">
                                    <span className="font-medium">Price ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                    <span className="font-black tracking-tight">₹{totalMRP.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-800 text-sm">
                                    <span className="font-medium">Discount</span>
                                    <span className="text-[#388e3c] font-black tracking-tight">- ₹{totalDiscount.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between text-gray-800 text-sm border-b border-dashed border-gray-100 pb-5">
                                    <span className="font-medium">Delivery Charges</span>
                                    <span className="text-[#388e3c] font-black">FREE</span>
                                </div>
                                <div className="flex justify-between text-xl font-black text-gray-900 pt-1">
                                    <span className="tracking-tight uppercase text-lg">Total Amount</span>
                                    <span className="tracking-tighter">₹{totalAmount.toFixed(0)}</span>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-50">
                                <p className="text-[#388e3c] font-black text-[12px] uppercase">
                                    You will save ₹{totalDiscount.toFixed(0)} on this order
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 text-gray-400">
                            <ShieldCheck className="w-8 h-8 opacity-30 shrink-0" />
                            <p className="text-[11px] font-bold leading-relaxed tracking-tight">
                                Safe and Secure Payments. Easy returns. 100% Authentic products.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
