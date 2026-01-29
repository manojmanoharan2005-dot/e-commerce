import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'farmer'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            return;
        } else {
            setError(result.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#f1f3f6] flex items-center justify-center py-10 px-4">
            <div className="bg-white flex w-full max-w-[850px] min-h-[600px] rounded-sm overflow-hidden shadow-[0_2px_4px_0_rgba(0,0,0,.2)]">

                {/* Left Side: Blue Panel */}
                <div className="hidden md:flex w-2/5 bg-[#2874f0] p-10 flex-col justify-between text-white">
                    <div>
                        <h2 className="text-[28px] font-black leading-tight mb-4 tracking-tight">Looks like you're new here!</h2>
                        <p className="text-[18px] text-[#dbdbdb] leading-relaxed">
                            Sign up with your details to get started
                        </p>
                    </div>
                    <img
                        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
                        alt="Register illustration"
                        className="w-full h-auto mb-4"
                    />
                </div>

                {/* Right Side: Register Form */}
                <div className="flex-1 p-10 flex flex-col justify-between">
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] group transition-all">
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full py-2 bg-transparent focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                                    placeholder="Enter Full Name"
                                />
                            </div>

                            <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] group transition-all">
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full py-2 bg-transparent focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                                    placeholder="Enter Email Address"
                                />
                            </div>

                            <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] group transition-all">
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full py-2 bg-transparent focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                                    placeholder="Enter Mobile Number"
                                />
                            </div>

                            <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] group transition-all">
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={6}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full py-2 bg-transparent focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                                    placeholder="Set Password"
                                />
                            </div>

                            <div className="relative border-b border-gray-300 focus-within:border-[#2874f0] group transition-all">
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full py-2 bg-transparent focus:outline-none transition-all text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                    <option value="farmer">Register as Farmer</option>
                                    <option value="admin">Register as Admin</option>
                                </select>
                            </div>

                            {error && (
                                <p className="text-red-500 text-xs font-bold uppercase tracking-tight">{error}</p>
                            )}

                            <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                                By continuing, you agree to FertilizerMart's <span className="text-[#2874f0] cursor-pointer">Terms of Use</span> and <span className="text-[#2874f0] cursor-pointer">Privacy Policy</span>.
                            </p>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#fb641b] text-white py-4 rounded-sm font-black uppercase text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Continue'}
                            </button>
                        </form>
                    </div>

                    <div className="mt-8">
                        <Link to="/login" className="w-full bg-white text-[#2874f0] py-4 rounded-sm font-black uppercase text-sm shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] border border-gray-100 hover:shadow-md transition-all text-center block tracking-tight">
                            Existing User? Log in
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;
