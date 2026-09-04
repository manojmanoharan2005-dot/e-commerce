import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Truck, CreditCard, Award, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#09251D] text-slate-300 pt-16 pb-8 border-t border-emerald-950 mt-auto">
      <div className="page-container">
        {/* Value Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-emerald-900/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/50 border border-emerald-700/50 text-emerald-400 grid place-items-center shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">100% Genuine</p>
              <p className="text-xs text-slate-400">Direct from certified brands</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/50 border border-emerald-700/50 text-emerald-400 grid place-items-center shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Fast Doorstep Delivery</p>
              <p className="text-xs text-slate-400">Pan-India agri network</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/50 border border-emerald-700/50 text-emerald-400 grid place-items-center shrink-0">
              <CreditCard size={24} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Secure Payment</p>
              <p className="text-xs text-slate-400">Razorpay encrypted checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-900/50 border border-emerald-700/50 text-emerald-400 grid place-items-center shrink-0">
              <Award size={24} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Quality Checked</p>
              <p className="text-xs text-slate-400">Batch tested agricultural inputs</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-emerald-500 text-slate-950 grid place-items-center font-bold">
                <Sprout size={22} />
              </span>
              <div>
                <p className="font-black text-2xl tracking-tight text-white">AgriStore</p>
                <p className="text-[10px] font-extrabold tracking-[0.2em] text-emerald-400">PREMIUM QUALITY</p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering farmers across India with certified seeds, fertilizers, pesticides, equipment, and bio-inputs for higher yields and sustainable farming.
            </p>
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-400" />
                <span>AgriTech Hub, Sector 62, Noida, UP, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-emerald-400" />
                <span>+91 1800-AGRI-STORE (Toll Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-emerald-400" />
                <span>support@agristore.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-emerald-400">Quick Links</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/products?category=Seeds" className="hover:text-white transition-colors">Hybrid Seeds</Link></li>
              <li><Link to="/products?category=Organic" className="hover:text-white transition-colors">Bio Organic</Link></li>
              <li><Link to="/products?category=Equipment" className="hover:text-white transition-colors">Farm Equipment</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <p className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-emerald-400">Customer</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/profile" className="hover:text-white transition-colors">My Profile</Link></li>
              <li><Link to="/my-orders" className="hover:text-white transition-colors">Order History</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/addresses" className="hover:text-white transition-colors">Saved Addresses</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="text-white font-bold text-sm tracking-wider uppercase mb-4 text-emerald-400">Categories</p>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/products?category=Seeds" className="hover:text-white transition-colors">Seeds</Link></li>
              <li><Link to="/products?category=Fertilizer" className="hover:text-white transition-colors">Fertilizers</Link></li>
              <li><Link to="/products?category=Pesticide" className="hover:text-white transition-colors">Crop Protection</Link></li>
              <li><Link to="/products?category=Bio-Fertilizer" className="hover:text-white transition-colors">Bio-Inputs</Link></li>
              <li><Link to="/products?category=Chemical" className="hover:text-white transition-colors">Agri Chemicals</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AgriStore Inc. All rights reserved. Built for Indian Farmers.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Return Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
