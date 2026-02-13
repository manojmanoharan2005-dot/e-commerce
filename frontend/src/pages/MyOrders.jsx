import { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import { Search, Loader, Circle, ChevronRight, Package, Download, Truck, Box, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/orders/my-orders');
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;

        try {
            const response = await api.patch(`/orders/${orderId}/cancel`);
            if (response.data.success) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId ? { ...order, status: 'cancelled' } : order
                    )
                );
            }
        } catch (error) {
            console.error('Cancel order error:', error);
            alert(error.response?.data?.message || 'Failed to cancel order');
        }
    };

    const handleDownloadInvoice = (order) => {
        const invoiceWindow = window.open('', '_blank');
        const invoiceHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Invoice - ${order._id}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap');
                        body { font-family: 'Outfit', sans-serif; padding: 60px; color: #0f172a; line-height: 1.6; }
                        .header { display: flex; justify-content: space-between; border-bottom: 4px solid #10b981; padding-bottom: 30px; }
                        .logo { color: #0f172a; font-size: 32px; font-weight: 900; letter-spacing: -1px; }
                        .logo span { color: #10b981; }
                        .invoice-info { text-align: right; }
                        .billing { margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
                        .table { width: 100%; margin-top: 50px; border-collapse: collapse; }
                        .table th { background: #f8fafc; text-align: left; padding: 15px; border-bottom: 2px solid #e2e8f0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                        .table td { padding: 15px; border-bottom: 1px solid #f1f5f9; }
                        .total { margin-top: 40px; text-align: right; font-size: 24px; font-weight: 900; color: #0f172a; }
                        .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 30px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">Agri<span>Store</span></div>
                        <div class="invoice-info">
                            <h3 style="margin:0; font-weight:900; color:#10b981;">OFFICIAL INVOICE</h3>
                            <p style="margin:5px 0 0 0; font-weight:700;">#ORD-${order._id.substring(0, 8).toUpperCase()}</p>
                            <p style="margin:5px 0 0 0; color:#64748b;">${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>
                    
                    <div class="billing">
                        <div>
                            <strong style="text-transform:uppercase; font-size:11px; color:#64748b; letter-spacing:1px;">Fulfillment Partner</strong><br>
                            <span style="font-weight:700;">AgriStore Global Solutions</span><br>
                            123 Logistics Park, Sector 45<br>
                            Chandihar, IN - 160047
                        </div>
                        <div>
                            <strong style="text-transform:uppercase; font-size:11px; color:#64748b; letter-spacing:1px;">Recipient Details</strong><br>
                            <span style="font-weight:700;">${order.shippingAddress?.name}</span><br>
                            ${order.shippingAddress?.street}, ${order.shippingAddress?.city}<br>
                            ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}
                        </div>
                        <div>
                            <strong style="text-transform:uppercase; font-size:11px; color:#64748b; letter-spacing:1px;">Payment Information</strong><br>
                            <span style="font-weight:700;">Mode: ${order.paymentMethod === 'Online' ? 'Prepaid (Razorpay)' : 'Cash on Delivery'}</span><br>
                            ${order.paymentDetails?.razorpay_payment_id ? `UTR ID: <span style="font-weight:700;">${order.paymentDetails.razorpay_payment_id}</span>` : `Ref: <span style="font-weight:700; color:#amber-600;">PENDING</span>`}
                        </div>
                    </div>

                    <table class="table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Unit Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td style="font-weight:700;">${item.name}</td>
                                    <td>₹${item.price}</td>
                                    <td>${item.quantity}</td>
                                    <td style="font-weight:700;">₹${item.subtotal || item.price * item.quantity}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="total">Grand Total: ₹${order.totalAmount}</div>

                    <div class="footer">
                        <p>This invoice confirms your purchase from AgriStore. Thank you for shopping with us!</p>
                        <p>&copy; ${new Date().getFullYear()} AgriStore. All rights reserved.</p>
                    </div>
                    <script>window.print();</script>
                </body>
            </html>
        `;
        invoiceWindow.document.write(invoiceHtml);
        invoiceWindow.document.close();
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'delivered': return { color: 'text-emerald-500', bg: 'bg-emerald-500', icon: CheckCircle, text: 'Delivered' };
            case 'shipped': return { color: 'text-indigo-500', bg: 'bg-indigo-500', icon: Truck, text: 'Shipped' };
            case 'cancelled': return { color: 'text-rose-500', bg: 'bg-rose-500', icon: AlertCircle, text: 'Cancelled' };
            default: return { color: 'text-amber-500', bg: 'bg-amber-500', icon: Box, text: 'Processing' };
        }
    };

    const filteredOrders = orders.filter(order =>
        order.items.some(item =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || order._id.includes(searchTerm)
    );

    const renderTrackingSteps = (currentStatus) => {
        const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        const currentIndex = steps.indexOf(currentStatus);

        if (currentStatus === 'cancelled') {
            return (
                <div className="flex items-center gap-2 mt-6 p-3 bg-rose-50 rounded-2xl border border-rose-100">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase text-rose-600 tracking-widest">Order Cancelled</span>
                </div>
            );
        }

        return (
            <div className="mt-8 flex items-center w-full px-2 relative">
                <div className="absolute top-1.5 left-0 w-full h-[2px] bg-slate-100 -z-0"></div>
                {steps.map((step, idx) => (
                    <div key={step} className="flex items-center relative flex-1 last:flex-none">
                        <div className={`w-3 h-3 rounded-full z-10 border-2 border-white transition-colors duration-500 ${idx <= currentIndex ? 'bg-accent' : 'bg-slate-200'}`}>
                            {idx === currentIndex && (
                                <div className="w-full h-full bg-accent rounded-full animate-ping opacity-40"></div>
                            )}
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`absolute top-1.5 left-0 h-[2px] transition-all duration-700 ${idx < currentIndex ? 'bg-accent w-full' : 'w-0'}`}></div>
                        )}
                        <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase whitespace-nowrap tracking-tight transition-colors ${idx === currentIndex ? 'text-primary' : 'text-slate-300'}`}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-8">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    <div className="lg:w-80 shrink-0 w-full">
                        <UserSidebar />
                    </div>

                    <div className="flex-1 w-full space-y-6">
                        {/* Order Search Bar - Modernized */}
                        <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 flex items-center gap-2 border border-slate-100 group focus-within:ring-2 focus-within:ring-accent/20 transition-all">
                            <div className="p-4 rounded-2xl bg-slate-50 group-focus-within:bg-accent/10 transition-colors">
                                <Search className="w-5 h-5 text-slate-400 group-focus-within:text-accent" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search your orders or specific products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm font-black italic tracking-tight text-primary placeholder:text-slate-300 h-full"
                            />
                            <button className="bg-primary text-white px-10 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                Search
                            </button>
                        </div>

                        {loading ? (
                            <div className="bg-white p-32 flex flex-col items-center justify-center rounded-[3rem] border border-slate-100 shadow-xl">
                                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6"></div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Loading Order History...</p>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="bg-white p-32 text-center rounded-[3rem] border border-slate-100 shadow-xl group">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <Package className="w-10 h-10 text-slate-200" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter mb-2">NO ORDERS FOUND</h3>
                                <p className="text-slate-400 text-sm font-medium mb-10">You haven't placed any orders that match your search yet.</p>
                                <Link to="/products" className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20">Go Shopping</Link>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {filteredOrders.map((order) => (
                                    <div key={order._id} className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-accent/10 transition-all overflow-hidden group">
                                        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
                                                    <Sparkles className="w-4 h-4 text-accent" />
                                                </div>
                                                <div>
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Order ID</p>
                                                    <p className="text-xs font-black text-primary">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Amount</p>
                                                    <p className="text-sm font-black text-primary italic">₹{order.totalAmount.toFixed(0)}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDownloadInvoice(order)}
                                                    className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                                                    title="Download Invoice"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="divide-y divide-slate-50">
                                            {order.items.map((item, idx) => {
                                                const status = getStatusInfo(order.status);
                                                return (
                                                    <div key={`${order._id}-${idx}`} className="flex flex-col lg:flex-row items-center gap-8 p-8 hover:bg-slate-50/10 transition-colors">
                                                        <Link to={`/products/${item.productId?._id}`} className="w-24 h-24 bg-slate-50 rounded-3xl p-4 shrink-0 group-hover:rotate-2 transition-transform">
                                                            <img
                                                                src={item.productId?.imageUrl || '/images/placeholder.png'}
                                                                alt={item.name}
                                                                className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110"
                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Product'; }}
                                                            />
                                                        </Link>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="mb-2">
                                                                <span className="bg-slate-100 text-[8px] font-black text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest mb-2 inline-block">Category: {item.productId?.category || 'General'}</span>
                                                                <Link to={`/products/${item.productId?._id}`}>
                                                                    <h4 className="text-lg font-black text-primary leading-none italic tracking-tighter hover:text-accent transition-colors line-clamp-1 h-5 overflow-hidden">
                                                                        {item.name}
                                                                    </h4>
                                                                </Link>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                                                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Price: ₹{item.price}</p>
                                                            </div>
                                                        </div>

                                                        <div className="w-full lg:w-72">
                                                            <div className="flex items-center gap-4 mb-4">
                                                                <div className={`p-2 rounded-xl bg-opacity-10 ${status.color.replace('text', 'bg')}`}>
                                                                    <status.icon className={`w-4 h-4 ${status.color}`} />
                                                                </div>
                                                                <div>
                                                                    <p className={`text-xs font-black uppercase tracking-widest ${status.color}`}>
                                                                        {status.text}
                                                                    </p>
                                                                    <p className="text-[10px] text-slate-400 font-bold">
                                                                        Updated {new Date(order.createdAt).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>


                                                            {/* Refund Status Badge */}
                                                            {order.status === 'cancelled' && order.paymentMethod === 'Online' && (
                                                                <div className={`mb-4 px-3 py-2 rounded-xl border ${order.refundStatus === 'processed' ? 'bg-emerald-50 border-emerald-200' :
                                                                        order.refundStatus === 'pending' ? 'bg-amber-50 border-amber-200' :
                                                                            order.refundStatus === 'failed' ? 'bg-rose-50 border-rose-200' :
                                                                                'bg-purple-50 border-purple-200'
                                                                    }`}>
                                                                    <p className={`text-[9px] font-black uppercase tracking-widest ${order.refundStatus === 'processed' ? 'text-emerald-600' :
                                                                            order.refundStatus === 'pending' ? 'text-amber-600' :
                                                                                order.refundStatus === 'failed' ? 'text-rose-600' :
                                                                                    'text-purple-600'
                                                                        }`}>
                                                                        {order.refundStatus === 'processed' ? '✓ Refund Processed' :
                                                                            order.refundStatus === 'pending' ? '⏳ Refund Pending' :
                                                                                order.refundStatus === 'failed' ? '⚠ Refund Failed' :
                                                                                    '💰 Refund Initiated'}
                                                                    </p>
                                                                    {order.refundStatus === 'processed' && (
                                                                        <p className="text-[8px] text-emerald-500 font-bold mt-1">
                                                                            Amount will be credited in 5-7 business days
                                                                        </p>
                                                                    )}
                                                                    {(!order.refundStatus || order.refundStatus === 'none') && (
                                                                        <p className="text-[8px] text-purple-500 font-bold mt-1">
                                                                            Your refund of ₹{order.totalAmount} is being processed
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {renderTrackingSteps(order.status)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {['pending', 'confirmed', 'processing'].includes(order.status) && (
                                            <div className="px-8 py-4 bg-slate-50/50 flex justify-end">
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="flex items-center gap-2 text-rose-400 hover:text-rose-600 font-black uppercase text-[9px] tracking-[0.2em] transition-colors"
                                                >
                                                    <AlertCircle className="w-3.5 h-3.5" />
                                                    Cancel Order
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
