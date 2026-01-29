import { useState } from 'react';
import UserSidebar from '../components/UserSidebar';
import { Heart, Trash2, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const { addToCart } = useCart();
    // Reimagined placeholder data to match the new high-fidelity UI
    const [wishlist, setWishlist] = useState([
        {
            _id: 'w1',
            name: 'Organic Neem Fertilizer - 100% Pure & Natural',
            price: 750,
            originalPrice: 999,
            imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=1974&auto=format&fit=crop',
            rating: 4.5,
            reviews: 1250,
            category: 'Organic'
        },
        {
            _id: 'w2',
            name: 'Premium NPK Soluble Fertilizer (19:19:19)',
            price: 1250,
            originalPrice: 1500,
            imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=2173&auto=format&fit=crop',
            rating: 4.8,
            reviews: 840,
            category: 'Chemical'
        }
    ]);

    const removeFromWishlist = (id) => {
        setWishlist(wishlist.filter(item => item._id !== id));
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] py-4">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-4 items-start">

                    {/* Sidebar */}
                    <div className="lg:w-72 shrink-0 w-full">
                        <UserSidebar />
                    </div>

                    {/* Wishlist Content */}
                    <div className="flex-1 w-full bg-white shadow-sm rounded-sm">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight">My Wishlist ({wishlist.length})</h1>
                        </div>

                        {wishlist.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {wishlist.map((item) => (
                                    <div key={item._id} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-gray-50 transition-all relative group">
                                        <div className="w-32 h-32 shrink-0 mx-auto md:mx-0">
                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-gray-900 font-medium text-lg leading-tight group-hover:text-[#2874f0] transition-colors">
                                                {item.name}
                                            </h3>

                                            <div className="flex items-center gap-3">
                                                <div className="bg-[#388e3c] text-white text-[12px] font-black px-2 py-0.5 rounded-sm flex items-center gap-1">
                                                    {item.rating} <Star className="w-3 h-3 fill-current" />
                                                </div>
                                                <span className="text-gray-400 font-black text-sm uppercase">({item.reviews} Ratings)</span>
                                            </div>

                                            <div className="flex items-baseline gap-3 pt-2">
                                                <span className="text-xl font-black text-gray-900">₹{item.price}</span>
                                                <span className="text-sm text-gray-400 font-bold line-through">₹{item.originalPrice}</span>
                                                <span className="text-sm text-[#388e3c] font-black">
                                                    {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" className="h-4" alt="Assured" />
                                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">FertilizerMart Assured</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 border-l border-gray-100 pl-6 min-w-[120px] justify-center items-end">
                                            <button
                                                onClick={() => removeFromWishlist(item._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                title="Remove from Wishlist"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => addToCart(item)}
                                                className="bg-[#2874f0] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all"
                                                title="Add to Cart"
                                            >
                                                <ShoppingBag className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center flex flex-col items-center">
                                <div className="w-48 h-48 mb-8">
                                    <img
                                        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a4.png"
                                        alt="Empty Wishlist"
                                        className="w-full h-full object-contain opacity-50"
                                    />
                                </div>
                                <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Your Wishlist is Empty</h3>
                                <p className="text-gray-500 mt-2 mb-8 font-medium italic">Add items that you'd like to buy later!</p>
                                <Link to="/products" className="bg-[#2874f0] text-white px-12 py-3 rounded-sm font-black uppercase text-sm shadow-xl hover:shadow-[#2874f0]/20 transition-all">
                                    Discover Products
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Wishlist;
