import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader, Sparkles } from 'lucide-react';
import api from '../utils/api';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { role: 'model', parts: [{ text: "Hello! I'm AgriSmart AI, your personal agricultural advisor. How can I help you today? You can ask me about soil health, crop suitability, or fertilizer dosages." }] }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [chatHistory, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = message;
        setMessage('');

        // Add user message to history
        const newHistory = [...chatHistory, { role: 'user', parts: [{ text: userMessage }] }];
        setChatHistory(newHistory);
        setIsLoading(true);

        try {
            const response = await api.post('/ai/chat', {
                message: userMessage,
                history: chatHistory
            });

            if (response.data.success) {
                setChatHistory([...newHistory, { role: 'model', parts: [{ text: response.data.data }] }]);
            }
        } catch (error) {
            console.error('AI Chat Error:', error);
            setChatHistory([...newHistory, { role: 'model', parts: [{ text: "I'm sorry, I'm having some trouble connecting to my knowledge base. Please try again in a moment." }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-white w-[380px] h-[520px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 mb-4 transition-all animate-in slide-in-from-bottom-4">
                    {/* Header */}
                    <div className="bg-[#2e7d32] p-4 text-white flex items-center justify-between shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">AgriSmart AI</h3>
                                <p className="text-[10px] text-green-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                    Field Assistant Online
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                        {chatHistory.map((item, index) => (
                            <div
                                key={index}
                                className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex gap-2 max-w-[85%] ${item.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${item.role === 'user' ? 'bg-[#fb641b]' : 'bg-[#2e7d32]'}`}>
                                        {item.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm shadow-sm ${item.role === 'user'
                                        ? 'bg-white text-gray-800 rounded-tr-none border border-orange-100'
                                        : 'bg-white text-gray-800 rounded-tl-none border border-green-50'
                                        }`}>
                                        {item.parts[0].text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-[#2e7d32] flex items-center justify-center shrink-0 shadow-sm">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-[#2e7d32] rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-[#2e7d32] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-[#2e7d32] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Ask about fertilizer, crops..."
                            className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2e7d32] outline-none transition-all"
                        />
                        <button
                            type="submit"
                            disabled={!message.trim() || isLoading}
                            className="bg-[#2e7d32] text-white p-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:grayscale"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            )}

            {/* Pulsing Toggle Button */}
            <div className="relative group">
                <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-[#2e7d32] text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-xl">
                    Need Agriculture Advice? 🌿
                    <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-[#2e7d32]"></div>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all ${isOpen ? 'bg-red-500 hover:bg-red-600 scale-90' : 'bg-[#2e7d32] hover:bg-[#256629] hover:scale-110'
                        }`}
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <div className="relative">
                            <MessageSquare className="w-6 h-6 text-white" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AIAssistant;
