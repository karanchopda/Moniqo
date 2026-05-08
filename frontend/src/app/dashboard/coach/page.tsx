"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface Message {
  role: 'user' | 'coach';
  content: string;
}

export default function MentorChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'coach', content: 'Welcome to your financial sanctuary. I am your private AI mentor. What aspect of your capital allocation would you like to review today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await api.post('/chat/coach', { message: userMessage });
      setMessages(prev => [...prev, { role: 'coach', content: res.data.reply }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'coach', content: 'Protocol interrupted. Please check your network connection and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[80vh] flex flex-col bg-white border border-primary/5 rounded-[3rem] shadow-3xl overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="bg-primary/5 px-10 py-8 border-b border-primary/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-[0_5px_15px_rgba(63,197,128,0.3)]">
            <span className="material-symbols-outlined text-primary text-xl">psychology</span>
          </div>
          <div>
            <h2 className="text-xl font-headline font-black text-primary tracking-tighter">Private Sentinel</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Secure Uplink Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-10 space-y-8 relative z-10 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] p-6 rounded-[2rem] 
                ${msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-none shadow-xl'
                  : 'bg-primary/5 border border-primary/5 text-primary rounded-bl-none shadow-sm'
                }`}
              >
                <p className={`text-sm leading-relaxed ${msg.role === 'user' ? 'font-medium' : 'font-medium'}`}>
                  {msg.content}
                </p>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-primary/5 border border-primary/5 p-6 rounded-[2rem] rounded-bl-none shadow-sm flex items-center gap-3">
                <Loader2 className="animate-spin text-accent" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">Synthesizing Intel...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white border-t border-primary/5 relative z-10">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Interrogate your financial data..."
            className="w-full bg-primary/5 border border-transparent rounded-[2rem] py-6 pl-8 pr-20 text-sm text-primary placeholder-primary/30 focus:bg-white focus:border-accent outline-none transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white hover:bg-accent hover:text-primary transition-all disabled:opacity-50 disabled:hover:bg-primary disabled:hover:text-white"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
          </button>
        </form>
      </div>
    </div>
  );
}