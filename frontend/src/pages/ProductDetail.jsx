import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Minus, Plus, Sparkles, ShieldCheck, FlaskConical, Star, Truck, Award, CheckCircle2, Heart, ShoppingBag, ArrowLeft, RefreshCw, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import { ProductDetailSkeleton } from '../components/Skeleton';
import Toast from '../components/Toast';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const [priceIntel, setPriceIntel] = useState(null);
  const [intelLoading, setIntelLoading] = useState(false);

  const [adviceOpen, setAdviceOpen] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [adviceError, setAdviceError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);

        // Fetch related items
        const rel = await api.get('/products', { params: { category: data.product.category, limit: 5 } });
        setRelated((rel.data.products || []).filter((p) => p._id !== data.product._id).slice(0, 4));

        // Wishlist check
        if (isAuthenticated) {
          try {
            const wish = await api.get('/wishlist');
            const isWish = (wish.data.wishlist || []).some((w) => w._id === data.product._id);
            setWishlisted(isWish);
          } catch {
            setWishlisted(false);
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isAuthenticated]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/products/${id}`);
      return;
    }
    const nextState = !wishlisted;
    setWishlisted(nextState);
    try {
      if (nextState) {
        await api.post('/wishlist', { productId: product._id });
        setToastMessage('Added to wishlist');
      } else {
        await api.delete(`/wishlist/${product._id}`);
        setToastMessage('Removed from wishlist');
      }
    } catch {
      setWishlisted(!nextState);
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;
    try {
      await addToCart(product, qty);
      setToastMessage(`${qty} x ${product.name} added to cart`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.stock === 0) return;
    try {
      await addToCart(product, qty);
      navigate('/checkout');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIntel = async () => {
    setIntelLoading(true);
    try {
      const { data } = await api.get(`/products/${id}/price-intelligence`);
      setPriceIntel(data.intelligence);
    } catch (err) {
      console.error('Error fetching price intelligence:', err);
    } finally {
      setIntelLoading(false);
    }
  };

  const getAdvice = async () => {
    setAdviceLoading(true);
    setAdviceError('');
    try {
      const { data } = await api.post(`/products/${id}/advice`, {});
      setAdvice(data.advice);
    } catch (err) {
      setAdviceError(err.response?.data?.message || 'Could not fetch AI advice');
    } finally {
      setAdviceLoading(false);
    }
  };

  const openAdviceModal = () => {
    setAdviceOpen(true);
    setAdvice(null);
    setAdviceError('');
    getAdvice();
  };

  if (loading) {
    return (
      <div className="page-container py-12">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Product Not Found</h2>
        <p className="text-sm text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="btn-accent text-xs px-6 py-3 inline-flex">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const totalPrice = product.price * qty;

  return (
    <div className="page-container py-6 sm:py-8 space-y-8 pb-28 sm:pb-32 lg:pb-12">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <Link to="/" className="hover:text-agri-forest">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-agri-forest">Marketplace</Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Main Grid: Left Image, Right Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 card p-4 sm:p-6 bg-slate-50 border-slate-200/80 lg:sticky lg:top-28">
          <ProductImage
            product={product}
            src={product.imageUrl}
            alt={product.name}
            category={product.category}
            aspect="aspect-square"
            className="rounded-xl shadow-sm"
          />
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-agri-green" /> 100% Genuine</span>
            <span className="flex items-center gap-1.5"><Award size={16} className="text-agri-gold" /> Certified Batch</span>
          </div>
        </div>

        {/* Right: Product Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="bg-agri-forest text-white text-xs font-extrabold px-3 py-1 rounded-md uppercase tracking-wider">
                {product.category}
              </span>

              <button
                onClick={handleWishlistToggle}
                className={`p-2.5 rounded-xl border transition-all ${
                  wishlisted
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-rose-500'
                }`}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={18} className={wishlisted ? 'fill-current' : ''} />
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-800 font-extrabold px-2.5 py-1 rounded-lg border border-amber-200 text-xs">
                <Star size={14} className="fill-amber-500 text-amber-500" />
                <span>{(product.rating || 4.8).toFixed(1)}</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                ({product.reviewCount || product.numReviews || 24} Verified Farmer Reviews)
              </span>
            </div>
          </div>

          {/* Pricing Block */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-agri-forest">₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-base text-slate-400 line-through font-semibold">₹{product.mrp}</span>
              )}
              {discount > 0 && (
                <span className="bg-agri-gold text-white text-xs font-black px-2.5 py-1 rounded-md">
                  SAVE {discount}%
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-500">Inclusive of all taxes • Free Pan-India Shipping on bulk orders</p>
          </div>

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-500">Availability:</span>
            {product.stock > 0 ? (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 size={14} /> In Stock ({product.stock} {product.unit || 'units'} available)
              </span>
            ) : (
              <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-md">
                Sold Out / Backorder
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
              {product.description}
            </p>
          )}

          {/* Quantity Selector */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-extrabold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-extrabold text-slate-800 text-sm">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Desktop Action Buttons (Hidden on mobile to eliminate duplicate CTAs) */}
            <div className="hidden lg:grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary text-sm py-3.5"
              >
                <ShoppingBag size={18} /> Add to Cart
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="btn-accent text-sm py-3.5"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Smart AI Actions & Intelligence */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={openAdviceModal}
              className="p-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-2xl text-left transition-colors group flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white grid place-items-center shrink-0">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="font-extrabold text-xs text-emerald-950 group-hover:text-agri-forest">AgriSmart AI Advice</p>
                <p className="text-[11px] text-emerald-700 font-medium">Get dosage & crop safety recommendations</p>
              </div>
            </button>

            <button
              onClick={fetchIntel}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left transition-colors group flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-emerald-400 grid place-items-center shrink-0">
                <FlaskConical size={16} />
              </div>
              <div>
                <p className="font-extrabold text-xs text-slate-900">Price Intelligence</p>
                <p className="text-[11px] text-slate-500 font-medium">Analyze market price trends</p>
              </div>
            </button>
          </div>

          {priceIntel && (
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 text-xs animate-slide-up">
              <p className="font-bold text-emerald-400">Market Price Intelligence Analysis:</p>
              <p className="text-slate-300 leading-relaxed">{priceIntel}</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section */}
      <div className="card p-6 space-y-6">
        <div className="flex border-b border-slate-200 gap-8 text-sm font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'overview' ? 'border-agri-green text-agri-forest font-extrabold' : 'border-transparent text-slate-500'
            }`}
          >
            Overview & Usage
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-3 transition-colors border-b-2 ${
              activeTab === 'specs' ? 'border-agri-green text-agri-forest font-extrabold' : 'border-transparent text-slate-500'
            }`}
          >
            Specifications
          </button>
        </div>

        {activeTab === 'overview' ? (
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            <p>{product.description}</p>
            {product.benefits && product.benefits.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="font-black text-slate-900 text-sm">Key Benefits:</h4>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 font-semibold">
                      <CheckCircle2 size={16} className="text-agri-green shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-bold block">Manufacturer</span>
              <span className="font-black text-slate-900">{product.manufacturer || 'AgriStore Certified'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-bold block">Packaging Unit</span>
              <span className="font-black text-slate-900">{product.unit || 'Standard Package'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-bold block">Category</span>
              <span className="font-black text-slate-900">{product.category}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 font-bold block">Stock Available</span>
              <span className="font-black text-slate-900">{product.stock} units</span>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-4 pt-6">
          <h3 className="text-xl font-black text-slate-900">Recommended Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {related.map((relProduct) => (
              <ProductCard key={relProduct._id} product={relProduct} />
            ))}
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Purchase Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200/90 shadow-2xl px-3 py-2.5 sm:px-4 sm:py-3 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] transition-all">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          <div className="shrink-0 leading-tight">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Price</span>
            <span className="text-base sm:text-xl font-black text-agri-forest">₹{totalPrice}</span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-[240px] justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 py-2.5 px-2 bg-agri-forest hover:bg-agri-forest-dark text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-1 min-h-[44px] shadow-sm disabled:opacity-40"
            >
              <ShoppingBag size={15} />
              <span>Add</span>
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 py-2.5 px-2 bg-agri-green hover:bg-agri-green-hover text-white rounded-xl font-extrabold text-xs flex items-center justify-center min-h-[44px] shadow-sm disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* AI Advice Modal */}
      {adviceOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-extrabold tracking-[0.2em] text-agri-green uppercase">AgriSmart AI Assistant</span>
                <h3 className="text-xl font-black text-slate-900">{product.name}</h3>
                <p className="text-xs text-slate-500">Automated dosage, soil safety, and crop properties.</p>
              </div>
              <button onClick={() => setAdviceOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {adviceError && <p className="text-xs text-rose-600 font-bold">{adviceError}</p>}

            {adviceLoading ? (
              <div className="p-8 text-center text-slate-500 font-bold text-xs">Consulting Agri-Science Knowledge Base...</div>
            ) : advice ? (
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <h4 className="font-extrabold text-emerald-950 flex items-center gap-2 mb-1.5">
                    <FlaskConical size={16} /> Dosage & Application
                  </h4>
                  <p><strong>Dosage:</strong> {advice.dosage}</p>
                  <p><strong>Method:</strong> {advice.applicationMethod}</p>
                  <p><strong>Best Time:</strong> {advice.bestTime}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-2 mb-1.5">
                    <ShieldCheck size={16} /> Crop Suitability
                  </h4>
                  <p><strong>Suitability:</strong> {advice.suitability}</p>
                  <p className="mt-1"><strong>Rationale:</strong> {advice.suitabilityReason}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
