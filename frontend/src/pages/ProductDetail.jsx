import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Star, ShoppingCart, Zap, ShieldCheck, Heart, Share2, Info, Loader, TrendingUp, AlertCircle, Sparkles, Package, CheckCircle, Minus, Plus, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAuthenticated, user } = useAuth();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // AI Features States
    const [aiAdvice, setAiAdvice] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [priceIntel, setPriceIntel] = useState(null);
    const [priceLoading, setPriceLoading] = useState(false);

    const [aiForm, setAiForm] = useState({
        cropType: 'Rice',
        soilType: 'Loamy',
        season: 'Kharif'
    });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/products/${id}`);
            const productData = response.data.data;
            setProduct(productData);

            // Fetch related products from same category
            const relatedRes = await api.get(`/products?category=${productData.category}`);
            // Filter out current product and take top 5
            const otherProducts = (relatedRes.data?.data || []).filter(p => p._id !== id);
            setRelatedProducts(otherProducts.slice(0, 5));
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/products/${id}` } });
            return;
        }
        addToCart(product, quantity);
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/products/${id}` } });
            return;
        }
        addToCart(product, quantity);
        navigate('/cart');
    };

    const getAIAdvice = async () => {
        if (!aiForm.cropType || !aiForm.soilType || !aiForm.season) {
            alert('Please fill all fields');
            return;
        }
        setAiLoading(true);
        try {
            const response = await api.post(`/products/${id}/advice`, aiForm);
            setAiAdvice(response.data.data);
        } catch (error) {
            console.error('AI error:', error);
        } finally {
            setAiLoading(false);
        }
    };

    const getPriceIntel = async () => {
        setPriceLoading(true);
        try {
            const response = await api.get(`/products/${id}/price-intelligence`);
            setPriceIntel(response.data.data);
        } catch (error) {
            console.error('Price intel error:', error);
        } finally {
            setPriceLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <Loader className="w-10 h-10 text-[#2e7d32] animate-spin" />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <h2 className="text-2xl font-black text-gray-300 uppercase">Product Not Found</h2>
            <button onClick={() => navigate('/products')} className="mt-4 text-[#2e7d32] font-bold uppercase text-sm">Return to Shop</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 lg:max-w-7xl py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Panel: Images & Actions */}
                    <div className="lg:w-[450px] shrink-0">
                        <div className="sticky top-24 space-y-4">
                            <div className="border border-gray-100 p-8 rounded-sm relative group">
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-all"
                                >
                                    <Heart className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
                                </button>
                                <img
                                    src={product.imageUrl}
                                    className="w-full aspect-square object-contain mix-blend-multiply"
                                    alt={product.name}
                                />
                            </div>

                            <div className="flex gap-2">
                                {user?.role === 'admin' ? (
                                    <Link
                                        to="/admin"
                                        className="flex-1 bg-gray-900 text-white py-4 rounded-sm font-black uppercase text-sm shadow flex items-center justify-center gap-2 hover:bg-black transition-colors"
                                    >
                                        <Package className="w-5 h-5" />
                                        Manage Inventory
                                    </Link>
                                ) : (
                                    <>
                                        <button
                                            onClick={handleAddToCart}
                                            className="flex-1 bg-[#ff9f00] text-white py-4 rounded-sm font-black uppercase text-sm shadow flex items-center justify-center gap-2 hover:bg-[#ff8f00] transition-colors"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            className="flex-1 bg-[#fb641b] text-white py-4 rounded-sm font-black uppercase text-sm shadow flex items-center justify-center gap-2 hover:bg-[#eb5d1a] transition-colors"
                                        >
                                            <Zap className="w-5 h-5" />
                                            Buy Now
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Details */}
                    <div className="flex-1">
                        <nav className="flex text-xs text-gray-400 font-bold uppercase gap-2 mb-4 tracking-tight">
                            <span>Home</span> <ChevronRight className="w-3 h-3 pt-0.5" />
                            <span>{product.category}</span> <ChevronRight className="w-3 h-3 pt-0.5" />
                            <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
                        </nav>

                        <h1 className="text-xl font-medium text-gray-900 leading-relaxed mb-1">{product.name}</h1>

                        {user?.role === 'admin' ? (
                            <div className="mt-4 mb-8">
                                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest border border-gray-200">
                                    Inventory View
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-[#388e3c] text-white text-[12px] font-black px-2 py-0.5 rounded-sm flex items-center gap-1">
                                    {product.rating || '4.5'} <Star className="w-3 h-3 fill-current" />
                                </div>
                                <span className="text-gray-400 font-black text-sm">{product.reviewCount || '1,250'} Ratings & 480 Reviews</span>
                                <img src="/images/verified_badge.png" className="h-5" alt="Verified" />
                            </div>
                        )}

                        <div className="flex items-baseline gap-4 mb-2">
                            <h2 className="text-3xl font-black text-gray-900">₹{product.price}</h2>
                            {user?.role !== 'admin' && (
                                <>
                                    <p className="text-gray-400 line-through font-bold text-lg">₹{product.mrp || Math.floor(product.price * 1.25)}</p>
                                    <p className="text-lg text-[#388e3c] font-black uppercase">
                                        {product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 20}% Off
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Urgency Indicators */}
                        {user?.role !== 'admin' && (
                            <div className="flex flex-col gap-2 mb-6">
                                {product.isFlashSale && (
                                    <div className="flex items-center gap-2 text-[#fb641b] animate-pulse">
                                        <Zap className="w-4 h-4 fill-current" />
                                        <span className="text-xs font-black uppercase tracking-widest">Limited Time Flash Sale Item</span>
                                    </div>
                                )}
                                {product.stock < 10 && product.stock > 0 && (
                                    <div className="flex items-center gap-2 text-red-600">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-xs font-black uppercase tracking-widest">Hurry! Only {product.stock} items left in stock</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-500">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-xs font-bold">{Math.floor(Math.random() * 50) + 10} people viewed this in the last hour</span>
                                </div>
                            </div>
                        )}

                        {user?.role === 'admin' ? (
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-sm">
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Stock Level</p>
                                    <p className={`text-xl font-black ${product.stock > 10 ? 'text-gray-900' : 'text-red-500'}`}>
                                        {product.stock} {product.unit || 'Units'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 border border-gray-100 rounded-sm">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Manufacturer</p>
                                    <p className="text-sm font-black text-gray-900">{product.manufacturer || 'General Agri'}</p>
                                </div>
                            </div>
                        ) : (
                            /* Offers */
                            <div className="space-y-3 mb-8">
                                <p className="text-sm font-black text-gray-900 uppercase">Available offers</p>
                                <div className="flex items-center gap-2 text-sm">
                                    <Tag className="w-4 h-4 text-[#388e3c] shrink-0" />
                                    <span className="font-black">Bank Offer</span>
                                    <span className="text-gray-700">10% off on SBI Credit Card, up to ₹1,500.</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Tag className="w-4 h-4 text-[#388e3c] shrink-0" />
                                    <span className="font-black">Special Price</span>
                                    <span className="text-gray-700">Get extra 5% off (price inclusive of cashback/coupon)</span>
                                </div>
                            </div>
                        )}

                        {/* Admin Specific Technical Details */}
                        {user?.role === 'admin' && (
                            <div className="mb-8 space-y-6">
                                <div className="border border-gray-100 rounded-sm overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-900">Technical Specifications</h3>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 gap-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Chemical Composition</span>
                                            <span className="text-sm font-bold text-gray-700">{product.composition || 'Standard Mixture'}</span>
                                        </div>
                                        {product.npkRatio && (
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase">NPK Ratio</span>
                                                <span className="text-sm font-bold text-gray-700">
                                                    N: {product.npkRatio.nitrogen}% | P: {product.npkRatio.phosphorus}% | K: {product.npkRatio.potassium}%
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Category Tagging</span>
                                            <span className="text-sm font-bold text-gray-700">{product.category}</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Product Code</span>
                                            <span className="text-sm font-bold text-gray-700">#{product._id.slice(-8).toUpperCase()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-amber-50/30 border border-amber-100 rounded-sm p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ShieldCheck className="w-4 h-4 text-amber-600" />
                                        <h3 className="text-[11px] font-black uppercase tracking-widest text-amber-700">Safety & Compliance</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {product.safetyPrecautions?.map((pref, i) => (
                                            <li key={i} className="text-xs text-amber-900 flex items-start gap-2">
                                                <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" /> {pref}
                                            </li>
                                        ))}
                                        {!product.safetyPrecautions && (
                                            <li className="text-xs text-amber-900 italic">No specific precautions logged.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* AI Intelligence Block - Visible to both customers and admins for testing */}
                        <div className="bg-gray-50 border border-gray-100 rounded-sm p-6 mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-[#2e7d32]">
                                    <Sparkles className="w-5 h-5 fill-current" />
                                    <h3 className="font-black text-sm uppercase italic">Agricultural Advisor AI</h3>
                                </div>
                                <button className="text-[10px] font-black text-[#2e7d32] uppercase tracking-widest hover:underline">Beta v1.2</button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="Crop Name"
                                    value={aiForm.cropType}
                                    onChange={(e) => setAiForm({ ...aiForm, cropType: e.target.value })}
                                    className="bg-white border border-gray-200 px-3 py-2 text-xs font-black uppercase tracking-tight focus:outline-none focus:border-[#2e7d32] rounded-sm col-span-2 md:col-span-1"
                                />
                                <select
                                    className="bg-white border border-gray-200 px-3 py-2 text-xs font-black uppercase tracking-tight focus:outline-none focus:border-[#2e7d32] rounded-sm"
                                    value={aiForm.soilType}
                                    onChange={(e) => setAiForm({ ...aiForm, soilType: e.target.value })}
                                >
                                    <option value="">Select Soil</option>
                                    <option value="Loamy">Loamy</option>
                                    <option value="Clay">Clay</option>
                                    <option value="Sandy">Sandy</option>
                                    <option value="Black">Black Soil</option>
                                    <option value="Red">Red Soil</option>
                                </select>
                                <select
                                    className="bg-white border border-gray-200 px-3 py-2 text-xs font-black uppercase tracking-tight focus:outline-none focus:border-[#2e7d32] rounded-sm"
                                    value={aiForm.season}
                                    onChange={(e) => setAiForm({ ...aiForm, season: e.target.value })}
                                >
                                    <option value="">Season</option>
                                    <option value="Kharif">Kharif</option>
                                    <option value="Rabi">Rabi</option>
                                    <option value="Zaid">Zaid</option>
                                    <option value="All Year">All Year</option>
                                </select>
                                <button
                                    onClick={getAIAdvice}
                                    disabled={aiLoading}
                                    className="bg-gray-900 text-white text-[10px] font-black uppercase py-2 hover:bg-black transition-all rounded-sm flex items-center justify-center col-span-2 md:col-span-1"
                                >
                                    {aiLoading ? <Loader className="w-4 h-4 animate-spin" /> : 'Analyze'}
                                </button>
                            </div>

                            {aiAdvice && (
                                <div className="bg-green-50 p-4 rounded-sm border border-[#2e7d32]/10 animate-fade-in">
                                    <p className="text-xs font-black text-[#2e7d32] uppercase mb-2">Recommendation</p>
                                    <p className="text-sm font-bold text-gray-700 leading-relaxed mb-4">{aiAdvice.suitabilityReason}</p>
                                    <div className="flex gap-4">
                                        <div className="bg-white px-3 py-2 rounded-sm border border-gray-100 flex-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Dosage</p>
                                            <p className="text-xs font-black text-gray-900">{aiAdvice.dosage}</p>
                                        </div>
                                        <div className="bg-white px-3 py-2 rounded-sm border border-gray-100 flex-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Method</p>
                                            <p className="text-xs font-black text-gray-900">{aiAdvice.applicationMethod}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Product Description & Usage */}
                        <div className="border border-gray-100 rounded-sm p-6 mb-8">
                            <h3 className="text-xl font-medium text-gray-900 mb-6">Details & Usage</h3>
                            <p className="text-sm text-gray-700 leading-relaxed font-medium mb-8">{product.description}</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider">How to use</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{product.usage || 'Refer to the packaging for specific usage instructions based on your soil type.'}</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-xs font-black uppercase text-gray-900 tracking-wider">Benefits</h4>
                                    <ul className="space-y-2">
                                        {product.benefits?.map((benefit, i) => (
                                            <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                                                <CheckCircle className="w-3 h-3 text-[#388e3c]" /> {benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Related Products */}
                        {relatedProducts.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-[#2e7d32]" />
                                    Related Products
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {relatedProducts.map(rp => (
                                        <Link
                                            key={rp._id}
                                            to={`/products/${rp._id}`}
                                            className="group flex flex-col p-4 border border-gray-50 rounded-sm hover:border-green-100 hover:shadow-lg transition-all"
                                        >
                                            <div className="w-full aspect-square mb-4">
                                                <img src={rp.imageUrl} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" alt={rp.name} />
                                            </div>
                                            <p className="text-xs font-black text-gray-900 group-hover:text-[#2e7d32] line-clamp-1 mb-1 italic">{rp.name}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[#388e3c] font-black text-sm">₹{rp.price}</span>
                                                <span className="text-gray-400 text-[10px] line-through">₹{rp.mrp}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
