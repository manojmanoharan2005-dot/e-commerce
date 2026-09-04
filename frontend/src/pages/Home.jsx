import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wheat, FlaskConical, Bug, Leaf, Tractor, Sprout, ShieldCheck, Truck, Award, ArrowRight, Sparkles, CheckCircle2, Droplets } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const categories = [
  { name: 'Seeds', icon: Wheat, bg: 'bg-amber-50 text-amber-700 border-amber-200', count: '100+ Varieties' },
  { name: 'Organic', icon: Leaf, bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', count: '100% Bio Certified' },
  { name: 'Fertilizer', icon: Sprout, bg: 'bg-green-50 text-green-700 border-green-200', count: 'NPK & Organic' },
  { name: 'Pesticide', icon: Bug, bg: 'bg-rose-50 text-rose-700 border-rose-200', count: 'Crop Protection' },
  { name: 'Bio-Fertilizer', icon: Sprout, bg: 'bg-teal-50 text-teal-700 border-teal-200', count: 'Soil Enhancers' },
  { name: 'Equipment', icon: Tractor, bg: 'bg-blue-50 text-blue-700 border-blue-200', count: 'Tools & Pumps' },
  { name: 'Chemical', icon: FlaskConical, bg: 'bg-slate-100 text-slate-700 border-slate-300', count: 'Standard Grade' },
  { name: 'Irrigation', icon: Droplets, bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', count: 'Drip & Sprinklers' },
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [trending, setTrending] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadWishlistIds = async () => {
    if (!isAuthenticated) {
      setWishlistIds(new Set());
      return;
    }
    try {
      const { data } = await api.get('/wishlist');
      setWishlistIds(new Set((data.wishlist || []).map((item) => item._id)));
    } catch {
      setWishlistIds(new Set());
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/products', { params: { limit: 10 } });
        const all = data.products || [];
        setTrending(all.slice(0, 5));
        setFeatured(all.slice(5, 10));
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    loadWishlistIds();
  }, [isAuthenticated]);

  return (
    <main className="space-y-16 pb-16">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0F382C] via-[#09251D] to-[#041611] text-white pt-12 pb-20 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="page-container grid lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
              <Sparkles size={14} className="text-agri-gold animate-spin" />
              <span>DIRECT-FROM-MANUFACTURER FARM INPUTS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Grow Better. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-agri-gold">
                Farm Smarter.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Quality agricultural products for every stage of your farming journey. Certified seeds, bio-fertilizers, pesticides, and modern equipment delivered directly to your farm.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/products"
                className="w-full sm:w-auto btn-accent text-base px-8 py-4 shadow-lg shadow-emerald-600/30 hover:scale-[1.02] transition-transform"
              >
                Shop Products <ArrowRight size={18} />
              </Link>
              <Link
                to="/products?category=Seeds"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors flex items-center justify-center gap-2"
              >
                Explore Seeds
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/10 text-center lg:text-left">
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-slate-400 font-medium">Genuine Products</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">Pan-India</p>
                <p className="text-xs text-slate-400 font-medium">Doorstep Shipping</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">4.8★</p>
                <p className="text-xs text-slate-400 font-medium">Farmer Rating</p>
              </div>
            </div>
          </div>

          {/* Hero Feature Banner Card */}
          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <span className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black">
                  <Sprout size={22} />
                </span>
                <div>
                  <h3 className="font-extrabold text-white text-lg">AgriSmart Recommendation</h3>
                  <p className="text-xs text-emerald-300 font-semibold">Seasonal Crop Advice</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/10 rounded-2xl p-4 flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200 font-medium leading-snug">
                    <strong className="text-white block font-bold mb-0.5">Pre-Monsoon Soil Prep</strong>
                    Apply organic bio-fertilizers during early tilling to enhance microbial soil activity and root development.
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-200 font-medium leading-snug">
                    <strong className="text-white block font-bold mb-0.5">High-Yield Hybrid Seeds</strong>
                    Choose certified disease-resistant tomato & paddy seeds for up to 35% higher harvest yields.
                  </p>
                </div>
              </div>

              <Link
                to="/products?category=Organic"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                View Organic Crop Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop By Category Strip */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Shop By Category</h2>
            <p className="text-sm text-slate-500 font-medium">Certified agricultural inputs tailored for your farm</p>
          </div>
          <Link to="/products" className="text-sm font-extrabold text-agri-green hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="card p-4 text-center hover:border-agri-green/50 hover:shadow-md transition-all duration-200 group flex flex-col items-center justify-between h-full"
              >
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${cat.bg} mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
                <div>
                  <p className="font-extrabold text-xs text-slate-900 group-hover:text-agri-forest transition-colors">{cat.name}</p>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Best Sellers Grid (Real Data) */}
      <section className="page-container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Best Sellers</h2>
            <p className="text-sm text-slate-500 font-medium">Most trusted products chosen by Indian farmers</p>
          </div>
          <Link to="/products?sort=popularity" className="text-sm font-extrabold text-agri-green hover:underline flex items-center gap-1">
            Explore All <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="card aspect-square bg-slate-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {trending.map((product) => (
              <ProductCard
                key={product._id}
                product={{ ...product, isWishlisted: wishlistIds.has(product._id) }}
                onWishlistChange={loadWishlistIds}
                onAddToCartToast={(msg) => setToastMessage(msg)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why AgriStore? Value Grid */}
      <section className="bg-agri-surface py-12 border-y border-slate-200">
        <div className="page-container">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Why AgriStore?</h2>
            <p className="text-sm text-slate-500 font-medium">We bridge the gap between quality manufacturers and hard-working farmers.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-6 border-slate-200/80 hover:border-agri-green/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 grid place-items-center mb-4">
                <ShieldCheck size={26} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Quality Checked</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Every batch is lab-tested and verified for purity, germination rate, and composition.
              </p>
            </div>

            <div className="card p-6 border-slate-200/80 hover:border-agri-green/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 grid place-items-center mb-4">
                <Award size={26} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Trusted Brands</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Direct partnerships with certified manufacturers to guarantee zero counterfeit inputs.
              </p>
            </div>

            <div className="card p-6 border-slate-200/80 hover:border-agri-green/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 grid place-items-center mb-4">
                <Truck size={26} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Reliable Delivery</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Doorstep dispatch with real-time tracking so you never miss a planting season deadline.
              </p>
            </div>

            <div className="card p-6 border-slate-200/80 hover:border-agri-green/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 grid place-items-center mb-4">
                <Sprout size={26} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">Expert Support</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Agri-scientists and crop advisors available via AI chat and phone to assist your soil decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      {featured.length > 0 && (
        <section className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Featured Crop Essentials</h2>
              <p className="text-sm text-slate-500 font-medium">Handpicked high-performance products for maximum yield</p>
            </div>
            <Link to="/products" className="text-sm font-extrabold text-agri-green hover:underline flex items-center gap-1">
              View Marketplace <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {featured.map((product) => (
              <ProductCard
                key={product._id}
                product={{ ...product, isWishlisted: wishlistIds.has(product._id) }}
                onWishlistChange={loadWishlistIds}
                onAddToCartToast={(msg) => setToastMessage(msg)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Pre-Footer Banner */}
      <section className="page-container">
        <div className="bg-gradient-to-r from-agri-forest to-[#09251D] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <span className="bg-agri-gold text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider">
              Ready to Upgrade Your Farm Yield?
            </span>
            <h3 className="text-3xl sm:text-4xl font-black leading-tight">
              Order Genuine Agri Products With Doorstep Delivery Today.
            </h3>
            <p className="text-slate-300 text-sm font-medium">
              Join thousands of farmers across India getting better prices and certified quality inputs.
            </p>
          </div>
          <div className="shrink-0 z-10">
            <Link to="/products" className="btn-accent text-base px-8 py-4 shadow-lg">
              Explore Full Marketplace <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
