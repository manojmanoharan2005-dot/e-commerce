import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Search, Download, Sparkles, X, Clock, CheckCircle2, Truck, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import UserSidebar from '../components/UserSidebar';
import ProductImage from '../components/ProductImage';
import { OrderCardSkeleton } from '../components/Skeleton';
import Toast from '../components/Toast';

const timelineSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const ORDERS_CACHE_KEY = 'agristore_my_orders_cache_v1';

const statusText = {
  pending: 'PENDING',
  confirmed: 'CONFIRMED',
  processing: 'PROCESSING',
  shipped: 'SHIPPED',
  delivered: 'DELIVERED',
  cancelled: 'CANCELLED'
};

const statusColors = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  shipped: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200'
};

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [cancelModal, setCancelModal] = useState({ isOpen: false, orderId: null, reason: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const cached = localStorage.getItem(ORDERS_CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setOrders(parsed);
            setLoading(false);
          }
        }
      } catch {
        // Fallback to API call
      }

      try {
        const { data } = await api.get('/orders/my-orders');
        const nextOrders = data.orders || [];
        setOrders(nextOrders);
        localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(nextOrders));
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openCancelModal = (id) => {
    setCancelModal({ isOpen: true, orderId: id, reason: '' });
  };

  const confirmCancelOrder = async () => {
    if (!cancelModal.reason.trim()) {
      setToastMessage('Please enter a cancellation reason');
      return;
    }

    try {
      await api.patch(`/orders/${cancelModal.orderId}/cancel`, { reason: cancelModal.reason.trim() });
      setOrders((prev) => prev.map((o) => (o._id === cancelModal.orderId ? { ...o, status: 'cancelled' } : o)));
      setToastMessage('Order cancelled successfully');
      setCancelModal({ isOpen: false, orderId: null, reason: '' });
    } catch (err) {
      setToastMessage('Failed to cancel order: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return orders;

    return orders.filter((order) => {
      const idMatch = order._id?.toLowerCase().includes(q);
      const productMatch = order.items?.some((item) => item.name?.toLowerCase().includes(q));
      return idMatch || productMatch;
    });
  }, [orders, query]);

  const canCancel = (status) => ['pending', 'confirmed', 'processing'].includes(status);

  const downloadInvoice = async (orderId) => {
    try {
      const { data } = await api.get(`/orders/${orderId}/invoice`, { responseType: 'text' });
      const blob = new Blob([data], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      const win = window.open(url, '_blank', 'noopener,noreferrer');
      if (!win) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `AgriStore-Invoice-${orderId.slice(-8).toUpperCase()}.html`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }

      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch {
      setToastMessage('Invoice download failed. Please try again.');
    }
  };

  const getStepIndex = (status) => {
    if (status === 'cancelled') return -1;
    const idx = timelineSteps.indexOf(status);
    return idx >= 0 ? idx : 0;
  };

  const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="page-container py-8 space-y-8">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar (4 Cols) */}
        <div className="lg:col-span-4">
          <UserSidebar />
        </div>

        {/* Orders Content (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header & Search */}
          <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Orders</h1>
              <p className="text-xs text-slate-500 font-medium">Track purchases and view invoices</p>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search order ID or product..."
                className="input-field py-2 pl-9 text-xs"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <OrderCardSkeleton key={n} />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="card p-12 text-center space-y-4">
              <Package size={48} className="mx-auto text-slate-300" />
              <h3 className="text-xl font-black text-slate-900">No Orders Found</h3>
              <p className="text-xs text-slate-500">You haven't placed any agricultural orders yet.</p>
              <Link to="/products" className="btn-accent text-xs px-6 py-2.5 inline-flex">
                Shop Products
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const firstItem = order.items?.[0];
              const extraItems = Math.max((order.items?.length || 0) - 1, 0);
              const statusIndex = getStepIndex(order.status);
              const badgeStyle = statusColors[order.status] || 'bg-slate-100 text-slate-800';

              return (
                <div key={order._id} className="card overflow-hidden space-y-4 p-6">
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">ORDER ID</span>
                      <span className="font-black text-slate-900 text-sm">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">DATE PLACED</span>
                      <span className="font-bold text-slate-700 text-xs">{formatDate(order.createdAt)}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">TOTAL AMOUNT</span>
                      <span className="font-black text-agri-forest text-base">Rs. {order.totalAmount}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${badgeStyle}`}>
                        {statusText[order.status] || order.status}
                      </span>
                      <button
                        onClick={() => downloadInvoice(order._id)}
                        title="Download Invoice"
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                      <ProductImage src={firstItem?.imageUrl} category={firstItem?.category} aspect="aspect-square" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{firstItem?.name || 'Agri Item'}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Qty: {firstItem?.quantity || 1} • Rs. {firstItem?.price || 0}
                      </p>
                      {extraItems > 0 && (
                        <p className="text-xs text-agri-green font-bold mt-0.5">+{extraItems} more items in shipment</p>
                      )}
                    </div>
                  </div>

                  {/* Order Progress Timeline */}
                  {order.status !== 'cancelled' && (
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Placed</span>
                        <span>Confirmed</span>
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                      <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-agri-green transition-all duration-500"
                          style={{
                            width: `${Math.max(10, ((statusIndex + 1) / timelineSteps.length) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {canCancel(order.status) && (
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => openCancelModal(order._id)}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      {cancelModal.isOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-black text-slate-900">Cancel Order</h3>
            <p className="text-xs text-slate-500 font-medium">
              Please provide a reason for cancelling this agricultural order.
            </p>
            <textarea
              className="input-field min-h-[100px] text-xs"
              placeholder="e.g. Quantity change required, changed planting timeline..."
              value={cancelModal.reason}
              onChange={(e) => setCancelModal((prev) => ({ ...prev, reason: e.target.value }))}
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModal({ isOpen: false, orderId: null, reason: '' })}
                className="text-xs font-bold text-slate-500 hover:underline"
              >
                Keep Order
              </button>
              <button type="button" onClick={confirmCancelOrder} className="btn-accent text-xs py-2.5 px-5 bg-rose-600 hover:bg-rose-700">
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
