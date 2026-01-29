import { useState, useEffect } from 'react';
import UserSidebar from '../components/UserSidebar';
import { Search, Loader, Circle, ChevronRight, Package } from 'lucide-react';
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

    const getStatusInfo = (status) => {
        switch (status) {
            case 'delivered': return { color: 'text-[#388e3c]', bg: 'bg-[#388e3c]', text: 'Delivered on' };
            case 'shipped': return { color: 'text-[#2874f0]', bg: 'bg-[#2874f0]', text: 'Shipped on' };
            case 'cancelled': return { color: 'text-[#ff6161]', bg: 'bg-[#ff6161]', text: 'Cancelled on' };
            default: return { color: 'text-[#f5a623]', bg: 'bg-[#f5a623]', text: 'Order Processing' };
        }
    };

    const filteredOrders = orders.filter(order =>
        order.items.some(item =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || order._id.includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-[#f1f3f6] py-4">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-4 items-start">

                    <div className="lg:w-72 flex-shrink-0 w-full">
                        <UserSidebar />
                    </div>

                    <div className="flex-1 w-full space-y-4">
                        {/* Order Search Bar */}
                        <div className="bg-white p-3 rounded-sm shadow-sm flex items-center gap-2 border border-gray-100 focus-within:ring-1 focus-within:ring-[#2874f0]">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search your orders here"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-transparent outline-none text-sm font-medium"
                            />
                            <button className="bg-[#2874f0] text-white px-8 py-2 rounded-sm font-black uppercase text-xs">
                                Search Orders
                            </button>
                        </div>

                        {loading ? (
                            <div className="bg-white p-20 flex items-center justify-center rounded-sm">
                                <Loader className="w-10 h-10 text-[#2874f0] animate-spin" />
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
                                                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#2874f0]">
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
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Order Footnote with Actions */}
                                        {['pending', 'confirmed', 'processing'].includes(order.status) && (
                                            <div className="bg-gray-50/50 p-4 flex justify-end border-t border-gray-100">
                                                <button
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    className="text-[#ff6161] text-xs font-black uppercase hover:underline flex items-center gap-1"
                                                >
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
