import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [passwordForm, setPasswordForm] = useState({ otp: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const requestOtp = async () => {
    setError('');
    setMsg('');
    setOtpVerified(false);
    try {
      setLoading(true);
      const { data } = await api.post('/auth/request-password-otp');
      setOtpRequested(true);
      const info = data.devOtp ? `${data.message} Dev OTP: ${data.devOtp}` : data.message;
      setMsg(info || 'OTP sent to your email');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not request OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError('');
    setMsg('');
    if (!/^\d{6}$/.test(passwordForm.otp)) {
      setError('Enter a valid 6-digit OTP');
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post('/auth/verify-password-otp', { otp: passwordForm.otp });
      setOtpVerified(true);
      setMsg(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');

    if (!otpVerified) {
      setError('Please verify the OTP first');
      return;
    }
    if (passwordForm.newPassword.length < 8 || !/\d/.test(passwordForm.newPassword)) {
      setError('New password must be at least 8 characters and contain at least 1 number');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/auth/change-password-otp', passwordForm);
      setPasswordForm({ otp: '', newPassword: '' });
      setOtpVerified(false);
      setOtpRequested(false);
      setMsg(data.message || 'Password updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm('Delete your account permanently?')) return;
    await api.delete('/auth/account');
    logout();
    navigate('/register');
  };

  return (
    <div className="page-container py-8 grid lg:grid-cols-[320px_1fr] gap-6 items-start">
      <UserSidebar />

      <div className="space-y-5">
        <div className="card p-8 md:p-10">
          <p className="text-xs tracking-[0.18em] font-extrabold text-slate-400">ACCOUNT</p>
          <h1 className="text-[3rem] font-black leading-none text-slate-800 mt-2 mb-7">Settings</h1>

          <h2 className="font-black text-slate-700 tracking-wide mb-4 text-sm">SECURE PASSWORD RESET</h2>

          {msg && <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-xl mb-4">{msg}</p>}
          {error && <p className="text-sm text-rose-600 bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl mb-4">{error}</p>}

          <div className="space-y-6">
            {!otpRequested ? (
              <button
                type="button"
                onClick={requestOtp}
                disabled={loading}
                className="btn-outline w-full sm:w-auto py-3 px-8 rounded-2xl text-xs font-black tracking-[0.12em]"
              >
                {loading ? 'REQUESTING...' : 'REQUEST OTP FOR PASSWORD RESET'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-end">
                  <div className="flex-1 w-full">
                    <p className="text-[10px] font-black text-slate-400 mb-2 tracking-widest uppercase">Verification Code</p>
                    <input 
                      className={`input-field ${otpVerified ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : ''}`} 
                      placeholder="Enter 6-digit OTP" 
                      value={passwordForm.otp} 
                      disabled={otpVerified || loading}
                      onChange={(e) => setPasswordForm(v => ({ ...v, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))} 
                    />
                  </div>
                  {!otpVerified && (
                    <button 
                      type="button" 
                      onClick={verifyOtp} 
                      disabled={loading || passwordForm.otp.length < 6}
                      className="btn-secondary py-3.5 px-10 rounded-xl text-xs font-black tracking-widest h-[48px]"
                    >
                      {loading ? 'VERIFYING...' : 'VERIFY CODE'}
                    </button>
                  )}
                </div>

                {otpVerified && (
                  <form onSubmit={updatePassword} className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-2 tracking-widest uppercase">New Secure Password</p>
                      <div className="relative">
                        <input 
                          className="input-field" 
                          type="password" 
                          placeholder="Min. 8 characters + 1 number" 
                          value={passwordForm.newPassword} 
                          onChange={(e) => setPasswordForm(v => ({ ...v, newPassword: e.target.value }))} 
                        />
                        {passwordForm.newPassword && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {passwordForm.newPassword.length >= 8 && /\d/.test(passwordForm.newPassword) ? (
                              <span className="text-emerald-500 text-[10px] font-black tracking-widest uppercase">Strong</span>
                            ) : (
                              <span className="text-orange-400 text-[10px] font-black tracking-widest uppercase italic">Weak</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button 
                      disabled={loading || passwordForm.newPassword.length < 8 || !/\d/.test(passwordForm.newPassword)} 
                      className="btn-primary w-full py-4 rounded-xl text-xs font-black tracking-widest"
                    >
                      {loading ? 'UPDATING...' : 'CONFIRM NEW PASSWORD'}
                    </button>
                  </form>
                )}

                <button 
                  type="button" 
                  onClick={requestOtp} 
                  className="text-[10px] font-black text-slate-400 hover:text-slate-600 tracking-widest uppercase"
                >
                  Resend OTP?
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="card p-8 border-rose-200 bg-rose-50/40">
          <h2 className="font-black text-rose-700 tracking-wide mb-2">DANGER ZONE</h2>
          <p className="text-sm text-slate-500 mb-4">Delete your account and all data permanently.</p>
          <button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl text-xs font-black tracking-[0.12em]" onClick={deleteAccount}>
            DELETE ACCOUNT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
