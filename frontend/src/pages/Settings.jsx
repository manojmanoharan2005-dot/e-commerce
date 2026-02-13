import UserSidebar from '../components/UserSidebar';
import { Settings as SettingsIcon, Hammer, Construction, Sparkles, ShieldCheck, Cpu } from 'lucide-react';

const Settings = () => {
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
                                        <SettingsIcon className="w-5 h-5 text-accent" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">System Configuration</span>
                                </div>
                                <h1 className="text-3xl lg:text-4xl font-black text-primary italic tracking-tighter leading-none mb-2">Account <span className="text-accent">Settings</span></h1>
                                <p className="text-slate-400 text-xs font-medium tracking-wide">Configure your preferences and system-wide security protocols.</p>
                            </div>
                            <Cpu className="w-48 h-48 absolute -bottom-10 -right-10 text-slate-50 group-hover:scale-110 transition-transform opacity-50" />
                        </div>

                        {/* Maintenance Block */}
                        <div className="bg-white p-12 lg:p-20 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden flex flex-col items-center text-center">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent"></div>

                            <div className="relative mb-10">
                                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center relative z-10">
                                    <Hammer className="w-10 h-10 text-slate-300 animate-bounce" />
                                </div>
                                <Construction className="w-12 h-12 text-accent/20 absolute -top-4 -right-4 animate-pulse" />
                                <div className="absolute -inset-4 bg-accent/5 rounded-full blur-2xl"></div>
                            </div>

                            <div className="space-y-4 max-w-lg relative z-10">
                                <h2 className="text-2xl font-black text-primary italic tracking-tight uppercase">System Calibration in Progress</h2>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    Our engineers are currently updating the core system modules to provide you with enhanced security and personalized optimization tools.
                                </p>
                            </div>

                            <div className="mt-12 flex items-center gap-6 px-8 py-4 bg-slate-50 rounded-2xl border border-slate-100 relative z-10">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Engineers" className="w-full h-full object-cover grayscale" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                    4 Engineers <br />
                                    <span className="text-accent">Live Updating</span>
                                </p>
                            </div>

                            <Sparkles className="absolute bottom-10 right-10 w-32 h-32 text-slate-50 opacity-50" />
                        </div>

                        {/* Security Notice */}
                        <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-primary uppercase tracking-wider mb-0.5">Automated Protection Active</h4>
                                <p className="text-[10px] text-slate-500 font-medium tracking-wide">Your session is protected by end-to-end encryption protocols during this maintenance window.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
