import { Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, ShoppingCart } from 'lucide-react';
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
            className="group relative flex flex-col bg-white rounded-3xl p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 hover:border-transparent h-full"
        >
            {/* Image Container */}
            <div className="relative aspect-square mb-6 overflow-hidden rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors duration-500">
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-[80%] max-w-[80%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200?text=Product';
                    }}
                />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.isTrending && (
                        <span className="bg-primary/90 backdrop-blur-md text-accent text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg tracking-wider">
                            Trending
                        </span>
                    )}
                    {product.stock === 0 ? (
                        <span className="bg-red-500 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg tracking-wider">
                            Sold Out
                        </span>
                    ) : product.stock < 10 && (
                        <span className="bg-amber-500 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full shadow-lg tracking-wider">
                            Low Stock
                        </span>
                    )}
                </div>

                {/* Quick Add Button (Visual only) */}
                <div className="absolute bottom-3 right-3 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-xl shadow-primary/20">
                        <ShoppingCart className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1">
                <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{product.category}</p>
                    <div className="flex items-center gap-1 bg-accent/10 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3 text-accent fill-accent" />
                        <span className="text-[11px] font-bold text-accent">{product.rating || '4.5'}</span>
                    </div>
                </div>

                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-relaxed mb-4 group-hover:text-primary transition-colors flex-1">
                    {product.name}
                </h3>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-slate-900">₹{product.price}</span>
                        <span className="text-xs text-slate-400 line-through">₹{mrp}</span>
                    </div>
                    {discount > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-0.5 rounded-md">SAVE {discount}%</span>
                        </div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Ships in 24h</span>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-slate-300" />
                </div>
            </div>
        </Link>
    );
};


export default ProductCard;
