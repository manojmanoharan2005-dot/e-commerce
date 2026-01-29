import UserSidebar from '../components/UserSidebar';

const Settings = () => {
    return (
        <div className="min-h-screen bg-[#f1f3f6] py-4">
            <div className="container mx-auto px-4 lg:max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-4 items-start">
                    <div className="lg:w-72 shrink-0">
                        <UserSidebar />
                    </div>
                    <div className="flex-1 w-full bg-white shadow-sm rounded-sm p-8">
                        <h1 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-8">Account Settings</h1>
                        <p className="text-gray-500 font-medium h-64 flex items-center justify-center italic">Settings module is currently under maintenance. Please check back later.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
