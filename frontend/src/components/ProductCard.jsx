import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import ProductImage from './ProductImage';

const ProductCard = ({ product, onWishlistChange, onAddToCartToast }) => {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [wishlisted, setWishlisted] = useState(Boolean(product?.isWishlisted || product?.wishlistItemId));
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setWishlisted(Boolean(product?.isWishlisted || product?.wishlistItemId));
  }, [product?._id, product?.isWishlisted, product?.wishlistItemId]);

  const discount = product?.mrp && product?.mrp > product?.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) return;

    const nextState = !wishlisted;
    setWishlisted(nextState);

    try {
      if (nextState) {
        await api.post('/wishlist', { productId: product._id });
      } else {
        await api.delete(`/wishlist/${product._id}`);
      }
      if (onWishlistChange) onWishlistChange();
    } catch {
      setWishlisted(!nextState);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product || product.stock === 0) return;

    setAdding(true);
    try {
      await addToCart(product, 1);
      setAdded(true);
      if (onAddToCartToast) onAddToCartToast(`${product.name} added to cart`);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const rawImage = product?.image || product?.imageUrl || product?.images || product?.imageURL || product?.thumbnail;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/5 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Product Image Area */}
      <Link to={`/products/${product._id}`} className="relative block aspect-square w-full p-2 sm:p-2.5">
        <ProductImage
          src={rawImage}
          images={product?.images}
          productName={product?.name}
          category={product?.category}
          type={product?.type}
          aspect="aspect-square"
          className="w-full h-full"
        />

        {/* Badges Top-Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product?.category && (
            <span className="bg-agri-forest/90 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg uppercase tracking-wider shadow-xs max-w-[90px] truncate">
              {product.category}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-amber-500 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md sm:rounded-lg shadow-xs w-max">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button Top-Right */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1 items-end">
          {isAuthenticated && (
            <button
              type="button"
              onClick={handleWishlist}
              title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={`p-2 rounded-full backdrop-blur-md shadow-xs transition-all duration-200 active:scale-90 min-h-[36px] min-w-[36px] flex items-center justify-center ${
                wishlisted
                  ? 'bg-rose-500 text-white shadow-rose-500/20'
                  : 'bg-white/90 hover:bg-white text-slate-500 hover:text-rose-500 border border-slate-200/60'
              }`}
            >
              <Heart size={15} className={wishlisted ? 'fill-current' : ''} />
            </button>
          )}

          {product?.stock === 0 && (
            <span className="bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
              Out of stock
            </span>
          )}
        </div>
      </Link>

      {/* Info Content */}
      <div className="p-3 sm:p-4 pt-1 sm:pt-2 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 mb-1 sm:mb-2">
            <div className="flex items-center gap-0.5 sm:gap-1 bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded-md border border-amber-200/60 text-[10px] sm:text-xs">
              <Star size={11} className="fill-amber-500 text-amber-500" />
              <span>{(product?.rating || 4.5).toFixed(1)}</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium">({product?.reviewCount || product?.numReviews || 12})</span>
          </div>

          {/* Product Title (2-line clamped) */}
          <Link
            to={`/products/${product._id}`}
            className="font-bold text-slate-900 group-hover:text-agri-forest line-clamp-2 text-xs sm:text-sm leading-snug transition-colors min-h-[2.4rem]"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
          <div className="overflow-hidden">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-agri-forest">₹{product.price}</span>
              {product.mrp && product.mrp > product.price && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">₹{product.mrp}</span>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] font-bold text-emerald-600 truncate">✓ In Stock</p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className={`p-2 sm:p-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shrink-0 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] ${
              added
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-agri-forest hover:bg-agri-forest-dark text-white active:scale-95 disabled:opacity-40 disabled:pointer-events-none'
            }`}
            title="Add to cart"
          >
            {added ? <Check size={16} /> : <ShoppingBag size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
