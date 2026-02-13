import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Loader, ChevronDown, Star, X, Sparkles, Box } from 'lucide-react';
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

    const categories = ['Organic', 'Seeds', 'Pesticide', 'Tools', 'Equipment'];

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
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Left Side: Modern Sticky Sidebar */}
                    <aside className="hidden lg:block w-72 shrink-0 sticky top-28">
                        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-slate-900 tracking-tight italic">Filters</h2>
                                {(filters.category || filters.minPrice) && (
                                    <button onClick={clearFilters} className="text-accent text-[10px] font-black uppercase tracking-widest hover:underline underline-offset-4">Reset</button>
                                )}
                            </div>

                            <div className="mb-0">
                                <h3 className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-[0.2em]">Collections</h3>
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <Link
                                            key={cat}
                                            to={`/products?category=${cat}`}
                                            className={`flex items-center justify-between group py-2 transition-all ${filters.category === cat ? 'text-primary' : 'text-slate-500 hover:text-primary'}`}
                                        >
                                            <span className={`text-sm font-bold ${filters.category === cat ? 'underline underline-offset-8 decoration-accent decoration-2' : ''}`}>{cat}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="my-10 h-px bg-slate-100"></div>

                            {/* Smart Agri-Advisor - AI Feature */}
                            <div className="bg-primary/5 rounded-3xl p-6 border border-accent/20">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-4 h-4 text-accent" />
                                    <h3 className="text-[11px] font-black uppercase text-primary tracking-widest">Farming Assistant</h3>
                                </div>
                                <p className="text-[10px] text-slate-500 font-medium leading-relaxed mb-4">Tell us your crop problems, and we'll suggest the best products.</p>

                                <div className="space-y-3">
                                    <textarea
                                        placeholder="e.g. Yellow leaves on tomato plants..."
                                        className="w-full bg-white border border-slate-100 rounded-xl p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none h-20 placeholder:text-slate-300"
                                    ></textarea>
                                    <button
                                        onClick={() => {
                                            const query = document.querySelector('textarea').value;
                                            if (query) setSearchParams({ search: query });
                                        }}
                                        className="w-full bg-primary text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-primary transition-all shadow-lg shadow-primary/10"
                                    >
                                        Search with AI
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right Side: Product Listing */}
                    <div className="flex-1 w-full space-y-8">

                        {/* Content Area */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 lg:p-12">
                            {/* Header & Sorting */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                                <div>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">
                                        <Link to="/">Home</Link> <span className="w-4 border-t border-slate-300 mx-1"></span>
                                        <span className="text-primary underline">Marketplace</span>
                                    </div>
                                    <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight italic">
                                        {searchParams.get('search') ? `Searching for "${searchParams.get('search')}"` : 'Marketplace'}
                                        <span className="ml-4 text-xs font-bold text-slate-400 normal-case opacity-60 font-sans tracking-normal bg-slate-50 px-3 py-1 rounded-full">Explore {products.length} Products</span>
                                    </h1>
                                </div>

                                <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100 overflow-x-auto scrollbar-hide">
                                    {[
                                        { label: 'Popular', id: 'popularity' },
                                        { label: 'Lowest Price', id: 'priceLow' },
                                        { label: 'Highest Price', id: 'priceHigh' },
                                        { label: 'Latest Arrivals', id: 'newest' }
                                    ].map(sort => (
                                        <button
                                            key={sort.id}
                                            onClick={() => handleSort(sort.id)}
                                            className={`text-[10px] font-black uppercase tracking-widest py-3 px-6 rounded-xl transition-all shrink-0 ${filters.sortBy === sort.id ? 'bg-white text-primary shadow-lg' : 'text-slate-400 hover:text-primary'}`}
                                        >
                                            {sort.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Results */}
                            {loading ? (
                                <div className="py-32 flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6"></div>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Products...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {products.map(product => (
                                        <ProductCard key={product._id} product={product} />
                                    ))}

                                    {products.length === 0 && (
                                        <div className="col-span-full py-32 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <X className="w-10 h-10 text-slate-300" />
                                            </div>
                                            <h3 className="text-xl font-black uppercase text-slate-400 tracking-widest">No products found</h3>
                                            <p className="text-slate-400 mt-2 font-medium">Try searching for something else or browse categories</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};


export default Products;
