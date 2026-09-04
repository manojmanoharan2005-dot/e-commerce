import { useEffect, useState } from 'react';
import UserSidebar from '../components/UserSidebar';
import Toast from '../components/Toast';
import api from '../utils/api';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

const emptyForm = { name: '', phone: '', pincode: '', locality: '', address: '', city: '', state: '', type: 'Home' };
const ADDRESSES_CACHE_KEY = 'agristore_addresses_cache_v1';

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/addresses');
      const next = data.addresses || [];
      setAddresses(next);
      localStorage.setItem(ADDRESSES_CACHE_KEY, JSON.stringify(next));
    } catch (err) {
      console.error('Failed to load addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const cached = localStorage.getItem(ADDRESSES_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setAddresses(parsed);
          setLoading(false);
        }
      }
    } catch {
      // Fallback to network
    }
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/addresses/${editId}`, form);
        setToastMessage('Address updated successfully');
      } else {
        await api.post('/addresses', form);
        setToastMessage('Address added successfully');
      }
      setForm(emptyForm);
      setEditId('');
      load();
    } catch (err) {
      setToastMessage(err.response?.data?.message || 'Could not save address');
    }
  };

  const edit = (addr) => {
    setEditId(addr._id);
    setForm({
      name: addr.name,
      phone: addr.phone,
      pincode: addr.pincode,
      locality: addr.locality,
      address: addr.address,
      city: addr.city,
      state: addr.state,
      type: addr.type || 'Home'
    });
  };

  return (
    <div className="page-container py-8 space-y-8">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4">
          <UserSidebar />
        </div>

        <div className="lg:col-span-8 space-y-6">
          {/* Header Card */}
          <div className="card p-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Addresses</h1>
              <p className="text-xs text-slate-500 font-medium">Manage shipping locations for fast checkout</p>
            </div>
            {editId && (
              <button
                onClick={() => {
                  setEditId('');
                  setForm(emptyForm);
                }}
                className="text-xs font-bold text-slate-500 hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* Form Card */}
          <div className="card p-6 sm:p-8 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
              {editId ? 'Edit Address' : 'Add New Shipping Address'}
            </h3>

            <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3 text-xs">
              <input
                className="input-field"
                placeholder="Full Name *"
                value={form.name}
                onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
                required
              />
              <input
                className="input-field"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))}
                required
              />
              <input
                className="input-field"
                placeholder="Pincode *"
                value={form.pincode}
                onChange={(e) => setForm((v) => ({ ...v, pincode: e.target.value }))}
                required
              />
              <input
                className="input-field"
                placeholder="Locality / Landmark *"
                value={form.locality}
                onChange={(e) => setForm((v) => ({ ...v, locality: e.target.value }))}
                required
              />
              <input
                className="input-field sm:col-span-2"
                placeholder="Street Address *"
                value={form.address}
                onChange={(e) => setForm((v) => ({ ...v, address: e.target.value }))}
                required
              />
              <input
                className="input-field"
                placeholder="City / District *"
                value={form.city}
                onChange={(e) => setForm((v) => ({ ...v, city: e.target.value }))}
                required
              />
              <input
                className="input-field"
                placeholder="State *"
                value={form.state}
                onChange={(e) => setForm((v) => ({ ...v, state: e.target.value }))}
                required
              />

              <button type="submit" className="btn-accent sm:col-span-2 text-xs py-3 mt-2">
                {editId ? 'Update Address' : 'Save Address'}
              </button>
            </form>
          </div>

          {/* List of Addresses */}
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div key={addr._id} className="card p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">{addr.name}</span>
                      <span className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded">
                        {addr.type || 'Home'}
                      </span>
                      {addr.isDefault && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 font-medium">
                      {addr.locality}, {addr.address}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                    </p>
                    <p className="text-slate-500 font-bold">Phone: {addr.phone}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => edit(addr)}
                      className="p-2 text-slate-500 hover:text-agri-forest hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        await api.delete(`/addresses/${addr._id}`);
                        setToastMessage('Address deleted');
                        load();
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {!addr.isDefault && (
                  <button
                    onClick={async () => {
                      await api.patch(`/addresses/${addr._id}/default`);
                      setToastMessage('Set as default address');
                      load();
                    }}
                    className="text-[11px] font-bold text-agri-green hover:underline"
                  >
                    Set as Default Address
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addresses;
