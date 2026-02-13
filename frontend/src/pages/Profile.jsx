import React, { useState } from 'react';
import UserSidebar from '../components/UserSidebar';
import { useAuth } from '../context/AuthContext';
import { Loader, User as UserIcon, Mail, Phone, Shield, Sparkles, AlertCircle, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const ProfileField = ({ label, formData, setFormData, isEditing, setEditSection, field, icon: Icon, type = "text", editable = true, handleSave, loading }) => {
    return (
        <div className={`p-8 rounded-[2rem] border transition-all duration-300 ${isEditing ? 'bg-white border-accent shadow-2xl shadow-accent/5 ring-1 ring-accent/20' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isEditing ? 'bg-accent/10 text-accent' : 'bg-slate-50 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{label}</span>
                </div>
                {editable && (
                    <button
                        type="button"
                        onClick={() => setEditSection(isEditing ? null : field)}
                        className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${isEditing ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-primary/5 text-primary hover:bg-primary hover:text-white'}`}
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </button>
                )}
            </div>

            <div className="relative">
                <input
                    type={type}
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    disabled={!isEditing}
                    className={`w-full bg-transparent text-xl font-black italic tracking-tight outline-none ${isEditing ? 'text-primary cursor-text' : 'text-slate-400 cursor-not-allowed'}`}
                />
                {isEditing && (
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={() => handleSave(field)}
                            disabled={loading}
                            className="bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-all"
                        >
                            {loading ? <Loader className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const Profile = () => {
    const { user, updateUser, logout } = useAuth();
    const [editSection, setEditSection] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone || ''
    });

    React.useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                username: user.username || '',
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
                setEditSection(null);
            }
        } catch (error) {
            console.error('Update profile error:', error);
            alert(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.')) {
            try {
                setLoading(true);
                const response = await api.delete('/auth/account');
                if (response.data.success) {
                    alert('Your account has been successfully deleted.');
                    logout();
                }
            } catch (error) {
                console.error('Delete account error:', error);
                alert(error.response?.data?.message || 'Failed to delete account');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-8">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    <div className="lg:w-80 shrink-0 w-full">
                        <UserSidebar />
                    </div>

                    <div className="flex-1 w-full space-y-8">
                        {/* Hero Welcome Card */}
                        <div className="bg-primary rounded-[3rem] p-10 lg:p-14 text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                        <Sparkles className="w-6 h-6 text-accent fill-accent" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Your Profile</span>
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-black italic tracking-tighter mb-4 leading-none">Profile <span className="text-white/50">&</span> Security</h1>
                                <p className="text-white/60 font-medium max-w-lg leading-relaxed">Manage your personal information and account settings for AgriStore.</p>
                            </div>
                            <Shield className="w-80 h-80 absolute -bottom-20 -right-20 text-white/5 rotate-12" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ProfileField
                                label="Full Name"
                                field="name"
                                icon={UserIcon}
                                formData={formData}
                                setFormData={setFormData}
                                isEditing={editSection === 'name'}
                                setEditSection={setEditSection}
                                handleSave={handleSave}
                                loading={loading}
                            />

                            <ProfileField
                                label="Email Address"
                                field="email"
                                icon={Mail}
                                type="email"
                                formData={formData}
                                setFormData={setFormData}
                                isEditing={editSection === 'email'}
                                setEditSection={setEditSection}
                                handleSave={handleSave}
                                loading={loading}
                            />
                            <ProfileField
                                label="Phone Number"
                                field="phone"
                                icon={Phone}
                                type="tel"
                                formData={formData}
                                setFormData={setFormData}
                                isEditing={editSection === 'phone'}
                                setEditSection={setEditSection}
                                handleSave={handleSave}
                                loading={loading}
                            />

                        </div>

                        <div className="flex justify-center pt-10">
                            <button
                                onClick={handleDeleteAccount}
                                disabled={loading}
                                className="text-[10px] font-black text-rose-400 uppercase tracking-[0.3em] hover:text-rose-600 transition-colors flex items-center gap-2 group disabled:opacity-50"
                            >
                                <AlertCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                {loading ? 'Processing...' : 'Delete My Account'}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
