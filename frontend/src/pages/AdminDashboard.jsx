import { useState, useEffect } from 'react';
import {
    Package, ShoppingCart, TrendingUp, Users, Loader,
    CheckCircle, Clock, Truck, Save, Sparkles, Zap,
    AlertTriangle, ChevronRight, BarChart3, ArrowUpRight,
    Search, Filter, CircleDollarSign, CalendarDays
} from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [editedStocks, setEditedStocks] = useState({});
    const [priceSuggestions, setPriceSuggestions] = useState([]);
    const [fetchingPrices, setFetchingPrices] = useState(false);
    const [applyingPrices, setApplyingPrices] = useState(false);
    const [selectedUpdates, setSelectedUpdates] = useState({});
    const [orderSearch, setOrderSearch] = useState('');

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
            setEditedStocks({});
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
            const initialSelected = {};
            response.data.data.forEach(s => {
                if (s.isUpdateRecommended) initialSelected[s.id] = true;
            });
            setSelectedUpdates(initialSelected);
            setActiveTab('pricing');
        } catch (error) {
            console.error('Error fetching price suggestions:', error);
        } finally {
            setFetchingPrices(false);
        }
    };

    const applySelectedPrices = async () => {
        const updates = priceSuggestions
            .filter(s => selectedUpdates[s.id])
            .map(s => ({ id: s.id, newPrice: s.suggestedPrice }));

        if (updates.length === 0) return;
        setApplyingPrices(true);
        try {
            await api.post('/products/admin/apply-prices', { updates });
            setPriceSuggestions([]);
            fetchDashboardData();
        } catch (error) {
            console.error('Error applying prices:', error);
        } finally {
            setApplyingPrices(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            fetchDashboardData();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    const updateProductStock = async (productId, newStock) => {
        try {
            await api.put(`/products/${productId}`, { stock: newStock });
            fetchDashboardData();
        } catch (error) {
            console.error('Error updating stock:', error);
        }
    };

    const getStatusStyles = (status) => {
        const styles = {
            pending: 'bg-amber-50 text-amber-700 border-amber-200',
            confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            processing: 'bg-blue-50 text-blue-700 border-blue-200',
            shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200',
            delivered: 'bg-green-50 text-green-700 border-green-200',
            cancelled: 'bg-rose-50 text-rose-700 border-rose-200'
        };
        return styles[status] || 'bg-gray-50 text-gray-700 border-gray-200';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: <Clock className="w-3.5 h-3.5" />,
            confirmed: <CheckCircle className="w-3.5 h-3.5" />,
            processing: <Package className="w-3.5 h-3.5" />,
            shipped: <Truck className="w-3.5 h-3.5" />,
            delivered: <CheckCircle className="w-3.5 h-3.5" />,
            cancelled: <AlertTriangle className="w-3.5 h-3.5" />
        };
        return icons[status] || <Clock className="w-3.5 h-3.5" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-10 h-10 text-[#2e7d32] animate-spin mx-auto mb-4" />
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Hydrating Dashboard...</p>
                </div>
            </div>
        );
    }

    const filteredOrders = orders.filter(o =>
        o._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.userId?.name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        o.userId?.phone?.includes(orderSearch)
    );

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Sidebar Simulation & Header */}
            <div className="flex">
                {/* Left Mini-Nav */}
                <div className="w-20 min-h-screen bg-white border-r border-gray-100 flex flex-col items-center py-8 gap-8 sticky top-0">
                    <div className="w-10 h-10 bg-[#2e7d32] rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                        <TrendingUp className="text-white w-6 h-6" />
                    </div>
                    {[
                        { id: 'overview', icon: BarChart3 },
                        { id: 'inventory', icon: Package },
                        { id: 'orders', icon: ShoppingCart },
                        { id: 'pricing', icon: CircleDollarSign },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-green-50 text-[#2e7d32] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <item.icon className="w-6 h-6" />
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1 p-8">
                    <header className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Command Center</h1>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Farm Management & Logistics</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={fetchPriceSuggestions}
                                disabled={fetchingPrices}
                                className="bg-white border border-gray-200 text-[#2e7d32] px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
                            >
                                {fetchingPrices ? <Loader className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                AI Price Intelligence
                            </button>
                            <div className="h-10 w-[1px] bg-gray-100"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-black text-gray-900 leading-none">Admin Profile</p>
                                    <p className="text-[10px] font-black text-green-600 uppercase tracking-tighter mt-1">Authorized Manager</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                                    <img src="https://ui-avatars.com/api/?name=Admin&background=2e7d32&color=fff" alt="Admin" />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Stats Overview */}
                    {stats && activeTab === 'overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            {[
                                { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString()}`, sub: '+12.5% vs last month', icon: CircleDollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { label: 'Active Orders', value: stats.totalOrders, sub: 'Currently in pipeline', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Pending Action', value: stats.pendingOrders, sub: 'Needs immediate review', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                                { label: 'Deliveries', value: stats.completedOrders, sub: 'Successfully fulfilled', icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' }
                            ].map((s, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-2xl ${s.bg}`}>
                                            <s.icon className={`w-6 h-6 ${s.color}`} />
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-gray-300" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                                    <p className="text-2xl font-black text-gray-900 tracking-tight">{s.value}</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-2">{s.sub}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Dynamic Tabs Content */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Tab Headers */}
                        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                            <div className="flex gap-8">
                                {['Overview', 'Inventory', 'Orders', 'Pricing'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab.toLowerCase())}
                                        className={`pb-6 -mb-6 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab.toLowerCase() ? 'text-[#2e7d32]' : 'text-gray-300 hover:text-gray-500'}`}
                                    >
                                        {tab}
                                        {activeTab === tab.toLowerCase() && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2e7d32] rounded-full"></div>}
                                    </button>
                                ))}
                            </div>

                            {activeTab === 'orders' && (
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Find order or customer..."
                                        value={orderSearch}
                                        onChange={(e) => setOrderSearch(e.target.value)}
                                        className="bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2 text-xs font-bold focus:ring-2 focus:ring-green-100 w-64"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Content Area */}
                        <div className="p-0">
                            {/* Inventory Tab */}
                            {activeTab === 'inventory' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#fcfdfc]">
                                            <tr>
                                                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Fertilizer Product</th>
                                                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Price</th>
                                                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Level</th>
                                                <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {products.map((product) => (
                                                <tr key={product._id} className="hover:bg-[#fcfdfc] transition-colors group">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
                                                                <img src={product.imageUrl} className="max-w-[70%] max-h-[70%] object-contain mix-blend-multiply" />
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-gray-900 text-sm leading-tight">{product.name}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{product.manufacturer}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <span className="text-[10px] font-black px-2.5 py-1 bg-gray-50 text-gray-500 rounded uppercase tracking-tighter border border-gray-100">
                                                            {product.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <p className="font-black text-gray-900">₹{product.price}</p>
                                                    </td>
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="number"
                                                                value={editedStocks[product._id] !== undefined ? editedStocks[product._id] : product.stock}
                                                                onChange={(e) => setEditedStocks(prev => ({ ...prev, [product._id]: parseInt(e.target.value) || 0 }))}
                                                                className="w-20 bg-gray-50 border-none rounded-lg px-2 py-1 text-xs font-black focus:ring-2 focus:ring-green-100"
                                                            />
                                                            {(editedStocks[product._id] ?? product.stock) <= 10 && (
                                                                <AlertTriangle className="w-4 h-4 text-amber-500 animate-pulse" />
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        {editedStocks[product._id] !== undefined && editedStocks[product._id] !== product.stock ? (
                                                            <button
                                                                onClick={() => updateProductStock(product._id, editedStocks[product._id])}
                                                                className="bg-[#2e7d32] text-white px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-100"
                                                            >
                                                                Save
                                                            </button>
                                                        ) : (
                                                            <button className="text-gray-300 group-hover:text-gray-900 transition-colors">
                                                                <ChevronRight className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Orders Management Tab */}
                            {activeTab === 'orders' && (
                                <div className="divide-y divide-gray-50">
                                    {filteredOrders.length === 0 ? (
                                        <div className="p-20 text-center">
                                            <Search className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                            <p className="text-sm font-black text-gray-300 uppercase tracking-widest">No matching orders found</p>
                                        </div>
                                    ) : (
                                        filteredOrders.map((order) => (
                                            <div key={order._id} className="p-8 hover:bg-[#fcfdfc] transition-colors relative group">
                                                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                                    {/* Order Info */}
                                                    <div className="lg:w-1/4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">#{order._id.slice(-8).toUpperCase()}</p>
                                                            <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase flex items-center gap-1 border ${getStatusStyles(order.status)}`}>
                                                                {getStatusIcon(order.status)}
                                                                {order.status}
                                                            </div>
                                                        </div>
                                                        <p className="text-lg font-black text-gray-900 leading-tight">{order.userId?.name}</p>
                                                        <p className="text-xs font-bold text-gray-500 mt-1">{order.userId?.phone || order.userId?.email}</p>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider ${order.paymentMethod === 'Online' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                                                {order.paymentMethod === 'Online' ? '💳 PREPAID' : '💵 COD'}
                                                            </span>
                                                            {order.status === 'cancelled' && order.paymentMethod === 'Online' && (
                                                                <span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-wider ${order.refundStatus === 'processed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                                        order.refundStatus === 'pending' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                                                                            order.refundStatus === 'failed' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                                                'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                                                    }`}>
                                                                    {order.refundStatus === 'processed' ? '✓ REFUNDED' :
                                                                        order.refundStatus === 'pending' ? '⏳ REFUND PENDING' :
                                                                            order.refundStatus === 'failed' ? '⚠ REFUND FAILED' :
                                                                                '💰 REFUND INITIATED'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Items Summary */}
                                                    <div className="flex-1">
                                                        <div className="flex -space-x-4">
                                                            {order.items.slice(0, 4).map((item, idx) => (
                                                                <div key={idx} className="w-10 h-10 bg-white border-2 border-white rounded-full shadow-sm overflow-hidden flex items-center justify-center p-1" title={item.name}>
                                                                    <img src={item.productId?.imageUrl} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                                                </div>
                                                            ))}
                                                            {order.items.length > 4 && (
                                                                <div className="w-10 h-10 bg-gray-100 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black text-gray-500">
                                                                    +{order.items.length - 4}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{order.items.length} Product(s) • <span className="text-gray-900 border-b border-gray-100">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                                                    </div>

                                                    {/* Total & Action */}
                                                    <div className="lg:w-1/4 flex items-center justify-between lg:justify-end gap-10">
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</p>
                                                            <p className="text-xl font-black text-gray-900 leading-none mt-1">₹{order.totalAmount}</p>
                                                        </div>
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                                            className="bg-white border-none shadow-sm rounded-xl px-4 py-2 text-xs font-black focus:ring-2 focus:ring-green-100 cursor-pointer"
                                                        >
                                                            {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                                                <option key={s} value={s}>{s.toUpperCase()}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* AI Pricing Tab Content */}
                            {activeTab === 'pricing' && (
                                <div className="p-8">
                                    {fetchingPrices ? (
                                        <div className="py-20 text-center">
                                            <Loader className="w-10 h-10 text-purple-400 animate-spin mx-auto mb-4" />
                                            <p className="text-sm font-black text-purple-400 uppercase tracking-widest">Consulting Gemini Market Intelligence...</p>
                                        </div>
                                    ) : priceSuggestions.length === 0 ? (
                                        <div className="p-20 text-center bg-purple-50/30 rounded-3xl border-2 border-dashed border-purple-100">
                                            <Zap className="w-12 h-12 text-purple-200 mx-auto mb-4" />
                                            <h3 className="text-lg font-black text-gray-900 mb-2 uppercase tracking-tight">Market Intelligence Idle</h3>
                                            <p className="text-xs font-medium text-gray-500 max-w-sm mx-auto mb-8">Scan your inventory against real-time agricultural indices to find optimization opportunities.</p>
                                            <button
                                                onClick={fetchPriceSuggestions}
                                                className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all flex items-center gap-3 mx-auto"
                                            >
                                                <Sparkles className="w-4 h-4" /> Start AI Market Scan
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between bg-gray-900 text-white px-8 py-5 rounded-3xl shadow-xl">
                                                <div>
                                                    <p className="text-[10px] font-black text-purple-300 uppercase tracking-widest mb-1">AI Recommendation Batch</p>
                                                    <h3 className="text-lg font-black">{Object.values(selectedUpdates).filter(Boolean).length} Updates Targeted</h3>
                                                </div>
                                                <button
                                                    onClick={applySelectedPrices}
                                                    disabled={applyingPrices}
                                                    className="bg-purple-500 hover:bg-purple-400 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {applyingPrices ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                    Execute All Updates
                                                </button>
                                            </div>

                                            <div className="overflow-x-auto border border-gray-100 rounded-3xl">
                                                <table className="w-full">
                                                    <thead>
                                                        <tr className="bg-gray-50">
                                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase">Product</th>
                                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase">Trend</th>
                                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase">Suggested Price</th>
                                                            <th className="px-8 py-4 text-right text-[10px] font-black text-gray-400 uppercase text-right px-8">Approve</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                        {priceSuggestions.map(s => (
                                                            <tr key={s.id} className="hover:bg-purple-50/20 transition-colors">
                                                                <td className="px-8 py-5">
                                                                    <p className="font-black text-sm text-gray-900 leading-tight">{s.name}</p>
                                                                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase">Current: ₹{s.currentPrice}</p>
                                                                </td>
                                                                <td className="px-8 py-5">
                                                                    <div className={`flex items-center gap-1.5 font-black text-[10px] uppercase ${s.suggestedPrice > s.currentPrice ? 'text-blue-500' : 'text-rose-500'}`}>
                                                                        {s.suggestedPrice > s.currentPrice ? <ArrowUpRight className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                                                                        {Math.abs(((s.suggestedPrice - s.currentPrice) / s.currentPrice) * 100).toFixed(1)}% {s.suggestedPrice > s.currentPrice ? 'Gain' : 'Correction'}
                                                                    </div>
                                                                </td>
                                                                <td className="px-8 py-5 font-black text-purple-600 text-lg tracking-tight">₹{s.suggestedPrice}</td>
                                                                <td className="px-8 py-5 text-right">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={!!selectedUpdates[s.id]}
                                                                        onChange={(e) => setSelectedUpdates(prev => ({ ...prev, [s.id]: e.target.checked }))}
                                                                        className="w-5 h-5 rounded-md border-gray-200 text-purple-600 focus:ring-purple-200"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Overview Tab (Fallback Content) */}
                            {activeTab === 'overview' && (
                                <div className="p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Recent Orders Mini Card */}
                                        <div className="bg-[#fcfdfc] p-6 rounded-3xl border border-gray-50">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Activity</h3>
                                                <button onClick={() => setActiveTab('orders')} className="text-[#2e7d32] font-black text-[10px] uppercase tracking-widest hover:underline">View All</button>
                                            </div>
                                            <div className="space-y-4">
                                                {orders.slice(0, 5).map(o => (
                                                    <div key={o._id} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 uppercase">
                                                                {o.userId?.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-gray-900">{o.userId?.name || 'Customer'}</p>
                                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{new Date(o.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-xs font-black text-gray-900">₹{o.totalAmount}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Stock Alerts Mini Card */}
                                        <div className="bg-[#fcfdfc] p-6 rounded-3xl border border-gray-50">
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventory Alerts</h3>
                                                <button onClick={() => setActiveTab('inventory')} className="text-[#2e7d32] font-black text-[10px] uppercase tracking-widest hover:underline">Restock</button>
                                            </div>
                                            <div className="space-y-4">
                                                {products.filter(p => p.stock <= 20).slice(0, 5).map(p => (
                                                    <div key={p._id} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                                                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-black text-gray-900 line-clamp-1">{p.name}</p>
                                                                <p className="text-[10px] font-bold text-amber-600 uppercase">Only {p.stock} units left</p>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-gray-200" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
