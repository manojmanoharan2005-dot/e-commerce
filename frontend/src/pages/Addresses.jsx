import { MapPin, Plus, Trash2, Edit2, CheckCircle, Loader, X, Home as HomeIcon, Briefcase, Sparkles, Navigation, Phone, ShieldCheck } from 'lucide-react';
import UserSidebar from '../components/UserSidebar';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { indiaData } from '../utils/indiaData';

const FormInput = ({ label, name, type = "text", required = false, placeholder, value, onChange, icon: Icon }) => (
    <div className="space-y-1.5 flex-1">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>
        <div className="relative group">
            {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-accent transition-colors" />}
            <input
                type={type}
                name={name}
                required={required}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:border-accent/30 focus:bg-white focus:ring-4 focus:ring-accent/5 transition-all text-sm font-bold placeholder:text-slate-300 ${Icon ? 'pl-11' : ''}`}
            />
        </div>
    </div>
);

const Addresses = () => {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        landmark: '',
        alternatePhone: '',
        type: 'Home'
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/addresses');
            setAddresses(response.data.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'state') {
            setFormData({ ...formData, state: value, city: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/addresses/${editingId}`, formData);
            } else {
                await api.post('/addresses', formData);
            }
            setShowForm(false);
            setEditingId(null);
            resetForm();
            fetchAddresses();
        } catch (error) {
            console.error('Error saving address:', error);
            alert(error.response?.data?.message || 'Failed to save address');
        }
    };

    const handleEdit = (addr) => {
        setFormData({
            name: addr.name,
            phone: addr.phone,
            pincode: addr.pincode,
            locality: addr.locality,
            address: addr.address,
            city: addr.city,
            state: addr.state,
            landmark: addr.landmark || '',
            alternatePhone: addr.alternatePhone || '',
            type: addr.type
        });
        setEditingId(addr._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                await api.delete(`/addresses/${id}`);
                fetchAddresses();
            } catch (error) {
                console.error('Error deleting address:', error);
            }
        }
    };

    const handleSetDefault = async (id) => {
        try {
            await api.patch(`/addresses/${id}/default`);
            fetchAddresses();
        } catch (error) {
            console.error('Error setting default address:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            pincode: '',
            locality: '',
            address: '',
            city: '',
            state: '',
            landmark: '',
            alternatePhone: '',
            type: 'Home'
        });
        setEditingId(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-8">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-80 flex-shrink-0">
                        <UserSidebar />
                    </div>

                    <div className="flex-1 space-y-8">
                        {/* Header Section */}
                        <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20">
                                        <MapPin className="w-5 h-5 text-accent" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Settings</span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-black text-primary italic tracking-tighter leading-none mb-2">Saved <span className="text-accent">Addresses</span></h1>
                                <p className="text-slate-400 text-xs font-medium tracking-wide">Manage your delivery locations for faster checkout.</p>
                            </div>
                            <Sparkles className="w-48 h-48 absolute -bottom-10 -right-10 text-slate-50 group-hover:scale-110 transition-transform opacity-50" />
                        </div>

                        {!showForm ? (
                            <button
                                onClick={() => setShowForm(true)}
                                className="w-full group py-8 rounded-[2rem] bg-white border border-dashed border-slate-200 hover:border-accent hover:bg-accent/5 transition-all flex flex-col items-center justify-center gap-3"
                            >
                                <div className="w-12 h-12 bg-slate-50 group-hover:bg-accent group-hover:text-white rounded-2xl flex items-center justify-center transition-all">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-accent">Add New Address</span>
                            </button>
                        ) : (
                            <div className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                                <Edit2 className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-black text-primary italic tracking-tight">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enter delivery details below</p>
                                            </div>
                                        </div>
                                        <button onClick={() => { setShowForm(false); resetForm(); }} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <FormInput label="Full Name" name="name" required placeholder="Receiver's name" value={formData.name} onChange={handleInputChange} />
                                            <FormInput label="Phone Number" name="phone" required placeholder="10-digit mobile number" value={formData.phone} onChange={handleInputChange} icon={Phone} />
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            <FormInput label="Pincode" name="pincode" required placeholder="6-digit Pincode" value={formData.pincode} onChange={handleInputChange} />
                                            <FormInput label="Locality" name="locality" required placeholder="Area or Road name" value={formData.locality} onChange={handleInputChange} icon={Navigation} />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Address (House No, Building, Street, Area)</label>
                                            <textarea
                                                name="address"
                                                required
                                                rows="3"
                                                placeholder="Complete coordinates (Area, Street, House/Office)"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:border-accent/30 focus:bg-white focus:ring-4 focus:ring-accent/5 transition-all text-sm font-bold placeholder:text-slate-300 resize-none"
                                            ></textarea>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-1 space-y-1.5">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">State</label>
                                                <select
                                                    name="state"
                                                    required
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:border-accent/30 focus:bg-white focus:ring-4 focus:ring-accent/5 transition-all text-sm font-bold appearance-none cursor-pointer"
                                                >
                                                    <option value="">Select State</option>
                                                    {Object.keys(indiaData).map(state => (
                                                        <option key={state} value={state}>{state}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex-1 space-y-1.5">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">City / District</label>
                                                <select
                                                    name="city"
                                                    required
                                                    disabled={!formData.state}
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:outline-none focus:border-accent/30 focus:bg-white focus:ring-4 focus:ring-accent/5 transition-all text-sm font-bold appearance-none cursor-pointer disabled:opacity-50 disabled:bg-slate-100"
                                                >
                                                    <option value="">Select City / District</option>
                                                    {formData.state && indiaData[formData.state].map(district => (
                                                        <option key={district} value={district}>{district}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-6">
                                            <FormInput label="Landmark" name="landmark" placeholder="Near by place (Optional)" value={formData.landmark} onChange={handleInputChange} />
                                            <FormInput label="Alternate Phone" name="alternatePhone" placeholder="Backup number (Optional)" value={formData.alternatePhone} onChange={handleInputChange} />
                                        </div>

                                        <div className="p-6 bg-slate-50 rounded-2xl">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Address Type</p>
                                            <div className="flex gap-4">
                                                {['Home', 'Work'].map((type) => (
                                                    <label key={type} className="flex-1 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="type"
                                                            value={type}
                                                            checked={formData.type === type}
                                                            onChange={handleInputChange}
                                                            className="sr-only"
                                                        />
                                                        <div className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all ${formData.type === type ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}>
                                                            {type === 'Home' ? <HomeIcon className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                                                            <span className="text-xs font-black uppercase tracking-widest">{type}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6 pt-6">
                                            <button
                                                type="submit"
                                                className="bg-primary text-white px-12 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
                                            >
                                                Save Address
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setShowForm(false); resetForm(); }}
                                                className="text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-rose-500 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="bg-white p-32 flex flex-col items-center justify-center rounded-[3rem] border border-slate-100 shadow-xl">
                                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6"></div>
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Loading Addresses...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {addresses.map((addr) => (
                                    <div key={addr._id} className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-accent/20 transition-all group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(addr)}
                                                    className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                                    title="Edit Address"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(addr._id)}
                                                    className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                    title="Delete Address"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                                            <div className="space-y-6 flex-1">
                                                <div className="flex flex-wrap items-center gap-4">
                                                    <div className="flex items-center gap-2 bg-slate-50 text-slate-500 text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border border-slate-100">
                                                        {addr.type === 'Home' ? <HomeIcon className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                                                        <span>{addr.type}</span>
                                                    </div>
                                                    {addr.isDefault && (
                                                        <div className="flex items-center gap-2 text-emerald-500 text-[9px] font-black uppercase bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                                            <CheckCircle className="w-3.5 h-3.5 fill-current" />
                                                            <span>Default Address</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-2xl font-black text-primary italic tracking-tight">{addr.name}</h3>
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                                                        <p className="text-slate-400 font-black text-sm tracking-widest">{addr.phone}</p>
                                                    </div>
                                                    <p className="text-slate-500 text-sm leading-relaxed font-medium max-w-2xl">
                                                        {addr.address}, {addr.locality}, {addr.city}, <br />
                                                        <span className="text-primary font-black uppercase text-sm tracking-wider">{addr.state}</span> - <span className="text-accent font-black">{addr.pincode}</span>
                                                    </p>
                                                </div>

                                                {!addr.isDefault && (
                                                    <button
                                                        onClick={() => handleSetDefault(addr._id)}
                                                        className="group/btn flex items-center gap-3 bg-slate-50 hover:bg-emerald-500 text-slate-400 hover:text-white px-6 py-2.5 rounded-xl border border-slate-100 hover:border-emerald-500 transition-all shadow-sm"
                                                    >
                                                        <ShieldCheck className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Make Default</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {addresses.length === 0 && !showForm && (
                                    <div className="bg-white p-20 lg:p-32 text-center rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden relative group">
                                        <div className="z-10 relative">
                                            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500">
                                                <MapPin className="w-10 h-10 text-slate-200" />
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter mb-2 uppercase">No Saved Addresses</h3>
                                            <p className="text-slate-400 text-sm font-medium mb-10 italic">Please add a delivery address to enable checkout.</p>
                                            <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                                                Add Your First Address
                                            </button>
                                        </div>
                                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 text-slate-50 opacity-50 select-none pointer-events-none" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Addresses;
