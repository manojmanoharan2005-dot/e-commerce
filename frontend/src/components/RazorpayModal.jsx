import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  ArrowRight,
  Smartphone,
  Check,
  AlertCircle,
  RefreshCw,
  Wallet
} from 'lucide-react';

export default function RazorpayModal({
  isOpen,
  onClose,
  amount,
  cartItems = [],
  onContinueToRazorpay,
  isConnecting = false,
  connectionError = ''
}) {
  const [selectedMethod, setSelectedMethod] = useState('upi_qr');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('State Bank of India');
  const [bankSearch, setBankSearch] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setValidationError('');
      setSelectedMethod('upi_qr');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularBanks = [
    { name: 'State Bank of India', code: 'SBI' },
    { name: 'HDFC Bank', code: 'HDFC' },
    { name: 'ICICI Bank', code: 'ICICI' },
    { name: 'Axis Bank', code: 'AXIS' },
    { name: 'Kotak Mahindra', code: 'KOTAK' },
    { name: 'Punjab National Bank', code: 'PNB' }
  ];

  const filteredBanks = popularBanks.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const handleContinue = () => {
    setValidationError('');

    if (selectedMethod === 'upi_id') {
      if (!upiId.trim() || !upiId.includes('@')) {
        setValidationError('Please enter a valid UPI ID (e.g. mobile@upi or name@okaxis)');
        return;
      }
    }

    onContinueToRazorpay({
      method: selectedMethod,
      upiId: selectedMethod === 'upi_id' ? upiId : undefined,
      bank: selectedMethod === 'netbanking' ? selectedBank : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-slate-900/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden font-sans my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0F382C] via-[#15803D] to-[#09251D] text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 grid place-items-center">
              <ShieldCheck size={22} className="text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight leading-none">Choose Payment Method</h2>
              <p className="text-xs text-emerald-200/90 font-medium mt-1">Select your preferred secure payment option</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end leading-tight pr-3 border-r border-white/20">
              <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-widest">Total Payable</span>
              <span className="text-lg font-black">₹{amount}</span>
            </div>

            <button
              onClick={onClose}
              disabled={isConnecting}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-40"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Connecting Animated State Overlay */}
        {isConnecting ? (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[380px] bg-slate-50 space-y-4 animate-fadeIn">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-emerald-200 border-t-agri-green animate-spin shadow-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={28} className="text-agri-forest animate-pulse" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Connecting to Razorpay...</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto font-medium">
                Creating secure TEST order. Opening official Razorpay Checkout...
              </p>
            </div>
          </div>
        ) : (
          /* Main Selection Area */
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
            {/* Left Column: Payment Methods List (7 Cols) */}
            <div className="lg:col-span-7 p-5 sm:p-7 space-y-5 border-b lg:border-b-0 lg:border-r border-slate-200/80">
              
              {(validationError || connectionError) && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2 animate-fadeIn">
                  <AlertCircle size={16} className="shrink-0 text-rose-600" />
                  <span>{validationError || connectionError}</span>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Available Payment Options</p>

                {/* 1. UPI / QR */}
                <div
                  onClick={() => setSelectedMethod('upi_qr')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedMethod === 'upi_qr'
                      ? 'border-agri-green bg-emerald-50/60 ring-2 ring-agri-green/30 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl grid place-items-center ${selectedMethod === 'upi_qr' ? 'bg-agri-forest text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <QrCode size={20} />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">UPI / QR Code</p>
                        <p className="text-xs text-slate-500">Scan & pay using GPay, PhonePe, Paytm, or BHIM</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${selectedMethod === 'upi_qr' ? 'border-agri-green bg-agri-green text-white' : 'border-slate-300'}`}>
                      {selectedMethod === 'upi_qr' && <Check size={12} />}
                    </div>
                  </div>
                </div>

                {/* 2. UPI ID / VPA */}
                <div
                  onClick={() => setSelectedMethod('upi_id')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedMethod === 'upi_id'
                      ? 'border-agri-green bg-emerald-50/60 ring-2 ring-agri-green/30 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl grid place-items-center ${selectedMethod === 'upi_id' ? 'bg-agri-forest text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">UPI ID / VPA</p>
                        <p className="text-xs text-slate-500">Enter your UPI VPA ID (e.g., mobile@upi)</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${selectedMethod === 'upi_id' ? 'border-agri-green bg-agri-green text-white' : 'border-slate-300'}`}>
                      {selectedMethod === 'upi_id' && <Check size={12} />}
                    </div>
                  </div>

                  {selectedMethod === 'upi_id' && (
                    <div className="mt-3 pt-3 border-t border-emerald-200/60 animate-fadeIn">
                      <input
                        type="text"
                        placeholder="e.g. farmer@okaxis or 9876543210@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="input-field py-2 text-xs font-bold"
                      />
                    </div>
                  )}
                </div>

                {/* 3. Credit / Debit Card */}
                <div
                  onClick={() => setSelectedMethod('card')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedMethod === 'card'
                      ? 'border-agri-green bg-emerald-50/60 ring-2 ring-agri-green/30 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl grid place-items-center ${selectedMethod === 'card' ? 'bg-agri-forest text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">Credit / Debit Card</p>
                        <p className="text-xs text-slate-500">Visa, Mastercard, RuPay & major Indian banks</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${selectedMethod === 'card' ? 'border-agri-green bg-agri-green text-white' : 'border-slate-300'}`}>
                      {selectedMethod === 'card' && <Check size={12} />}
                    </div>
                  </div>
                </div>

                {/* 4. Net Banking */}
                <div
                  onClick={() => setSelectedMethod('netbanking')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedMethod === 'netbanking'
                      ? 'border-agri-green bg-emerald-50/60 ring-2 ring-agri-green/30 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl grid place-items-center ${selectedMethod === 'netbanking' ? 'bg-agri-forest text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Building2 size={20} />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">Net Banking</p>
                        <p className="text-xs text-slate-500">SBI, HDFC, ICICI, Axis, Kotak & 50+ banks</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${selectedMethod === 'netbanking' ? 'border-agri-green bg-agri-green text-white' : 'border-slate-300'}`}>
                      {selectedMethod === 'netbanking' && <Check size={12} />}
                    </div>
                  </div>
                </div>
                {/* 5. Wallet */}
                <div
                  onClick={() => setSelectedMethod('wallet')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedMethod === 'wallet'
                      ? 'border-agri-green bg-emerald-50/60 ring-2 ring-agri-green/30 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl grid place-items-center ${selectedMethod === 'wallet' ? 'bg-agri-forest text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Wallet size={20} />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">Wallet</p>
                        <p className="text-xs text-slate-500">Paytm, Mobikwik, PhonePe & major wallets</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${selectedMethod === 'wallet' ? 'border-agri-green bg-agri-green text-white' : 'border-slate-300'}`}>
                      {selectedMethod === 'wallet' && <Check size={12} />}
                    </div>
                  </div>
                </div>

                {/* Animated Gateway Banner */}
                <div className="p-4 bg-gradient-to-r from-emerald-900 via-agri-forest to-emerald-950 rounded-2xl text-white relative overflow-hidden shadow-inner flex items-center justify-between">
                  <div className="relative z-10 space-y-0.5">
                    <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Official Gateway</span>
                    <p className="text-xs font-bold text-emerald-100">Powered by Razorpay Secure Engine</p>
                  </div>
                  <div className="relative z-10 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 grid place-items-center animate-bounce">
                      <Lock size={15} className="text-emerald-300" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 grid place-items-center animate-pulse">
                      <ShieldCheck size={16} className="text-emerald-200" />
                    </div>
                  </div>
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
                </div>
              </div>
            </div>

            {/* Right Column: Summary & Continue CTA (5 Cols) */}
            <div className="lg:col-span-5 p-5 sm:p-7 bg-slate-50 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-wide">Order Summary</h3>
                  <p className="text-xs text-slate-500 font-medium">{cartItems.length} items in order</p>
                </div>

                {/* Items Summary */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0">
                      <span className="font-bold text-slate-800 truncate max-w-[180px]">{item.name}</span>
                      <span className="font-mono font-bold text-slate-900">₹{item.price * (item.quantity || 1)}</span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs pt-3 border-t border-slate-200">
                  <div className="flex justify-between text-slate-600">
                    <span>Items Total</span>
                    <span className="font-bold text-slate-900">₹{amount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Doorstep Shipping</span>
                    <span className="font-extrabold text-emerald-600 uppercase">FREE</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>GST & Taxes</span>
                    <span className="font-semibold text-slate-500">Included</span>
                  </div>
                  <div className="pt-3 border-t border-slate-300 flex justify-between items-baseline">
                    <span className="font-black text-slate-900 text-sm">TOTAL PAYABLE</span>
                    <span className="font-black text-agri-forest text-2xl">₹{amount}</span>
                  </div>
                </div>
              </div>

              {/* Continue to Razorpay Button */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={handleContinue}
                  disabled={isConnecting}
                  className="btn-accent w-full py-4 text-sm sm:text-base font-black shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      <span>Connecting to Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Razorpay — ₹{amount}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                  <Lock size={13} className="text-agri-green" />
                  <span>Official Razorpay TEST MODE Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
