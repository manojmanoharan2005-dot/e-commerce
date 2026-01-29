import React, { useState } from 'react';
import UserSidebar from '../components/UserSidebar';
import { useAuth } from '../context/AuthContext';
import { Loader } from 'lucide-react';
import api from '../utils/api';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [editPersonal, setEditPersonal] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [editMobile, setEditMobile] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    React.useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const handleSave = async (section) => {
        try {
            setLoading(true);
            const response = await api.put('/auth/profile', formData);

            if (response.data.success) {
                updateUser(response.data.data);
                if (section === 'personal') setEditPersonal(false);
                if (section === 'email') setEditEmail(false);
                if (section === 'mobile') setEditMobile(false);
            }
        } catch (error) {
            console.error('Update profile error:', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] py-4">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-4 items-start">

                    {/* Left Side: Account Sidebar */}
                    <div className="lg:w-72 shrink-0 w-full">
                        <UserSidebar />
                    </div>

                    {/* Right Side: Profile Details */}
                    <div className="flex-1 w-full bg-white shadow-sm rounded-sm p-8 pb-20">

                        {/* Personal Information */}
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-6 mb-8 mt-4">
                                <h2 className="text-lg font-black text-gray-900 leading-none">Personal Information</h2>
                                <button
                                    onClick={() => setEditPersonal(!editPersonal)}
                                    className="text-[#2874f0] text-sm font-black hover:underline uppercase transition-all"
                                >
                                    {editPersonal ? 'Cancel' : 'Edit'}
                                </button>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className={`flex flex-col gap-2 flex-1 ${editPersonal ? 'border-[#2874f0]' : 'bg-gray-50 border-gray-100'} border p-3 rounded-sm`}>
                                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={!editPersonal}
                                        className="bg-transparent text-sm font-black text-gray-900 outline-none px-1"
                                    />
                                </div>
                                <div className="flex flex-col gap-2 flex-1 md:invisible"></div>
                            </div>

                            {editPersonal && (
                                <button
                                    onClick={() => handleSave('personal')}
                                    disabled={loading}
                                    className="bg-[#2874f0] text-white px-12 py-3 rounded-sm font-black uppercase text-sm shadow-md mb-8 flex items-center gap-2"
                                >
                                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save'}
                                </button>
                            )}

                            {/* Gender Section */}
                            <div className="mb-14">
                                <p className="text-sm font-black text-gray-900 mb-4 uppercase tracking-tighter">Your Gender</p>
                                <div className="flex gap-8">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="gender" defaultChecked className="w-4 h-4 text-[#2874f0]" disabled={!editPersonal} />
                                        <span className="text-sm font-medium text-gray-700">Male</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="radio" name="gender" className="w-4 h-4 text-[#2874f0]" disabled={!editPersonal} />
                                        <span className="text-sm font-medium text-gray-700">Female</span>
                                    </label>
                                </div>
                            </div>

                            {/* Email Address Section */}
                            <div className="mb-14">
                                <div className="flex items-center gap-6 mb-6">
                                    <h2 className="text-lg font-black text-gray-900 leading-none">Email Address</h2>
                                    <button
                                        onClick={() => setEditEmail(!editEmail)}
                                        className="text-[#2874f0] text-sm font-black hover:underline uppercase"
                                    >
                                        {editEmail ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className={`flex flex-col gap-2 max-w-sm ${editEmail ? 'border-[#2874f0]' : 'bg-gray-50 border-gray-100'} border p-3 rounded-sm`}>
                                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-1">Email ID</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            disabled={!editEmail}
                                            className="bg-transparent text-sm font-black text-gray-900 outline-none px-1"
                                        />
                                    </div>
                                    {editEmail && (
                                        <button
                                            onClick={() => handleSave('email')}
                                            disabled={loading}
                                            className="bg-[#2874f0] text-white px-12 py-3 rounded-sm font-black uppercase text-sm shadow-md w-fit flex items-center gap-2"
                                        >
                                            {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Mobile Number Section */}
                            <div className="mb-14">
                                <div className="flex items-center gap-6 mb-6">
                                    <h2 className="text-lg font-black text-gray-900 leading-none">Mobile Number</h2>
                                    <button
                                        onClick={() => setEditMobile(!editMobile)}
                                        className="text-[#2874f0] text-sm font-black hover:underline uppercase"
                                    >
                                        {editMobile ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <div className={`flex flex-col gap-2 max-w-sm ${editMobile ? 'border-[#2874f0]' : 'bg-gray-50 border-gray-100'} border p-3 rounded-sm`}>
                                        <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            disabled={!editMobile}
                                            className="bg-transparent text-sm font-black text-gray-900 outline-none px-1"
                                        />
                                    </div>
                                    {editMobile && (
                                        <button
                                            onClick={() => handleSave('mobile')}
                                            disabled={loading}
                                            className="bg-[#2874f0] text-white px-12 py-3 rounded-sm font-black uppercase text-sm shadow-md w-fit flex items-center gap-2"
                                        >
                                            {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* FAQ Section Placeholder */}
                            <div className="mt-20 border-t border-gray-100 pt-10">
                                <h3 className="text-base font-black text-gray-900 mb-6 uppercase tracking-tight">FAQS</h3>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm font-black text-gray-900 mb-1">What happens when I update my email address (or mobile number)?</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">Your login email id (or mobile number) changes, likewise. You'll receive all your future order communications and security-related updates on your new email id (or mobile number).</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 mb-1">When will my FertilizerMart account be updated with the new email address (or mobile number)?</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">It happens as soon as you confirm the verification code sent to your new email (or mobile) and save the changes.</p>
                                    </div>
                                </div>
                            </div>

                            <button className="mt-12 text-sm font-black text-red-500 uppercase hover:underline tracking-widest">
                                Deactivate Account
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
