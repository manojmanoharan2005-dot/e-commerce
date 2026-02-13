import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ChevronRight, CheckCircle, MapPin, Truck, CreditCard, ChevronDown, Plus, Loader, ShoppingBag, Sparkles, Building2 } from 'lucide-react';
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
                name: "AgriStore",
                description: "Purchase of Premium Agricultural Supplies",
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
                    color: "#0f172a"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Razorpay Error:', error);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || "Could not initialize payment.";
            alert(`${errorMsg} Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader className="w-10 h-10 animate-spin text-accent" />
            </div>
        );
    }

    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center py-20">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 text-center max-w-lg w-full border border-slate-100 relative overflow-hidden group">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                        <ShoppingBag className="w-12 h-12 text-slate-200" />
                    </div>
                    <h2 className="text-3xl font-black text-primary italic tracking-tight mb-4">Your Cart is Empty</h2>
                    <p className="text-slate-400 text-sm font-medium mb-10 italic">Add premium fertilizers and tools to your cart to start your journey.</p>
                    <Link to="/products" className="bg-primary text-white px-12 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all inline-block">
                        Browse Products
                    </Link>
                    <Sparkles className="absolute top-0 right-0 w-32 h-32 text-slate-50 opacity-50" />
                </div>
            </div>
        );
    }

    const StepHeader = ({ number, title, active, completed, displayValue }) => (
        <div className={`p-6 flex items-center justify-between rounded-[2rem] transition-all border ${active ? 'bg-primary border-primary shadow-xl shadow-primary/20 scale-[1.02]' : 'bg-white border-slate-100'}`}>
            <div className="flex items-center gap-5">
                <div className={`w-8 h-8 flex items-center justify-center text-xs font-black rounded-xl transition-all ${active ? 'bg-white text-primary' : (completed ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400')}`}>
                    {completed && !active ? <CheckCircle className="w-5 h-5" /> : number}
                </div>
                <div className="flex flex-col">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${active ? 'text-white/60' : 'text-slate-400'}`}>Step {number}</span>
                    <h2 className={`text-lg font-black italic tracking-tight ${active ? 'text-white' : 'text-primary'}`}>{title}</h2>
                    {!active && completed && displayValue && (
                        <span className="text-xs font-bold text-slate-500 mt-0.5">{displayValue}</span>
                    )}
                </div>
            </div>
            {completed && !active && (
                <button
                    onClick={() => setActiveStep(number)}
                    className="text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 px-4 py-2 rounded-full hover:bg-slate-100 transition-all"
                >
                    Modify
                </button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-8">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left Side: Checkout Steps */}
                    <div className="flex-1 w-full space-y-6">

                        {/* Step 1: Authentication */}
                        <StepHeader
                            number={1}
                            title="Account Details"
                            completed={true}
                            displayValue={`${user.name} | ${user.phone || user.email}`}
                        />

                        {/* Step 2: Delivery Address */}
                        <div className="space-y-4">
                            <StepHeader
                                number={2}
                                title="Delivery Address"
                                active={activeStep === 1}
                                completed={activeStep > 1}
                                displayValue={selectedAddress ? `${selectedAddress.name}, ${selectedAddress.city}` : null}
                            />

                            {activeStep === 1 && (
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                                    {addressLoading ? (
                                        <div className="flex flex-col items-center justify-center p-12">
                                            <Loader className="w-10 h-10 animate-spin text-accent mb-4" />
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Loading Addresses...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 relative z-10">
                                            {addresses.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {addresses.map((addr) => (
                                                        <div
                                                            key={addr._id}
                                                            onClick={() => setSelectedAddress(addr)}
                                                            className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group ${selectedAddress?._id === addr._id ? 'border-primary bg-primary/5 ring-4 ring-primary/5 shadow-lg' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                                                        >
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    {addr.type === 'Home' ? <Building2 className="w-3.5 h-3.5 text-slate-400" /> : <MapPin className="w-3.5 h-3.5 text-slate-400" />}
                                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{addr.type} Address</span>
                                                                </div>
                                                                {selectedAddress?._id === addr._id && <CheckCircle className="w-4 h-4 text-primary" />}
                                                            </div>
                                                            <h3 className="text-xl font-black text-primary italic tracking-tight mb-2 underline-offset-4 decoration-accent/30 decoration-2">{addr.name}</h3>
                                                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                                                                {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-black">{addr.pincode}</span>
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="py-12 flex flex-col items-center justify-center text-center">
                                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                                        <MapPin className="w-8 h-8 text-slate-200" />
                                                    </div>
                                                    <h3 className="text-lg font-black text-primary italic tracking-tight mb-1 uppercase">No Saved Addresses</h3>
                                                    <p className="text-[11px] text-slate-400 font-medium italic mb-6">You haven't added any delivery addresses to your account yet.</p>
                                                    <Link to="/addresses" className="bg-primary text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                                                        Add New Address
                                                    </Link>
                                                </div>
                                            )}

                                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                                <Link to="/addresses" className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest">
                                                    <Plus className="w-4 h-4" /> Manage Addresses
                                                </Link>
                                                {selectedAddress && (
                                                    <button
                                                        onClick={() => setActiveStep(2)}
                                                        className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-primary/25 hover:scale-105 transition-all"
                                                    >
                                                        Deliver to this Address
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Step 3: Order Summary */}
                        <div className="space-y-4">
                            <StepHeader
                                number={3}
                                title="Order Summary"
                                active={activeStep === 2}
                                completed={activeStep > 2}
                            />

                            {activeStep === 2 && (
                                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                                    <div className="divide-y divide-slate-50">
                                        {cart.map((item) => (
                                            <div key={item._id} className="p-8 flex gap-8 items-center group">
                                                <div className="w-24 h-24 bg-slate-50 rounded-2xl p-3 border border-slate-100 flex items-center justify-center group-hover:rotate-3 transition-transform">
                                                    <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply transition-all" />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <h3 className="text-xl font-black text-primary italic tracking-tight line-clamp-1">{item.name}</h3>
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Quantity: {item.quantity}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-2xl font-black tracking-tighter text-slate-900 italic">₹{item.price}</span>
                                                        <span className="text-sm text-slate-300 line-through">₹{(item.price * 1.2).toFixed(0)}</span>
                                                        <span className="bg-accent/10 px-2 py-1 rounded text-accent text-[9px] font-black uppercase">20% Off</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 pt-2">
                                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-lg text-emerald-600 text-[9px] font-black uppercase border border-emerald-100">
                                                            <Truck className="w-3 h-3" />
                                                            <span>Express Delivery</span>
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 font-medium italic">Estimated Delivery: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-8 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-primary">
                                                <ShoppingBag className="w-5 h-5" />
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-medium italic">Order details will be sent to <br /><span className="text-primary font-black not-italic">{user.email}</span></p>
                                        </div>
                                        <button
                                            onClick={() => setActiveStep(3)}
                                            className="w-full md:w-auto bg-primary text-white px-12 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Step 4: Payment Options */}
                        <div className="space-y-4">
                            <StepHeader
                                number={4}
                                title="Payment Method"
                                active={activeStep === 3}
                                completed={false}
                            />

                            {activeStep === 3 && (
                                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                                    <div className="space-y-4 relative z-10">
                                        {[
                                            { id: 'COD', title: 'Cash on Delivery', desc: 'Pay when your order is delivered to your door.', icon: Truck },
                                            { id: 'Online', title: 'Pay Online', desc: 'Secure payment via UPI, Credit/Debit Card, or NetBanking.', icon: CreditCard }
                                        ].map((method) => (
                                            <div
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer group ${paymentMethod === method.id ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'}`}
                                            >
                                                <div className="flex items-start gap-5">
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${paymentMethod === method.id ? 'border-primary bg-primary' : 'border-slate-200 bg-white'}`}>
                                                        {paymentMethod === method.id && <CheckCircle className="w-4 h-4 text-white" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h3 className="text-xl font-black text-primary italic tracking-tight">{method.title}</h3>
                                                            <method.icon className={`w-6 h-6 transition-colors ${paymentMethod === method.id ? 'text-primary' : 'text-slate-300'}`} />
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 font-medium tracking-wide uppercase italic leading-none">{method.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                                            <div className="text-center md:text-left">
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-1">Total Amount Payable</p>
                                                <p className="text-4xl font-black text-primary italic tracking-tighter">₹{totalAmount.toFixed(0)}</p>
                                            </div>
                                            <button
                                                onClick={paymentMethod === 'COD' ? handlePlaceOrder : handleOnlinePayment}
                                                disabled={loading}
                                                className="w-full md:w-auto bg-emerald-500 text-white px-16 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-emerald-500/30 hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                            >
                                                {loading ? <Loader className="w-5 h-5 animate-spin" /> : (
                                                    <>
                                                        <ShieldCheck className="w-5 h-5" />
                                                        Place Order
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <Sparkles className="absolute -bottom-10 -left-10 w-48 h-48 text-slate-50 opacity-50 pointer-events-none" />
                                </div>
                            )}
                        </div>

                        {/* Safety Warning */}
                        <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 flex flex-col md:flex-row gap-6 items-center group overflow-hidden relative">
                            <div className="w-16 h-16 bg-primary rounded-[1.25rem] flex items-center justify-center shrink-0 shadow-xl shadow-primary/20 relative z-10 group-hover:rotate-12 transition-transform">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <div className="relative z-10 text-center md:text-left">
                                <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-2">Safe Delivery Policy</h4>
                                <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                                    Our products are handled with extreme care. Please ensure someone is available to receive the order and store items safely away from children and pets.
                                </p>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        </div>
                    </div>

                    {/* Right Side: Price Details */}
                    <div className="lg:w-[420px] w-full space-y-6 lg:sticky lg:top-24">
                        <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group">
                            <div className="pb-6 mb-6 border-b border-slate-100 relative z-10 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-primary italic tracking-tight leading-none mb-1">Price Details</h2>
                                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Summary</p>
                                </div>
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-center group/row">
                                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest group-hover/row:text-primary transition-colors">Total Price <span className="text-[10px] normal-case font-bold ml-1 italic group-hover/row:translate-x-1 inline-block transition-transform">({cart.reduce((sum, item) => sum + item.quantity, 0)} Items)</span></span>
                                    <span className="text-lg font-black tracking-tight text-slate-900 italic">₹{totalMRP.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between items-center group/row">
                                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest group-hover/row:text-primary transition-colors">Total Discount</span>
                                    <span className="text-lg font-black tracking-tight text-emerald-500 italic">- ₹{totalDiscount.toFixed(0)}</span>
                                </div>
                                <div className="flex justify-between items-center group/row pb-6 border-b border-dashed border-slate-100">
                                    <span className="text-xs font-black uppercase text-slate-400 tracking-widest group-hover/row:text-primary transition-colors">Delivery Charges</span>
                                    <span className="px-3 py-1 bg-emerald-50 rounded-lg text-emerald-600 text-[10px] font-black uppercase border border-emerald-100 tracking-widest">Free</span>
                                </div>
                                <div className="flex flex-col gap-2 pt-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-sm font-black uppercase text-primary tracking-[0.2em] leading-none mb-1">Total Amount</span>
                                        <span className="text-5xl font-black text-primary italic tracking-tighter leading-none shadow-primary/5">₹{totalAmount.toFixed(0)}</span>
                                    </div>
                                    <div className="flex items-center justify-end gap-2 text-emerald-500">
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-black uppercase tracking-widest italic">You Save: ₹{totalDiscount.toFixed(0)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Abstract Decor */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50 group-hover:scale-110 transition-transform"></div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
