import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RefreshCw, X, ArrowUpDown, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import Toast from '../components/Toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const categoriesList = [
  'All',
  'Seeds',
  'Organic',
  'Fertilizer',
  'Pesticide',
  'Bio-Fertilizer',
  'Equipment',
  'Chemical',
  'Irrigation'
];

const sortOptions = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Newest Arrivals', value: 'newest' }
];

const Products = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'popularity';
  const inStock = searchParams.get('inStock') || 'false';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const page = parseInt(searchParams.get('page')) || 1;

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
    const load = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        if (search) {
          const { data } = await api.get('/products/search', { params: { query: search } });
          setProducts(data.products || []);
          setPagination({ total: data.products?.length || 0, page: 1, pages: 1 });
        } else {
          const { data } = await api.get('/products', {
            params: {
              category: category || undefined,
              minPrice: minPrice || undefined,
              maxPrice: maxPrice || undefined,
              inStock,
              sort: sort === 'popularity' ? undefined : sort,
              page,
              limit: 12
            }
          });
          setProducts(data.products || []);
          setPagination(data.pagination || { total: 0, page: 1, pages: 1 });
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category, search, minPrice, maxPrice, inStock, sort, page]);

  useEffect(() => {
    loadWishlistIds();
  }, [isAuthenticated]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'All' || value === 'false') next.delete(key);
    else next.set(key, value);

    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(category || search || minPrice || maxPrice || inStock === 'true');

  return (
    <div className="page-container py-4 sm:py-8 space-y-4 sm:space-y-8">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F382C] to-[#09251D] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 relative overflow-hidden shadow-lg">
        <div className="relative z-10 space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-extrabold text-emerald-400 tracking-wider uppercase">
            <Link to="/" className="hover:underline">HOME</Link>
            <span>/</span>
            <span>MARKETPLACE</span>
          </div>
          <h1 className="text-xl sm:text-4xl font-black tracking-tight">
            {search ? `Search Results` : category ? `${category} Products` : `Agri Marketplace`}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            {search
              ? `Showing matched results for "${search}"`
              : `Explore ${pagination.total} certified agricultural inputs.`}
          </p>
        </div>
      </div>

      {/* Category Strip Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
        {categoriesList.map((cat) => {
          const active = (category || 'All') === cat;
          return (
            <button
              key={cat}
              onClick={() => updateParam('category', cat)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                active
                  ? 'bg-agri-forest text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Mobile Controls Row: Filter & Sort */}
      <div className="flex lg:hidden items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all min-h-[44px]"
        >
          <SlidersHorizontal size={16} className="text-agri-forest" />
          <span>Filter</span>
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-agri-gold" />}
        </button>

        <button
          type="button"
          onClick={() => setMobileSortOpen(true)}
          className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all min-h-[44px]"
        >
          <ArrowUpDown size={16} className="text-agri-forest" />
          <span>Sort</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filter */}
        <aside className="hidden lg:block lg:col-span-3 card p-6 sticky top-28 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="font-black text-lg text-slate-900 flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-agri-green" /> Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <RefreshCw size={12} /> Clear all
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Category</label>
            <div className="space-y-1">
              {categoriesList.map((cat) => {
                const active = (category || 'All') === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => updateParam('category', cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      active
                        ? 'bg-emerald-50 text-agri-forest font-extrabold border-l-4 border-agri-green'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="input-field py-2 text-xs"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="input-field py-2 text-xs"
              />
            </div>
          </div>

          {/* Stock */}
          <div className="pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock === 'true'}
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : 'false')}
                className="w-4 h-4 rounded text-agri-green focus:ring-agri-green"
              />
              <span className="text-xs font-bold text-slate-700">In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-9 space-y-4 sm:space-y-6">
          {/* Desktop Top Sort & Count Bar */}
          <div className="hidden lg:flex card p-4 items-center justify-between gap-4">
            <p className="text-xs font-bold text-slate-600">
              Showing <span className="text-slate-900 font-extrabold">{products.length}</span> of{' '}
              <span className="text-slate-900 font-extrabold">{pagination.total}</span> products
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="input-field py-2 px-3 text-xs font-bold bg-slate-50 cursor-pointer max-w-[180px]"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile Product Count Bar */}
          <div className="lg:hidden flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Showing {products.length} of {pagination.total} products</span>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-rose-600 font-bold hover:underline">
                Clear filters
              </button>
            )}
          </div>

          {/* Active Search / Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <span className="text-slate-400">Active:</span>
              {search && (
                <span className="bg-slate-100 border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  "{search}" <X size={12} className="cursor-pointer" onClick={() => updateParam('search', '')} />
                </span>
              )}
              {category && category !== 'All' && (
                <span className="bg-slate-100 border border-slate-200 text-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1">
                  {category} <X size={12} className="cursor-pointer" onClick={() => updateParam('category', '')} />
                </span>
              )}
            </div>
          )}

          {/* Grid or Skeletons or Empty State */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <ProductCardSkeleton key={n} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="card p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto my-6 sm:my-8">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full grid place-items-center mx-auto">
                <Search size={32} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">No Products Found</h3>
              <p className="text-xs text-slate-500 font-medium">
                {search
                  ? `We couldn't find any products matching "${search}".`
                  : `No products match your selected category or price filters.`}
              </p>
              <button onClick={clearAllFilters} className="btn-accent text-xs px-6 py-2.5 mx-auto">
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* 2-column mobile, 3-column tablet, 4-column desktop grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={{ ...product, isWishlisted: wishlistIds.has(product._id) }}
                    onWishlistChange={loadWishlistIds}
                    onAddToCartToast={(msg) => setToastMessage(msg)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-6 sm:pt-8 border-t border-slate-200">
                  <button
                    disabled={page <= 1}
                    onClick={() => updateParam('page', page - 1)}
                    className="btn-secondary text-xs py-2.5 px-4 disabled:opacity-40 min-h-[44px]"
                  >
                    Previous
                  </button>
                  <span className="text-xs font-black text-slate-600 px-2">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    disabled={page >= pagination.pages}
                    onClick={() => updateParam('page', page + 1)}
                    className="btn-secondary text-xs py-2.5 px-4 disabled:opacity-40 min-h-[44px]"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-5 space-y-5 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-black text-base text-slate-900">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-2 text-slate-400 min-h-[44px]">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase">Categories</label>
                <div className="space-y-1">
                  {categoriesList.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => updateParam('category', cat)}
                      className={`w-full text-left px-3 py-2.5 text-xs font-bold rounded-xl transition-colors ${
                        (category || 'All') === cat ? 'bg-agri-forest text-white' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2 pt-3 border-t">
                <label className="text-xs font-extrabold text-slate-400 uppercase">Price Range (₹)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateParam('minPrice', e.target.value)}
                    className="input-field py-2 text-xs"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateParam('maxPrice', e.target.value)}
                    className="input-field py-2 text-xs"
                  />
                </div>
              </div>

              {/* In Stock */}
              <div className="pt-3 border-t">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock === 'true'}
                    onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : 'false')}
                    className="w-4 h-4 rounded text-agri-green"
                  />
                  <span className="text-xs font-bold text-slate-700">In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button
                type="button"
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="btn-secondary text-xs py-3 flex-1"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="btn-accent text-xs py-3 flex-1"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sort Bottom Sheet */}
      {mobileSortOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end lg:hidden">
          <div className="w-full bg-white rounded-t-3xl p-5 space-y-4 max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-black text-base text-slate-900">Sort By</h3>
              <button onClick={() => setMobileSortOpen(false)} className="p-2 text-slate-400 min-h-[44px]">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-1">
              {sortOptions.map((opt) => {
                const active = sort === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      updateParam('sort', opt.value);
                      setMobileSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                      active ? 'bg-emerald-50 text-agri-forest font-extrabold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {active && <Check size={16} className="text-agri-forest" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
