import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate(from === '/login' ? '/' : from);
            }
        }
    }, [isAuthenticated, user, navigate, from]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);

        if (result.success) {
            return;
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#f1f3f6] flex items-center justify-center py-10 px-4">
            <div className="bg-white flex w-full max-w-[850px] min-h-[520px] rounded-sm overflow-hidden shadow-[0_2px_4px_0_rgba(0,0,0,.2)]">

                {/* Left Side: Green Panel (Auth Branding) */}
                <div className="hidden md:flex w-2/5 bg-[#2e7d32] p-10 flex-col justify-between text-white">
                    <div>
                        <h2 className="text-[28px] font-black leading-tight mb-4">Login</h2>
                        <p className="text-[18px] text-[#dbdbdb] leading-relaxed">
                            Get access to your Orders, Wishlist and Recommendations
                        </p>
                    </div>
                    <img
                        src="/images/login_agri.png"
                        alt="Login illustration"
                        className="w-full h-auto mb-4 rounded shadow-lg"
                    />
                </div>

                {/* Right Side: Login Form */}
                <div className="flex-1 p-10 relative flex flex-col justify-between">
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="relative border-b border-gray-300 focus-within:border-[#2e7d32] group transition-all">
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full py-2 bg-transparent focus:outline-none transition-all placeholder:text-gray-400 text-sm"
                                    placeholder="Enter Email Address"
                                />
                            </div>

                            <div className="relative border-b border-gray-300 focus-within:border-[#2e7d32] group transition-all">
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full py-2 bg-transparent focus:outline-none transition-all placeholder:text-gray-400 text-sm"
                                    placeholder="Enter Password"
                                />
                            </div>

                            {error && (
                                <p className="text-red-500 text-xs font-bold uppercase tracking-tight">{error}</p>
                            )}

                            <p className="text-[12px] text-gray-400 font-medium">
                                By continuing, you agree to FertilizerMart's <span className="text-[#2e7d32] cursor-pointer">Terms of Use</span> and <span className="text-[#2e7d32] cursor-pointer">Privacy Policy</span>.
                            </p>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#fb641b] text-white py-4 rounded-sm font-black uppercase text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Login'}
                            </button>
                        </form>

                        <div className="mt-6 flex flex-col gap-4 text-center">
                            <div className="flex items-center gap-2">
                                <div className="h-[1px] bg-gray-200 flex-1"></div>
                                <span className="text-gray-300 text-sm font-medium">OR</span>
                                <div className="h-[1px] bg-gray-200 flex-1"></div>
                            </div>
                            <button className="w-full bg-white text-[#2e7d32] py-3 rounded-sm font-black uppercase text-sm shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] border border-gray-100 hover:shadow-md transition-all">
                                Request OTP
                            </button>
                        </div>
                        <div className="mt-auto">
                            <Link to="/register" className="text-[#2e7d32] text-sm font-black hover:underline block text-center mt-6 uppercase tracking-tight">
                                New to FertilizerMart? Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
