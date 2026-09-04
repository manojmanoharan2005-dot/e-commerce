import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/ProductImage';
import { calculateCartTotals, formatCurrency, getItemQuantity, getItemUnitPrice } from '../utils/cartUtils';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const totals = calculateCartTotals(cart);

  if (cart.length === 0) {
    return (
      <div className="page-container py-16 text-center max-w-xl mx-auto space-y-6">
        <div className="w-24 h-24 bg-emerald-50 text-agri-green rounded-full grid place-items-center mx-auto shadow-inner">
          <ShoppingBag size={48} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Your Cart is Waiting</h1>
          <p className="text-slate-500 text-sm font-medium">
            Explore certified seeds, fertilizers, and tools for your farm.
          </p>
        </div>
        <Link to="/products" className="btn-accent text-sm px-8 py-3.5 inline-flex items-center gap-2">
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-sm text-slate-500 font-medium">{totals.totalQuantity} items ready for checkout</p>
        </div>
        <Link to="/products" className="text-xs font-extrabold text-agri-green hover:underline flex items-center gap-1">
          ← Continue Shopping
        </Link>
      </div>

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const uPrice = getItemUnitPrice(item);
            const qty = getItemQuantity(item);
            const itemSubtotal = uPrice * qty;

            return (
              <div key={item._id} className="card p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                {/* Product Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <ProductImage
                    product={item}
                    src={item.imageUrl}
                    alt={item.name}
                    category={item.category}
                    aspect="aspect-square"
                  />
                </div>

                {/* Product Title & Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <span className="text-[10px] font-extrabold text-agri-green uppercase tracking-wider">
                    {item.category || 'Agri Product'}
                  </span>
                  <Link to={`/products/${item._id}`} className="font-bold text-slate-900 hover:text-agri-forest text-sm sm:text-base line-clamp-1 block">
                    {item.name}
                  </Link>
                  <p className="text-xs font-semibold text-slate-400">
                    Unit Price: <span className="text-slate-700 font-extrabold">{formatCurrency(uPrice)}</span>
                  </p>
                </div>

                {/* Quantity Selector & Item Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                    <button
                      onClick={() => updateQuantity(item._id, qty - 1)}
                      className="p-1.5 text-slate-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-extrabold text-slate-800 text-xs">{qty}</span>
                    <button
                      onClick={() => updateQuantity(item._id, qty + 1)}
                      className="p-1.5 text-slate-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-black text-agri-forest">{formatCurrency(itemSubtotal)}</p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    title="Remove from cart"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 text-center text-xs text-slate-500">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
              <ShieldCheck size={18} className="mx-auto text-agri-green mb-1" />
              <span className="font-bold block text-slate-800">Quality Assured</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
              <Truck size={18} className="mx-auto text-agri-green mb-1" />
              <span className="font-bold block text-slate-800">Express Delivery</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
              <CreditCard size={18} className="mx-auto text-agri-green mb-1" />
              <span className="font-bold block text-slate-800">Razorpay Encrypted</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (4 Cols) */}
        <aside className="lg:col-span-4 card p-6 lg:sticky lg:top-28 space-y-6">
          <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">Order Summary</h2>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items Subtotal ({totals.totalQuantity})</span>
              <span className="font-bold text-slate-900">{formatCurrency(totals.itemsTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Estimated Shipping</span>
              <span className="font-extrabold text-emerald-600">FREE</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Taxes & GST</span>
              <span className="font-semibold text-slate-500">Included</span>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="font-black text-slate-900 text-base">Total Amount</span>
              <span className="font-black text-agri-forest text-2xl">{formatCurrency(totals.finalTotal)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="btn-accent w-full text-sm py-4 shadow-lg shadow-emerald-600/20"
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>

          <p className="text-[11px] text-center text-slate-400 font-medium">
            🔒 Safe and secure encrypted checkout
          </p>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
