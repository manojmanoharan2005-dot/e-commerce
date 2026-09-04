import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import UserSidebar from '../components/UserSidebar';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/Skeleton';
import Toast from '../components/Toast';
import api from '../utils/api';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/wishlist');
      setWishlist(data.wishlist || []);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="page-container py-8 space-y-8">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar (4 Cols) */}
        <div className="lg:col-span-4">
          <UserSidebar />
        </div>

        {/* Wishlist Main View (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="card p-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Wishlist</h1>
              <p className="text-xs text-slate-500 font-medium">{wishlist.length} saved products</p>
            </div>
            <Link to="/products" className="text-xs font-extrabold text-agri-green hover:underline">
              Explore Products →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((n) => (
                <ProductCardSkeleton key={n} />
              ))}
            </div>
          ) : wishlist.length === 0 ? (
            <div className="card p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full grid place-items-center mx-auto">
                <Heart size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our catalog and save your favorite seeds, fertilizers, and tools for future purchases.
              </p>
              <Link to="/products" className="btn-accent text-xs px-6 py-2.5 inline-flex items-center gap-2">
                Explore Marketplace <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {wishlist.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{ ...product, isWishlisted: true }}
                  onWishlistChange={load}
                  onAddToCartToast={(msg) => setToastMessage(msg)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
