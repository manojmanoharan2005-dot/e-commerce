import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Circle, CreditCard, Mail, MapPin, ShieldCheck, Truck, ArrowRight, Lock, Check, Plus, AlertCircle, RefreshCw } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState('Online');
  const [placing, setPlacing] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [error, setError] = useState('');
  const [paymentStatusMessage, setPaymentStatusMessage] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({ 1: false, 2: false, 3: false });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '', type: 'Home'
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isConnectingRazorpay, setIsConnectingRazorpay] = useState(false);
  const [connectionError, setConnectionError] = useState('');

  useEffect(() => {
    loadRazorpay();
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
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
    navigate('/order-success', {
      state: { order: data.order, totalPaid: cartTotals.finalTotal }
    });
  };

  const handleOpenPaymentModal = () => {
    setError('');
    setConnectionError('');
    setPaymentStatusMessage('');
    if (!selectedAddressId) {
      setError('Please select or add a delivery address');
      setActiveStep(1);
      return;
    }
    setShowPaymentModal(true);
  };

  const handleOnlinePayment = async () => {
    setError('');
    setPaymentStatusMessage('');

    if (!selectedAddressId) {
      setError('Please select or add a delivery address');
      setActiveStep(1);
      return;
    }
    if (!cart.length) {
      setError('Cart is empty');
      return;
    }

    try {
      setIsConnectingRazorpay(true);
      setPaymentStatusMessage('Connecting to secure Razorpay Checkout...');

      // 1. Create Razorpay TEST Order from backend
      const { data: orderData } = await api.post('/payments/create-order', { amount: cartTotals.finalTotal });
      const razorpayKey = orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TXyjruJSuz8ekH';

      const isLoaded = await loadRazorpay();
      if (!isLoaded || !window.Razorpay) {
        throw new Error('Razorpay Checkout SDK failed to load. Please check your internet connection.');
      }

      setIsConnectingRazorpay(false);
      setPaymentStatusMessage('');

      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'AgriStore',
        description: 'AgriStore Certified Agricultural Order',
        order_id: orderData.orderId,
        handler: async function (response) {
          setPaymentStatusMessage('Verifying payment signature with backend...');
          try {
            const verifyRes = await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: cart.map((item) => ({ productId: item._id, quantity: getItemQuantity(item) })),
              shippingAddress: shippingPayload,
              notes: 'Paid via Official Razorpay Checkout (TEST MODE)'
            });

            clearCart();
            navigate('/order-success', {
              state: {
                order: verifyRes.data.order,
                paymentId: response.razorpay_payment_id,
                totalPaid: cartTotals.finalTotal
              }
            });
          } catch (vErr) {
            setError(vErr.response?.data?.message || 'Payment verification failed: Invalid signature');
          } finally {
            setPaymentStatusMessage('');
          }
        },
        prefill: {
          name: shippingPayload?.name || currentUser?.name || '',
          email: currentUser?.email || '',
          contact: shippingPayload?.phone || currentUser?.phone || ''
        },
        theme: { color: '#0F382C' },
        modal: {
          ondismiss: function () {
            setError('Payment cancelled. You can retry payment when ready.');
            setPaymentStatusMessage('');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        const failureData = response.error || {};
        console.error('Razorpay Payment Failed Event:', {
          code: failureData.code,
          description: failureData.description,
          source: failureData.source,
          step: failureData.step,
          reason: failureData.reason,
          order_id: failureData.metadata?.order_id,
          payment_id: failureData.metadata?.payment_id
        });
        setError(`Razorpay Payment Failed: ${failureData.description || failureData.reason || 'Transaction could not be completed'}`);
        setPaymentStatusMessage('');
      });
      rzp.open();
    } catch (err) {
      setIsConnectingRazorpay(false);
      setPaymentStatusMessage('');
      setError(err.response?.data?.message || err.message || 'Unable to connect to Razorpay. Please try again.');
    }
  };

  const placeOrder = async () => {
    setError('');
    setPaymentStatusMessage('');
    if (!selectedAddressId) {
      setError('Please select or add a delivery address');
      setActiveStep(1);
      return;
    }
    if (!cart.length) {
      setError('Cart is empty');
      return;
    }

    try {
      if (paymentMethod === 'COD') {
        setPlacing(true);
        await placeCodOrder();
        setPlacing(false);
      } else {
        await handleOnlinePayment();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to place order.');
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

  return (
    <div className="page-container py-8 space-y-8">
      {/* Title Header */}
      <div className="border-b border-slate-200 pb-6 space-y-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-sm text-slate-500 font-medium">Complete your order with secure doorstep delivery</p>
      </div>

      {/* Progress Steps Header */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto">
        <button
          onClick={() => setActiveStep(1)}
          className={`p-3 rounded-2xl border text-center transition-all flex flex-col sm:flex-row items-center justify-center gap-2 ${
            activeStep === 1
              ? 'border-agri-green bg-emerald-50 text-agri-forest font-extrabold shadow-xs'
              : completedSteps[1]
              ? 'border-slate-200 bg-white text-slate-800 font-bold'
              : 'border-slate-200 bg-slate-50 text-slate-400 font-medium'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-agri-forest text-white text-xs font-black grid place-items-center shrink-0">1</span>
          <span className="text-xs sm:text-sm truncate">Address</span>
        </button>

        <button
          onClick={() => completedSteps[1] && setActiveStep(2)}
          disabled={!completedSteps[1]}
          className={`p-3 rounded-2xl border text-center transition-all flex flex-col sm:flex-row items-center justify-center gap-2 ${
            activeStep === 2
              ? 'border-agri-green bg-emerald-50 text-agri-forest font-extrabold shadow-xs'
              : completedSteps[2]
              ? 'border-slate-200 bg-white text-slate-800 font-bold'
              : 'border-slate-200 bg-slate-50 text-slate-400 font-medium disabled:opacity-50'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-agri-forest text-white text-xs font-black grid place-items-center shrink-0">2</span>
          <span className="text-xs sm:text-sm truncate">Order Review</span>
        </button>

        <button
          onClick={() => completedSteps[2] && setActiveStep(3)}
          disabled={!completedSteps[2]}
          className={`p-3 rounded-2xl border text-center transition-all flex flex-col sm:flex-row items-center justify-center gap-2 ${
            activeStep === 3
              ? 'border-agri-green bg-emerald-50 text-agri-forest font-extrabold shadow-xs'
              : completedSteps[3]
              ? 'border-slate-200 bg-white text-slate-800 font-bold'
              : 'border-slate-200 bg-slate-50 text-slate-400 font-medium disabled:opacity-50'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-agri-forest text-white text-xs font-black grid place-items-center shrink-0">3</span>
          <span className="text-xs sm:text-sm truncate">Payment</span>
        </button>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 max-w-4xl mx-auto shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="text-rose-600 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Global Status Banner */}
      {paymentStatusMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 max-w-4xl mx-auto animate-pulse">
          <RefreshCw size={16} className="animate-spin text-agri-green" />
          <span>{paymentStatusMessage}</span>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Steps (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* STEP 1: DELIVERY ADDRESS */}
          <section className={`card p-6 space-y-4 transition-all ${activeStep === 1 ? 'ring-2 ring-agri-green/30 border-agri-green' : ''}`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <MapPin size={22} className="text-agri-green" />
                <div>
                  <h2 className="text-lg font-black text-slate-900">1. Delivery Address</h2>
                  <p className="text-xs text-slate-500">Select or add your farm delivery location</p>
                </div>
              </div>
              {activeStep !== 1 && selectedAddress && (
                <button onClick={() => setActiveStep(1)} className="text-xs font-extrabold text-agri-green hover:underline">
                  Change Address
                </button>
              )}
            </div>

            {activeStep === 1 && (
              <div className="space-y-4">
                {addresses.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {addresses.map((addr) => {
                      const isSelected = addr._id === selectedAddressId;
                      return (
                        <div
                          key={addr._id}
                          onClick={() => setSelectedAddressId(addr._id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1.5 ${
                            isSelected
                              ? 'border-agri-green bg-emerald-50/60 ring-2 ring-agri-green/30 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-slate-900">{addr.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                              {addr.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">{addr.locality}, {addr.address}</p>
                          <p className="text-xs font-bold text-slate-800">{addr.city}, {addr.state} - {addr.pincode}</p>
                          <p className="text-[11px] text-slate-500 font-semibold">Phone: {addr.phone}</p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!showAddressForm ? (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="btn-secondary text-xs py-3 w-full flex items-center justify-center gap-2 border-dashed border-2"
                  >
                    <Plus size={16} /> Add New Farm Delivery Address
                  </button>
                ) : (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fadeIn">
                    <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">New Address Form</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        placeholder="Full Name *"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                        className="input-field py-2 text-xs"
                      />
                      <input
                        placeholder="10-digit Phone Number *"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="input-field py-2 text-xs"
                      />
                      <input
                        placeholder="Pincode *"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="input-field py-2 text-xs"
                      />
                      <input
                        placeholder="Locality / Village / Landmark *"
                        value={addressForm.locality}
                        onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                        className="input-field py-2 text-xs"
                      />
                      <input
                        placeholder="Street Address *"
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                        className="input-field py-2 text-xs sm:col-span-2"
                      />
                      <input
                        placeholder="City / District *"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="input-field py-2 text-xs"
                      />
                      <input
                        placeholder="State *"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="input-field py-2 text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={addAddress}
                        disabled={savingAddress}
                        className="btn-accent text-xs py-2.5 px-6"
                      >
                        {savingAddress ? 'Saving Address...' : 'Save & Use Address'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="text-xs text-slate-500 hover:underline font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeStep === 1 && (
              <button
                type="button"
                onClick={() => {
                  if (!selectedAddressId) {
                    setError('Please select an address');
                    return;
                  }
                  setError('');
                  setCompletedSteps((prev) => ({ ...prev, 1: true }));
                  setActiveStep(2);
                }}
                className="btn-primary w-full text-xs py-3 mt-4"
              >
                Proceed to Order Review →
              </button>
            )}
          </section>

          {/* STEP 2: ORDER REVIEW */}
          <section className={`card p-6 space-y-4 transition-all ${activeStep === 2 ? 'ring-2 ring-agri-green/30 border-agri-green' : ''}`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <Truck size={22} className="text-agri-green" />
                <div>
                  <h2 className="text-lg font-black text-slate-900">2. Order Review ({cartTotals.totalQuantity} items)</h2>
                  <p className="text-xs text-slate-500">Review products before payment</p>
                </div>
              </div>
              {activeStep !== 2 && (
                <button onClick={() => setActiveStep(2)} className="text-xs font-extrabold text-agri-green hover:underline">
                  Review Items
                </button>
              )}
            </div>

            {activeStep === 2 && (
              <div className="space-y-3">
                {cart.map((item) => {
                  const uPrice = getItemUnitPrice(item);
                  const qty = getItemQuantity(item);
                  const itemSubtotal = uPrice * qty;

                  return (
                    <div key={item._id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 rounded-lg bg-white overflow-hidden border border-slate-200 shrink-0">
                          <ProductImage product={item} src={item.imageUrl} category={item.category} aspect="aspect-square" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                          <p className="text-slate-500 mt-0.5">
                            Quantity: <span className="font-bold text-slate-800">{qty}</span> × ₹{uPrice}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-agri-forest text-sm block">₹{itemSubtotal}</span>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setCompletedSteps((prev) => ({ ...prev, 2: true }));
                    setActiveStep(3);
                  }}
                  className="btn-primary w-full text-xs py-3 mt-4"
                >
                  Proceed to Payment →
                </button>
              </div>
            )}
          </section>

          {/* STEP 3: PAYMENT OPTION */}
          <section className={`card p-6 space-y-4 transition-all ${activeStep === 3 ? 'ring-2 ring-agri-green/30 border-agri-green' : ''}`}>
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <CreditCard size={22} className="text-agri-green" />
              <div>
                <h2 className="text-lg font-black text-slate-900">3. Choose Payment Option</h2>
                <p className="text-xs text-slate-500">Select Cash on Delivery or Official Razorpay Checkout</p>
              </div>
            </div>

            {activeStep === 3 && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Online Official Razorpay Option */}
                  <label
                    onClick={() => setPaymentMethod('Online')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'Online'
                        ? 'border-agri-green bg-emerald-50/60 ring-2 ring-agri-green/30 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input type="radio" checked={paymentMethod === 'Online'} onChange={() => {}} className="mt-1 accent-agri-green" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-extrabold text-slate-900 text-sm">Online Payment</p>
                        <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">RAZORPAY</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">UPI, UPI QR, Cards, NetBanking & Wallets via Official Razorpay.</p>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'COD'
                        ? 'border-agri-green bg-emerald-50/60 ring-2 ring-agri-green/30 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input type="radio" checked={paymentMethod === 'COD'} onChange={() => {}} className="mt-1 accent-agri-green" />
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm">Cash on Delivery (COD)</p>
                      <p className="text-xs text-slate-500 mt-1">Pay with cash upon doorstep delivery.</p>
                    </div>
                  </label>
                </div>

                {/* Primary Action Button */}
                <div className="pt-4 border-t border-slate-100">
                  {paymentMethod === 'Online' ? (
                    <button
                      type="button"
                      onClick={handleOnlinePayment}
                      disabled={isConnectingRazorpay || placing}
                      className="btn-accent w-full text-base py-4 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isConnectingRazorpay ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          <span>Connecting to Razorpay...</span>
                        </>
                      ) : (
                        <>
                          <Lock size={18} />
                          <span>Continue to Razorpay — ₹{cartTotals.finalTotal}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={placeOrder}
                      disabled={placing}
                      className="btn-accent w-full text-base py-4 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      {placing ? (
                        <span>Processing Order...</span>
                      ) : (
                        <>
                          <Lock size={18} />
                          <span>Confirm & Place COD Order (₹{cartTotals.finalTotal})</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Sticky Order Summary (4 Cols) */}
        <aside className="lg:col-span-4 card p-6 lg:sticky lg:top-28 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide">ORDER SUMMARY</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{cartTotals.totalQuantity} items in shipment</p>
          </div>

          {/* Items Thumbnail List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => {
              const uPrice = getItemUnitPrice(item);
              const qty = getItemQuantity(item);
              const itemSubtotal = uPrice * qty;

              return (
                <div key={item._id} className="flex items-center justify-between gap-3 text-xs pb-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <ProductImage product={item} src={item.imageUrl} category={item.category} aspect="aspect-square" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate leading-snug">{item.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {qty} × ₹{uPrice}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 shrink-0">₹{itemSubtotal}</span>
                </div>
              );
            })}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 text-xs sm:text-sm pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items Total ({cartTotals.totalQuantity})</span>
              <span className="font-bold text-slate-900">₹{cartTotals.itemsTotal}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Shipping</span>
              <span className="font-extrabold text-emerald-600 uppercase">FREE</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>GST & Taxes</span>
              <span className="font-semibold text-slate-500">Included</span>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="font-black text-slate-900 text-sm sm:text-base">TOTAL PAYABLE</span>
              <span className="font-black text-agri-forest text-xl sm:text-2xl">₹{cartTotals.finalTotal}</span>
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
            disabled={placing}
            className="btn-accent w-full text-xs sm:text-sm py-3.5 shadow-md flex items-center justify-center gap-2"
          >
            {placing ? (
              <span>Processing...</span>
            ) : activeStep < 3 ? (
              <>
                Proceed to Payment <ArrowRight size={16} />
              </>
            ) : paymentMethod === 'Online' ? (
              <>
                <Lock size={16} /> Choose Payment & Pay ₹{cartTotals.finalTotal}
              </>
            ) : (
              <>
                <Lock size={16} /> Confirm Order (₹{cartTotals.finalTotal})
              </>
            )}
          </button>

          {/* Selected Address */}
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
              <span>✓ 256-Bit Encrypted Official Razorpay Checkout</span>
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
