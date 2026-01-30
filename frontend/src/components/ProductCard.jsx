import { Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Use real MRP if available, otherwise fallback to 1.2x
    const mrp = product.mrp || Math.floor(product.price * 1.2);
    const discount = Math.round(((mrp - product.price) / mrp) * 100);

    return (
        <Link
            to={`/products/${product._id}`}
            className="flex flex-col bg-white overflow-hidden group hover:shadow-xl transition-all duration-300 relative rounded-sm p-4 h-full border border-gray-50"
        >
            {/* Badges */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                {product.isTrending && (
                    <span className="bg-[#fb641b] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-sm shadow-sm flex items-center gap-1">
                        Trending
                    </span>
                )}
                {product.isFlashSale && (
                    <span className="bg-[#ff9f00] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-sm shadow-sm">
                        Hot Deal
                    </span>
                )}
            </div>

            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <ShieldCheck className="w-5 h-5 text-[#2e7d32] fill-white" />
            </div>

            <div className="relative aspect-[4/5] mb-4 overflow-hidden flex items-center justify-center p-2">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200?text=Product';
                    }}
                />

                {product.stock === 0 ? (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-sm rotate-[-10deg]">Out of Stock</span>
                    </div>
                ) : product.stock < 5 && (
                    <div className="absolute top-0 right-0">
                        <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase px-2 py-0.5 border border-red-100 rounded-sm">Only {product.stock} Left</span>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col items-start gap-1">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-relaxed h-[40px] group-hover:text-[#2e7d32]">
                    {product.name}
                </h3>

                <div className="flex items-center gap-2 mt-1">
                    <div className="bg-[#388e3c] text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 shadow-sm">
                        {product.rating || '4.2'} <Star className="w-2.5 h-2.5 fill-current" />
                    </div>
                    <span className="text-gray-400 text-xs font-black uppercase">({product.reviewCount || '85'})</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                    <p className="text-lg font-black text-gray-900 leading-none">₹{product.price}</p>
                    <p className="text-xs text-gray-400 line-through font-bold">₹{mrp}</p>
                    <p className="text-xs text-[#388e3c] font-black uppercase">{discount}% Off</p>
                </div>

                <div className="mt-2 flex items-center gap-1">
                    <img
                        src="/images/verified_badge.png"
                        alt="Verified"
                        className="h-4 w-auto"
                    />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Free Delivery</span>
                </div>
            </div>

            {/* Hover Action Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#2e7d32] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </Link>
    );
};

export default ProductCard;
