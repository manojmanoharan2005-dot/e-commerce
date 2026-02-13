import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Star, ShoppingCart, Zap, ShieldCheck, Heart, Share2, Info, Loader, TrendingUp, AlertCircle, Sparkles, Package, CheckCircle, Minus, Plus, Tag, Sprout } from 'lucide-react';
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

    const [priceIntel, setPriceIntel] = useState(null);
    const [priceLoading, setPriceLoading] = useState(false);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/products/${id}`);
            const productData = response.data.data;
            setProduct(productData);

            const relatedRes = await api.get(`/products?category=${productData.category}`);
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



    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Product...</p>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center">
                <AlertCircle className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h2 className="text-2xl font-black text-slate-900 uppercase italic">Not Available</h2>
                <p className="text-slate-500 mt-2 mb-8">This product is currently out of stock.</p>
                <button onClick={() => navigate('/products')} className="bg-primary text-white px-8 py-3 rounded-2xl font-bold uppercase text-xs">Explore All Products</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="container mx-auto px-4 lg:max-w-7xl pt-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-8">
                    <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                    <span className="w-4 border-t border-slate-300"></span>
                    <Link to={`/products?category=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
                    <span className="w-4 border-t border-slate-300"></span>
                    <span className="text-primary truncate">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Left: Product Visuals */}
                    <div className="w-full lg:w-[500px] sticky top-28">
                        <div className="relative bg-white rounded-[3rem] p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 group overflow-hidden">

                            <img
                                src={product.imageUrl}
                                className="w-full aspect-square object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                                alt={product.name}
                            />

                            {/* Decorative Sparkles */}
                            <Sparkles className="absolute bottom-6 left-6 w-12 h-12 text-accent opacity-10 group-hover:rotate-45 transition-transform" />
                        </div>

                        {/* Direct Actions */}
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <button
                                onClick={handleAddToCart}
                                className="flex flex-col items-center justify-center py-5 bg-white border border-slate-200 rounded-[2rem] font-black uppercase text-xs text-slate-600 hover:border-accent hover:text-primary hover:shadow-xl hover:shadow-accent/5 transition-all group"
                            >
                                <ShoppingCart className="w-5 h-5 mb-2 group-hover:scale-110 transition-transform" />
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                className="flex flex-col items-center justify-center py-5 bg-primary rounded-[2rem] font-black uppercase text-xs text-white shadow-2xl shadow-primary/20 hover:bg-primary-dark transition-all group"
                            >
                                <Zap className="w-5 h-5 mb-2 text-accent group-hover:scale-110 transition-transform" />
                                Buy Now
                            </button>
                        </div>
                    </div>

                    {/* Right: Detailed Info */}
                    <div className="flex-1 space-y-10">
                        <div className="bg-white rounded-[3rem] p-8 lg:p-12 border border-slate-100 shadow-xl shadow-slate-200/50">
                            <div className="flex items-center gap-4 mb-4">
                                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-accent/20">Top Choice</span>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-accent fill-accent" />
                                    <span className="text-sm font-black text-slate-900">{product.rating || '4.8'}</span>
                                    <span className="text-xs text-slate-400 font-bold ml-1">({product.reviewCount || '850'} Reviews)</span>
                                </div>
                            </div>

                            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-[1.2] mb-6 italic tracking-tight">{product.name}</h1>

                            <div className="flex items-end gap-4 mb-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">Price per unit</span>
                                    <h2 className="text-4xl font-black text-primary leading-none">₹{product.price}</h2>
                                </div>
                                <div className="flex flex-col ml-4">
                                    <span className="text-lg text-slate-300 line-through font-bold">₹{product.mrp || Math.floor(product.price * 1.3)}</span>
                                    <span className="text-sm text-accent font-black uppercase tracking-widest">30% OFF TODAY</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Product Description</h4>
                                    <p className="text-slate-600 font-medium leading-relaxed">{product.description}</p>
                                </div>
                                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-[0.2em]">Stock Details</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500">Available Stock</span>
                                            <span className="text-sm font-black text-primary">{product.stock} Units</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-500">Popularity</span>
                                            <span className="text-sm font-black text-primary">High</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Usage & Benefits Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em]">How to Use</h4>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                                        <Info className="w-5 h-5 text-primary" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic">{product.usage || 'Apply at the roots for best results and healthy growth.'}</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em]">Benefits</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    {['Better Crop Growth', 'Healthier Plants', 'Natural Nutrition'].map((b, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-accent"></div>
                                            <span className="text-xs font-bold text-slate-900">{b}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ProductDetail;
