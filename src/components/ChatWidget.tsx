import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  text: string;
  isBot: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([
    { text: "Hi there! I'm your ProxyDiamond AI assistant. How can I help you with your proxy needs today?", isBot: true }
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    setChat(prev => [...prev, { text: userMessage, isBot: false }]);
    setMessage('');
    setIsLoading(true);

    try {
      // Prepare history for multi-turn chat
      const history = chat.map(m => ({
        role: m.isBot ? 'model' : 'user' as 'model' | 'user',
        parts: [{ text: m.text }]
      }));

      const session = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "You are the ProxyDiamond Live Support Agent. You provide quick, helpful, and technical support for proxy infrastructure. You are friendly but efficient. If a user asks a complex question, provide a detailed but concise answer. Always maintain a professional tone.",
        },
        history: history
      });

      const result = await session.sendMessage({ message: userMessage });
      setChat(prev => [...prev, { 
        text: result.text || "I'm sorry, I couldn't process that request.", 
        isBot: true 
      }]);
    } catch (error) {
      console.error("Gemini Chat Error:", error);
      setChat(prev => [...prev, { 
        text: "I'm experiencing some technical difficulties. Please try again or contact support@proxydiamond.com.", 
        isBot: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold">AI Support</div>
                  <div className="text-cyan-100 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Gemini 3 Flash
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
            >
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.isBot ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700' : 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'}`}>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/50 text-slate-400 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    AI is typing...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950">
              <div className="relative">
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={!message.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-500 hover:text-cyan-400 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center text-slate-950 shadow-xl hover:scale-110 transition-transform active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
