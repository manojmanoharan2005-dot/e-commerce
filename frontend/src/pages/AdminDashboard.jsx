import { useState, useEffect } from 'react';
import { Package, ShoppingCart, TrendingUp, Users, Loader, CheckCircle, Clock, Truck, Save, Sparkles, Zap, AlertTriangle, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('inventory');
    const [editedStocks, setEditedStocks] = useState({});
    const [priceSuggestions, setPriceSuggestions] = useState([]);
    const [fetchingPrices, setFetchingPrices] = useState(false);
    const [applyingPrices, setApplyingPrices] = useState(false);
    const [selectedUpdates, setSelectedUpdates] = useState({});

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [ordersRes, productsRes] = await Promise.all([
                api.get('/orders'),
                api.get('/products')
            ]);

            setOrders(ordersRes.data.data);
            setStats(ordersRes.data.stats);
            setProducts(productsRes.data.data);
            setEditedStocks({}); // Clear edited stocks after refresh
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPriceSuggestions = async () => {
        setFetchingPrices(true);
        try {
            const response = await api.get('/products/admin/ai-price-suggestions');
            setPriceSuggestions(response.data.data);

            // Auto-select recommended updates
            const initialSelected = {};
            response.data.data.forEach(s => {
                if (s.isUpdateRecommended) initialSelected[s.id] = true;
            });
            setSelectedUpdates(initialSelected);
        } catch (error) {
            console.error('Error fetching price suggestions:', error);
            alert('Failed to fetch AI price suggestions');
        } finally {
            setFetchingPrices(false);
        }
    };

    const applySelectedPrices = async () => {
        const updates = priceSuggestions
            .filter(s => selectedUpdates[s.id])
            .map(s => ({ id: s.id, newPrice: s.suggestedPrice }));

        if (updates.length === 0) {
            alert('No updates selected');
            return;
        }

        setApplyingPrices(true);
        try {
            await api.post('/products/admin/apply-prices', { updates });
            alert(`Updated ${updates.length} prices successfully`);
            setPriceSuggestions([]);
            fetchDashboardData();
        } catch (error) {
            console.error('Error applying prices:', error);
            alert('Failed to apply price updates');
        } finally {
            setApplyingPrices(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            fetchDashboardData();
            alert('Order status updated successfully');
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    };

    const updateProductStock = async (productId, newStock) => {
        try {
            await api.put(`/products/${productId}`, { stock: newStock });
            fetchDashboardData();
            alert('Stock updated successfully');
        } catch (error) {
            console.error('Error updating stock:', error);
            alert('Failed to update stock');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'badge-warning',
            confirmed: 'badge-info',
            processing: 'badge-info',
            shipped: 'badge-info',
            delivered: 'badge-success',
            cancelled: 'badge-danger'
        };
        return colors[status] || 'badge-info';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <Clock className="w-4 h-4" />,
            confirmed: <CheckCircle className="w-4 h-4" />,
            processing: <Package className="w-4 h-4" />,
            shipped: <Truck className="w-4 h-4" />,
            delivered: <CheckCircle className="w-4 h-4" />,
            cancelled: <Clock className="w-4 h-4" />
        };
        return icons[status] || <Clock className="w-4 h-4" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Admin Panel</h1>
                        <p className="text-gray-600 mt-2">Manage your fertilizer inventory and orders</p>
                    </div>
                    <div className="bg-primary text-white px-6 py-3 rounded-lg">
                        <p className="text-sm opacity-90">Logged in as</p>
                        <p className="font-bold">Store Manager</p>
                    </div>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <div className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <ShoppingCart className="w-8 h-8" />
                                <span className="text-3xl font-bold">{stats.totalOrders}</span>
                            </div>
                            <p className="text-blue-100">Total Orders</p>
                        </div>

                        <div className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <TrendingUp className="w-8 h-8" />
                                <span className="text-3xl font-bold">₹{stats.totalRevenue?.toLocaleString()}</span>
                            </div>
                            <p className="text-green-100">Total Revenue</p>
                        </div>

                        <div className="card p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <Clock className="w-8 h-8" />
                                <span className="text-3xl font-bold">{stats.pendingOrders}</span>
                            </div>
                            <p className="text-yellow-100">Pending Orders</p>
                        </div>

                        <div className="card p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <CheckCircle className="w-8 h-8" />
                                <span className="text-3xl font-bold">{stats.completedOrders}</span>
                            </div>
                            <p className="text-purple-100">Completed Orders</p>
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'inventory'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Inventory Management
                    </button>
                    <button
                        onClick={() => setActiveTab('pricing')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${activeTab === 'pricing'
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Price Automation
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'orders'
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Orders Management
                    </button>
                </div>

                {/* AI Price Automation */}
                {activeTab === 'pricing' && (
                    <div className="space-y-6">
                        <div className="card p-8 bg-gradient-to-r from-purple-50 to-white border-purple-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="max-w-2xl">
                                    <div className="flex items-center gap-2 text-purple-600 mb-2">
                                        <Zap className="w-5 h-5 fill-current" />
                                        <span className="font-bold uppercase tracking-wider text-sm">Automated Intelligence</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 mb-3">AI Market Price Intelligence</h2>
                                    <p className="text-gray-600 leading-relaxed">
                                        Ground your store prices in real-time global market data. Gemini analyzes fertilizer indices,
                                        government portals, and trade reports to suggest the most competitive prices for your inventory.
                                    </p>
                                </div>
                                <button
                                    onClick={fetchPriceSuggestions}
                                    disabled={fetchingPrices}
                                    className="bg-purple-600 text-white px-8 py-4 rounded-xl font-bold shadow-xl hover:bg-purple-700 transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {fetchingPrices ? <Loader className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                                    <span>Fetch Market Suggestions</span>
                                </button>
                            </div>
                        </div>

                        {priceSuggestions.length > 0 && (
                            <div className="card overflow-hidden border-none shadow-2xl">
                                <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold">Suggested Price Updates</h3>
                                        <p className="text-gray-400 text-sm mt-1">Review and approve changes before they go live</p>
                                    </div>
                                    <button
                                        onClick={applySelectedPrices}
                                        disabled={applyingPrices || Object.values(selectedUpdates).filter(Boolean).length === 0}
                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
                                    >
                                        {applyingPrices ? <Loader className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                        Apply {Object.values(selectedUpdates).filter(Boolean).length} Updates
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Product</th>
                                                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Current</th>
                                                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest text-center">Trend</th>
                                                <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Suggested</th>
                                                <th className="px-6 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                                                <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Approve</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {priceSuggestions.map((s) => (
                                                <tr key={s.id} className={`hover:bg-gray-50/50 transition-colors ${!s.isUpdateRecommended ? 'opacity-60' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-gray-900">{s.name}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase font-black truncate max-w-[200px]">ID: {s.id}</p>
                                                    </td>
                                                    <td className="px-6 py-4 font-black text-gray-500">₹{s.currentPrice}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`flex items-center gap-1 font-black text-xs ${s.suggestedPrice > s.currentPrice ? 'text-blue-500' : s.suggestedPrice < s.currentPrice ? 'text-red-500' : 'text-gray-400'}`}>
                                                                {s.suggestedPrice > s.currentPrice ? '▲' : s.suggestedPrice < s.currentPrice ? '▼' : '▬'}
                                                                {Math.abs(((s.suggestedPrice - s.currentPrice) / s.currentPrice) * 100).toFixed(1)}%
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-black text-purple-600 text-lg">₹{s.suggestedPrice}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        {s.isUpdateRecommended ? (
                                                            <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-1 rounded uppercase">Adjustment Recommended</span>
                                                        ) : (
                                                            <span className="bg-gray-100 text-gray-400 text-[10px] font-black px-2 py-1 rounded uppercase">Market Stable</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={!!selectedUpdates[s.id]}
                                                                onChange={(e) => setSelectedUpdates(prev => ({ ...prev, [s.id]: e.target.checked }))}
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                                                        </label>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="bg-purple-900 text-purple-100 p-4 text-[11px] font-bold uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    AI Insight: Prices are derived from analyzed market indices. Final responsibility for storefront prices lies with the administrator.
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders Management */}
                {activeTab === 'orders' && (
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>

                        {orders.length === 0 ? (
                            <p className="text-center text-gray-600 py-8">No orders yet</p>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                                                <p className="font-semibold text-lg">
                                                    {order.userId?.name || 'Unknown Customer'}
                                                </p>
                                                <p className="text-sm text-gray-600">{order.userId?.email}</p>
                                                <p className="text-sm text-gray-600">{order.userId?.phone}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-primary">₹{order.totalAmount}</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(order.orderDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <h4 className="font-semibold mb-2">Items:</h4>
                                            <div className="space-y-2">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex justify-between text-sm bg-gray-50 p-2 rounded">
                                                        <span>{item.name} x {item.quantity}</span>
                                                        <span className="font-semibold">₹{item.subtotal}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {order.shippingAddress && (
                                            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                                <h4 className="font-semibold mb-1 text-sm">Shipping Address:</h4>
                                                <p className="text-sm text-gray-700">
                                                    {order.shippingAddress.name}, {order.shippingAddress.phone}
                                                    <br />
                                                    {order.shippingAddress.street}, {order.shippingAddress.city}
                                                    <br />
                                                    {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <span className={`badge ${getStatusColor(order.status)} flex items-center space-x-1`}>
                                                    {getStatusIcon(order.status)}
                                                    <span className="capitalize">{order.status}</span>
                                                </span>
                                            </div>

                                            <select
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                className="input-field !py-2 w-48"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Inventory Management */}
                {activeTab === 'inventory' && (
                    <div className="card p-6">
                        <h2 className="text-2xl font-bold mb-6">Inventory Management</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded object-cover"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/100/4CAF50/ffffff?text=P';
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="font-semibold">{product.name}</p>
                                                        <p className="text-sm text-gray-600">{product.manufacturer}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className="badge badge-info">{product.category}</span>
                                            </td>
                                            <td className="px-4 py-4 font-semibold">₹{product.price}</td>
                                            <td className="px-4 py-4">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={editedStocks[product._id] !== undefined ? editedStocks[product._id] : product.stock}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        // Allow empty string for clearing, otherwise parse as integer
                                                        const newStock = value === '' ? 0 : Math.max(0, parseInt(value, 10) || 0);
                                                        setEditedStocks(prev => ({
                                                            ...prev,
                                                            [product._id]: newStock
                                                        }));
                                                    }}
                                                    onBlur={(e) => {
                                                        // Ensure value is properly formatted on blur
                                                        const currentValue = editedStocks[product._id];
                                                        if (currentValue !== undefined) {
                                                            setEditedStocks(prev => ({
                                                                ...prev,
                                                                [product._id]: Math.max(0, parseInt(currentValue, 10) || 0)
                                                            }));
                                                        }
                                                    }}
                                                    className="input-field !py-1 w-24"
                                                />
                                            </td>
                                            <td className="px-4 py-4">
                                                {(editedStocks[product._id] !== undefined ? editedStocks[product._id] : product.stock) === 0 ? (
                                                    <span className="badge badge-danger">Out of Stock</span>
                                                ) : (editedStocks[product._id] !== undefined ? editedStocks[product._id] : product.stock) <= 10 ? (
                                                    <span className="badge badge-warning">Low Stock</span>
                                                ) : (
                                                    <span className="badge badge-success">In Stock</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center space-x-2">
                                                    {editedStocks[product._id] !== undefined && editedStocks[product._id] !== product.stock ? (
                                                        <button
                                                            onClick={() => updateProductStock(product._id, editedStocks[product._id])}
                                                            className="flex items-center space-x-1 bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                            <span>Update</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => window.open(`/products/${product._id}`, '_blank')}
                                                            className="text-primary hover:underline text-sm font-semibold"
                                                        >
                                                            View Details
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
