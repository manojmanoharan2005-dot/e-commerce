import { useState } from 'react';
import { Bot, Send, X, MessageCircle } from 'lucide-react';
import api from '../utils/api';

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userText = message.trim();
    setMessage('');
    setLoading(true);

    const userMessage = { role: 'user', parts: [{ text: userText }] };
    const newHistory = [...history, userMessage];
    setHistory(newHistory);

    try {
      const { data } = await api.post('/ai/chat', {
        history,
        message: userText
      });

      setHistory(prev => [...prev, { role: 'model', parts: [{ text: data.response }] }]);
    } catch {
      setHistory(prev => [...prev, {
        role: 'model',
        parts: [{ text: 'I am currently unavailable. Please try again shortly.' }]
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[calc(80px+env(safe-area-inset-bottom,0px))] sm:bottom-6 right-4 sm:right-6 z-40 bg-agri-forest text-white rounded-full p-3.5 sm:p-4 shadow-xl hover:scale-105 transition flex items-center justify-center min-h-[44px] min-w-[44px] border-2 border-white/20"
        title="AgriSmart AI Assistant"
        aria-label="Open AI Assistant"
      >
        <MessageCircle size={22} />
      </button>

      {open && (
        <div className="fixed bottom-[calc(88px+env(safe-area-inset-bottom,0px))] sm:bottom-6 right-4 sm:right-6 z-50 w-[360px] max-w-[92vw] h-[500px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col animate-slide-up">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-agri-forest text-white rounded-t-2xl">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <div>
                <p className="font-semibold text-sm">AgriSmart AI</p>
                <p className="text-xs text-emerald-200">Field Assistant Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/10 rounded">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
            {history.length === 0 && (
              <div className="text-xs sm:text-sm text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                Namaste! Ask about crop nutrition, fertilizer dosage, pest control, or product selection.
              </div>
            )}
            {history.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs sm:text-sm whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-agri-forest text-white rounded-br-sm'
                    : 'bg-white border text-slate-800 rounded-bl-sm'
                }`}>
                  {msg.parts?.[0]?.text}
                </div>
              </div>
            ))}
            {loading && <p className="text-xs text-slate-500">AgriSmart AI is thinking...</p>}
          </div>

          <div className="p-3 border-t bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask your farming question..."
                className="input-field text-xs sm:text-sm"
              />
              <button onClick={sendMessage} className="btn-accent px-3 text-xs">
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
