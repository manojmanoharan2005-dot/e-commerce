import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader, ChevronDown, Star, X, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        minPrice: '',
        maxPrice: '',
        inStock: false,
        sortBy: 'popularity'
    });

    const categories = ['Organic', 'Chemical', 'Bio-Fertilizer', 'Pesticide', 'Seeds', 'Equipment'];

    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setFilters(prev => ({ ...prev, category: categoryFromUrl }));
        }
        fetchProducts();
    }, [searchParams, filters.sortBy]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const search = searchParams.get('search');
            const cat = searchParams.get('category');

            let url = '/products?';
            const params = new URLSearchParams();

            if (search) {
                url = '/products/search?';
                params.append('query', search);
            } else {
                if (cat) params.append('category', cat);
                if (filters.minPrice) params.append('minPrice', filters.minPrice);
                if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
                if (filters.inStock) params.append('inStock', 'true');
            }

            const response = await api.get(url + params.toString());
            let data = response.data.data;

            // Sorting logic simulation
            if (filters.sortBy === 'priceLow') data.sort((a, b) => a.price - b.price);
            if (filters.sortBy === 'priceHigh') data.sort((a, b) => b.price - a.price);
            if (filters.sortBy === 'newest') data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (type) => {
        setFilters({ ...filters, sortBy: type });
    };

    const clearFilters = () => {
        setSearchParams({});
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            inStock: false,
            sortBy: 'popularity'
        });
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] py-4">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-4 items-start">

                    {/* Left Side: Flipkart Sidebar Filters */}
                    <div className="hidden lg:block w-[280px] bg-white shadow-sm shrink-0 rounded-sm">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-black uppercase tracking-tight">Filters</h2>
                            {(filters.category || filters.minPrice) && (
                                <button onClick={clearFilters} className="text-[#2874f0] text-[10px] font-black uppercase">Clear All</button>
                            )}
                        </div>

                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-[12px] font-black uppercase text-gray-900 mb-4 tracking-wider leading-relaxed">Categories</h3>
                            <div className="space-y-3">
                                {categories.map(cat => (
                                    <Link
                                        key={cat}
                                        to={`/products?category=${cat}`}
                                        className={`block text-sm font-medium ${filters.category === cat ? 'text-[#2874f0]' : 'text-gray-600 hover:text-[#2874f0]'}`}
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-[12px] font-black uppercase text-gray-900 mb-4 tracking-wider">Price</h3>
                            <div className="flex items-center gap-2">
                                <select className="flex-1 bg-white border border-gray-200 text-xs py-1 px-2 rounded-sm outline-none">
                                    <option>Min</option>
                                    <option>₹500</option>
                                    <option>₹1000</option>
                                </select>
                                <span className="text-gray-400 text-xs">to</span>
                                <select className="flex-1 bg-white border border-gray-200 text-xs py-1 px-2 rounded-sm outline-none">
                                    <option>₹2000+</option>
                                    <option>₹1000</option>
                                    <option>₹500</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="text-[12px] font-black uppercase text-gray-900 mb-4 tracking-wider leading-relaxed">Ratings</h3>
                            <div className="space-y-2">
                                {[4, 3, 2].map(r => (
                                    <label key={r} className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 checked:bg-[#2874f0]" />
                                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1 group-hover:text-[#2874f0]">
                                            {r} <Star className="w-3 h-3 fill-current" /> & Above
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Product Listing */}
                    <div className="flex-1 w-full bg-white shadow-sm rounded-sm overflow-hidden">
                        {/* Dynamic Promotional Banner */}
                        <div className="bg-gradient-to-r from-[#2874f0] to-[#1259d3] p-4 flex items-center justify-between text-white overflow-hidden relative">
                            <div className="z-10 flex items-center gap-4">
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm animate-pulse">
                                    <Sparkles className="w-5 h-5 text-[#ffe500] fill-[#ffe500]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Farmer's Choice</p>
                                    <h4 className="font-black text-lg italic leading-none">UP TO 40% OFF ON SEEDS</h4>
                                </div>
                            </div>
                            <div className="hidden md:flex flex-col items-end z-10">
                                <p className="text-[8px] font-black uppercase tracking-tighter bg-white/10 px-2 py-0.5 rounded-sm mb-1">Limited Period Offer</p>
                                <button className="text-[10px] font-black uppercase bg-[#ffe500] text-gray-900 px-4 py-1 rounded-sm shadow-xl">Shop Collection</button>
                            </div>
                            <Sparkles className="w-24 h-24 absolute right-[-10px] top-[-10px] text-white/5 rotate-12" />
                        </div>

                        {/* Header & Sorting */}
                        <div className="p-4 border-b border-gray-100 pb-0">
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold uppercase mb-2 tracking-tight">
                                <Link to="/">Home</Link> <ChevronDown className="w-3 h-3 rotate-[-90deg] pt-0.5" />
                                <span className="text-gray-900">All Products</span>
                            </div>
                            <h1 className="text-lg font-medium text-gray-900 mb-4">
                                {searchParams.get('search') ? `Search results for "${searchParams.get('search')}"` : 'Fertilizers and Supplements'}
                                <span className="ml-2 text-xs font-bold text-gray-400">({products.length} items)</span>
                            </h1>

                            <div className="flex gap-6 border-b border-gray-100 overflow-x-auto scrollbar-hide">
                                <span className="text-sm font-black text-gray-900 shrink-0 pb-2">Sort By</span>
                                {[
                                    { label: 'Popularity', id: 'popularity' },
                                    { label: 'Price -- Low to High', id: 'priceLow' },
                                    { label: 'Price -- High to Low', id: 'priceHigh' },
                                    { label: 'Newest First', id: 'newest' }
                                ].map(sort => (
                                    <button
                                        key={sort.id}
                                        onClick={() => handleSort(sort.id)}
                                        className={`text-sm py-2 px-1 border-b-2 transition-all shrink-0 font-medium ${filters.sortBy === sort.id ? 'border-[#2874f0] text-[#2874f0] font-black' : 'border-transparent text-gray-600 hover:text-[#2874f0]'}`}
                                    >
                                        {sort.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Results */}
                        {loading ? (
                            <div className="p-20 flex items-center justify-center">
                                <Loader className="w-10 h-10 text-[#2874f0] animate-spin" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 divide-x divide-y divide-gray-100">
                                {products.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}

                                {products.length === 0 && (
                                    <div className="col-span-full p-20 text-center">
                                        <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/error-no-search-results_2353c5.png" className="w-48 mx-auto mb-6" alt="No results" />
                                        <h3 className="text-xl font-black uppercase text-gray-400">No matching products</h3>
                                        <p className="text-gray-500 mt-2">Try checking your spelling or use more general terms</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Products;
