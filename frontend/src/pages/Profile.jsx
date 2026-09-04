import { useEffect, useState } from 'react';
import UserSidebar from '../components/UserSidebar';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import api from '../utils/api';
import { Edit2, X, Check, User, Mail, Phone } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (user && !isEditing) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user, isEditing]);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/auth/profile', form);
      updateUser(data.user);
      setIsEditing(false);
      setToastMessage('Profile updated successfully!');
    } catch (err) {
      setToastMessage(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container py-8 space-y-8">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <UserSidebar />
        </div>

        <div className="lg:col-span-8 card p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Personal Details</h1>
              <p className="text-xs text-slate-500 font-medium">Manage your personal information</p>
            </div>
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Edit2 size={14} /> Edit Profile
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <X size={14} /> Cancel
              </button>
            )}
          </div>

          <form onSubmit={save} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <input
                    className={`input-field pl-10 ${!isEditing ? 'bg-slate-50 text-slate-600' : ''}`}
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <input
                    className={`input-field pl-10 ${!isEditing ? 'bg-slate-50 text-slate-600' : ''}`}
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <input
                    className={`input-field pl-10 ${!isEditing ? 'bg-slate-50 text-slate-600' : ''}`}
                    placeholder="Mobile Number"
                    value={form.phone}
                    onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {isEditing && (
              <button
                type="submit"
                disabled={loading}
                className="btn-accent text-xs py-3 px-6 w-full sm:w-auto flex items-center justify-center gap-2 mt-4"
              >
                <Check size={16} />
                {loading ? 'Saving Changes...' : 'Save Profile'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
