import { useState, useEffect } from 'react';
import { getLocalProductImage } from '../utils/productImageMap';

/**
 * Local Fast Product Image Component
 * Serves optimized local project images and local category SVG visuals.
 * ZERO external network calls. Immediate rendering.
 */

const ProductImage = ({
  src,
  images,
  alt,
  productName,
  category,
  type,
  product,
  className = '',
  aspect = 'aspect-square'
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(true); // Default to true for instant local rendering

  const name = productName || alt || product?.name || '';
  const cat = category || type || product?.category || product?.type || '';

  // Get local image path from mapping system
  const localSrc = getLocalProductImage(product || { name, category: cat });

  useEffect(() => {
    setError(false);
    setLoaded(true);
  }, [src, name, cat]);

  return (
    <div
      className={`relative overflow-hidden bg-[#F8FAF8] border border-slate-200/60 rounded-2xl flex items-center justify-center p-2.5 sm:p-3.5 select-none ${aspect} ${className}`}
    >
      <img
        src={localSrc}
        alt={name || 'AgriStore Product'}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-contain max-h-full max-w-full transition-transform duration-300 group-hover:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-90'
        }`}
      />
    </div>
  );
};

export default ProductImage;
