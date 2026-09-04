import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight, ShieldCheck, Package, Calendar, CreditCard } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const state = location.state || {};
  const order = state.order || {};
  const paymentId = state.paymentId || order.paymentDetails?.razorpay_payment_id || 'N/A';
  const totalPaid = state.totalPaid || order.totalAmount || 0;
  const orderId = order._id || 'N/A';

  return (
    <div className="page-container py-12 sm:py-16 max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="card p-8 sm:p-12 text-center space-y-6 bg-white border border-slate-200/80 shadow-xl relative overflow-hidden">
        {/* Top Decorative Banner */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-emerald-600 via-agri-green to-emerald-400" />

        {/* Success Icon */}
        <div className="relative mx-auto w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner border border-emerald-200">
          <CheckCircle2 size={48} className="animate-scale-up" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
            ✓ PAYMENT VERIFIED & ORDER CONFIRMED
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto">
            Thank you for choosing AgriStore. Your certified agricultural inputs are being prepared for doorstep delivery.
          </p>
        </div>

        {/* Order Details Breakdown Card */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-bold flex items-center gap-1.5">
              <Package size={16} className="text-agri-green" /> AgriStore Order ID
            </span>
            <span className="font-mono font-extrabold text-slate-900">{orderId}</span>
          </div>

          {paymentId !== 'N/A' && (
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-slate-500 font-bold flex items-center gap-1.5">
                <CreditCard size={16} className="text-agri-green" /> Razorpay Payment ID
              </span>
              <span className="font-mono font-extrabold text-slate-900">{paymentId}</span>
            </div>
          )}

          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-slate-500 font-bold flex items-center gap-1.5">
              <Calendar size={16} className="text-agri-green" /> Date & Time
            </span>
            <span className="font-bold text-slate-800">{new Date().toLocaleString('en-IN')}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-slate-900 font-black">Total Paid Amount</span>
            <span className="text-xl font-black text-agri-forest">₹{totalPaid}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            to="/my-orders"
            className="btn-accent text-xs py-3.5 px-6 flex items-center justify-center gap-2 shadow-md"
          >
            <Package size={16} /> View My Orders
          </Link>
          <Link
            to="/products"
            className="btn-secondary text-xs py-3.5 px-6 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} /> Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>

        {/* Guarantee Footer */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-2">
          <ShieldCheck size={14} className="text-agri-green" />
          <span>Need help with your order? Contact toll-free support at 1800-AGRI-STORE</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
