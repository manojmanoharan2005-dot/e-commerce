import { useState, useEffect } from 'react';
import { ShoppingBag, X } from 'lucide-react';

const NotificationTicker = () => {
    const [notification, setNotification] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const locations = ['Ludhiana', 'Amritsar', 'Patiala', 'Jalandhar', 'Bathinda', 'Hoshiarpur', 'Mohali', 'Pathankot'];
    const products = ['Urea Fertilizer', 'DAP 50kg Bag', 'Organic Vermicompost', 'NPK 19-19-19', 'Tomato Hybrid Seeds', 'Rice Seeds (PR 126)'];

    useEffect(() => {
        const showRandomNotification = () => {
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            const randomProduct = products[Math.floor(Math.random() * products.length)];

            setNotification({
                location: randomLocation,
                product: randomProduct,
                time: 'just now'
            });
            setIsVisible(true);

            // Hide after 5 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 5000);
        };

        // Show first one after 10 seconds
        const initialDelay = setTimeout(showRandomNotification, 10000);

        // Repeat every 30-45 seconds
        const interval = setInterval(() => {
            showRandomNotification();
        }, Math.random() * 15000 + 30000);

        return () => {
            clearTimeout(initialDelay);
            clearInterval(interval);
        };
    }, []);

    if (!notification) return null;

    return (
        <div className={`fixed bottom-6 left-6 z-[9999] transition-all duration-500 transform ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
            <div className="bg-white rounded-lg shadow-2xl border border-green-100 p-4 flex items-center gap-4 min-w-[300px] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#2e7d32]"></div>

                <div className="bg-green-50 p-2 rounded-full">
                    <ShoppingBag className="w-5 h-5 text-[#2e7d32]" />
                </div>

                <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Recent Activity</p>
                    <p className="text-xs text-gray-800">
                        Someone from <span className="font-black text-[#2e7d32]">{notification.location}</span>
                    </p>
                    <p className="text-[11px] font-medium text-gray-600">
                        purchased <span className="font-bold">{notification.product}</span>
                    </p>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="ml-auto p-1 hover:bg-gray-100 rounded-full text-gray-400"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Progress bar for timer */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-green-100 w-full">
                    <div className="h-full bg-[#2e7d32]/30 animate-shrink" style={{ animationDuration: '5s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default NotificationTicker;
