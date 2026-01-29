import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Leaf, FlaskConical, Sprout, Shield, Wheat, Wrench, Sparkles, Box, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 0 });

    const categories = [
        { name: 'Organic', image: 'https://rukminim1.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100', icon: Leaf },
        { name: 'Chemical', image: 'https://rukminim1.flixcart.com/flap/128/128/image/29327f40e9c4d26b.png?q=100', icon: FlaskConical },
        { name: 'Seeds', image: 'https://rukminim1.flixcart.com/flap/128/128/image/22fddf3c7da4c4f4.png?q=100', icon: Wheat },
        { name: 'Tools', image: 'https://rukminim1.flixcart.com/flap/128/128/image/69cff58.png?q=100', icon: Wrench },
        { name: 'Pesticides', image: 'https://rukminim1.flixcart.com/flap/128/128/image/ab7e2c02.png?q=100', icon: Shield },
        { name: 'Equipment', image: 'https://rukminim1.flixcart.com/flap/128/128/image/0ff199d1bd27eb98.png?q=100', icon: Box },
        { name: 'Soil', image: 'https://rukminim1.flixcart.com/flap/128/128/image/71033762.png?q=100', icon: Sprout },
        { name: 'Offers', image: 'https://rukminim1.flixcart.com/flap/128/128/image/f15c02bfeb02d15d.png?q=100', icon: Sparkles }
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

        // Newsletter/Flash Sale Timer
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 5);
    const trendingProducts = products.filter(p => p.isTrending).slice(0, 10);
    const topDeals = products.slice(0, 5);

    return (
        <div className="bg-[#f1f3f6] min-h-screen pb-10">
            {/* Live Market Ticker */}
            <div className="bg-gray-900 text-white py-2 overflow-hidden whitespace-nowrap relative">
                <div className="inline-block animate-marquee">
                    <span className="mx-8 text-[10px] font-black uppercase tracking-widest text-[#ffe500]">Live Market:</span>
                    <span className="mx-4 text-[10px] font-bold uppercase">Urea ↑ 2%</span>
                    <span className="mx-4 text-[10px] font-bold uppercase">DAP ↓ 1.5%</span>
                    <span className="mx-4 text-[10px] font-bold uppercase">NPK 19-19-19 - Stable</span>
                    <span className="mx-4 text-[10px] font-bold uppercase text-[#388e3c]">New Stock: Hybrid Tomato Seeds ARRIVED</span>
                    <span className="mx-8 text-[10px] font-black uppercase tracking-widest text-[#ffe500]">Flash Sale Ending Soon!</span>
                    {/* Duplicate for seamless loop */}
                    <span className="mx-8 text-[10px] font-black uppercase tracking-widest text-[#ffe500]">Live Market:</span>
                    <span className="mx-4 text-[10px] font-bold uppercase">Urea ↑ 2%</span>
                    <span className="mx-4 text-[10px] font-bold uppercase">DAP ↓ 1.5%</span>
                </div>
            </div>

            {/* Flipkart-style Category Bar */}
            <div className="bg-white shadow-sm border-b border-gray-100 mb-2 overflow-x-auto scrollbar-hide">
                <div className="container mx-auto px-4 py-4 lg:max-w-7xl flex items-center justify-between min-w-max gap-8 lg:gap-0">
                    {categories.map((cat, i) => (
                        <Link
                            key={i}
                            to={`/products?category=${cat.name}`}
                            className="flex flex-col items-center group cursor-pointer transition-all hover:translate-y-[-2px]"
                        >
                            <div className="w-16 h-16 mb-2 overflow-hidden flex items-center justify-center">
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                                />
                            </div>
                            <span className="text-sm font-bold text-gray-800 group-hover:text-[#2874f0] tracking-tight">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-2 lg:px-4 lg:max-w-7xl">
                {/* Hero Banner */}
                <div className="relative h-[200px] md:h-[300px] lg:h-[400px] mb-4 overflow-hidden shadow-sm group rounded-sm">
                    <img
                        src="https://images.unsplash.com/photo-1599839619722-397514118331?q=80&w=2070&auto=format&fit=crop"
                        alt="Hero Banner"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[10s]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12 text-white">
                        <div className="inline-block bg-[#ffe500] text-gray-900 text-[10px] font-black px-3 py-1 rounded-sm mb-4 w-fit uppercase tracking-widest">Mega Savings Event</div>
                        <h2 className="text-4xl md:text-6xl font-black mb-2 italic leading-none">SMART FARMING</h2>
                        <p className="text-xl md:text-2xl font-bold mb-8 text-white/90 max-w-lg">Premium Fertilizers & Seeds at Factory Prices. Expert AI advice for free.</p>
                        <Link to="/products" className="bg-[#2874f0] text-white px-12 py-4 rounded-sm font-black w-fit shadow-2xl hover:bg-black transition-all uppercase text-sm tracking-widest">
                            Shop The Deals
                        </Link>
                    </div>
                </div>

                {/* Flash Sale Countdown Section */}
                <div className="bg-white p-4 shadow-sm rounded-sm mb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-4 mb-6 gap-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight uppercase italic flex items-center gap-2">
                                <Zap className="w-6 h-6 text-[#fb641b] fill-[#fb641b]" />
                                Flash Sale
                            </h2>
                            <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-sm border border-red-100">
                                <span className="text-[10px] font-black text-red-600 uppercase">Ends In:</span>
                                <div className="flex gap-1">
                                    <span className="bg-red-600 text-white text-xs font-black px-1.5 py-0.5 rounded-sm">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <span className="text-red-600 font-black">:</span>
                                    <span className="bg-red-600 text-white text-xs font-black px-1.5 py-0.5 rounded-sm">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <span className="text-red-600 font-black">:</span>
                                    <span className="bg-red-600 text-white text-xs font-black px-1.5 py-0.5 rounded-sm">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                </div>
                            </div>
                        </div>
                        <Link to="/products" className="bg-[#2874f0] text-white px-8 py-2.5 rounded-sm text-xs font-black shadow hover:bg-black transition-all uppercase tracking-widest">
                            View all deals
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {loading ? (
                            [1, 2, 3, 4, 5].map(i => <div key={i} className="bg-gray-100 aspect-[4/5] rounded animate-pulse" />)
                        ) : (
                            flashSaleProducts.map(product => <ProductCard key={product._id} product={product} />)
                        )}
                    </div>
                </div>

                {/* Trending Slider Section */}
                {!loading && trendingProducts.length > 0 && (
                    <div className="bg-white p-4 shadow-sm rounded-sm mb-4 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[#2874f0]" />
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Trending Now</h2>
                            </div>
                            <Link to="/products" className="text-[#2874f0] font-black text-xs uppercase hover:underline">See everything</Link>
                        </div>
                        <div className="flex gap-4 overflow-x-auto py-4 scrollbar-hide pb-6">
                            {trendingProducts.map(product => (
                                <Link key={product._id} to={`/products/${product._id}`} className="min-w-[200px] flex flex-col group p-4 border border-gray-50 rounded-sm hover:border-blue-100 hover:shadow-lg transition-all bg-white relative">
                                    <div className="absolute top-2 right-2 bg-blue-50 text-[#2874f0] text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase">Hot</div>
                                    <div className="w-full aspect-square mb-4">
                                        <img src={product.imageUrl} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" alt={product.name} />
                                    </div>
                                    <p className="text-xs font-black text-gray-900 group-hover:text-[#2874f0] line-clamp-1 mb-1">{product.name}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#388e3c] font-black">₹{product.price}</span>
                                        <span className="text-gray-400 text-[10px] line-through">₹{product.mrp}</span>
                                    </div>
                                    <div className="mt-2 w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                                        <div className="bg-[#2874f0] h-full" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
                                    </div>
                                    <p className="text-[8px] font-black text-gray-400 mt-1 uppercase">Selling Fast</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Marketing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-[#2874f0] to-[#1259d3] p-8 rounded-sm text-white relative overflow-hidden group">
                        <div className="z-10 relative">
                            <h3 className="text-2xl font-black mb-2 italic">FREE AI ANALYSIS</h3>
                            <p className="text-white/80 text-sm font-bold mb-6 max-w-[180px]">Ask Gemini about your crop suitability and soil health.</p>
                            <Link to="/products" className="bg-white text-[#2874f0] px-6 py-2.5 rounded-sm font-black uppercase text-xs shadow-xl inline-block hover:scale-105 transition-transform">Get Advice</Link>
                        </div>
                        <Sparkles className="w-32 h-32 absolute right-[-20px] bottom-[-20px] text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="bg-gradient-to-br from-[#fb641b] to-[#dc4f0b] p-8 rounded-sm text-white relative overflow-hidden group">
                        <div className="z-10 relative">
                            <h3 className="text-2xl font-black mb-2 italic">PRICE ALERTS</h3>
                            <p className="text-white/80 text-sm font-bold mb-6 max-w-[180px]">Don't overpay. Track real-time market rates and trends.</p>
                            <Link to="/products" className="bg-white text-[#fb641b] px-6 py-2.5 rounded-sm font-black uppercase text-xs shadow-xl inline-block hover:scale-105 transition-transform">Check Rates</Link>
                        </div>
                        <Zap className="w-32 h-32 absolute right-[-20px] bottom-[-20px] text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="bg-gradient-to-br from-[#388e3c] to-[#2e7d32] p-8 rounded-sm text-white relative overflow-hidden group hidden lg:block">
                        <div className="z-10 relative">
                            <h3 className="text-2xl font-black mb-2 italic">SAME DAY DELIVERY</h3>
                            <p className="text-white/80 text-sm font-bold mb-6 max-w-[180px]">Express logistics for seeds and small tool supplies.</p>
                            <Link to="/products" className="bg-white text-[#388e3c] px-6 py-2.5 rounded-sm font-black uppercase text-xs shadow-xl inline-block hover:scale-105 transition-transform">Search Express</Link>
                        </div>
                        <Box className="w-32 h-32 absolute right-[-20px] bottom-[-20px] text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
                    </div>
                </div>

                {/* Best Sellers */}
                {!loading && topDeals.length > 0 && (
                    <div className="bg-white p-4 shadow-sm rounded-sm">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Best Sellers in Fertilizers</h2>
                            <Link to="/products" className="text-[#2874f0] font-black text-xs uppercase hover:underline">View All</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {topDeals.map(product => <ProductCard key={product._id} product={product} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
