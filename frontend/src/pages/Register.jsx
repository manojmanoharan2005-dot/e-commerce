import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import locationsData from '../data/locations.json';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        state: '',
        district: '',
        pincode: '',
        taluk: ''
    });
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [districts, setDistricts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [derivedLocation, setDerivedLocation] = useState('');
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

    const fetchLocationByPincode = async (pincode) => {
        if (pincode.length !== 6) return;

        setPincodeLoading(true);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data[0].Status === 'Success') {
                const postOffices = data[0].PostOffice;

                // Optimized Taluk/Town Detection:
                // 1. Find the official "Sub Post Office" (this is almost always the Taluk head)
                const subOffice = postOffices.find(po => po.BranchType === 'Sub Post Office');

                // 2. If we found a Sub Post Office, use its Name as the Taluk.
                // 3. Otherwise, use the Block (but only if it's not the same as the District)
                // 4. Final fallback to the Name of the first entry
                let taluk = '';
                if (subOffice) {
                    taluk = subOffice.Name;
                } else {
                    const first = postOffices[0];
                    taluk = (first.Block && first.Block !== first.District) ? first.Block : first.Name;
                }

                const { State, District } = postOffices[0];

                setFormData(prev => ({
                    ...prev,
                    state: State,
                    district: District,
                    taluk: taluk
                }));

                // Update districts list for the dropdown
                const stateObj = locationsData.states.find(s => s.state === State);
                setDistricts(stateObj ? stateObj.districts : [District]);
            } else {
                setDerivedLocation('Invalid Pincode');
            }
        } catch (err) {
            console.error('Pincode fetch error:', err);
        } finally {
            setPincodeLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'state') {
            const stateObj = locationsData.states.find(s => s.state === value);
            setDistricts(stateObj ? stateObj.districts : []);
            setFormData(prev => ({ ...prev, state: value, district: '' }));
        }

        if (name === 'pincode' && value.length === 6) {
            fetchLocationByPincode(value);
        } else if (name === 'pincode') {
            setDerivedLocation('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const registrationData = {
            ...formData,
            address: {
                state: formData.state,
                district: formData.district,
                pincode: formData.pincode
            }
        };

        const result = await register(registrationData);

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

                {/* Left Side: Green Panel */}
                <div className="hidden md:flex w-2/5 bg-[#2e7d32] p-10 flex-col justify-between text-white">
                    <div>
                        <h2 className="text-[28px] font-black leading-tight mb-4 tracking-tight">Looks like you're new here!</h2>
                        <p className="text-[18px] text-[#dbdbdb] leading-relaxed">
                            Sign up with your details to get started
                        </p>
                    </div>
                    <img
                        src="/images/login_agri.png"
                        alt="Register illustration"
                        className="w-full h-auto mb-4 rounded shadow-lg"
                    />
                </div>

                {/* Right Side: Register Form */}
                <div className="flex-1 p-10 flex flex-col justify-between">
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative border-b border-gray-300 focus-within:border-[#2e7d32] group transition-all">
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

                            <div className="relative border-b border-gray-300 focus-within:border-[#2e7d32] group transition-all">
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

                            <div className="relative border-b border-gray-300 focus-within:border-[#2e7d32] group transition-all">
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

                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative border-b border-gray-300 focus-within:border-[#2e7d32] group transition-all">
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

                                <div className="relative border-b border-gray-300 focus-within:border-[#2e7d32] group transition-all">
                                    <input
                                        type="text"
                                        name="pincode"
                                        required
                                        maxLength={6}
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className="w-full py-2 bg-transparent focus:outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                                        placeholder="Enter Pincode"
                                    />
                                    {pincodeLoading && (
                                        <div className="absolute right-0 bottom-2">
                                            <Loader className="w-3 h-3 animate-spin text-[#2e7d32]" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative border-b border-gray-300 focus-within:border-[#2e7d32] group transition-all">
                                    <input
                                        type="text"
                                        name="taluk"
                                        readOnly
                                        value={formData.taluk}
                                        className="w-full py-2 bg-transparent focus:outline-none transition-all placeholder:text-gray-400 text-sm font-black italic text-[#2e7d32]"
                                        placeholder="Taluk"
                                    />
                                </div>

                                <div className="relative border-b border-gray-300 focus-within:border-[#2e7d32] group transition-all">
                                    <select
                                        name="district"
                                        required
                                        value={formData.district}
                                        onChange={handleChange}
                                        disabled={!formData.state}
                                        className="w-full py-2 bg-transparent focus:outline-none transition-all text-sm font-medium text-gray-700 cursor-pointer disabled:opacity-50"
                                    >
                                        <option value="">Select District</option>
                                        {districts.map((d, i) => (
                                            <option key={i} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="relative border-b border-gray-300 focus-within:border-[#2e7d32] group transition-all">
                                <select
                                    name="state"
                                    required
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full py-2 bg-transparent focus:outline-none transition-all text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                    <option value="">Select State</option>
                                    {locationsData.states.map((s, i) => (
                                        <option key={i} value={s.state}>{s.state}</option>
                                    ))}
                                </select>
                            </div>


                            {error && (
                                <p className="text-red-500 text-xs font-bold uppercase tracking-tight">{error}</p>
                            )}

                            <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                                By continuing, you agree to FertilizerMart's <span className="text-[#2e7d32] cursor-pointer">Terms of Use</span> and <span className="text-[#2e7d32] cursor-pointer">Privacy Policy</span>.
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
                        <Link to="/login" className="w-full bg-white text-[#2e7d32] py-4 rounded-sm font-black uppercase text-sm shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] border border-gray-100 hover:shadow-md transition-all text-center block tracking-tight">
                            Existing User? Log in
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Register;
