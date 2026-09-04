import { useLocation, Link, useNavigate } from 'react';
import { CheckCircle2, ShoppingBag, Package, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/cartUtils';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get order data passed from Checkout page or location state
  const { order, paymentId, orderId } = location.state || {};

  const displayOrderId = order?._id || orderId || 'N/A';
  const displayPaymentId = order?.paymentDetails?.razorpay_payment_id || paymentId || 'N/A';
  const displayTotal = order?.totalAmount || 0;
  const shipping = order?.shippingAddress;

  return (
    <div className="page-container py-12 sm:py-16 max-w-2xl mx-auto space-y-6">
      {/* Success Card */}
      <div className="bg-white card p-6 sm:p-10 text-center space-y-6 shadow-xl border border-emerald-100">
        {/* Animated Checkmark Circle */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-50 text-emerald-600 rounded-full grid place-items-center mx-auto shadow-inner border border-emerald-200">
          <CheckCircle2 size={56} className="text-emerald-600" />
        </div>

        <div className="space-y-2">
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Payment Verified & Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Thank you for shopping with AgriStore. Your order has been confirmed and is being processed for dispatch.
          </p>
        </div>

        {/* Order Info Summary Box */}
        <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200/80 text-left space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
            <div>
              <span className="text-slate-400 font-bold text-[11px] uppercase block">Order Reference ID</span>
              <span className="font-extrabold text-slate-900 text-xs sm:text-sm font-mono select-all">
                {displayOrderId}
              </span>
            </div>
            <div>
              <span className="text-slate-400 font-bold text-[11px] uppercase block">Razorpay Payment ID</span>
              <span className="font-extrabold text-emerald-700 text-xs sm:text-sm font-mono select-all">
                {displayPaymentId}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-extrabold text-slate-700">Total Paid Amount</span>
            <span className="font-black text-agri-forest text-xl">{formatCurrency(displayTotal)}</span>
          </div>

          {shipping && (
            <div className="pt-3 border-t border-slate-200 text-xs space-y-1">
              <span className="text-slate-400 font-bold text-[11px] uppercase block">Delivery Address</span>
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <MapPin size={14} className="text-agri-green shrink-0" /> {shipping.name} ({shipping.phone})
              </p>
              <p className="text-slate-600 pl-5">
                {shipping.street || `${shipping.locality}, ${shipping.address}`}, {shipping.city}, {shipping.state} - {shipping.pincode}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/my-orders')}
            className="btn-accent text-xs sm:text-sm py-3.5 flex items-center justify-center gap-2"
          >
            <Package size={18} /> View My Orders
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn-secondary text-xs sm:text-sm py-3.5 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} /> Continue Shopping
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-2">
          <ShieldCheck size={16} className="text-agri-green" /> 100% Genuine AgriStore Certified Order
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
