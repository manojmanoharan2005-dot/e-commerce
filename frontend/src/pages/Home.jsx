import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Leaf, FlaskConical, Sprout, Shield, Wheat, Wrench, Sparkles, Box, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const categories = [
        { name: 'Organic', image: 'https://images.unsplash.com/photo-1594901861110-388e40424564?q=80&w=300&auto=format&fit=crop', icon: Leaf, count: '120+ Products' },
        { name: 'Seeds', image: 'https://images.unsplash.com/photo-1592150621344-82d672ac653e?q=80&w=300&auto=format&fit=crop', icon: Wheat, count: '85+ Products' },
        { name: 'Tools', image: 'https://images.unsplash.com/photo-1523308417031-4029bd0401c2?q=80&w=300&auto=format&fit=crop', icon: Wrench, count: '45+ Products' },
        { name: 'Pesticides', image: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?q=80&w=300&auto=format&fit=crop', icon: Shield, count: '60+ Products' },
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const trendingProducts = products.filter(p => p.isTrending).slice(0, 8);

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Live Market Ticker - More Subtle */}
            <div className="bg-primary text-white py-2.5 overflow-hidden whitespace-nowrap relative border-b border-white/5">
                <div className="inline-block animate-marquee">
                    <span className="mx-8 text-[10px] font-black uppercase tracking-[0.3em] text-accent">Market Prices:</span>
                    <span className="mx-4 text-[10px] font-bold uppercase tracking-widest opacity-80">Urea <span className="text-emerald-400">↑ 2.4%</span></span>
                    <span className="mx-4 text-[10px] font-bold uppercase tracking-widest opacity-80">Organic DAP <span className="text-rose-400">↓ 1.2%</span></span>
                    <span className="mx-4 text-[10px] font-bold uppercase tracking-widest opacity-80">NPK Gold - Best Price</span>
                    <span className="mx-4 text-[10px] font-bold uppercase tracking-widest text-accent italic underline decoration-2">New: High-Yield Seeds</span>
                    {/* Duplicate for seamless loop */}
                    <span className="mx-8 text-[10px] font-black uppercase tracking-[0.3em] text-accent">Market Insight:</span>
                    <span className="mx-4 text-[10px] font-bold uppercase tracking-widest opacity-80">Premium Urea <span className="text-emerald-400">↑ 2.4%</span></span>
                </div>
            </div>

            <main className="container mx-auto px-4 lg:max-w-7xl pt-8">
                {/* Hero Section - Full Width */}
                <div className="relative mb-12">
                    <div className="w-full relative h-[400px] lg:h-[550px] overflow-hidden rounded-[2.5rem] shadow-2xl group">
                        <img
                            src="https://images.unsplash.com/photo-1599839619722-397514118331?q=80&w=2070&auto=format&fit=crop"
                            alt="Hero Banner"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[15s] ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-8 lg:p-16">
                            <div className="inline-flex items-center gap-2 bg-accent text-primary text-[10px] font-bold px-3 py-1 rounded-full mb-6 w-fit uppercase tracking-[0.2em] animate-fade-in shadow-lg">
                                <Sparkles className="w-3 h-3" /> Season's Best
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black mb-4 text-white leading-[1.1] tracking-tight max-w-2xl">
                                Growing <span className="text-accent">Better</span> with Every Harvest.
                            </h2>
                            <p className="text-lg md:text-xl font-medium mb-10 text-white/80 max-w-xl">
                                High-quality fertilizers and tools for your farm. Trusted by thousands of farmers.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link to="/products" className="bg-accent text-primary px-10 py-4 rounded-2xl font-black shadow-xl shadow-accent/20 hover:scale-105 transition-all text-sm uppercase tracking-widest group">
                                    Shop Now
                                    <ChevronRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl text-white">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-slate-300 overflow-hidden"><img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" /></div>)}
                                    </div>
                                    <span className="text-xs font-bold font-serif italic">Joined by 12k+ Farmers</span>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Modern Category Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {categories.map((cat, i) => (
                        <Link
                            key={i}
                            to={`/products?category=${cat.name}`}
                            className="group relative h-48 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
                        >
                            <img src={cat.image} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" alt={cat.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent p-6 flex flex-col justify-end">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-lg font-black text-white leading-none mb-1">{cat.name}</h4>
                                        <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">{cat.count}</p>
                                    </div>
                                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white group-hover:bg-accent group-hover:text-primary transition-colors">
                                        <cat.icon className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Section Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-8 h-[2px] bg-accent"></span>
                            <span className="text-[10px] font-black text-accent uppercase tracking-[0.3em]">Trending Now</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic">POPULAR PRODUCTS</h3>
                    </div>
                    <Link to="/products" className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors">
                        View All Products <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Standard Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20">
                    {loading ? (
                        [1, 2, 3, 4].map(i => <div key={i} className="aspect-[3/4] bg-slate-100 rounded-[2.5rem] animate-pulse" />)
                    ) : (
                        trendingProducts.map(product => <ProductCard key={product._id} product={product} />)
                    )}
                </div>

                {/* Features / Benefits Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {[
                        { title: 'AI Assistant', desc: 'Get smart farming advice powered by AI.', icon: Sparkles, color: 'bg-indigo-50 text-indigo-500' },
                        { title: 'Best Prices', desc: 'We offer high quality products at the lowest cost.', icon: Shield, color: 'bg-emerald-50 text-emerald-500' },
                        { title: 'Fast Delivery', desc: 'Quick and safe delivery to your doorstep.', icon: Box, color: 'bg-amber-50 text-amber-500' }
                    ].map((f, i) => (
                        <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 group">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${f.color} group-hover:scale-110 transition-transform`}>
                                <f.icon className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 mb-3">{f.title}</h4>
                            <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};


export default Home;
