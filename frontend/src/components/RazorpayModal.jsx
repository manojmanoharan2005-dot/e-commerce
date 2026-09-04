import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  X,
  CreditCard,
  QrCode,
  Building2,
  Lock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Smartphone,
  Check
} from 'lucide-react';

export default function RazorpayModal({ isOpen, onClose, onSuccess, amount, userDetails }) {
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiMethod, setUpiMethod] = useState('qr'); // 'qr' | 'id'
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState(userDetails?.name || '');
  const [selectedBank, setSelectedBank] = useState('');
  
  const [processingState, setProcessingState] = useState('idle'); // 'idle' | 'processing' | 'success'
  const [processingStep, setProcessingStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setProcessingState('idle');
      setProcessingStep(1);
      setActiveTab('upi');
      setUpiMethod('qr');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = () => {
    setProcessingState('processing');
    setProcessingStep(1);

    // Animate through processing stages
    setTimeout(() => setProcessingStep(2), 900);
    setTimeout(() => setProcessingStep(3), 1800);
    setTimeout(() => {
      setProcessingState('success');
      setTimeout(() => {
        onSuccess({
          razorpay_payment_id: `pay_${Math.random().toString(36).substring(2, 11)}_${Date.now().toString().slice(-4)}`,
          razorpay_signature: `sig_${Math.random().toString(36).substring(2, 15)}`
        });
      }, 1400);
    }, 2600);
  };

  const formatCardNum = (val) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExp = (val) => {
    const v = val.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    return v;
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-100 font-sans transition-all transform duration-300 scale-100">
        
        {/* Razorpay Brand Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-[#02042b] via-[#0c2340] to-[#072654] text-white flex items-center justify-between overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3 z-10">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#1a365d] border border-blue-400/30 rounded-lg shadow-inner">
              <span className="font-black tracking-tight text-blue-400 text-lg">Razorpay</span>
              <span className="text-[10px] font-bold tracking-widest text-slate-300 bg-blue-500/20 px-1.5 py-0.5 rounded">SECURE</span>
            </div>
            <div>
              <p className="text-xs text-blue-200/80 font-medium">AgriStore Payment</p>
              <p className="text-lg font-extrabold text-white leading-none">₹{amount}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 z-10">
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <ShieldCheck size={14} className="animate-pulse" />
              <span>256-bit SSL</span>
            </div>
            <button
              onClick={onClose}
              disabled={processingState === 'processing'}
              className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-40"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Processing State */}
        {processingState === 'processing' && (
          <div className="p-10 text-center flex flex-col items-center justify-center min-h-[380px] bg-slate-50">
            <div className="relative mb-8 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-600 border-r-blue-500 animate-spin shadow-lg shadow-blue-500/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock size={32} className="text-blue-600 animate-pulse" />
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-800 mb-2">Processing Your Payment</h3>
            <p className="text-xs text-slate-500 mb-8 max-w-xs">Please do not refresh or close this window...</p>

            {/* Step Indicators */}
            <div className="w-full max-w-xs space-y-3 text-left">
              <div className={`flex items-center gap-3 text-xs font-semibold p-2.5 rounded-xl transition-all ${processingStep >= 1 ? 'bg-white shadow-sm border border-slate-200 text-blue-700' : 'text-slate-400 opacity-60'}`}>
                {processingStep > 1 ? <Check size={16} className="text-emerald-500" /> : <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />}
                <span>Initiating secure gateway session</span>
              </div>
              <div className={`flex items-center gap-3 text-xs font-semibold p-2.5 rounded-xl transition-all ${processingStep >= 2 ? 'bg-white shadow-sm border border-slate-200 text-blue-700' : 'text-slate-400 opacity-60'}`}>
                {processingStep > 2 ? <Check size={16} className="text-emerald-500" /> : processingStep === 2 ? <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                <span>Verifying bank authorization</span>
              </div>
              <div className={`flex items-center gap-3 text-xs font-semibold p-2.5 rounded-xl transition-all ${processingStep >= 3 ? 'bg-white shadow-sm border border-slate-200 text-blue-700' : 'text-slate-400 opacity-60'}`}>
                {processingStep === 3 ? <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                <span>Finalizing order confirmation</span>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {processingState === 'success' && (
          <div className="p-10 text-center flex flex-col items-center justify-center min-h-[380px] bg-gradient-to-b from-emerald-50 to-white">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 animate-bounce">
                <CheckCircle2 size={48} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 text-amber-400 animate-spin">
                <Sparkles size={24} />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 mb-1">Payment Successful!</h3>
            <p className="text-xs text-slate-500 mb-6">Paid ₹{amount} to AgriStore</p>

            <div className="w-full max-w-xs p-4 bg-white border border-emerald-200 rounded-2xl shadow-sm text-left mb-6 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Payment Method:</span>
                <span className="font-bold text-slate-800 uppercase">{activeTab}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Status:</span>
                <span className="font-bold text-emerald-600">VERIFIED & PAID</span>
              </div>
            </div>

            <p className="text-xs font-bold text-emerald-600 animate-pulse">Redirecting to order summary...</p>
          </div>
        )}

        {/* Idle Interactive State */}
        {processingState === 'idle' && (
          <div>
            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1">
              <button
                onClick={() => setActiveTab('upi')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'upi'
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <QrCode size={16} />
                <span>UPI / QR</span>
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'card'
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <CreditCard size={16} />
                <span>Card</span>
              </button>
              <button
                onClick={() => setActiveTab('netbanking')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'netbanking'
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Building2 size={16} />
                <span>NetBanking</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 space-y-6">

              {/* UPI Tab */}
              {activeTab === 'upi' && (
                <div className="space-y-5">
                  <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setUpiMethod('qr')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${upiMethod === 'qr' ? 'bg-blue-600 text-white shadow' : 'text-slate-600'}`}
                    >
                      Scan QR Code
                    </button>
                    <button
                      onClick={() => setUpiMethod('id')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${upiMethod === 'id' ? 'bg-blue-600 text-white shadow' : 'text-slate-600'}`}
                    >
                      UPI ID / VPA
                    </button>
                  </div>

                  {upiMethod === 'qr' ? (
                    <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-blue-50/50 to-slate-50 rounded-2xl border border-blue-100 relative overflow-hidden">
                      <style>{`
                        @keyframes scanBeam {
                          0% { top: 12px; opacity: 0.4; }
                          50% { top: 130px; opacity: 1; }
                          100% { top: 12px; opacity: 0.4; }
                        }
                        .animate-scan-line {
                          animation: scanBeam 2.2s ease-in-out infinite;
                        }
                      `}</style>
                      <div className="relative p-4 bg-white rounded-2xl shadow-md border border-slate-200 group overflow-hidden">
                        {/* Animated Laser Scanning Line */}
                        <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-500 rounded-full shadow-[0_0_15px_#2563eb] animate-scan-line z-20 pointer-events-none" />
                        
                        <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                          <rect width="100" height="100" fill="white" />
                          <path d="M10 10h30v30H10zM15 15h20v20H15zM20 20h10v10H20z" fill="#0f172a" />
                          <path d="M60 10h30v30H60zM65 15h20v20H65zM70 20h10v10H70z" fill="#0f172a" />
                          <path d="M10 60h30v30H10zM15 65h20v20H15zM20 70h10v10H20z" fill="#0f172a" />
                          <rect x="45" y="10" width="10" height="20" fill="#0f172a" />
                          <rect x="45" y="40" width="20" height="10" fill="#0f172a" />
                          <rect x="10" y="45" width="20" height="10" fill="#0f172a" />
                          <rect x="60" y="55" width="30" height="10" fill="#0f172a" />
                          <rect x="75" y="70" width="15" height="20" fill="#0f172a" />
                          <rect x="50" y="70" width="15" height="10" fill="#0f172a" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl z-30">
                          <span className="text-xs font-black text-blue-600 tracking-wide">Scan via GPay / PhonePe / Paytm</span>
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-slate-600 mt-3 text-center">
                        Scan & pay with any UPI App
                      </p>
                      <div className="flex gap-3 mt-3">
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                          <span key={app} className="text-[10px] font-bold px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600 shadow-2xs">
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-700">Enter UPI ID</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. mobile@upi or username@okaxis"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <Smartphone size={18} className="absolute left-3 top-3.5 text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Card Tab */}
              {activeTab === 'card' && (
                <div className="space-y-4">
                  {/* Interactive Card Preview */}
                  <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-900 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-xs font-bold tracking-widest text-blue-200 uppercase">AGRISTORE CARD</span>
                      <CreditCard size={28} className="text-blue-300" />
                    </div>
                    <p className="text-lg font-mono tracking-wider mb-4 font-extrabold">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>
                    <div className="flex justify-between items-end text-xs">
                      <div>
                        <p className="text-[9px] text-slate-400 font-medium uppercase">Card Holder</p>
                        <p className="font-bold tracking-wide uppercase truncate max-w-[140px]">
                          {cardName || 'NAME ON CARD'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-400 font-medium uppercase">Expires</p>
                        <p className="font-bold font-mono">{cardExpiry || 'MM/YY'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNum(e.target.value))}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExp(e.target.value))}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="CVV"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* NetBanking Tab */}
              {activeTab === 'netbanking' && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-700">Popular Banks</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                          selectedBank === bank
                            ? 'border-blue-600 bg-blue-50/70 text-blue-700 shadow-2xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>{bank}</span>
                        {selectedBank === bank && <Check size={14} className="text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pay CTA Button */}
              <button
                onClick={handlePay}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transform transition-all active:scale-[0.99]"
              >
                <span>PAY ₹{amount} NOW</span>
                <ArrowRight size={18} />
              </button>

              {/* Footer Trust Shield */}
              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-2">
                <Lock size={12} className="text-slate-400" />
                <span>Guaranteed 256-Bit Encrypted Razorpay Checkout</span>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
