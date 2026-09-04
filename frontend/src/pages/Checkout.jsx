import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Circle, CreditCard, Mail, MapPin, ShieldCheck, Truck, ArrowRight, Lock, Check, Plus, AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/ProductImage';
import RazorpayModal from '../components/RazorpayModal';
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
  const [savingAddress, setSavingAddress] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState({ 1: false, 2: false, 3: false });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '', type: 'Home'
  });

  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [pendingRazorpayOrder, setPendingRazorpayOrder] = useState(null);

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
    await api.post('/orders', {
      items: cart.map((item) => ({ productId: item._id, quantity: getItemQuantity(item) })),
      shippingAddress: shippingPayload,
      paymentMethod: 'COD'
    });
    clearCart();
    navigate('/my-orders');
  };

  const placeOnlineOrder = async () => {
    const { data: orderData } = await api.post('/payments/create-order', { amount: cartTotals.finalTotal });
    setPendingRazorpayOrder(orderData);
    setShowRazorpayModal(true);
  };

  const handleRazorpayModalSuccess = async (paymentResponse) => {
    try {
      await api.post('/payments/verify', {
        razorpay_order_id: pendingRazorpayOrder?.orderId || `order_demo_${Date.now()}`,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        items: cart.map((item) => ({ productId: item._id, quantity: getItemQuantity(item) })),
        shippingAddress: shippingPayload,
        notes: 'Paid online via Razorpay'
      });
      setShowRazorpayModal(false);
      clearCart();
      navigate('/my-orders');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment verification failed');
      setShowRazorpayModal(false);
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
    } finally {
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
              Order Review
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

      {/* Mobile Collapsible Summary Banner */}
      <div className="lg:hidden card overflow-hidden border-emerald-200">
        <button
          type="button"
          onClick={() => setMobileSummaryOpen(!mobileSummaryOpen)}
          className="w-full p-4 bg-slate-50 flex items-center justify-between font-bold text-xs text-slate-900"
        >
          <div className="flex items-center gap-2">
            <span>ORDER SUMMARY</span>
            <span className="text-agri-forest font-black">{formatCurrency(cartTotals.finalTotal)}</span>
          </div>
          {mobileSummaryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {mobileSummaryOpen && (
          <div className="p-4 space-y-3 border-t border-slate-200 bg-white">
            {cart.map((item) => {
              const uPrice = getItemUnitPrice(item);
              const qty = getItemQuantity(item);
              return (
                <div key={item._id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border">
                      <ProductImage src={item.imageUrl} category={item.category} aspect="aspect-square" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500">{qty} × {formatCurrency(uPrice)}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 shrink-0">{formatCurrency(uPrice * qty)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-800 rounded-xl flex items-center gap-3 text-xs font-bold">
          <AlertCircle size={18} className="shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Checkout Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Flow & Forms (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: DELIVERY ADDRESS */}
          <section className={`card p-6 space-y-4 transition-all ${activeStep === 1 ? 'ring-2 ring-agri-green/30 border-agri-green' : ''}`}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <MapPin size={22} className="text-agri-green" />
                <div>
                  <h2 className="text-lg font-black text-slate-900">1. Delivery Address</h2>
                  <p className="text-xs text-slate-500">Select address for dispatch</p>
                </div>
              </div>
              {activeStep !== 1 && (
                <button onClick={() => setActiveStep(1)} className="text-xs font-extrabold text-agri-green hover:underline">
                  Change Address
                </button>
              )}
            </div>

            {/* Address Selection Grid */}
            <div className="space-y-3">
              {addresses.map((addr) => {
                const active = selectedAddressId === addr._id;
                return (
                  <div
                    key={addr._id}
                    onClick={() => {
                      setSelectedAddressId(addr._id);
                      setCompletedSteps((prev) => ({ ...prev, 1: true }));
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      active
                        ? 'border-agri-green bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="selected_address"
                      checked={active}
                      onChange={() => {}}
                      className="mt-1 accent-agri-green"
                    />
                    <div className="space-y-1 flex-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{addr.name}</span>
                        <span className="bg-slate-200 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded">
                          {addr.type || 'Home'}
                        </span>
                        {addr.isDefault && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed">
                        {addr.locality}, {addr.address}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                      <p className="text-slate-500 font-bold">Phone: {addr.phone}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Address Form Modal */}
            <div className="pt-2">
              {!showAddressForm ? (
                <button
                  type="button"
                  onClick={() => setShowAddressForm(true)}
                  className="btn-secondary text-xs py-2.5 px-4 w-full flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add New Shipping Address
                </button>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">New Address Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <input
                      placeholder="Full Name *"
                      value={addressForm.name}
                      onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                      className="input-field"
                    />
                    <input
                      placeholder="Mobile Phone Number *"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="input-field"
                    />
                    <input
                      placeholder="Pincode *"
                      value={addressForm.pincode}
                      onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                      className="input-field"
                    />
                    <input
                      placeholder="Locality / Landmark *"
                      value={addressForm.locality}
                      onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                      className="input-field"
                    />
                    <input
                      placeholder="Street Address *"
                      value={addressForm.address}
                      onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                      className="input-field sm:col-span-2"
                    />
                    <input
                      placeholder="City / District *"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="input-field"
                    />
                    <input
                      placeholder="State *"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="input-field"
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
                          <ProductImage src={item.imageUrl} category={item.category} aspect="aspect-square" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                          <p className="text-slate-500 mt-0.5">
                            Quantity: <span className="font-bold text-slate-800">{qty}</span> × {formatCurrency(uPrice)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-black text-agri-forest text-sm block">{formatCurrency(itemSubtotal)}</span>
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
                <h2 className="text-lg font-black text-slate-900">3. Payment Option</h2>
                <p className="text-xs text-slate-500">Select preferred payment method</p>
              </div>
            </div>

            {activeStep === 3 && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* COD Option */}
                  <label
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'COD'
                        ? 'border-agri-green bg-emerald-50/50 ring-1 ring-agri-green'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input type="radio" checked={paymentMethod === 'COD'} onChange={() => {}} className="mt-1 accent-agri-green" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Cash on Delivery (COD)</p>
                      <p className="text-xs text-slate-500 mt-1">Pay with cash upon farm doorstep delivery.</p>
                    </div>
                  </label>

                  {/* Online Razorpay Option */}
                  <label
                    onClick={() => setPaymentMethod('Online')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                      paymentMethod === 'Online'
                        ? 'border-agri-green bg-emerald-50/50 ring-1 ring-agri-green'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <input type="radio" checked={paymentMethod === 'Online'} onChange={() => {}} className="mt-1 accent-agri-green" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Online Payment (Razorpay)</p>
                      <p className="text-xs text-slate-500 mt-1">UPI (GPay/PhonePe), Cards, NetBanking.</p>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={placing}
                    className="btn-accent w-full text-base py-4 shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                  >
                    {placing ? (
                      <span>Processing Order...</span>
                    ) : (
                      <>
                        <Lock size={18} />{' '}
                        {paymentMethod === 'Online'
                          ? `Pay ${formatCurrency(cartTotals.finalTotal)} via Razorpay`
                          : `Confirm & Place Order (${formatCurrency(cartTotals.finalTotal)})`}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Redesigned Sticky Order Summary (4 Cols) */}
        <aside className="lg:col-span-4 card p-6 lg:sticky lg:top-28 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide">
              ORDER SUMMARY
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {cartTotals.totalQuantity} items in shipment
            </p>
          </div>

          {/* Product Items Thumbnail List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => {
              const uPrice = getItemUnitPrice(item);
              const qty = getItemQuantity(item);
              const itemSubtotal = uPrice * qty;

              return (
                <div key={item._id} className="flex items-center justify-between gap-3 text-xs pb-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                      <ProductImage src={item.imageUrl} category={item.category} aspect="aspect-square" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate leading-snug">{item.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {qty} × {formatCurrency(uPrice)}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 shrink-0">{formatCurrency(itemSubtotal)}</span>
                </div>
              );
            })}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 text-xs sm:text-sm pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items Total ({cartTotals.totalQuantity})</span>
              <span className="font-bold text-slate-900">{formatCurrency(cartTotals.itemsTotal)}</span>
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
              <span className="font-black text-agri-forest text-xl sm:text-2xl">{formatCurrency(cartTotals.finalTotal)}</span>
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

      <RazorpayModal
        isOpen={showRazorpayModal}
        onClose={() => setShowRazorpayModal(false)}
        onSuccess={handleRazorpayModalSuccess}
        amount={cartTotals.finalTotal}
        userDetails={currentUser}
      />
    </div>
  );
};

export default Checkout;
