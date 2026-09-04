import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';
import Toast from '../components/Toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Lock, ShieldAlert, KeyRound, Check } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [passwordForm, setPasswordForm] = useState({ otp: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [error, setError] = useState('');

  const requestOtp = async () => {
    setError('');
    setOtpVerified(false);
    try {
      setLoading(true);
      const { data } = await api.post('/auth/request-password-otp');
      setOtpRequested(true);
      const info = data.devOtp ? `${data.message} (Dev OTP: ${data.devOtp})` : data.message;
      setToastMessage(info || 'OTP sent to your registered email');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not request OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setError('');
    if (!/^\d{6}$/.test(passwordForm.otp)) {
      setError('Please enter a valid 6-digit OTP code');
      return;
    }
    try {
      setLoading(true);
      const { data } = await api.post('/auth/verify-password-otp', { otp: passwordForm.otp });
      setOtpVerified(true);
      setToastMessage(data.message || 'OTP verified successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setError('');

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
      setToastMessage(data.message || 'Password updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm('Are you sure you want to permanently delete your account and data?')) return;
    try {
      await api.delete('/auth/account');
      logout();
      navigate('/register');
    } catch (err) {
      setToastMessage('Account deletion failed');
    }
  };

  return (
    <div className="page-container py-8 space-y-8">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <UserSidebar />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="card p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <KeyRound size={22} className="text-agri-green" />
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Security & Password</h1>
                <p className="text-xs text-slate-500 font-medium">Reset your password via OTP verification</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                {error}
              </div>
            )}

            {!otpRequested ? (
              <button
                type="button"
                onClick={requestOtp}
                disabled={loading}
                className="btn-accent text-xs py-3 px-6"
              >
                {loading ? 'Requesting OTP...' : 'Send Password Reset OTP'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-3 items-end">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      6-Digit OTP Code
                    </label>
                    <input
                      className="input-field font-mono"
                      placeholder="123456"
                      value={passwordForm.otp}
                      disabled={otpVerified || loading}
                      onChange={(e) => setPasswordForm((v) => ({ ...v, otp: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                    />
                  </div>

                  {!otpVerified && (
                    <button
                      type="button"
                      onClick={verifyOtp}
                      disabled={loading || passwordForm.otp.length < 6}
                      className="btn-primary text-xs py-3 h-[46px]"
                    >
                      {loading ? 'Verifying...' : 'Verify OTP'}
                    </button>
                  )}
                </div>

                {otpVerified && (
                  <form onSubmit={updatePassword} className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="space-y-1">
                      <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="input-field"
                        placeholder="At least 8 chars + 1 number"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((v) => ({ ...v, newPassword: e.target.value }))}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || passwordForm.newPassword.length < 8}
                      className="btn-accent text-xs py-3 w-full sm:w-auto px-8"
                    >
                      {loading ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="card p-6 border-rose-200 bg-rose-50/50 space-y-3">
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm">
              <ShieldAlert size={18} /> Danger Zone
            </div>
            <p className="text-xs text-slate-600">
              Permanently remove your profile, saved addresses, orders history, and wishlist.
            </p>
            <button
              onClick={deleteAccount}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
