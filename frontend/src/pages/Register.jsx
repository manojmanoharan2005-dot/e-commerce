import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, User, Mail, Phone, Lock, Eye, EyeOff, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import Toast from '../components/Toast';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    pincode: '',
    district: '',
    state: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [postalError, setPostalError] = useState('');
  const [postalLoading, setPostalLoading] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);

  const passwordMatches = form.password && form.confirmPassword && form.password === form.confirmPassword;
  const passwordCriteriaMet = form.password.length >= 8 && /\d/.test(form.password);

  const fetchPostalDetails = async (pincode) => {
    if (!/^\d{6}$/.test(pincode)) return;

    setPostalLoading(true);
    setPostalError('');
    try {
      const { data } = await api.get(`/auth/pincode/${pincode}`);
      setForm((prev) => ({
        ...prev,
        district: data?.district || '',
        state: data?.state || ''
      }));
    } catch {
      try {
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const raw = await response.json();
        const result = raw?.[0];
        const postOffice = result?.PostOffice?.[0];
        if (result?.Status === 'Success' && postOffice) {
          setForm((prev) => ({
            ...prev,
            district: postOffice.District || '',
            state: postOffice.State || ''
          }));
          return;
        }
      } catch {
        // Fallback
      }
      setPostalError('Pincode lookup offline. Please fill district & state manually.');
    } finally {
      setPostalLoading(false);
    }
  };

  useEffect(() => {
    if (form.pincode.length === 6) {
      fetchPostalDetails(form.pincode);
    }
  }, [form.pincode]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanedPhone = form.phone.trim();
    if (!/^\d{10}$/.test(cleanedPhone)) {
      setError('Enter a valid 10-digit mobile phone number.');
      return;
    }

    if (!passwordCriteriaMet) {
      setError('Password must be at least 8 characters and contain at least 1 number.');
      return;
    }
    if (!passwordMatches) {
      setError('Passwords do not match.');
      return;
    }

    if (!form.district.trim() || !form.state.trim()) {
      setError('District and State are required.');
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: cleanedPhone,
      address: {
        district: form.district,
        city: form.district,
        state: form.state,
        pincode: form.pincode
      }
    };

    const result = await register(payload);
    if (!result.success) {
      return setError(result.message || 'Registration failed');
    }

    if (result.requiresVerification) {
      setVerificationMode(true);
      setToastMessage(result.message || 'Verification OTP sent to your email.');
      return;
    }

    navigate('/products');
  };

  const onVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setVerifying(true);
    try {
      const { data } = await api.post('/auth/register-verify', {
        email: form.email.toLowerCase(),
        otp
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/products';
    } catch (err) {
      setError(err?.response?.data?.message || 'Verification failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F382C] via-[#09251D] to-[#041611] flex items-center justify-center p-4 sm:p-6">
      {error && <Toast type="error" message={error} onClose={() => setError('')} />}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-12 border border-emerald-950">
        {/* Left Side Agriculture Branding (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0F382C] to-[#09251D] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <Link to="/" className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-emerald-500 text-slate-950 grid place-items-center font-bold">
                <Sprout size={22} />
              </span>
              <div>
                <span className="font-black text-2xl tracking-tight text-white block">AgriStore</span>
                <span className="text-[10px] font-extrabold tracking-[0.2em] text-emerald-400 block">PREMIUM QUALITY</span>
              </div>
            </Link>

            <div className="space-y-3 pt-6">
              <h2 className="text-3xl font-black leading-tight tracking-tight">
                Join India's Leading Agri Marketplace.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Create your account to order genuine seeds, fertilizers, and farm equipment with express doorstep delivery.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-900/60 relative z-10 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Direct Manufacturer Pricing</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Pan-India shipping • Guaranteed lab tested products
            </p>
          </div>
        </div>

        {/* Right Side Form (7 Cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 bg-white flex flex-col justify-center space-y-6">
          {verificationMode ? (
            <form onSubmit={onVerifyOtp} className="space-y-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900">Verify Email OTP</h1>
                <p className="text-xs text-slate-500 mt-1">
                  We've sent a 6-digit code to <strong>{form.email}</strong>
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="input-field font-mono text-center tracking-widest text-lg"
                  required
                />
                <button type="submit" disabled={verifying || otp.length !== 6} className="btn-accent w-full text-xs py-3.5">
                  {verifying ? 'Verifying Code...' : 'Verify & Complete Setup'}
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationMode(false)}
                  className="w-full text-center text-xs font-bold text-slate-500 hover:underline"
                >
                  Back to Registration
                </button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">Fill in your details to register as a farmer or buyer</p>
              </div>

              <form onSubmit={onSubmit} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <input
                      className="input-field"
                      placeholder="Full Name *"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      className="input-field"
                      type="email"
                      placeholder="Email Address *"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    className="input-field"
                    placeholder="10-Digit Mobile Number *"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    required
                  />
                  <input
                    className="input-field"
                    placeholder="Pincode *"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    className="input-field"
                    placeholder="District *"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    required
                  />
                  <input
                    className="input-field"
                    placeholder="State *"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Password (8+ chars) *"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Confirm Password *"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                {postalLoading && <p className="text-[11px] text-slate-400 font-bold">Auto-fetching district & state...</p>}
                {postalError && <p className="text-[11px] text-amber-600 font-medium">{postalError}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-accent w-full text-sm py-3.5 mt-2"
                >
                  {loading ? 'Creating Account...' : 'Register Account'}
                </button>
              </form>

              <p className="text-xs text-center text-slate-500 font-medium pt-2 border-t border-slate-100">
                Already registered on AgriStore?{' '}
                <Link to="/login" className="font-extrabold text-agri-forest hover:underline">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
