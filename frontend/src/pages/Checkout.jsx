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
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressLoading, setAddressLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('COD');

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            setAddressLoading(true);
            const response = await api.get('/addresses');
            const addrs = response.data.data;
            setAddresses(addrs);
            // Select default address or first address
            const def = addrs.find(a => a.isDefault) || addrs[0];
            setSelectedAddress(def);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setAddressLoading(false);
        }
    };

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
                    productId: item._id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: totalAmount,
                shippingAddress: selectedAddress ? {
                    street: selectedAddress.address,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    pincode: selectedAddress.pincode,
                    phone: selectedAddress.phone,
                    name: selectedAddress.name
                } : user.address,
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

    const handleOnlinePayment = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // 1. Create order on server
            const { data: { data: order } } = await api.post('/payments/create-order', {
                amount: totalAmount
            });

            // 2. Open Razorpay Checkout
            const options = {
                key: order.key_id,
                amount: order.amount,
                currency: order.currency,
                name: "FertilizerMart",
                description: "Purchase of Agricultural Supplies",
                order_id: order.id,
                handler: async (response) => {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderData: {
                                items: cart.map(item => ({
                                    productId: item._id,
                                    quantity: item.quantity,
                                    price: item.price
                                })),
                                totalAmount: totalAmount,
                                shippingAddress: selectedAddress ? {
                                    street: selectedAddress.address,
                                    city: selectedAddress.city,
                                    state: selectedAddress.state,
                                    pincode: selectedAddress.pincode,
                                    phone: selectedAddress.phone,
                                    name: selectedAddress.name
                                } : user.address,
                                paymentMethod: 'Online'
                            }
                        };

                        const verifyRes = await api.post('/payments/verify', verifyData);
                        if (verifyRes.data.success) {
                            clearCart();
                            navigate('/my-orders', { state: { orderSuccess: true } });
                        }
                    } catch (err) {
                        console.error('Verification failed:', err);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone || ''
                },
                theme: {
                    color: "#2e7d32"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Razorpay Error:', error);
            alert("Could not initialize payment. Please try again.");
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
                    <Link to="/products" className="bg-[#2e7d32] text-white px-12 py-3 rounded-sm font-medium shadow-md hover:shadow-lg transition-all inline-block uppercase text-sm mt-4">
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
                                    <span className="bg-gray-100 text-[#2e7d32] w-6 h-6 flex items-center justify-center text-xs font-black rounded-sm">1</span>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Login</span>
                                        <span className="text-sm font-black text-gray-900">{user.name} <span className="text-gray-400 mx-2 font-medium">|</span> {user.phone || 'No phone'}</span>
                                    </div>
                                </div>
                                <CheckCircle className="w-5 h-5 text-[#2e7d32]" />
                            </div>
                        </div>

                        {/* Step 2: Delivery Address */}
                        <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                            <div className={`p-4 flex items-center gap-4 ${activeStep === 1 ? 'bg-[#2e7d32] text-white' : ''}`}>
                                <span className={`w-6 h-6 flex items-center justify-center text-xs font-black rounded-sm ${activeStep === 1 ? 'bg-white text-[#2e7d32]' : 'bg-gray-100 text-[#2e7d32]'}`}>2</span>
                                <h2 className="font-black uppercase tracking-wider text-sm leading-none">Delivery Address</h2>
                                {activeStep !== 1 && <CheckCircle className="w-5 h-5 text-[#2e7d32] ml-auto" />}
                            </div>

                            {activeStep === 1 && (
                                <div className="p-6">
                                    {addressLoading ? (
                                        <div className="flex justify-center p-8">
                                            <Loader className="w-6 h-6 animate-spin text-[#2e7d32]" />
                                        </div>
                                    ) : addresses.length > 0 ? (
                                        <div className="space-y-4">
                                            {addresses.map((addr) => (
                                                <div
                                                    key={addr._id}
                                                    onClick={() => setSelectedAddress(addr)}
                                                    className={`border rounded-sm p-4 relative group cursor-pointer transition-all ${selectedAddress?._id === addr._id ? 'border-[#2e7d32] bg-green-50/30' : 'border-gray-100'}`}
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-sm font-black text-gray-900">{addr.name}</span>
                                                        <span className="bg-gray-100 text-[10px] font-black px-1.5 py-0.5 rounded-sm uppercase text-gray-500 tracking-tighter">{addr.type}</span>
                                                        <span className="text-sm font-black text-gray-900 ml-4">{addr.phone}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 leading-relaxed max-w-lg">
                                                        {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-black text-gray-900">{addr.pincode}</span>
                                                    </p>

                                                    {selectedAddress?._id === addr._id && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveStep(2);
                                                            }}
                                                            className="mt-6 bg-[#fb641b] text-white px-10 py-3 rounded-sm font-black uppercase text-sm shadow-md transition-all hover:bg-[#eb5d1a]"
                                                        >
                                                            Deliver Here
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 text-sm mb-4">No addresses found in your account.</p>
                                        </div>
                                    )}

                                    <Link to="/addresses" className="mt-8 text-[#2e7d32] font-black text-sm uppercase flex items-center gap-2 hover:underline">
                                        <Plus className="w-4 h-4" /> Add or Manage Addresses
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Step 3: Order Summary */}
                        <div className="bg-white shadow-sm rounded-sm overflow-hidden">
                            <div className={`p-4 flex items-center gap-4 ${activeStep === 2 ? 'bg-[#2e7d32] text-white' : ''}`}>
                                <span className={`w-6 h-6 flex items-center justify-center text-xs font-black rounded-sm ${activeStep === 2 ? 'bg-white text-[#2e7d32]' : 'bg-gray-100 text-[#2e7d32]'}`}>3</span>
                                <h2 className="font-black uppercase tracking-wider text-sm leading-none">Order Summary</h2>
                                {activeStep > 2 && <CheckCircle className="w-5 h-5 text-[#2e7d32] ml-auto" />}
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
                                                <p className="text-[10px] text-[#2e7d32] font-black mt-3 uppercase flex items-center gap-1.5">
                                                    <Truck className="w-3 h-3" />
                                                    Delivering by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                </p>
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
                            <div className={`p-4 flex items-center gap-4 ${activeStep === 3 ? 'bg-[#2e7d32] text-white' : ''}`}>
                                <span className={`w-6 h-6 flex items-center justify-center text-xs font-black rounded-sm ${activeStep === 3 ? 'bg-white text-[#2e7d32]' : 'bg-gray-100 text-[#2e7d32]'}`}>4</span>
                                <h2 className="font-black uppercase tracking-wider text-sm leading-none">Payment Options</h2>
                            </div>

                            {activeStep === 3 && (
                                <div className="p-6 space-y-4">
                                    {/* COD Option */}
                                    <div
                                        onClick={() => setPaymentMethod('COD')}
                                        className={`border rounded-sm p-4 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-[#2e7d32] bg-green-50/30' : 'border-gray-100'}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${paymentMethod === 'COD' ? 'border-[#2e7d32]' : 'border-gray-300'}`}>
                                                {paymentMethod === 'COD' && <div className="w-2.5 h-2.5 rounded-full bg-[#2e7d32]"></div>}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-sm font-black text-gray-900 uppercase">Cash on Delivery</h3>
                                                    <Truck className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium">Pay at your doorstep when your fertilizer arrives.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Razorpay Option */}
                                    <div
                                        onClick={() => setPaymentMethod('Online')}
                                        className={`border rounded-sm p-4 cursor-pointer transition-all ${paymentMethod === 'Online' ? 'border-[#2e7d32] bg-green-50/30' : 'border-gray-100'}`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${paymentMethod === 'Online' ? 'border-[#2e7d32]' : 'border-gray-300'}`}>
                                                {paymentMethod === 'Online' && <div className="w-2.5 h-2.5 rounded-full bg-[#2e7d32]"></div>}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-sm font-black text-gray-900 uppercase">Online Payment (UPI / Card / NetBanking)</h3>
                                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <p className="text-xs text-gray-500 font-medium">Instant payment via Razorpay secure gateway.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end items-center gap-8 pt-4 border-t border-gray-100">
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Amount to Pay</p>
                                            <p className="text-xl font-black text-gray-900">₹{totalAmount.toFixed(0)}</p>
                                        </div>
                                        <button
                                            onClick={paymentMethod === 'COD' ? handlePlaceOrder : handleOnlinePayment}
                                            disabled={loading}
                                            className="bg-[#fb641b] text-white px-12 py-3 rounded-sm font-black uppercase text-sm shadow-xl flex items-center gap-2 hover:bg-[#eb5d1a] disabled:opacity-50"
                                        >
                                            {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Confirm Order'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fertilizer Handle Safety Warning */}
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex gap-4 items-start">
                            <ShieldCheck className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-[11px] font-black uppercase text-amber-800 tracking-widest mb-1">Safety First</h4>
                                <p className="text-[11px] text-amber-700 leading-relaxed font-medium">Please ensure you have protective gear (gloves/masks) ready when this fertilizer arrives. Store in a cool, dry place away from children.</p>
                            </div>
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

                        {/* Coupon Section */}
                        <div className="bg-white shadow-sm rounded-sm p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Have a Coupon?</h3>
                                <div className="bg-green-100 text-[#2e7d32] text-[8px] font-black px-1.5 py-0.5 rounded-sm animate-pulse">NEW FARMER</div>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Code"
                                    className="flex-1 bg-gray-50 border border-gray-100 px-3 py-2 text-xs font-black uppercase focus:outline-none focus:border-[#2e7d32] rounded-sm"
                                />
                                <button className="text-[#2e7d32] font-black text-xs uppercase hover:underline">Apply</button>
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
