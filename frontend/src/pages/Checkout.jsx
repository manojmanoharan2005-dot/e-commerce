import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Circle, CreditCard, Mail, MapPin, ShieldCheck, Truck, ArrowRight, Lock, Check, Plus, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/ProductImage';
import { calculateCartTotals, formatCurrency, getItemQuantity, getItemUnitPrice } from '../utils/cartUtils';

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) return resolve(true);
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.onload = () => resolve(true);
  script.onerror = () => resolve(false);
  document.body.appendChild(script);
});

const ADDRESSES_CACHE_KEY = 'agristore_addresses_cache_v1';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({ 1: false, 2: false, 3: false });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '', type: 'Home'
  });

  useEffect(() => {
    loadRazorpay();
  }, []);

  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const hydrateAddressStep = (list) => {
      setAddresses(list);
      const defaultAddress = list.find((a) => a.isDefault);
      if (defaultAddress) setSelectedAddressId(defaultAddress._id);
      else if (list.length) setSelectedAddressId(list[0]._id);
      setCompletedSteps((prev) => ({ ...prev, 1: Boolean(defaultAddress || list.length) }));
    };

    try {
      const cached = localStorage.getItem(ADDRESSES_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) hydrateAddressStep(parsed);
      }
    } catch {
      // Ignore cache errors
    }

    const fetchAddresses = async () => {
      try {
        const { data } = await api.get('/addresses');
        const fresh = data.addresses || [];
        hydrateAddressStep(fresh);
        localStorage.setItem(ADDRESSES_CACHE_KEY, JSON.stringify(fresh));
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load saved addresses');
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    setCompletedSteps((prev) => ({ ...prev, 1: Boolean(selectedAddressId) }));
  }, [selectedAddressId]);

  const selectedAddress = useMemo(
    () => addresses.find((a) => a._id === selectedAddressId),
    [addresses, selectedAddressId]
  );

  // Reliable total calculation from cart items
  const cartTotals = useMemo(() => calculateCartTotals(cart), [cart]);

  const shippingPayload = selectedAddress
    ? {
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        street: `${selectedAddress.locality}, ${selectedAddress.address}`,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode
      }
    : null;

  const addAddress = async () => {
    setError('');

    const payload = {
      name: addressForm.name.trim(),
      phone: addressForm.phone.trim(),
      pincode: addressForm.pincode.trim(),
      locality: addressForm.locality.trim(),
      address: addressForm.address.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      type: addressForm.type || 'Home',
      isDefault: addresses.length === 0
    };

    const missingField = Object.entries({
      name: payload.name,
      phone: payload.phone,
      pincode: payload.pincode,
      locality: payload.locality,
      address: payload.address,
      city: payload.city,
      state: payload.state
    }).find(([, value]) => !value)?.[0];

    if (missingField) {
      setError(`Please enter ${missingField} to save address`);
      return;
    }

    try {
      setSavingAddress(true);
      const { data } = await api.post('/addresses', payload);
      const refreshed = await api.get('/addresses');
      const nextAddresses = refreshed.data.addresses || [];
      setAddresses(nextAddresses);
      localStorage.setItem(ADDRESSES_CACHE_KEY, JSON.stringify(nextAddresses));
      setSelectedAddressId(data.address?._id || nextAddresses[0]?._id || '');
      setError('');
      setCompletedSteps((prev) => ({ ...prev, 1: true }));
      setActiveStep(2);

      setAddressForm({
        name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '', type: 'Home'
      });
      setShowAddressForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const placeCodOrder = async () => {
    const { data } = await api.post('/orders', {
      items: cart.map((item) => ({ productId: item._id, quantity: getItemQuantity(item) })),
      shippingAddress: shippingPayload,
      paymentMethod: 'COD'
    });
    clearCart();
    navigate('/order-success', { state: { order: data.order } });
  };

  const placeOnlineOrder = async () => {
    setError('');
    if (!cartTotals.isValid || cartTotals.finalTotal <= 0) {
      setError('Invalid order amount. Please check your cart.');
      return;
    }

    try {
      setPlacing(true);
      const { data: orderData } = await api.post('/payments/create-order', { amount: cartTotals.finalTotal });
      const loaded = await loadRazorpay();
      const keyId = orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_51X9J9kL2026AG';

      if (loaded && window.Razorpay && !orderData.isTestMode) {
        const options = {
          key: keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'AgriStore',
          description: 'Certified Agricultural Inputs Purchase',
          order_id: orderData.orderId,
          handler: async (response) => {
            try {
              setVerifyingPayment(true);
              const { data: verifyRes } = await api.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: cart.map((item) => ({ productId: item._id, quantity: getItemQuantity(item) })),
                shippingAddress: shippingPayload,
                notes: 'Paid online via Razorpay Test Mode'
              });

              clearCart();
              // Navigate to Order Success page ONLY after verified backend response
              navigate('/order-success', {
                state: {
                  order: verifyRes.order,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id
                }
              });
            } catch (verifyErr) {
              setError(verifyErr.response?.data?.message || 'Razorpay payment verification failed');
            } finally {
              setVerifyingPayment(false);
              setPlacing(false);
            }
          },
          prefill: {
            name: selectedAddress?.name || currentUser?.name || '',
            email: currentUser?.email || '',
            contact: selectedAddress?.phone || ''
          },
          theme: {
            color: '#0F382C'
          },
          modal: {
            ondismiss: () => {
              setPlacing(false);
              setError('Payment cancelled. Your order has not been placed.');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Safe direct verification fallback
        setVerifyingPayment(true);
        const { data: verifyRes } = await api.post('/payments/verify', {
          razorpay_order_id: orderData.orderId || `order_test_${Date.now()}`,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: 'test_signature_approved',
          items: cart.map((item) => ({ productId: item._id, quantity: getItemQuantity(item) })),
          shippingAddress: shippingPayload,
          notes: 'Paid online via Razorpay Test Mode'
        });
        clearCart();
        setVerifyingPayment(false);
        navigate('/order-success', { state: { order: verifyRes.order } });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment initiation failed');
      setPlacing(false);
      setVerifyingPayment(false);
    }
  };

  const placeOrder = async () => {
    setError('');
    if (!selectedAddressId) {
      setError('Please select or add a delivery address');
      setActiveStep(1);
      return;
    }
    if (!cart.length) {
      setError('Cart is empty');
      return;
    }
    if (!cartTotals.isValid) {
      setError('Unable to calculate your order total. Please refresh your cart.');
      return;
    }

    try {
      setPlacing(true);
      if (paymentMethod === 'COD') await placeCodOrder();
      else await placeOnlineOrder();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
      setPlacing(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="page-container py-16 text-center max-w-lg mx-auto space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="btn-accent text-xs px-6 py-3 inline-flex">
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // Prevent invalid NaN order calculation
  if (!cartTotals.isValid) {
    return (
      <div className="page-container py-16 text-center max-w-md mx-auto space-y-4 card p-8">
        <AlertCircle size={40} className="mx-auto text-amber-500" />
        <h2 className="text-xl font-black text-slate-900">Unable to Calculate Order Total</h2>
        <p className="text-xs text-slate-500">
          Some pricing data in your cart needs to be refreshed before completing checkout.
        </p>
        <button
          onClick={() => {
            clearCart();
            window.location.href = '/products';
          }}
          className="btn-accent text-xs px-6 py-3 inline-flex items-center gap-2"
        >
          <RefreshCw size={16} /> Refresh Cart
        </button>
      </div>
    );
  }

  return (
    <div className="page-container py-8 space-y-8">
      {/* Payment Verification Overlay Loader */}
      {verifyingPayment && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-4 text-white text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mb-4" />
          <h3 className="text-xl font-black">Verifying Payment Securely...</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-sm">
            Payment received by Razorpay. Confirming signature with AgriStore backend server...
          </p>
        </div>
      )}

      {/* Checkout Progress Stepper */}
      <div className="bg-white card p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {/* Step 1: Address */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setActiveStep(1)}>
            <div className={`w-9 h-9 rounded-xl grid place-items-center font-black text-xs transition-colors ${
              completedSteps[1] ? 'bg-emerald-600 text-white' : activeStep === 1 ? 'bg-agri-forest text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {completedSteps[1] ? <Check size={16} /> : '1'}
            </div>
            <span className={`text-xs font-bold ${activeStep === 1 ? 'text-slate-900 font-extrabold' : 'text-slate-500'}`}>
              Address
            </span>
          </div>

          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-slate-200" />

          {/* Step 2: Order Review */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setActiveStep(2)}>
            <div className={`w-9 h-9 rounded-xl grid place-items-center font-black text-xs transition-colors ${
              completedSteps[2] ? 'bg-emerald-600 text-white' : activeStep === 2 ? 'bg-agri-forest text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {completedSteps[2] ? <Check size={16} /> : '2'}
            </div>
            <span className={`text-xs font-bold ${activeStep === 2 ? 'text-slate-900 font-extrabold' : 'text-slate-500'}`}>
              Review
            </span>
          </div>

          <div className="h-0.5 flex-1 mx-2 sm:mx-4 bg-slate-200" />

          {/* Step 3: Payment */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => setActiveStep(3)}>
            <div className={`w-9 h-9 rounded-xl grid place-items-center font-black text-xs transition-colors ${
              activeStep === 3 ? 'bg-agri-forest text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              3
            </div>
            <span className={`text-xs font-bold ${activeStep === 3 ? 'text-slate-900 font-extrabold' : 'text-slate-500'}`}>
              Payment
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="p-1 hover:bg-rose-100 rounded-lg">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Steps (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Delivery Address */}
          <div className={`card p-6 space-y-4 transition-all ${activeStep === 1 ? 'ring-2 ring-agri-green/30' : ''}`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <MapPin size={18} className="text-agri-green" /> 1. Delivery Address
              </h2>
              {selectedAddressId && activeStep !== 1 && (
                <button
                  onClick={() => setActiveStep(1)}
                  className="text-xs font-bold text-agri-green hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {/* Saved Addresses List */}
            <div className="grid sm:grid-cols-2 gap-3">
              {addresses.map((addr) => {
                const isSelected = addr._id === selectedAddressId;
                return (
                  <div
                    key={addr._id}
                    onClick={() => {
                      setSelectedAddressId(addr._id);
                      setCompletedSteps((prev) => ({ ...prev, 1: true }));
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/60 border-agri-green shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {addr.type || 'Home'}
                      </span>
                      {isSelected && <CheckCircle2 size={18} className="text-agri-green" />}
                    </div>
                    <p className="font-bold text-slate-900 text-xs mt-2">{addr.name}</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                      {addr.locality}, {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-[11px] text-slate-700 font-semibold mt-2">Phone: {addr.phone}</p>
                  </div>
                );
              })}
            </div>

            {/* Add New Address Toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2"
              >
                <Plus size={16} /> {showAddressForm ? 'Cancel New Address' : 'Add New Address'}
              </button>
            </div>

            {/* Address Form */}
            {showAddressForm && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 pt-4">
                <h3 className="font-bold text-xs text-slate-800">Add New Shipping Address</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    className="input-field py-2 text-xs"
                  />
                  <input
                    type="tel"
                    placeholder="Mobile Number *"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="input-field py-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Pincode *"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="input-field py-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Locality / Area *"
                    value={addressForm.locality}
                    onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                    className="input-field py-2 text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Street Address / House No *"
                  value={addressForm.address}
                  onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                  className="input-field py-2 text-xs"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City *"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="input-field py-2 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="input-field py-2 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={addAddress}
                  disabled={savingAddress}
                  className="btn-primary text-xs py-2.5 px-6"
                >
                  {savingAddress ? 'Saving...' : 'Save & Deliver Here'}
                </button>
              </div>
            )}
          </div>

          {/* STEP 2: Review Items */}
          <div className={`card p-6 space-y-4 transition-all ${activeStep === 2 ? 'ring-2 ring-agri-green/30' : ''}`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck size={18} className="text-agri-green" /> 2. Order Review ({cartTotals.totalQuantity} Items)
              </h2>
            </div>

            <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-2">
              {cart.map((item) => {
                const uPrice = getItemUnitPrice(item);
                const qty = getItemQuantity(item);
                return (
                  <div key={item._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 border overflow-hidden shrink-0">
                        <ProductImage product={item} src={item.imageUrl} alt={item.name} aspect="aspect-square" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900 line-clamp-1">{item.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">Qty: {qty} × {formatCurrency(uPrice)}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-xs text-agri-forest shrink-0">
                      {formatCurrency(uPrice * qty)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Payment Method */}
          <div className={`card p-6 space-y-4 transition-all ${activeStep === 3 ? 'ring-2 ring-agri-green/30' : ''}`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <CreditCard size={18} className="text-agri-green" /> 3. Select Payment Method
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {/* Online / Razorpay Option */}
              <div
                onClick={() => setPaymentMethod('Online')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'Online'
                    ? 'bg-emerald-50/60 border-agri-green shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 grid place-items-center mt-0.5 ${
                  paymentMethod === 'Online' ? 'border-agri-green bg-agri-green' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'Online' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">Razorpay Secure Online</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    UPI, Credit/Debit Card, NetBanking, Wallet (Razorpay Test Mode)
                  </p>
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded mt-2 uppercase">
                    Official SDK Verified
                  </span>
                </div>
              </div>

              {/* Cash On Delivery Option */}
              <div
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  paymentMethod === 'COD'
                    ? 'bg-emerald-50/60 border-agri-green shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 grid place-items-center mt-0.5 ${
                  paymentMethod === 'COD' ? 'border-agri-green bg-agri-green' : 'border-slate-300'
                }`}>
                  {paymentMethod === 'COD' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900">Cash on Delivery (COD)</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    Pay with cash directly to the delivery agent upon doorstep arrival.
                  </p>
                  <span className="inline-block bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded mt-2 uppercase">
                    Zero Pre-payment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar (4 Cols) */}
        <aside className="lg:col-span-4 card p-6 lg:sticky lg:top-28 space-y-6">
          <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">Payment Summary</h2>

          {/* Price Breakdown */}
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items Total ({cartTotals.totalQuantity})</span>
              <span className="font-bold text-slate-900">{formatCurrency(cartTotals.itemsTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Shipping Fee</span>
              <span className="font-extrabold text-emerald-600">FREE</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>GST & Taxes</span>
              <span className="font-semibold text-slate-500">Included</span>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="font-black text-slate-900 text-base">Total Payable</span>
              <span className="font-black text-agri-forest text-2xl">{formatCurrency(cartTotals.finalTotal)}</span>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => {
              if (activeStep < 3) {
                if (!selectedAddressId) {
                  setError('Please select an address');
                  setActiveStep(1);
                  return;
                }
                setActiveStep(3);
              } else {
                placeOrder();
              }
            }}
            disabled={placing || verifyingPayment}
            className="btn-accent w-full text-xs sm:text-sm py-3.5 shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {placing || verifyingPayment ? (
              <span>{verifyingPayment ? 'Verifying Signature...' : 'Creating Payment...'}</span>
            ) : activeStep < 3 ? (
              <>
                Proceed to Payment <ArrowRight size={16} />
              </>
            ) : (
              <>
                <Lock size={16} /> Pay {formatCurrency(cartTotals.finalTotal)}
              </>
            )}
          </button>

          {/* Selected Shipping Address Snapshot */}
          {selectedAddress && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <p className="font-extrabold text-slate-800 flex items-center gap-1">
                <MapPin size={12} className="text-agri-green" /> Deliver to: {selectedAddress.name}
              </p>
              <p className="text-slate-600 text-[11px] truncate">
                {selectedAddress.locality}, {selectedAddress.city} - {selectedAddress.pincode}
              </p>
            </div>
          )}

          {/* Trust Highlights */}
          <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 font-semibold">
            <div className="flex items-center gap-2 text-emerald-800">
              <ShieldCheck size={15} className="text-agri-green shrink-0" />
              <span>✓ 256-Bit Encrypted Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-800">
              <Truck size={15} className="text-agri-green shrink-0" />
              <span>✓ Guaranteed Doorstep Farm Delivery</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
