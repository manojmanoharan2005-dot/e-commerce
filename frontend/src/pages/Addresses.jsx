import { MapPin, Plus, Trash2, Edit2, CheckCircle, Loader, X, Home as HomeIcon, Briefcase } from 'lucide-react';
import UserSidebar from '../components/UserSidebar';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import { indiaData } from '../utils/indiaData';

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
        <div className="min-h-screen bg-[#f1f3f6] py-8">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="lg:w-72 flex-shrink-0">
                        <UserSidebar />
                    </div>

                    <div className="flex-1 bg-white rounded-sm shadow-sm">
                        <div className="p-6 border-b border-gray-100">
                            <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Manage Addresses</h1>
                        </div>

                        <div className="p-6">
                            {!showForm ? (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="w-full flex items-center gap-2 text-[#2874f0] font-black border border-gray-100 p-4 rounded-sm hover:shadow-md transition-all uppercase text-sm mb-6"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add a New Address
                                </button>
                            ) : (
                                <div className="bg-[#f5faff] p-8 rounded border border-[#2874f0]/10 mb-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-[#2874f0] font-black uppercase text-sm">
                                            {editingId ? 'Edit Address' : 'Add New Address'}
                                        </h2>
                                        <button onClick={() => { setShowForm(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                placeholder="Name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#2874f0] text-sm"
                                            />
                                            <input
                                                type="text"
                                                name="phone"
                                                required
                                                placeholder="10-digit mobile number"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#2874f0] text-sm"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="pincode"
                                                required
                                                placeholder="Pincode"
                                                value={formData.pincode}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#2874f0] text-sm"
                                            />
                                            <input
                                                type="text"
                                                name="locality"
                                                required
                                                placeholder="Locality"
                                                value={formData.locality}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#2874f0] text-sm"
                                            />
                                        </div>

                                        <textarea
                                            name="address"
                                            required
                                            rows="4"
                                            placeholder="Address (Area and Street)"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#2874f0] text-sm resize-none"
                                        ></textarea>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <select
                                                name="state"
                                                required
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#2874f0] text-sm bg-white"
                                            >
                                                <option value="">Select State</option>
                                                {Object.keys(indiaData).map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>

                                            <select
                                                name="city"
                                                required
                                                disabled={!formData.state}
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#2874f0] text-sm bg-white disabled:bg-gray-50 disabled:text-gray-400"
                                            >
                                                <option value="">Select District</option>
                                                {formData.state && indiaData[formData.state].map(district => (
                                                    <option key={district} value={district}>{district}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                name="landmark"
                                                placeholder="Landmark (Optional)"
                                                value={formData.landmark}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#2874f0] text-sm"
                                            />
                                            <input
                                                type="text"
                                                name="alternatePhone"
                                                placeholder="Alternate Phone (Optional)"
                                                value={formData.alternatePhone}
                                                onChange={handleInputChange}
                                                className="w-full border border-gray-200 p-3 rounded-sm focus:outline-none focus:border-[#2874f0] text-sm"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-sm font-bold text-gray-500 mb-3 uppercase">Address Type</p>
                                            <div className="flex items-center gap-6">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        value="Home"
                                                        checked={formData.type === 'Home'}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-[#2874f0]"
                                                    />
                                                    <span className="text-sm font-bold">Home</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="type"
                                                        value="Work"
                                                        checked={formData.type === 'Work'}
                                                        onChange={handleInputChange}
                                                        className="w-4 h-4 text-[#2874f0]"
                                                    />
                                                    <span className="text-sm font-bold">Work</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pt-4">
                                            <button
                                                type="submit"
                                                className="bg-[#2874f0] text-white px-10 py-3 rounded-sm font-black uppercase text-sm shadow-md hover:shadow-lg transition-all"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setShowForm(false); resetForm(); }}
                                                className="text-[#2874f0] font-black uppercase text-sm hover:underline"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <Loader className="w-10 h-10 text-[#2874f0] animate-spin" />
                                </div>
                            ) : (
                                <div className="space-y-0">
                                    {addresses.map((addr) => (
                                        <div key={addr._id} className="border border-gray-100 p-6 hover:bg-gray-50 transition-all group border-t-0 first:border-t">
                                            <div className="flex items-start justify-between">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="bg-gray-100 text-gray-500 text-[10px] font-black uppercase px-2 py-0.5 rounded-sm flex items-center gap-1">
                                                            {addr.type === 'Home' ? <HomeIcon className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
                                                            {addr.type}
                                                        </span>
                                                        {addr.isDefault && (
                                                            <span className="flex items-center gap-1 text-[#388e3c] text-[10px] font-black uppercase bg-green-50 px-2 py-0.5 rounded-sm">
                                                                <CheckCircle className="w-3 h-3 fill-current" />
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <p className="font-black text-gray-900">{addr.name}</p>
                                                        <p className="font-black text-gray-900">{addr.phone}</p>
                                                    </div>
                                                    <p className="text-gray-800 text-sm leading-relaxed max-w-2xl">
                                                        {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <span className="font-black">{addr.pincode}</span>
                                                    </p>

                                                    {!addr.isDefault && (
                                                        <button
                                                            onClick={() => handleSetDefault(addr._id)}
                                                            className="text-[#2874f0] text-xs font-black uppercase hover:underline pt-2"
                                                        >
                                                            Set as Default
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="relative group/menu">
                                                    <button className="p-2 hover:bg-white rounded-full transition-colors">
                                                        <Plus className="w-5 h-5 text-gray-400 rotate-45" />
                                                    </button>
                                                    <div className="absolute top-0 right-10 bg-white shadow-xl rounded border border-gray-100 py-1 opacity-0 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto transition-all flex items-center min-w-max">
                                                        <button
                                                            onClick={() => handleEdit(addr)}
                                                            className="px-4 py-2 text-xs font-black text-gray-600 hover:text-[#2874f0] uppercase"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(addr._id)}
                                                            className="px-4 py-2 text-xs font-black text-gray-600 hover:text-red-500 border-l border-gray-100 uppercase"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {addresses.length === 0 && !showForm && (
                                        <div className="text-center py-20 bg-gray-50/50 rounded-sm">
                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                <MapPin className="w-10 h-10 text-gray-200" />
                                            </div>
                                            <h3 className="text-lg font-black text-gray-400 uppercase tracking-wider">No Addresses Saved</h3>
                                            <p className="text-gray-500 text-sm mt-1">Please add an address to help us deliver your fertilizers faster.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Addresses;
