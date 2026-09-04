import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight, ShieldCheck } from 'lucide-react';
import Toast from '../components/Toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, requestLoginOtp, loginWithOtp } = useAuth();
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpInfo, setOtpInfo] = useState('');
  const [error, setError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [otpRequestLoading, setOtpRequestLoading] = useState(false);
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    if (email) {
      setForm((prev) => ({ ...prev, email }));
    }
  }, [location.search]);

  const getPostLoginPath = (role) => {
    const params = new URLSearchParams(location.search);
    const redirect = params.get('redirect');
    if (redirect && redirect.startsWith('/')) return redirect;
    return role === 'admin' ? '/admin' : '/products';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordLoading(true);
    const result = await login(form.email, form.password);
    setPasswordLoading(false);
    if (!result.success) return setError(result.message);
    navigate(getPostLoginPath(result.user?.role), { replace: true });
  };

  const onRequestOtp = async () => {
    setError('');
    setOtpInfo('');

    if (!form.email.trim()) {
      setError('Please enter your email address first.');
      return;
    }

    setOtpRequestLoading(true);
    const result = await requestLoginOtp(form.email.trim());
    setOtpRequestLoading(false);
    if (!result.success) {
      setOtpSent(false);
      setOtp('');
      return setError(result.message);
    }

    setOtpSent(true);
    const info = result.devOtp
      ? `${result.message} (Dev OTP: ${result.devOtp})`
      : result.message;
    setOtpInfo(info);
  };

  const onLoginWithOtp = async () => {
    setError('');
    if (!otpSent) {
      setError('Please request OTP first.');
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter a valid 6-digit OTP.');
      return;
    }

    setOtpVerifyLoading(true);
    const result = await loginWithOtp(form.email.trim(), otp);
    setOtpVerifyLoading(false);
    if (!result.success) return setError(result.message);
    navigate(getPostLoginPath(result.user?.role), { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F382C] via-[#09251D] to-[#041611] flex items-center justify-center p-4 sm:p-6">
      {error && <Toast type="error" message={error} onClose={() => setError('')} />}

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
                Welcome Back to Better Farming.
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Log in to view saved crop orders, track active shipments, and access personalized AI farm advice.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-emerald-900/60 relative z-10 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>100% Certified Manufacturers</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Need assistance? Call toll free: 1800-AGRI-STORE
            </p>
          </div>
        </div>

        {/* Right Side Form (7 Cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 bg-white flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Enter credentials or request an OTP to continue</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  required
                  className="input-field pl-10"
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={onRequestOtp}
                  className="text-[11px] font-bold text-agri-green hover:underline"
                >
                  Login via OTP instead
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  required={!otpSent}
                  className="input-field pl-10 pr-10"
                />
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={passwordLoading || otpRequestLoading || otpVerifyLoading}
              className="btn-primary w-full text-sm py-3.5 mt-2"
            >
              {passwordLoading ? 'Signing In...' : 'Sign In with Password'}
            </button>
          </form>

          {/* OTP Flow Section */}
          {otpInfo && (
            <p className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-3 font-semibold">
              {otpInfo}
            </p>
          )}

          {otpSent && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 animate-fade-in">
              <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
                Enter 6-Digit OTP
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="input-field flex-1 font-mono tracking-widest text-center"
                />
                <button
                  type="button"
                  onClick={onLoginWithOtp}
                  disabled={otpVerifyLoading}
                  className="btn-accent text-xs px-6 py-2.5"
                >
                  {otpVerifyLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>
            </div>
          )}

          {/* Footer Register Link */}
          <p className="text-xs text-center text-slate-500 font-medium pt-2 border-t border-slate-100">
            Don't have an AgriStore account?{' '}
            <Link to="/register" className="font-extrabold text-agri-forest hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
