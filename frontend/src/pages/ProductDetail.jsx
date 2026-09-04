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

  return (
    <div className="page-container py-8 space-y-12 pb-24 lg:pb-12">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
        <Link to="/" className="hover:text-agri-forest">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-agri-forest">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-agri-forest">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* Left: Product Image */}
        <div className="lg:col-span-6 card p-6 bg-slate-50 border-slate-200/80 sticky top-28">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            category={product.category}
            aspect="aspect-square"
            className="rounded-xl shadow-sm"
          />
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-semibold px-2">
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-agri-green" /> 100% Genuine Guarantee</span>
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
              <span className="text-3xl sm:text-4xl font-black text-agri-forest">Rs. {product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-base text-slate-400 line-through font-semibold">Rs. {product.mrp}</span>
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

          {/* Quantity Selector & Actions */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-extrabold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-extrabold text-slate-800 text-sm">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Main Desktop Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
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

            {/* AI Assistant Advice CTA */}
            <button
              type="button"
              onClick={openAdviceModal}
              className="w-full bg-gradient-to-r from-emerald-900 to-[#0F382C] text-emerald-300 border border-emerald-700/50 hover:border-emerald-500 font-bold px-4 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Sparkles size={16} className="text-agri-gold" /> Get AgriSmart AI Dosage & Suitability Guidance
            </button>
          </div>

          {/* Delivery & Trust Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <Truck size={20} className="text-agri-green shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Standard Delivery</p>
                <p className="text-[10px] text-slate-500">Delivered in 3-5 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <ShieldCheck size={20} className="text-agri-green shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Quality Checked</p>
                <p className="text-[10px] text-slate-500">Verified expiration & purity</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section: Overview / Specifications / Price Intelligence */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-agri-forest text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Overview & Benefits
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === 'specs'
                ? 'bg-agri-forest text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Composition & Usage
          </button>
          <button
            onClick={() => {
              setActiveTab('intel');
              if (!priceIntel) fetchIntel();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'intel'
                ? 'bg-agri-forest text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles size={14} className="text-agri-gold" /> AI Price Intelligence
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            <p>{product.description || 'No detailed overview provided for this agricultural product.'}</p>
            {product.benefits && product.benefits.length > 0 && (
              <div>
                <h4 className="font-extrabold text-slate-900 mb-2">Key Crop Benefits:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {product.benefits.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-4 text-xs sm:text-sm text-slate-700">
            {product.composition && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 font-extrabold block mb-1">Active Composition:</strong>
                <p>{product.composition}</p>
              </div>
            )}
            {product.usage && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="text-slate-900 font-extrabold block mb-1">Recommended Application Instructions:</strong>
                <p>{product.usage}</p>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Category</span>
                <span className="font-extrabold text-slate-800">{product.category}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Unit Packaging</span>
                <span className="font-extrabold text-slate-800">{product.unit || 'Standard'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Organic Grade</span>
                <span className="font-extrabold text-slate-800">{product.category === 'Organic' ? 'Yes' : 'Standard'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Authenticity</span>
                <span className="font-extrabold text-slate-800">100% Certified</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'intel' && (
          <div className="text-xs sm:text-sm text-slate-700">
            {intelLoading ? (
              <div className="p-6 text-center text-slate-400 font-bold">Analyzing market price intelligence...</div>
            ) : priceIntel ? (
              <div className="space-y-3 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-950">Market Trend:</span>
                  <span className="font-black text-emerald-700 bg-white px-3 py-1 rounded-lg border border-emerald-200">
                    {priceIntel.trend} ({priceIntel.trendPercentage}%)
                  </span>
                </div>
                <p><strong>Buying Advice:</strong> {priceIntel.buyingAdvice}</p>
                <p><strong>Market Analysis:</strong> {priceIntel.reason}</p>
                <p><strong>Best Planting Season:</strong> {priceIntel.bestSeason}</p>
              </div>
            ) : (
              <button onClick={fetchIntel} className="btn-secondary text-xs py-2 px-4">
                Load Market Price Intelligence
              </button>
            )}
          </div>
        )}
      </div>

      {/* Related Products Grid */}
      {related.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Related Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((relProduct) => (
              <ProductCard key={relProduct._id} product={relProduct} onAddToCartToast={(msg) => setToastMessage(msg)} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Bottom CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-40 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <p className="text-[10px] font-bold text-slate-400">Total Price</p>
          <p className="text-lg font-black text-agri-forest">Rs. {product.price * qty}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="btn-primary text-xs py-3 px-4"
          >
            Add to Cart
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="btn-accent text-xs py-3 px-4"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* AI Advice Modal */}
      {adviceOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 p-6 md:p-8 shadow-2xl space-y-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4 border-b pb-4">
              <div>
                <span className="text-[10px] font-extrabold tracking-[0.2em] text-agri-green uppercase">AgriSmart AI Assistant</span>
                <h3 className="text-2xl font-black text-slate-900">{product.name}</h3>
                <p className="text-xs text-slate-500">Automated dosage, soil safety, and crop properties.</p>
              </div>
              <button onClick={() => setAdviceOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {adviceError && <p className="text-xs text-rose-600 font-bold">{adviceError}</p>}

            {adviceLoading ? (
              <div className="p-8 text-center text-slate-500 font-bold">Consulting Agri-Science Knowledge Base...</div>
            ) : advice ? (
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <h4 className="font-extrabold text-emerald-950 flex items-center gap-2 mb-2">
                    <FlaskConical size={16} /> Dosage & Application Method
                  </h4>
                  <p><strong>Dosage:</strong> {advice.dosage}</p>
                  <p><strong>Method:</strong> {advice.applicationMethod}</p>
                  <p><strong>Best Time:</strong> {advice.bestTime}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="font-extrabold text-slate-900 flex items-center gap-2 mb-2">
                    <ShieldCheck size={16} /> Crop Suitability & Safety
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
