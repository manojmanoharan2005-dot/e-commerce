import { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import { Search, Loader, Circle, ChevronRight, Package, Download } from 'lucide-react';
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
                // Update local state instead of refetching
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order._id === orderId ? { ...order, status: 'cancelled' } : order
                    )
                );
                alert('Order cancelled successfully');
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
                        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2e7d32; padding-bottom: 20px; }
                        .logo { color: #2e7d32; font-size: 24px; font-weight: bold; }
                        .invoice-info { text-align: right; }
                        .billing { margin-top: 40px; display: flex; justify-content: space-between; }
                        .table { width: 100%; margin-top: 40px; border-collapse: collapse; }
                        .table th { background: #f8f9fa; text-align: left; padding: 12px; border-bottom: 1px solid #ddd; }
                        .table td { padding: 12px; border-bottom: 1px solid #eee; }
                        .total { margin-top: 30px; text-align: right; font-size: 20px; font-weight: bold; }
                        .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <div class="logo">FertilizerMart</div>
                        <div class="invoice-info">
                            <h3>INVOICE</h3>
                            <p>Order ID: ${order._id}</p>
                            <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <div class="billing">
                        <div>
                            <strong>Sold By:</strong><br>
                            FertilizerMart Agriculture Solutions<br>
                            123 Green Field, Punjab, India
                        </div>
                        <div>
                            <strong>Billed To:</strong><br>
                            ${order.shippingAddress?.name}<br>
                            ${order.shippingAddress?.street}, ${order.shippingAddress?.city}<br>
                            ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}
                        </div>
                    </div>

                    <table class="table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Price</th>
                                <th>Qty</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>₹${item.price}</td>
                                    <td>${item.quantity}</td>
                                    <td>₹${item.subtotal || item.price * item.quantity}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="total">Total Amount: ₹${order.totalAmount}</div>

                    <div class="footer">
                        <p>Thank you for shopping with FertilizerMart!</p>
                        <p>This is a computer-generated invoice and doesn't require a signature.</p>
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
            case 'delivered': return { color: 'text-[#388e3c]', bg: 'bg-[#388e3c]', text: 'Delivered on' };
            case 'shipped': return { color: 'text-[#2e7d32]', bg: 'bg-[#2e7d32]', text: 'Shipped on' };
            case 'cancelled': return { color: 'text-[#ff6161]', bg: 'bg-[#ff6161]', text: 'Cancelled on' };
            default: return { color: 'text-[#f5a623]', bg: 'bg-[#f5a623]', text: 'Order Processing' };
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
                <div className="flex items-center gap-2 mt-4 p-2 bg-red-50 rounded-sm border border-red-100">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase text-red-600 tracking-widest">Order Cancelled & Refund Initiated</span>
                </div>
            );
        }

        return (
            <div className="mt-6 flex items-center w-full px-2">
                {steps.map((step, idx) => (
                    <div key={step} className="flex items-center relative flex-1 last:flex-none">
                        <div className={`w-3 h-3 rounded-full z-10 ${idx <= currentIndex ? 'bg-[#2e7d32]' : 'bg-gray-200'}`}>
                            {idx <= currentIndex && (
                                <div className="w-full h-full bg-[#2e7d32] rounded-full animate-ping opacity-20"></div>
                            )}
                        </div>
                        {idx < steps.length - 1 && (
                            <div className={`h-[2px] w-full mx-[-1px] ${idx < currentIndex ? 'bg-[#2e7d32]' : 'bg-gray-100'}`}></div>
                        )}
                        <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase whitespace-nowrap tracking-tighter ${idx === currentIndex ? 'text-[#2e7d32]' : 'text-gray-300'}`}>
                            {step}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] py-4">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-4 items-start">

                    <div className="lg:w-72 flex-shrink-0 w-full">
                        <UserSidebar />
                    </div>

                    <div className="flex-1 w-full space-y-4">
                        {/* Order Search Bar */}
                        <div className="bg-white p-3 rounded-sm shadow-sm flex items-center gap-2 border border-gray-100 focus-within:ring-1 focus-within:ring-[#2e7d32]">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search your orders here"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm font-medium"
                            />
                            <button className="bg-[#2e7d32] text-white px-8 py-2 rounded-sm font-black uppercase text-xs">
                                Search Orders
                            </button>
                        </div>

                        {loading ? (
                            <div className="bg-white p-20 flex items-center justify-center rounded-sm">
                                <Loader className="w-10 h-10 text-[#2e7d32] animate-spin" />
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="bg-white p-20 text-center rounded-sm">
                                <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-lg font-black text-gray-400 uppercase">No Orders Found</h3>
                                <p className="text-gray-500 text-sm mt-1">Try searching with a different keyword.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => (
                                    <div key={order._id} className="bg-white rounded-sm shadow-sm border border-gray-100 hover:shadow-md transition-all divide-y divide-gray-100 overflow-hidden">
                                        {order.items.map((item, idx) => {
                                            const status = getStatusInfo(order.status);
                                            return (
                                                <div key={`${order._id}-${idx}`} className="flex flex-col md:flex-row items-center gap-6 p-6">
                                                    <Link to={`/order/${order._id}`} className="w-20 h-20 flex-shrink-0">
                                                        <img
                                                            src={item.productId?.imageUrl || '/images/placeholder.png'}
                                                            alt={item.name}
                                                            className="w-full h-full object-contain mix-blend-multiply"
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/100?text=Order'; }}
                                                        />
                                                    </Link>

                                                    <div className="flex-1">
                                                        <Link to={`/order/${order._id}`}>
                                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#2e7d32]">
                                                                {item.name}
                                                            </h4>
                                                        </Link>
                                                        <p className="text-xs text-gray-400 mt-1 uppercase font-black">Quantity: {item.quantity}</p>
                                                    </div>

                                                    <div className="w-32 text-center md:text-left">
                                                        <p className="text-sm font-black text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</p>
                                                    </div>

                                                    <div className="w-64">
                                                        <div className="flex items-start gap-2">
                                                            <div className={`w-2 h-2 rounded-full mt-1.5 ${status.bg}`}></div>
                                                            <div>
                                                                <p className={`text-sm font-black uppercase ${status.color}`}>
                                                                    {order.status}
                                                                </p>
                                                                <p className="text-xs text-gray-600 mt-1">
                                                                    {status.text} {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                                </p>
                                                                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                                                                    Your item has been {order.status.toLowerCase()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {renderTrackingSteps(order.status)}
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Order Footnote with Actions */}
                                        <div className="bg-gray-50/50 p-4 flex justify-between items-center border-t border-gray-100">
                                            <button
                                                onClick={() => handleDownloadInvoice(order)}
                                                className="text-[#2e7d32] text-xs font-black uppercase hover:underline flex items-center gap-1.5"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                Download Invoice
                                            </button>

                                            {['pending', 'confirmed', 'processing'].includes(order.status) && (
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="text-[#ff6161] text-xs font-black uppercase hover:underline flex items-center gap-1"
                                                >
                                                    Cancel Order
                                                </button>
                                            )}
                                        </div>
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
